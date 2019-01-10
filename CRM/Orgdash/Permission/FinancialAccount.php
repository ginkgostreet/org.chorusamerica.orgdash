<?php

class CRM_Orgdash_Permission_FinancialAccount implements CRM_Orgdash_Permission_Interface {

  /**
   * @inheritDoc
   */
  public static function canSkipPermissionsCheck($entity, $action, $params) {
    $allowedParams = array(
      'return' => 'name',
      'sequential' => 1,
      // the following are added automatically by the client
      'check_permissions' => TRUE,
      'version' => 3,
    );

    // Note that the array equality check is pretty strict, but we don't want to
    // bypass checks for any API request except the one made by the extension.
    return (strtolower($action) === 'get' && $params === $allowedParams);
  }

}
