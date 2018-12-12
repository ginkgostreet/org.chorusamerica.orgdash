(function(angular, $, _) {

  angular.module('orgdash')
    .controller('ContactsCtrl', function($scope, RelatedContactService, highlightedRelTypes, profileId) {
      $scope.contactEditorIsOpen = false;
      $scope.highlightedRelTypes = highlightedRelTypes;
      $scope.profileId = profileId;
      $scope.relatedContacts = RelatedContactService.get();
      $scope.selectedContact;

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
       * Callback for crmProfileForm directive.
       *
       * After the contact is saved to the server, updates the local cache.
       *
       * @see the scope variable callbackPostSave for directive crmProfileForm
       * in module crmFieldMetadata.
       */
      $scope.handlePostSave = function (params, result) {
        const contactId = result.id.toString();
        $scope.selectedContact.sortName = result.values[contactId].sort_name;

        if (!_.find($scope.relatedContacts, {contactId: contactId})) {
          $scope.selectedContact.contactId = contactId;
          $scope.selectedContact.profileData = params;
          $scope.selectedContact.relationships = {}; // TODO

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
