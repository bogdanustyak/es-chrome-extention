import { useEffect, useState } from 'react';
import { getCurrentTabUId, getCurrentTabUrl } from '../chrome/utils';
import { ListComponent } from '../components/ListComponent';
import { ToggleSwitch } from '../components/ToggleSwitch';
import { readFromStorage, saveToStorage } from '../storage';
import { ChromeMessage, Sender } from '../types';
import './Settings.css';

export interface Page {
  url: string;
  date: Date;
}

export interface UserSettings {
  pages: Page[];
}

const PageCell = ({
  page,
  onDelete,
}: {
  page: Page;
  onDelete: (page: Page) => void;
}) => {
  const { url } = page;
  return (
    <div className="card">
      <div className="url-item-header">
        <h3>{url}</h3>
      </div>
      <button onClick={() => onDelete(page)}>Delete</button>
    </div>
  );
};

export const Settings = () => {
  const [saveThisUrl, setSaveThisUrl] = useState(false);
  const [list, setList] = useState<Page[]>([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const data = await readFromStorage('userSettings');
    const pages = data.userSettings.pages ?? [];

    setList(pages);

    getCurrentTabUrl((url) => {
      const isUrlSaved = pages.find((page: Page) => page.url === url);
      setSaveThisUrl(isUrlSaved ? true : false);
    });
  };

  const clearAll = () => {
    updateSettings([]);
    setSaveThisUrl(false);
  };

  const add = async (url: string) => {
    const data = await readFromStorage('userSettings');
    const pages = data.userSettings.pages ?? [];

    await updateSettings([...pages, { url, date: new Date() }]);

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
    const pages: Page[] = data.userSettings.pages ?? [];

    updateSettings(pages.filter((page: Page) => page.url !== elem));
    setSaveThisUrl(false);
  };

  const updateSettings = async (pages: Page[]) => {
    setList(pages);

    await saveToStorage({
      userSettings: {
        pages,
      },
    });
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
        title={`Pages [${list.length}]:`}
        list={list}
        onClearAll={clearAll}
        cellRenderer={(elem) => (
          <PageCell page={elem} onDelete={(page) => remove(page.url)} />
        )}
      />
    </>
  );
};
