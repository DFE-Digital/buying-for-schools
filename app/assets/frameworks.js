/* global ga */

function handleOutboundLinkClicks(event) {
  console.log(event.target.href)
  ga('send', 'event', 'Framework link', 'click', event.target.href)
}

var externalButtons = document.getElementsByClassName('frameworkbutton--external')

for (var i=0; i<externalButtons.length; i++) {
  externalButtons[i].onclick = handleOutboundLinkClicks
}

