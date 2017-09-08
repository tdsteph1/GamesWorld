$(document).ready(function(){
  
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

  var gameWords = { marsMovies: ["RocketMan", "The Martian", "Mars Attacks", "Red Planet", "Total Recall"],
                   exploration: ["Neil Armstrong", "Discovery", "Atlantis", "Sputnik", "Apollo", "Buzz Aldrin"],
                         space: ["Eclipse", "Lunar", "Cosmic Rays", "Dark Matter", "Olympus Mons", "Orbit"],
                  marsMissions: ["Mars Odyssey", "Mars Pathfinder", "Spirit", "Phoenix", "Opportunity"]
                  }
  var alphabet = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"];
 
  var randomWordSelected = false;
  var randomWord="";
  var winCondition = 0;
  var guessedLetters = [];
  var guessesRemaining= 0;
  var correctLetters = [];
  var randomWordToLowerCase ="";
  var wins = 0;
  var losses = 0;
  var userGameword = "";
  var userGamewordtoLowercase = "";
  var validletter;
  var countBack = 0;
  var apiKey = "juxQrOf82kwObIuNjV0BvKilXbJQfPUxwxf0LLMM07w7OHwN";
  var profanity;
  var audioState = false;
 
  $(document).on("click", ".mute", function() {
    if (audioState === false) {
      $("#audiotag1")[0].play();
      audioState = true;
    }
    else if (audioState === true) {
      $("#audiotag1")[0].pause();
      audioState = false;
    }

  });
  
  function fillBlanks() {
    for (var x = 0; x < randomWord.length; x++) {
      if (randomWord.charAt(x) !== " ") {
        $("#underline" + x).css("visibility", "visible");
      }
      else if (randomWord.charAt(x) === " ") {
        winCondition++;
      }  
      letterFill = randomWord.charAt(x);

      $("#letter" + x).html(letterFill);

      }
  }

  function fillGuessedLetters() {
    var indexTwo = alphabet.indexOf(event.key);
    var index = guessedLetters.indexOf(event.key);
    if (index === -1 && indexTwo !== -1) {
      guessedLetters.push(event.key);
      guessesRemaining--;
    }
    $("#letterGuessed").html("<h2 id='letterGuessed'> Letters Guessed: " + guessedLetters + "</h2>")
    $("#guesses").html("<h2 id='guesses'> Guesses Remaining: " + guessesRemaining + "</h2>");
   
    
  }

  function checker() {
    for (var r = 0; r < randomWordToLowerCase.length; r++) {
      if (randomWordToLowerCase.charAt(r) === event.key) {
        $("#letter" + r).css("visibility", "visible")
        var correctIndex = correctLetters.indexOf(event.key);
          
        
        if (correctIndex === -1) {
          correctLetters.push(event.key);
          for (var y = 0; y < randomWordToLowerCase.length; y++) {
            if (randomWordToLowerCase.charAt(y) === event.key) {
              winCondition++;
            }
          }
        }
        
    }
  }
}

  function winChecker () {
    if (winCondition === randomWord.length && guessesRemaining >= 0){
      $(".panelAll").html("");
      $(".panelWords").html("");
      $(".panelMain").html("<h1>You Win!! The Answer is: " + randomWord + "</h1>");
      $(".panelMain").addClass("text-center");
      $(".panelMain").append("<button class='btn-lg playAgain'>");
      $(".playAgain").html("Play Again?");
      wins++;
    }

    else if (guessesRemaining === 0 && winCondition !== randomWord.length) {
      $(".panelAll").html("");
      $(".panelWords").html("");
      $(".panelMain").html("<h1>I'm sorry, you ran out of guesses. The Answer is: " + randomWord + "</h1>");
      $(".panelMain").addClass("text-center");
      $(".panelMain").append("<button class='btn-lg playAgain'>");
      $(".playAgain").html("Play Again?");
      losses++
    }

  database.ref("/hangman/single").set({
    wins: wins,
    losses: losses
  }); 
  }

  function reset () {
   location.reload();
  }



  //Singleplayer game
  //--------------------------------------------------
   
    $(".single").on("click", function(event) {
    event.preventDefault();
    $(".jumbotron").css("display", "none");
    var newDiv = "<div class='panel panel-default text-center panelAll panelMain'>";
    var internalNewDiv = "<div class='panel-body panelWords'>"
    $(".container").append(newDiv);
    $(".panelAll").append(internalNewDiv);
    $(".panelWords").html("<h3>Singleplayer Hangman. Choose a topic below:");
    var newButton = "<button class='btn-lg moviesButton theme'>"
    var newButton2 = "<button class='btn-lg spaceExplorationButton theme'>"
    $(".panelWords").append(newButton);
    $(".panelWords").append("<br>");
    $(".panelWords").append(newButton2);
    $(".moviesButton").html("Movies Set on Mars");
    $(".spaceExplorationButton").html("Space Exploration");
    $(".panelWords").append("<br>");
    var newButton3 = "<button class='btn-lg astronomyButton theme'>"
    $(".panelWords").append(newButton3);
    $(".astronomyButton").html("Astronomy Terms");
    $(".panelWords").append("<br>");
    var newButton4 = "<button class='btn-lg marsMissionsButton theme'>";
    $(".panelWords").append(newButton4);
    $(".marsMissionsButton").html("Missions to Mars");
      $(".theme").on("click", function(event) {
        event.preventDefault();
        var gameTheme = $(this).html();
          if (gameTheme === "Movies Set on Mars") {
            var random = Math.floor(Math.random() * gameWords.marsMovies.length);
            randomWord = gameWords.marsMovies[random];
            randomWordToLowerCase = randomWord.toLowerCase();
            guessesRemaining = randomWord.length + 3;
            console.log(randomWord);
            randomWordSelected = true;
          }
          if (gameTheme === "Space Exploration") {
            var random = Math.floor(Math.random() * gameWords.exploration.length);
            randomWord = gameWords.exploration[random];
            randomWordToLowerCase = randomWord.toLowerCase();
            guessesRemaining = randomWord.length + 3;
            console.log(randomWord);
            randomWordSelected = true;
          }
          if (gameTheme === "Astronomy Terms") {
            var random = Math.floor(Math.random() * gameWords.space.length);
            randomWord = gameWords.space[random];
            randomWordToLowerCase = randomWord.toLowerCase();
            guessesRemaining = randomWord.length + 3;
            console.log(randomWord);
            randomWordSelected = true;
          }
          if (gameTheme === "Missions to Mars") {
            var random = Math.floor(Math.random() * gameWords.marsMissions.length);
            randomWord = gameWords.marsMissions[random];
            randomWordToLowerCase = randomWord.toLowerCase();
            guessesRemaining = randomWord.length + 3;
            console.log(randomWord);
            randomWordSelected = true;
          } 

          if (randomWordSelected === true) {
            $(".panelWords").html("");
            $(".panelAll").removeClass("text-center");

            $(".panelWords").html("<h2>Your word is:</h2>");
            var wordWrapDiv = "<div id = 'wordWrap'>";
            $(".panelWords").append(wordWrapDiv);
            //loop to add in blanks
              for (var i = 0; i < 31; i++) {
                var underlineDiv = "<div id='underline" + i +"'>";
                $("#wordWrap").append(underlineDiv);
                var letterDiv = "<div id='letter" + i +"'>";
                $("#underline" + i).append(letterDiv);
            }
            fillBlanks();
            $(".panelWords").append("<h2 id='letterGuessed'> Letters Guessed: " + guessedLetters + "</h2>");
            $(".panelWords").append("<h2 id='guesses'>Guesses Remaining: " + guessesRemaining + "</h2>");
            var guessesDiv = "<div class='panel panel-default panelAll guessDiv'>";
            var guessesDivInternal ="<div class='panel-body panelWords guessForm'>";
            $(".container").append(guessesDiv);
            $(".guessDiv").append(guessesDivInternal);
            $(".guessForm").html("Use Your Keyboard to Play!");

            document.onkeyup = function(event) {
              fillGuessedLetters();
              checker();
              winChecker();
              $(".playAgain").on("click", function() {
                reset();
              });

            }
            
        }
      });
    });

//--------------------------------
//Multiplayer starts here
  $(".multi").on("click", function(event) {
    event.preventDefault();
    $(".jumbotron").css("display", "none");
    var rowDiv = "<div class='row row1'>"
    var columnDiv = "<div class='col-lg-4 col-md-4 col-sm-12 col-xs-12 column1'>"
    var newMultiDiv = "<div class='panel panel-default text-center panelAll panelMain'>";
    var internalMultiNewDiv = "<div class='panel-body panelWords'>"
    $(".container").append(rowDiv);
    $(".row1").append(columnDiv);
    $(".column1").append(newMultiDiv);
    $(".panelAll").append(internalMultiNewDiv);
    var column2Div = "<div class='col-lg-4 col-md-4 col-sm-12 col-xs-12 column2'>"
    var newMultiDiv2 = "<div class='panel panel-default text-center panelAll2 panelMain'>";
    $(".row1").append(column2Div);
    $(".column2").append(newMultiDiv2);
    $(".panelAll2").append(internalMultiNewDiv);
    var column3Div = "<div class='col-lg-4 col-md-4 col-sm-12 col-xs-12 column3'>"
    var newMultiDiv3 = "<div class='panel panel-default text-center panelAll3 panelMain'>";
    $(".row1").append(column3Div);
    $(".column3").append(newMultiDiv3);
    $(".panelAll3").append(internalMultiNewDiv);
    $(".panelAll").append("<h2>Player 1</h2>");
    $(".panelAll3").append("<h2>Player 2</h2>");

    //Creating form for player 1 to write word for player 2
    var inputDiv = "<div class='form-group'><label for='text'>Player 1, please write your guess here<br>(15 character max, letters only): </label><textarea class='form-control' rows='5' id='userSelectedWord' maxlength='15'></textarea></div>"
    $(".panelAll2").append(inputDiv);
    $(".panelAll2").append("<button class='btn-lg submit'>");
    $(".submit").html("Submit");
      $(".submit").on("click", function(event) {
        event.preventDefault();
        userGameword = $("#userSelectedWord").val().trim();
        userGamewordtoLowercase = userGameword.toLowerCase();
        for (var q = 0; q < userGamewordtoLowercase.length; q++) {
          for (var f = 0; f < alphabet.length; f++) {
            if (userGamewordtoLowercase.charAt(q) === alphabet[f]) {
              countBack++;
              console.log(countBack);
            }
          }
          if (userGamewordtoLowercase.charAt(q) === " " ) {
           countBack++;
          }
        }
        //Ajax call to check user input for profanity
        var queryTerm = userGamewordtoLowercase;
        var queryURL = "http://www.purgomalum.com/service/containsprofanity?text=" + queryTerm;
        $.ajax({
          url: queryURL,
          method: "",
          async: false
        }).done(function(response) {
          console.log(response);
          profanity = response;
          
        });

        if (countBack === userGamewordtoLowercase.length && profanity === "false") {
          randomWord = userGameword;
          countBack = 0;
          guessesRemaining = 3 + userGamewordtoLowercase.length;
          $(".container").html("");
          var newGameDiv = "<div class='panel panel-default text-center panelAll panelMain'>";
          var internalNewGameDiv = "<div class='panel-body panelWords'>"
          $(".container").append(newGameDiv);
          $(".panelAll").append(internalNewGameDiv);
          $(".panelWords").html("<h2>Player 2's word is:</h2>");
          var wordWrapDiv = "<div id = 'wordWrap'>";
          $(".panelWords").append(wordWrapDiv);
          $(".panelAll").removeClass("text-center");
          //loop to add in blanks
            for (var i = 0; i < 16 ; i++) {
              var underlineDiv = "<div id='underline" + i +"'>";
              $("#wordWrap").append(underlineDiv);
              var letterDiv = "<div id='letter" + i +"'>";
              $("#underline" + i).append(letterDiv);
          }
          fillBlanks();
          $(".panelWords").append("<h2 id='letterGuessed'> Letters Guessed: " + guessedLetters + "</h2>");
          $(".panelWords").append("<h2 id='guesses'>Guesses Remaining: " + guessesRemaining + "</h2>");
          $(".panelWords").append("Use Your Keyboard to Play!");
          randomWordToLowerCase = userGamewordtoLowercase;
          document.onkeyup = function(event) {
            fillGuessedLetters();
            checker();
            winChecker();
            $(".playAgain").on("click", function() {
              reset();
            });
          }


        }
        else if (profanity === "true") {
          countBack = 0;
          $(".panelAll2").append("<h3>**No Profanity Please**</h3>");
          profanity = "false";
          $("#userSelectedWord").val("");

        }

        else {
          $(".panelAll2").append("<h3>**Your Word is Invalid**</h3>");
          countBack = 0;
        }


          
      });
        
        
  });
});
