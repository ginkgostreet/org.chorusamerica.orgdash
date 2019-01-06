<?php

class CRM_Orgdash_Permission_MembershipStatus implements CRM_Orgdash_Permission_Interface {

  /**
   * @inheritDoc
   */
  public static function canSkipPermissionsCheck($entity, $action, $params) {
    $isAGet = in_array(strtolower($action), array('get', 'getsingle'));
    return ($isAGet && CRM_Utils_Array::value('return', $params) === array('is_current_member', 'label'));
  }

}
