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
 *   model="selectedContact.relationships"
 *   name='myRelationships'>
 * </relationships>
 *
 * See the directive scope below for additional attributes and further detail.
 */
(function(angular, $, _) {
  angular.module('orgdash').directive('relationships', function() {
    return {
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
         * TODO: We should probably be using ngModel...
         */
        model: '=',

        /**
         * A name for the ngForm.
         */
        name: '@'
      },
      controller: ['$rootScope', '$element', '$scope', function($rootScope, $element, $scope) {
        // Make sure IDs are represented as strings. This helps comparisons
        // elsewhere, as the CiviCRM API returns IDs as strings.
        $scope.allowedTypes = $scope.allowedTypes.map(val => val.toString());

        /**
         * User-selected relationship type to add.
         */
        $scope.newRelationshipType;

        $scope.ts = $rootScope.ts;

        /**
         * Adds the user-entered data to the model, or (TODO) displays an error
         * message.
         */
        $scope.add = function () {
          if (angular.isUndefined($scope.newRelationshipType) || $scope.newRelationshipType === '') {
            console.log('TODO: Display user feedback that a selection must be made');
            return;
          }

          if (_.find($scope.model, {relationship_type_id: $scope.newRelationshipType})) {
            console.log('TODO: Display user feedback that two relationships of the same type is not valid');
            return;
          }

          $scope.model.push({
            is_active: '1',
            label: $element.find('.select2-chosen').text(),
            relationship_type_id: $scope.newRelationshipType
          });
        }

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

        /**
         * Tests whether a relationship is whitelisted for use in this display.
         *
         * Used as a filter in ng-repeat.
         *
         * @param {object} relationship
         * @returns {boolean}
         */
        $scope.inAllowedTypes = function (relationship) {
          return (
            relationship.relationship_type_id
            && $scope.allowedTypes.indexOf(relationship.relationship_type_id) !== -1
          );
        };

      }]
    };
  });
})(angular, CRM.$, CRM._);
