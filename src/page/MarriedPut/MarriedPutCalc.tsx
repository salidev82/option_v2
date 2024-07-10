import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import axios from 'axios'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'

type Props = {
    row: any
}

const MarriedPutCalc = (props: Props) => {

    const [data, setData] = useState<any>(null)

    const { register, handleSubmit, watch, formState: { errors } } = useForm();

    const onSubmit = async data => {
        let response = await axios.post(`options_strategies/married_put`, {
            ...data,
            strike_price: row.strike_price,
            option_type: row.option_type
        })

        setData(response.data)
    };


    let row = props.row

    return (
        <div className='mt-0'>
            <>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className='mt-8 gap-0 flex flex-col border'>
                        <div className="w-full text-sm py-2 px-3 flex items-center justify-between">
                            <div className="">نماد</div>
                            <div className="flex items-center " dir="rtl">
                                <a target="_blank" href={`http://www.tsetmc.com/instInfo/${row.tse_code}`} className="mx-2 w-8 h-5 cursor-pointer">
                                    <img src="/tse.png" className="w-8 h-5" alt="" />
                                </a>
                                <span className="w-full -ml-2.5">
                                    {row.ticker}
                                </span>
                            </div>
                        </div>
                        <div className="w-full text-sm py-2 px-3 border-t  flex items-center justify-between">
                            <div  >قیمت اعمال</div>
                            <div className="flex items-center " dir="rtl">
                                <span className="w-full">
                                    {row.strike_price.toLocaleString('en-US')}
                                </span>
                            </div>
                        </div>
                        <div className="w-full text-sm py-2 px-3 border-t  flex items-center justify-between">
                            <div className="">پرمیوم</div>
                            <div className="flex items-center " dir="rtl">
                                <Input  {...register("premium", {
                                    valueAsNumber: true,
                                    validate: (value) => value > 0,
                                })}
                                    defaultValue={row.premium}
                                    className='text-left h-7 text-xs w-24 p-1' />
                            </div>
                        </div>
                        <div className="w-full text-sm py-2 px-3 border-t  flex items-center justify-between">
                            <div className="">قیمت دارایی پایه</div>
                            <div className="flex items-center " dir="rtl">
                                <Input {...register("ua_price", {
                                    valueAsNumber: true,
                                    validate: (value) => value > 0,
                                })}
                                    defaultValue={row.ua_price}
                                    className='text-left h-7 text-xs w-24 p-1' />
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col">
                        {errors.premium && <span className='text-sm text-red-400'>لطفا مقدار پرمیوم را وارد کنید</span>}
                        {errors.ua_price && <span className='text-sm text-red-400'>لطفا مقدار قیمت دارایی پایه را وارد کنید</span>}
                    </div>
                    <Button type='submit' className='mt-4 w-full'>
                        محاسبه
                    </Button>
                </form>

                {
                    data && <div className='mt-4'>
                        <div className="w-full max-w-md mx-auto bg-white shadow-md rounded-lg overflow-hidden">
                            <table className="min-w-full leading-normal border">
                                <tbody>
                                    {Object.keys(data).map((key) => (
                                        <tr key={key}>
                                            <td className="px-5 py-2 border-b border-gray-200 bg-white text-sm">
                                                {data[key].name}
                                            </td>
                                            <td dir='ltr' className="px-5 py-2 border-b text-left border-gray-200 bg-white text-sm">
                                                {data[key].value?.toLocaleString('en-US')}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                }
            </>
        </div>
    )
}

export default MarriedPutCalc