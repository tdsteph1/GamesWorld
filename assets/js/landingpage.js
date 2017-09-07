$(document).ready(function() {

  // Initialize Firebase
  var config = {
    apiKey: "AIzaSyBB23QESbNrXQRw6FbimCzI6BfXAkPYVKo",
    authDomain: "gamesworld-d56f1.firebaseapp.com",
    databaseURL: "https://gamesworld-d56f1.firebaseio.com",
    projectId: "gamesworld-d56f1",
    storageBucket: "gamesworld-d56f1.appspot.com",
    messagingSenderId: "411556798841"
  };

  firebase.initializeApp(config);
  var database=firebase.database();
  // Hide text on planets
  $("span").hide();

  $("img").on("click",function() {
    var size = $(this).attr("size");

    if (size ==="small") {
      $(this).animate({ height:"250px", width: "250px"});
      $(this).attr("size", "large");
      $(this).next().show(500);
    }
      
    else{
      $(this).animate({ height:"150px", width: "150px"});
      $(this).attr("size", "small");
      $(this).next().hide();
    }
  });


  // Detecting Presence
  var checkPopulation = function() {
    var connectionsRPS = database.ref("/rps/connections");
    var connectionsTrivia = database.ref("/tp/connections");
    var connectionsHangman = database.ref("/hangman/connections");
    var populationTrivia = 0;
    var populationRPS = 0;
    var populationHangman = 0;

    connectionsTrivia.on("value", function(snapshot) {
      if (snapshot.val() != null) {
        populationTrivia = 0;
        console.log(populationTrivia);
      }
      else {
      populationTrivia = snapshot.numChildren();
      console.log(populationTrivia);
      }
    });

    connectionsRPS.on("value", function(snapshot) {
      if (snapshot.val() != null){
        populationRPS = 0;
        console.log(populationRPS);
      }
      else {
      populationRPS = snapshot.numChildren();
      console.log(populationRPS);
      }
    });

    connectionsHangman.on("value", function(snapshot) {
      if (snapshot.val() != null){
        populationHangman = 0;
        console.log(populationHangman);
      }
      else {
      populationTrivia = snapshot.numChildren();
      console.log(populationHangman);
      }
    });
  };
  checkPopulation();
});

