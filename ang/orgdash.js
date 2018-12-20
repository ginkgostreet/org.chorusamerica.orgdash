(function(angular, $, _) {
  angular.module('orgdash', CRM.angRequires('orgdash'))
    .config(function($stateProvider, $urlRouterProvider) {

      // Redirect to the organization detail route if the abstract parent is
      // accessed directly.
      $urlRouterProvider.when('/:id', '/:id/org');

      $stateProvider
        // Abstract parent state for all pages; provides the page "chrome" and
        // universally needed resolves.
        .state('dash', {
          abstract: true,
          url: '/:id',
          templateUrl: '~/orgdash/partials/Dash.html',
          controller: 'DashCtrl',
          resolve: {
            orgId: function ($stateParams) {
              return $stateParams.id;
            }
          }
        })

        // Organization detail
        .state('dash.org', {
          url: '/org',
          templateUrl: '~/orgdash/partials/Org.html',
          controller: 'OrgCtrl'
        })

        // Contact list and detail
        .state('dash.contacts', {
          url: '/contacts',
          templateUrl: '~/orgdash/partials/Contacts.html',
          controller: 'ContactsCtrl',
          resolve: {
            profileId: function () {
              return CRM.vars.orgdash.orgdash_single_contact_profile;
            },
            relatedContacts: function(RelatedContactService, orgId, profileId, relTypeIds) {
              const relTypes = _.union(relTypeIds.benefits, relTypeIds.contacts, relTypeIds.highlighted);

              return RelatedContactService.fetch(
                orgId,
                relTypes,
                profileId
              );
            },
            relTypeIds: function () {
              return {
                benefits: CRM.vars.orgdash.orgdash_benefits_relationship_types,
                contacts: CRM.vars.orgdash.orgdash_contacts_relationship_types,
                highlighted: CRM.vars.orgdash.orgdash_highlighted_relationship_types
              };
            },
            relTypeMetaData: function (crmApi, relTypeIds) {
              const ids = _.union(relTypeIds.benefits, relTypeIds.contacts, relTypeIds.highlighted);

              return crmApi('RelationshipType', 'get', {
                id: {IN: ids}
              }).then(function (result) {
                return result.values;
              });
            }
          }

        });
    })

    // Make ts() globally available in the app
    .run(function($rootScope) {
      $rootScope.ts = CRM.ts('orgdash');
    });
})(angular, CRM.$, CRM._);
