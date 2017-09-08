$(document).ready(function(){
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
    console.log(guessesRemaining);
    
  }

  function checker() {
    for (var r = 0; r < randomWordToLowerCase.length; r++) {
      if (randomWordToLowerCase.charAt(r) === event.key) {
        $("#letter" + r).css("visibility", "visible")
        var correctIndex = correctLetters.indexOf(event.key);
        if (correctIndex === -1) {
          correctLetters.push(event.key);
          winCondition++;
          console.log(correctLetters);
        }
      }
    }
  }



  //Singleplayer game
  //--------------------------------------------------
    $(".single").on("click", function(event) {
    event.preventDefault();
    $(".jumbotron").css("display", "none");
    var newDiv = "<div class='panel panel-default text-center panelAll'>";
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
            $(".panelWords").append("<h2 id='guesses'>Guesses Remaining: " + guessesRemaining + "</h2>")
            var guessesDiv = "<div class='panel panel-default panelAll guessDiv'>";
            var guessesDivInternal ="<div class='panel-body panelWords guessForm'>";
            $(".container").append(guessesDiv);
            $(".guessDiv").append(guessesDivInternal);
            $(".guessForm").html("Use Your Keyboard to Play!");

            document.onkeyup = function(event) {
              fillGuessedLetters();
              checker();

            }
            
        }
      });
    });
});
