'use strict';

angular.module('easyanswersApp')
  .directive('easyanswerInput', function ($log, Answers, $timeout) {
    return {
      templateUrl: 'components/easyanswerInput/easyanswerInput.html',
      restrict: 'A',
      link: function (scope, element, attrs) {

        var initState = Answers.getAnswerState(scope.element.id);
        if(initState){
          element.find('input').val(initState);
        }

        element.find('input').on('keypress focus blur', function(){
          $timeout(function(){
            Answers.setAnswerState(scope.element.id, element.find('input').val());
          });
        });


      }
    };
  });
