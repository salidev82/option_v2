import React, { FC } from 'react'
import DataTable from '../../../components/shared/DataTable'
import { generateColumnsArray } from '../../../helper/functions'

type Props = {
    data: any
}

const Margins: FC<Props> = ({ data }) => {

    const columns = generateColumnsArray(data.metadata.column_names)

    return (
        <div className="postions__table">
            <div className="w-full bg-blue-200 p-2 mt-4 rounded-t-sm">
                <span className='text-sm'>
                    وجه تضمین
                </span>
            </div>
            <DataTable
                columns={columns}
                data={data.data}
                search={false}
            />
        </div>
    )
}

export default Margins