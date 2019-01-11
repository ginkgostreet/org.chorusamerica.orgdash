(function(angular, $, _) {

  angular.module('orgdash').config(function($stateProvider) {
    $stateProvider.state('dash.contacts', {
      url: '/contacts',
      templateUrl: '~/orgdash/partials/Contacts.html',
      controller: 'ContactsCtrl',
      resolve: {
        relatedContacts: function(RelatedContactService, orgId, settings, relTypeIds) {
          const relTypes = _.union(relTypeIds.benefits, relTypeIds.contacts, relTypeIds.highlighted);

          return RelatedContactService.fetch(
            orgId,
            relTypes,
            settings.orgdash_single_contact_profile
          );
        },
        relTypeIds: function (settings) {
          return {
            benefits: settings.orgdash_benefits_relationship_types,
            contacts: settings.orgdash_contacts_relationship_types,
            highlighted: settings.orgdash_highlighted_relationship_types
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
  });

})(angular, CRM.$, CRM._);
