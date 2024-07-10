import React, { useEffect, useState } from "react";
import HistoricalTradeSummaryFilter from "./HistoricalTradeSummaryFilter";
import { useQuery } from "react-query";
import axios from "axios";
import jalaliMoment from "jalali-moment"; // Import jalali-moment
import Loading from "@/components/shared/Loading";
import { generateColumnsArray } from "@/helper/functions";
import DataTable from "@/components/shared/DataTable";
import HistoricalTradeChart from "./HistoricalTradeChart";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

type Props = {};

const HistoricalTradeSummary = (props: Props) => {
  // Get the current date in Unix timestamp format
  const currentDate = Math.floor(Date.now() / 1000); // Convert to seconds

  // Get the date from one month ago
  const oneMonthAgo = new Date();
  oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 3);
  const oneMonthAgoUnix = Math.floor(oneMonthAgo.getTime() / 1000);

  const [FromDate, setFromDate] = useState<number | undefined>(
    oneMonthAgoUnix * 1000
  );
  const [toDate, setToDate] = useState<number | undefined>(currentDate * 1000);

  // getting Data

  const get_historical_trade_summary = async () => {
    let response = await axios.get(
      `/options/historical_trade_summary?start_date=${jalaliMoment
        .unix(FromDate / 1000)
        .format("jYYYY/jMM/jDD")}&end_date=${jalaliMoment
        .unix(toDate / 1000)
        .format("jYYYY/jMM/jDD")}`
    );
    return response.data;
  };

  const { data, isFetching, isError, refetch } = useQuery(
    `historical_trade_summary`,
    get_historical_trade_summary
  );

  useEffect(() => {
    refetch();
  }, [FromDate, toDate]);

  if (isFetching) return <Loading />;

  const columns = data && generateColumnsArray(data?.metadata?.column_names);

  return (
    <>
      <div className="historical_trade">
        <HistoricalTradeSummaryFilter
          FromDate={FromDate}
          setFromDate={setFromDate}
          toDate={toDate}
          setToDate={setToDate}
          currentDate={currentDate}
        />

        {isError && "error getting Data"}

        <div id="export">
          {data && (
            <HistoricalTradeChart
              formDate={FromDate}
              toDate={toDate}
              data={data?.data}
            />
          )}
        </div>
        <div className="w-11/12 mx-auto">
          {data && (
            <DataTable columns={columns} data={[...data?.data].reverse()} />
          )}
        </div>
      </div>
    </>
  );
};

export default HistoricalTradeSummary;
