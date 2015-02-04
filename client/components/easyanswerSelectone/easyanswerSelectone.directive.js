'use strict';

angular.module('easyanswersApp')
  .directive('easyanswerSelectone', function ($state, $stateParams, $window, Answers) {
    return {
      templateUrl: 'components/easyanswerSelectone/easyanswerSelectone.html',
      restrict: 'EA',
      link: function (scope, element, attrs) {


        //on init, check to see if there is an answer state
        var initState = Answers.getAnswerState(scope.element.id);
        if(initState){
          scope.activeIndex = initState - 1;
        }

        scope.selectoneClick = function(option, index){

          scope.activeIndex = index;

          Answers.setAnswerState(scope.element.id, option.id);

        };


      }
    };
  });
