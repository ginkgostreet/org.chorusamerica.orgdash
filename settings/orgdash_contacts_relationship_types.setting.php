<?php

/**
 * @see https://docs.civicrm.org/dev/en/latest/hooks/hook_civicrm_alterSettingsFolders/
 * @see https://docs.civicrm.org/dev/en/latest/framework/setting/
 */
use CRM_Orgdash_ExtensionUtil as E;

$setting = 'orgdash_contacts_relationship_types';

return array(
  $setting => array(
    'default' => [],
    'is_contact' => FALSE,
    'is_domain' => TRUE,
    'name' => $setting,
    // Stored as a serialized string rather than an array of IDs per
    // https://docs.civicrm.org/dev/en/latest/framework/setting/#supported-properties
    'serialize' => CRM_Core_DAO::SERIALIZE_JSON,
    'type' => 'String',

    // Metadata for the UI
    'description' => E::ts("Specifies the relationship types to use when building an organization's list of related contacts."),
    'entity_reference_options' => [
      'entity' => 'relationshiptype',
      'multiple' => TRUE,
    ],
    'html_type' => 'entity_reference',
    'settings_pages' => ['orgdash'],
    'title' => E::ts('Relationship Types for Contacts (Organization Dashboard)'),
  ),
);
