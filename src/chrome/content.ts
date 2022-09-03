import { Snapshot } from '../pages/snapshots/Snapshots';
import { readFromStorage, saveToStorage } from '../storage';
import { ChromeMessage, Sender } from '../types';

type MessageResponse = (response?: any) => void;

const validateSender = (
  message: ChromeMessage,
  sender: chrome.runtime.MessageSender
) => {
  return sender.id === chrome.runtime.id && message.from === Sender.React;
};

const messagesFromReactAppListener = (
  message: ChromeMessage,
  sender: chrome.runtime.MessageSender,
  response: MessageResponse
) => {
  const isValidated = validateSender(message, sender);

  if (isValidated && message.message === 'CLEAR_CONTENT') {
    chrome.storage.local
      .clear()
      .then(() => {
        console.log('[content.ts] Cleared body content');
      })
      .catch((error) => {
        console.error('[content.ts] Error clearing body content', error);
      });
  }

  if (isValidated && message.message === 'LOAD_CONTENT') {
    chrome.storage.local.get('body', function (data) {
      const { body } = data;
      response(body);
    });
  }
};

const saveData = async (snapshot: Snapshot) => {
  const data = await readFromStorage('snapshots');
  const prev: [Snapshot] = data.snapshots ?? [];

  await saveToStorage({
    snapshots: [...prev, snapshot],
  });
};

const collectInputs = () => {
  var forms = document.getElementsByTagName('form');
  for (var i = 0; i < forms.length; i++) {
    forms[i].addEventListener('submit', function (e) {
      if (e.preventDefault) {
        e.preventDefault();
      }

      var data = [],
        subforms = document.getElementsByTagName('form');

      for (let x = 0; x < subforms.length; x++) {
        var elements = subforms[x].elements;
        for (let e = 0; e < elements.length; e++) {
          // @ts-ignore
          if (elements[e].name.length) {
            // @ts-ignore
            data.push(elements[e].name + '=' + elements[e].value);
          }
        }
      }

      const snapshot = {
        page: document.URL,
        date: new Date().toUTCString(),
        body: data.join('&'),
      };
      saveData(snapshot);

      // TODO make an api call etc
      setTimeout(() => {
        // @ts-ignore
        e.target.submit();
      }, 1000);
    });
  }
};

const subscribeToFormInputs = () => {
  chrome.storage.local.get('userSettings', function (data) {
    const { urls } = data.userSettings;

    const shouldSubscribe = true;
    // urls &&
    // urls.filter((elem: string) => elem.includes(document.location.hostname));

    if (shouldSubscribe) {
      collectInputs();
    }
  });
};

const main = () => {
  console.log('[content.ts] Main');
  /**
   * Fired when a message is sent from either an extension process or a content script.
   */
  chrome.runtime.onMessage.addListener(messagesFromReactAppListener);

  subscribeToFormInputs();
};

main();
