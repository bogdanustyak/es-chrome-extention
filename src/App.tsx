import { useState } from 'react';
import { ChromeMessage, Sender } from './types';
import './App.css';
import { getCurrentTabUId } from './chrome/utils';
import { AuthForm } from './AuthForm';

export const App = () => {
  const [responseFromContent, setResponseFromContent] = useState<string>('');

  const sendMessageToLoadBodyContent = () => {
    const message: ChromeMessage = {
      from: Sender.React,
      message: 'LOAD_BODY_CONTENT',
    };
    console.log('sendMessageToContent');
    getCurrentTabUId((id) => {
      id &&
        chrome.tabs.sendMessage(id, message, (response) => {
          setResponseFromContent(response);
        });
    });
  };

  const sendMessageToClearBodyContent = () => {
    const message: ChromeMessage = {
      from: Sender.React,
      message: 'CLEAR_BODY_CONTENT',
    };
    console.log('sendMessageToContent');
    getCurrentTabUId((id) => {
      id &&
        chrome.tabs.sendMessage(id, message, (response) => {
          setResponseFromContent(response);
        });
    });
  };

  return (
    <div className="App">
      <header className="App-header">
        <div>
          <button onClick={sendMessageToLoadBodyContent}>
            Load body content
          </button>
          <button onClick={sendMessageToClearBodyContent}>
            Clear body content
          </button>
        </div>
      </header>
      <div className="App-body">
        <AuthForm />
      </div>
      <div>{responseFromContent}</div>
    </div>
  );
};
