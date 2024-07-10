import React, { useEffect, useState } from 'react'
import axios from 'axios';
import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'
import { convertToGreaterUnit } from '@/helper/functions';

type Props = {
    row: any
}

const MarriedPutModal = (props: Props) => {

    const row = props.row
    let prevRow: any = null;

    const [data, setData] = useState<any>(null);
    const arr = data && [row.ua_price, row.strike_price, row.cost, row.mp_break_even_point]



    useEffect(() => {
        // Check if the row prop has actually changed
        if (row !== prevRow) {
            async function getData() {
                let response = await axios.post(`options_strategies/married_put/analysis`, {
                    "premium": row.premium,
                    "ua_price": row.ua_price,
                    "strike_price": row.strike_price,
                    "days_to_maturity": row.days_to_maturity,
                    // "risk_free_rate": row.risk_free_rate,
                });
                setData(response.data);
            }

            getData();
        }

        // Save the current row prop for the next comparison
        prevRow = row;
    }, [row]);

    // Calculate min and max values
    var minValue = data && Math.min(...data.payoff_range);
    var maxValue = data && Math.max(...data.return_range);

    // Add 20 to the max value
    var adjustedMaxValue = maxValue + 80;

    const options = {
        chart: {
            height: 490,
        },
        title: {
            text: ''
        },
        xAxis: {
            enabled: true, // Hide the x-axis
            categories: data && data?.ua_price_range,
            tickInterval: 1,
            useHTML: true,
            labels: {
                enabled: true,
                rotation: 90,

            },
            title: {
                text: 'قیمت دارایی پایه در سررسید',
            },
            gridLineColor: '#CCCCCC', // Color of vertical grid lines
            gridLineWidth: 0,         // Width of grid lines

            tickPositioner: function () {
                var positions: any = [];
                var categories = this.categories;
                // Iterate through all the categories or values on the x-axis

                categories.forEach(function (category: any, index: any) {
                    // Check if the category or value should be displayed
                    if (arr.includes(category)) {
                        // Add the position to the array
                        positions.push(index);
                    }
                });
                return positions;
            },

            plotLines: [
                {
                    dashStyle: "dot",
                    value: data?.ua_price_range.indexOf(arr[0]), // x-value for the second point
                    color: "red",
                    width: 2,
                    zIndex: 5,
                    label: {
                        style: {
                            color: 'red',
                            fontSize: 18
                        },
                        y: 20,
                        x: 10,
                        text: "قیمت فعلی سهم",
                        rotation: 0
                    },
                },
                {
                    dashStyle: "dot",
                    value: data?.ua_price_range.indexOf(arr[1]), // x-value for the second point
                    color: "green",
                    width: 2,
                    zIndex: 5,
                    label: {

                        y: 80,
                        x: -140,
                        text: "قیمت اعمال",
                        rotation: 0,
                        style: {
                            color: 'green',
                            fontSize: 18
                        }
                    },
                },
                {
                    dashStyle: "dot",
                    value: data?.ua_price_range.indexOf(arr[2]), // x-value for the second point
                    width: 2,
                    zIndex: 5,
                    color: 'purple',
                    label: {
                        style: { fontSize: 18, color: 'purple' },
                        y: 260,
                        x: -60,
                        text: "هزینه اتخاذ",
                        rotation: 0
                    },
                    min: 2,
                    max: 3,
                },
                {
                    dashStyle: "dot",
                    value: data?.ua_price_range.indexOf(arr[3]), // x-value for the second point
                    color: "blue",
                    width: 2,
                    zIndex: 5,
                    label: {
                        style: { fontSize: 18, color: 'blue' },
                        y: 330,
                        x: -40,
                        text: "نقطه سربه‌سر",
                        rotation: 0
                    },
                },
            ],

        },
        yAxis: {
            title: {
                text: "عایدی",
            },
            gridLineColor: '#CCCCCC', // Color of horizontal grid lines
            gridLineWidth: 2,         // Width of grid lines
            // min: minValue - 80,
            // max: adjustedMaxValue,

        },
        series: [
            {
                name: 'عایدی',
                data: data && data?.payoff_range,
                visible: true,
                color: 'green'
            },
            // {
            //     // name: 'اختیار خرید فروخته شده',
            //     data: data && data?.return_range,
            //     color: 'red',
            //     visible: true
            // },
            // {
            //     name: 'استراتژی کال اسپرد صعودی',
            //     data: data && data?.bull_call_spread_payoff,
            //     color: 'black'

            // },
        ],
        plotOptions: {
            series: {
                lineWidth: 3, // Increase line width for visibility
                linecap: 'round', // Rounded line caps for a smoother look
            },
        },
        tooltip: {
            useHTML: true,
            style: {
                textAlign: 'right' // Align tooltip text to the right
            },
            formatter: function (this: any) {
                return `
                <div style="text-align:left" dir="ltr">
                    <table style="">
                        <tr style="background-color: #f2f2f2;">
                        </tr>

                        <tr>
                        <td style="padding: 8px; text-align: left;">${this.x.toLocaleString('en-US')}</td>
                            <td style="padding: 8px; text-align: left;" dir='ltr'> : قیمت سهم در سررسید   (%${(((this.x / row.ua_price) - 1) * 100).toFixed(1)})</td>
                        </tr>
        
                        <tr>
                        <td style="padding: 8px; text-align: left;">${this.y}</td>
                            <td style="padding: 8px; text-align: right;"> : عایدی</td>
                        </tr>

                        <tr>
                        <td style="padding: 8px; text-align: left;">${data && data.return_range[this.point.index]}%</td>
                            <td style="padding: 8px; text-align: right;"> : بازدهی</td>
                        </tr>
                     

                    </table>
                </div>
                `
            }
        },
    }

    const renderTicker = (value: any, tseCode: string) => {

        return <div className="w-full mx-auto flex items-center justify-between text-center" dir="rtl">
            <a target="_blank" href={`http://www.tsetmc.com/instInfo/${tseCode}`} className="w-10 cursor-pointer">
                <img src="/tse.png" className="w-5 h-5" alt="" />
            </a>
            <span className="w-full text-right ">
                {value}
            </span>
        </div>
    }

    return (
        <div className='my-8'>
            <div className='mt-4 h-full'>
                <div>
                    <div className="my-2">
                        <div className='grid grid-cols-4'>
                            <div className='flex items-center justify-between text-sm border p-2'>
                                <div>نماد : </div>
                                <div className='text-sm'>
                                    {renderTicker(row.ticker, row.tse_code)}
                                </div>
                            </div>

                            <div className='flex items-center justify-between text-sm border p-2'>
                                <div> سررسید : </div>
                                <div className='text-sm'>{row.days_to_maturity}</div>
                            </div>

                            <div className='flex items-center justify-between text-sm border p-2'>
                                <div> موقعیت باز : </div>
                                <div className='text-sm'>{row.open_position.toLocaleString('en-US')}</div>
                            </div>
                            <div className='flex items-center justify-between text-sm border p-2'>
                                <div>تعداد معاملات : </div>
                                <div className='text-sm'>{row.number_of_trades}</div>
                            </div>

                        </div>
                        <div className='grid grid-cols-4'>
                            <div className='flex items-center justify-between text-sm border p-2'>
                                <div>ارزش معاملات : </div>
                                <div className='text-sm' dir='ltr'>
                                    {convertToGreaterUnit(row.total_trade_value)}
                                </div>
                            </div>

                            <div className='flex items-center justify-between text-sm border p-2'>
                                <div> قیمت اعمال : </div>
                                <div className='text-sm'>{row.strike_price.toLocaleString('en-US')}</div>
                            </div>

                            <div className='flex items-center justify-between text-sm border p-2'>
                                <div> قیمت سهم : </div>
                                <div className='text-sm'>{row.ua_price.toLocaleString('en-US')}</div>
                            </div>
                            <div className='flex items-center justify-between text-sm border p-2'>
                                <div>پرمیوم : </div>
                                <div className='text-sm'>{row.premium}</div>
                            </div>

                        </div>
                        <div className='grid grid-cols-4'>
                            <div className='flex items-center justify-between text-sm border p-2'>
                                <div>ارزش ذاتی : </div>
                                <div className='text-sm'>
                                    {row.intrinsic_value}
                                </div>
                            </div>

                            <div className='flex items-center justify-between text-sm border p-2'>
                                <div> حباب : </div>
                                <div className='text-sm'>{row.bubble_percent}</div>
                            </div>

                            <div className='flex items-center justify-between text-sm border p-2'>
                                <div> هزینه اتخاذ : </div>
                                <div className='text-sm'>{row.cost.toLocaleString('en-US')}</div>
                            </div>
                            <div className='flex items-center justify-between text-sm border p-2'>
                                <div>نقطه سربه‌سر : </div>
                                <div className='text-sm'>{row.mp_break_even_point.toLocaleString('en-US')}</div>
                            </div>

                        </div>
                        <div className='grid grid-cols-4'>

                            <div className='flex items-center justify-between text-sm border p-2'>
                                <div> فاصله تا سربه‌سر : </div>
                                <div className='text-sm'>{row.mp_break_even_percent}</div>
                            </div>

                            <div className='flex items-center justify-between text-sm border p-2'>
                                <div> کف بازدهی در سررسید : </div>
                                <div dir='ltr' className='text-sm'>{row.min_return_percent}</div>
                            </div>
                            <div className='flex flex-grow flex-1 col-span-1 items-center justify-between text-sm border p-2'>
                                <div>بروزرسانی : </div>
                                <div className='text-sm'>{row.last_updated_time}</div>
                            </div>

                        </div>
                    </div>
                </div>
                <HighchartsReact
                    highcharts={Highcharts}
                    options={options}
                />
            </div>
        </div>
    )
}

export default MarriedPutModal