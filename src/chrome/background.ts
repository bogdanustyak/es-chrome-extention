export {};

function subscribeToFormSubmits() {
  // const forms = document.forms;
  // for (let i = 0; i < forms.length; i++) {
  //   const form = forms[i];
  //   form.addEventListener('submit', function (event: any) {
  //     event.preventDefault();
  //     //const data = document.documentElement.outerHTML;
  //     chrome.storage.local.set({ body: form.innerHTML }, function () {
  //       console.log('saved');
  //     });
  //     // fetch(form.action, { method: 'post', body: new FormData(form) })
  //     //   .then((resp) => {
  //     //     return resp.json(); // or resp.text() or whatever the server sends
  //     //   })
  //     //   .then((body) => {
  //     //     // TODO handle body
  //     //   })
  //     //   .catch((error) => {
  //     //     // TODO handle error
  //     //   });
  //   });
  //}
}

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  console.log('[background.js] onUpdated', tabId, changeInfo, tab);
  const url = tab.url || '';
  const predefinedUrl = 'w3schools.com';
  if (url.includes(predefinedUrl)) {
    chrome.scripting.executeScript({
      target: { tabId: tabId },
      func: subscribeToFormSubmits,
    });
  }
});
