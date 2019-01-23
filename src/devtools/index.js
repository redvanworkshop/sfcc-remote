import browser from 'webextension-polyfill'

const panelIcon = (browser.devtools.panels.themeName === 'dark') ? '/icons/panel-dark.png' : '/icons/panel-light.png'

browser.devtools.panels.create('SFCC', panelIcon, '/pages/panel.html').then(panel => {
  let panelWindow = null
  let queuedMessages = []
  let port = browser.runtime.connect({
    name: 'sfcc-remote-' + browser.devtools.inspectedWindow.tabId
  })

  port.onMessage.addListener((msg) => {
    if (panelWindow) {
      browser.runtime.sendMessage({ type: 'sfcc-remote-panel-message', message: msg })
    } else {
      queuedMessages.push(msg)
    }
  })

  let listener = (win) => {
    panel.onShown.removeListener(listener)
    panelWindow = win

    let msg
    while ((msg = queuedMessages.shift())) {
      browser.runtime.sendMessage({ type: 'sfcc-remote-panel-message', message: msg })
    }
  }

  panel.onShown.addListener(listener)
})
