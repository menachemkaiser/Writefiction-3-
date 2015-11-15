'use strict';

/* Controllers */
app.controller('StoryListCtrl', ['$scope', '$http', '$state', '$localStorage', 'UserService', 'TemplateService', 'AdjustService', 
              function($scope, $http, $state, $localStorage, UserService, TemplateService, AdjustService) {

  $scope.templates = {};
  $scope.users = {};

  UserService.getUserList($scope.webtoken).success(function(cb) {
  	if (cb.success == true)
  	{
  		for (var i = 0; i < cb.users.length; i ++)
  			$scope.users[cb.users[i]._id] = cb.users[i].firstname + " " + cb.users[i].lastname;
  	}
	});

  TemplateService.getTemplateList($scope.webtoken).success(function(cb) {
    if (cb.success == true)
    {
  		$scope.templates = cb.templates;

  		for (var i = 0; i < $scope.templates.length; i ++)
  		{
  			if ($scope.templates[i].template && $scope.templates[i].template.length > 300)
  				$scope.templates[i].template = $scope.templates[i].template.substring(0, 297) + " ..."; 			
  		}
    }
	});

	$scope.editTemplate = function(id)
    {
      $state.go("admin.edittemplate", {id: id});
    }

    $scope.activateTemplate = function(id)
    {
      for (var i = 0; i < $scope.templates.length; i ++)
      {
        if ($scope.templates[i]._id == id)
        {
        	var tmp = !$scope.templates[i].status;

			TemplateService.updateTemplate($scope.webtoken, {_id: $scope.templates[i]._id, status: tmp}).success(function(cb) {
				if (cb.success){
					$scope.templates[i].status = tmp;

					if ($scope.templates[i].status == true)
					{
						$("#notification_success").fadeIn("slow").html('Template activated').delay(1000).fadeOut('slow');
					}else{
						$("#notification").fadeIn("slow").html('Template deactivated').delay(1000).fadeOut('slow');
					}
				}
			});

          break;
        }
      }
    }

    $scope.removeTemplate = function(id)
    {
      if (confirm("Do you really want to remove the template?"))
      {
        for (var i = 0; i < $scope.templates.length; i ++)
        {
          if ($scope.templates[i]._id == id)
          {
            TemplateService.deleteTemplateByID($scope.webtoken, id).success(function(cb) {
              if (cb.success == true)
              {
                $("#notification_success").fadeIn("slow").html('Successfully deleted.').delay(1000).fadeOut('slow');
                delete $scope.templates.splice(i, 1);

                $scope.$watch('templates', function() {
                    $('.footable').trigger('footable_redraw');
                });
              }else{
                $("#notification").fadeIn("slow").html('Not found.').delay(1000).fadeOut('slow');
              }
            });

            break;
          }
        }
      }
    }
}]);

