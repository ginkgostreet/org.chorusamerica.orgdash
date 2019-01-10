<?php

class CRM_Orgdash_Permission_OptionValue implements CRM_Orgdash_Permission_Interface {

  /**
   * @inheritDoc
   */
  public static function canSkipPermissionsCheck($entity, $action, $params) {
    $isAllowedGet = in_array(strtolower($action), array('get', 'getvalue'));
    return (
      $isAllowedGet
      && CRM_Utils_Array::value('option_group_id', $params) === 'contribution_status'
      && CRM_Utils_Array::value('return', $params) === 'label'
    );
  }

}
