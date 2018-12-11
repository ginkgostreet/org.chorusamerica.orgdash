<?php
// This file declares an Angular module which can be autoloaded
// in CiviCRM. See also:
// http://wiki.civicrm.org/confluence/display/CRMDOC/hook_civicrm_angularModules

use CRM_Orgdash_ExtensionUtil as E;

return array(
  'ext' => E::LONG_NAME,
  'basePages' => array('civicrm/orgdash'),
  'requires' => array(
    'crmFieldMetadata',
    'crmUi',
    'crmUtil',
    'ui.router',
  ),
  'js' => array (
    0 => 'ang/orgdash.js',
    1 => 'ang/orgdash/*.js',
    2 => 'ang/orgdash/*/*.js',
  ),
  'css' => array (
    0 => 'ang/orgdash.css',
  ),
  'partials' => array (
    0 => 'ang/orgdash',
    1 => 'ang/orgdash/partials',
  ),
  'settings' => array (),
);
