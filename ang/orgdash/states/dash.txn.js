(function(angular, $, _) {

  angular.module('orgdash').config(function($stateProvider) {

    const contributionParams = {
      is_text: 0,
      sequential: 1,
      options: {
        limit: 0,
        sort: 'receive_date DESC'
      },
      'api.OptionValue.getvalue': {
        option_group_id: 'contribution_status',
        return: 'label',
        value: '$value.contribution_status_id'
      },
      return: [
        'contribution_recur_id',
        'contribution_status_id',
        // API doesn't return financial_type_id unless explicitly requested
        'financial_type_id',
        'receive_date',
        'total_amount'
      ]
    };

    $stateProvider.state('dash.txn', {
      url: '/txn',
      templateUrl: '~/orgdash/partials/Transactions.html',
      controller: 'TransactionsCtrl',
      resolve: {
        financialTypes: function (crmApi) {
          return crmApi('FinancialAccount', 'get', {
            options: {limit: 0},
            return: 'name',
            sequential: 1
          }).then(result => result.values);
        },

        // Note: orgId is a resolve inherited from parent route dash.
        transactions: function (crmApi, financialTypes, orgId) {
          // Contact ID has to be set here because we need the injected orgId.
          contributionParams.contact_id = orgId;

          return crmApi('Contribution', 'get', contributionParams).then(contributionResult => {
            contributionResult.values.forEach(txn => {
              txn.financial_type_label = _.result(_.find(financialTypes, {id: txn.financial_type_id}), 'name');
              txn.contribution_status_label = txn['api.OptionValue.getvalue'];
              delete txn['api.OptionValue.getvalue'];
            });

            // Attach recurrence details to contributions as appropriate.
            const recurIds = _.pluck(contributionResult.values, 'contribution_recur_id').filter(id => id.length > 0);
            if (recurIds.length > 0) {
              crmApi('ContributionRecur', 'get', {
                contribution_status_id: 'In Progress',
                id: {IN: recurIds},
                options: {limit: 0},
                sequential: 1
              }).then(recurResult => {
                recurResult.values.forEach(recur => {
                  // To minimize visual clutter, the next contribution date is
                  // attached to only the latest contribution in each recur cycle.
                  // We know the first item in contributionResult.values is the
                  // latest because contributions are sorted most to least recent.
                  const latestContributionInCycle = _.find(contributionResult.values, {contribution_recur_id: recur.id});
                  latestContributionInCycle.next_recur_date = recur.next_sched_contribution_date;
                });
              });
            }

            return contributionResult.values;
          });
        }
      }
    });
  });

})(angular, CRM.$, CRM._);