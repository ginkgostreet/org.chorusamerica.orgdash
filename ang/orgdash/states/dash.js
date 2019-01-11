(function(angular, $, _) {

  angular.module('orgdash').config(function($stateProvider, $urlRouterProvider) {
    // Abstract parent state for all dash pages; provides the page "chrome" and
    // universally needed resolves.
    $stateProvider.state('dash', {
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
          return CRM.vars.orgdash;
        }
      },
      onEnter: function ($state, orgContact) {
        if (orgContact.is_error === 1) {
          return $state.target('org-contact-error');
        }
      }
    });

    // Redirect to the organization detail route if the abstract parent is
    // accessed directly.
    $urlRouterProvider.when('/:id', '/:id/org');
  });

})(angular, CRM.$, CRM._);
