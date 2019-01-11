(function(angular, $, _) {

  angular.module('orgdash').config(function($stateProvider) {
    $stateProvider.state('orgSelect', {
      url: '/',
      templateUrl: '~/orgdash/partials/OrgSelect.html',
      controller: 'OrgSelectCtrl',
      resolve: {
        settings: function () {
          return CRM.vars.orgdash;
        },
        organizations: function(RelatedContactService, settings) {
          return RelatedContactService.findAdminableOrgs(settings.orgdash_contacts_relationship_types, settings.actingContactId);
        }
      },
      onEnter: function ($state, organizations) {
        if (organizations.length === 1) {
          return $state.target('dash.org', {id: organizations[0].contact_id});
        }
      }
    });
  });

})(angular, CRM.$, CRM._);
