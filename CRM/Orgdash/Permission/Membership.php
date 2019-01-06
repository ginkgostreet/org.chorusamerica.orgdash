<?php

class CRM_Orgdash_Permission_Membership implements CRM_Orgdash_Permission_Interface {

  /**
   * @inheritDoc
   */
  public static function canSkipPermissionsCheck($entity, $action, $params) {
    $contactId = $params['contact_id'];
    $permissionType = CRM_Orgdash_Permission::getPermissionType($action);

    if (isset($contactId) && $permissionType === CRM_Core_Permission::VIEW) {
      return CRM_Contact_BAO_Contact_Permission::allow($contactId, $permissionType);
    }

    return FALSE;
  }

}
