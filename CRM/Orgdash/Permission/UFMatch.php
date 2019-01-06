<?php

use CRM_Orgdash_ExtensionUtil as E;

class CRM_Orgdash_Permission_UFMatch implements CRM_Orgdash_Permission_Interface {

  use CRM_Orgdash_Setting_Trait;

  /**
   * @inheritDoc
   */
  public static function canSkipPermissionsCheck($entity, $action, $params) {
    $contactId = $params['contact_id'];
    $permissionType = CRM_Orgdash_Permission::getPermissionType($action);

    if (isset($contactId, $permissionType)) {
      return CRM_Contact_BAO_Contact_Permission::allow($contactId, $permissionType);
    }

    return FALSE;
  }

}
