(function(angular, $, _) {
  angular.module('orgdash', CRM.angRequires('orgdash'))
    .config(function($stateProvider) {
      $stateProvider
        .state('org', {
          url: '/org/:id',
          templateUrl: '~/orgdash/partials/Org.html',
          controller: 'OrgCtrl'
        });
    })

    // Make ts() globally available in the app
    .run(function($rootScope) {
      $rootScope.ts = CRM.ts('orgdash');
    });
})(angular, CRM.$, CRM._);
