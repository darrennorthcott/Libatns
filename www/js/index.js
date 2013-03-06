/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicity call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        app.receivedEvent('deviceready');
    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {
        var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');

        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');

        console.log('Received Event: ' + id);
    }
    
    

};


/* ********* SET DEFAULT PAGE TRANSITIONS ************/

 $("div[data-role=page]").bind("pagebeforeshow", function (e, data) {
    $.mobile.silentScroll(0);
    $.mobile.changePage.defaults.transition = 'slide';
});

/* ****** Initialization calls ********** */

 app.initialize();
 Parse.initialize("aQ27xXVmNkVzwQ2TTMCKIZ0x9LpqAPAErDRoppnY", "piBbchp3tZ9dNnzioHb2b07N6GsFhpog3Ly24tX5");
 
 
 
            
 /* Variables */

//Parse.User.logOut();
 var currentUser = Parse.User.current(); //get current user
 var followRelation;
 var nonCurrentUserProfile;
 
 
 $(document).ready(function(){
 
 
/* ********** SIGN UP AND CURRENT USER ***************** */

if (currentUser) {
    // do stuff with the user - pretty much all of teh app should be in this block... 
    
    currentUser.fetch({                      //ensure the current user info is up to date
	    success: function(currentUser) {
   		    alert('signed in as '+currentUser.get("username"));
   		    
   		    $("#headerLogo").effect("bounce", { times:3 }, 600); //bounce the pull tab
   		    
		    $("#profileUserName").html(currentUser.get("username"));
		    followRelation = currentUser.relation("following");
		    updateActivityStream();
		    }
});
} else {
    // show the signup or login page
  
    $.mobile.changePage( "#signInPage", { transition: "slideup"} );
}

/* Sign in click function  */

$("#signInSubmit").click(function(){
	
	var username = $("input:text[name='username']").val();
	var password = $("input:password[name='password']").val();
	
	Parse.User.logIn(username, password, {
  success: function(user) {
    // Do stuff after successful login.
    currentUser = Parse.User.current();
    currentUser.fetch({                      //ensure the current user info is up to date
	    success: function(currentUser) {
   		    alert('signed in as '+currentUser.get("username"));
		    $("#profileUserName").html(currentUser.get("username"));
		    followRelation = currentUser.relation("following");
		    }
});
    $.mobile.changePage( "#home", { transition: "slideup"} );
  },
  error: function(user, error) {
      // The login failed. Check error to see why.
    alert('fail');
    
  }
});
	
});


/* TESTING RELATIONAL DATA */

var relation = currentUser.relation("drinks"); //create a relation for current user to their drinks

/* ********* CREATE A DRINK **********/

$("#createDrink").click(function(){
	var currentUsername = currentUser.get("username");
	var Drink = Parse.Object.extend("drinkObject");
	var mydrink = new Drink();
	var newDrinkName = $('#newDrinkName').val();
	var instruction1 = $("#instruction1").val();
	var instruction2 = $("#instruction2").val();
	var instruction3 = $("#instruction3").val();
	
	mydrink.set("name", newDrinkName);
	mydrink.set("createdBy", currentUsername);

	mydrink.addUnique("instructions", instruction1);
	mydrink.addUnique("instructions", instruction2);
	mydrink.addUnique("instructions", instruction3);

	if (instruction1 && instruction2 && instruction3 != ''){

		mydrink.save(null, {
			success: function(mydrink) {
    // The object was saved successfully.
   
    		relation.add(mydrink);
    		currentUser.save();

    		alert("Drink Created");
			$('#newDrinkName').val(""); //clear the field
			getUserDrinks(); //update the users drinks (possibly should be done on a click function... maybe not )
			},
			error: function(mydrink, error) {
    // The save failed.
    // error is a Parse.Error with an error code and description.
    		}
    	});
  
    }
});



/* GET THE DRINK DATA FOR USER */
var currentDrink = "";

		
function getUserDrinks(){

	currentUser.fetch({
		success: function(currentUser) {  //updating the user realtion information (there might be a better way to do this)
   //alert(currentUser.get("username"));
  
   			relation = currentUser.relation("drinks");
   			}
   	});


   	var userDrinksQuery = relation.query(); //get the drinks from the current user

		userDrinksQuery.find({
			success:function(results) {
				console.dir(results);
				var s = "";
				for(var i=0, len=results.length; i<len; i++) {
					var newdrink = results[i];
					s += '<a class="drinkSquareAction" onclick="drinkSquareAction(this)" href="#drink-page" data-transition="pop" ><div class="profileDrinkSquare">'; 								
					s += ""+newdrink.get("name");
					s += '<span class="objectID" style="display:none">';
					s += ''+newdrink.id;
					s +='</span></div></a>';
				}
				$("#userDrinksCount").html(results.length); //update users drink count
				$("#profileGrid").html(s);  //add to the user profile grid section
				$("#profileUserName").html(currentUser.get("username"));
			},
			error:function(error) {
				alert("Error when getting drinks!");
			}
		});
		
		}

		getUserDrinks(); //update the users drinks
$("#profileButton").click(function(){
	getUserDrinks();
});

 $(".ui-collapsible-heading-toggle").click(function(){    
 alert('clicked!');
      $('html, body').animate({
    scrollTop: $('#browseNumber').offset().top
  });
  });
  
$("#searchDrinkForm").submit(function(e){
e.preventDefault();
var searched = $(".menuSearch").val();


	getDrinks(searched);
	$.mobile.changePage( "#browse-page", { transition: "slideup"} );
});

$("#activityButton").click(function(){
	updateActivityStream();
});

/*
$(".profileActions").click(function(){
$(this).toggleClass("followSelected", "test");});
*/


});  //END OF DOCUMENT.READY

