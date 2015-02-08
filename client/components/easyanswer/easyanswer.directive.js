'use strict';

angular.module('easyanswersApp')
  .directive('easyanswer', function ($log, $q, $http, Answers, $timeout, $state, $stateParams, $rootScope) {
    return {
      templateUrl: 'components/easyanswer/easyanswer.html',
      restrict: 'A',
      scope: {
        easyanswerSpec: '=',
        easyanswerPromise: '='
      },
      controller: easyanswerController,
      link: easyanswerLink
    };


    /**
     *
     * @param $scope
     */
    function easyanswerController($scope){

      $scope.actionClick = function($event, section, action){
        $scope.$broadcast('CLICK_ACTION', action);

        var nextState;

        //figure out what our next state is
        for(var i = 0; i < section.flows.length; i++){
          if(section.flows[i].action === action.id &&
            section.flows[i].condition){

            nextState = section.flows[i];

            break;
          }
        }


        if(nextState){
          $state.go('answerstate', {
            currentSection: nextState.targetsection
          });

        }
        else{
          $log.error('Could not id next state', action, section);
        }

      };

    }

    /**
     *
     * @param scope
     * @param element
     * @param attrs
     */
    function easyanswerLink(scope, element, attrs){


      scope.section = undefined;
      scope.history = undefined;


      $log.debug(scope.easyanswerPromise);

      //TODO watch this and use _.once
      scope.easyanswerPromise.then(
        function success(){

          $log.debug($state, scope.easyanswerSpec);

          _init(scope);



        },
        function error(){

        });



      //if we are going from one answer state to another then we want to always keep the answersState (mainly for back button)
      $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams){

        if(toState.name === fromState.name && toParams.answerState !== fromParams.answerState){
          event.preventDefault();

          toParams.answerState = fromParams.answerState;
          $state.go(toState.name, toParams);
        }

      });


    }



    /**
     *
     * @param spec
     * @private
     */
    function _init(scope){


      var isFreshAnswer = $state.$current.name === 'answerinit';
      var i;

      if(isFreshAnswer) {
        $log.debug('fresh answer');

        //init with the first section displayed
        scope.section = scope.easyanswerSpec.sections[0];
      }
      else {
        //init with the current state
        $log.debug('progressed answer');


        for(i = 0; i < scope.easyanswerSpec.sections.length; i++){
          if(scope.easyanswerSpec.sections[i].id === $stateParams.currentSection){
            scope.section = scope.easyanswerSpec.sections[i];
          }

          if(i + 1 === scope.easyanswerSpec.sections.length){
            $log.error('unable to init easyanswer target section not found');
          }

        }

        //get history
        $log.debug('answerState params', $stateParams.answerState);

        scope.history = [];

        if($stateParams.answerState) {

          var currentAnswers = $stateParams.answerState.split('/');
          $log.debug('currentAnswers', currentAnswers);



          for (i = 0; i < currentAnswers.length; i++) {

            sectionsloop:for (var j = 0; j < scope.easyanswerSpec.sections.length; j++) {
              elementsloop:for (var z = 0; z < scope.easyanswerSpec.sections[j].elements.length; z++) {

                if(scope.easyanswerSpec.sections[j].id === $stateParams.currentSection){
                  continue;
                }

                if (scope.easyanswerSpec.sections[j].elements[z].id === currentAnswers[i].split('=')[0]) {
                  $log.debug('found answer');

                  //get pretty print question
                  var question;
                  if(scope.easyanswerSpec.sections[j].elements[z].type.id === 'selectone'){
                    question = scope.easyanswerSpec.sections[j].elements[z].type.content.label;
                  }
                  else if(scope.easyanswerSpec.sections[j].elements[z].type.id === 'input'){
                    question = scope.easyanswerSpec.sections[j].elements[z].type.content.label;
                  }
                  else{
                    $log.error('type not handled');
                    continue;
                  }

                  //get pretty print answer
                  var answer;
                  if(scope.easyanswerSpec.sections[j].elements[z].type.id === 'selectone'){
                    var selectIndex = currentAnswers[i].split('=')[1] + '';

                    for(var x = 0; x < scope.easyanswerSpec.sections[j].elements[z].type.content.options.length; x++){
                      if(scope.easyanswerSpec.sections[j].elements[z].type.content.options[x].id === selectIndex){
                        answer = scope.easyanswerSpec.sections[j].elements[z].type.content.options[x].option;
                      }
                    }
                  }
                  else if(scope.easyanswerSpec.sections[j].elements[z].type.id === 'input'){
                    answer = currentAnswers[i].split('=')[1];
                  }
                  else{
                    $log.error('type not handled');
                    continue;
                  }

                  scope.easyanswerSpec.sections[j].elements[z].value = answer;




                  scope.history.push({
                    question: question,
                    answer: answer,
                    section: scope.easyanswerSpec.sections[j].id
                  });

                  break sectionsloop;
                }
              }
            }


          }
        }


      }



    }

  });
