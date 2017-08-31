 // Initialize Firebase

 var count = 0;
  var config = 
  {
    apiKey: "AIzaSyAEa-BMowWnwi27fEH6TXoeDDRwPDX637A",
    authDomain: "login-9d330.firebaseapp.com",
    databaseURL: "https://login-9d330.firebaseio.com",
    projectId: "login-9d330",
    storageBucket: "login-9d330.appspot.com",
    messagingSenderId: "752732408092"
  };

  firebase.initializeApp(config);

  //get reference to database service
    //var database = firebase.database()

    var provider = new firebase.auth.GoogleAuthProvider();
 
 	function signIn()
 	{
 		
 		//Don't refresh page
        event.preventDefault();
 		
 		firebase.auth().signInWithPopup(provider).then(function(result) {
  // This gives you a Google Access Token. You can use it to access the Google API.
  var token = result.credential.accessToken;
  // The signed-in user info.
  var user = result.user;
  // ...
}).catch(function(error) {
  // Handle Errors here.
  var errorCode = error.code;
  var errorMessage = error.message;
  // The email of the user's account used.
  var email = error.email;
  // The firebase.auth.AuthCredential type that was used.
  var credential = error.credential;
  // ...
});

 	}











/*
    //User clicks [login] button to gain access to main game page(MainPage.html)
    $("#loginButton").on("click", function(event)
    {
      //Don't refresh page
      event.preventDefault();




    });
  
 <button type="submit" onclick="signIn();" class="btn btn-primary" id="loginButton"> Login </button>
*/





