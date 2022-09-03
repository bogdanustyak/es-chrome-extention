export async function readFromStorage(key: string): Promise<any> {
  return await new Promise((resolve, reject) => {
    chrome.storage.local.get(key, function (data) {
      resolve(data);
    });
  });
}

export async function saveToStorage(items: {
  [key: string]: any;
}): Promise<void> {
  return await new Promise((resolve, reject) => {
    chrome.storage.local.set(items, function () {
      resolve();
    });
  });
}
