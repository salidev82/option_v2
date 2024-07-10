import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { generateColumnsArray } from '../../../helper/functions'
import { DataTable } from "@/components/shared/DataTable";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { FiTrash2 } from "react-icons/fi";
import { MdModeEditOutline } from "react-icons/md";
import ExercicesUpdateForm from './ExercicesUpdateForm';
import { toast } from 'react-toastify';
type Props = {
    id: any
}

const Exercises = (props: Props) => {

    const [data, setData] = useState<any>(null)


    useEffect(() => {

        async function getData() {
            let response = await axios(`position/exercise/list/${props.id}`)
            return setData(response.data)
        }

        getData()

    }, [])



    const deleteRow = (id) => {
        if (window.confirm("سطر مورد نظر حذف شود؟")) {
            axios.delete(`position/exercise/${id}`).then((res) => {
                if (res?.status === 200) {
                    toast.success("سطر  مورد نظر با موفقیت حذف شد", {
                        style: {
                            fontSize: 13,
                        },
                    })
                    window.location.reload()
                }
            }).catch((e) => {
                toast.error(e.response.data.detail, {
                    style: {
                        fontSize: 12,
                    },
                })
            })
        }
    };

    const columns = data && generateColumnsArray(data?.metadata?.column_names, [
        {
            header: "عملیات",
            accessorKey: "actions",
            Cell: (row: any) => {

                const val = row.value;

                return (
                    <span className="flex items-center justify-center gap-2 flex-row-reverse">
                        <div className="cursor-pointer" onClick={() => deleteRow(row.row.original.exercise_id)}>
                            <FiTrash2 className="text-xl text-red-500 relative" />
                        </div>
                        <div className="cursor-pointer" >
                            <Dialog>
                                <DialogTrigger className="relative top-1">
                                    <MdModeEditOutline className="text-xl text-blue-900" />
                                </DialogTrigger>
                                <DialogContent className="max-w-xs shadow-2xl border-2 top-80">
                                    <ExercicesUpdateForm row={row.row.original} />
                                </DialogContent>
                            </Dialog>
                        </div>
                    </span>
                );
            },
        },
        {
            header: "تا سررسید",
            accessorKey: "days_to_maturity",
            Cell: (row: any) => {
                const val = row.value;
                return (
                    val < 0 ? 'منقضی شده' : val
                );
            },
        },
    ], data?.metadata.column_annotate)


    return (
        <>
            <div className="w-full bg-blue-200 p-2 mt-4 rounded-t-sm">
                <span className='text-sm'>
                    اعمال‌ها
                </span>

            </div>
            <div className="postions__table">
                {
                    data && <DataTable search={false} columns={columns} data={data?.data} />
                }
            </div>
        </>
    )
}

export default Exercises