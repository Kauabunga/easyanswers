'use strict';

angular.module('easyanswersApp')
  .controller('AnswerCtrl', function ($scope, Answers, $q, $timeout, $state, $log) {


    $scope.easyanswerSpec = undefined;
    $scope.easyanswerPromise = undefined;


    $scope.easyanswerReadyDeferred = $q.defer();
    $scope.easyanswerReadyPromise = $scope.easyanswerReadyDeferred.promise;


    _init();


    return;


    /**
     *
     * @private
     */
    function _init(){

      $log.debug('INIT AnswerCtrl with $state', $state);

      $scope.easyanswerPromise = Answers.getAnswerSpec();
      $scope.easyanswerPromise.then(
        function success(answerSpec){

          $scope.easyanswerSpec = answerSpec;

          //let the digest finish before resolving
          $timeout(function(){
            $scope.easyanswerReadyDeferred.resolve();
          });

        },
        function error(statusCode){

          $scope.easyanswerReadyDeferred.reject(statusCode);

        });

    }


  });
