<?php

class CRM_Orgdash_Permission_ContributionRecur implements CRM_Orgdash_Permission_Interface {

  /**
   * @inheritDoc
   */
  public static function canSkipPermissionsCheck($entity, $action, $params) {
    $ids = CRM_Utils_Array::value('id', $params, array());
    $idsArr = (is_array($ids) ? CRM_Utils_Array::value('IN', $ids, array()) : (array) $ids);
    $permissionType = CRM_Orgdash_Permission::getPermissionType($action);

    if (!empty($idsArr) && $permissionType === CRM_Core_Permission::VIEW) {
      // Unfortuately, to check if the user should be allowed to execute the
      // request, we must first retrieve the result.
      $recurringContributions = civicrm_api3('ContributionRecur', 'get', array(
        'id' => ['IN' => $idsArr],
        'options' => ['limit' => 0],
      ))['values'];

      $contactIds = array_column($recurringContributions, 'contact_id');
      return CRM_Contact_BAO_Contact_Permission::allowList($contactIds, $permissionType);
    }

    return FALSE;
  }

}
