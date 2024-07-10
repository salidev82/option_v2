import React, { useEffect, useState } from 'react'
import axios from 'axios';
import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'


type Props = {
    row: any
}

const BullCallSpreadChartModal = (props: Props) => {

    const row = props.row
    let prevRow: any = null;

    const [data, setData] = useState<any>(null);
    const arr = data && [row.short_strike_price, row.long_strike_price, row.ua_price, row?.bcs_break_even_point]

    useEffect(() => {
        // Check if the row prop has actually changed
        if (row !== prevRow) {
            async function getData() {
                let response = await axios.post(`spreads_strategies/bull_call`, {
                    "ua_tse_code": row.ua_tse_code,
                    "long_premium": row.long_premium,
                    "long_strike_price": row.long_strike_price,
                    "short_premium": row.short_premium,
                    "short_strike_price": row.short_strike_price,
                });
                setData(response.data);
            }

            getData();
        }

        // Save the current row prop for the next comparison
        prevRow = row;
    }, [row]);

    // Calculate min and max values
    var minValue = data && Math.min(...data.bull_call_spread_payoff);
    var maxValue = data && Math.max(...data.bull_call_spread_payoff);

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
            enabled: false, // Hide the x-axis
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
                        text: "قیمت اعمال بالا",
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

                        y: 20,
                        x: -140,
                        text: "قیمت اعمال پائین",
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
                        text: "قیمت فعلی سهم",
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
            min: minValue - 80,
            max: adjustedMaxValue,

        },
        series: [
            {
                name: 'اختیار خرید خریده شده',
                data: data && data?.long_call_payoff_range,
                visible: false,
                color: 'green'
            },
            {
                name: 'اختیار خرید فروخته شده',
                data: data && data?.short_call_payoff_range,
                color: 'red',
                visible: false
            },
            {
                name: 'استراتژی کال اسپرد صعودی',
                data: data && data?.bull_call_spread_payoff,
                color: 'black'

            },
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
                    <div style="text-align:right">
                    ${this.series.name}
                        <table style="">
                            <tr style="background-color: #f2f2f2;">
                            </tr>
                            <tr>
                            <td style="padding: 8px; text-align: left;"> ${this.x} (  ${(((this.x / row.ua_price) - 1) * 100).toFixed(1)}% )</td>
                                <td style="padding: 8px; text-align: right;">قیمت دارایی پایه در سررسید</td>
                            </tr>
                            <tr>
                            <td style="padding: 8px; text-align: left;">${this.y}</td>
                                <td style="padding: 8px; text-align: right;">عایدی</td>
                            </tr>
                            <tr>
                            <td style="padding: 8px; text-align: left;">${data && data.bull_call_spread_return[this.point.index]}%</td>
                                <td style="padding: 8px; text-align: right;">بازدهی</td>
                            </tr>
                        </table>
                    </div>
                `;
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
        <div className='mt-4 h-full'>
            <div>
                <div className="my-2">
                    <div className='grid grid-cols-4 bg-green-300'>
                        <div className='flex items-center justify-between text-sm border p-2'>
                            <div>نماد : </div>
                            <div className='text-sm'>
                                {renderTicker(row.long_ticker, row.long_tse_code)}
                            </div>
                        </div>

                        <div className='flex items-center justify-between text-sm border p-2'>
                            <div> قیمت اعمال : </div>
                            <div className='text-sm'>{row.long_strike_price}</div>
                        </div>

                        <div className='flex items-center justify-between text-sm border p-2'>
                            <div> پرمیوم : </div>
                            <div className='text-sm'>{row.long_premium}</div>
                        </div>
                        <div className='flex items-center justify-between text-sm border p-2'>
                            <div>ارزش ذاتی : </div>
                            <div className='text-sm'>{row.long_intrinsic_value}</div>
                        </div>

                    </div>
                    <div className='grid grid-cols-4 bg-red-300'>
                        <div className='flex items-center justify-between text-sm border p-2'>
                            <div>نماد : </div>
                            <div className="">
                                {renderTicker(row.short_ticker, row.short_tse_code)}
                            </div>
                        </div>

                        <div className='flex items-center justify-between text-sm border p-2'>
                            <div>قیمت اعمال : </div>
                            <div className='text-sm'>{row.short_strike_price}</div>
                        </div>

                        <div className='flex items-center justify-between text-sm border p-2'>
                            <div> پرمیوم : </div>
                            <div className='text-sm'>{row.short_premium}</div>
                        </div>

                        <div className='flex items-center justify-between text-sm border p-2'>
                            <div> ارزش ذاتی : </div>
                            <div className='text-sm'>{row.short_intrinsic_value}</div>
                        </div>

                    </div>
                    <div className='grid grid-cols-4 '>
                        <div className='flex items-center justify-between text-sm border p-2'>
                            <div>سررسید : </div>
                            <div className='text-sm'>{row.days_to_maturity}</div>
                        </div>
                        <div className='flex items-center justify-between text-sm border p-2'>
                            <div>قیمت سهم : </div>
                            <div className='text-sm'>{row.ua_price.toLocaleString('en-US')}</div>
                        </div>
                        <div className='flex items-center justify-between text-sm border p-2'>
                            <div>هزینه اتخاذ : </div>
                            <div className='text-sm'>{row.bull_spread_cost}</div>
                        </div>
                        <div className='flex items-center justify-between text-sm border p-2'>
                            <div>قیمت سربه‌سری : </div>
                            <div className='text-sm'>{row.bcs_break_even_point.toLocaleString('en-US')}</div>
                        </div>
                        <div className='flex items-center justify-between text-sm border p-2'>
                            <div> حداکثر سود : </div>
                            <div className='text-sm'>{row.max_profit}</div>
                        </div>
                        <div className='flex items-center justify-between text-sm border p-2'>
                            <div>فاصله تا سربه‌سری : </div>
                            <div className='text-sm' dir='ltr'>{row.bcs_break_even_percent}%</div>
                        </div>
                        <div className='flex items-center justify-between text-sm border p-2'>
                            <div> حداکثر بازدهی : </div>
                            <div className='text-sm'>{row.max_return_percent}%</div>
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

export default BullCallSpreadChartModal