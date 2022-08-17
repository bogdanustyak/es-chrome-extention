export {};

function subscribeToFormSubmits() {
  function handleSubmit() {
    const { body } = document;

    chrome.storage.sync.set({ body: JSON.stringify(body) }, function () {
      console.log('saved');
    });
  }

  var form = document.querySelector('form');
  form?.addEventListener('submit', handleSubmit, false);
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
