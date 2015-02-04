'use strict';

angular.module('easyanswersApp')
  .directive('easyanswerSelectone', function ($state, $stateParams, $window, Answers) {
    return {
      templateUrl: 'components/easyanswerSelectone/easyanswerSelectone.html',
      restrict: 'EA',
      link: function (scope, element, attrs) {


        //TODO this value needs to be init outside of the visual directive - on init, check to see if there is an answer state
        var initState = Answers.getAnswerState(scope.element.id);
        if(initState){
          scope.activeIndex = initState - 1;
          scope.element.value = scope.element.type.content.options[scope.activeIndex];
        }



        scope.selectoneClick = function(option, index){

          scope.activeIndex = index;
          Answers.setAnswerState(scope.element.id, option.id);

          scope.element.value = option.option;

        };


      }
    };
  });
