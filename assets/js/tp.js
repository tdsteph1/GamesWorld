  $(document).ready(function() {
// *************** vars **************  
  // from the players point of view, they are the player and the other player is the opponent
  // but from the database view, they gameName is either player1 or player2
  var player={
    name:"",
    gameName:"",
    ready:false,
    wins:0,
    score:0,
  }
  var opponent={
    name:"",
    gameName:"",
    score:0,
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
  var tp = database.ref("/tp");
  var gameStart = database.ref("/tp/gameStart"); 
  var player1 = database.ref("/tp/player1");
  var player2 = database.ref("/tp/player2");
  var chat = database.ref("/tp/chat");  
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
      tp.remove();
    }
  });
  // if opponent has left, reset the db opponent and reset local opponent values, turn off butpons
  connectionsRef.on("child_removed", function(){
    database.ref("/tp/"+opponent.gameName).remove();
    $("#opponentName").html("waiting for opponent");
    $("#messageBoard").html(opponent.name + " has left the game. Waiting for new opponent");
    opponent.name = "";
    opponent.score = 0;
  })  
// *************** Player Name submission *********** 
  $("#playerForm").on("submit", function(){
    // update local player name, playScreen, check if local player is player 1 or player 2 and push to firebase
    event.preventDefault();
    player.name = this.elements.playerNameInput.value;
    $("#playerName").html(player.name);

    // if there is no player1 in the db, 
    // then local player's game name is player1, and set opponent pointer to player2 and wait for an opponent
    // else local player is player2, set opponent pointer to player1 and start game
    database.ref("/tp/player1").once("value", function (snapshot){
        if (snapshot.numChildren()==0){
          player.gameName = "player1";
          opponent.gameName = "player2";        
          opponentPointer = database.ref("/tp/player2");
          playerPointer = database.ref("/tp/player1");
          chat.set({chat:"Welcome to Trivia Planet"});  
          opponentPointer.once("value", function(snapshot){
            if (snapshot.hasChildren()){
                opponent.name = snapshot.val().playerName;
                $("#opponentName").html(opponent.name);
                opponentPointer.update({score:""});
                gameStart.set({gameStart:true});
                $("#chatInput").attr("placeholder", "lay the smack on " + opponent.name);
                $("#messageBoard").html(opponent.name + " is ready to go!");
            } else {
                $("#messageBoard").html(player.name + ", your opponent has not logged in yet");               
            }  
          })             
         
        } else {
          player.gameName = "player2";
          opponent.gameName = "player1";
          opponent.name = snapshot.val().playerName;
          $("#messageBoard").html(opponent.name + " is ready to go!");        
          opponentPointer = database.ref("/tp/player1");
          playerPointer = database.ref("/tp/player2");
          gameStart.set({gameStart:true});  
          $("#chatInput").attr("placeholder", "lay the smack on " + opponent.name);  
        }

    })
    // update player information in db
    database.ref("/tp/"+ player.gameName).set({
        playerName:player.name,
        ready: false,
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
          $("#chatInput").attr("placeholder", "lay the smack on " + opponent.name);  
        }
        opponent.wins = snapshot.val().wins;
        opponent.score = snapshot.val().score;
        opponent.ready = snapshot.val().ready;        
        checkScores();
    }    
  });  
// *************** listen for game start *************
  // if game started, then enable play buttons
  gameStart.on("value", function(snapshot){
    if (snapshot.hasChildren())
      if (snapshot.val().gameStart == true){
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

// *************** functions *******************
  function checkScores(){
      // if you both have made a move, then evaluate
      // else waiting for move
      if (player.ready && opponent.ready){
        evaluate();
      }
      else if (player.ready && opponent.ready == false){      
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
