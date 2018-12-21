(function(angular, $, _) {

  angular.module('orgdash')
    .controller('ContactsCtrl', function($scope, crmApi, RelatedContactService, relTypeIds, relTypeMetaData, settings, orgId) {
      $scope.contactEditorIsOpen = false;
      $scope.profileId = settings.orgdash_single_contact_profile;
      $scope.relatedContacts = RelatedContactService.get();
      $scope.relTypeIds = relTypeIds;
      $scope.selectedContact;

      /**
       * Private helper function to determine whether organization contacts
       * are on the A or the B side of a given relationship type.
       *
       * @param {string} id
       *   Relationship type ID.
       * @return {mixed}
       *   - 'a' or 'b' if organizations are on a single side.
       *   - undefined if no organizations in the relationship type.
       *   - boolean false if organizations are on both sides.
       */
      function getRelTypeOrgSide(id) {
        const type = relTypeMetaData[id];

        let aOrB;
        if (type.contact_type_a === 'Organization'
          && type.contact_type_b === 'Organization')
        {
          aOrB = false;
        } else if (type.contact_type_a === 'Organization') {
          aOrB = 'a';
        } else if (type.contact_type_b === 'Organization') {
          aOrB = 'b';
        }

        return aOrB;
      }

      /**
       * Private helper function to determine whether organization contacts
       * are on the A or the B side of a given relationship type. For types with
       * a less-than-certain answer, defaults to b, as organizations appear only
       * on the B side of CiviCRM core relationship types.
       *
       * @see getRelTypeOrgSide().
       */
      function getRelTypeOrgSideSafe(id) {
        return getRelTypeOrgSide(id) || 'b';
      }

      /**
       * Creates a new RelatedContact and selects it for editing.
       */
      $scope.addContact = function () {
        const relatedContact = RelatedContactService.add({});
        $scope.selectContact(relatedContact);
      }

      /**
       * Callback for crmProfileForm directive.
       *
       * Retrieves contact data from local cache to prevent an unnecessary
       * server roundtrip.
       *
       * @see the scope variable callbackCheckProfileCache for directive
       * crmProfileForm in module crmFieldMetadata.
       */
      $scope.getCachedContact = function (profileId, contactId) {
        let result = false;

        const contact = RelatedContactService.get({
          contactId: contactId
        })[0];
        if (contact.profileData.hasOwnProperty(profileId)) {
          result = contact.profileData[profileId];
        }

        return result;
      };

      /**
       * Public function for providing labels for relationship type IDs that
       * takes into account which side of the relationship the organization is
       * on.
       *
       * @param {string} id
       *   Relationship type ID.
       * @return {string}
       *   Human-readable label.
       */
      $scope.getRelTypeLabel = function (id) {
        const orgSide = getRelTypeOrgSideSafe(id);
        const otherContactSide = (orgSide === 'a' ? 'b' : 'a');
        return relTypeMetaData[id][`label_${otherContactSide}_${orgSide}`];
      };

      /**
       * Callback for crmProfileForm directive.
       *
       * After the contact is saved to the server, sends updated relationship
       * information to the server and updates the local cache.
       *
       * @see the scope variable callbackPostSave for directive crmProfileForm
       * in module crmFieldMetadata.
       */
      $scope.handlePostSave = function (params, result) {
        const contactId = result.id.toString();

        // update the name in the aggregate list
        $scope.selectedContact.sortName = result.values[contactId].sort_name;

        // save relationship data which crmProfileForm doesn't know about
        const relationshipApiParams = _.map($scope.selectedContact.relationships, function (rel) {
          if (rel.id) {
            return ['Relationship', 'create', rel];
          } else {
            const orgSide = getRelTypeOrgSideSafe(rel.relationship_type_id);
            const otherContactSide = (orgSide === 'a' ? 'b' : 'a');

            rel[`contact_id_${orgSide}`] = orgId;
            rel[`contact_id_${otherContactSide}`] = contactId;
            return ['Relationship', 'create', rel];
          }
        });

        // this somewhat unusual signature is documented here:
        // https://docs.civicrm.org/dev/en/latest/api/interfaces/#crmapi3
        crmApi(relationshipApiParams);

        // update the local cache with a newly added contact
        if (!_.find($scope.relatedContacts, {contactId: contactId})) {
          $scope.selectedContact.contactId = contactId;
          $scope.selectedContact.profileData = params;

          $scope.relatedContacts.push($scope.selectedContact);
        }
      };

      /**
       * @param {RelatedContact} contact
       *   As returned from the RelatedContactService.
       * @return {boolean}
       */
      $scope.hasActiveRelationship = function (contact) {
        return !!_.filter(contact.relationships, {is_active: '1'}).length;
      };

      /**
       * Indicates whether or not a given RelatedContact is the selected
       * contact (i.e., for editing).
       *
       * @param {RelatedContact} contact
       *   As returned from the RelatedContactService.
       * @return {boolean}
       */
      $scope.isSelected = function (contact) {
        return contact === $scope.selectedContact;
      };

      /**
       * Comparator function for orderBy filter.
       *
       * Sorts contacts first by whether or not they have an active
       * relationship, then by sort name.
       *
       * @see https://code.angularjs.org/1.5.11/docs/api/ng/filter/orderBy
       */
      $scope.orderContacts = function (c1, c2) {
        const c1active = $scope.hasActiveRelationship(c1.value);
        const c2active = $scope.hasActiveRelationship(c2.value);

        if (c1active === c2active) {
          if (c1.value.sortName < c2.value.sortName) {
            return -1;
          }
          if (c1.value.sortName > c2.value.sortName) {
            return 1;
          }
          return 0;
        } else if (c1active) {
          return -1;
        } else {
          return 1;
        }
      };

      /**
       * Populates the contact editor with the details for the selected contact.
       *
       * @param {RelatedContact} contact
       *   As returned from the RelatedContactService.
       */
      $scope.selectContact = function (contact) {
        $scope.selectedContact = contact;
        $scope.contactEditorIsOpen = true;
      };

    });

})(angular, CRM.$, CRM._);
