// Initialize Firebase
  var config = 
  {
  	
    apiKey: "AIzaSyBB23QESbNrXQRw6FbimCzI6BfXAkPYVKo",
    authDomain: "gamesworld-d56f1.firebaseapp.com",
    databaseURL: "https://gamesworld-d56f1.firebaseio.com",
    projectId: "gamesworld-d56f1",
    storageBucket: "gamesworld-d56f1.appspot.com",
    messagingSenderId: "411556798841"
    

  };

  // INITIALIZE FIREBASE
  firebase.initializeApp(config);

  //have databse = point to location of our GamesWorld Firebase/database
  var database = firebase.database();

  //Create a Root in Firebase called ('users')
  var login = database.ref('login'); 			//Root[user]
  var user = login.child('user');  

 
  //var user = database.ref(".info/connected");  



  // CHECK CURRENT PATH
  var currentPath = $(location)[0].pathname;


//Global Variables
var character;
var enemiesAvailable = false;												//This allows us to know if all 3 enemies are in (Enemies Available To Attack) if that is true then 
var enemiesInDefender = false;

var buttonCounter = 0;

var chosenCharacter;														//Global variable used so we know which character we chose when we enter (.button) click method
var chosenEnemy;															//Global variable used so we know which enemy we chose when we enter (.button) click method


//Button Area
var yourHealth;
var enemyHealth;

var yourAttackPower;
var EnemyCounterAttackPower;

//Sets global variable to true in function win_lose() when we have defeated an enemy
//which skips the return attack by (chosenEnemy)
var isEnemyDefeated = false;

//Create a counter to know when last enemy is defeated so we can display winning msg
var EnemiesDefeatedCount = 0;

//Object1
var Obi = 
{
	//Attributes
	name: "Obi-Wan Kenobi",
	health: 120,
	attkPower: 8,								//8 base(8, 16, 24, ...)
	counterAttkPower: 5,

	//Function1(Display Obi-Wan's Image)
	addCharacterImage: function(emptyDiv)
	{
		//emptyDiv.html("<img id=\'obiImage\' src=\'../images/obi.jpg\'>");
	}
};

//Object2
var Luke = 
{
	//Attributes
	name: "Luke Skywalker",
	health: 100,
	attkPower: 10,								//8 base(8, 16, 24, ...)
	counterAttkPower: 5,

	//Function1(Display Luke's Image)
	addCharacterImage: function(emptyDiv)
	{
		//emptyDiv.html("<img id=\'lukeImage\' src=\'../images/luke.jpg\'>");
	}
};

//Object3
var Sidious = 
{
	//Attributes
	name: "Darth Sidious",
	health: 150,
	attkPower: 12,								//8 base(8, 16, 24, ...)
	counterAttkPower: 20,

	//Function1(Display Darth Sidious' Image)
	addCharacterImage: function(emptyDiv)
	{
		//emptyDiv.html("<img id=\'sidiousImage\' src=\'../images/sidious.jpg\'>");
	}
};

//Object4
var Maul = 
{
	//Attributes
	name: "Darth Maul",
	health: 180,
	attkPower: 10,								//8 base(8, 16, 24, ...)
	counterAttkPower: 25,

	//Function1(Display Darth Maul's Image)
	addCharacterImage: function(emptyDiv)
	{
		//emptyDiv.html("<img id=\'maulImage\' src=\'../images/maul.jpg\'>");
	}
};

$(".info").on("click", function(event)
{
   event.preventDefault();

   var name = $(this).val();

   var fullName;

   
   var queryURL = "https://swapi.co/api/people/?search=" + name;

    $.ajax(
    {
      url: queryURL,
      method: "GET"
    })
    .done(function(response) 
    {
      console.log(response);
      console.log();

      //get Full name by finding character button val
      var aka ="";
      
      if(name === "palpatine")
      {
      	aka = "AKA(Darth Sidius)";
      }
     

      //Utilizing sweet alert2 & Star Wars API
      swal(
      {
  		title: response.results[0].name + aka,
  		text: 'I will close in 10 seconds.',
   		html: "<b>Name: </b>" + response.results[0].name + 
   			 "<br> <b>Height</b> " + response.results[0].height +
   			 "<br> <b>Mass</b> " + response.results[0].mass +
   			 "<br> <b>Hair Color</b> " + response.results[0].hair_color,
  timer: 10000
}).then(
  function () {},
  // handling the promise rejection
  function (dismiss) {
    if (dismiss === 'timer') {
      console.log('I was closed by the timer')
    }
  }
)

    });

});

