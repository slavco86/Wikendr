angular.module('RouteControllers', [])
    .controller('HomeController', function($scope) {
        $scope.css = "home_page";
    })
    .controller('RegisterController', function($scope) {
        $scope.registrationUser = {};
        $scope.submitForm = function(valid){
            $scope.registrationUser.password = $scope.user.password;
            $scope.registrationUser.password2 = $scope.user.password2;
            $scope.usernameRgx = "/^[\w]*$/";
            $scope.passwordRgx = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$";
            $scope.emailRgx = "^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$";
            if(valid){
            $scope.registrationUser.name = $scope.user.name;
            $scope.registrationUser.surname = $scope.user.surname;
            $scope.registrationUser.email = $scope.user.email;
            $scope.registrationUser.dob = $scope.user.dob;
            $scope.registrationUser.gender = $scope.user.gender;
            $scope.registrationUser.interests = [];
            var interests = $scope.registrationUser.interests;
            var userInterests = $scope.user.interests;
            angular.forEach(userInterests, function(key, value) {
                this.push(key);
            }, interests);
            $scope.registrationUser.about = $scope.user.about;
            console.log($scope.registrationUser);
            }
            else{
                alert("Form is invalid")
            }
        }
    })
    .controller('ProductController', function($scope){

    })
    .controller('UserController', function($scope){

    })
    .controller('GroupsController', function($scope){

    });