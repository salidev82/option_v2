import React, { useEffect, useState } from 'react'
import ConversionForm from './ConversionFilter'
import axios from 'axios'
import { useSelector } from 'react-redux'
import { generateColumnsArray } from '../../helper/functions'
import DataTable from '../../components/shared/DataTable'
import { useQuery } from 'react-query'

type Props = {}

const Conversion = (props: Props) => {


    async function getData() {
        let response = await axios.get(`options_strategies/conversion`, { params: getParams })
        return response.data
    }

    const getParams = useSelector((state: any) => state.conversionFilterSlice)
    const isAutoUpdate = useSelector((state: any) => state.config.isAutoUpdate);

    const { data, isFetching, isError , refetch }: { data: any, isFetching: boolean, isError: boolean, refetch: any } = useQuery('bull_call', getData)


    useEffect(() => {
        let intervalId: any;

        const startAutoUpdate = () => {
            intervalId = setInterval(() => { refetch() }, 30000);
        };

        const stopAutoUpdate = () => {
            clearInterval(intervalId);
        };

        if (isAutoUpdate) {
            refetch()
            startAutoUpdate();
        } else {
            stopAutoUpdate();
        }

        return () => {
            stopAutoUpdate(); // Clear the interval when the component unmounts or when isAutoUpdate changes to false
        };
    }, [isAutoUpdate]);

    const renderTicker = (value: any, tseCode: string) => {
        return <div className="w-6/12 mx-auto flex items-center gap-1 justify-between text-center" dir="rtl">
            <a target="_blank" href={`http://www.tsetmc.com/instInfo/${tseCode}`} className="w-10 cursor-pointer">
                <img src="/tse.png" className="w-6 h-6" alt="" />
            </a>
            <span className="w-full text-right ">
                {value}
            </span>
        </div>
    }



    useEffect(() => {
        refetch()
    }, [getParams])

    const columns = data && generateColumnsArray(data?.metadata?.column_names, [
        {
            accessorKey: 'c_ticker',
            Cell: (row: any) => {
                const val = row.value
                return renderTicker(val, row.row.original.c_tse_code)
            },
        },
        {
            accessorKey: 'p_ticker',
            Cell: (row: any) => {
                const val = row.value
                return renderTicker(val, row.row.original.p_tse_code)
            },
        },
    ] , data?.metadata?.column_annotate)

    return (
        <div id="csstable">
            <ConversionForm />
            {

                data && <DataTable columns={columns} data={data.data} />

            }
        </div>
    )
}

export default Conversion