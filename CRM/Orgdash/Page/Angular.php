<?php
use CRM_Orgdash_ExtensionUtil as E;

class CRM_Orgdash_Page_Angular extends CRM_Core_Page {

  public function run() {
    CRM_Utils_System::setTitle(E::ts('Organization Dashboard'));
    $this->exposeConfigurations();

    // See https://docs.civicrm.org/dev/en/latest/framework/angular/loader/#other-base-pages.
    $loader = new \Civi\Angular\AngularLoader();
    $loader->setModules(array('orgdash'));
    $loader->setPageName('civicrm/orgdash');
    $loader->load();

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
    // It seems inefficient to fetch *all* CiviCRM settings, but this is what
    // Civi::settings()->get() does under the hood, so we might as well do it
    // just once.
    $allSettings = Civi::settings()->all();

    $extensionConfigs = array_filter($allSettings, function ($settingName) {
      return (strpos($settingName, E::SHORT_NAME . '_') === 0);
    }, ARRAY_FILTER_USE_KEY);

    CRM_Core_Resources::singleton()->addVars(E::SHORT_NAME, $extensionConfigs);
  }

}
