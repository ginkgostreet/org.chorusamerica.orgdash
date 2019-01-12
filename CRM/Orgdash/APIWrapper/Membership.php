<?php

class CRM_Orgdash_APIWrapper_Membership implements API_Wrapper {

  /**
   * Passing this option with a truthy value triggers the API wrapper.
   *
   * While it may be tempting to use a custom key in the "return" parameter
   * (e.g. $apiRequest['params']['return']['contribution_page_id']), there is
   * enough baked-in behavior around "return" (i.e., most fields except those
   * specified are excluded from the result) that doing so would overload
   * it more than it already has been. ("Return" is also used for cross-entity
   * joining.) Using a custom option allows the possibility of requesting all
   * fields (without specifying them individually) plus the contribution_page_id.
   */
  const TRIGGERING_OPTION_NAME = 'return_contribution_page_id';

  /**
   * @var int
   */
  private static $defaultRenewPageId;

  /**
   * @var array
   */
  private static $membershipTypesConfiguredInDefaultRenewalPage;

  /**
   * Determines whether or not an API request qualifies for special action.
   *
   * @param array $apiRequest
   * @return boolean
   */
  public static function isQualifyingMembership($apiRequest) {
    return (
      strtolower($apiRequest['entity']) == 'membership'
      && strtolower($apiRequest['action']) == 'get'
      && isset($apiRequest['params']['options'][self::TRIGGERING_OPTION_NAME])
      // truthiness check
      && $apiRequest['params']['options'][self::TRIGGERING_OPTION_NAME]
    );
  }

  /**
   * @inheritDoc
   */
  public function fromApiInput($apiRequest) {
    return $apiRequest;
  }

  /**
   * @inheritDoc
   */
  public function toApiOutput($apiRequest, $result) {
    self::setContributionPageIds($result);
    return $result;
  }

  /**
   * For each membership in the result, adds contribution_page_id key.
   *
   * First checks any membership payments for an associated contribution page.
   * Falls back to the globally configured default renewal contribution page, if
   * it sells the membership type in question.
   *
   * @param array $apiResult
   */
  private static function setContributionPageIds(&$apiResult) {
    foreach ($apiResult['values'] as &$membership) {
      $membership['contribution_page_id'] = CRM_Member_BAO_Membership::getContributionPageId($membership['id']);
      $membershipTypeId = CRM_Utils_Array::value('membership_type_id', $membership);
      if (empty($membership['contribution_page_id'])
        && isset($membershipTypeId)
        && in_array($membershipTypeId, self::getMembershipTypesConfiguredInDefaultRenewalPage())
      ) {
        $membership['contribution_page_id'] = self::getDefaultRenewalPageId();
      }
    }
  }

  /**
   * @return mixed
   *   The ID of the globally configured default renewal contribution page, or NULL.
   */
  private static function getDefaultRenewalPageId() {
    if (!isset(self::$defaultRenewPageId)) {
      self::$defaultRenewPageId = Civi::settings()->get('default_renewal_contribution_page');
    }

    return self::$defaultRenewPageId;
  }

  /**
   * @return array
   *   Membership type IDs supported by the default renewal contribution page.
   */
  private static function getMembershipTypesConfiguredInDefaultRenewalPage() {
    if (!isset(self::$membershipTypesConfiguredInDefaultRenewalPage)) {
      $defaultRenewalPageId = self::getDefaultRenewalPageId();
      try {
        $membershipTypes = array_keys(unserialize(civicrm_api3('MembershipBlock', 'getvalue', [
          'return' => "membership_types",
          'entity_id' => $defaultRenewalPageId,
        ])));
      }
      catch (Exception $e) {
        $membershipTypes = array();
      }

      self::$membershipTypesConfiguredInDefaultRenewalPage = $membershipTypes;
    }

    return self::$membershipTypesConfiguredInDefaultRenewalPage;
  }

}
