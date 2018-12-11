(function(angular, $, _) {

  angular.module('orgdash')
    .controller('OrgCtrl', function($scope, $stateParams) {
      $scope.profileId = CRM.vars.orgdash.orgdash_org_profile_id;
      $scope.orgContact = {
        id: $stateParams.id
      };
    });

})(angular, CRM.$, CRM._);
