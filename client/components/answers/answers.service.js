'use strict';

angular.module('easyanswersApp')
  .service('Answers', function ($http, $q ,$log, $state, $stateParams) {


    var self = this;

    self.getAnswerSpec = _getAnswerSpec;
    self.setAnswerState = _setAnswerState;
    self.getAnswerState = _getAnswerState;

    return self;


    /**
     *
     * @private
     */
    function _getAnswerSpec(){

      var deferred = $q.defer();

      $http.get('acclevyform.json')
        .success(function(response){
          deferred.resolve(response);
        })
        .error(function(response, statusCode){
          $log.error('_getAnswerSpec error', response, statusCode);
          deferred.reject(statusCode);
        });

      return deferred.promise;
    }




    //TODO catch back button route starts and reappend the answerState


    /**
     *
     * @param elementId
     * @private
     */
    function _getAnswerState(elementId){

      var currentState = $stateParams.answerState.split('/');

      for(var i = 0; i < currentState.length; i++){

        if(currentState[i].split('=')[0] === elementId){
          return currentState[i].split('=')[1];
        }
      }

      return undefined;
    }



    /**
     *
     * @private
     */
    function _setAnswerState(elementId, answerId){

      var currentState = $stateParams.answerState;

      //$log.debug('Setting answer state', currentState, elementId, answerId);

      if(! currentState && currentState.indexOf(elementId) === -1){
        currentState = elementId + '=' + answerId;
      }
      else if(currentState.indexOf(elementId) === -1){
        currentState += '/' + elementId + '=' + answerId;
      }
      else{

        //need to replace the item
        var splitState = currentState.split('/'),
          i;
        for(i = 0; i < splitState.length; i++){
          if(splitState[i].split('=')[0] === elementId){
            splitState[i] = elementId + '=' + answerId;
          }
        }


        currentState = '';
        for(i = 0; i < splitState.length; i++) {
          currentState += splitState[i];

          if (i + 1 !== splitState.length) {
            currentState += '/';
          }
        }
      }


      $state.go($state.$current.name,
        {
          answerState: currentState
        },
        {
          location: 'replace',
          notify: false
        });


    }







  });
