import React from 'react'
import { generateColumnsArray } from '../../../helper/functions'
import DataTable from '../../../components/shared/DataTable'
import { ScrollArea } from "@/components/ui/scroll-area"
import { FaEye } from "react-icons/fa6";
import { Link } from 'react-router-dom'
const PositionsRiskFilter = ({ id, data }) => {
    const filterIndexes = data.members_data[id]

    const filterdData = data.positions.data.filter((el) => {
        return filterIndexes.includes(el.position_id)
    })

    const renderTicker = (value: any, tseCode: string) => {
        return <div className="w-7/12 mx-auto flex items-center gap-1 justify-between text-center" dir="rtl">
            <a target="_blank" href={`http://www.tsetmc.com/instInfo/${tseCode}`} className="w-10 cursor-pointer">
                <img src="/tse.png" className="w-6 h-6" alt="" />
            </a>
            <span className="w-full text-right ">
                {value}
            </span>
        </div>
    }


    const columns = generateColumnsArray(data.positions.meta_data.column_names, [
        {
            accessorKey: "detail",
            Header: 'جزییات',
            Cell: (row) => {
                return <div className='cursor-pointer w-full text-center text-blue-700 flex items-center justify-center'>
                    <Link target='_blank' to={`/postions/${row.row.original.position_id}`}>
                        <FaEye />
                    </Link>
                </div>
            }
        },
        {
            header: 'نماد',
            accessorKey: 'ticker',
            Cell: (row: any) => {
                const val = row.value
                return renderTicker(val, row.row.original.tse_code)
            },

        },
    ])


    return (
        <div>
            <ScrollArea dir='rtl' className="h-[400px] w-full ">

                <DataTable columns={columns} data={filterdData} />
            </ScrollArea>

        </div>
    )
}

export default PositionsRiskFilter