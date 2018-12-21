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
            },
            orgContact: function (crmApi, orgId) {
              const resultHandler = function (result) {
                return result;
              };

              return crmApi('Contact', 'getsingle', {
                id: orgId,
                contact_type: 'Organization'
              })
                // The same handler is used for successes and failures so that
                // the state's onEnter callback (which has appropriate context
                // to change states) can redirect to an error page if necessary.
                // Otherwise, the rejected promise would result in a Transition
                // Rejection and confusing UX.
                .then(resultHandler, resultHandler);
            },
            settings: function () {
              const settings = CRM.vars.orgdash;

              // The entityRef widget on the settings form saves multiple selections
              // as comma-separated strings (rather than as arrays). The transformation
              // to the more useful array format is centralized here.
              settings.orgdash_benefits_relationship_types = settings.orgdash_benefits_relationship_types.split(',');
              settings.orgdash_contacts_relationship_types = settings.orgdash_contacts_relationship_types.split(',');
              settings.orgdash_highlighted_relationship_types = settings.orgdash_highlighted_relationship_types.split(',');

              return settings;
            }
          },
          onEnter: function ($state, orgContact) {
            if (orgContact.is_error === 1) {
              return $state.target('org-contact-error');
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
        })

        .state('org-contact-error', {
          templateUrl: '~/orgdash/partials/OrgContactError.html'
        });
    })

    // Make ts() globally available in the app
    .run(function($rootScope) {
      $rootScope.ts = CRM.ts('orgdash');
    });
})(angular, CRM.$, CRM._);
