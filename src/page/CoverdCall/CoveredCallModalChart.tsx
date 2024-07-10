import React, { useEffect, useState } from 'react'
import axios from 'axios';
import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'



type Props = {
    data: any
}

const CoveredCallModalChart = (props: Props) => {


    const row = props.data

    let prevRow: any = null;


    const [data, setData] = useState<any>(null);

    useEffect(() => {
        // Check if the row prop has actually changed
        if (row !== prevRow) {
            async function getData() {
                let response = await axios.post(`options_strategies/cc`, {
                   ...row
                });
                setData(response.data);
            }

            getData();
        }

        // Save the current row prop for the next comparison
        prevRow = row;
    }, [row]);


    const arr = data && [row.strike_price, row.ua_price, row.cc_cost, data?.risk_free_return]








    const options = {

        title: {
            text: ''
        },
        xAxis: {
            categories: data && data.ua_price_range,
            title: {
                text: "قیمت در سررسید",
            },
            tickInterval: 1,
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
                    color: "blue",
                    width: 1,
                    zIndex: 5,
                    label: {
                        style: { fontSize: 18 },
                        y: 140,
                        text: "قیمت اعمال",
                    },
                },
                {
                    dashStyle: "dot",
                    value: data?.ua_price_range.indexOf(arr[1]), // x-value for the second point
                    color: "purple",
                    width: 1,
                    zIndex: 5,
                    label: {
                        style: { fontSize: 18 },
                        y: 140,

                        text: "قیمت فعلی",
                    },
                },

                {
                    dashStyle: "dot",
                    value: data?.ua_price_range.indexOf(arr[2]), // x-value for the second point
                    color: "green",
                    width: 1,
                    zIndex: 5,
                    label: {
                        style: { fontSize: 18 },
                        y: 120,
                        text: "هزینه اتخاذ استراتژی",
                    },
                    min: 2,
                    max: 3,
                },
                {
                    dashStyle: "dot",
                    value: data?.ua_price_range.indexOf(arr[3]), // x-value for the second point
                    color: "green",
                    width: 1,
                    zIndex: 5,
                    label: {
                        style: { fontSize: 18 },
                        y: 140,
                        text: "سود بدون رسیک",
                    },
                },
            ],

        },
        yAxis: {
            title: {
                text: "سود و زیان",
            },

            plotLines: [
                {
                    value: 0, // x-value for the second point
                    color: "gray",
                    width: 1,
                    zIndex: 5,
                },
            ],
        },
        legend: {
            enabled: false
        },
        tooltip: {
            useHTML: true,
            formatter: function (this: any) {
                if (this.point.series.name === 'scatter') {
                    if (arr.indexOf(this.x) == 0) {
                        return `<b>قیمت اعمال</b> : ${this.x}`
                    } else if (arr.indexOf(this.x) == 1) {
                        return `<b>قیمت فعلی سهم</b> : ${this.x}`
                    }
                    else if (arr.indexOf(this.x) == 2) {
                        return `<b>هزینه اتخاذ</b> : ${this.x}`
                    }
                    else if (arr.indexOf(this.x) == 3) {
                        return `<b>بازدهی بدون ریسک</b> : ${this.x}`
                    }
                }
                else {

                    return `
                    <div >
                        <table>
                            <tbody>
                                <tr>
                                    <td>${this.y}%</td>
                                    <td>          : سود و زیان</td>
                                </tr>
                                <tr>
                                    <td>(${((this.x / row.ua_price - 1) * 100).toFixed(2)}%) ${this.x} </td>
                                    <td>:قیمت سررسید </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>`;
                }
            },
        },
        series: [
            {
                data: data && data?.return_range,
                zIndex: 1
            },
        ],

    }



    return (
        <div>
            <HighchartsReact
                highcharts={Highcharts}
                options={options}
            />
        </div>
    )
}

export default React.memo(CoveredCallModalChart)