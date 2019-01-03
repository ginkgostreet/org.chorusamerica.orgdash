(function(angular, $, _) {

  angular.module('orgdash')
    .controller('OrgCtrl', function($scope, orgId, settings) {
      $scope.profileId = settings.orgdash_org_profile;
      $scope.orgId = orgId;
    });

})(angular, CRM.$, CRM._);
