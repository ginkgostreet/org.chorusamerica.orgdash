(function(angular, $, _) {

  angular.module('orgdash')
    .controller('TransactionsCtrl', function($scope, $state, transactions) {
      $scope.transactions = transactions;
    });

})(angular, CRM.$, CRM._);
