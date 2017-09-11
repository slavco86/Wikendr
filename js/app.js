angular.module('WikendrApp', ['ngRoute', 'ngTouch', 'Controllers', 'RouteDirectives', 'UserService', 'firebase', 'angular-storage']);
 
angular.module('WikendrApp').config(function($locationProvider, $routeProvider) {
    $locationProvider.html5Mode(true);  // Enable href routing without hashes
 
    $routeProvider.when('/', {
        templateUrl: 'templates/home.html',
        controller: 'HomeController'
    })
    .when('/accounts/register', {
        templateUrl: 'templates/register.html',
        controller: 'RegisterController'
    })
    .when('/products/product',{
        templateUrl: 'templates/product.html',
        controller:'ProductController'
    })
    .when('/accounts/user', {
        templateUrl: 'templates/user.html',
        controller: 'UserController'
    })
    .when('/groups', {
        templateUrl:'templates/groups.html',
        controller: 'GroupsController'
    })
});
angular.module('WikendrApp').run(function($rootScope, $window) {
    
      $rootScope.$on('$routeChangeSuccess', function () {
    
        var interval = setInterval(function(){
          if (document.readyState == 'complete') {
            $window.scrollTo(0, 0);
            clearInterval(interval);
          }
        }, 200);
    
      });
    });