import React, { useEffect, useState } from 'react';
import { useQuery } from 'react-query';
import axios from 'axios';
import DataTable from '@/components/shared/DataTable';
import Loading from '@/components/shared/Loading';
import { generateColumnsArray } from '@/helper/functions';

type Props = {
  row: any;
};

const TradeStatisicsExpand = (props: Props) => {
  const [selectedRow, setSelectedRow] = useState(null);

  const row = props?.original;


  const renderTicker = (value: any, tseCode: string) => {
    return (
      <div className="w-6/12 mx-auto flex items-center gap-1 justify-between text-center" dir="rtl">
        <a target="_blank" href={`http://www.tsetmc.com/instInfo/${tseCode}`} className="w-10 cursor-pointer">
          <img src="/tse.png" className="w-6 h-6" alt="" />
        </a>
        <span className="  w-full text-right ">{value}</span>
      </div>
    );
  };




  useEffect(() => {

    const getOption = async () => {
      const response = await axios.get(`/options/ua/${row.original?.ua_tse_code}`);
      setSelectedRow(response.data);
    };

    getOption()

  }, [row]);

  const columns = selectedRow && generateColumnsArray(selectedRow?.metadata?.column_names, [
    {
      header: 'اختیار خرید',
      accessorKey: 'ticker_call',
      Cell: (row: any) => {
        const val = row.value;
        return renderTicker(val, row.row.original.tse_code_call);
      },
    },
    {
      header: 'اختیار فروش',
      accessorKey: 'ticker_put',
      Cell: (row: any) => {
        const val = row.value;
        return renderTicker(val, row.row.original.tse_code_put);
      },
    },
  ]);

  return (
    <div className='noStyle w-full p-4'>
      {
        selectedRow && <>

          {selectedRow && (
            <DataTable columns={columns} data={selectedRow?.data} />
          )}
        </>
      }
    </div>
  );
};

export default TradeStatisicsExpand;