'use strict';

angular.module('easyanswersApp')
  .directive('easyanswerCheckbox', function ($log, Answers) {
    return {
      templateUrl: 'components/easyanswerCheckbox/easyanswerCheckbox.html',
      restrict: 'A',
      link: function (scope, element, attrs) {



        var initState = Answers.getAnswerState(scope.element.id);

        if(initState !== undefined){
          if(typeof initState === 'string'){
            scope.element.value = initState === 'true' ? true : false;
          }
          else{
            scope.element.value = initState;
          }

        }

        scope.$watch('element.value', function(){

          if(scope.element.value !== undefined){
            Answers.setAnswerState(scope.element.id, scope.element.value);
          }

        });






      }
    };
  });