/* *********** FUNCTION TO DYNAMICALLY LOAD THE DRINK PAGE BASED ON THE DRINK TILE CLICKED *************** */

function drinkSquareAction(item){
	
	currentDrinkID = $(item).find(".objectID").text(); //get the unique object ID of the drink clicked
	//alert (currentDrink);
	
	var CurrentDrink = Parse.Object.extend("drinkObject");
	var query = new Parse.Query(CurrentDrink);
	
	query.get(currentDrinkID, { //query for the drink
		success: function(currentDrink) {
    // The object was retrieved successfully.
    		var drinkName = "";
    			drinkName += ""+currentDrink.get("name");
    			$("#DrinkPageName").html(drinkName); //drink name
    			$("#drinkPosterContainer").find(".drinkCreatedBy").html('<a href="" onclick="clickUsername(this)" class="createdByLink">'+currentDrink.get("createdBy")+'</a>'); //created by
   
   //get the instrucitons
    			var instructionsHTML = "<ol>";
      			var instructions =  currentDrink.get("instructions");
    			
    			for (var i=0, len=instructions.length; i<len; i++){
	    			var newIns = instructions[i];
	    			instructionsHTML += '<li>'+newIns+'</li>';
	   
	    			}
	    		instructions += '</ol>';
	    		$('#instructions').html(instructionsHTML); //instructions
   
	 },
	 error: function(object, error) {
    // The object was not retrieved successfully.
    // error is a Parse.Error with an error code and description.
    }
    });	
	
}  

/* ************** GET THE DRINKS FOR BROWSE SECTION ********************* */

	function getDrinks(forKind) {
		var query = new Parse.Query(drinkObject);
		
		
		if (forKind != "all"){
		alert(forKind);
			query.contains("name", forKind); //CASE SENSITIVE... WTF???
		}

		query.find({
			success:function(results) {
				console.dir(results);
				var s = "";
				for(var i=0, len=results.length; i<len; i++) {
					var drink = results[i];
					s += '<a href="#drink-page" data-transition="pop" onclick="drinkSquareAction(this)" ><div class="itemInner"><img src="img/glass.png"/><div class="Bubbles"></div><br/><span class="itemText">'; 								
					s += ""+drink.get("name");
					s += '<p>By: '+drink.get("createdBy") + " ";
					s += '<span class="objectID" style="display:none">';
					s += ''+drink.id;
					s +='</span>';
					s += drink.get("likes")+" Likes</p></span></p></div></a>";
					s += "";
				}
				$("#resultsDigit").html(results.length);
				$("#drinkListing").html(s);
			},
			error:function(error) {
				alert("Error when getting drinks!");
			}
		});
	}
	
	
/* ************** POPULATE A PROFILE PAGE FOR SOMEONE ELSE **************** */

