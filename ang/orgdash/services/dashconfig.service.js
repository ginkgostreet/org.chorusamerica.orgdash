(function (angular, $, _) {

  angular
    .module('orgdash')
    .factory('DashConfigService', function (crmApi) {

      /**
       * Private bucket for settings, keyed by name.
       * @see DashConfigService.getSetting().
       */
      const settings = {};

      const DashConfigService = {};

      /**
       * Static method to load data from the server.
       *
       * @param {String|Array} settingNames
       *   The name(s) of settings for which to retrieve data.
       * @return {Promise}
       *   Resolves to the DashConfigService service, to facilitate chaining.
       */
      DashConfigService.load = function (settingNames) {
        return fetchSettings(settingNames)
          .then(function () {
            return DashConfigService;
          });
      }

      /**
       * Static method for getting the value of a setting from cache.
       *
       * Only settings that have been retrieved via load() can be returned.
       *
       * @param {String} name
       *   The name of a CiviCRM setting.
       * @returns mixed
       *   The setting value.
       */
      DashConfigService.getSetting = function (name) {
        if (settings[name]) {
          return settings[name];
        } else {
          throw "Cannot return setting that was not first retrieved from the server.";
        }
      };

      /**
       * Private helper function to retrieve and cache settings from the server.
       *
       * @param {type} settingNames
       * @returns {Promise}
       */
      function fetchSettings(settingNames) {
        var params = {
          return: settingNames,
          sequential: 1
        };

        return crmApi('Setting', 'get', params).then(function (result) {
          _.each(result.values[0], function (v, k) {
            settings[k] = v;
          });
        });

      }

      return DashConfigService;
    });
})(angular, CRM.$, CRM._);
