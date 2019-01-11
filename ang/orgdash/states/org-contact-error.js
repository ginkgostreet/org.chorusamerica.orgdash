(function(angular, $, _) {

  angular.module('orgdash').config(function($stateProvider) {
    $stateProvider.state('org-contact-error', {
      templateUrl: '~/orgdash/partials/OrgContactError.html'
    });
  });

})(angular, CRM.$, CRM._);
