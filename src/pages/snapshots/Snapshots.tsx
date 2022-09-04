import { useEffect, useState } from 'react';
import { ListComponent } from '../../components/ListComponent';
import { readFromStorage, saveToStorage } from '../../storage';
import './Snapshots.css';

export type Snapshot = {
  page: string;
  date: string;
  body: string;
};

const SnapshotCell = ({
  snapshot,
  onDelete,
}: {
  snapshot: Snapshot;
  onDelete: (snapshot: Snapshot) => void;
}) => {
  const { page, date, body } = snapshot;
  return (
    <div className="card">
      <div className="snapshot-item_header">
        <h3>{page}</h3>
        <span>{date}</span>
      </div>
      <div className="snapshot-item_body">
        <span>{body}</span>
      </div>
      <button onClick={() => onDelete(snapshot)}>Delete</button>
    </div>
  );
};

export interface FormSnapshots {
  snapshots: Snapshot[];
}

export const Snapshots = () => {
  const [list, setList] = useState<Snapshot[]>([]);

  useEffect(() => {
    loadBodyContent();
  }, []);

  const loadBodyContent = async () => {
    const data = await readFromStorage('snapshots');
    const snapshots = data.snapshots ?? [];

    setList(snapshots);
  };

  const clearAll = async () => {
    await saveToStorage({ snapshots: [] });
    setList([]);
  };

  const deleteSnapshot = async (snapshot: Snapshot) => {
    const data = await readFromStorage('snapshots');
    const snapshots = data.snapshots ?? [];
    const newSnapshots = snapshots.filter(
      (item: Snapshot) =>
        item.date !== snapshot.date && item.body !== snapshot.body
    );
    await saveToStorage({ snapshots: newSnapshots });
    setList(newSnapshots);
  };

  return (
    <ListComponent
      title={`Snapshots [${list.length}]:`}
      list={list}
      onClearAll={clearAll}
      cellRenderer={(elem) => (
        <SnapshotCell snapshot={elem} onDelete={deleteSnapshot} />
      )}
    />
  );
};
