import React from 'react'
import { useTable, useSortBy } from "react-table";
import InfiniteScroll from "react-infinite-scroll-component";

type Props = {}

function Table({ columns, data, update , loader }) {
    // Use the state and functions returned from useTable to build your UI

    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        rows,
        prepareRow,
        state: { sortBy }
    } = useTable(
        {
            columns,
            data
        },
        useSortBy
    );

    React.useEffect(() => {
    }, [sortBy]);


    // Render the UI for your table
    return (
        <InfiniteScroll
            dataLength={rows.length}
            next={update}
            hasMore={true}
            loader={loader}
        >
            <div className='table-container mt-2'>
                <table className="relative table w-full my-1 text-center rounded-sm text-sm"  {...getTableProps()}>
                    <thead className="sticky top-0" >
                        {headerGroups.map(headerGroup => (
                            <tr className="sticky top-0" {...headerGroup.getHeaderGroupProps()}>
                                {headerGroup.headers.map(column => (
                                    <th
                                        className="text-sm last:rounded-bl-xl last:rounded-tl-xl first:rounded-br-xl first:rounded-tr-xl font-normal py-2 bg-[#EEEEEE] z-50 "

                                        {...column.getHeaderProps(column.getSortByToggleProps())}>
                                        <div className="flex items-center justify-center">
                                            {column.render("Header")}
                                            <span>
                                                {column.isSorted
                                                    ? column.isSortedDesc
                                                        ? " 🔽"
                                                        : " 🔼"
                                                    : ""}
                                            </span>
                                        </div>

                                    </th>
                                ))}
                            </tr>
                        ))}
                    </thead>

                    <tbody className="my-2 w-full"  {...getTableBodyProps()}>
                        {rows.map((row, i) => {
                            prepareRow(row);
                            return (
                                <tr dir="ltr" className={`even:bg-gray-100 py-1`} {...row.getRowProps()}>
                                    {row.cells.map(cell => {
                                        return (
                                            <td {...cell.getCellProps()}>{cell.render("Cell")}</td>
                                        );
                                    })}
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </InfiniteScroll>
    );
}

const InfinateDataTable = ({ columns, data, update, loader }) => {



    return (
        <Table columns={columns} data={data} update={update} loader={loader} />
    )
}

export default InfinateDataTable