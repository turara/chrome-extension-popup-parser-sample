;(() => {
  function parse() {
    // Get text from "From today's featured article"
    return document.querySelector('#mp-tfa p').textContent
  }

  try {
    return parse()
  } catch (e) {
    console.log(e)
    return null
  }
})()
