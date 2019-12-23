(function(){
  'use strict';

  /**
   * @ngdoc directive
   * @name mailcheck.directive:mailcheck
   * @description
   * Angular wrapper for Mailcheck.js
   */
  angular
    .module('angular-mailcheck', [])
    .directive('mailcheck', mailcheckDirective);

  mailcheckDirective.$inject = ['$compile', '$sce'];

  function mailcheckDirective($compile, $sce) {
    return {
      restrict: 'A',
      replace: false,
      scope: {
        suggestionText: '=?mailcheckSuggestionText',
        nopeText: '=?mailcheckNopeText'
      },
      link: function(scope, el, attrs) {

        // Limit to input element of specific types
        var inputTypes = /text|email/i;
        if(el[0].nodeName !== 'INPUT') {
          throw new Error('angular-mailcheck is limited to input elements');
        }
        if(!inputTypes.test(attrs.type)) {
          throw new Error('Invalid input type for angular-mailcheck: ' + attrs.type);
        }

        if (!scope.suggestionText) {
          scope.suggestionText = "Did you mean";
        }

        if (!scope.nopeText) {
          scope.nopeText = "Nope.";
        }

        scope.suggestion = false;
        scope.bugmenot = false;

        // Compiled template
        var template = $compile('' +
          '<div class="help-block mailcheck" ng-show="suggestion && !bugmenot">' +
            '{{ suggestionText }} ' +
            '<a ng-bind="suggestion" ng-click="useSuggestion()"></a>? ' +
            '<a ng-click="suggestion=false; bugmenot=true">{{ nopeText }}</a>' +
          '</div>')(scope);
        el.after(template);

        el.bind('input', function() {
            scope.suggestion = false;
          })
          .bind('blur', function() {
            el.mailcheck({
              suggested: function(element, suggestion) {
                scope.suggestion = suggestion.full;
                scope.$apply();
              },
              empty: function(element) {
                scope.suggestion = false;
              },
              topLevelDomains: ['com', 'net', 'org', 'si', 'rs', 'hr', 'mk', 'at', 'it', 'de', 'eu', 'co.uk']      
            });
          });

        scope.useSuggestion = function() {
          el.val(scope.suggestion);
          scope.suggestion = false;
        };

      }
    };
  }

})();
