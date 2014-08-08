(function() {
  'use strict';

  angular.module('tw.directives.fileChooser', []).directive('twFileChooser', ['$compile', '$document', '$http', '$templateCache', '$window', '$q', function($compile, $document, $http, $templateCache, $window, $q) {
    return {
      restrict: 'A',
      compile: function twFileChooserCompile(tEl, tAttrs) {
        tEl.addClass('ng-hide');

        return function twFileChooserPostLink(scope, el, attrs) {
          var input = el[0];

          // Preconditions
          if (input.nodeName.toLowerCase() !== 'input' || !attrs.type || attrs.type.toLowerCase() !== 'file' || !attrs.twFileChooser) {
            return;
          }

          scope.choose = function choose() {
            input.dispatchEvent(new $window.MouseEvent('click'));
          };

          var current, deferred = $q.defer();
          scope.$watch(attrs.twFileChooser, function(newVal, oldVal) {
            deferred.resolve();
            deferred = $q.defer();

            if (!newVal) {
              if (oldVal) {
                // Reset
                current && current.remove();
                current = null;
              }

              return;
            }

            $http.get(newVal, {cache: $templateCache, timeout: deferred.promise}).then(function(response) {
              current && current.remove();
              current = $compile(response.data)(scope);
              el.after(current);
            }, function(response) {
              // TODO: log error
              current && current.remove();
              current = null;
            });
          });
        };
      }
    };
  }]);
})();
