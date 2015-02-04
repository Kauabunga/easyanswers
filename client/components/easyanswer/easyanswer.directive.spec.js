'use strict';

describe('Directive: easyanswer', function () {

  // load the directive's module and view
  beforeEach(module('easyanswersApp'));
  beforeEach(module('app/easyanswer/easyanswer.html'));

  var element, scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<easyanswer></easyanswer>');
    element = $compile(element)(scope);
    scope.$apply();
    expect(element.text()).toBe('this is the easyanswer directive');
  }));
});