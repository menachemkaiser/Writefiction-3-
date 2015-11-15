'use strict';

/* Services */
var CustomService = angular.module('CustomService', ['ngResource']);

CustomService.factory('TemplateService',['$http',
    function($http){   
        
        return {
            addTemplate: function(webtoken, params) {
                return $http.post("/api/templates/add?token=" + webtoken, params);
            },

            updateTemplate: function(webtoken, params) {
                return $http.post("/api/templates/updateByID/" + params._id + "?token=" + webtoken, params);
            },

            getTemplateList: function(webtoken){
              return $http.get("/api/templates/getList?token=" + webtoken);
            },

            deleteTemplateByID: function(webtoken, id) {
                return $http.get("/api/templates/deleteByID/" + id + "?token=" + webtoken);
            },

            getTemplateById: function(webtoken, id){
                return $http.get("/api/templates/getInformationByID/" + id + "?token=" + webtoken);
            },

            addGenre: function(webtoken, params) {
                return $http.post("/api/genres/add?token=" + webtoken, params);
            },

            generateFiction: function(params){
                return $http.post("/api/generate", params);
            }
        }
    }
]);

CustomService.factory('GenreService',['$http',
    function($http){   
        
        return {
            addGenre: function(webtoken, params) {
                return $http.post("/api/genres/add?token=" + webtoken, params);
            },

            getGenreList: function(webtoken){
              return $http.get("/api/genres/getList?token=" + webtoken);
            },

            getActiveGenreList: function(webtoken){
              return $http.get("/api/genres/getActiveList?token=" + webtoken);
            },

            deleteGenreByID: function(webtoken, id){
              return $http.get("/api/genres/deleteByID/" + id + "?token=" + webtoken);
            },

            updateGenre: function(webtoken, params) {
                return $http.post("/api/genres/updateByID/" + params._id + "?token=" + webtoken, params);
            },
        }
    }
]);

CustomService.factory('ConflictService',['$http',
    function($http){   
        
        return {
            addConflict: function(webtoken, params) {
                return $http.post("/api/conflicts/add?token=" + webtoken, params);
            },

            getConflictList: function(webtoken){
              return $http.get("/api/conflicts/getList?token=" + webtoken);
            },

            getActiveConflictList: function(webtoken){
              return $http.get("/api/conflicts/getActiveList?token=" + webtoken);
            },

            deleteConflictByID: function(webtoken, id){
              return $http.get("/api/conflicts/deleteByID/" + id + "?token=" + webtoken);
            },

            updateConflict: function(webtoken, params) {
                return $http.post("/api/conflicts/updateByID/" + params._id + "?token=" + webtoken, params);
            },
        }
    }
]);

CustomService.factory('AdjustService',['$http',
    function($http){   
        
        return {
            addAdjust: function(webtoken, params) {
                return $http.post("/api/adjusts/add?token=" + webtoken, params);
            },

            getAdjustList: function(webtoken){
              return $http.get("/api/adjusts/getList?token=" + webtoken);
            },

            getActiveAdjustList: function(webtoken){
              return $http.get("/api/adjusts/getActiveList?token=" + webtoken);
            },

            deleteAdjustByID: function(webtoken, id){
              return $http.get("/api/adjusts/deleteByID/" + id + "?token=" + webtoken);
            },

            updateAdjust: function(webtoken, params) {
                return $http.post("/api/adjusts/updateByID/" + params._id + "?token=" + webtoken, params);
            },
        }
    }
]);