(function(angular, $, _) {

  angular.module('orgdash')
    .controller('OrgCtrl', function($scope, orgId, settings, memberships) {
      $scope.memberships = memberships;
      $scope.orgId = orgId;
      $scope.profileId = settings.orgdash_org_profile;

    });

})(angular, CRM.$, CRM._);
