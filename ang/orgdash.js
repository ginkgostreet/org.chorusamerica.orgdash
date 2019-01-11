(function(angular, $, _) {

  // For routing/state configurations, see ang/orgdash/states.
  angular.module('orgdash', CRM.angRequires('orgdash'))
    // Make utilities globally available in the app
    .run(function($rootScope) {
      $rootScope.formatDate = CRM.utils.formatDate;
      $rootScope.formatMoney = CRM.formatMoney;
      $rootScope.ts = CRM.ts('orgdash');
    });

})(angular, CRM.$, CRM._);
