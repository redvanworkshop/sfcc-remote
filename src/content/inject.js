import browser from 'webextension-polyfill'

var manifest = browser.extension.getURL('js/manifest.js')
var vendor = browser.extension.getURL('js/vendor.js')
var content = browser.extension.getURL('js/content.js')

window.onload = function () {
  var manifestScript = document.createElement('script')
  var vendorScript = document.createElement('script')
  var contentScript = document.createElement('script')

  manifestScript.setAttribute('type', 'text/javascript')
  manifestScript.setAttribute('src', manifest)

  vendorScript.setAttribute('type', 'text/javascript')
  vendorScript.setAttribute('src', vendor)

  contentScript.setAttribute('type', 'text/javascript')
  contentScript.setAttribute('src', content)

  document.body.appendChild(manifestScript)
  document.body.appendChild(vendorScript)
  document.body.appendChild(contentScript)
}
