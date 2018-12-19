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
            profileId: function () {
              return CRM.vars.orgdash.orgdash_single_contact_profile;
            },
            relatedContacts: function($stateParams, RelatedContactService, profileId, relTypeIds) {
              const relTypes = _.union(relTypeIds.benefits, relTypeIds.contacts, relTypeIds.highlighted);

              return RelatedContactService.fetch(
                $stateParams.id,
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
