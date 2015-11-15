'use strict';

/* Controllers */
app.controller('GenreListCtrl', ['$scope', '$http', '$state', '$localStorage', 'GenreService', 
              function($scope, $http, $state, $localStorage, GenreService) {
  
  $scope.genres = [];
  $scope.name = "";

  GenreService.getGenreList($scope.webtoken).success(function(cb) {
    if (cb.success == true)
    {
      $scope.genres = cb.genres;
    }
  });

  $scope.newEntry = function(){
    GenreService.addGenre($scope.webtoken, {name: $scope.name}).success(function(cb) {
        if (cb.success == true)
        {
          $("#notification_success").fadeIn("slow").html('Successfully created.').delay(1000).fadeOut('slow');
          $scope.genres.push(cb.genre);
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
      for (var i = 0; i < $scope.genres.length; i ++)
      {
        if ($scope.genres[i]._id == id)
        {
          GenreService.deleteGenreByID($scope.webtoken, id).success(function(cb) {
            if (cb.success == true)
            {
              $("#notification_success").fadeIn("slow").html('Successfully deleted.').delay(1000).fadeOut('slow');
              delete $scope.genres.splice(i, 1);
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
    for (var i = 0; i < $scope.genres.length; i ++)
    {
      if ($scope.genres[i]._id == id)
      {
        var tmp = !$scope.genres[i].status;

        GenreService.updateGenre($scope.webtoken, {_id: $scope.genres[i]._id, status: tmp}).success(function(cb) {
          if (cb.success){
            $scope.genres[i].status = tmp;

            if ($scope.genres[i].status == true)
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
  $scope.$watch('genres', function() {
    $('.footable').trigger('footable_redraw');
  });
}]);
