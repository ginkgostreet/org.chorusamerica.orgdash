<?php

interface CRM_Orgdash_Permission_Interface {

  /**
   * Determines whether there are reasons for skipping traditional API
   * permissions checks (e.g., the user is requesting information about an
   * entity they would normally not have access to, but which is configured
   * for use in the organization dashboard). Expected use is that consuming code
   * will set $params['check_permissions'] to FALSE if checks can be skipped.
   *
   * @param string $entity
   *   The entity the API deals with (e.g., 'relationship_type').
   * @param string $action
   *   The requested API action (e.g., 'get').
   * @param array $params
   *   The API parameters.
   * @return boolean
   */
  public static function canSkipPermissionsCheck($entity, $action, $params);
}
