import browser from 'webextension-polyfill'

var content = browser.extension.getURL('js/content.js')

window.onload = function () {
  var script = document.createElement('script')

  script.setAttribute('type', 'text/javascript')
  script.setAttribute('src', content)

  document.body.appendChild(script)
}
