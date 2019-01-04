<?php

use CRM_Orgdash_ExtensionUtil as E;

class CRM_Orgdash_Permission_RelationshipType implements CRM_Orgdash_Permission_Interface {

  use CRM_Orgdash_Setting_Trait;

  /**
   * @inheritDoc
   */
  public static function canSkipPermissionsCheck($entity, $action, $params) {
    return self::wasConfiguredRelationshipTypeInRequest($params);
  }

  /**
   * Determines whether or not an API request operates against a relationship
   * type that is configured to be used by the extension.
   *
   * @param array $params
   *   Parameters of an API request.
   * @return boolean
   */
  private static function wasConfiguredRelationshipTypeInRequest($params) {
    $typeIds = CRM_Utils_Array::value('id', $params, array());
    $typeIdsArr = (is_array($typeIds) ? CRM_Utils_Array::value('IN', $typeIds, array()) : (array) $typeIds);
    $allParamIdsAreConfigured = !array_diff($typeIdsArr, self::getConfiguredRelationshipTypes());
    return $allParamIdsAreConfigured;
  }

}
