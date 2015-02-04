'use strict';

describe('Directive: easyanswerElement', function () {

  // load the directive's module and view
  beforeEach(module('easyanswersApp'));
  beforeEach(module('app/easyanswerElement/easyanswerElement.html'));

  var element, scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<easyanswer-element></easyanswer-element>');
    element = $compile(element)(scope);
    scope.$apply();
    expect(element.text()).toBe('this is the easyanswerElement directive');
  }));
});