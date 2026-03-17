interface Column<T> {
  header: string;
  render: (row: T) => React.ReactNode;
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  loading?: boolean;
  emptyMessage?: string;
}

export function DataTable<T>({
  data,
  columns,
  loading,
  emptyMessage = "Sin datos",
}: DataTableProps<T>) {
  return (
    <div className="overflow-hidden bg-white border border-gray-200 rounded-xl shadow-sm">
      <table className="w-full text-sm">
        <thead className="bg-gray-50 border-b">
          <tr className="text-left text-gray-700 font-medium">
            {columns.map((col, i) => (
              <th key={i} className="p-4">
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
                className="p-6 text-center text-gray-500"
              >
                Cargando...
              </td>
            </tr>
          )}

          {!loading && data.length === 0 && (
            <tr>
              <td
                colSpan={columns.length}
                className="p-6 text-center text-gray-500"
              >
                {emptyMessage}
              </td>
            </tr>
          )}

          {!loading &&
            data.map((row, idx) => (
              <tr
                key={idx}
                className="border-b last:border-none hover:bg-gray-50 transition"
              >
                {columns.map((col, i) => (
                  <td key={i} className="p-4">
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
