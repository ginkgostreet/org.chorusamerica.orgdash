<?php
use CRM_Orgdash_ExtensionUtil as E;

class CRM_Orgdash_Page_Angular extends CRM_Core_Page {

  use CRM_Orgdash_Setting_Trait;

  public function run() {
    $this->exposeConfigurations();

    // See https://docs.civicrm.org/dev/en/latest/framework/angular/loader/#other-base-pages.
    $loader = new \Civi\Angular\AngularLoader();
    $loader->setModules(array('orgdash'));
    $loader->setPageName('civicrm/orgdash');
    $loader->load();

    CRM_Core_Resources::singleton()->addScriptFile(E::LONG_NAME, 'js/angular-init-helper.js');

    parent::run();
  }

  /**
   * Helper function which makes all CiviCRM settings that are prefixed with the
   * shortname of the extension available client-side in the CRM object.
   *
   * For app-wide configurations, it is convenient to make these available
   * before AngularJS bootstraps rather resolve them before each route/state
   * where they are needed.
   */
  private function exposeConfigurations() {
    CRM_Core_Resources::singleton()->addVars(E::SHORT_NAME, self::getExtensionSettings());
  }

}
