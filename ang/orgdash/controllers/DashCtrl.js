(function(angular, $, _) {

  angular.module('orgdash')
    .controller('DashCtrl', function($scope, orgContact) {
      $scope.name = orgContact.display_name;
    });

})(angular, CRM.$, CRM._);
