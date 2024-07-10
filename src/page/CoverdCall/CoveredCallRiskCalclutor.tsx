import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import axios from 'axios'
import React, { useState } from 'react'

type Props = {
    data: any,
    historicalDays: any,
    setHistroicalDays: any
}

const CoveredCallRiskCalclutor = (props: Props) => {

    const row = props.data


    const [data, setData] = useState<any>(null)

    const calcRisk = () => {
        axios.get(`options_strategies/cc/risk/${row.ua_tse_code}?days_to_maturity=${row.days_to_maturity}&historical_days=${props.historicalDays}&cc_break_even_percent=${row.cc_break_even_percent}&option_break_even_percent=${row.option_break_even_percent}`).then((res) => {
            setData(res.data)
        })
    }

    return (
        <div className=' w-full flex flex-col  text-xs gap-4'>
            <div className="flex w-fit w-2/5 gap-2 items-center">
                <Input type='number' onChange={(e: any) => props.setHistroicalDays(e.target.value)} defaultValue={250} className='h-8' />
                <Button onClick={() => calcRisk()} className='w-[200px] text-xs h-8 '>محاسبه ریسک</Button>
            </div>
            {
                data && <ul className='text-sm list-disc mx-4'>
                    <li>{data.sentence_1}</li>
                    <li>{data.sentence_2}</li>
                    <li>{data.sentence_3}</li>
                </ul>
            }
        </div>
    )
}

export default CoveredCallRiskCalclutor