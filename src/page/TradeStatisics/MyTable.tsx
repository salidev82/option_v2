import React, { Fragment } from 'react';
import {
    ColumnDef,
    flexRender,
    getCoreRowModel,
    getSortedRowModel,
    getExpandedRowModel,
    SortingState,
    useReactTable,
} from '@tanstack/react-table'

import { convertToGreaterUnit } from '../../helper/functions';

type TableProps<TData> = {
    data: TData[];
    columns: any[];
    renderSubComponent: (props: { row: any }) => React.ReactElement;
    getRowCanExpand: (row: any) => boolean

};

function MyTable<TData>({
    data,
    columns,
    renderSubComponent,
    getRowCanExpand
}: TableProps<TData>): JSX.Element {

    const table = useReactTable({
        data,
        columns,
        getRowCanExpand,
        // state: {
        //     sorting,
        // },
        // onSortingChange: setSorting,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getExpandedRowModel: getExpandedRowModel(),
        debugTable: true,
    })



    return (
        <div className="p-2">
            <div className="h-2" />
            <table className='w-full text-center'>
                <thead>
                    {table.getHeaderGroups().map(headerGroup => (
                        <tr key={headerGroup.id}>
                            {headerGroup.headers.map(header => {
                                return (
                                    <th key={header.id} colSpan={header.colSpan}>
                                        {header.isPlaceholder ? null : (
                                            <div>
                                                {flexRender(
                                                    header.column.columnDef.header,
                                                    header.getContext()
                                                )}
                                            </div>
                                        )}
                                    </th>
                                )
                            })}
                        </tr>
                    ))}
                </thead>
                <tbody>
                    {table.getRowModel().rows.map(row => {
                        return (
                            <Fragment key={row.id}>
                                <tr>
                                    {/* first row is a normal row */}
                                    {row.getVisibleCells().map(cell => {
                                        return (
                                            <td dir='ltr' key={cell.id}>
                                                {!isNaN(cell.getValue()) ? convertToGreaterUnit(cell.getValue()) : flexRender(
                                                    cell.column.columnDef.cell,
                                                    cell.getContext())}
                                            </td>
                                        )
                                    })}
                                </tr>
                                {row.getIsExpanded() && (
                                    <tr>
                                        {/* 2nd row is a custom 1 cell row */}
                                        <td colSpan={row.getVisibleCells().length}>
                                            {renderSubComponent({ row })}
                                        </td>
                                    </tr>
                                )}
                            </Fragment>
                        )
                    })}
                </tbody>
            </table>

        </div>
    );
}

export default MyTable;
