<?php

class CRM_Orgdash_Permission implements CRM_Orgdash_Permission_Interface {

  /**
   * @inheritDoc
   */
  public static function canSkipPermissionsCheck($entity, $action, $params) {
    $permissionsClass = __CLASS__ . '_' . CRM_Utils_String::convertStringToCamel($entity);

    // Check class exists due to undocumented warning raised by class_implements();
    // see http://php.net/manual/en/function.class-implements.php#113612.
    if (class_exists($permissionsClass) && class_implements($permissionsClass, CRM_Orgdash_Permission_Interface::class)) {
      return call_user_func(array($permissionsClass, __FUNCTION__), $entity, $action, $params);
    }
    return FALSE;
  }

  /**
   * Helper function to translate API actions to permissions requirements.
   *
   * @param string $apiAction
   *   'get', 'create', etc.
   * @return mixed
   *   CRM_Core_Permission::EDIT | CRM_Core_Permission::VIEW | NULL
   */
  public static function getPermissionType($apiAction) {
    switch (strtolower($apiAction)) {
      case 'get':
      case 'getsingle':
      case 'getvalue':
        $permissionType = CRM_Core_Permission::VIEW;
        break;
      case 'create':
      case 'submit':
        $permissionType = CRM_Core_Permission::EDIT;
        break;
      default:
        $permissionType = NULL;
    }

    return $permissionType;
  }

}
