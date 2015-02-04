'use strict';

angular.module('easyanswersApp')
  .directive('easyanswerElement', function ($log) {
    return {

      restrict: 'EA',
      link: function (scope, element, attrs) {


        $log.debug(scope);





        scope.missingclassificationUnitFalse = function(){
          sectionsloop:for (var j = 0; j < scope.easyanswerSpec.sections.length; j++) {
            for (var z = 0; z < scope.easyanswerSpec.sections[j].elements.length; z++) {
              if(scope.easyanswerSpec.sections[j].elements[z].id === 'missingclassificationunit') {

                scope.$watch('easyanswerSpec.sections[' + j + '].elements[' + z + '].value', function(){

                  if(scope.easyanswerSpec.sections[j].elements[z].value){
                    element.show();
                  }
                  else{
                    element.hide();
                  }

                });

                return scope.easyanswerSpec.sections[j].elements[z].value;
              }
            }
          }
          return true;
        };





        if(typeof scope.element.isHidden === 'string'){
          $log.debug('ISHIDDEN CONDITION YOOYOYOYOYO', scope.element.isHidden);

          if(scope[scope.element.isHidden]()){
            element.show();
          }
          else{

            element.hide();
          }
        }





      }





    };
  });