//Store objects in Array for the for-loop
   var arrayOfObjects = [];
   arrayOfObjects.push(Obi);
   arrayOfObjects.push(Luke);
   arrayOfObjects.push(Sidious);
   arrayOfObjects.push(Maul);

//Create a for lop to iterate through array of characters and siplay 4 characters with attributes horizontally
for(var i = 0; i < arrayOfObjects.length; i++)
{
	//Each character will be stored in a <div>
	//EX <img id="pic0"..."pic3">
	character = $('<img id=\'' + "pic" + i + '\'>');	//use button instad of div so that each character displays horizontally. 
														//Also add value for conditional if-stms when moving characters to know which characters go where.
														//so value = name will be used for identifying 4 character objects(Obi, Luke, Sidious, Maul)

	//Give each character the following classes which not only assigns a class but also applies css
	character.addClass("characterContainer");

	//Give each character object in array an attribute called starWArsCharacter
	
													
    																												
	//character.text(arrayOfObjects[i].name ); //+ " " +  arrayOfObjects[i].health);	//name  //Image, Note: we are invoking the object's funciton. //health

	//Display each character image inside <div>/button
	if(i === 0)																	//Obi-Wan Kenobi
	{
		character.attr("src", "https://vignette2.wikia.nocookie.net/starwars/images/d/df/Masterobiwan.jpg/revision/latest/scale-to-width-down/250?cb=20080719000305");	

		$("#name").text(arrayOfObjects[i].name); 	 //display name of character
		$("#health").text(arrayOfObjects[i].health); //display health of character
		


	
	}
	else if(i === 1)															//Luke
	{
		character.attr("src", "https://vignette4.wikia.nocookie.net/smosh/images/b/bb/Luke_Skywalker.jpg/revision/latest?cb=20130105032141");

		$("#name2").text(arrayOfObjects[i].name); 	  //display name of character
		$("#health2").text(arrayOfObjects[i].health); //display health of character
		


	}
	else if(i === 2)															//Darth Sidious
	{
		character.attr("src", "https://images.moviepilot.com/image/upload/c_fill,h_470,q_auto:good,w_620/veplwhyniu2dq9fkn2qh.jpg");

		$("#name3").text(arrayOfObjects[i].name); 	  //display name of character
		$("#health3").text(arrayOfObjects[i].health); //display health of character
	}
	else if(i === 3)															//Darth Maul
	{
		character.attr("src", "https://upload.wikimedia.org/wikipedia/en/b/bf/Darth_Maul.png");

		$("#name4").text(arrayOfObjects[i].name); 	   //display name of character
		$("#health4").text(arrayOfObjects[i].health);  //display health of character
	}
	
    character.attr("starWarsCharacterName", arrayOfObjects[i].name);	 //pass in each object's name into the attribute
    character.attr("starWarsCharacterHealth", arrayOfObjects[i].health); //pass in each object's health into the attribute
    character.attr("starWarsCharacterAttkPower", arrayOfObjects[i].attkPower);
    character.attr("starWarsCharacterCounterAttkPower", arrayOfObjects[i].counterAttkPower);


   	
	            																									

	//add each character <div> with (name) (image) (health)
	$("#characters").append(character);
}


