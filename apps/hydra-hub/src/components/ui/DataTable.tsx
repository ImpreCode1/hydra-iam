interface Column<T> {
  header: string;
  render: (row: T) => React.ReactNode;
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  loading?: boolean;
  emptyMessage?: string;
  rowClassName?: string | ((row: T) => string);
}

export function DataTable<T>({
  data,
  columns,
  loading,
  emptyMessage = "Sin datos",
}: DataTableProps<T>) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead className="bg-slate-50 border-b border-slate-200">
          <tr className="text-left text-slate-700 font-semibold">
            {columns.map((col, i) => (
              <th key={i} className="px-4 py-3.5 whitespace-nowrap">
                {col.header}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {loading && (
            <tr>
              <td
                colSpan={columns.length}
                className="px-4 py-8 text-center text-slate-500"
              >
                <div className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5 text-slate-400" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                  </svg>
                  Cargando...
                </div>
              </td>
            </tr>
          )}

          {!loading && data.length === 0 && (
            <tr>
              <td
                colSpan={columns.length}
                className="px-4 py-8 text-center text-slate-500"
              >
                {emptyMessage}
              </td>
            </tr>
          )}

          {!loading &&
            data.map((row, idx) => (
              <tr
                key={idx}
                className="border-b border-slate-100 last:border-none 
                         hover:bg-slate-50/70 transition-colors duration-150"
              >
                {columns.map((col, i) => (
                  <td key={i} className="px-4 py-3.5 whitespace-nowrap text-slate-700">
                    {col.render(row)}
                  </td>
                ))}
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
}
