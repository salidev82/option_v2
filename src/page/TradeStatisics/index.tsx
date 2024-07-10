import { DataTable } from '@/components/shared/DataTable';
import Loading from '@/components/shared/Loading';
import { convertToGreaterUnit, generateColumnsArray } from '@/helper/functions';
import axios from 'axios';
import React, { useRef } from 'react'
import { useQuery } from 'react-query';
import TradeStatisicsExpand from './TradeStatisicsExpand';
import { BiSolidChevronDown, BiSolidChevronUp } from 'react-icons/bi'
import TradeStaticicsChart from './TradeStaticicsChart';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas'
import MyTable from './MyTable';
type Props = {}

const TradeStatisics = (props: Props) => {

    const getOption = async () => {
        const response = await axios.get(`options/trade_statistics`);
        return response.data;
    };

    const { data, isFetching, isError, refetch }: { data: any, isFetching: boolean, isError: boolean, refetch: any } = useQuery('trade_statistics', getOption)

    const divRef = useRef(null);
    const handleExportJpg = () => {
        setTimeout(() => {
            const targetElement: any = document.getElementById("report");

            html2canvas(targetElement, {
                scale: 2,
            }).then((canvas) => {
                const imgData = canvas.toDataURL("image/jpeg");
                const link = document.createElement("a");
                link.download = `گزارش پرتفوی ${data?.date}.jpg`;
                link.href = imgData;
                link.click();
            });
        }, 200);
    };


    const renderTicker = (value: any, tseCode: string) => {
        return <div className="w-6/12 mx-auto flex items-center gap-1 justify-between text-center" dir="rtl">
            {value != 'کل بازار' && <a target="_blank" href={`http://www.tsetmc.com/instInfo/${tseCode}`} className="w-10 cursor-pointer">
                <img src="/tse.png" className="w-6 h-6" alt="" />
            </a>}
            <span className="w-full text-right">
                {value != 'کل بازار' ? value : <span className='px-12'>{value}</span>}
            </span>
        </div>
    }

    const columns = data && [
        {
            header: ' ',
            columns: [
                {
                    header: 'نماد پایه',
                    accessorKey: 'ticker',
                    cell: ({ row, cell }) => {

                        return row.getCanExpand() ? (
                            <div className='flex items-center justify-around w-full'>
                                <div className="flex-1">
                                    {cell.getValue()}
                                </div>
                                <button
                                    {...{
                                        onClick: row.getToggleExpandedHandler(),
                                        style: { cursor: 'pointer' },
                                        className: 'text-center relative right-5'
                                    }}
                                >
                                    {row.original.ticker === 'کل بازار' ? '' : row.getIsExpanded() ? <BiSolidChevronUp /> : <BiSolidChevronDown />}
                                </button>
                            </div>
                        ) : (
                            '🔵'
                        )
                    },
                },
            ]
        },
        {
            header: 'قرارداد های اختیار خرید',

            columns: [
                {
                    header: 'مجموع ارزش معامله شده',
                    accessorKey: 'total_trade_value_call',
                    Cell: (row: any) => {
                        const val = row.value
                        return <span title={row.value?.toLocaleString('en-US')}>{convertToGreaterUnit(row.value)}</span>
                    },
                },
                {
                    header: 'تعداد برگه قراردادهای معامله شده',
                    accessorKey: 'total_trade_volume_call',
                    Cell: (row: any) => {
                        const val = row.value
                        return <span title={row.value?.toLocaleString('en-US')} >{convertToGreaterUnit(row.value)}</span>
                    },
                },
            ],
        },
        {
            header: 'قرارداد های اختیار فروش',

            columns: [
                {
                    header: 'مجموع ارزش معامله شده',
                    accessorKey: 'total_trade_value_put',
                    Cell: (row: any) => {
                        const val = row.value
                        return <span title={row.value?.toLocaleString('en-US')} >{convertToGreaterUnit(row.value)}</span>
                    },
                },
                {
                    header: 'تعداد برگه قراردادهای معامله شده',
                    accessorKey: 'total_trade_volume_put',
                    Cell: (row: any) => {
                        const val = row.value
                        return <span title={row.value?.toLocaleString('en-US')} >{convertToGreaterUnit(row.value)}</span>
                    },
                },
            ],
        },


    ]




    const renderSubComponent = ({ row }: { row: any }) => {
        return (
            <TradeStatisicsExpand original={row} />
        )
    }


    if (isFetching) return <Loading />

    return (
        <div className='customTable '>
            <button onClick={handleExportJpg}>

            </button>
            <div
                ref={divRef}
                style={{
                    width: '1735px',
                    height: '100%',
                    margin: '0 auto',
                }}>
                {(isError) && 'error getting Data'}
                <TradeStaticicsChart data={data?.data} />
                {
                    data && <MyTable
                        renderSubComponent={renderSubComponent}
                        getRowCanExpand={() => true}
                        columns={columns}
                        data={data?.data}
                    />
                }
            </div>
        </div>
    )
}

export default TradeStatisics