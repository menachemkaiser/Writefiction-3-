'use strict';

/**
 * Config for the router
 */
angular.module('app')
  .run(
    [          '$rootScope', '$state', '$stateParams',
      function ($rootScope,   $state,   $stateParams) {
          $rootScope.$state = $state;
          $rootScope.$stateParams = $stateParams;        
      }
    ]
  )
  .config(
    [          '$stateProvider', '$urlRouterProvider', '$locationProvider', 'JQ_CONFIG', 'MODULE_CONFIG', 
      function ($stateProvider,   $urlRouterProvider, $locationProvider, JQ_CONFIG, MODULE_CONFIG) {
        $urlRouterProvider.otherwise('/app');

        $stateProvider
            .state('app', {
                url: '/app',
                templateUrl: "tpl/main.html",
                resolve: load( ['js/controllers/fiction.js'] )
            })
            .state('admin', {
                url: '/admin',
                controller: 'AppCtrl', 
                templateUrl: "tpl/admin.html"
            })
            .state('admin.profile', {
              url: '/profile',
              templateUrl: 'tpl/page_profile.html',
              resolve: load( ['js/controllers/profile.js'] )
            })
            .state('admin.genre', {
              url: '/genre',
              templateUrl: 'tpl/page_genres.html',
              resolve: load( ['js/controllers/genre.js'] )
            })
            .state('admin.conflict', {
              url: '/conflict',
              templateUrl: 'tpl/page_conflicts.html',
              resolve: load( ['js/controllers/conflict.js'] )
            })
            .state('admin.adjustable', {
              url: '/adjustable',
              templateUrl: 'tpl/page_adjusts.html',
              resolve: load( ['js/controllers/adjust.js'] )
            })
            .state('admin.story', {
              url: '/story',
              templateUrl: 'tpl/page_stories.html',
              resolve: load( ['js/controllers/story.js'] )
            })
            .state('admin.edittemplate', {
              url: '/template/:id',
              templateUrl: 'tpl/page_edittemplate.html',
              resolve: load( ['ui.select', 'vr.directives.slider', 'js/controllers/story.js'] )
            })
            .state('access', {
              url: '/access',
              template: '<div ui-view class="fade-in-right-big smooth"></div>'
            })
            .state('access.signin', {
              url: '/signin',
              templateUrl: 'tpl/page_signin.html',
              resolve: load( ['js/controllers/signin.js'] )
            });

        function load(srcs, callback) {
          return {
              deps: ['$ocLazyLoad', '$q',
                function( $ocLazyLoad, $q ){
                  var deferred = $q.defer();
                  var promise  = false;
                  srcs = angular.isArray(srcs) ? srcs : srcs.split(/\s+/);
                  if(!promise){
                    promise = deferred.promise;
                  }
                  angular.forEach(srcs, function(src) {
                    promise = promise.then( function(){
                      if(JQ_CONFIG[src]){
                        return $ocLazyLoad.load(JQ_CONFIG[src]);
                      }
                      angular.forEach(MODULE_CONFIG, function(module) {
                        if( module.name == src){
                          name = module.name;
                        }else{
                          name = src;
                        }
                      });
                      return $ocLazyLoad.load(name);
                    } );
                  });
                  deferred.resolve();
                  return callback ? promise.then(function(){ return callback(); }) : promise;
              }]
          }
        }
      }
    ]
  );
