<?php

/**
 * Class CRM_Orgdash_Setting_Rule.
 *
 * A utility class for validating this extension's settings.
 */
class CRM_Orgdash_Setting_Rule {

  public static function isArray(&$value) {
    return true;
    if (is_string($value)) {
      $value = explode(',', $value);
    }

    return is_array($value);
  }

}
