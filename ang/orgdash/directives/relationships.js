/**
 * Directive: relationships
 *
 * Renders a form for toggling the status of passed-in relationships. Also
 * allows the addition of new relationships to the model.
 *
 * Example usage:
 * <relationships
 *   add-another-text="Add a benefit"
 *   allowed-types="whitelistedRelTypes"
 *   ng-model="selectedContact.relationships"
 *   name='myRelationships'>
 * </relationships>
 *
 * See the directive scope below for additional attributes and further detail.
 */
(function(angular, $, _) {
  angular.module('orgdash').directive('relationships', function() {
    return {
      require: 'ngModel',
      restrict: 'E',
      templateUrl: '~/orgdash/directives/relationships.html',
      scope: {

        /**
         * Optional text to replace default placeholder in the widget to add a
         * new relationship.
         */
        addAnotherText: '@?',

        /**
         * An array of relationship type IDs.
         *
         * Used to filter the list of displayed relationships as well as those
         * that can be newly added to the model.
         */
        allowedTypes: '=',

        /**
         * A name for the ngForm.
         */
        name: '@'
      },
      controller: ['$scope', function($scope) {
        $scope.ts = $scope.$root.ts;

        /**
         * Specification for the "add another" relationship widget.
         */
        $scope.entityRef = {
          entity: 'RelationshipType',
          api: {
            params: {
              id: {IN: $scope.allowedTypes}
            }
          },
          select: {
            minimumInputLength: 0,
            placeholder: $scope.addAnotherText || $scope.ts('Add a relationship')
          }
        };

      }],
      link: function(scope, element, attrs, ngModelCtrl) {
        // Not really The Angular Way™, but used for DIY validation -- for
        // providing user feedback *before* selections are added to the model.
        scope.addAnotherError;

        // Make sure IDs are represented as strings. This helps comparisons
        // elsewhere, as the CiviCRM API returns IDs as strings.
        scope.allowedTypes = scope.allowedTypes.map(val => val.toString());

        /**
         * User-selected relationship type to add.
         */
        scope.newRelationshipType;

        // Not sure why we have to do our own "required" validation. We are
        // supposed to get that for free since our directive requires ngModel.
        if (attrs.required) {
          ngModelCtrl.$validators.required = function (modelValue) {
            return Array.isArray(modelValue) && modelValue.length > 0;
          };
        }

        /**
         * Adds the user-entered data to the model, or sets an error message.
         */
        scope.add = function () {
          scope.addAnotherError = undefined;

          if (angular.isUndefined(scope.newRelationshipType) || scope.newRelationshipType === '') {
            scope.addAnotherError = scope.ts('Please select a relationship type.');
            return;
          }

          if (_.find(ngModelCtrl.$modelValue, {relationship_type_id: scope.newRelationshipType})) {
            scope.addAnotherError = scope.ts('A relationship with the selected type already exists between these two contacts.');
            return;
          }

          scope.model.push({
            is_active: '1',
            label: element.find('.select2-chosen').text(),
            relationship_type_id: scope.newRelationshipType
          });

          ngModelCtrl.$validate();
        }

        /**
         * Tests whether a relationship is whitelisted for use in this display.
         *
         * Used as a filter in ng-repeat.
         *
         * @param {object} relationship
         * @returns {boolean}
         */
        scope.inAllowedTypes = function (relationship) {
          return (
            relationship.relationship_type_id
            && scope.allowedTypes.indexOf(relationship.relationship_type_id) !== -1
          );
        };

        ngModelCtrl.$render = function () {
          scope.model = ngModelCtrl.$viewValue;
        };

      }
    };
  });
})(angular, CRM.$, CRM._);
