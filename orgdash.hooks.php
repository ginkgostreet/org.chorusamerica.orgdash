<?php

/**
 * This file contains custom hook implementations.
 *
 * Civix-generated, boilerplate implementations of hooks which provide
 * essential, generic wire-up/registration functions for extensions are located
 * in orgdash.php.
 */
use CRM_Orgdash_ExtensionUtil as E;

/**
 * Implements hook_civicrm_alterAPIPermissions().
 *
 * @link https://docs.civicrm.org/dev/en/latest/hooks/hook_civicrm_alterAPIPermissions/
 */
function orgdash_civicrm_alterAPIPermissions($entity, $action, &$params, &$permissions) {
  if (CRM_Orgdash_Permission::canSkipPermissionsCheck($entity, $action, $params)) {
    $params['check_permissions'] = FALSE;
  }
}

/**
 * Implements hook_civicrm_navigationMenu().
 *
 * @link http://wiki.civicrm.org/confluence/display/CRMDOC/hook_civicrm_navigationMenu
 */
function orgdash_civicrm_navigationMenu(&$menu) {
  _orgdash_civix_insert_navigation_menu($menu, 'Administer/System Settings', array(
    'label' => E::ts('Organization Dashboard'),
    'name' => 'orgash_configure',
    'url' => 'civicrm/admin/extensions/orgdash',
    'permission' => 'administer CiviCRM',
    'separator' => 0,
  ));
  _orgdash_civix_navigationMenu($menu);
}
