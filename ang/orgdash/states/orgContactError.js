(function(angular, $, _) {

  angular.module('orgdash').config(function($stateProvider) {
    $stateProvider.state('orgContactError', {
      templateUrl: '~/orgdash/partials/OrgContactError.html'
    });
  });

})(angular, CRM.$, CRM._);
