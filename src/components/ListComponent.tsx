export const ListComponent = ({
  title,
  list,
  onClearAll,
  cellRenderer,
}: {
  title: string;
  list: any[];
  onClearAll?: () => void;
  cellRenderer: (item: any) => JSX.Element;
}) => {
  return (
    <>
      <h1>{title}</h1>
      <button onClick={onClearAll}>Clear all</button>
      <div className="list-block">
        {list.map((elem) => {
          return cellRenderer(elem);
        })}
      </div>
    </>
  );
};
