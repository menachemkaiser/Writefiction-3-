'use strict';

/* Controllers */
app.controller('FictionCtrl', ['$scope', '$http', '$state', '$localStorage', 'GenreService', 'ConflictService',
                            'AdjustService', 'TemplateService', 
              function($scope, $http, $state, $localStorage, GenreService, ConflictService, AdjustService, TemplateService) {
  $scope.story_result = false;
  $scope.genres = [];
  $scope.characters = [{firstname: "", lastname: ""}];
  $scope.title = "";

  GenreService.getActiveGenreList($scope.webtoken).success(function(cb) {
    if (cb.success == true)
    {
      $scope.genres = cb.genres;

      for (var i = 0; i < $scope.genres.length; i ++)
      {
        $scope.genres[i].chk = false;
      }
    }
  });

  $scope.conflicts = [];

  ConflictService.getActiveConflictList($scope.webtoken).success(function(cb) {
    if (cb.success == true)
    {
      $scope.conflicts = cb.conflicts;

      for (var i = 0; i < $scope.conflicts.length; i ++)
      {
        $scope.conflicts[i].chk = false;
      }
    }
  });

  $scope.adjusts = [];

  AdjustService.getActiveAdjustList($scope.webtoken).success(function(cb) {
    if (cb.success == true)
    {
      $scope.adjusts = cb.adjusts;
    }
  });

  $scope.char_cnt = 1;

  $scope.changeNumberOfCharacters = function(){
    
    if ($scope.char_cnt > $scope.characters.length)
    {
      var cmp = $scope.characters.length;
      for (var i = 0; i < $scope.char_cnt - cmp; i ++)
      {
        var tmp = {firstname: "", lastname: ""};
        $scope.characters[$scope.characters.length] = tmp;
      }
    }
    else if ($scope.char_cnt < $scope.characters.length)
    {
      var cmp = $scope.characters.length;
      for (var i = 0; i < cmp - $scope.char_cnt; i ++)
      {
        $scope.characters.splice($scope.characters.length - 1, 1);
      }
    }
  }

  $scope.generate = function(){
    if ($scope.title == "")
    {
      $("#notification").fadeIn("slow").html('Title field cannot be empty.').delay(1000).fadeOut('slow');
      return;
    }

    for (var i = 0; i < $scope.genres.length; i ++)
      if ($scope.genres[i].chk == true) break;
    
    if (i == $scope.genres.length)
    {
      $("#notification").fadeIn("slow").html('You should check at least 1 genre.').delay(1000).fadeOut('slow');
      return;
    }

    for (var i = 0; i < $scope.conflicts.length; i ++)
      if ($scope.conflicts[i].chk == true) break;
    
    if (i == $scope.conflicts.length)
    {
      $("#notification").fadeIn("slow").html('You should check at least 1 conflict.').delay(1000).fadeOut('slow');
      return;
    }

    var params = {};
    params.title = $scope.title;
    params.characters = $scope.characters;
    
    params.genres = [];
    for (var i = 0; i < $scope.genres.length; i ++)
      if ($scope.genres[i].chk == true)
        params.genres.push($scope.genres[i].name);

    params.conflicts = [];
    for (var i = 0; i < $scope.conflicts.length; i ++)
      if ($scope.conflicts[i].chk == true)
        params.conflicts.push($scope.conflicts[i].name);

    var custom_attr = {};
    for (var i = 0; i < $scope.adjusts.length; i ++)
    {
      custom_attr[$scope.adjusts[i]._id] = $("#slider_" + $scope.adjusts[i]._id).val();
    }
    params.adjusts = custom_attr;

    TemplateService.generateFiction(params).success(function(cb) {
      if (cb.success == true)
      {
        $scope.story_result = true;
        angular.element("#story").html(cb.story);
        $("#notification_success").fadeIn("slow").html('Fiction generated successfully.').delay(1000).fadeOut('slow');
      }else{
        $("#notification").fadeIn("slow").html('Failed to generate fiction.').delay(1000).fadeOut('slow');
      }
    });
  }

  $scope.back = function(){
    $scope.story_result = false;
  }
}]);
