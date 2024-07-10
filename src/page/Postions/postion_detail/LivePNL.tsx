import axios from 'axios'
import React from 'react'
import { useQuery } from 'react-query'
import { useParams } from 'react-router-dom'
import { generateColumnsArray } from '../../../helper/functions'
import { DataTable } from "@/components/shared/DataTable";
import { Button } from '@/components/ui/button'

type Props = {
    row: any
}

const LivePNL = (props: Props) => {

    const { id } = useParams()

    const getData = async () => {
        const response = await axios.get(`/position/present_return/${id}`)
        return response.data
    };

    const { data, isError, refetch } = useQuery("live_pnl" + id, getData)

    const columns = data && generateColumnsArray(data?.metadata?.column_names, null, data?.metadata.column_annotate)


    const sumPnl = data &&
        data?.data?.reduce((accumulator, currentValue) => {
            return accumulator + currentValue.pnl;
        }, 0)


    const sumEntry_net_value = data && data?.data?.reduce((accumulator, currentValue) => {
        return accumulator + currentValue.entry_value;
    }, 0);


    const difrence = (sumPnl / Math.abs(sumEntry_net_value)) * 100


    return (
        <div>
            {data?.data && <>
                <div className="w-full bg-blue-200 p-2 mt-4 rounded-t-sm flex items-center justify-between">
                    <span className='text-sm'>
                        بازدهی فعلی
                    </span>
                    <button onClick={() => refetch()} className='px-8 py-2 rounded-md text-xs bg-blue-900 text-white'>
                        بروزرسانی
                    </button>
                </div>
                <div className="postions__table">
                    {
                        data && <DataTable search={false} columns={columns} data={data?.data} />
                    }
                </div>

                <div className="bg-blue-50 border-2 border-blue-200 mt-8 text-sm p-2 rounded-md">
                    با بستن این موقعیت در این لحظه {Math.abs(sumPnl)?.toLocaleString('en-US')} ریال {
                        sumPnl > 0 ? <b>سود</b> : <b>زیان</b>
                    }  شناسایی می‌شود

                    <span dir='ltr'> ( <span dir='ltr'>%{difrence.toFixed(2)}</span> بازدهی).</span>

                </div></>}
        </div>
    )
}

export default LivePNL