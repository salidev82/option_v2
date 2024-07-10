import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { generateColumnsArray } from '../../../helper/functions'
import DataTable from '../../../components/shared/DataTable'

const PostionReportsGrouped = () => {

    const [data, setData] = useState(null)

    useEffect(() => {
        async function getData() {
            let response = await axios.get(`position/reports/grouped_open_cc`)
            setData(response.data)
        }
        getData()
    }, [])

    const renderTicker = (value: any, tseCode: string) => {
        return (
          <div
            className="w-9/12 mx-auto flex items-center gap-4 justify-center text-center"
            dir="rtl"
          >
            <a
              target="_blank"
              href={`http://www.tsetmc.com/instInfo/${tseCode}`}
              className="w-8 h-8 cursor-pointer"
            >
              <img src="/tse.png" className="w-6 h-6 relative top-1 right-3" alt="" />
            </a>
            <span className="w-full text-right ">{value}</span>
          </div>
        );
      };

    const columns = data &&  generateColumnsArray(data.metadata.column_names , [
        {
            header: 'نماد',
            accessorKey: 'ticker',
            Cell: (row: any) => {
                const val = row.value
                return renderTicker(val, row.row.original.tse_code)
            },
        }
    ])

    return (
        <div className='mt-8'>
            {
                data && <DataTable
                    columns={columns}
                    data={data?.data}
                />
            }
        </div>
    )
}

export default PostionReportsGrouped