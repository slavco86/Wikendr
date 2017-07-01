angular.module('RouteControllers', [])
    .controller('HomeController', function($scope) {
    })

    .controller('RegisterController', function($scope, $firebaseStorage, $firebaseObject, Auth) {
        $scope.registrationUser = {};
        $scope.registrationUser.interests = [];
        $scope.interestcheck = function(){
            angular.forEach($scope.interests, function(key,value){
                if(key == false){
                   delete $scope.interests[value];
                } if (angular.equals({},$scope.interests)){
                    $scope.interests = {};
                }
            });
        };
        $scope.submitForm = function(valid){
            if(valid){
            $scope.registrationUser.username = $scope.user.username;
            $scope.registrationUser.password = $scope.password;
            $scope.registrationUser.email = $scope.user.email;
            $scope.registrationUser.dob = $scope.userdob;
            $scope.registrationUser.gender = $scope.user.gender;
            angular.forEach($scope.interests, function(key,value){
                $scope.registrationUser.interests.push(key);
            });
            $scope.registrationUserFile = $scope.user.file;
            if ($scope.registrationUserFile !== undefined){
                var storageRef = firebase.storage().ref('user-assets/' + $scope.registrationUser.username + "/" + $scope.registrationUserFile.name);
                $scope.storage = $firebaseStorage(storageRef);
                var uploadTask = $scope.storage.$put($scope.registrationUserFile);
                uploadTask.$complete(function(snapshot){
                    $scope.registrationUser.picURL = snapshot.downloadURL;
                })
            }
            $scope.registrationUser.about = $scope.user.about;
            if ($scope.registrationUser.about == undefined){
                $scope.registrationUser.about = "undefined";
            }
            firebase.database().ref('users/' + $scope.registrationUser.username).set($scope.registrationUser);
            Auth.$createUserWithEmailAndPassword($scope.registrationUser.email, $scope.registrationUser.password).then(function(firebaseUser){
                
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