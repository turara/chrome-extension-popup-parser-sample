const URL = {
  wikipedia: 'https://en.wikipedia.org/wiki/Main_Page',
}

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

function setContent(text) {
  document.querySelector('#content').textContent = text
}

function copyResult() {
  document.querySelector('#content').select()
  document.execCommand('copy')
}

function toggleError(display) {
  const errorElement = document.querySelector('#error')
  if (display) {
    errorElement.classList.remove('hidden')
  } else {
    errorElement.classList.add('hidden')
  }
}

document.querySelector('#wikipedia').addEventListener('click', async (e) => {
  e.preventDefault()
  toggleError(false)
  try {
    const tabId = await loadNewTab(URL.wikipedia)
    const text = await parseWikipedia(tabId)
    setContent(text)
  } catch (e) {
    console.log(e)
    toggleError(true)
  }
})

document.querySelector('#copy').addEventListener('click', (e) => {
  e.preventDefault()
  copyResult()
})
