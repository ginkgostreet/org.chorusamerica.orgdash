<?php

/**
 * @see https://docs.civicrm.org/dev/en/latest/hooks/hook_civicrm_alterSettingsFolders/
 * @see https://docs.civicrm.org/dev/en/latest/framework/setting/
 */
use CRM_Orgdash_ExtensionUtil as E;

$setting = 'orgdash_org_profile_id';

return array(
  $setting => array(
    'name' => $setting,
    'type' => 'Integer',
    'is_domain' => TRUE,
    'is_contact' => FALSE,

    // Metadata for the UI
    'description' => E::ts('Specifies the profile to use for editing organization contact information.'),
    'entity_reference_options' => ['entity' => 'UFGroup'],
    'html_type' => 'entity_reference',
    'settings_pages' => [
      'orgdash' => [
        'weight' => 5,
      ],
    ],
    'title' => E::ts('Organization Profile'),
  ),
);
