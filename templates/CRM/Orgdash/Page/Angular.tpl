{literal}
  <div ng-app="orgdash">
    <h1 crm-page-title>TODO: Title this page</h1>

    <!-- TODO: this nav is probably placeholder -->
    <div class="crm-tabset ui-tabs ui-corner-all ui-widget ui-widget-content">
      <ul role="tablist" class="ui-tabs-nav ui-corner-all ui-helper-reset ui-helper-clearfix ui-widget-header">
        <li class="ui-corner-all crm-tab-button ui-tabs-tab ui-corner-top ui-state-default ui-tab ui-tabs-active ui-state-active" role="tab" tabindex="0">
          <a ui-sref="org" role="presentation" tabindex="-1">
            {{ts('Organization Details')}}
          </a>
        </li>
        <li class="ui-corner-all crm-tab-button ui-tabs-tab ui-corner-top ui-state-default ui-tab ui-tabs-active ui-state-active" role="tab" tabindex="0">
          <a ui-sref="contacts" role="presentation" tabindex="-1">
            {{ts('Contacts and Benefits')}}
          </a>
        </li>
        <li class="ui-corner-all crm-tab-button ui-tabs-tab ui-corner-top ui-state-default ui-tab ui-tabs-active ui-state-active" role="tab" tabindex="0">
          <a ui-sref="txn" role="presentation" tabindex="-1">
            {{ts('Transaction History')}}
          </a>
        </li>
      </ul>
      <div ui-view></div>
    </div>
  </div>
{/literal}