function clickUsername(person){
	
	var clickedUsername = $(person).text();
	var query = new Parse.Query(Parse.User);
query.equalTo("username", clickedUsername);  // find all the women
query.find({
  success: function(results) {
    // Do stuff
    //alert("found "+results.length+" rusults");
    nonCurrentUserProfile = results[0];
    var newUsername = results[0].get("username");
    var newUserID = results[0].get("objectId");
    
    var clickedUserRelation = results[0].relation("drinks");
    
       	var userDrinksQuery = clickedUserRelation.query(); //get the drinks from the selected user

		userDrinksQuery.find({
			success:function(results) {
				console.dir(results);
				var s = "";
				for(var i=0, len=results.length; i<len; i++) {
					var newdrink = results[i];
					s += '<a class="drinkSquareAction" onclick="drinkSquareAction(this)" href="#drink-page" data-transition="pop" ><div class="profileDrinkSquare">'; 								
					s += ""+newdrink.get("name");
					s += '<span class="objectID" style="display:none">';
					s += ''+newdrink.id;
					s +='</span></div></a>';
				}
				$("#userDrinksCount").html(results.length); //update users drink count
				$("#profileGrid").html(s);  //add to the user profile grid section
			},
			error:function(error) {
				alert("Error when getting drinks!");
			}
		});
		$("#profileUserName").html(newUsername);
		$("#followMeContainer").html('<a href="" class="profileActions" onclick="follow(this)"><span class="followCheck"></span>Follow Me<span class="followTailRight"></span></a>');
		
		//determine if you are follwing this person
		   currentUser = Parse.User.current();
    currentUser.fetch({                      //ensure the current user info is up to date
	    success: function(currentUser) {
   		    
		    followRelation = currentUser.relation("following");
		    }
});
				var query = followRelation.query();
query.equalTo("username", newUsername);
query.find({
  success:function(list) {
    
    
    if(list[0].get("username") == newUsername){
    $('.profileActions').toggleClass("followSelected", "test");
    }
  }
});
		
		$.mobile.changePage( "#profile-page", { transition: "slide"} );
    
  }
});}

/* ********* FOLLOW SOMEONE ************ */
function follow(checkmark){
	
	$(checkmark).toggleClass("followSelected", "test");
	
	if ($(checkmark).hasClass("followSelected")){
		
		
		//alert(nonCurrentUserProfile.get("username"));
		followRelation.add(nonCurrentUserProfile);
		currentUser.save();
	}else{
		followRelation.remove(nonCurrentUserProfile);
		currentUser.save();
	}
}
	
	
/* ********** LOG OUT ************** */
function logout(){
	Parse.User.logOut();
	 $.mobile.changePage( "#signInPage", { transition: "slideup"} );
}

/* ************* ACTIVITY STREAM ****************** */

//Get a list of your followers

function updateActivityStream(){

//set vars
var followCreateCollection;
var followDrinkingCollection;
var followLikeCollection;
var followerList;

//open the loading popup

$("#popupBasic").popup("open", {positionTo:"window"});

//update the current users follower list.

currentUser.fetch({
		success: function(currentUser) {  //updating the user realtion information (there might be a better way to do this)
   
   			var followersRelation = currentUser.relation("following");
   			//alert("updated");
   			
   			var followerQuery = followersRelation.query(); //get the followers from the current user
   			
   			
var drinkQuery = new Parse.Query("drinkObject");
drinkQuery.matchesKeyInQuery("createdBy", "username", followerQuery);

followCreateCollection = drinkQuery.collection(); // create the collection base on the drink -> follower query
   			
   			
   			//sort the collection based on date
  followCreateCollection.comparator = function(object) {
  return object.get("createdAt");
  
  };

//iterate through the colleciton and output to html
var h="";
followCreateCollection.fetch({
  success: function(collection) {
    collection.each(function(object) {
      //console.warn(object);
      h += "<div>";
     // alert(object.get("name"));
      h += object.get("createdBy")+" created ";
      h += object.get("name")+" <br/>on ";
      h += object.createdAt+"</div>";
    });
    $("#activityContainer").html(h);
    $("#popupBasic").popup("close");
  },
  error: function(collection, error) {
    // The collection could not be retrieved.
  }
});

   			
   			
   			
   			}//end of success of fetch current user data
   	}); //end of fetch current user data

 

}//end of updateActivityStream   

            
          //  alert('testing parse');


            