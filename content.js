chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.func !== 'copy') {
    return
  }
  const tempElement = document.createElement('div')
  tempElement.appendChild(
    window.getSelection().getRangeAt(0).cloneContents())

  const formData = new FormData()
  tempElement.querySelectorAll('img').forEach((item) => {
    fetch(item.getAttribute('src')).
      then(response => response.blob()).
      then(image => {
        formData.append('file', image)
        // Then create a local URL for that image and print it
        // URL.createObjectURL(images)
      })
  })

  fetch('http://127.0.0.1:6806/api/extension/copy', {
    method: 'POST',
    headers: {'Content-Type': 'multipart/form-data'},
    body: formData,
  }).then((response) => {
    return response.json()
  }).then((response) => {
    if (response.code < 0) {
      alert(response.msg)
    } else {
      alert('copy success')
    }
    console.log(response)
  }).catch((e) => {
    console.warn('fetch post error', e)
  })
})