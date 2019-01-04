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

}
