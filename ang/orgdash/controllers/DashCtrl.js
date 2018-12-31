(function(angular, $, _) {

  angular.module('orgdash')
    .controller('DashCtrl', function($scope, $state, orgContact) {
      $scope.name = orgContact.display_name;

      // Initially sets the "active" styling for whichever tab the user entered
      // on. Once the user interacts with it, the mdNavBar directive keeps this
      // up to date. Assumes tabs are named like the corresponding states, minus
      // parent prefixes.
      $scope.selectedNavItemName = $state.current.name.replace('dash.', '');
    });

})(angular, CRM.$, CRM._);
