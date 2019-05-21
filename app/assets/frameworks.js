/* global ga */

var doSurvey = document.getElementById('mainscript').getAttribute('data-survey') === 'true'

function getCookie(name) {
  function escape(s) { 
    return s.replace(/([.*+?\^${}()|\[\]\/\\])/g, '\\$1')
  }
  var match = document.cookie.match(RegExp('(?:^|;\\s*)' + escape(name) + '=([^;]*)'))
  return match ? match[1] : null
}

function clearCookie(name) {
  document.cookie = name + "=;Path=/;Expires=Thu, 01 Jan 1970 00:00:00 GMT"
}

function setCookie(name, value) {
  document.cookie = name + '=' + value + ";Path=/;"
}

//## SURVEY ##//

// pre service //

// check the page to see if we need to enforce the pre-service survey
var checkThisPage = function(url) {
  if (url.substr(0, 11) !== '/frameworks') {
    return true
  }
  if (url === '/frameworks/type') {
    return true
  }
  return false
}

var getPreServiceSurveyUrl = function (uid) {
  return 'https://paperstudio.typeform.com/to/fL7D4D?uid=' + uid + '&service_url=' + encodeURI(window.location.href)
}

// if uid is set and page is in scope then set cookie and open the survey url
var uid = getCookie('uid')
if (doSurvey && !uid && checkThisPage(window.location.pathname)) {
  uid = new Date().toISOString() + Math.round(1000 + (Math.random() * 1000))
  setCookie('uid', uid)
  window.location = getPreServiceSurveyUrl(uid)
}


// post service //
var getPostServiceSurveyUrl = function (psbo_url) {
  // { psbo, psbo_url, uid }
  var surveyUrl = 'https://paperstudio.typeform.com/to/z6cuin?'
  surveyUrl += 'uid=' + uid
  surveyUrl += '&psbo_url=' + encodeURI(psbo_url) 
  surveyUrl += '&psbo=' + document.getElementById('supplier').innerHTML
  return surveyUrl
}

// handler for psbo outbound links, track in GA and do post service survey
var getOutboundLink = function(e) {
  e.preventDefault()
  
  var psbo_url = e.target.href
  var url = (uid && doSurvey) ? getPostServiceSurveyUrl(psbo_url) : psbo_url
  clearCookie('uid')
  gtag('event', 'click', {
    'event_category': 'outbound',
    'event_label': psbo_url,
    'transport_type': 'beacon',
    'event_callback': function(){
      document.location = url
    }
  });
  return false;
}

// apply outbound link handler to appriopriately classes elements
var externalButtons = document.getElementsByClassName('frameworkbutton--external')
for (var i=0; i<externalButtons.length; i++) {
  externalButtons[i].onclick = getOutboundLink
}


// if the cookie warning has been seen hide the cookie message
var seenCookieMessage = getCookie('seen_cookie_message')
if (seenCookieMessage === 'yes') {
  document.getElementById('global-cookie-message').style.display = 'none'
}
setCookie('seen_cookie_message', 'yes')



// ############### //
// # collapsible # //
// ############### //
;(function () {
  var controls = document.getElementsByClassName('js-collection-controls')
  if (!controls.length) {
    return
  }
  var links = controls[0].getElementsByTagName('a')
  var controlAll = links[0]
  var controlNon = links[1]

  var collapsibles = document.getElementsByClassName('js-openable')

  var howManyCollapsible = function () {
    var collapsibles = document.getElementsByClassName('js-openable').length
    var closed = document.querySelectorAll('.js-openable.closed').length
    var open = collapsibles - closed
    return { total: collapsibles, closed: closed, open: open }
  }

  var updateControls = function () {
    var counts = howManyCollapsible()

    controlAll.classList.remove('disabled')
    controlNon.classList.remove('disabled')
    if (!counts.open) {
      controlNon.classList.add('disabled')
    }
    if (!counts.closed) {
      controlAll.classList.add('disabled')
    }
  }
 
  if (controls.length) {
    controlAll.onclick = function (e) {
      e.preventDefault()
      for (var i = 0; i < collapsibles.length; i++) {
        collapsibles[i].classList.remove('closed')
      }
      updateControls()
    }
    links[1].onclick = function (e) {
      e.preventDefault()
      for (var i = 0; i < collapsibles.length; i++) {
        collapsibles[i].classList.add('closed')
      }
      updateControls()
    }
  }

  var collapsibleFunc = function (coll) {
    var collapsibleTitle = coll.getElementsByClassName('js-subsection-title')[0]
    var link = collapsibleTitle.getElementsByTagName('a')[0]
    var body = coll.getElementsByClassName('js-subsection-body')[0]
    link.onclick = function (e) {
      e.preventDefault()
      coll.classList.toggle('closed')
      updateControls()
    }
    coll.classList.add('closed')
  }

  for (var i = 0; i < collapsibles.length; i++) { 
    collapsibleFunc(collapsibles[i])
  }
})()