(function (angular, $, _) {

  angular
    .module('orgdash')
    .factory('RelatedContactService', function ($q, crmApi) {

      /**
       * @var {object}
       *   Private bucket for related contacts, keyed by contact ID.
       */
      const contacts = {};

      /**
       * Constructor for the RelatedContact class.
       *
       * @param {object} data
       *   As returned by fetchRelatedContacts().
       */
      function RelatedContact (data) {
        /**
         * @var {string}
         *   The email address associated with the CMS account.
         */
        this.accountEmail = data.accountEmail;

        /**
         * @var {string|number}
         */
        this.contactId = data.contactId || data.contact_id || data.id;
        if (typeof this.contactId === 'undefined') {
          throw 'Cannot create RelatedContact without contact_id.';
        }

        /**
         * @var {object}
         *   Keyed by profile ID.
         */
        this.profileData = angular.copy(data.profileData || {});

        /**
         * @var {object}
         *   Keyed by relationship ID.
         *   @see RelatedContact.prototype.registerRelationship();
         */
        this.relationships = {};

        /**
         * @var {string}
         */
        this.sortName = data.sortName;
      }

      /**
       * Public convenience function for getting relationship details based on type.
       *
       * @param {string|number}
       *   The relationship type ID.
       * @return {object|undefined}
       *   Returns undefined if no such relationship.
       */
      RelatedContact.prototype.getRelationshipOfType = function (id) {
        // The CiviCRM API returns numbers as strings, so ensure this function
        // queries for a string even if passed a number.
        id = id.toString();
        return _.findWhere(this.relationships, {relationship_type_id: id});
      }

      /**
       * Public method for registering new relationships in memory.
       *
       * @param {object} data
       */
      RelatedContact.prototype.registerRelationship = function (data) {
        this.relationships[data.id] = {
          id: data.id,
          is_active: data.is_active,
          relationship_type_id: data.relationship_type_id
        }
      }

      /**
       * Private method for fetching related contacts from the server.
       *
       * @param {number} orgId
       *   The contact ID of the organization for which to retrieve the
       *   related contacts.
       * @param {string} orgIsAorB
       *   'a' or 'b' -- refers to CiviCRM's relationship directionality.
       * @param {number[]} relTypes
       *   Only relationships of these types will be fetched.
       * @param {number} profileId
       *   Contact information will be fetched through the lens of the
       *   specified profile, i.e., only the specified fields will be
       *   fetched.
       * @return {Promise.<Array>}
       *   Resolves to full result of chained CiviCRM API call.
       */
      function fetchRelatedContacts (orgId, orgIsAorB, relTypes, profileId) {
        const otherContactIsAorB = (orgIsAorB === 'a' ? 'b' : 'a');
        relTypes = (Array.isArray(relTypes) ? relTypes : [relTypes]);

        const params = {
          relationship_type_id: {IN: relTypes},
          options: {
            limit: 0
          },
          sequential: 1,
          'api.Profile.get': {
            contact_id: `$value.contact_id_${otherContactIsAorB}`,
            profile_id: profileId
          },
          'api.UFMatch.getvalue': {
            contact_id: `$value.contact_id_${otherContactIsAorB}`,
            return: 'uf_name'
          },
          'api.Contact.getvalue': {
            contact_id: `$value.contact_id_${otherContactIsAorB}`,
            return: 'sort_name'
          },
        };
        params[`contact_id_${orgIsAorB}`] = orgId;
        params[`is_permission_${orgIsAorB}_${otherContactIsAorB}`] = 1;

        return crmApi('Relationship', 'get', params);
      }

      /**
       * The service itself.
       */
      return {
        /**
         * Public method for fetching related contacts from the server.
         *
         * @param {number} orgId
         *   The contact ID of the organization for which to retrieve the
         *   related contacts.
         * @param {number[]} relTypes
         *   Only relationships of these types will be fetched.
         * @param {number} profileId
         *   Contact information will be fetched through the lens of the
         *   specified profile, i.e., only the specified fields will be
         *   fetched.
         * @return {Promise}
         *   The promise doesn't resolve to anything in particular, but
         *   returning it allows consuming code to know when the operation is
         *   complete.
         */
        fetch: function (orgId, relTypes, profileId) {
          const apiResults = [];
          const promises = [];
          ['a', 'b'].forEach(function (orgIsAorB) {
            promises.push(fetchRelatedContacts(orgId, orgIsAorB, relTypes, profileId).then(function(result) {
              Array.prototype.push.apply(apiResults, result.values);
            }));
          });

          return $q.all(promises).then(function () {
            apiResults.forEach(function (data) {
              const relatedContactId = (orgId !== data.contact_id_a ? data.contact_id_a : data.contact_id_b);

              // the contact might already be cached, e.g., because of multiple relationships
              if (contacts.hasOwnProperty(relatedContactId)) {
                var relatedContact = contacts[relatedContactId];
              } else {
                const contactData = {};
                contactData.accountEmail = (typeof data['api.UFMatch.getvalue'] === 'string' ? data['api.UFMatch.getvalue'] : undefined);
                contactData.contactId = relatedContactId;
                contactData.sortName = (typeof data['api.Contact.getvalue'] === 'string' ? data['api.Contact.getvalue'] : undefined);

                contactData.profileData = {};
                contactData.profileData[profileId] = angular.copy(data['api.Profile.get'].values);

                var relatedContact = contacts[relatedContactId] = new RelatedContact(contactData);
              }

              // whether or not the contact had already been cached, the
              // relationship is fresh and must be registered
              relatedContact.registerRelationship({
                id: data.id,
                is_active: data.is_active,
                relationship_type_id: data.relationship_type_id
              });

            });
          });
        },

        /**
         * Public method for getting contacts from local cache.
         *
         * @param {function|object|string} predicate
         *   @see https://lodash.com/docs/3.10.1#filter
         */
        get: function (predicate) {
          return _.filter(contacts, {});
        }
      };

    });
})(angular, CRM.$, CRM._);
