<?php
// This file declares an Angular module which can be autoloaded
// in CiviCRM. See also:
// http://wiki.civicrm.org/confluence/display/CRMDOC/hook_civicrm_angularModules

use CRM_Orgdash_ExtensionUtil as E;

return array(
  'ext' => E::LONG_NAME,
  'basePages' => array(),
  'requires' => array(),
  'js' => array(
    0 => 'node_modules/@uirouter/angularjs/release/angular-ui-router.js',
  ),
  'css' => array(),
  'partials' => array(),
  'settings' => array (),
);
