'use strict';

angular.module('easyanswersApp')
  .directive('easyanswerElement', function ($log) {
    return {

      restrict: 'EA',
      link: function (scope, element, attrs) {


        $log.debug(scope);



        //if(typeof scope.element.isHidden === 'string'){
        //  $log.debug('ISHIDDEN CONDITION YOOYOYOYOYO', scope.element.isHidden);
        //
        //  if(typeof scope[scope.element.isHidden] === 'function'){
        //    if(scope[scope.element.isHidden]()){
        //      element.show();
        //    }
        //    else {
        //      element.hide();
        //    }
        //  }
        //  else{
        //    $log.error('not linking to scope function');
        //  }
        //}



        if(typeof scope.element.isHidden === 'string'){
          //split conditional string into single conditionals
          //eg "element1=='value1'||element2!='value2'" => [ "element1=='value1'", "element2!='value2'" ]
          var conditions = _parseConditions(scope.element.isHidden);
          var operators = _parseOperators(scope.element.isHidden);
          var depedantElements = (function(){
            var elems = [];
            var i, elementName;
            for(i = 0; i < conditions.length; i++){
              var elem = conditions[i];
              if (elem !== ''){
                elementName = elem[0].trim();
                if (elems.indexOf(elementName) === -1){
                  elems.push(elementName);
                }
              }
            }

            return elems.map(function(name){return _getElementScopePath(scope, name)});
          })();

          $log.debug('conditions', conditions);
          $log.debug('operators', operators);
          $log.debug('depedantElements', depedantElements);


          //evaluate now and set up watchers

          for(var i = 0; i < depedantElements.length; i++){

            //TODO if there are mutliple watchers then we need to resolve all of their changes before evaluating

            (function(elementScopeId){
              scope.$watch(elementScopeId, function(){

                $log.debug('watch change on ', elementScopeId, arguments);


                var result = _evalComleteConditional(scope, scope.element.isHidden, conditions, operators);

                $log.debug('evaluation result', result);

                if(result){
                  element.hide();
                }
                else{
                  element.show();
                }

              });
            })(depedantElements[i]);
          }

          var result = _evalComleteConditional(scope, scope.element.isHidden, conditions, operators);
          $log.debug('evaluation result', result);
          if(result){
            element.hide();
          }
          else{
            element.show();
          }


        }
      }
    };


    /**
     *
     * @returns {Object}
     * @private
     */
    function _evalComleteConditional(scope, conditionString, conditions, ops){
      $log.debug('******** Evaluating ShowIfCondition: ',conditionString,' ********');
      $log.debug('Conditions are: ',conditions);
      $log.debug('Operators are: ',ops);

      var conditionFirst = (conditions[0] === ''),
        evalString = '';

      var i, c, o, result,
        longestLength = conditions.length > ops.length ? conditions.length : ops.length;

      for (i = 0; i < longestLength; i++){
        c = conditions[i];
        o = ops[i];

        if (c){
          try{
            result = _evalCondition(scope, c[0], c[1], c[2]);
            $log.debug('evaluated ', c,' to ', result);
          }catch (error){
            throw new Error("Could not evaluate condition: '"+conditionString+"' error is: "+error.message);
          }
        }

        if (conditionFirst){
          if (c) evalString = evalString.concat(result);
          if (o) evalString = evalString.concat(o);
        } else {
          if (o) evalString = evalString.concat(o);
          if (c) evalString = evalString.concat(result);
        }
      }

      $log.debug('******** Constructed eval: ',evalString,' ********');
      return eval(evalString);
    }


    /**
     * Eval Single Condition
     *
     *
     * @param elementName
     * @param op
     * @param expectedValue
     * @returns {boolean}
     * @private
     */
    function _evalCondition(scope, elementName, op, expectedValue){

      $log.debug('_evalCondition with elementName', elementName);
      //var elementValue = elementBindings.getElement(elementName).getValue();
      var elementValue = scope.$eval(_getElementScopePath(scope, elementName));


      $log.debug('elementValue: ', elementValue);
      $log.debug('isArray: ', (elementValue instanceof Array));
      $log.debug('op: ', op);
      $log.debug('expectedValue: ', expectedValue);

      //expected value is a string
      if(expectedValue[0] === "'" && expectedValue[expectedValue.length - 1] === "'"){

        $log.debug('expectedValue is a string.');
        //strip quotes from string
        expectedValue = expectedValue.substring(1, expectedValue.length - 1);

        if ($.isArray(elementValue)){
          //checkbox group (list value)
          //handle empty string. ie checkboxvalue == '' aka nothing selected
          if(elementValue.length == 0){
            elementValue = [''];
          }
          switch (op) {
            case "===":
            case "==":
              return (elementValue.indexOf(expectedValue) != -1);
            case "!==":
            case "!=":
              return (elementValue.indexOf(expectedValue) == -1);
            default:
              throw new Error("Invalid operator for list: "+op);
          }
        }

        switch (op) {
          case "===":
          case "==":
            return elementValue == expectedValue;
          case "!==":
          case "!=":
            return elementValue != expectedValue;
          default:
            throw new Error("Invalid operator for string: "+op);
        }
      }

      //expected value is a boolean
      if(expectedValue === 'true' || expectedValue === 'false'){

        expectedValue = expectedValue === 'true' ? true : false;

        switch (op) {
          case "===":
          case "==":
            return elementValue === expectedValue;
          case "!==":
          case "!=":
            return elementValue !== expectedValue;
          default:
            throw new Error("Invalid operator for string: "+op);
        }


      }



      ///expected value is a number
      $log.debug('expectedValue is a number.');
      var a = parseFloat(elementValue), b = parseFloat(expectedValue);
      $log.debug('a: ', a);

      if (elementValue==='' && !isNaN(b)) {
        $log.debug('empty string and expected number');
        return false;
      }


      if (isNaN(a)) return false;
      //throw new Error("Expected a number but could not parse as one: "+elementValue);
      if (isNaN(b)) throw new Error("Expected a number but could not parse as one: "+expectedValue);


      switch (op) {
        case "<":
          return a < b;
        case "<=":
          return a <= b;
        case ">":
          return a > b;
        case ">=":
          return a >= b;
        case "===":
        case "==":
          return a == b;
        case "!==":
        case "!=":
          return a != b;
        default:
          throw new Error("Invalid operator for number: "+op);
      }
    }



    /**
     *
     * @param elementName
     * @private
     */
    function _getElementScopePath(scope, elementName){

      for (var j = 0; j < scope.easyanswerSpec.sections.length; j++) {
        for (var z = 0; z < scope.easyanswerSpec.sections[j].elements.length; z++) {
          if(scope.easyanswerSpec.sections[j].elements[z].id === elementName) {
            return 'easyanswerSpec.sections[' + j + '].elements[' + z + '].value';
          }
        }
      }
      return undefined;

    }



    /**
     *
     * @param conditionString
     * @returns {Array|*}
     * @private
     */
    function _parseConditions(conditionString){
      //split conditional string into single conditionals
      //eg "element1=='value1'||element2!='value2'" => [ "element1=='value1'", "element2!='value2'" ]
      var conditions = conditionString.split(/[\(\)|&]+/);

      //split a single conditional into array eg ["element1", "==", "'value1'"]
      conditions = conditions.map(function(el){
        if (el === '') return el;

        var args = el.split(/===|!==|==|!=|<=|>=|<|>/);
        if (args.length !== 2) throw new Error("Something went wrong parsing the condition: "+conditionString);

        //move second argument over to make room for operator
        args[2] = args[1];

        //put operator between the two args
        args[1] = el.substring(args[0].length, el.length - args[2].length);

        args[0] = args[0].trim();
        args[1] = args[1].trim();
        args[2] = args[2].trim();

        return args;
      });
      $log.debug('conditions have been parsed: ', conditions);
      return conditions;
    }

    /**
     *
     * @param conditionString
     * @returns {*}
     */
    function _parseOperators(conditionString){

      var ops = conditionString.split(/[^\(\)|&]+/);

      $log.debug('operators have been parsed: ', ops);
      return ops;
    }


  });
