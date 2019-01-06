<?php

use CRM_Orgdash_ExtensionUtil as E;

class CRM_Orgdash_Permission_UFMatch implements CRM_Orgdash_Permission_Interface {

  use CRM_Orgdash_Setting_Trait;

  /**
   * @inheritDoc
   */
  public static function canSkipPermissionsCheck($entity, $action, $params) {
    $contactIds = (array) $params['contact_id'];
    $permissionType = CRM_Orgdash_Permission::getPermissionType($action);

    if (!empty($contactIds) && isset($permissionType)) {
      // If the initial list of contact IDs is identical to the one that has
      // been filtered based on permissions, ACLs, relationships, etc., then the
      // permissions check can be skipped.
      return ($contactIds == CRM_Contact_BAO_Contact_Permission::allowList($contactIds, $permissionType));
    }

    return FALSE;
  }

}
