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
  $(".title").hide();

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
  var connectionsTrivia = database.ref("/connections/tp");
  var connectionsRPS = database.ref("/connections/rps");
  var connectionsHangman = database.ref("/connections/hangman");
  var populationTrivia = 0;
  var populationRPS = 0;
  var populationHangman = 0;

  connectionsTrivia.on("value", function(snapshot) {
    console.log(snapshot.numChildren());
    populationTrivia = snapshot.numChildren();
    $("#popTriv").html(populationTrivia);
  });

  connectionsRPS.on("value", function(snapshot) {
    console.log(snapshot.numChildren());
    populationRPS = snapshot.numChildren();
    $("#popRPS").html(populationRPS);
  });

  connectionsHangman.on("value", function(snapshot) {
    console.log(snapshot.numChildren());
    populationHangman = snapshot.numChildren();
    $("#popHangman").html(populationHangman);
  });

});

