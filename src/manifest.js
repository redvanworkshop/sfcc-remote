module.exports = {
  name: 'SFCC Remote for SFCC CLI Tool',
  version: '1.0.0',
  description: 'SFCC Remote for SFCC CLI Tool',
  author: 'Peter Schmalfeldt',
  manifest_version: 2,
  icons: {
    '16': 'icons/16.png',
    '48': 'icons/48.png',
    '128': 'icons/128.png'
  },
  permissions: [
    'http://*/*',
    'https://*/*',
    'storage',
    'tabs',
    'webNavigation',
    'webRequest',
    'webRequestBlocking'
  ],
  browser_action: {
    default_icon: 'icons/128.png',
    default_title: 'SFCC Remote'
  },
  background: {
    page: 'pages/background.html'
  },
  devtools_page: 'pages/devtools.html',
  options_ui: {
    'page': 'pages/options.html',
    'open_in_tab': true
  },
  content_scripts: [
    {
      js: [
        'js/inject.js'
      ],
      run_at: 'document_start',
      matches: [
        'http://*/*',
        'https://*/*'
      ],
      all_frames: true
    }
  ],
  content_security_policy: "script-src 'self' 'unsafe-eval' https://localhost:8443; object-src 'self'",
  web_accessible_resources: [
    'panel.html',
    'js/content.js',
    'js/vendor.js',
    'js/manifest.js',
    'js/browser-polyfill.js',
    'https://localhost:8443/socket.io/socket.io.js'
  ]
}
