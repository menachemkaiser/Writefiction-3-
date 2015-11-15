'use strict';

/* Controllers */

app.controller('SigninFormController', ['$localStorage', '$scope', '$http', '$state', 'UserService',
                                function($localStorage, $scope, $http, $state, UserService) {
    $scope.user = {};
    $scope.authError = null;

    $scope.$storage = $localStorage.$default({});
    $scope.$storage.$reset({});

    $scope.login = function() {
      $scope.authError = null;
      
      UserService.userAuthenticate($scope.user).success(function(data){
        if (data.success){
          $scope.$storage.webtoken = data.token;
          $scope.$storage.user = angular.toJson(data.user);
          $state.go("admin.profile");
        }else{
          $scope.authError = "Wrong email or password.";
        }
      }).error(function(data){
        $scope.authError = "Wrong email or password.";
      });
    };
}]);