import { useEffect, useState } from 'react'
import Loading from '@/components/shared/Loading'
import { DataTable } from '@/components/shared/DataTable'
import { generateColumnsArray } from '@/helper/functions'
import { useSelector } from 'react-redux'
import axios from 'axios'
import { useQuery } from 'react-query'
import { FcBarChart, FcCalculator } from 'react-icons/fc'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"

import MarriedPutFilter from './MarriedPutFilter'
import MarriedPutCalc from './MarriedPutCalc'
import MarriedPutModal from './MarriedPutModal'

type Props = {}

const MarriedPut = (props: Props) => {

    const paramsFromLocalStorage = useSelector(
        (state: any) => state.MarriedPutFilterSlice // Replace with the actual slice name used in the store
    );

    const useDebounce = (callback: any, delay: any) => {
        const [timer, setTimer] = useState(null);

        useEffect(() => {
            return () => {
                if (timer) clearTimeout(timer);
            };
        }, [timer]);

        const debouncedCallback = (...args: any) => {
            if (timer) clearTimeout(timer);
            setTimer(setTimeout(() => {
                callback(...args);
            }, delay));
        };

        return debouncedCallback;
    };

    const isAutoUpdate = useSelector((state: any) => state.config.isAutoUpdate);

    const getArbitrage = async () => {
        const response = await axios.get(`options_strategies/married_put`, {
            params: paramsFromLocalStorage,
        });
        return response.data;
    };

    const { data, isFetching, isError, refetch }: { data: any, isFetching: boolean, isError: boolean, refetch: any } = useQuery('Arbitrage', getArbitrage)


    const debouncedRefetch = useDebounce(refetch, 100);

    useEffect(() => {
        // Call debouncedRefetch instead of refetch when paramsFromLocalStorage changes
        debouncedRefetch();
    }, [paramsFromLocalStorage]);


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
        return <div className="w-8/12 mx-auto flex items-center gap-1 justify-between text-center" dir="rtl">
            <a target="_blank" href={`http://www.tsetmc.com/instInfo/${tseCode}`} className="w-10 cursor-pointer">
                <img src="/tse.png" className="w-6 h-6" alt="" />
            </a>
            <span className="w-full text-right text-xs">
                {value}
            </span>
        </div>
    }

    const columns = data && generateColumnsArray(data?.metadata?.column_names, [
        {
            header: 'نماد',
            accessorKey: 'ticker',
            Cell: (row: any) => {
                const val = row.value
                return renderTicker(val, row.row.original.tse_code)
            },
        },
        {
            header: 'ماشین حساب',
            accessorKey: 'calculator',
            Cell: (row: any) => {
                const val = row.value
                return <div className="text-md cursor-pointer text-center w-full flex items-center justify-center">
                    <Dialog >
                        <DialogTrigger>
                            <FcCalculator fontSize={28} className="mx-auto hover:bg-gray-200 p-1 rounded-full transition-all " />
                        </DialogTrigger>
                        <DialogContent className="max-w-sm">
                            <MarriedPutCalc row={row.row.original} />
                        </DialogContent>
                    </Dialog>

                </div>
            },
        },
        {
            header: 'تحلیل',
            accessorKey: 'analysis',
            Cell: (row: any) => {
                return <div className='w-full justify-center flex items-center cursor-pointer text-center'>
                    <Dialog>
                        <DialogTrigger>
                            <FcBarChart fontSize={28} className="mx-auto hover:bg-cyan-200 p-1 rounded-full transition-all " />
                        </DialogTrigger>
                        <DialogContent className='max-w-7xl mx-2'>
                            <MarriedPutModal row={row.row.original} />
                        </DialogContent>
                    </Dialog>
                </div>
            },
        },
    ], data?.metadata?.column_annotate);


    if (isFetching) return <Loading />

    return (
        <div className='noTRBold marriedput'>
            <MarriedPutFilter />
            {(isError) && 'error getting Data'}
            {data && <DataTable columns={columns} data={data?.data} />}
        </div>
    )
}

export default MarriedPut