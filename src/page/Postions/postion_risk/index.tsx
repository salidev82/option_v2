import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { generateColumnsArray } from '../../../helper/functions'
import DataTable from '../../../components/shared/DataTable'
import { FaEye } from "react-icons/fa6";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import PositionsRiskFilter from './PositionsRiskFilter';

const PostionRisk = () => {

    const [data, setData] = useState(null)

    useEffect(() => {
        async function getData() {
            let response = await axios.get(`position/reports/risk_levels`)
            setData(response.data)
        }
        getData()
    }, [])


    const positionColumns = data && generateColumnsArray(data?.meta_data?.column_names, [
        {
            accessorKey: "detail",
            Header: 'جزییات',
            Cell: (row) => {
                const key = row.row.original.risk_level_en
                return <div className='cursor-pointer w-full text-center text-blue-700 flex items-center justify-center'>
                    <Dialog>
                        <DialogTrigger>
                            <FaEye />
                        </DialogTrigger>
                        <DialogContent className='max-w-7xl'>
                            <PositionsRiskFilter id={key} data={data} />
                        </DialogContent>
                    </Dialog>
                </div>
            }
        }
    ])

    return (
        <div className='my-8'>
            <span>
                گروه‌بندی موقعیت‌ها بر اساس سطح ریسک
            </span>
            {
                data && <DataTable search={false} columns={positionColumns} data={data?.data} />
            }
        </div>
    )
}

export default PostionRisk