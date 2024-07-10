import React, { FC } from 'react'
import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'
import { convertToGreaterUnit } from '../../helper/functions'


type Props = {
    data: any[]
}



const TradeStaticicsChart: FC<Props> = ({ data }) => {
    const cleanDataforBuy = data?.filter((item) => item.total_trade_value_call !== 0)
    const cleanDataforSale = data?.filter((item) => item.total_trade_value_put !== 0)?.sort((a, b) => b.total_trade_value_put - a.total_trade_value_put)

    // خرید
    const formattedDataforChartBuy = cleanDataforBuy?.slice(1,)?.map((item: any) => {
        return {
            name: item.ticker,
            y: item.total_trade_value_call
        }
    })

    // فروش
    const formattedDataforChartSale = cleanDataforSale?.slice(1,)?.map((item: any) => {
        return {
            name: item.ticker,
            y: item.total_trade_value_put
        }
    })


    const options = (SeriesData: any[]) => {
        return {
            chart: {
                plotBackgroundColor: null,
                plotBorderWidth: null,
                plotShadow: false,
                type: 'pie',
                height: 260,
                backgroundColor: null
            },
            title: {
                text: '',
                align: 'left'
            },
            tooltip: {
                pointFormatter: function () {
                    // Customize the formatting of point.y using a custom function
                    return this.series.name + ':  % ' + Highcharts.numberFormat(this.percentage, 1) + '<br/> ' + convertToGreaterUnit(this.y) + ': ارزش  ';
                }
            },
            accessibility: {
                point: {
                    valueSuffix: '%'
                }
            },
            plotOptions: {
                pie: {
                    allowPointSelect: true,
                    cursor: 'pointer',
                    dataLabels: {
                        enabled: true,
                        format: '%<b>{point.name}</b>: {point.percentage:.2f} ',
                        style: {
                            color: '#333'
                        }
                    }
                }
            },
            series: [{
                name: 'درصد',
                colorByPoint: true,
                data: SeriesData
            }]
        }
    }


    return (
        <div className='grid grid-cols-2 gap-4 '>
            <div className="border bg-gray-100">
                <div className="bg-green-100 p-1 px-4">
                ارزش قراردادهای اختیار خرید - به تفکیک دارایی پایه
                </div>
                <div className="flex items-center justify-center">
                    <HighchartsReact options={options(formattedDataforChartBuy)} highcharts={Highcharts} />
                </div>
            </div>
            <div className="border bg-gray-100">
                <div className="bg-red-100 p-1 px-4">
                  ارزش قراردادهای اختیار فروش - به تفکیک دارایی پایه
                </div>
                <div className="flex items-center justify-center">
                    <HighchartsReact options={options(formattedDataforChartSale)} highcharts={Highcharts} />
                </div>
            </div>
        </div>
    )
}

export default TradeStaticicsChart