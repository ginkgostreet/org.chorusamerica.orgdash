<?php

/**
 * @see https://docs.civicrm.org/dev/en/latest/hooks/hook_civicrm_alterSettingsFolders/
 * @see https://docs.civicrm.org/dev/en/latest/framework/setting/
 */
use CRM_Orgdash_ExtensionUtil as E;

$setting = 'orgdash_single_contact_profile';

return array(
  $setting => array(
    'is_contact' => FALSE,
    'is_domain' => TRUE,
    'name' => $setting,
    'type' => 'Integer',

    // Metadata for the UI
    'description' => E::ts('Specifies the profile to use for editing a single contact associated with the organization.'),
    'entity_reference_options' => ['entity' => 'ufgroup'],
    'html_type' => 'entity_reference',
    'settings_pages' => ['orgdash'],
    'title' => E::ts('Single Contact Profile (Organization Dashboard)'),
  ),
);
