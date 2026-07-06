type Column = {
  key: string;
  label: string;
};

type DataTableProps = {
  columns: Column[];
  rows: Array<Record<string, string | number | React.ReactNode>>;
};

export function DataTable({ columns, rows }: DataTableProps) {
  return (
    <div className="ui-card">
      <div className="ui-card__body">
        <table className="ui-table">
          <thead>
            <tr>
              {columns.map((column) => (
                <th key={column.key}>{column.label}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, index) => (
              <tr key={`${row[columns[0]?.key] ?? index}`}>
                {columns.map((column) => (
                  <td key={`${column.key}-${index}`}>{row[column.key]}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
