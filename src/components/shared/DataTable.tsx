// @ts-nocheck

import React, { useState } from 'react';
import { useTable, useSortBy, useGroupBy, useExpanded } from 'react-table';
import { BsArrowDownShort, BsArrowUpShort } from 'react-icons/bs';
import { AiOutlineFileExcel } from "react-icons/ai";
import { excelHeaderGenerator, handleXLSXExport } from '../../helper/functions';

export const DataTable = ({ columns, data, ExpandableRowComponent, originalColumns, isExportable, search = true }: { columns: any[], data: any[], ExpandableRowComponent?: React.ComponentType<any> | any, isExportable?: boolean, search?: boolean }) => {

    const [filterInput, setFilterInput] = useState('');

    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        rows,
        prepareRow,
    } = useTable(
        {
            columns,
            data,
            initialState: { expanded: true },

        },
        useGroupBy,
        useSortBy,
        useExpanded
    );

    const filteredRows = rows.filter(row => {
        return row.cells.some(cell => {
            return String(cell.value).toLowerCase().includes(filterInput.toLowerCase());
        });
    });

    const handleFilterChange = (e) => {
        const value = e.target.value || '';
        setFilterInput(value);
    };


    return (
        <div className="table-container mt-2">
            <div className="mb-4 flex items-center justify-between">
                {
                    search && <>
                        <input
                            type="text"
                            value={filterInput}
                            onChange={handleFilterChange}
                            placeholder="جستجو..."
                            className="border border-black rounded my-2"
                        />
                    </>
                }
                {
                    isExportable && <div onClick={() => handleXLSXExport(excelHeaderGenerator(originalColumns), data, 'test')} className="w-8 h-8 flex items-center justify-center cursor-pointer">
                        <AiOutlineFileExcel className='text-xl' fill='green' />
                    </div>
                }
            </div>
            <table className="relative table w-full my-1 mt-2 text-center rounded-sm text-sm" {...getTableProps()}>
                <thead className="sticky top-0">
                    {headerGroups.map((headerGroup) => (
                        <tr {...headerGroup.getHeaderGroupProps()}>
                            {headerGroup.headers.map((column: any) => (
                                <th
                                    key={column.id}
                                    className="text-sm last:rounded-bl-xl last:rounded-tl-xl first:rounded-br-xl first:rounded-tr-xl font-normal py-2 bg-[#EEEEEE] z-50 "
                                    {...column.getHeaderProps(column.getSortByToggleProps({ title: undefined }))}
                                >
                                    <div className="flex items-center justify-center">
                                        {column.render('Header')}

                                        {column.isSorted ? (
                                            column.isSortedDesc ? (
                                                <BsArrowUpShort />
                                            ) : (
                                                <BsArrowDownShort />
                                            )
                                        ) : null}
                                    </div>
                                </th>
                            ))}
                        </tr>
                    ))}
                </thead>
                <tbody className="my-2 w-full" {...getTableBodyProps()}>
                    {filteredRows.map((row: any) => {
                        prepareRow(row);
                        return (
                            <React.Fragment key={row.id}>
                                <tr dir="ltr" className={`even:bg-gray-100 py-1`} {...row.getRowProps()}>
                                    {row.cells.map((cell: any) => (
                                        <td key={cell.column.id} className="text-center p-0 m-0  h-full" {...cell.getCellProps()}>
                                            <h6>{cell.render('Cell')}</h6>
                                        </td>
                                    ))}
                                </tr>
                                {row.isExpanded ? (
                                    <tr className='w-full m-4 noHover'>
                                        <td colSpan={6} className='p-5'>
                                            <ExpandableRowComponent row={row} />
                                        </td>
                                    </tr>
                                ) : null}
                            </React.Fragment>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
};

export default DataTable;
