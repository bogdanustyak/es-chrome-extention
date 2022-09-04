import { useEffect, useState } from 'react';
import { getCurrentTabUId, getCurrentTabUrl } from '../chrome/utils';
import { ListComponent } from '../components/ListComponent';
import { ToggleSwitch } from '../components/ToggleSwitch';
import { readFromStorage, saveToStorage } from '../storage';
import { ChromeMessage, Sender } from '../types';
import './Settings.css';

export interface Site {
  url: string;
  date: Date;
}

export interface UserSettings {
  urls: string[];
}

const UrlCell = ({
  url,
  onDelete,
}: {
  url: string;
  onDelete: (url: string) => void;
}) => {
  return (
    <div className="card">
      <div className="url-item-header">
        <h3>{url}</h3>
      </div>
      <button onClick={() => onDelete(url)}>Delete</button>
    </div>
  );
};

export const Settings = () => {
  const [saveThisUrl, setSaveThisUrl] = useState(false);
  const [list, setList] = useState<string[]>([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const data = await readFromStorage('userSettings');
    const { urls } = data.userSettings;

    setList(urls ? urls : []);
    getCurrentTabUrl((url) => {
      setSaveThisUrl(urls.includes(url));
    });
  };

  const clearAll = () => {
    updateSettings([]);
  };

  const add = async (url: string) => {
    const data = await readFromStorage('userSettings');
    const { urls } = data.userSettings ?? [];
    const unique = Array.from(new Set([...urls, url]));

    await updateSettings(unique);

    getCurrentTabUId((tabId) => {
      const message: ChromeMessage = {
        from: Sender.React,
        message: 'SUBSCRIBE_TO_URL',
      };

      tabId && chrome.tabs.sendMessage(tabId, message);
    });
  };

  const remove = async (elem: string) => {
    const data = await readFromStorage('userSettings');
    const urls: string[] = data.userSettings.urls ?? [];

    updateSettings(urls.filter((it) => it !== elem));
    setSaveThisUrl(false);
  };

  const updateSettings = async (urls: string[]) => {
    await saveToStorage({
      userSettings: {
        urls: urls,
      },
    });

    setList(urls);
  };

  const UrlsForm = () => {
    const [url, setUrl] = useState<string>('');

    const handleSubmit = async (event: any) => {
      event.preventDefault();

      add(url);
    };

    const onUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setUrl(e.target.value);
    };

    return (
      <>
        <h3>Add custom URL:</h3>
        <form className="form-block" onSubmit={handleSubmit}>
          <input type="text" name="name" value={url} onChange={onUrlChange} />
          <input className="submit-url-button" type="submit" value="Add url" />
        </form>
      </>
    );
  };

  const QuickSettings = () => (
    <div className="card">
      <h1>Quick settings</h1>
      <ToggleSwitch
        name="Save forms on this page"
        checked={saveThisUrl}
        onChange={function (checked: boolean): void {
          setSaveThisUrl(checked);

          getCurrentTabUrl((url) => {
            url && (checked ? add(url) : remove(url));
          });
        }}
      />
      <UrlsForm />
    </div>
  );

  return (
    <>
      <QuickSettings />
      <ListComponent
        title={`Urls [${list.length}]:`}
        list={list}
        onClearAll={clearAll}
        cellRenderer={(elem) => <UrlCell url={elem} onDelete={remove} />}
      />
    </>
  );
};
