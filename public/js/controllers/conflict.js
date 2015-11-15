'use strict';

/* Controllers */
app.controller('ConflictListCtrl', ['$scope', '$http', '$state', '$localStorage', 'ConflictService', 
              function($scope, $http, $state, $localStorage, ConflictService) {
  
  $scope.conflicts = [];
  $scope.name = "";

  ConflictService.getConflictList($scope.webtoken).success(function(cb) {
    if (cb.success == true)
    {
      $scope.conflicts = cb.conflicts;
    }
  });

  $scope.newEntry = function(){
    ConflictService.addConflict($scope.webtoken, {name: $scope.name}).success(function(cb) {
        if (cb.success == true)
        {
          $("#notification_success").fadeIn("slow").html('Successfully created.').delay(1000).fadeOut('slow');
          $scope.conflicts.push(cb.conflict);
          $scope.name = "";
        }else{
          $("#notification").fadeIn("slow").html('Failed to create.').delay(1000).fadeOut('slow');
        }
    });
  }

  $scope.removeItem = function(id)
  {
    if (confirm("Do you really want to remove the item?"))
    {
      for (var i = 0; i < $scope.conflicts.length; i ++)
      {
        if ($scope.conflicts[i]._id == id)
        {
          ConflictService.deleteConflictByID($scope.webtoken, id).success(function(cb) {
            if (cb.success == true)
            {
              $("#notification_success").fadeIn("slow").html('Successfully deleted.').delay(1000).fadeOut('slow');
              delete $scope.conflicts.splice(i, 1);
            }else{
              $("#notification").fadeIn("slow").html('Not found.').delay(1000).fadeOut('slow');
            }
          });

          break;
        }
      }
    }
  }

  $scope.activate_deactivate = function(id)
  {
    for (var i = 0; i < $scope.conflicts.length; i ++)
    {
      if ($scope.conflicts[i]._id == id)
      {
        var tmp = !$scope.conflicts[i].status;

        ConflictService.updateConflict($scope.webtoken, {_id: $scope.conflicts[i]._id, status: tmp}).success(function(cb) {
          if (cb.success){
            $scope.conflicts[i].status = tmp;

            if ($scope.conflicts[i].status == true)
            {
              $("#notification_success").fadeIn("slow").html('Activated!').delay(1000).fadeOut('slow');
            }else{
              $("#notification").fadeIn("slow").html('Deactivated!').delay(1000).fadeOut('slow');
            }
          }
        });

        break;
      }
    }
  }
  $scope.$watch('conflicts', function() {
    $('.footable').trigger('footable_redraw');
  });
}]);
