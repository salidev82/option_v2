import axios from 'axios'
import React from 'react'
import { useQuery } from 'react-query'
import { generateColumnsArray } from '../../../helper/functions'
import { DataTable } from "@/components/shared/DataTable";

type Props = {
  row: any
}

const PNL = (props: Props) => {


  const { position_id } = props.row

  const getData = async () => {
    let response = await axios.get(`position/maturity_return/${position_id}`).catch((err) => {
    })
    return response.data
  }

  const { data, refetch, isLoading } = useQuery(`PNL${position_id}`, getData)
  const columns = data && generateColumnsArray(data?.metadata?.column_names, null, data?.metadata.column_annotate)

  return (
    <div>
      <div className="w-full bg-blue-200 p-2 mt-4 rounded-t-sm">
        <span className='text-sm'>
          بازدهی سررسید
        </span>
      </div>
      <div className="postions__table">
        {
          data && <DataTable search={false} columns={columns} data={data?.data} />
        }
      </div>
    </div>
  )
}

export default PNL