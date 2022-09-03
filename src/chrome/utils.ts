export const getCurrentTabUrl = (
  callback: (url: string | undefined) => void
): void => {
  const queryInfo = { active: true, lastFocusedWindow: true };

  chrome.tabs &&
    chrome.tabs.query(queryInfo, (tabs) => {
      callback(tabs[0].url);
    });
};

export const getCurrentTabUrlAsync = async (): Promise<string> => {
  const queryInfo = { active: true, lastFocusedWindow: true };

  return await new Promise((resolve, reject) => {
    chrome.tabs &&
      chrome.tabs.query(queryInfo, (tabs) => {
        const url = tabs[0].url;
        if (url) {
          resolve(url);
        }
        reject(Error('Could not get current tab url'));
      });
  });
};

export const getCurrentTabUId = (
  callback: (url: number | undefined) => void
): void => {
  const queryInfo = { active: true, lastFocusedWindow: true };

  chrome.tabs &&
    chrome.tabs.query(queryInfo, (tabs) => {
      callback(tabs[0].id);
    });
};
