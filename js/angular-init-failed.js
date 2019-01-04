(function(ts, $) {
  // If AngularJS hasn't booted after five seconds (replacing the content of the
  // ui-view and hence removing the init message container from the DOM), it
  // probably isn't going to. Let's provide some kind of user feedback.
  setTimeout(function () {
    const initMessageContainer = $('#orgdash-initializing');
    if (initMessageContainer.length !== 0) {
      initMessageContainer.html('<h2 class="crm-error">'
        + ts('The organization dashboard has failed to load.')
        + '</h2>'
        + '<p>'
        + ts('Perhaps a JavaScript error occurred or your connection to the server was interrupted.')
        + '</p>'
        + '<p>'
        + ts("You may be able to better understand the nature of the problem by trying some of <a href='%1' target='_blank'>these debugging tips</a> (see especially those regarding the browser's JavaScript console). While it is likely only the site administer can ultimately address the problem, any information you can provide will be helpful.", {1: 'https://forum.civicrm.org/index.php?topic=35850.0'})
        + '</p>'
      );
    }
  }, 5000);
}(CRM.ts('orgdash'), CRM.$));
