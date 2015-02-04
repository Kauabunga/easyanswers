'use strict';

angular.module('easyanswersApp')
  .directive('easyanswerSelect', function () {
    return {
      templateUrl: 'components/easyanswerSelect/easyanswerSelect.html',
      restrict: 'EA',
      link: function (scope, element, attrs) {
      }
    };
  });