app.controller('TemplateEditCtrl', ['$scope', '$stateParams', '$http', '$state', '$localStorage', 'UserService', 'TemplateService', 
              'GenreService', 'ConflictService', 'AdjustService', '$compile', 
              function($scope, $stateParams, $http, $state, $localStorage, UserService, TemplateService, GenreService, ConflictService, AdjustService, $compile) {

	$scope.edittemplate = {};
	$scope.isEdit = false;

  $scope.genres = [];
  $scope.multiSel = {};
  $scope.multiSel.selectedGenre = [];

  $scope.conflicts = [];
  $scope.multiSel2 = {};
  $scope.multiSel2.selectedConflict = [];

  $scope.adjusts = [];

  AdjustService.getActiveAdjustList($scope.webtoken).success(function(cb) {
    if (cb.success == true)
    {
      $scope.adjusts = cb.adjusts;
      readGenre();
    }
  });

  var readGenre = function(){
    GenreService.getActiveGenreList($scope.webtoken).success(function(cb) {
      if (cb.success == true)
      {
        for (var i = 0; i < cb.genres.length; i ++)
          $scope.genres.push({name: cb.genres[i].name});
        readConflict();
      }
    });
  }
  
  var readConflict = function(){
    ConflictService.getActiveConflictList($scope.webtoken).success(function(cb) {
      if (cb.success == true)
      {
        for (var i = 0; i < cb.conflicts.length; i ++)
          $scope.conflicts.push({name: cb.conflicts[i].name});
        
        readTemplate();
      }
    });
  }
  
  var readTemplate = function(){
    if ($stateParams.id !== ""){
  		$scope.isEdit = true;

  		TemplateService.getTemplateById($scope.webtoken, $stateParams.id).success(function(cb) {
  			if (cb.success == true)
  			{
  				$scope.edittemplate = cb.template;
          toGenreField();
          toConflictField();

          var custom_attr = angular.fromJson($scope.edittemplate.adjustable_attribute);
          for (var i = 0; i < $scope.adjusts.length; i ++)
          {
            if (typeof custom_attr[$scope.adjusts[i]._id] !== undefined)
            {
              angular.element("#slider_" + $scope.adjusts[i]._id).attr("value", custom_attr[$scope.adjusts[i]._id]);
              angular.element("#slider_" + $scope.adjusts[i]._id).attr("data-slider-value", custom_attr[$scope.adjusts[i]._id]);

              $("#slider_" + $scope.adjusts[i]._id).slider('setValue', custom_attr[$scope.adjusts[i]._id]);
            }
          }

          $scope.islideChange = 8;
  			}
  		});
  	}
  }

	$scope.cancel = function(){
		$state.go("admin.story");
	}

	$scope.updateTemplate = function(){
    var custom_attr = {};
    for (var i = 0; i < $scope.adjusts.length; i ++)
    {
      custom_attr[$scope.adjusts[i]._id] = $("#slider_" + $scope.adjusts[i]._id).val();
    }
    $scope.edittemplate.adjustable_attribute = angular.toJson(custom_attr);

    $scope.edittemplate.genres = fromGenreField();
    $scope.edittemplate.conflicts = fromConflictField();

		if ($scope.isEdit)
		{
			TemplateService.updateTemplate($scope.webtoken, $scope.edittemplate).success(function(cb) {
				if (cb.success == true)
				{
					$("#notification_success").fadeIn("slow").html('Successfully updated.').delay(1000).fadeOut('slow');
				}else{
					$("#notification").fadeIn("slow").html('Not found.').delay(1000).fadeOut('slow');
				}
			});
		}else{      
			TemplateService.addTemplate($scope.webtoken, $scope.edittemplate).success(function(cb) {
		    if (cb.success == true)
		    {
					$("#notification_success").fadeIn("slow").html('Successfully saved.').delay(1000).fadeOut('slow');
					$state.go("admin.story");
		    }else{
				 $("#notification").fadeIn("slow").html('Failed to create a new template.').delay(1000).fadeOut('slow');
		    }
			});
		}
	}

  var toGenreField = function(){
    var tmp = [];

    if ($scope.edittemplate.genres)
      tmp = $scope.edittemplate.genres.split("|");

    for (var i = 0; i < tmp.length; i ++)
    {
      for (var j = 0; j < $scope.genres.length; j ++)
        if ($scope.genres[j].name == tmp[i])
        {
          $scope.multiSel.selectedGenre.push($scope.genres[j]);
          break;
        }
    }
  }

  var fromGenreField = function(){
    var tmp = "";
    
    for (var i = 0; i < $scope.multiSel.selectedGenre.length; i ++)
    {
      if (tmp != "") tmp = tmp + "|";
      tmp += $scope.multiSel.selectedGenre[i].name;
    }

    return tmp;
  }

  var toConflictField = function(){
    var tmp = [];

    if ($scope.edittemplate.conflicts)
      tmp = $scope.edittemplate.conflicts.split("|");

    for (var i = 0; i < tmp.length; i ++)
    {
      for (var j = 0; j < $scope.conflicts.length; j ++)
        if ($scope.conflicts[j].name == tmp[i])
        {
          $scope.multiSel2.selectedConflict.push($scope.conflicts[j]);
          break;
        }
    }
  }

  var fromConflictField = function(){
    var tmp = "";
    
    for (var i = 0; i < $scope.multiSel2.selectedConflict.length; i ++)
    {
      if (tmp != "") tmp = tmp + "|";
      tmp += $scope.multiSel2.selectedConflict[i].name;
    }

    return tmp;
  }
}]);

app.filter('propsFilter', function() {
    return function(items, props) {
        var out = [];

        if (angular.isArray(items)) {
          items.forEach(function(item) {
            var itemMatches = false;

            var keys = Object.keys(props);
            for (var i = 0; i < keys.length; i++) {
              var prop = keys[i];
              var text = props[prop].toLowerCase();
              if (item[prop].toString().toLowerCase().indexOf(text) !== -1) {
                itemMatches = true;
                break;
              }
            }

            if (itemMatches) {
              out.push(item);
            }
          });
        } else {
          // Let the output be the input untouched
          out = items;
        }

        return out;
    };
})
