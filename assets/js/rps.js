  $(document).ready(function() {
// *************** vars **************  
  // from the players point of view, they are the player and the other player is the opponent
  // but from the database view, they gameName is either player1 or player2
  var player={
    name:"",
    gameName:"",
    move:"",
    ready:false,
    wins:0,
    ties:0
  }
  var opponent={
    name:"",
    gameName:"",
    move:"",
    wins:0
  }
  var currentConnections = 0;
  var last5Moves = [];
// *************** Initialize Firebase *************
  var config = {
    apiKey: "AIzaSyBB23QESbNrXQRw6FbimCzI6BfXAkPYVKo",
    authDomain: "gamesworld-d56f1.firebaseapp.com",
    databaseURL: "https://gamesworld-d56f1.firebaseio.com",
    projectId: "gamesworld-d56f1",
    storageBucket: "gamesworld-d56f1.appspot.com",
    messagingSenderId: "411556798841"
  };

  firebase.initializeApp(config);
// *************** db shortcuts ****************
  var database = firebase.database();
  var connectionsRef = database.ref("/connections/rps"); 
  var connectedRef = database.ref(".info/connected");
  var rps = database.ref("/rps");
  var gameStart = database.ref("/rps/gameStart"); 
  var player1 = database.ref("/rps/player1");
  var player2 = database.ref("/rps/player2");
  var chat = database.ref("/rps/chat");  
  var opponentPointer = null;
  var playerPointer = null;  
// *************** game start *********
  toggleButtons(false);
  if (!player.name){
    $('#editPlayerName').modal('toggle');  // prompt screen to enter name if none
  }
  gameStart.set({
    gameStart:false
  });
//**************** sign-in and check current connections *********
  connectedRef.on("value", function(snap) {
      if (snap.val()) {
        var con = connectionsRef.push(true);
        con.onDisconnect().remove();
        currentConnections ++;
      }
  });
  connectionsRef.on("value", function(snap) { // When first loaded or when the connections list changes
    currentConnections = snap.numChildren();
    // if you first player (your name hasn't been set) and you are the only one in the game, clear the board
    if (currentConnections==1 && player.name==""){
      rps.remove();
    }
    if (currentConnections > 2){
      $("#messageBoard").html("Too many players on Planet RPS. Try again Later.");
      $('#editPlayerName').modal('toggle');    
    }
  });
  // if opponent has left, reset the db opponent and reset local opponent values, turn off buttons
  connectionsRef.on("child_removed", function(){
    database.ref("/rps/"+opponent.gameName).remove();
    $("#opponentName").html("waiting for opponent");
    $("#messageBoard").html(opponent.name + " has left the game. Waiting for new opponent");
    opponent.name = "";
    opponent.move = "";
    turnOffOpponentButton();    
    toggleButtons(false);
  })
// *************** mouse events ***********************
      $(document).on("mouseenter", ".playbutton", function() {
        $(this).css({border: '1 solid #f37736'}).animate({                
            borderWidth: 4
        }, 250);      
      });
      $(document).on("mouseleave", ".playbutton", function() {
       $(this).animate({   
          borderWidth: 0
        }, 250);
      });  
// *************** information Window events **********
      $("#infoBtn").on("click", function(){
           $("#info").fadeToggle();
      });
      $("#infoWindowCloseBtn").on("click", function(){
           $("#info").fadeToggle();
      });
      $(document).mouseup(function(e){
          // if the information div is open, toggle it close
          var container = $("#info");
          // if the target of the click isn't the container nor a descendant of the container
          if (!container.is(e.target) && container.has(e.target).length === 0) 
          {
              container.hide();
          }
       });    
// *************** submit local player move ***********
  $(".playbutton").on("click", function(){
    if (player.ready == false){
      player.ready = true;
        // Upload player move to the database
      player.move = $(this).attr("data-value");
      playerPointer.update({
          move: player.move
        });
      checkMoves();
    }
  });
// *************** Player Name submission *********** 
  $("#playerForm").on("submit", function(){
      event.preventDefault();    
      if (currentConnections<=2){ 
          // update local player name, playScreen, check if local player is player 1 or player 2 and push to firebase
          player.name = this.elements.playerNameInput.value;
          $("#playerName").html(player.name);

          // if there is no player1 in the db, 
          // then local player's game name is player1, and set opponent pointer to player2 and wait for an opponent
          // else local player is player2, set opponent pointer to player1 and start game
          database.ref("/rps/player1").once("value", function (snapshot){
              if (snapshot.numChildren()==0){
                player.gameName = "player1";
                opponent.gameName = "player2";        
                opponentPointer = database.ref("/rps/player2");
                playerPointer = database.ref("/rps/player1");
                chat.set({chat:"Welcome to Planetary RPS"});  
                opponentPointer.once("value", function(snapshot){
                  if (snapshot.hasChildren()){
                      opponent.name = snapshot.val().playerName;
                      $("#opponentName").html(opponent.name);
                      opponentPointer.update({move:""});
                      gameStart.set({gameStart:true});
                      $("#last5MovesLabel").text(opponent.name + "'s last 5 moves");
                      $("#chatInput").attr("placeholder", "lay the smack on " + opponent.name);
                  } else {
                      $("#opponentName").html("not logged in yet");               
                  }  
                })             
               
              } else {
                player.gameName = "player2";
                opponent.gameName = "player1";
                opponent.name = snapshot.val().playerName;
                $("#opponentName").html(opponent.name);        
                opponentPointer = database.ref("/rps/player1");
                playerPointer = database.ref("/rps/player2");
                gameStart.set({gameStart:true});  
                $("#last5MovesLabel").text(opponent.name + "'s last 5 moves");
                $("#chatInput").attr("placeholder", "lay the smack on " + opponent.name);  
              }
          })
          // update player information in db
          database.ref("/rps/"+ player.gameName).set({
              playerName:player.name,
              move:"",
              wins:0,
          });
        } else {
          swal({
            title: "Login Error",
            text: "Too many players on Trivia Planet! Try again later.",
            icon: "error",
          });
          $("#messageBoard").html("Too many players in the room.  Try again later");
        }
        $('#editPlayerName').modal('toggle');
  });
//**************** edit Player Name *******************
  $(".fa-pencil").on("click", function(){
    $('#editPlayerName').modal('show');
  })
// *************** listen for opponent updates ********
  player1.on("value", function(snapshot){
    if (opponent.gameName == "player1"){
        // if opponent name has not been assigned
        if (opponent.name ==""){    
            opponent.name = snapshot.val().playerName;
          $("#opponentName").html(opponent.name);
          last5Moves=[];
          $("#last5MovesLabel").text(opponent.name + "'s last 5 moves");
          $("#chatInput").attr("placeholder", "lay the smack on " + opponent.name); 
        }        
        opponent.wins = snapshot.val().wins;
        opponent.move = snapshot.val().move;
        checkMoves();
    }
  });
  player2.on("value", function(snapshot){
    if (opponent.gameName == "player2"){
        // if opponent name has not been assigned
        if (opponent.name ==""){    
            opponent.name = snapshot.val().playerName;
          $("#opponentName").html(opponent.name);
          last5Moves=[];
          $("#last5MovesLabel").text(opponent.name + "'s last 5 moves");
          $("#chatInput").attr("placeholder", "lay the smack on " + opponent.name);  
        }
        opponent.wins = snapshot.val().wins;
        opponent.move = snapshot.val().move;
        checkMoves();
    }    
  });  
// *************** listen for game start *************
  // if game started, then enable play buttons
  gameStart.on("value", function(snapshot){
    if (snapshot.hasChildren())
      if (snapshot.val().gameStart == true){
        toggleButtons(true);
        $("#messageBoard").html("Let's Play!!");        
      }
  })
//**************** listen for chat button ************
  $("#chatForm").on("submit", function(){  
    event.preventDefault();
    this.elements.chatInput.placeholder = "";
    if (this.elements.chatInput.value != ""){
      var chatInput = "<div>" + player.name + ": " + this.elements.chatInput.value + "</div>";

      chat.once("value", function(snapshot){
          var pre = snapshot.val().chat;
          chat.update({
            chat: pre+chatInput
          });
          $("#chatBox").html(pre+chatInput);
          $("#chatInput").val("");
      });  
    }
  });
//**************** listen for new chats **************
  chat.on("value", function(snapshot){
    $("#chatBox").html(snapshot.val().chat);
    var height = document.getElementById("chatBox").scrollHeight;
    $("#chatBox").scrollTop(height);
  });  
// *************** functions *******************
  function toggleButtons(aBoolean){
    var allPlayButtons=document.getElementsByClassName("playbutton"); 
    for (var i = 0; i < document.getElementsByClassName("playbutton").length; i++) {
      if (aBoolean)
        $(allPlayButtons[i]).css("display", "block");
      else
        $(allPlayButtons[i]).css("display", "none");
    }
  }
  function turnOffOpponentButton(){
    var allPlayButtons=document.getElementsByClassName("opponentButton"); 
    for (var i = 0; i < document.getElementsByClassName("opponentButton").length; i++) {
        $(allPlayButtons[i]).css("display", "none");
    }
  }  
  function checkMoves(){
      // if you both have made a move, then evaluate
      // else waiting for move
      if (player.move != "" && opponent.move != ""){
        toggleButtons(false);               
        displayPickedIcon(player.gameName, player.move);              
        displayPickedIcon("opponent",opponent.move);
        evaluate();
      }
      else if (player.move != "" && opponent.move == ""){
        toggleButtons(false);       
        displayPickedIcon(player.gameName, player.move);        
        $("#messageBoard").html("waiting for "+ opponent.name +" to make move");
        $("#waitingIcon").css("display", "block");
      }  
      else if (player.move == "" && opponent.move != "" && !player.ready){
        $("#messageBoard").html(opponent.name +" is waiting for you to make your move");
        $("#waitingIcon").css("display", "block");        
      }  
  }  
  function evaluate(){
    last5Moves.push(opponent.move);
    // evaluate, display message, enable board and update both player's move to "";
    // evaluate, change relational operator button and set timer to 3 seconds and clear board
    var aWinner=winner();

    $("#messageBoard").html(aWinner +"Game resets in 3 seconds");
    player.move = "";   
    opponent.move = "";
    $("#wins").html(player.wins);
    $("#losses").html(opponent.wins);
    $("#ties").html(player.ties);
    updateLast5Moves();
    playerPointer.update({
      move:"",
      wins: player.wins
    });
    $("#waitingIcon").css("display", "none"); // remove the waiting icon

    // set the countdown to game start
    setTimeout(function(){ $("#messageBoard").html(aWinner + "Game resets in 2 seconds"); }, 1000);
    setTimeout(function(){ $("#messageBoard").html(aWinner + "Game resets in 1 second"); }, 2000);        
    setTimeout(function(){
      $("#messageBoard").html("Game reset. Let's go!"); 
      player.ready = false;       
      toggleButtons(true); 
      turnOffOpponentButton();
      $("#comparer").html("[]");               
      },3000);
  }
  function displayPickedIcon(playerType,move){  //depending on player type, show icon picked on the play area
    switch(move){
      case "rock":
        if (playerType == "opponent")
          $("#opponentRockIcon").css("display", "block");
        else
          $("#playerRockIcon").css("display", "block");
        break;
      case "paper":
        if (playerType == "opponent")
          $("#opponentPaperIcon").css("display", "block");
        else
          $("#playerPaperIcon").css("display", "block");
        break;
      case "scissor":
        if (playerType == "opponent")
          $("#opponentScissorIcon").css("display", "block");
        else
          $("#playerScissorIcon").css("display", "block");
        break;
      default:
        break;
    }
  }
  function winner(){
    //depending on player and opponent's moves, update the ties, wins and losses and comparer icon on play area
    switch(player.move){
          case "rock":
            switch(opponent.move){
              case "rock":
                player.ties ++;
                $("#comparer").html("=");
                return "It's a tie. No one wins. ";
                break;
              case "paper":
                opponent.wins ++;
                $("#comparer").html("<");
                return "You lost. ";
                break; 
              default:
                player.wins ++;
                $("#comparer").html(">");
                return "You win! ";
                break; 
            }
            break;          
          case "paper":
              switch(opponent.move){
                case "paper":
                  player.ties ++;
                  $("#comparer").html("=");
                  return "It's a tie. No one wins. ";
                  break;
                case "scissor":
                  opponent.wins ++;
                  $("#comparer").html("<");
                  return "You lost. ";
                  break;  
                default:
                  player.wins ++;
                  $("#comparer").html(">");
                  return "You win! ";
                  break; 
              }
              break;      
          default:
              switch(opponent.move){
                case "scissor":
                  player.ties ++;
                  $("#comparer").html("=");
                  return "It's a tie. No one wins. ";
                  break;
                case "rock":
                  opponent.wins ++;
                  $("#comparer").html("<");
                  return "You lost. ";
                  break; 
                default:
                  player.wins ++;
                  $("#comparer").html(">");
                  return "You win! ";
                  break; 
              }
              break;
    }
  }
  function updateLast5Moves(){
    // if more than 5 elements, then remove the first element
    if (last5Moves.length >5)
      last5Moves.splice(0,1);

    // $("#last5MovesLabel").text(opponent.name + "'s last 5 moves:");
    var last5="<label>" + opponent.name + "'s last 5 moves: </label><span>";

    for (var i = 0; i < last5Moves.length; i++) {
      switch(last5Moves[i]){
        case "rock":
          last5+="<i class='fa fa-hand-rock-o'> </i>";
          break;
        case "paper":
          last5+="<i class='fa fa-hand-paper-o'> </i>";
          break;   
        default:
          last5+="<i class='fa fa-hand-scissors-o'> </i>";
          break; 
      }
    }
    last5 += "</span>";
    $("#last5Moves").html("");
    $("#last5Moves").append(last5);
  }
}); //document ready
