import { convertToGreaterUnit } from '@/helper/functions'
import React from 'react'

type Props = {
    data: any
}

const CoveredCallSummaryModal = (props: Props) => {

    const row = props.data

    return (
        <div>
            <div className='mt-8 bg-gray-100 p-3 space-y-0'>
                <div className=" rounded-xl grid grid-cols-3">
                    <div className="flex items-center text-sm gap-4 border-2  p-1 text-center justify-between px-5">
                        <span>نماد : </span>
                        <span className='text-blue-500'>{row.ticker}</span>
                    </div>
                    <div className="flex items-center text-sm gap-4 border-2 border-x-0 p-1 text-center justify-between px-5">
                        <span>ارزش کاوردکال روز : </span>
                        <span dir='ltr' className='text-blue-500'>{convertToGreaterUnit(row?.cc_traded_value)}</span>
                    </div>
                    <div className="flex items-center text-sm gap-4 border-2  p-1 text-center justify-between px-5">
                        <span>ارزش معاملات  : </span>
                        <span dir='ltr' className='text-blue-500'>{convertToGreaterUnit(row?.total_trade_value)}</span>
                    </div>
                </div>
                <div className=" rounded-xl grid grid-cols-3">
                    <div className="flex items-center text-sm gap-4 border-2  p-1 text-center justify-between px-5">
                        <span>قیمت اعمال: : </span>
                        <span className='text-blue-500'>{row.strike_price?.toLocaleString('en-US')}</span>
                    </div>
                    <div className="flex items-center text-sm gap-4 border-2 border-x-0 p-1 text-center justify-between px-5">
                        <span>  تعداد معاملات : </span>
                        <span dir='ltr' className='text-blue-500'>{(row?.number_of_trades)}</span>
                    </div>
                    <div className="flex items-center text-sm gap-4 border-2  p-1 text-center justify-between px-5">
                        <span>هزینه اتخاذ  : </span>
                        <span dir='ltr' className='text-blue-500'>{(row?.cc_cost)}</span>
                    </div>
                </div>
                <div className=" rounded-xl grid grid-cols-3">
                    <div className="flex items-center text-sm gap-4 border-2  p-1 text-center justify-between px-5">
                        <span className=''>سررسید : </span>
                        <span className='text-blue-500'>{row.days_to_maturity}</span>
                    </div>
                    <div className="flex items-center text-sm gap-4 border-2 border-x-0 p-1 text-center justify-between px-5">
                        <span>  پرمیوم : </span>
                        <span dir='ltr' className='text-blue-500'>{(row?.premium)}</span>
                    </div>
                    <div className="flex items-center text-sm gap-4 border-2  p-1 text-center justify-between px-5">
                        <span>حداکثر بازدهی  : </span>
                        <span dir='ltr' className='text-blue-500'>{(row?.cc_max_return_percent)}%</span>
                    </div>
                </div>

                <div className=" grid grid-cols-none py-1.5 bg-cyan-600">
                    <div className="flex items-center text-sm gap-2 p-1 text-center justify-between px-5">
                        <span className='text-white'>بازدهی موثر سالانه  : </span>
                        <span dir='ltr' className='text-white'>{(row?.cc_max_annu_return_percent)}%</span>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CoveredCallSummaryModal