'use strict';

describe('Directive: easyanswerSelectone', function () {

  // load the directive's module and view
  beforeEach(module('easyanswersApp'));
  beforeEach(module('app/easyanswerSelectone/easyanswerSelectone.html'));

  var element, scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<easyanswer-selectone></easyanswer-selectone>');
    element = $compile(element)(scope);
    scope.$apply();
    expect(element.text()).toBe('this is the easyanswerSelectone directive');
  }));
});