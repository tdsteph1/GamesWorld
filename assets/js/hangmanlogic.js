$(document).ready(function(){
  var gameWords = {Sports: ["baseball", "soccer", "three point shot", "basketball"],
                   Film: ["The Wolf of Wall Street", "The Shawshank Redemption", "Star Wars", "Inception"],
                   Space: ["Eclipse", "Lunar", "Cosmic Rays", "Dark Matter"]
                  }
  var alphabet = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"];
 
  var randomWordSelected = false;
  var randomWord="";
  var winCondition = 0;

  function fillBlanks() {
    for (var x = 0; x < randomWord.length; x++) {
      if (randomWord.charAt(x) !== " ") {
        $("#underline" + x).css("visibility", "visible");
      }
      else if (randomWord.charAt(x) === " ") {
        winCondition++;
      }  
      letterFill = randomWord.charAt(x);

      $("#letter" + x).html = letterFill;

      }
  }

  //Singleplayer game
  //--------------------------------------------------
    $(".single").on("click", function() {
    $(".jumbotron").css("display", "none");
    var newDiv = "<div class='panel panel-default text-center panelAll'>";
    var internalNewDiv = "<div class='panel-body panelWords'>"
    $(".container").append(newDiv);
    $(".panelAll").append(internalNewDiv);
    $(".panelWords").html("<h3>Singleplayer Hangman. Choose a topic below:");
    var newButton = "<button class='btn-lg btn-success sportsButton theme'>"
    var newButton2 = "<button class='btn-lg btn-danger filmButton theme'>"
    $(".panelWords").append(newButton);
    $(".panelWords").append(newButton2);
    $(".sportsButton").html("Sports");
    $(".filmButton").html("Film");
    $(".panelWords").append("<br>");
    var newButton3 = "<button class='btn-lg btn-info spaceButton theme'>"
    $(".panelWords").append(newButton3);
    $(".spaceButton").html("Space");
      $(".theme").on("click", function() {
        var gameTheme = $(this).html();
          if (gameTheme === "Sports") {
            var random = Math.floor(Math.random() * gameWords.Sports.length);
            randomWord = gameWords.Sports[random];
            console.log(randomWord);
            randomWordSelected = true;
          }
          if (gameTheme === "Film") {
            var random = Math.floor(Math.random() * gameWords.Film.length);
            randomWord = gameWords.Film[random];
            console.log(randomWord);
            randomWordSelected = true;
          }
          if (gameTheme === "Space") {
            var random = Math.floor(Math.random() * gameWords.Space.length);
            randomWord = gameWords.Space[random];
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
        }
      });



    });

  
});