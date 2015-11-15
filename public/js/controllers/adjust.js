'use strict';

/* Controllers */
app.controller('AdjustListCtrl', ['$scope', '$http', '$state', '$localStorage', 'AdjustService', 
              function($scope, $http, $state, $localStorage, AdjustService) {
  
  $scope.adjusts = [];
  $scope.name = "";

  AdjustService.getAdjustList($scope.webtoken).success(function(cb) {
    if (cb.success == true)
    {
      $scope.adjusts = cb.adjusts;
    }
  });

  $scope.newEntry = function(){
    AdjustService.addAdjust($scope.webtoken, {name: $scope.name}).success(function(cb) {
        if (cb.success == true)
        {
          $("#notification_success").fadeIn("slow").html('Successfully created.').delay(1000).fadeOut('slow');
          $scope.adjusts.push(cb.adjust);
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
      for (var i = 0; i < $scope.adjusts.length; i ++)
      {
        if ($scope.adjusts[i]._id == id)
        {
          AdjustService.deleteAdjustByID($scope.webtoken, id).success(function(cb) {
            if (cb.success == true)
            {
              $("#notification_success").fadeIn("slow").html('Successfully deleted.').delay(1000).fadeOut('slow');
              delete $scope.adjusts.splice(i, 1);
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
    for (var i = 0; i < $scope.adjusts.length; i ++)
    {
      if ($scope.adjusts[i]._id == id)
      {
        var tmp = !$scope.adjusts[i].status;

        AdjustService.updateAdjust($scope.webtoken, {_id: $scope.adjusts[i]._id, status: tmp}).success(function(cb) {
          if (cb.success){
            $scope.adjusts[i].status = tmp;

            if ($scope.adjusts[i].status == true)
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
  $scope.$watch('adjusts', function() {
    $('.footable').trigger('footable_redraw');
  });
}]);
