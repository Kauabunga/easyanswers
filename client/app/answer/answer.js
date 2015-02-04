'use strict';

angular.module('easyanswersApp')
  .config(function ($stateProvider) {

    $stateProvider
      .state('answerinit', {
        url: '/answer',
        templateUrl: 'app/answer/answer.html',
        controller: 'AnswerCtrl'
      })
      .state('answerstate', {
        url: '/{currentSection}/{answerState:.*}',
        templateUrl: 'app/answer/answer.html',
        controller: 'AnswerCtrl'
      });

  });
