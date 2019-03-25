/* global ga */

/**
* Function that registers a click on an outbound link in Analytics.
* This function takes a valid URL string as an argument, and uses that URL string
* as the event label. Setting the transport method to 'beacon' lets the hit be sent
* using 'navigator.sendBeacon' in browser that support it.
*/
var getOutboundLink = function(e) {
  e.preventDefault()
  var url = e.target.href
  gtag('event', 'click', {
    'event_category': 'outbound',
    'event_label': url,
    'transport_type': 'beacon',
    'event_callback': function(){
      document.location = url
    }
  });
  return false;
}

var externalButtons = document.getElementsByClassName('frameworkbutton--external')

for (var i=0; i<externalButtons.length; i++) {
  externalButtons[i].onclick = getOutboundLink
}

var cookieValue = document.cookie.replace(/(?:(?:^|.*;\s*)seen_cookie_message\s*\=\s*([^;]*).*$)|^.*$/, "$1")
if (cookieValue === 'yes') {
  document.getElementById('global-cookie-message').style.display = 'none'
}

document.cookie = "seen_cookie_message=yes"