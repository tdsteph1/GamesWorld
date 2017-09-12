// JavaScript function that wraps everything
$(document).ready(function() {

//********** vars ****************************
      var htmlCall = ""; //the general query call to the api
      var triviaArray = []; //array holds trivia objects
      var gameStarted = false; // game starts when strike button is hit and pauses when choosing new opponent
      // var gameLost = false; // only triggers when player loses
      // var newGame = true; // only updates when reset button hit
      var scoreRight = 0;
      var currentCategory=0;
      var disabledCategories = [[29,"easy"]];
      var currentTriviaIndex = 0;      
      var allTimeQuestionsPlayed = 0;
      var allTimeScoreRight = 0;
      const maxQuestions=5; 
      const maxPossibleAnswers=4;
      const timeBetweenQuestions = 1000;
      const maxTime = 15;
      var currentGame=0; 
      var timerOff = false;var currentTimer;
      var currentTimer;      
//********* db vars *************************
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
        wins:0,
        ready:false,
      }
      var currentConnections = 0;                        
// ********* Initialize Firebase *************
  var config = {
    apiKey: "AIzaSyBB23QESbNrXQRw6FbimCzI6BfXAkPYVKo",
    authDomain: "gamesworld-d56f1.firebaseapp.com",
    databaseURL: "https://gamesworld-d56f1.firebaseio.com",
    projectId: "gamesworld-d56f1",
    storageBucket: "gamesworld-d56f1.appspot.com",
    messagingSenderId: "411556798841"
  };
  firebase.initializeApp(config);
  var database = firebase.database();
// ********* db shortcuts ********************
  var connectionsRef = database.ref("/connections/tp"); 
  var connectedRef = database.ref(".info/connected");
  var tp = database.ref("/tp");
  var gameStart = database.ref("/tp/gameStart"); 
  var player1 = database.ref("/tp/player1");
  var player2 = database.ref("/tp/player2");
  var chat = database.ref("/tp/chat");  
  var opponentPointer = null;
  var playerPointer = null;
  var playerWhoStartsGame = database.ref("/tp/playerWhoStartsGame");
  var gameInfo = database.ref("/tp/gameInfo");
// ********* game start **********************
  if (!player.name){
    $('#editPlayerName').modal('toggle');  // prompt screen to enter name if none
  }
  gameStart.set({
    gameStart:false
  }); 
  $("#loginBtn").toggle(true);
  $("#waitingIcon").toggle(false);
  $("#newGameBtn").toggle(false);
//********** game on click events ************
      // onclick event for answer radio element
      $(".answerField").on("click", function(){
          isGameStarted();
          evaluateGuess(this);
          $("#triviaWindowClock").text("00:15");
          clearInterval(currentTimer);

      });

      $("#infoBtn").on("click", function(){
           $("#info").fadeToggle();
      });
      $("#infoWindowCloseBtn").on("click", function(){
           $("#info").fadeToggle();
      });

      $("#triviaWindowCloseBtn").on("click", function(){
           // $("#triviaWindow").toggle(false);
      });
      $("#newGameBtn").on("click", function(){
        $("#gameSelect").fadeToggle(true);
        //reset the selection pulldowns from the gametype Window
        $("#catSelect").val('-1'); 
        $("#catDifficulty").val('-1'); 
        $(this).toggle(false);           
      });      
      $("#gameSelectForm").submit(function(events){
        event.preventDefault();  
        setGameType(this);
        checkAPI();
      });
      $("#catSelect").on("change", function(){
         disableAnyErrantDifficultiesForSelection(this);
         if ($("#catDifficulty").val() != null ){
          $("#submitBtn").prop("disabled",false)
         }
      });
      $("#catDifficulty").on("change", function(){
         if ($("#catSelect").val()!= null  ){
          $("#submitBtn").prop("disabled",false)
         }
      });
 
      $("#selectGameTypeBtn").on("click", function(){
        $("#gameSelect").fadeToggle(false);
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
// ********* firebase on events **************
  //**************** listen for call to get API ********
    gameInfo.on("value", function(snapshot){
      if (snapshot.val()!= null){
        playerWhoStartsGame.once("value", function(snapshot){
          if (player.gameName != snapshot.val().player){  //only do this for opponent
            // $("#triviaWindow").toggle(true);
            $("#waitingIcon").toggle(false);
            initGame();
          }
        });
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
                        $("#welcomeTitle").html("Trivia Planet: " + player.name + " vs. "+ opponent.name);
                        opponentPointer.update({score:""});
                        gameStart.set({gameStart:true});
                        $("#chatInput").attr("placeholder", "lay the smack on " + opponent.name);
                        $("#messageBoard").html(opponent.name + " is ready to go!");
                    } else {
                        $("#messageBoard").html(player.name + ", your opponent has not logged in yet");
                        playerWhoStartsGame.set({player:player.gameName}); // first player to log in makes choice of category                       
                        $("#waitingIcon").html("<i class='fa fa-cog fa-spin fa-fw'></i>waiting for opponent to log in");
                        $("#waitingIcon").toggle(true);
                    }  
                  })             
                 
                } else {
                  player.gameName = "player2";
                  opponent.gameName = "player1";
                  opponent.name = snapshot.val().playerName;
                  $("#welcomeTitle").html("Trivia Planet: " + player.name + " vs. "+ opponent.name);          
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
            $("#loginBtn").toggle();
      } else {
            swal({
              title: "Login Error",
              text: "Too many players on Trivia Planet! Try again later.",
              icon: "error",
            });      
            $("#messageBoard").html("Too many players in the room.  Try again later")
            $("#loginBtn").toggle();          
      }
          $('#editPlayerName').modal('toggle');
    });
  //**************** sign-in and check current connections *********
    connectedRef.on("value", function(snap) {
        if (snap.val()) {
          var con = connectionsRef.push(true);
          con.onDisconnect().remove();
        }
    });

    connectionsRef.on("value", function(snap) { // When first loaded or when the connections list changes
      currentConnections = snap.numChildren();
      // if you first player (your name hasn't been set) and you are the only one in the game, clear the board
      if (currentConnections==1 && player.name==""){
        tp.remove();
      }
      if (currentConnections > 2){
        swal({
          title: "Login Error",
          text: "Too many players on Trivia Planet! Try again later.",
          icon: "error",
        });       
        $("#messageBoard").html("Too many players on Planet RPS. Try again Later.");
        $('#editPlayerName').modal('toggle');
      }    
    });
    // if opponent has left, reset the db opponent and reset local opponent values, turn off butpons
    connectionsRef.on("child_removed", function(snapshot){
      database.ref("/tp/"+opponent.gameName).remove();
      $("#messageBoard").html(opponent.name + " has left the game. Waiting for new opponent");
      $("#waitingIcon").html("<i class='fa fa-cog fa-spin fa-fw'></i> waiting for new opponent");
      opponent.name = "";
      opponent.score = 0;
      playerWhoStartsGame.set({player:player.gameName});
      gameInfo.remove();
    })      
  //**************** edit Player Name *******************
    $(".fa-pencil").on("click", function(){
      $('#editPlayerName').modal('show');
    })
  // *************** listen for opponent updates ********
    player1.on("value", function(snapshot){
      if (snapshot.val()!=null){
          if (opponent.gameName == "player1"){
              // if opponent name has not been assigned
              if (opponent.name ==""){    
                  opponent.name = snapshot.val().playerName;
                $("#opponentName").html(opponent.name);
                $("#chatInput").attr("placeholder", "lay the smack on " + opponent.name);
                $("#welcomeTitle").html("Trivia Planet: " + player.name + " vs. "+ opponent.name);           
              }        
              opponent.wins = snapshot.val().wins;
              opponent.score = snapshot.val().score;
              opponent.ready = snapshot.val().ready; 

              if (opponent.ready){     
                evaluateWinner();
              }
          }
          
      }
    });
    player2.on("value", function(snapshot){
      if (snapshot.val()!=null){
          if (opponent.gameName == "player2"){
              // if opponent name has not been assigned
              if (opponent.name ==""){    
                  opponent.name = snapshot.val().playerName;
                $("#chatInput").attr("placeholder", "lay the smack on " + opponent.name);
                $("#welcomeTitle").html("Trivia Planet: " + player.name + " vs. "+ opponent.name);            
              }
              opponent.wins = snapshot.val().wins;
              opponent.score = snapshot.val().score;
              opponent.ready = snapshot.val().ready;        

              if (opponent.ready){ 
                evaluateWinner();
                
              }
          }   
      } 
    });  
  // *************** listen for game start *************
    // if game started, then enable play buttons
    gameStart.on("value", function(snapshot){
      if (snapshot.hasChildren())
        if (snapshot.val().gameStart == true){
          playerWhoStartsGame.once("value", function(snapshot){
            if (snapshot.val().player == player.gameName){
              $("#gameSelect").toggle(true);
              $("#waitingIcon").toggle(false);
              $("#messageBoard").html("You get to Pick the Trivia category");            
            } else {
              $("#waitingIcon").html("<i class='fa fa-cog fa-spin fa-fw'></i>waiting for " + opponent.name +" to choose category");
              $("#waitingIcon").toggle(true);
            }
          });       
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
      if (snapshot.val() != null){
          $("#chatBox").html(snapshot.val().chat);
          var height = document.getElementById("chatBox").scrollHeight;
          $("#chatBox").scrollTop(height);
        }
    });  
  //**************** edit Player Name *******************
    $("#loginBtn").on("click", function(){
      $('#editPlayerName').modal('show');
    })
// ********* functions ********************
      function setGameType(obj){
        currentCategory = obj.childNodes[3].value;
        currentCategoryDifficulty =  obj.childNodes[9].value;

        htmlCall="https://opentdb.com/api.php?amount=10&category=" + 
                      obj.childNodes[3].value + 
                      "&difficulty=" +
                      obj.childNodes[9].value + "&type=multiple";
      }
      function checkAPI(){
        $.ajax({
          url: htmlCall,
          method: "GET"
        }).done(function(response) {
          if (!response.response_code){  // if there were no errors from the call then setup game
                    // gameInfo.set({htmlCall:htmlCall});
                    createTriviaArray(response); //  questions and answers are now in global var triviaArray
                    //push triviaArray into db and clear triviaArray to be downloaded by this player
                    var trivia = JSON.stringify(triviaArray);
                    gameInfo.set({trivia:trivia});
                    $("#gameSelect").fadeToggle(false);                    
                    initGame();                    
          }
          else{  //no questions found, disable category for future selections
            swal(" no questions found for that category. Please try again");
            disabledCategories.push([$("#catSelect").val(),$("#catDifficulty").val()]);
          }
        });                    
      }
      function initGame(){
          // download questions and possilble answers from API then fill in Question
            resetResultsTabs();
            $("#triviaWindow").fadeToggle(true);
            $("#waitingIcon").fadeToggle(false);
            resetVars();          
            gameInfo.once("value", function(snapshot){
              if (snapshot.val().trivia !== null)
                triviaArray = JSON.parse(snapshot.val().trivia);
            });
            getAQuestion();
      }
      function createTriviaArray(obj){
        triviaArray = [];
        // for all objects returned by ajax, create trivia object and push into global trivia array for future use
        for (var i = 0; i < obj.results.length; i++) {
          var trivia = {
            question: obj.results[i].question,
            correct_answer: obj.results[i].correct_answer,
            incorrect_answers : obj.results[i].incorrect_answers,
            correctIndex : Math.round(Math.random()*3),
            player_result:"",
          } // trivia object //
          triviaArray.push(trivia);
        } // for //
      }
      function getAQuestion(){
        // get a question and possible answers from current trivia array index and update main screen
        if (currentTriviaIndex < maxQuestions){         
          unMarkCorrectAnswer(); //unmark from any previous question
          $("#triviaWindowScore").html("Score: " + scoreRight); 
          $("#triviaWindowStatus").html(currentTriviaIndex+1 + " out of " + maxQuestions + " questions played.");

          $("#question").html(triviaArray[currentTriviaIndex].question);
          var triviaAnswers = getTriviaAnswers(triviaArray[currentTriviaIndex]);
          for (var i = 0; i < triviaAnswers.length; i++) {
            $("#" + i).html(triviaAnswers[i]);
            $("#" + i).attr("value", i);
          }
          // timerOn();
        }
        else {  // all questions asked
          $("#triviaWindowScore").html("Score: " + scoreRight);
          player.ready = true;
          playerPointer.update({ready:true, score:scoreRight});  //trigger opponent that local player done
          setTimeout(gameOver, timeBetweenQuestions);

          
          $("#messageBoard").html("Waiting for " + opponent.name + " to finish trivia");
          // $("#waitingIcon").html("<i class='fa fa-cog fa-spin fa-fw'></i>");
          // $("#waitingIcon").toggle();
          swapCategoryChooser();          
          evaluateWinner();                          
        }
      }
      function evaluateGuess(guess){
        // evaulate guess compared to correct answer then update stats and status
        var playerAnswer = $(guess).attr("value");
        allTimeQuestionsPlayed++;
        var correctAnswerIndex = triviaArray[currentTriviaIndex].correctIndex;
        if (playerAnswer == correctAnswerIndex){
          scoreRight++;
          allTimeScoreRight++
          triviaArray[currentTriviaIndex].player_result = "correct";
          $("#correct")[0].play();
        }
        else{
          triviaArray[currentTriviaIndex].player_result = "incorrect";  
          $("#incorrect")[0].play();       
        }

        markCorrectAnswer();
        updateMainStatsWindow();
        currentTriviaIndex++;
        setTimeout(getAQuestion, timeBetweenQuestions);
      }
      function markCorrectAnswer(){
        for (var i = 0; i < maxPossibleAnswers; i++) {
          if (i != triviaArray[currentTriviaIndex].correctIndex)
            $("#"+i).css("opacity", .2);
        }
      }
      function unMarkCorrectAnswer(){
        for (var i = 0; i < maxPossibleAnswers; i++) {
            $("#"+i).css("opacity", 1);
        }
      }  
      function gameOver(){
        // game is done. push the category and difficulty to disabled array so no selection for future choice
        // reset selection pulldown for next game, reset the timer
        disabledCategories.push([$("#catSelect").val(),$("#catDifficulty").val()]);         
        $("#triviaWindow").fadeToggle(false);
        $("#catSelect").val('-1'); 
        $("#catDifficulty").val('-1');
        $("#triviaWindowClock").text("00:15");
        clearInterval(currentTimer);
      }
      function updateStats(){
        $("#scoreRight").html("Correct:" + scoreRight);
        $("#scoreWrong").html("Incorrect:" + maxQuestions -scoreRight);
        $("#winPercent").html("Winning Percentage:" + Math.round(scoreRight/maxQuestions)); 
      }
      function updateMainStatsWindow(){
        var playerResultImage;
        var results;
        var wrong = allTimeQuestionsPlayed - allTimeScoreRight;
        var percentage = Math.round(allTimeScoreRight/allTimeQuestionsPlayed*100);

        if (triviaArray[currentTriviaIndex].player_result == "correct")
          playerResultImage = "<img src='assets/images/totallytrivia/correct.png' class='d-inline resultsIcon'/>"
        else
          playerResultImage = "<img src='assets/images/totallytrivia/wrong.png' class='d-inline resultsIcon'/>"

        results = "<p>" + (currentTriviaIndex+1) + ": " +
                   "<i>" + triviaArray[currentTriviaIndex].question + "</i> " + 
                   "<strong>" + triviaArray[currentTriviaIndex].correct_answer + "</strong> " +
                   playerResultImage + "</p>";             

        var gameTitle = "#Game" + currentGame + "d";
        $(gameTitle).append(results);
        $("#allTimeScoreRight").text("Correct:" + allTimeScoreRight);
        $("#allTimeWrong").text("Incorrect:"+ wrong); 
        $("#winPercent").text("Overall Percentage:"+  percentage + "%");                
      }
      function isGameStarted(){
        // if new game hasn't started yet, create a new tab for questions and answers on the main page
        // create a new menu link and new tab content div to hold those Q&A then start game
        if (!gameStarted){
          gameStarted = true;

          currentGame ++;
          var gameTitle = "Game" + currentGame;
          var aID = gameTitle + "a";
          var lID = gameTitle + "l";
          var dID = gameTitle + "d";          

          var newA = $("<a>");

          newA.attr("data-toggle", "tab");
          newA.attr("href",  "#"+ dID);
          newA.text(gameTitle);
          newA.attr("id", aID);
          newA.attr("class", "nav-link");
          // newA.attr("aria-expanded", "true");

          var newLi = $("<li class='nav-item active'>");
          newLi.attr("id", lID);          
          // newLi.attr("aria-expanded", "false");

          newLi.appendTo("#resultTabs").append(newA);

          var newDiv = $("<div id='" + gameTitle + "d' class='tab-pane fade in active'>");
          // newDiv.attr("aria-expanded", "true");
          newDiv.attr("id", dID);          
          $("#resultContent").append(newDiv);            
        }
      }
      function resetResultsTabs(){
        for (var currentGameCounter = 1; currentGameCounter <= currentGame; currentGameCounter++) {
          var gameTitle = "#Game" + currentGameCounter;
          var aID = gameTitle + "a";
          var lID = gameTitle + "l";
          var dID = gameTitle + "d";
          // $(aID).attr("class", "nav-link");
          // $(aID).attr("aria-expanded", "false"); 
          $(lID).attr("class", "");
          $(dID).attr("class", "tab-pane fade in");
          // $(dID).attr("aria-expanded", "false");                    
        }
      } 
      function resetVars(){
        triviaArray.splice(0, triviaArray.length);
        gameStarted = false;
        scoreRight = 0;
        currentTriviaIndex = 0; 
      }
      function disableAnyErrantDifficultiesForSelection(obj){
        for (var i = 0; i < disabledCategories.length; i++) {
          // if there are any difficulty choice that previously brought up no questions for this category, disable it else enable all of them
          if ($("#catSelect").val() == disabledCategories[i][0]){
              var disabledDiff = "#diff" + disabledCategories[i][1];
              $(disabledDiff).prop('disabled', true);
          }
          else{
            $("#diffany").prop('disabled', false);
            $("#diffeasy").prop('disabled', false);
            $("#diffmedium").prop('disabled', false);
            $("#diffhard").prop('disabled', false);                        
          }
        }
      }
      function timerOn(){
        var i = maxTime;
        currentTimer=setInterval(function(){ updateTimer(i--) }, 1000)  
      }
      function updateTimer(i){
        // time ran out, clear timer and evaluate a wrong answer to trigger "wrong" response
        if (i<=0){
            clearInterval(currentTimer);
            $("#triviaWindowClock").text("00:15");
            evaluateGuess(-1);
            $("#incorrect")[0].play();                        
        }   
        if (i<10)
          $("#triviaWindowClock").text("00:0" + i);
        else
          $("#triviaWindowClock").text("00:" + i);
      }
      function getTriviaAnswers (obj){  //returns all the possible trivia answers from the global triviaArray
        var i=0;
        var triviaAnswers = [];
        for (var j = 0; j <= obj.incorrect_answers.length; j++) {
          if (j === obj.correctIndex)
            triviaAnswers.push(obj.correct_answer);
          else {
            triviaAnswers.push(obj.incorrect_answers[i++])
          }
        };
        return triviaAnswers; 
      }
      function evaluateWinner(){
        if (player.ready && opponent.ready){  
            var playerScore = 0;
            var opponentScore = 0;
            playerPointer.once("value", function(snapshot){
                playerScore = snapshot.val().score;
            });
            opponentPointer.once("value", function(snapshot){
                opponentScore = snapshot.val().score;
            });

            // locally, the player is done so player is ready for next game and just waiting for opponent
            // but player's status on db should still be set for true until end of game.
            player.ready = false;  
            opponent.ready = false; 
            // playerPointer.update({ready:false, score:0});

            if (playerScore > opponentScore){
              $("#messageBoard").html("You win this round!! " + playerScore + " - " + opponentScore);
              player.wins ++;
              playerPointer.update({wins:player.wins});                           
            }
            else if (playerScore < opponentScore){     
              $("#messageBoard").html("You lost this round!! " + playerScore + " - " + opponentScore);
              opponent.wins ++; 
            }
            else if (playerScore < opponentScore){     
              $("#messageBoard").html("You both tied this round!! " + playerScore + " - " + opponentScore);
              player.wins ++;
              opponent.wins ++;
              playerPointer.update({wins:player.wins});
            }  
            $("#wins").html(player.wins);
            $("#losses").html(opponent.wins); 
        }      
      }
      function swapCategoryChooser(){
          playerWhoStartsGame.once("value", function(snapshot){
              if (snapshot.val().player == player.gameName){
                $("#waitingIcon").html("<i class='fa fa-cog fa-spin fa-fw'></i> Waiting for " + opponent.name + " to choose next category");
                $("#waitingIcon").toggle(true);
                playerWhoStartsGame.set({player:opponent.gameName});
              } else {
                $("#waitingIcon").html("<i class='fa fa-cog fa-spin fa-fw'></i> " + opponent.name + " is waiting for you to choose next category");
                $("#newGameBtn").toggle(true);
              }
          });        
      }
});