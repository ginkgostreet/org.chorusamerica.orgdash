<?php
// This file declares an Angular module which can be autoloaded
// in CiviCRM. See also:
// http://wiki.civicrm.org/confluence/display/CRMDOC/hook_civicrm_angularModules

use CRM_Orgdash_ExtensionUtil as E;

return array(
  'ext' => E::LONG_NAME,
  'basePages' => array(),
  'requires' => array(
    'ngAnimate',
    'ngAria',
  ),
  'js' => array(
    0 => 'node_modules/angular-material/angular-material.min.js',
  ),
  'css' => array(
    0 => 'node_modules/angular-material/angular-material.min.css',
  ),
  'partials' => array(),
  'settings' => array (),
);
