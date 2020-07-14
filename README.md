# chrome-extension-popup-parser-sample
Chrome extension sample for parsing web pages from popup

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
