'use strict';

angular.module('thisNodeApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('main', {
        url: '/',
        templateUrl: 'app/main/main.html',
        controller: 'MainCtrl'
      });
    $stateProvider
      .state('view', {
        url: '/vis',
        templateUrl: 'app/vis/index.html',
        controller: null
      });
  });
