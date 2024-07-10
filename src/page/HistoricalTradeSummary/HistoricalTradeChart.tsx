import React, { FC } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import jalaliMoment from 'jalali-moment';
type Props = {
  data: any;
  toDate: any;
  formDate: any
};

const HistoricalTradeChart: FC<Props> = ({ data, formDate, toDate }) => {
  const categories = data.map((item) => item.date);


  const options = {
    chart: {
      type: "column",
    },
    title: {
      text: "",
    },
    series: [
      {
        name: "ارزش (میلیارد ریال)",
        data: data.map((item: any) => item.value),
      },
      {

        type: 'line',
        name: "میانگین ارزش معاملات بازه",
        data: Array(categories.length).fill(data[data.length - 1].mean_value),
      },

    ],
    xAxis: {
      title: {
        text: "",
        style: {
          fontWeight: "900",
          color: "#333",
          fontSize: "18px",
        },
      },

      categories: categories,
      tickInterval: 3,
      labels: {
        style: {
          color: "black",
          font: "14px Arial, sans-serif",
          fontWeight: "bold",
        },
      },
    },
    yAxis: {
      title: {
        text: "میلیارد ریال",
      },
      labels: {
        style: {
          color: "black",
          font: "14px Arial, sans-serif",
          fontWeight: "bold",
        },
      },

    },
    legend: {
      enabled: false,
    },
    tooltip: {
      formatter: function (this) {
        const formattedX = this.x.toLocaleString('en-US');
        const formattedY = this.y.toLocaleString('en-US');

        const transactions = data.find((el) => el.date == this.x).transactions;
        const volume = data.find((el) => el.date == this.x).volume;
        const mean = data[this.point.index].mean_value;

        return `
        تاریخ: ${formattedX}<br><br>
                تعداد معاملات : ${transactions.toLocaleString('en-US')}<br>
                تعداد برگه : ${volume.toLocaleString('en-US')}<br>
                ارزش (میلیارد ریال): ${formattedY}<br><br>
                 میانگین ارزش ${mean.toLocaleString('en-US')}<br>
                 میانگین ارزش معاملات بازه ${data[data.length - 1].mean_value}<br>
                 `
      },
    },
  };

  return (
    <div className="w-11/12 mx-auto">
      <p className="text-center mb-14">ارزش معاملات بازار از {jalaliMoment.unix(formDate / 1000).format('jYYYY/jMM/jDD')} تا {jalaliMoment.unix(toDate / 1000).format('jYYYY/jMM/jDD')}</p>
      <HighchartsReact highcharts={Highcharts} options={options} />
    </div>
  );
};

export default HistoricalTradeChart;
