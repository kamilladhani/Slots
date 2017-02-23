var slotsApp = angular.module("slotsApp", ['ngRoute', 'ngSanitize', 'ngCountup']);

  // Initialize Firebase
  var config = {
    apiKey: "AIzaSyBI8hogoKGbyjIq-F2vanQllIDJxoHymwU",
    authDomain: "slots-2bfa4.firebaseapp.com",
    databaseURL: "https://slots-2bfa4.firebaseio.com",
    storageBucket: "slots-2bfa4.appspot.com",
    messagingSenderId: "981222622235"
  };
  firebase.initializeApp(config);

slotsApp.config(function ($routeProvider, $locationProvider) {
	
	$locationProvider.hashPrefix("");

	$routeProvider
		.when('/',
			{
				controller: 'slotsController',
				templateUrl: 'partials/main.html'
			})
		// .when('/note/:id',
		// 	{
		// 		controller: 'noteDetails',
		// 		templateUrl: 'partials/details.html'
		// 	})
		.otherwise({ redirectTo: '/' });
});


slotsApp.controller('slotsController', function ($scope, $timeout, $location, $sce) {

	$scope.credits = 1000;

	var icons = ["BAR", "2BAR", "3BAR", "7", "77", "777", "BELL", "CHERRY", "QUICKHIT"] //ORDER MATTERS FOR CODE

	// Note line positions are as follows:
	//
	//  0  1  2  3  4
	//  5  6  7  8  9
	//  10 11 12 13 14
	//
	//  

	var lines = [[0,1,2,3,4],    [0,1,7,3,4],     [0,1,12,3,4], 
				 [0,6,2,8,4],    [0,6,7,8,4],     [0,6,12,8,4],
				 [0,11,2,13,4],  [0,11,7,13,4],   [0,11,12,13,4],
				  ]; // Still need ones that start with 5 and 10

	$scope.playSlot = function() {

		if ($scope.credits < 30) {
			return "Not enough credits";
		}

		// Take away 30 credits per play
		$scope.credits -= 30;
			
		var slotOutput = "<table style='border:1px solid black; text-align:center; margin: 0px auto;'>"
		var spin = [];
		for (var i=0; i<15; i++) {
			if ((i%5)==0) {
				slotOutput += "<tr>";
			}
			slotOutput += "<td style='border:1px solid black;'>";
			var rand = Math.floor(Math.random() * icons.length);
			spin.push(icons[rand]);
			slotOutput += icons[rand] + " ";
			slotOutput += "</td>";
			if ((i%5)==4) {
				slotOutput += "</tr><tr>";
			}
		}
		slotOutput += "</table>"

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
		$scope.credits += score;

		slotOutput += "</br></br/><h1>You won " + score + " credits!</h1>";

		$scope.slotOutput = $sce.trustAsHtml(slotOutput);

	};

	console.log("controller called");

}); 