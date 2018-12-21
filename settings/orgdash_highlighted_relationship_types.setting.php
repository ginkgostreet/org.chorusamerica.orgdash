<?php

/**
 * @see https://docs.civicrm.org/dev/en/latest/hooks/hook_civicrm_alterSettingsFolders/
 * @see https://docs.civicrm.org/dev/en/latest/framework/setting/
 */
use CRM_Orgdash_ExtensionUtil as E;

$setting = 'orgdash_highlighted_relationship_types';

return array(
  $setting => array(
    'default' => '',
    'is_contact' => FALSE,
    'is_domain' => TRUE,
    'name' => $setting,
    // Stored as a string rather than an array of IDs because the entityRef
    // widget returns comma-separated values.
    'type' => 'String',

    // Metadata for the UI
    'description' => E::ts('Each specified relationship type will be highlighted as a column in the aggregate contact view: Yes/No for whether such a relationship exists between the contact and the organization.'),
    'entity_reference_options' => [
      'entity' => 'RelationshipType',
      'multiple' => TRUE,
    ],
    'html_type' => 'entity_reference',
    'settings_pages' => [
      'orgdash' => [
        'weight' => 25,
      ],
    ],
    'title' => E::ts('Highlighed Relationship Types'),
  ),
);
