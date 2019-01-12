(function(angular, $, _) {

  angular.module('orgdash')
    .controller('OrgCtrl', function($scope, orgId, settings, memberships) {
      $scope.memberships = memberships;
      $scope.orgId = orgId;
      $scope.profileId = settings.orgdash_org_profile;

      /**
       * Creates a link to a contribution page.
       */
      $scope.contributeUrl = function (contributionPageId) {
        const path = 'civicrm/contribute/transact';
        const query = {
          reset: 1,
          id: contributionPageId
        };

        return CRM.url(path, query);
      };
    });

})(angular, CRM.$, CRM._);
