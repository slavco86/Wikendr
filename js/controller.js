angular.module('WikendrApp', [])
    .controller('PasswordController', function PasswordController($scope) {
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
            $scope.password = "";
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
        }
    })

    .controller('UserController', function($scope, store, Auth, $firebaseStorage, $firebaseObject, $location ){
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

        //toggle Search Results section
        $scope.searchCompleted = false;
        var i = 1;
        $scope.search = function(){
            $scope.searchCompleted = true;
            i++;
            if(i>2){
                $scope.searchCompleted = false;
                i=1;
            }
        };

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
            var dateStr = $scope.authUser.dob;
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
