<?php

use CRM_Orgdash_ExtensionUtil as E;

/**
 * Consolidates methods related to extension settings.
 *
 * The use of regex patterns is an attempt to future-proof against the
 * addition of new settings. Provided they follow these naming conventions, new
 * settings will get the same treatment as their counterparts with no updates to
 * this trait (e.g., string-to-array conversion, needed to account for the
 * peculiarities of the entityRef widget, will occur for a new relationship type
 * setting).
 */
trait CRM_Orgdash_Setting_Trait {

  /**
   * @var array
   *   Settings associated with this extension, keyed by setting name.
   */
  private static $extensionSettings = array();

  /**
   * @var string
   *   Pattern to match the naming convention for settings that hold profile IDs.
   */
  private static $patternProfile = '#^' . E::SHORT_NAME . '_.+profile$#';

  /**
   * @var string
   *   Pattern to match the naming convention for settings that hold
   *   relationship types.
   */
  private static $patternRelationshipTypes = '#^' . E::SHORT_NAME . '_.+relationship_types$#';

  /**
   * @return array
   *   The IDs of all the profiles configured to be used by the extension, keyed
   *   by setting name.
   */
  private static function getConfiguredProfiles() {
    return array_filter(self::getExtensionSettings(), function ($settingName) {
      return preg_match(self::$patternProfile, $settingName);
    }, ARRAY_FILTER_USE_KEY);
  }

  /**
   * @return array
   *   The IDs of all the relationship types configured to be used by the
   *   extension.
   */
  private static function getConfiguredRelationshipTypes() {
    $relationshipTypeSettings = array_filter(self::getExtensionSettings(), function ($settingName) {
      return preg_match(self::$patternRelationshipTypes, $settingName);
    }, ARRAY_FILTER_USE_KEY);

    $relationshipTypeIds = array();
    foreach ($relationshipTypeSettings as $value) {
      $relationshipTypeIds = array_merge($relationshipTypeIds, $value);
    }

    return array_unique($relationshipTypeIds);
  }

  /**
   * @return array
   *   Settings associated with this extension, keyed by setting name.
   */
  private static function getExtensionSettings() {
    if (empty(self::$extensionSettings)) {
      // It seems inefficient to fetch *all* CiviCRM settings, but this is what
      // Civi::settings()->get() does under the hood, so we might as well do it
      // just once.
      //
      // Sigh, settings fetched through the Civi interface are not deserialized...
      // $allSettings = Civi::settings()->all();
      //
      // ... so we use the API instead.
      $allSettings = civicrm_api3('Setting', 'get', array(
            'sequential' => 1,
          ))['values'][0];

      $extensionSettings = array_filter($allSettings, function ($settingName) {
        return (strpos($settingName, E::SHORT_NAME . '_') === 0);
      }, ARRAY_FILTER_USE_KEY);

      // The entityRef widget on the settings form saves multiple selections
      // as comma-separated strings (rather than as arrays). The transformation
      // to the more useful array format is centralized here.
      foreach ($extensionSettings as $settingName => &$settingValue) {
        if (preg_match(self::$patternRelationshipTypes, $settingName)) {
          $settingValue = explode(',', $settingValue);
        }
      }

      self::$extensionSettings = $extensionSettings;
    }

    return self::$extensionSettings;
  }

}