//click one of the character images then move chosen character underneath (Your Character)
//then move the rest of the characters underneath (Enemies Available To Attack)
$(".characterContainer").on("click", function()
{
	//hide all info buttons
	$("#obiInfo").hide()
	$("#lukeInfo").hide()
	$("#sidiousInfo").hide()
	$("#maulInfo").hide()

	
	if(enemiesAvailable === false)
	{
		//EX: if I click on obi-one or some other character (this) keyword knows
		//which character image i've selected then moves chosen character(this)
		//underneath (Your Character) located at <div id="choice">

		 chosenCharacter = $(this);		  //(this) refers to the img-button that I clicked on
										  //store the value of the <img> so when we move the remanining characters, we don't relocate chosen character

		 yourHealth = parseInt(chosenCharacter.attr("starWarsCharacterHealth"));						//your health   //USE this global variable in the ("#attack") button method
		 yourAttackPower = parseInt(chosenCharacter.attr("starWarsCharacterAttkPower"));				//use this and multiply by counter for each iteration for base increase attack 
		 																								//USE this global variable in the ("#attack") button method
		 
		

		$("#choice").append(chosenCharacter); //store chosenCharacter(this) at <div id="choice">



		$("#name").hide();
		$("#health").hide();

		$("#name2").hide();
		$("#health2").hide();

		$("#name3").hide();
		$("#health3").hide();

		$("#name4").hide();
		$("#health4").hide();

		$("#chosenName").text($(this).attr("starWarsCharacterName")); 	 								//display name of character
		$("#chosenHealth").text($(this).attr("starWarsCharacterHealth")); 								//display health of character

																										//NOTE: console.log($("#pic1").attr("starWarsCharacterName")); = "Luke Skywalker"

		//append the remaining(unchosen charachters underneath Enemis Available To Attack)
		var i = 0;

		//use to add (#enemyName) & (#enemyHealth) at correct div< enemyName1-3> div<enemyHealth1-3>
		var pos = 1;		
		
		while( i < arrayOfObjects.length)
		{
			
			if($("#pic"+ i).attr("starWarsCharacterName") != $(this).attr("starWarsCharacterName"))		//$("#pic" + i) goes through all 4 characters 			&& 
			{																							//$(this).attr("starWarsCharacterName") = chosen clicked image character.					
			
				$("#enemiesRemain").append($("#pic" + i));												//move enemy pic(<img id=\'' + "pic" + i + '\'>) underneath (Enemies Available To Attack)

				//For each iteration store Name: ("#enemyName1")...("#enemyName4")
				//& store Health ("#enemyHealth1")...("#enemyHealth4") onto each enemy pic
				$("#enemyName" + pos).append(arrayOfObjects[i].name);									//display enemy name. //SAME AS: $("#enemyName").text($("#pic" + i).attr("starWarsCharacterName"));	
				$("#enemyHealth" + pos).append(arrayOfObjects[i].health);								//display health of enemy //SAME AS: $("#enemyHealth").text($("#pic" + i).attr("starWarsCharacterHealth"));

				$("#pic" + i).addClass("enemyColor");

				//Use to find index of the 3 Enemies (Enemies Available To Attack) so we know which character's name & health we should hide
				$("#pic"+ i).attr("EnemiesAvailableToAttackIndex", pos);

				pos++;
			}

			i++;
		}

		enemiesAvailable = true;
	}
	else if(enemiesAvailable === true)
	{
		//Click on enemy in (Enemies Available To Attack) and move that chosen enemy to (Defender) area.
		 chosenEnemy = $(this);						//(this) refers to the chosen enemy in the (Enemis Available To Attack)

		 
		 enemyHealth = parseInt(chosenEnemy.attr("starWarsCharacterHealth"));							//enemy health  //USE this global variable in the ("#attack") button method
		 EnemyCounterAttackPower = parseInt(chosenEnemy.attr("starWarsCharacterCounterAttkPower")); 	// Enemies counter attack will remain the same, yours goes up for each attack.

		//Use while loop to go through 4 objects and check to see which object we are moving so we hide his name & health
		var j = 1;
		


		//store EnemyAvailableToAttack index in variable and concatenate with ("#enemyName") & ("#enemyHealth")
		//to ensure that the right name and health get hidden when moving character to (defender) area.
		var enemyIndex = $(this).attr("EnemiesAvailableToAttackIndex");
		

		//Hide Name
		$("#enemyName" + enemyIndex).hide();

		//Hide Health
		$("#enemyHealth" + enemyIndex).hide();
		

		$("#enemyChoice").append(chosenEnemy);			//store chosenEnemy at <div id="chosenEnemy">

		//We have to shift (name) & (health) left once for image3 if image2 is selected
		if(enemyIndex === "2")
		{
			
			$("#enemyName3").css("margin-left", "280px");
			$("#enemyHealth3").css("margin-left", "280px");
		}

		//if we select image 1 then shift name & health over left for image2 & image3
		if(enemyIndex === "1")
		{
			$("#enemyName2").css("margin-left", "80px")
			$("#enemyHealth2").css("margin-left", "80px")

			$("#enemyName3").css("margin-left", "280px");
			$("#enemyHealth3").css("margin-left", "280px");
		}
		
		//Displayer Jumbotron Attack Area
		$(".jumbotron").show();

		//Relocate Name and Health in Defender Area
		$("#defenderName").text($(this).attr("starWarsCharacterName"));			//TRY: $("#defenderName").append($(this).attr("starWarsCharacterName"));
		$("#defenderHealth").text($(this).attr("starWarsCharacterHealth"));		//TRY: $("#defenderHealth").append($(this).attr("starWarsCharacterHealth"));

		//NOTE: when we select a second enemy in the defender we hide his name
		//      and health we need the name and health to reappear
		$("#defenderName").show();
		$("#defenderHealth").show();

		//NOTE: when select another enemy to fight hide the winning message
		$("#winMsg").hide();


		//Set enemy in defender to true so we don't get error message when
		//clicking the button
		enemiesInDefender = true;

		EnemiesDefeatedCount++;
		console.log(EnemiesDefeatedCount);


	}


		
});

