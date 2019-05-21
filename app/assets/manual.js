// ############### //
// # collapsible # //
// ############### //
(function () {
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