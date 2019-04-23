# Organization Dashboard

![Screenshot](/images/screenshot.png)

Organization Dashboard (org.chorusamerica.orgdash) is an extension for
[CiviCRM](https://civicrm.org) which provides an interface for appropriately
permissioned users to administer the organizations to which they belong.
The interface is intended to be a public-facing rather than a backend tool: the
anticipated audience is the membership base of the CiviCRM installation owner.
An organization administrator may update the organization's details as well as
manage relationships and contact information for contacts related to her
organization.

The extension strives to give site administrators maximal flexibility. A site
admin may configure:
* which relationship types to display in the dashboard
* which relationship types to highlight in the contact list view
* which relationship types to use when building an organization's list of
  bestowable benefits
* which profiles to use for editing the organization or associated contacts

## Installation

This extension has not yet been published for in-app installation. [General
extension installation instructions](https://docs.civicrm.org/sysadmin/en/latest/customize/extensions/#installing-a-new-extension)
are available in the CiviCRM System Administrator Guide.

This extension has JavaScript dependencies which are declared in `package.json`.
To install them:

```bash
cd <extension-root>
node install
```

## Requirements
* CiviCRM v5.10+
* [Related Permissions Module (nz.co.fuzion.relatedpermissions)](https://github.com/eileenmcnaughton/nz.co.fuzion.relatedpermissions)
  * Allows the permission flag on a contact's relationship to work as a true ACL.
* [Civicrm FieldMetadata (org.civicrm.fieldmetadata)](https://github.com/ginkgostreet/org.civicrm.fieldmetadata) v1.1+
  * Allows building AngularJS forms and widgets from field metadata.

### Notes on CiviCRM version dependency
In v5.8, CiviCRM [introduced](https://github.com/civicrm/civicrm-core/commit/f167c7a9f5b5d146eca4cefd8aab89dc4f995a9a#diff-1a5e8b8c5ce730e1f211c070478823d7)
a ["generic" settings form](https://docs.civicrm.org/dev/en/latest/framework/setting/#creating-a-new-setting-in-an-extension)
which builds a user interface based off of [settings metadata](https://docs.civicrm.org/dev/en/latest/framework/setting/#supported-properties).
Organization Dashboard's administrative interface is built on the "generic"
settings form. Users running an earlier version of CiviCRM will either need to
backport the "generic" form functionality (cursory review indicates this is not
as straightforward adding the new `CRM_Admin_Form_Generic` class and porting
updates to the `CRM_Admin_Form_SettingTrait` trait) or configure the extension
outside the user interface (e.g., via the settings API or hardcoded values in
`civicrm.settings.php`).

In v5.10, some problems with how CiviCRM handles case variability in API requests
were [corrected](https://github.com/civicrm/civicrm-core/pull/13343). This bugfix
is required to enable entityRef autocomplete widgets to be used with Profiles
in the administrative interface. Organization Dashboard makes use of the same
corrected logic in delegating API permissions overrides to entity-specific
classes (see `CRM_Orgdash_Permission::canSkipPermissionsCheck()`).

## Usage
* Configure the extension by navigating to _Administer > System Settings >
  Organization Dashboard_. Permission "administer CiviCRM" is required.
* The "access AJAX API"  permission is required for all public-facing
  organization dashboard pages.
* A user may navigate to CiviCRM path __/civicrm/orgdash_ to visit her organizations'
  dashboards. If she doesn't have any permissioned relationships, she will see a
  message indicating she does't have permission to administer any organizations.
  If she has a permissioned relationship with exactly one organization, she will
  be redirected to /civicrm/orgdash/#/<organization_contact_id>/org. If she has
  permissioned relationships with more than one organization, she will be
  presented a menu to select the organization to administer.
* Users visiting CiviCRM path _/civicrm/orgdash/#/<organization_contact_id>_ and
  lacking permission to edit the organization (via ACL, permissioned relationship,
  global permissions like "edit all contacts," etc.) will be denied access.
* To add new contacts to the organization, the acting user should have the "add
  contacts" permission.

## Technologies
TODO

## Known Issues
* phone numbers
* primary
* use of internal ACL class


## License

[AGPL-3.0](https://github.com/ginkgostreet/org.chorusamerica.orgdash/blob/master/LICENSE.txt)