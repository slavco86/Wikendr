angular.module('RouteControllers', [])
    .controller('HomeController', function($scope) {
    })

    .controller('RegisterController', function($scope, $firebaseStorage, $firebaseObject, interestCheck) {
        $scope.registrationUser = {};
        $scope.registrationUser.interests = [];
        
        $scope.interestcheck = function(){
            var interests = $scope.registrationUser.interests;
            var userInterests = $scope.interests;
            console.log('ORIGINAL scope.interests:' + userInterests);
            angular.forEach(userInterests, function(key,value){
                console.log('key:' + key);
                if(key == false){
                   delete userInterests[value];
                   console.log('After DELETE scope.interests:' + userInterests);
                } else if(userInterests == {}){
                    interests = [];
                    console.log('if scope.interests is empty - reset database object:' + interests);
                    } else{
                    interests.push(key);
                    console.log('valid value was pushed to database object');
                    angular.forEach(interests, function(key,value){
                        console.log('checking for duplicate values in database object...')
                        var i = 0;
                        if(interests[i] == interests[i++]){
                            delete interests[i];
                        } i++
                    });
                    }
                
                console.log($scope.registrationUser.interests);
            });
        };
        $scope.submitForm = function(valid){
            if(valid){
            $scope.registrationUser.username = $scope.user.username;
            $scope.registrationUser.password = $scope.password;
            $scope.registrationUser.email = $scope.user.email;
            $scope.registrationUser.dob = $scope.userdob;
            $scope.registrationUser.gender = $scope.user.gender;
            $scope.registrationUserFile = $scope.user.file;
            if ($scope.registrationUserFile !== undefined){
                var storageRef = firebase.storage().ref('user-assets/' + $scope.registrationUser.username + "/" + $scope.registrationUserFile.name);
                storageRef.put($scope.registrationUserFile);
            }
            $scope.registrationUser.about = $scope.user.about;
            if ($scope.registrationUser.about == undefined){
                $scope.registrationUser.about = "undefined";
            }
            firebase.database().ref('users/' + $scope.registrationUser.username).set($scope.registrationUser);
            
            console.log($scope.registrationUser);
            }
            else{
                alert(registrationForm);
                
            }
        }
    })
    .controller('ProductController', function($scope){

    })
    .controller('UserController', function($scope){

    })
    .controller('GroupsController', function($scope){

    });