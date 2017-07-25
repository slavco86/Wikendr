angular.module('RouteDirectives',[])
    .directive('passMatch', function(){
       return{
        restrict: 'A',
        controller: function($scope){
            $scope.passmatch = false;
            $scope.doMatch = function(values){
                if($scope.confirm == values){
                    $scope.passmatch = true;
                } else {
                    $scope.passmatch = false;
                }
            };
        },
        link: function(scope, element, attrs){
            attrs.$observe('passMatch', function(){
                scope.doMatch(attrs.passMatch);
            });
            scope.$watch('confirm', function(){
                scope.doMatch(attrs.passMatch);
            });
        }
       };
    })

    .directive('userMatch', function(){
       return{
        restrict: 'A',
        controller: function($scope){
            $scope.usermatch = false;
            $scope.doUserMatch = function(values){
                if($scope.password !== values){
                    $scope.usermatch = true;
                } else {
                    $scope.usermatch = false;
                }
            };
        },
        link: function(scope, element, attrs){
            attrs.$observe('userMatch', function(){
                scope.doUserMatch(attrs.userMatch);
            });
            scope.$watch('password', function(){
                scope.doUserMatch(attrs.userMatch);
            });
        }
       };
    })

    .directive('gender', function(){
        return{
            require: 'ngModel',
            link: function(scope, element, attrs, ctrl){
                var genderProvided = false;
                attrs.$observe('gender', function(){
                    if(attrs.gender !== ""){
                    genderProvided = true;
                    };
                ctrl.$setValidity('genderRequired', genderProvided);
                });
            }
        };
    })

    .directive('fileUpload', function($parse){
        return{
            restrict: 'A',
            link: function(scope, elem, attr){
                var model = $parse(attr.fileUpload);
                var modelSetter = model.assign;
                elem.bind('change', function(){
                    scope.$apply(function(){
                        modelSetter(scope, elem[0].files[0]);
                    });
                });
            }
        }
    })

    .directive('dobFormat', function($parse){
        return{
            restrict: 'A',
            controller: function($scope){
                $scope.userdob = null;
                $scope.assignValue = function(value){
                    $scope.userdob = value;
                }
            },
            link: function(scope,elem,attr){
                attr.$observe('dobFormat',function(){
                    var value = attr.dobFormat;
                    scope.assignValue(value);
                    });
            }
        }
    })

    .directive('interest', function(){
        return{
            require: 'ngModel',
            link: function(scope, element, attrs, ctrl){
                var interestProvided = false;
                var interestPristine = false;
                attrs.$observe('interest', function(){
                    var interestProvided = false;
                    if(JSON.stringify(attrs.interest).length>4){
                    interestProvided = true;
                    };  
                    if(JSON.stringify(attrs.interest).length>2){
                    interestPristine = true;
                    };
                ctrl.$setValidity('interestRequired', interestProvided);
                ctrl.$setValidity('interestPristine', interestPristine);
                });
            }
        };
    })
    
// HTML Block Elemetns
    .directive('navsection', function(){
        return{
            restrict: "E",
            templateUrl: "templates/partials/navsection.html"
        };
    })

    .directive('carousel', function(){
        return{
            restrict: "E",
            templateUrl: "templates/partials/carousel.html"
        }
    })

     .directive('carouselitems', function(){
         return{
            restrict: "E",
            templateUrl: "templates/partials/carouselitems.html"
         }
    });
