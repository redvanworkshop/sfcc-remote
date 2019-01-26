import browser from 'webextension-polyfill'

/**
 * Remote is Enabled
 */
let remote = true

/**
 * Take user to Welcome Page when installing this Extension for Support Info
 */
browser.runtime.onInstalled.addListener((request) => {
  if (request.reason === 'install') {
    browser.tabs.create({
      url: 'https://github.com/redvanworkshop/sfcc-remote#installation'
    })
  }
})

/**
 * [remote description]
 * @type {[type]}
 */
browser.browserAction.onClicked.addListener(() => {
  remote = !remote

  browser.storage.local.set({ 'sfcc-remote-enabled': remote }).then(() => {
    browser.runtime.sendMessage({ type: 'sfcc-remote-toggle', enabled: remote })

    browser.browserAction.setTitle({
      title: remote
        ? 'SFCC Remote is On'
        : 'SFCC Remote is Off'
    })

    browser.browserAction.setIcon({
      path: remote
        ? '../icons/128.png'
        : '../icons/128-off.png'
    })
  })
})

// Listen for Chrome Events & Pass to Vue
browser.runtime.onMessage.addListener(async request => {
  if (request.type === 'sfcc-remote') {
    remote = request.enabled

    browser.storage.local.set({ 'sfcc-remote-enabled': remote }).then(() => {
      browser.browserAction.setTitle({
        title: remote
          ? 'SFCC Remote is On'
          : 'SFCC Remote is Off'
      })

      browser.browserAction.setIcon({
        path: remote
          ? '../icons/128.png'
          : '../icons/128-off.png'
      })
    })
  }
})

/**
 * Check if a tab we are using the extension on is about to navigate
 */
browser.webNavigation.onBeforeNavigate.addListener((request) => {
  if (remote) {
    browser.runtime.sendMessage({ type: 'sfcc-remote-web-nav-start', request: request })
  }
})

/**
 * Check if a tab we are using the extension on has completed its navigation
 */
browser.webNavigation.onCompleted.addListener((request) => {
  if (remote) {
    browser.runtime.sendMessage({ type: 'sfcc-remote-web-nav-complete', request: request })
  }
})
