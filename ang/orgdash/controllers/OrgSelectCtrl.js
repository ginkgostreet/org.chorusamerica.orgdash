(function(angular, $, _) {

  angular.module('orgdash')
    .controller('OrgSelectCtrl', function($scope, organizations) {
      $scope.organizations = organizations;
    });

})(angular, CRM.$, CRM._);
