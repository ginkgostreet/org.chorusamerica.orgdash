(function (angular, $, _) {

  angular
    .module('orgdash')
    .factory('DashConfigService', function ($q, crmApi, crmFieldMetadataFetch) {

      /**
       * Private bucket for settings, keyed by name.
       * @see DashConfigService.getSetting().
       */
      const settings = {};

      /**
       * Private bucket for field collections, keyed by name of associated setting.
       * @see DashConfigService.getFieldCollection().
       */
      const fieldCollections = {};

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
        let promises = [];
        return fetchSettings(settingNames)
          .then(function () {
            // TODO: there is an assumption here that every setting is related to
            // fetching field metadata, which may ultimately turn out not be true...
            _.each(settings, function (value, name) {
              // NOTE: crmFieldMetadataFetch is a wrapper around api.Fieldmetadata.get,
              // which is itself a wrapper around CRM_Fieldmetadata_Fetcher_UFGroup->fetch().
              // Because of limitations in the innermost method, metadata for fields
              // must be fetched one at a time.
              promises.push(crmFieldMetadataFetch('UFGroup', {id: value}).then(function (meta) {
                fieldCollections[name] = meta;
              }));
            });
          })
          .then(function () {
            return $q.all(promises).then(function() {
              return DashConfigService;
            });
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
       * Static method for getting from cache the field collection associated
       * with a setting name.
       *
       * Only metadata that have been retrieved via load() can be returned.
       *
       * @param {String} name
       *   The name of a CiviCRM setting.
       * @returns {object}
       *   Metadata for the field collection.
       */
      DashConfigService.getFieldCollection = function (name) {
        if (fieldCollections[name]) {
          return fieldCollections[name];
        } else {
          throw "Cannot return metadata that was not first retrieved from the server.";
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
