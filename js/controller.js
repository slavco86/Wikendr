angular.module('RouteControllers', [])
    .controller('HomeController', function($scope) {
    })

    .controller('RegisterController', function($scope, $firebaseStorage, $firebaseObject, Auth, store) {
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
                    firebase.database().ref('users/' + $scope.registrationUser.username).set($scope.registrationUser);
                })
            }
            //Create and authenticate new user
            Auth.$createUserWithEmailAndPassword($scope.registrationUser.email, $scope.password).then(function(firebaseUser){
                $scope.localUserObj = $scope.registrationUser;
                $scope.localUserObj.uid = firebaseUser.uid;
                $scope.localUserObj.token = firebaseUser.refreshToken;
                store.set('authUser', $scope.localUserObj);
                $scope.user = {};
                $scope.password = "";
                $scope.userdob = "";
                $scope.interests = {};
                alert("Thank you for registering with Wikendr! We hope you will enjoy the service.")
                console.log("firebase user: ",firebaseUser);
                console.log ("auth User: ", $scope.localUserObj);
            }).catch(function(error){
                console.log("Created User Error: ",error);
            });
            console.log($scope.registrationUser);
            }
            else{
                alert("Registration Form can not be submitted - please check if all fields have been entered correctly");
            }
        }
    })
    .controller('ProductController', function($scope){

    })
    .controller('UserController', function($scope){

    })
    .controller('GroupsController', function($scope){

    });