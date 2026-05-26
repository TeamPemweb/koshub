import React from "react";

export function ReusableTable({ columns, data }) {
  return (
    <div className="w-full overflow-x-auto rounded-md border border-gray-200 bg-white">
      <table className="w-full text-sm text-left border-collapse">
        <thead>
          <tr className="border-b border-gray-200 bg-white">
            {columns.map((col, index) => (
              <th 
                key={index} 
                className="px-4 py-3 font-bold text-gray-800 whitespace-nowrap"
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.length > 0 ? (
            data.map((row, rowIndex) => (
              <tr key={rowIndex} className="border-b border-gray-200 hover:bg-gray-50/50">
                {columns.map((col, colIndex) => (
                  <td key={colIndex} className="px-4 py-3 text-gray-600">
                    {col.render ? col.render(row) : row[col.accessorKey]}
                  </td>
                ))}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={columns.length} className="h-24 text-center text-gray-500">
                Tidak ada data.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}