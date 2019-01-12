(function(angular, $, _) {

  angular.module('orgdash').config(function($stateProvider) {
    $stateProvider.state('dash.org', {
      url: '/org',
      templateUrl: '~/orgdash/partials/Org.html',
      controller: 'OrgCtrl',
      resolve: {
        memberships: function(crmApi, orgId) {
          return crmApi('Membership', 'get', {
            contact_id: orgId,
            options: {
              return_contribution_page_id: 1
            },
            sequential: 1,
            'api.MembershipStatus.getsingle': {
              id: '$value.status_id',
              return: ['is_current_member', 'label']
            }
          }).then(result => {
            result.values.forEach(item => {
              item.status_label = item['api.MembershipStatus.getsingle'].label;
              item.is_current = item['api.MembershipStatus.getsingle'].is_current_member;
              delete item['api.MembershipStatus.getsingle'];
            });
            return result.values;
          });
        }
      }
    });
  });

})(angular, CRM.$, CRM._);
