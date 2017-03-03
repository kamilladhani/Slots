var slotsApp = angular.module("slotsApp", [//'firebase', 
										   'ngRoute', 
										   'ngSanitize', 
										   //'ngCountup', 
										   //'ngAnimate'
										   ]);

  // // Initialize Firebase
  // var config = {
  //   apiKey: "AIzaSyBI8hogoKGbyjIq-F2vanQllIDJxoHymwU",
  //   authDomain: "slots-2bfa4.firebaseapp.com",
  //   databaseURL: "https://slots-2bfa4.firebaseio.com",
  //   storageBucket: "slots-2bfa4.appspot.com",
  //   messagingSenderId: "981222622235"
  // };
  // firebase.initializeApp(config);

slotsApp.config(function ($routeProvider, $locationProvider) {
	
	$locationProvider.hashPrefix("");

	$routeProvider
		.when('/',
			{
				controller: 'slotsController',
				templateUrl: 'partials/main.html'
			})
		.otherwise({ redirectTo: '/' });
});


slotsApp.controller('slotsController', function ($scope, $sce) { //Inject $firebaseObject, $firebaseAuth for firebase

	// var ref = new Firebase("https://slots-2bfa4.firebaseio.com/");
	// // create an instance of the authentication service
	// var auth = $firebaseAuth(ref);
	// // login with Facebook
	// auth.$authWithOAuthPopup("facebook").then(function(authData) {
	// 	console.log("Logged in as:", authData.uid);
	// }).catch(function(error) {
	// 	console.log("Authentication failed:", error);
	// });

	// // download the data into a local object
	// var syncObject = $firebaseObject(ref);

	// // synchronize the object with a three-way data binding
	// // click on `index.html` above to see it used in the DOM!
 //  	syncObject.$bindTo($scope, "credits");

	$scope.credits = 1000;

	$('td').addClass('hidden');

	// NOTE: ORDER MATTERS 
	var icons = ["BAR", "2BAR", "3BAR", "7", "77", "777", "BELL", "CHERRY", "QUICKHIT"] 
	
	// Mapping of names of icons to names of the pictures (in png format)
	var dict = { "BAR":"greenbar", 
				 "2BAR":"redbar", 
				 "3BAR":"goldbar", 
				 "7":"redseven", 
				 "77":"goldenseven", 
				 "777":"diamond", 
				 "BELL":"bell", 
				 "CHERRY":"cherry", 
				 "QUICKHIT":"goldclover" }; // Names of the pictures (in png format)

	// Note line positions are as follows:
	//
	//  0  1  2  3  4
	//  5  6  7  8  9
	//  10 11 12 13 14
	//
	//  
 
	var lines = [[0,1,2,3,4],      [0,1,7,3,4],       [0,1,12,3,4], // Starts with posn 0
				 [0,6,2,8,4],      [0,6,7,8,4],       [0,6,12,8,4],   
				 [0,1,7,13,14],    [0,6,7,8,14],      [0,11,7,3,14],  
				 [0,11,2,13,4],    [0,11,7,13,4],     [0,11,12,13,4], 
				 [10,1,2,3,14],    [10,1,7,3,14],     [10,1,12,3,14], // Starts with posn 10
				 [10,1,7,13,4],    [10,6,7,8,4],      [10,11,7,3,4],
				 [10,6,2,8,14],    [10,6,7,8,14],     [10,6,12,8,14],
				 [10,11,2,13,14],  [10,11,7,13,14],   [10,11,12,13,14],  
				 [5,1,2,3,9],   [5,1,7,3,9],   [5,1,12,3,9],   [5,1,7,13,9], // Starts with posn 5     
				 [5,6,2,8,9],   [5,6,12,8,9], 
				 [5,11,2,13,9], [5,11,7,13,9], [5,11,12,13,9], [5,11,7,3,9]]; 

	$scope.playSlot = function() {

		if ($scope.credits < 30) {
			return "Not enough credits";
		}
			
		// Take away 30 credits per play
		$scope.credits -= 30;
		
		// Remove previous images and messages
		$('#instructions').remove();
		$('td').addClass('hidden');
		$('.inserted').remove();
		$('#score').html("");
		var take30 = new CountUp("counter", $scope.credits+30, $scope.credits, 0, 2.5, {separator:""});
		take30.start();

		var spin = [];

		for (var i=0; i<15; i++) {
			var rand = Math.floor(Math.random() * icons.length);
			spin.push(icons[rand]);
			$('#'+i.toString()).append("<img src='img/slotMachineIcons/" + dict[icons[rand]] + ".png' id='" + i.toString() + "child" + "' class='inserted' style='width:60px;height:60px;'>");
			showing(i);
		}

		console.log(icons.slice(0, icons.length-1));

		var score = 0;
		var p = icons.indexOf("QUICKHIT");
		var iconsNoQuickhit = icons.slice(0, icons.length-1) 
		// for each icon
		for (iconP in iconsNoQuickhit) {
			var icon = iconsNoQuickhit[iconP];
			// check line combos
			for (lineP in lines) {
				var line = lines[lineP];
				// check for identical symbols in a line
				var streak = 0;
				for (posnP in line) {
					var posn = line[posnP]
					if (spin[posn] == icon) {
						streak++;
					} else {
						break;
					}
				}

				console.log(icon);
				console.log(line);
				console.log(streak);

				// Award points for particular icon
				if (icon == "BAR") {
					// check streak length and award points
					if (streak==3) { score += 5; }
					else if (streak==4) { score += 10; }
					else if (streak==5) { score += 25; }
				} else if (icon == "2BAR") {
					if (streak==3) { score += 10; }
					else if (streak==4) { score += 20; }
					else if (streak==5) { score += 50; }
				} else if (icon == "3BAR") {
					if (streak==3) { score += 15; }
					else if (streak==4) { score += 40; }
					else if (streak==5) { score += 75; }
				} else if (icon == "7") {
					if (streak==3) { score += 50; }
					else if (streak==4) { score += 100; }
					else if (streak==5) { score += 300; }
				} else if (icon == "77") {
					if (streak==3) { score += 100; }
					else if (streak==4) { score += 200; }
					else if (streak==5) { score += 600; }
				} else if (icon == "777") {
					if (streak==3) { score += 150; }
					else if (streak==4) { score += 300; }
					else if (streak==5) { score += 1200; }
				} else if (icon == "BELL") {
					if (streak==3) { score += 5; }
					else if (streak==4) { score += 10; }
					else if (streak==5) { score += 25; }
				} else if (icon == "CHERRY") {
					if (streak==3) { score += 4; }
					else if (streak==4) { score += 8; }
					else if (streak==5) { score += 25; }
				}

				// slotOutput += "<h3> You won credits on line: " + line.toString() + "</h3>";

			}
		}

		// Check number of QUICKHITs
		var quickhits = 0;
		for (posn in spin) {
			if (spin[posn] == "QUICKHIT") {
				quickhits++;
			}
		}

		// Assign QUICKHIT points
		if (quickhits==3) { score += 30; }
		else if (quickhits==4) { score += 150; }
		else if (quickhits==5) { score += 300; }
		else if (quickhits==6) { score += 1000; }
		else if (quickhits==7) { score += 3000; }
		else if (quickhits==8) { score += 10000; }
		else if (quickhits>=9) { score += 100000; }

		// Add score to credits
		$scope.addToCredits(score);

	};

	function showing (i) {
		var del = (i%5)*600 + 700;
		setTimeout(function() { $('#'+i.toString()).removeClass("hidden"); console.log(i); }, del);
	}

	$scope.addToCredits = function (score) {
		setTimeout(function() { 
			if (score==0) {
				$('#score').html("Sorry, no credits won. Try again!");
			} else {
				$('#score').html("You won " + score + " credits!");
			}
			
			$scope.credits += score;
			var numAnim = new CountUp("counter", $scope.credits-score, $scope.credits, 0, 2.5, {separator:""});
			numAnim.start();
		}, 3700);
	};

	console.log("controller called");

}); 



