# chrome-extension-popup-parser-sample
Chrome extension sample for parsing web pages from popup

![Sample image](https://user-images.githubusercontent.com/10044588/87617505-989ea180-c752-11ea-9bf8-a361a0e95f54.gif)

## Sample project for ...

1. Open new tab in the background from the popup
2. Get some of document content from the tab
3. Display the content on the popup

## Points

### manifest.json

```jsonc
  // Show popup when tool bar icon is clicked
  "browser_action": {
    "default_icon": "icon128.png",
    "default_popup": "popup/popup.html"
  },
  "permissions": [
    // Allow access to chrome.tabs apis
    "tabs",
    // Allow access to content of specific url or host
    "https://en.wikipedia.org/wiki/Main_Page"
  ]
```
### popup.js

```javascript
// Load new tab on the background
async function loadNewTab(url, timeoutSeconds = 5) {
  return new Promise((resolve, reject) => {
    let targetTabId = null

    const listener = (tabId, changedProps) => {
      if (tabId != targetTabId || changedProps.status != 'complete') {
        return
      }
      chrome.tabs.onUpdated.removeListener(listener)
      resolve(tabId)
    }
    chrome.tabs.onUpdated.addListener(listener)

    chrome.tabs.create({ url, active: false }, (tab) => {
      targetTabId = tab.id
    })

    setTimeout(() => {
      reject(new Error('Timeout...'))
    }, timeoutSeconds * 1000)
  })
}

// Recieve the result of script on the background tab
async function parseWikipedia(tabId) {
  return new Promise((resolve, reject) => {
    chrome.tabs.executeScript(
      tabId,
      { file: 'parser/parseWikipedia.js' },
      (results) => {
        if (results[0] === null) {
          reject(new Error('Failed to parse wikipedia.'))
        } else {
          resolve(results[0])
        }
      }
    )
  })
}
```
