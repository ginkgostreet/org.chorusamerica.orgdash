<?php

use CRM_Orgdash_ExtensionUtil as E;

class CRM_Orgdash_Permission_Relationship implements CRM_Orgdash_Permission_Interface {

  use CRM_Orgdash_Setting_Trait;

  /**
   * @inheritDoc
   */
  public static function canSkipPermissionsCheck($entity, $action, $params) {
    $permissionType = CRM_Orgdash_Permission::getPermissionType($action);
    $contactIds = self::getRelationshipEndpoints($params);
    if (empty($contactIds) && isset($params['id'])) {
      try {
        $relationship = civicrm_api3('Relationship', 'getsingle', ['id' => $params['id']]);
        $contactIds = self::getRelationshipEndpoints($relationship);
      }
      catch (Exception $e) {
        return FALSE;
      }
    }

    $allContactIdsAreAllowed = FALSE;
    $allowedList = array();
    if (!empty($contactIds) && isset($permissionType)) {
      $allowedList = CRM_Contact_BAO_Contact_Permission::allowList($contactIds, $permissionType);

      // If the initial list of contact IDs is identical to the one that has
      // been filtered based on permissions, ACLs, relationships, etc., then the
      // permissions check can be skipped.
      $allContactIdsAreAllowed = !array_diff($contactIds, $allowedList);
    }

    // For the creation of a relationship between an organization and a newly
    // created contact, only one of the contacts need be in the acting user's
    // allowed list.
    $createNewIsAllowed = (
      empty($params['id'])
      && strtolower($action) === 'create'
      && !empty($allowedList)
    );

    return $allContactIdsAreAllowed || $createNewIsAllowed;
  }

  /**
   * @param array $apiParams
   *   Parameters passed to the API.
   * @return array
   *   Contact ID(s) associated with the relationship(s) in the request.
   */
  private static function getRelationshipEndpoints($apiParams) {
    $contactIds = array();
    foreach (array('contact_id_a', 'contact_id_b') as $paramName) {
      if (isset($apiParams[$paramName])) {
        $contactIds[] = $apiParams[$paramName];
      }
    }

    return $contactIds;
  }

}
