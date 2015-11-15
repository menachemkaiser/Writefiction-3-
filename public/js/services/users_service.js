'use strict';

/* Services */
var UsersService = angular.module('UsersService', ['ngResource']);

UsersService.factory('UserService',['$http',
    function($http){   
        
        return {
            userAuthenticate: function(params) {
                return $http.post("/api/auth", params);
            },

            updateProfile: function(webtoken, params){
                return $http.post("/api/users/updateProfile?token=" + webtoken, params);  
            },

            updatePassword: function(webtoken, password){
                return $http.post("/api/users/updatePassword?token=" + webtoken, {password: password});  
            },

            getUserInformationByID: function(webtoken, userID)
            {
                return $http.get("/api/users/getUserInfoById/" + userID + "?token=" + webtoken);
            },

            getUserList: function(webtoken)
            {
                return $http.get("/api/users/getList?token=" + webtoken);
            }
        }
    }
]);