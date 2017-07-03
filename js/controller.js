angular.module('RouteControllers', [])
    .controller('HomeController', function($scope, Auth, store, $firebaseObject, $firebaseStorage, $location) {
        $scope.loginShow = false;
        var i = 1;
        $scope.showLogin = function(){
            $scope.loginShow = true;
            i++;
            if(i>2){
                $scope.loginShow = false;
                i=1;
                $scope.loginForm.$setPristine();
            }
        };
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
                console.log("Sign in error: ", error);
            });
            } else {
                alert("Login form is invalid, please check if all fields been entered correctly");
            }
            
        }
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
                var storageRef = firebase.storage().ref('user-assets/' + $scope.registrationUser.username + "/" + $scope.registrationUserFile.name);
                $scope.storage = $firebaseStorage(storageRef);
                var uploadTask = $scope.storage.$put($scope.registrationUserFile);
                uploadTask.$complete(function(snapshot){
                    $scope.registrationUser.picURL = snapshot.downloadURL;
                    //Submit user profile to DB
                    firebase.database().ref('users/' + $scope.registrationUser.uid).set($scope.registrationUser);
                })
            }
            //Create and authenticate new user
            Auth.$createUserWithEmailAndPassword($scope.registrationUser.email, $scope.password).then(function(firebaseUser){
                //prepare local user object to be passed to local storage
                //adding uid and token from Firebase user creation
                $scope.registrationUser.uid = firebaseUser.uid;
                var localUserObj = $scope.registrationUser;
                localUserObj.token = firebaseUser.refreshToken;
                localUserObj.uid = firebaseUser.uid;
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
            }).catch(function(error){
                console.log("Created User Error: ",error);
            });
            console.log("Created user with following object: ",$scope.registrationUser);
            }
            else{
                alert("Registration Form can not be submitted - please check if all fields have been entered correctly");
            }
        }
    })

    .controller('ProductController', function($scope){

    })

    .controller('UserController', function($scope, store, Auth, $firebaseStorage, $firebaseObject, $location ){
        $scope.authUser = store.get("authUser");
        console.log("User logged in with following object: ",$scope.authUser);
        $scope.searchCompleted = false;
        $scope.search = function(){
            $scope.searchCompleted = true;
        };
        $scope.logout = function(){
            Auth.$signOut();
            $location.url('/');
            $scope.authUser = store.set("authUser",{});
            alert("You have been successfully Logged-Out. Please sign-in again on homepage")
            console.log("Logout storage obj: ",$scope.authUser);
        }
    })

    .controller('GroupsController', function($scope){

    });