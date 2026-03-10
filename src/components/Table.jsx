import React from 'react';

const Table = ({ columns, data, className = '' }) => {
    return (
        <div className={`overflow-x-auto rounded-2xl border border-slate-100 ${className}`}>
            <table className="w-full text-sm text-left text-slate-500">
                <thead className="text-xs text-slate-700 uppercase bg-slate-50/50 border-b border-slate-100">
                    <tr>
                        {columns.map((col, idx) => (
                            <th key={idx} className="px-6 py-4 font-semibold tracking-wider">
                                {col.header}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-slate-50">
                    {data.length > 0 ? (
                        data.map((row, rowIdx) => (
                            <tr key={rowIdx} className="hover:bg-slate-50/80 transition-colors">
                                {columns.map((col, colIdx) => (
                                    <td key={colIdx} className="px-6 py-4 whitespace-nowrap text-slate-700">
                                        {col.render ? col.render(row) : row[col.accessor]}
                                    </td>
                                ))}
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan={columns.length} className="px-6 py-10 text-center text-slate-400">
                                No data available
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default Table;
