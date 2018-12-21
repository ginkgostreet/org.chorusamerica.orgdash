(function(angular, $, _) {

  angular.module('orgdash')
    .controller('OrgCtrl', function($scope, orgId, settings) {
      $scope.profileId = settings.orgdash_org_profile_id;
      $scope.orgId = orgId;
    });

})(angular, CRM.$, CRM._);
