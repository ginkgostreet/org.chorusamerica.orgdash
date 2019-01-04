<?php

class CRM_Orgdash_Permission_Profile implements CRM_Orgdash_Permission_Interface {

  use CRM_Orgdash_Setting_Trait;

  /**
   * @inheritDoc
   */
  public static function canSkipPermissionsCheck($entity, $action, $params) {
    $profileAllowed = self::wasConfiguredProfileInRequest($params);
    $contactAllowed = self::hasPermissionOverContact($params);

    return $profileAllowed && $contactAllowed;
  }

  /**
   * Determines whether the acting user has permission over the contact.
   *
   * This is not the test we'd like:
   * - The overhead of actually getting the contact to determine if we can read
   *   or write is a bit high.
   * - There is an assumption here that a user has permission to edit any
   *   contact they can view, which is acceptable for initial use cases but may
   *   not be in the long haul.
   *
   * Inspecting relationships directly could prove onerous, as transitive
   * permissions (Jane Boss can edit Acme Corp, and Acme Corp can edit Bee
   * Worker, so Jane can edit Bee) would need to be taken into account, and our
   * nz.co.fuzion.relatedpermissions dependency is already doing some of that
   * heavy lifting. Ideally, some method from core or the dependency would allow
   * us to check if an operation is allowed (e.g., can Jane edit Bee?) without
   * having to actually try it.
   *
   * @param array $params
   *   Parameters of an API request.
   * @return bool
   */
  private static function hasPermissionOverContact($params) {
    $duckTest = civicrm_api3('Contact', 'get', [
      'check_permissions' => TRUE,
      'id' => $params['contact_id'],
    ]);

    return ($duckTest['is_error'] === 0 && $duckTest['count'] === 1);
  }

  /**
   * Determines whether or not an API request operates against a profile that is
   * configured to be used by the extension.
   *
   * @param array $params
   *   Parameters of an API request.
   * @return boolean
   */
  private static function wasConfiguredProfileInRequest($params) {
    $profileId = CRM_Utils_Array::value('profile_id', $params);
    return in_array($profileId, self::getConfiguredProfiles());
  }

}
