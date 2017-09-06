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
  }
  var opponent={
    name:"",
    gameName:"",
    move:"",
  }
  var currentConnections = 0;
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
  var connectionsRef = database.ref("/connections"); 
  var connectedRef = database.ref(".info/connected");
  var rps = database.ref("/rps");
  var gameStart = database.ref("/tt/gameStart"); 
  var player1 = database.ref("/tt/player1");
  var player2 = database.ref("/tt/player2");
  var chat = database.ref("/tt/chat");  
  var opponentPointer = null;
  var playerPointer = null;  
// *************** game start *********
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
  });
  // if opponent has left, reset the db opponent and reset local opponent values, turn off buttons
  connectionsRef.on("child_removed", function(){
    database.ref("/tt/"+opponent.gameName).remove();
    $("#opponentName").html("waiting for opponent");
    $("#messageBoard").html(opponent.name + " has left the game. Waiting for new opponent");
    opponent.name = "";
    opponent.score = 0;
  })

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
// *************** Player Name submission *********** 
  $("#playerForm").on("submit", function(){
    // update local player name, playScreen, check if local player is player 1 or player 2 and push to firebase
    event.preventDefault();
    player.name = this.elements.playerNameInput.value;
    $("#playerName").html(player.name);

    // if there is no player1 in the db, 
    // then local player's game name is player1, and set opponent pointer to player2 and wait for an opponent
    // else local player is player2, set opponent pointer to player1 and start game
    database.ref("/rps/player1").once("value", function (snapshot){
        if (snapshot.numChildren()==0){
          player.gameName = "player1";
          opponent.gameName = "player2";        
          opponentPointer = database.ref("/tt/player2");
          playerPointer = database.ref("/tt/player1");
          chat.set({chat:"Welcome to Tottaly Trivia"});  
          opponentPointer.once("value", function(snapshot){
            if (snapshot.hasChildren()){
                opponent.name = snapshot.val().playerName;
                $("#opponentName").html(opponent.name);
                opponentPointer.update({score:""});
                gameStart.set({gameStart:true});
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
          opponentPointer = database.ref("/tt/player1");
          playerPointer = database.ref("/tt/player2");
          gameStart.set({gameStart:true});  
          $("#chatInput").attr("placeholder", "lay the smack on " + opponent.name);  
        }

    })
    // update player information in db
    database.ref("/tt/"+ player.gameName).set({
        playerName:player.name,
        score:0,
        wins:0,
    });
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
          $("#chatInput").attr("placeholder", "lay the smack on " + opponent.name); 
        }        
        opponent.wins = snapshot.val().wins;
        opponent.score = snapshot.val().score;
        checkScores();
    }
  });
  player2.on("value", function(snapshot){
    if (opponent.gameName == "player2"){
        // if opponent name has not been assigned
        if (opponent.name ==""){    
            opponent.name = snapshot.val().playerName;
          $("#opponentName").html(opponent.name);
          $("#chatInput").attr("placeholder", "lay the smack on " + opponent.name);  
        }
        opponent.wins = snapshot.val().wins;
        opponent.score = snapshot.val().score;        
        checkScores();
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
    if (this.elements.chatInput.value != ""){
      var chatInput = "<div>" + player.name + ": " + this.elements.chatInput.value + "</div>";

      chat.once("value", function(snapshot){
          var pre = snapshot.val().chat;
          console.log("pre: " + pre);
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
  function checkScores(){
      // if you both have made a move, then evaluate
      // else waiting for move
      if (player.ready && opponent.ready){
        evaluate();
      }
      else if (player.ready && opponent.ready == false){
        toggleButtons(false);       
        displayPickedIcon(player.gameName, player.move);        
        $("#messageBoard").html("waiting for "+ opponent.name +" to make finish");
        $("#waitingIcon").css("display", "block");
      }  
      else if (player.ready == false && opponent.ready){
        $("#messageBoard").html(opponent.name +" is waiting for you to make your finish");
        $("#waitingIcon").css("display", "block");        
      }  
  }  
  function evaluate(){
    // evaluate, display message, enable board and update both player's move to "";
    // evaluate, change relational operator button and set timer to 3 seconds and clear board
    var aWinner=winner();

    $("#messageBoard").html(aWinner +"Game resets in 3 seconds");
    player.ready = false;   
    opponent.ready = false;
    $("#wins").html(player.wins);
    $("#losses").html(opponent.wins);
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
      },3000);
  }

  
}); //document ready
