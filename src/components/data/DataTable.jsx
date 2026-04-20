export const DataTable = ({ columns, rows }) => (
  <div className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-panel">
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-slate-200">
        <thead className="bg-slate-50">
          <tr>
            {columns.map((column) => (
              <th
                key={column.key}
                className="px-4 py-4 text-left text-xs font-bold uppercase tracking-[0.18em] text-slate-500"
              >
                {column.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 bg-white">
          {rows.map((row, index) => (
            <tr key={row.id || index} className="align-top">
              {columns.map((column) => (
                <td key={column.key} className="px-4 py-4 text-sm text-slate-700">
                  {column.render ? column.render(row) : row[column.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);
