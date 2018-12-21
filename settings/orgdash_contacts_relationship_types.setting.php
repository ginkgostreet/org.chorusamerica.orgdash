<?php

/**
 * @see https://docs.civicrm.org/dev/en/latest/hooks/hook_civicrm_alterSettingsFolders/
 * @see https://docs.civicrm.org/dev/en/latest/framework/setting/
 */
use CRM_Orgdash_ExtensionUtil as E;

$setting = 'orgdash_contacts_relationship_types';

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
    'description' => E::ts("Specifies the relationship types to use when building an organization's list of related contacts."),
    'entity_reference_options' => [
      'entity' => 'RelationshipType',
      'multiple' => TRUE,
    ],
    'html_type' => 'entity_reference',
    'settings_pages' => [
      'orgdash' => [
        'weight' => 15,
      ],
    ],
    'title' => E::ts('Relationship Types for Contacts'),
  ),
);
