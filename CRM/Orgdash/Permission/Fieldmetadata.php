<?php

class CRM_Orgdash_Permission_Fieldmetadata implements CRM_Orgdash_Permission_Interface {

  use CRM_Orgdash_Setting_Trait;

  /**
   * @inheritDoc
   */
  public static function canSkipPermissionsCheck($entity, $action, $params) {
    return self::wasConfiguredProfileInRequest($params);
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
    if (!isset($params['entity_params']['id'], $params['entity'])) {
      return FALSE;
    }
    $metaEntity = strtolower($params['entity']);
    $profileId = $params['entity_params']['id'];
    return ($metaEntity === 'ufgroup' && in_array($profileId, self::getConfiguredProfiles()));
  }

}
