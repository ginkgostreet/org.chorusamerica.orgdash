<?php
use CRM_Orgdash_ExtensionUtil as E;

class CRM_Orgdash_Page_Angular extends CRM_Core_Page {

  public function run() {
    CRM_Utils_System::setTitle(E::ts('Organization Dashboard'));

    // See https://docs.civicrm.org/dev/en/latest/framework/angular/loader/#other-base-pages.
    $loader = new \Civi\Angular\AngularLoader();
    $loader->setModules(array('orgdash'));
    $loader->setPageName('civicrm/orgdash');
    $loader->useApp(array(
      'defaultRoute' => '/dash',
    ));
    $loader->load();

    parent::run();
  }

}
