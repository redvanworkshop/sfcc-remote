#  ![icon](./static/icons/48.png) SFCC Remote

> Chrome, Firefox & Opera Browser Extension

## Installation

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


Developers
---

<details><summary>Build Extension</summary>
<p>
```bash
git clone git@github.com:manifestinteractive/sfcc-remote.git
cd sfcc-remote
npm install
npm run build
```
</p>
</details>

<details><summary>Load Unpacked Extension to Google Chrome</summary>
<p>
1. Open Google Chrome
2. Go to the following URL in a new tab:  `chrome://extensions/`
3. In the top right corner, Enable **Developer Mode**
4. Click the **LOAD UNPACKED** link in the header
5. Select the `./sfcc-remote/build` folder
</p>
</details>

<details><summary>Load Temporary Add-on to Firefox</summary>
<p>
1. Open Terminal in project root and run `npm run pack:firefox`
2. Open Firefox
3. Go to the following URL in a new tab:  `about:debugging`
4. Select `Enable add-on debugging` checkbox
5. In the top right corner, Click **Load Temporary Add-on**
6. Select the `firefox.zip` file
</p>
</details>

<details><summary>Load Unpacked Extension to Opera</summary>
<p>
1. Open Google Chrome
2. Go to the following URL in a new tab:  `chrome://extensions/`
3. In the top right corner, Enable **Developer Mode**
4. Click the **Load Unpacked Extension ...**
5. Select the `./sfcc-remote/build` folder
</p>
</details>
