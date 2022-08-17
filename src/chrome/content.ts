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

  if (isValidated && message.message === 'CLEAR_BODY_CONTENT') {
    chrome.storage.sync.clear();
  }

  if (isValidated && message.message === 'LOAD_BODY_CONTENT') {
    chrome.storage.sync.get('body', function (data) {
      response(data.body);
    });
  }
};

const main = () => {
  console.log('[content.ts] Main');
  /**
   * Fired when a message is sent from either an extension process or a content script.
   */
  chrome.runtime.onMessage.addListener(messagesFromReactAppListener);
};

main();
