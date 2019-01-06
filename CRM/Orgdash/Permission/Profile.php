<?php

class CRM_Orgdash_Permission_Profile implements CRM_Orgdash_Permission_Interface {

  use CRM_Orgdash_Setting_Trait;

  /**
   * @inheritDoc
   */
  public static function canSkipPermissionsCheck($entity, $action, $params) {
    $profileAllowed = self::wasConfiguredProfileInRequest($params);

    $contactId = CRM_Utils_Array::value('contact_id', $params);
    $permissionType = CRM_Orgdash_Permission::getPermissionType($action);
    $contactAllowed = FALSE;
    if (isset($contactId, $permissionType)) {
      $contactAllowed = CRM_Contact_BAO_Contact_Permission::allow($contactId, $permissionType);
    }
    elseif (!isset($contactId) && strtolower($action) === 'submit') {
      $contactAllowed = CRM_Core_Permission::check('add contacts');
    }

    return $profileAllowed && $contactAllowed;
  }

  /**
   * Determines whether or not an API request operates against a profile that is
   * configured to be used by the extension.
   *
   * @param array $params
   *   Parameters of an API request.
   * @return boolean
   */
  private static function wasConfiguredProfileInRequest($params) {
    $profileId = CRM_Utils_Array::value('profile_id', $params);
    return in_array($profileId, self::getConfiguredProfiles());
  }

}
