angular.module('Controllers', [])
    .controller('PasswordController', function($scope, Auth, store) {
      $scope.password = '';
      $scope.grade = function() {
        var size = $scope.password.length;
        if (size > 8) {
          $scope.strength = 'strong';
        } else if (size > 3) {
          $scope.strength = 'medium';
        } else {
          $scope.strength = 'weak';
        }
      }
      $scope.authUser = store.get("authUser");
    })
    .controller('HomeController', function($scope, Auth, store, $firebaseObject, $firebaseStorage, $location) {
        //Check for Auth User and Toggle Navigation
        $scope.authUser = store.get("authUser");
        if(angular.equals({},$scope.authUser) || $scope.authUser === null){
            $scope.userLoggedIn = false;
        } 
        else {
            $scope.userLoggedIn = true;
            if($scope.authUser.about == "undefined"){
                $scope.authUser.about = ("Looks like " + $scope.authUser.username + " hasn't provided much info about themselves. If you would like to update your profile information, please head over to Settings section, under your user profile")
            }
        }
        // Toggle Login section
        $scope.loginShow = false;
        var i = 1;
        $scope.loginToggle = function(){
            $scope.loginShow = true;
            i++;
            if(i>2){
                $scope.loginShow = false;
                i=1;
                $scope.loginForm.$setPristine();
            }
        };
        // Login function
        $scope.login = function(valid){
            if (valid){
             Auth.$signInWithEmailAndPassword($scope.email,$scope.password).then(function(firebaseUser){
                console.log('Returned Firebase User: ',firebaseUser);
                $scope.uid = firebaseUser.uid;
                $scope.token = firebaseUser.refreshToken;
                return firebase.database().ref('/users/' + firebaseUser.uid ).once('value').then(function(snapshot) {
                    var userObj = {}
                    userObj.username = snapshot.val().username;
                    userObj.email = snapshot.val().email;
                    userObj.dob = snapshot.val().dob;
                    userObj.about = snapshot.val().about;
                    userObj.gender = snapshot.val().gender;
                    userObj.interests = snapshot.val().interests;
                    userObj.picURL = snapshot.val().picURL;
                    userObj.uid = $scope.uid;
                    userObj.token = $scope.token;
                    store.set('authUser',userObj);
                    console.log("Local Storage User...",userObj);
                    if (angular.equals(firebaseUser.uid,userObj.uid)){
                        $location.url('/accounts/user');
                    }
            });
        }).catch(function(error){
                $scope.loginForm.$setPristine();
                alert("Incorrect email or password, please try again...");
            });
        } else {
                $scope.loginForm.$setPristine();
                alert("Login form is invalid, please check if all fields been entered correctly. If you are not registered, please register first.");
            }
            
        };
        
        // Logout Function
        $scope.logout = function(){
            Auth.$signOut();
            $location.url('/');
            $scope.authUser = store.set("authUser",{});
            $scope.userLoggedIn = false;
            alert("You have been successfully Logged-Out. Please sign-in again on homepage");
            console.log("Logout storage obj: ",$scope.authUser);
        };

        //Calculate Age
        $scope.getAge = function(){
            var dateStr = $scope.authUser.dob;
            var dob = dateStr.split("-");
            var birthday = new Date(dob[2], dob[1] - 1, dob[0]);
            var today = new Date();
            var age = ((today - birthday) / (31557600000));
            var age = Math.floor( age );
            $scope.userAge = age;
        };

        
    })

    .controller('RegisterController', function($scope, $firebaseStorage, $firebaseObject, Auth, store, $location) {
        $scope.formSubmitSuccess = false;
        $scope.registrationUser = {};
        $scope.registrationUser.interests = [];
        // Checking if "interests" object contains keys with value "false"(generated when user has 
        //deselected one of the checkboxes) and remove those keys from object
        //if the only keys contained in object are with no values - reset to an empty object
        //to trigger validation error
        $scope.interestcheck = function(){
            angular.forEach($scope.interests, function(key,value){
                if(key == false){
                   delete $scope.interests[value];
                } if (angular.equals({},$scope.interests)){
                    $scope.interests = {};
                }
            });
        };
        // Form submit 
        $scope.submitForm = function(valid){
            $scope.registrationForm.$setPristine();
                $scope.formSubmitSuccess = true;
            if(valid){
                //Bind form input elements to user profile object to be pushed to DB
            $scope.registrationUser.username = $scope.user.username;
            $scope.registrationUser.email = $scope.user.email;
            $scope.registrationUser.dob = $scope.userdob;
            $scope.registrationUser.gender = $scope.user.gender;
            // Create an array of interests to be pushed to DB from preliminary object
            angular.forEach($scope.interests, function(key,value){
                $scope.registrationUser.interests.push(key);
            });
            //Check if user provided "About" description, if not - submit a string "undefined"
            //otherwise, DB will push back an error - can not create entry with empty objects
            $scope.registrationUser.about = $scope.user.about;
            if ($scope.registrationUser.about == undefined){
                $scope.registrationUser.about = "undefined";
            }
            //Check if the user has provided profile picture and submit it to storage
            $scope.registrationUserFile = $scope.user.file;
            if ($scope.registrationUserFile !== undefined){
                console.log($scope.registrationUserFile);
                var storageRef = firebase.storage().ref('user-assets/' + $scope.registrationUser.username + "/" + $scope.registrationUserFile.name);
                $scope.storage = $firebaseStorage(storageRef);
                var uploadTask = $scope.storage.$put($scope.registrationUserFile);
                uploadTask.$complete(function(snapshot){
                    $scope.registrationUser.picURL = snapshot.downloadURL;
                    //Create and authenticate new user
                    Auth.$createUserWithEmailAndPassword($scope.registrationUser.email, $scope.password).then(function(firebaseUser){
                        $scope.registrationUser.uid = firebaseUser.uid;
                        $scope.registrationUser.token = firebaseUser.refreshToken;
                        //Submit user profile to DB
                        firebase.database().ref('users/' + $scope.registrationUser.uid).set($scope.registrationUser);
                    });
                })
            } else {
                $scope.registrationUser.picURL = "img/profile_pic_placeholder.png";
                //Create and authenticate new user
                Auth.$createUserWithEmailAndPassword($scope.registrationUser.email, $scope.password).then(function(firebaseUser){
                    $scope.registrationUser.uid = firebaseUser.uid;
                    $scope.registrationUser.token = firebaseUser.refreshToken;
                    //Submit user profile to DB
                    firebase.database().ref('users/' + $scope.registrationUser.uid).set($scope.registrationUser);
                });
            }
            var localUserObj = $scope.registrationUser;
            store.set('authUser',localUserObj);
            //reset the form and ng-model
            $scope.user = {};
            $scope.userdob = "";
            $scope.interests = {};
            localUserObj = {};
            if($scope.formSubmitSuccess){
                alert("Thank you for registering with Wikendr! We hope you will enjoy the service.");
                $location.url('/accounts/user');
            }
            console.log("Created user with following object: ",$scope.registrationUser);
            }
            else{
                alert("Registration Form can not be submitted - please check if all fields have been entered correctly");
            }
        }
    })

    .controller('ProductController', function($scope, Auth, store, $firebaseObject, $firebaseStorage, $location){
        // Logout Function
        $scope.logout = function(){
            Auth.$signOut();
            $location.url('/');
            $scope.authUser = store.set("authUser",{});
            alert("You have been successfully Logged-Out. Please sign-in again on homepage");
            $scope.userLoggedIn = false;
            console.log("Logout storage obj: ",$scope.authUser);
        };
        //Calculate Age
        $scope.getAge = function(){
            var dateStr = $scope.authUser.dob;
            var dob = dateStr.split("-");
            var birthday = new Date(dob[2], dob[1] - 1, dob[0]);
            var today = new Date();
            var age = ((today - birthday) / (31557600000));
            var age = Math.floor( age );
            $scope.userAge = age;
        };

        //Check for Auth User and Toggle Navigation
        $scope.authUser = store.get("authUser");
        if(angular.equals({},$scope.authUser)){
            $scope.userLoggedIn = false;
        } 
        else {
            $scope.userLoggedIn = true;
                if($scope.authUser.about == "undefined")
                {
                $scope.authUser.about = ("Looks like " + $scope.authUser.username + " hasn't provided much info about themselves. If you would like to update your profile information, please head over to Settings section, under your user profile")
                }
        };
        //Get placeObj
        $scope.placeObj = store.get("placeObj");
        console.log($scope.placeObj);
        
        
        //Create Map
        $scope.createMap = function(){
            var placePosition = $scope.placeObj.placePosition;
            var map = new google.maps.Map(document.getElementById("map"), {
              zoom: 15,
              center: placePosition
            });
            
            $scope.map = map;
            var marker = new google.maps.Marker({
                position: placePosition,
                map: map
              });
              $scope.map = map;
              $scope.placePosition = placePosition;
            
            console.log(placePosition);
        };
        $scope.createMap();
        $scope.resize = function(){
            var map = $scope.map;
            var placePosition = $scope.placePosition;
            google.maps.event.trigger(map, 'resize');
            map.setCenter(placePosition);
            console.log("resizing")
        };
        setTimeout($scope.resize, 50);
    })

    .controller('UserController', function($scope, store, Auth, $firebaseStorage, $firebaseObject, $location, $timeout ){
        //Check for Auth User and Toggle Navigation
        $scope.authUser = store.get("authUser");
        if(angular.equals({},$scope.authUser) || $scope.authUser === null){
            $scope.userLoggedIn = false;
        } 
        else {
            $scope.userLoggedIn = true;
            if($scope.authUser.about == "undefined"){
                $scope.authUser.about = ("Looks like " + $scope.authUser.username + " hasn't provided much info about themselves. If you would like to update your profile information, please head over to Settings section, under your user profile")
            }
        }
        //toggle Search Results section
        $scope.searchCompleted = false;
        $scope.loader = false;
        $scope.search = function(){
            var i = 1;
            i++;
            if(i>2){
                $scope.searchCompleted = false;
                i=1;
            }
            $scope.searchSubmit();
        };
        // Search Function
        $scope.searchSubmit = function(){
            $scope.loader = true;
            $scope.ratingStatementBank=["Stay Away","Not Good","Half-Decent","Not Bad","Alright","Good","Nice","Great","Super","Awesome","Exceptional","Crazy Good","Heaven!"]
            $scope.searchResults=[];
            $scope.placeIds = [];
            $scope.placesObj = [];
            $scope.singlePlacePhotos = [];
            $scope.currentCoordinate = {};
            $scope.index = 0;
            $scope.currrentLocation = navigator.geolocation.getCurrentPosition(function(position){
                var currentLat = position.coords.latitude;
                var currentLng = position.coords.longitude;
                $scope.currentLat = currentLat;
                $scope.currentLng = currentLng;
                $scope.map = new google.maps.Map(document.getElementById('map'),{
                    center: {lat: currentLat, lng: currentLng},
                    zoom: 15
                });
                var request = {
                    location: {lat: currentLat, lng: currentLng},
                    radius: 5000,
                    query: $scope.searchTerm
                };
                $scope.service = new google.maps.places.PlacesService($scope.map);
                $scope.service.textSearch(request, callback);
                function callback (results, status){
                    if (status == google.maps.places.PlacesServiceStatus.OK) {
                        for(var i = 0, result; result = results[i]; i++){
                            if(result.photos === undefined){continue;}
                            var detailsRequest = {};
                            detailsRequest.placeId = result.place_id;
                            $scope.placeIds.push(detailsRequest);
                        }
                        for (var a = 0; a < 4; a++){
                            if(a === 3){
                                $scope.searchCompleted = true;
                            }
                            $scope.service.getDetails($scope.placeIds[a], detailsCallback);
                            function detailsCallback (place, placeStatus){
                                if (placeStatus == google.maps.places.PlacesServiceStatus.OK){
                                    $scope.placesObj.push(place);
                                    var placeDetails = place;
                                    var placeRating = place.rating;
                                    var reviews = place.reviews;
                                    var reviewRatingsArray = [];
                                    placeDetails.reviewRatingsArray = [];
                                    for (var k=0; k<reviews.length; k++){
                                        var rating = reviews[k].rating;
                                        reviewRatingsArray.push(new Array(rating));
                                        
                                    }
                                    placeDetails.reviewRatingsArray[k] = reviewRatingsArray;
                                    var halfRating = false;
                                    var ratingArray=[];
                                    var fullRating = placeRating.toFixed(0);
                                    if(placeRating % 1 != 0){
                                        halfRating = true;
                                    }
                                    placeDetails.halfRating = halfRating;
                                    if(fullRating > placeRating){
                                        fullRating--;
                                        for(var q = 0; q < fullRating; q++){
                                            ratingArray.push(q);
                                        }
                                         placeDetails.ratingArray = ratingArray
                                    } else {
                                        for(var w = 0; w < fullRating; w++){
                                            ratingArray.push(w);
                                        }
                                        placeDetails.ratingArray = ratingArray;
                                    }
                                    if(placeRating > 0 && placeRating < 2){
                                        placeDetails.ratingStatement = $scope.ratingStatementBank[0];
                                    } else if (placeRating >= 2 && placeRating < 3){
                                        placeDetails.ratingStatement = $scope.ratingStatementBank[1];
                                    } else if (placeRating >= 3 && placeRating < 4){
                                        placeDetails.ratingStatement = $scope.ratingStatementBank[2];
                                    } else if (placeRating == 4){
                                        placeDetails.ratingStatement = $scope.ratingStatementBank[3];
                                    } else if (placeRating == 4.1){
                                        placeDetails.ratingStatement = $scope.ratingStatementBank[4];
                                    } else if (placeRating == 4.2){
                                        placeDetails.ratingStatement = $scope.ratingStatementBank[5];
                                    } else if (placeRating == 4.3){
                                        placeDetails.ratingStatement = $scope.ratingStatementBank[6];
                                    } else if (placeRating == 4.4){
                                        placeDetails.ratingStatement = $scope.ratingStatementBank[7];
                                    } else if (placeRating == 4.5){
                                        placeDetails.ratingStatement = $scope.ratingStatementBank[8];
                                    } else if (placeRating == 4.6){
                                        placeDetails.ratingStatement = $scope.ratingStatementBank[9];
                                    } else if (placeRating == 4.7){
                                        placeDetails.ratingStatement = $scope.ratingStatementBank[10];
                                    } else if (placeRating == 4.8){
                                        placeDetails.ratingStatement = $scope.ratingStatementBank[11];
                                    } else if (placeRating == 4.9){
                                        placeDetails.ratingStatement = $scope.ratingStatementBank[12];
                                    } else if (placeRating >= 5){
                                        placeDetails.ratingStatement = $scope.ratingStatementBank[13];
                                    }
                                    var period = place.opening_hours.periods;
                                    placeDetails.timeArray = new Array(7);
                                    for(var c = 0; c < period.length; c++){
                                        if(period[c].close === undefined){
                                            for( var m = 0; m < placeDetails.timeArray.length; m++){
                                                placeDetails.timeArray[m] = "Unkown"
                                            }
                                        } else {
                                            var openHours = "0";
                                            if(period[c].open.hours === 0){
                                                openHours = "12"
                                            } else  if(period[c].open.hours < 10){
                                                openHours = openHours + period[c].open.hours.toString();
                                            } else{
                                                openHours = period[c].open.hours.toString();
                                            }
                                            var openMinutes = "0";
                                            if(period[c].open.minutes < 10){
                                                openMinutes = openMinutes + period[c].open.minutes.toString();
                                            } else {
                                                openMinutes = period[c].open.minutes.toString();
                                            }
                                            var openTime = openHours + ":" + openMinutes;
                                            var closeHours = "0";
                                            if(period[c].close.hours < 10){
                                                closeHours = closeHours + period[c].close.hours.toString();
                                            } else if(period[c].close.hours === 0){
                                                closeHours = "12"
                                            } else {
                                                closeHours = period[c].close.hours.toString();
                                            }
                                            var closeMinutes = "0";
                                            if(period[c].close.minutes < 10){
                                                closeMinutes = closeMinutes + period[c].close.minutes.toString();
                                            } else {
                                                closeMinutes = period[c].close.minutes.toString();
                                            }
                                            var closeTime = closeHours + ":" + closeMinutes;
                                            var operatingHours = openTime + " - " + closeTime;
                                            var day = period[c].open.day;
                                            if(day == 0){
                                                day = 7;
                                            } else {
                                                day = day-1;
                                            }
                                            placeDetails.timeArray[day] = operatingHours;
                                        }
                                    }
                                    
                                    for( var v = 0; v < placeDetails.timeArray.length; v++){
                                        if(placeDetails.timeArray[v] === undefined){
                                            placeDetails.timeArray[v] = "Closed"
                                        } else {
                                            continue;
                                        }
                                    }
                                    var photos = place.photos;
                                    for(var b = 0; b < photos.length; b++){
                                        var photo = photos[b].getUrl({'maxWidth': 789, 'maxHeight': 554});
                                        $scope.singlePlacePhotos.push(photo);
                                    }
                                    placeDetails.photoUrls = $scope.singlePlacePhotos;
                                    $scope.singlePlacePhotos = [];
                                    $scope.$apply();
                                    console.log($scope.singlePlacePhotos);
                                    $scope.index++;
                                    if($scope.index == 4){
                                        $scope.createMaps();
                                        $scope.loader = false;
                                        $scope.$apply();
                                    }
                                } else {
                                    console.log(placeStatus);
                                }
                            }
                        }
                        console.log($scope.placesObj);
                        
                        
                    } else {
                        console.log(status);
                    } 
                }
                
            });
            
        }
        // Create Maps
        $scope.createMaps = function(){
            for(index = 0; index < 4; index++){
                var elemId = "map-" + index;
                var placePosition = $scope.placesObj[index].geometry.location;
                console.log(placePosition);
                var map = new google.maps.Map(document.getElementById(elemId), {
                  zoom: 15,
                  center: placePosition
                });
                $scope.map = map;
                var marker = new google.maps.Marker({
                  position: placePosition,
                  map: map
                });
            }
        }
        //Redirect
        $scope.redirect = function(index){
            var map = $scope.map;
            var placeObj = $scope.placesObj[index];
            var lat = placeObj.geometry.location.lat();
            var lng = placeObj.geometry.location.lng();
            placeObj.placePosition = {};
            placeObj.placePosition.lat = lat;
            placeObj.placePosition.lng = lng;
            store.set('placeObj',placeObj);
            store.set('map',map);
            $location.url('/products/product');
        }
        //Logout Function
        $scope.logout = function(){
            Auth.$signOut();
            $location.url('/');
            $scope.authUser = store.set("authUser",{});
            alert("You have been successfully Logged-Out. Please sign-in again on homepage")
            console.log("Logout storage obj: ",$scope.authUser);
        }
        //Calculate Age
        $scope.getAge = function(){
            $scope.authUser = store.get("authUser");
            var dateStr = $scope.authUser.dob;
            console.log($scope.authUser.dob);
            var dob = dateStr.split("-");
            var birthday = new Date(dob[2], dob[1] - 1, dob[0]);
            var today = new Date();
            var age = ((today - birthday) / (31557600000));
            var age = Math.floor( age );
            $scope.userAge = age;
        };
    })

    .controller('GroupsController', function($scope, Auth, store, $firebaseObject, $firebaseStorage, $location){
        //Check for Auth User and Toggle Navigation
        $scope.authUser = store.get("authUser");
        if(angular.equals({},$scope.authUser)){
            $scope.userLoggedIn = false;
        } 
        else {
            $scope.userLoggedIn = true;
                if($scope.authUser.about == "undefined")
                {
                $scope.authUser.about = ("Looks like " + $scope.authUser.username + " hasn't provided much info about themselves. If you would like to update your profile information, please head over to Settings section, under your user profile")
                }
        }
        // Logout Function
        $scope.logout = function(){
            Auth.$signOut();
            $location.url('/');
            $scope.authUser = store.set("authUser",{});
            alert("You have been successfully Logged-Out. Please sign-in again on homepage");
            $scope.userLoggedIn = false;
            console.log("Logout storage obj: ",$scope.authUser);
        };
        //Calculate Age
        $scope.getAge = function(){
            var dateStr = $scope.authUser.dob;
            var dob = dateStr.split("-");
            var birthday = new Date(dob[2], dob[1] - 1, dob[0]);
            var today = new Date();
            var age = ((today - birthday) / (31557600000));
            var age = Math.floor( age );
            $scope.userAge = age;
        };
    });
