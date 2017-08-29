// JavaScript function that wraps everything
$(document).ready(function() {

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
      const maxQuestions=10; 
      const maxPossibleAnswers=4;
      const timeBetweenQuestions = 1000;
      const maxTime = 15;
      var currentGame=0; 
      var timerOff = false;var currentTimer;
      var currentTimer;      

// ********* on click events ********************//

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
      });      
      $("#gameSelectForm").submit(function(events){
        event.preventDefault();  
        setGameType(this);
        callAPI();
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

// ********** functions **************** //

      function setGameType(obj){
        currentCategory = obj.childNodes[3].value;
        currentCategoryDifficulty =  obj.childNodes[9].value;

        htmlCall="https://opentdb.com/api.php?amount=10&category=" + 
                      obj.childNodes[3].value + 
                      "&difficulty=" +
                      obj.childNodes[9].value + "&type=multiple";
      }
      function callAPI(){
      // download questions and possilble answers from API then fill in Question
        $.ajax({
          url: htmlCall,
          method: "GET"
        }).done(function(response) {
          if (!response.response_code){  // if there were no errors from the call then setup game
            resetResultsTabs();
            $("#triviaWindow").fadeToggle(true);
            $("#gameSelect").fadeToggle(false);
            resetVars();          
            createTriviaArray(response);
            getAQuestion();
          }
          else{  //no questions found, disable category for future selections
            alert(" no questions found for that category. Please try again");
            disabledCategories.push([$("#catSelect").val(),$("#catDifficulty").val()]);
          }
        });
      }
      function createTriviaArray(obj){
      // for all objects returned by ajax, create trivia object and push into global trivia array for future use
        for (var i = 0; i < obj.results.length; i++) {
          var trivia = {
            question: obj.results[i].question,
            correct_answer: obj.results[i].correct_answer,
            incorrect_answers : obj.results[i].incorrect_answers,
            correctIndex : Math.round(Math.random()*3),
            player_result:"",

            getTriviaAnswers : function(){
              var i=0;
              var triviaAnswers = [];
              for (var j = 0; j <= this.incorrect_answers.length; j++) {
                if (j === this.correctIndex)
                  triviaAnswers.push(this.correct_answer);
                else {
                  triviaAnswers.push(this.incorrect_answers[i++])
                }
              };
              return triviaAnswers; 
            }, //getTriviaAnswers() //
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
          var triviaAnswers = triviaArray[currentTriviaIndex].getTriviaAnswers()
          for (var i = 0; i < triviaAnswers.length; i++) {
            $("#" + i).html(triviaAnswers[i]);
            $("#" + i).attr("value", i);
          }
          timerOn();
        }
        else {
          $("#triviaWindowScore").html("Score: " + scoreRight);           
          setTimeout(gameOver, timeBetweenQuestions);
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
        $("#winPercent").text("Win Percentage:"+  percentage + "%");                
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
});