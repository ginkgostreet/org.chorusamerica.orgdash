(function(angular, $, _) {

  angular.module('orgdash')
    .controller('OrgCtrl', function($scope, orgId) {
      $scope.profileId = CRM.vars.orgdash.orgdash_org_profile_id;
      $scope.orgId = orgId;
    });

})(angular, CRM.$, CRM._);
