'use strict';

describe('Directive: easyanswerSelect', function () {

  // load the directive's module and view
  beforeEach(module('easyanswersApp'));
  beforeEach(module('app/easyanswerSelect/easyanswerSelect.html'));

  var element, scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<easyanswer-select></easyanswer-select>');
    element = $compile(element)(scope);
    scope.$apply();
    expect(element.text()).toBe('this is the easyanswerSelect directive');
  }));
});