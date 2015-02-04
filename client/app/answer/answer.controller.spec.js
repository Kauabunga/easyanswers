'use strict';

describe('Controller: AnswerCtrl', function () {

  // load the controller's module
  beforeEach(module('easyanswersApp'));

  var AnswerCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    AnswerCtrl = $controller('AnswerCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
