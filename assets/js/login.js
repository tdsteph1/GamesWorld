 $(document).ready(function() 
{

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


  // INITIALIZE FIREBASE
  firebase.initializeApp(config);

  // CHECK CURRENT PATH
  var currentPath = $(location)[0].pathname;

  // CHECK IF USER IS SIGNED IN
  firebase.auth().onAuthStateChanged(function(user) 
  {
  	//if the user is in current Login Page and user name and password exist then go to MainPage(game planets page)
    if(user && (currentPath === '/index.html' || currentPath === '/' )) 
    {
      // REDIRECT IF AUTHENTICATED
      $(location).attr('href', 'auth.html');						

    } 
    else if(!user && currentPath === '/auth.html') 	//Else user does not exist and stay at login page
    {
      // REDIRECT IF NOT AUTHENTICATED
      $(location).attr('href', 'index.html');

    }

  });

  // SIGN IN THE USER
  $('#loginButton').on('click', function() 
  {
    var email = $('#exampleInputEmail1').val().trim();
    var password = $('#exampleInputPassword1').val().trim();

    if(email && password) 
    {
      // ADD USER TO DATABASE
      firebase.auth().signInWithEmailAndPassword(email, password).then(function() {
          $(location).attr('href', 'auth.html');
        }).catch(function(error) {
          alert(error.message);
        });
    }
  });

  // SIGN UP THE USER
  $('#sign-btn').on('click', function() 
  {
    var email = $('#sign-email').val();
    var password = $('#sign-password').val();
    firebase.auth().createUserWithEmailAndPassword(email, password).then(function() 
    {
        $(location).attr('href', 'auth.html');
      }).catch(function(error) {
        alert(error.message);
      });
  });

  // SIGN OUT THE USER
  $('#sign-out').on('click', function() 
  {
    firebase.auth().signOut().then(function() 
    {
        $(location).attr('href', 'index.html');

      })
      .catch(function(error) 
      {
        alert(error.message);
      });
  });

  /*****************
  JAVASCRIPT FOR CSS
  ******************/
  
  // open modals
  $('.modal').modal();
  // parallax
  $('.parallax').parallax();
  // change font size for icons
  $('#logo-icon').css('font-size', '40px');
  // get current year
  var currentYear = new Date().getFullYear();
  $('#current-year').html(currentYear);

});






 $('#loginButton').on('click', function(event) 
  {
  	  //Don't refresh page
      event.preventDefault();



  });


























/*
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

*/














