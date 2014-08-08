(function() {
  'use strict';

  angular.module('tw.directives.fileChooser', []).directive('twFileChooser', ['$compile', '$document', '$http', '$templateCache', '$window', function($compile, $document, $http, $templateCache, $window) {
    return {
      restrict: 'A',
      link: function twFileChooserPostLink(scope, el, attrs) {
        var input = el[0];

        // Preconditions
        if (element.nodeName.toLowerCase() !== 'input' || !attrs.type || attrs.type.toLowerCase() !== 'file' || !attrs.twFileChooser) {
          return;
        }

        var current = el;

        scope.choose = function choose() {
          input.dispatchEvent(new $window.MouseEvent('click'));
        };

        scope.$watch(attrs.twFileChooser, function(newVal, oldVal) {
          if (!newVal) {
            if (oldVal) {
              // Reset
              current.replaceWith(el);
              current = el;
            }

            return;
          }

          $http.get(newVal, {cache: $templateCache}).then(function(response) {
            var newElement = $compile(response.data)(scope);
            current.replaceWith(newElement);
            current = newElement;
          }, function(response) {
            // TODO: log error
            current.replaceWith(el);
            current = el;
          });
        });
      }
    };
  }]);
})();
