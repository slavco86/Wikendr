angular.module('RouteDirectives',[])
    .directive('passMatch', function(){
       return{
        restrict: 'A',
        controller: function($scope){
            $scope.match = false;
            $scope.doMatch = function(values){
                if($scope.confirm == values){
                    $scope.match = true;
                } else {
                    $scope.match = false;
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
    });