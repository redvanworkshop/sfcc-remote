#  ![icon](./static/icons/48.png) SFCC Remote

> Chrome, Firefox & Opera Browser Extension

Installation
---

This browser extension works in conjunction with our [SFCC CLI Tool](https://github.com/redvanworkshop/sfcc-cli).

The quickest way to setup the CLI Tool would be to run:

```bash
npm install -g sfcc-cli --no-optional
sfcc setup
sfcc remote
```

Then, you can run whatever you need in a new terminal tab, and it will be sent to browser extension:

#### Watch for Code Changes

```bash
sfcc watch
```

#### View Log Events

```bash
sfcc log -i customerror,error,warn -l 500 --latest
```


SSL Certificates
---

**IMPORTANT:** After running `sfcc remote`, check that you can access the following URL in your browser:

```
https://localhost:8443/socket.io/socket.io.js
```

`localhost` certificates are kind of flakey, and you might see something like this, which is normal. Just click through that first time to `Always Trust` the certificate to avoid future headaches.

![Error](https://github.com/redvanworkshop/sfcc-cli/raw/master/docs/img/ssl-error.png "Error")
![Error](https://github.com/redvanworkshop/sfcc-cli/raw/master/docs/img/ssl-error-accept.png "Error")

Once you've confirmed you can access the `socket.io.js` file in your browser, you are good to go.


Developers
---

<details><summary>Build Extension</summary>

```bash
git clone git@github.com:manifestinteractive/sfcc-remote.git
cd sfcc-remote
npm install
npm run build
npm run pack
```

</details>

<details><summary>Load Unpacked Extension to Google Chrome</summary>

1. Open Google Chrome
2. Go to the following URL in a new tab:  `chrome://extensions/`
3. In the top right corner, Enable **Developer Mode**
4. Click the **LOAD UNPACKED** link in the header
5. Select the `./sfcc-remote/build` folder

</details>

<details><summary>Load Temporary Add-on to Firefox</summary>

1. Open Terminal in project root and run `npm run pack:firefox`
2. Open Firefox
3. Go to the following URL in a new tab:  `about:debugging`
4. Select `Enable add-on debugging` checkbox
5. In the top right corner, Click **Load Temporary Add-on**
6. Select the `firefox.zip` file

</details>

<details><summary>Load Unpacked Extension to Opera</summary>

1. Open Google Chrome
2. Go to the following URL in a new tab:  `chrome://extensions/`
3. In the top right corner, Enable **Developer Mode**
4. Click the **Load Unpacked Extension ...**
5. Select the `./sfcc-remote/build` folder

</details>

<details><summary>Pack Extensions</summary>

```bash
cd sfcc-remote
npm run pack
```

</details>
