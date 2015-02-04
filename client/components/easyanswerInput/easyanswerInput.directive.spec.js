'use strict';

describe('Directive: easyanswersInput', function () {

  // load the directive's module and view
  beforeEach(module('easyanswersApp'));
  beforeEach(module('app/easyanswersInput/easyanswersInput.html'));

  var element, scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<easyanswers-input></easyanswers-input>');
    element = $compile(element)(scope);
    scope.$apply();
    expect(element.text()).toBe('this is the easyanswersInput directive');
  }));
});