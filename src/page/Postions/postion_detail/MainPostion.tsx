import React, { FC } from "react";
import axios from 'axios'
import { toast } from 'react-toastify'

type Props = {
  row: any;
};

const MainPostion: FC<Props> = ({ row }) => {


  return (
    <div className="mt-8">
      <div className="text-sm bg-blue-200 p-2 rounded-sm flex items-center justify-between flex-row w-full">

        <div className="flex gap-4">

          <span>
            اطلاعات موقعیت
          </span>

          <div className=" text-sm flex items-center justify-between">
            <span>تاریخ ایجاد :   ‌</span>
            <span className="relative  text-xs " dir="ltr">
              {row.created_date} {"\t"}- {row.created_time}
            </span>
          </div>

        </div>



      </div>
      <div className="grid grid-cols-4 text-right gap-1">
        <div className="border my-2 p-2 text-sm flex items-center justify-between">
          <span>نماد :‌</span>
          <span className="relative text-sm " dir="ltr">
            {row.ua_ticker}
          </span>
        </div>

        <div className="border my-2 p-2 text-sm flex items-center justify-between">
          <span>استراتژی :‌</span>
          <span className="relative  text-sm" dir="ltr">
            {row.strategy_name}
          </span>
        </div>

        <div className="border my-2 p-2 text-sm flex items-center justify-between">
          <span>تاریخ سررسید :‌</span>
          <span className="relative top-0.5 text-sm " dir="ltr">
            {row.maturity_date}
          </span>
        </div>

        <div className="border my-2 p-2 text-sm flex items-center justify-between">
          <span>وضعیت :‌</span>
          <span className="relative  text-sm " dir="ltr">
            {row.status}
          </span>
        </div>
      </div>
      <textarea readOnly={true} className="border-2 w-full p-2 rounded-sm text-sm focus-visible:border-0 focus-visible:border-white" defaultValue={row.note}></textarea>
    </div>
  );
};

export default MainPostion;