//Attack Enemy by clicking the Atack Button
$("#attackButton").on("click", function()
{
	if(enemiesInDefender === false)
	{
		$("#errorMessage").html("No Enemy Here");
	}
	else
	{
		buttonCounter++;

		$("#yourAttack").show();																		//when attack button is clicked display your damage and 
		$("#hisAttack").show();																			//display enemy's damage as well.
		
	
			
		//You attack on (chosen Enemy)
		enemyHealth = enemyHealth - (buttonCounter * yourAttackPower);

							

		

		

		//check to see if enemy is defeated prior to enemy attacking back at you(chosen character)
		win_lose();

		if(isEnemyDefeated != true)
		{
			//Display starwars gif and play sound
			

			//Enemy attack on (chosen character)
			yourHealth = yourHealth - EnemyCounterAttackPower;		

			//Display enemy's health status in Defender image && display results in <h5> msg
			$("#defenderHealth").text(enemyHealth);

			//Display the enemy you're currently attacking in the jumbotron && add css color
			$(".enemyYouAttack").text(chosenEnemy.attr("starWarsCharacterName"));
			$(".enemyYouAttack").css("color", "green");

			$("#enemyAttackDamage").text(EnemyCounterAttackPower)
		}

		//check to see if enemy has defeated you
		win_lose();

		//Display chosen character's health status in Your characterImage && display results in <h5> message
		$("#chosenHealth").text(yourHealth);

		//
		$(".enemyYouAttack").text(chosenEnemy.attr("starWarsCharacterName"));
		$(".enemyYouAttack").css("color", "green");

		$("#yourAttackDamage").text(buttonCounter * yourAttackPower)

		//reset isEnemyDefeated variable
		 isEnemyDefeated = false;



	}
	

});


//Restart Everything
$("#restartButton").on("click", function()
{

	//reload page
	location.reload();

});

//Functino1(check to see if the enemy is defeated or if you've been defeated)
function win_lose()
{

	if(yourHealth <= 0)
	{	
		//losing msg
		$("#loseMsg").show();

		//restart button
		$("#restartButton").show();

		//Hide both attack damage messages before selecting a new character to fight
		$("#yourAttack").hide();																		
		$("#hisAttack").hide();
		
				
	}
	else if(enemyHealth <= 0)
	{
		

		if(EnemiesDefeatedCount != 3)
		{
			//Winning msg
			$("#winMsg").show();

			//hide chosen enemy you've defeated
			chosenEnemy.hide();	//hide enemy image

			//hide defender name
			$("#defenderName").hide();

			//hide defender health
			$("#defenderHealth").hide();

			//Hide both attack damage messages before selecting a new character to fight
			$("#yourAttack").hide();																		
			$("#hisAttack").hide();

			//sets variable to true which skips enemy return attack on you
			isEnemyDefeated = true;

			

		}
		else if(EnemiesDefeatedCount == 3)	//Execute when we've defeated all enemies
		{

			//Win msg Game Over all enemies defeated
			$("#winMsg2").show();

			//restart button
			$("#restartButton").show();

			//hide chosen enemy you've defeated
			chosenEnemy.hide();	//hide enemy image

			//hide defender name
			$("#defenderName").hide();

			//hide defender health
			$("#defenderHealth").hide();

			//Hide both attack damage messages before selecting a new character to fight
			$("#yourAttack").hide();																		
			$("#hisAttack").hide();

			//sets variable to true which skips enemy return attack on you
			isEnemyDefeated = true;

		}

		
	}


}


// SIGN OUT THE USER
  $('#sign-out').on('click', function(event) 
  {
  	 //Don't refresh page and allows us to load the main(planets) page at login
      event.preventDefault();



    firebase.auth().signOut().then(function() 
    {
        $(location).attr('href', 'index.html');

      })
      .catch(function(error) 
      {
         swal( "Error" ,  error.message,  "error" );
      });

      //disconnect particular user
      //user.onDisconnect().remove();
      

  });