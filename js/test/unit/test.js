describe('PasswordController', function() {
 beforeEach(module('Controllers'));
 beforeEach(module('UserService'));
 beforeEach(module('angular-storage'));
 var Auth;
 var $firebaseAuth;
 var store;
beforeEach(module(function($provide){
$provide.factory('$firebaseAuth', function(){
  return function(){
    return $firebaseAuth;
  };
});
}));
beforeEach(module(function($provide){
  $provide.factory('store', function(){
    return function(){
      return store;
    };
  });
}));

 var $controller;
 beforeEach(inject(function(_$controller_, _store_){
  $controller = _$controller_;
  store = _store_;
 }));
 describe('password strength', function(){
  it('should be strong', function(){
    var $scope = {};
    var controller = $controller('PasswordController',{$scope: $scope, Auth: Auth, store: store});
    $scope.password = 'small';
    $scope.grade();
    expect($scope.strength).toBe('medium');
  })
 })
});
