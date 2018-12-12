(function(angular, $, _) {
  angular.module('orgdash', CRM.angRequires('orgdash'))
    .config(function($stateProvider) {
      $stateProvider
        .state('org', {
          url: '/org/:id',
          templateUrl: '~/orgdash/partials/Org.html',
          controller: 'OrgCtrl'
        })
        .state('contacts', {
          url: '/contacts/:id',
          templateUrl: '~/orgdash/partials/Contacts.html',
          controller: 'ContactsCtrl',
          resolve: {
            highlightedRelTypes: function (crmApi) {
              const relTypes = CRM.vars.orgdash.orgdash_highlighted_relationship_types;

              return crmApi('RelationshipType', 'get', {
                id: {IN: relTypes}
              }).then(function (result) {
                return result.values;
              });

            },
            profileId: function () {
              return CRM.vars.orgdash.orgdash_single_contact_profile;
            },
            relatedContacts: function($stateParams, RelatedContactService, profileId) {
              const relTypes = CRM.vars.orgdash.orgdash_contacts_relationship_types;

              return RelatedContactService.fetch(
                $stateParams.id,
                relTypes,
                profileId
              );
            }
          }

        });
    })

    // Make ts() globally available in the app
    .run(function($rootScope) {
      $rootScope.ts = CRM.ts('orgdash');
    });
})(angular, CRM.$, CRM._);
