import axios from 'axios';
import React from 'react'
import { useForm, Controller } from 'react-hook-form';
import { toast } from 'react-toastify';



type Props = {
    row: any
    data: any
}


const PostionUpdateForm = (props: Props) => {
    const { status, note, position_id } = props.row



    const { handleSubmit, control, register, setValue } = useForm();

    const onSubmit = async (data) => {
        const response = await axios.patch(`position/${position_id}`, {
            ...data
        }).then((res) => {
            if (res.status === 200) {
                window.location.reload()
                toast.success(
                    'بروزرسانی انجام شد'
                )
            }

        }).catch((err) => console.log(err))

    };

    return (
        <div>
            <form onSubmit={handleSubmit(onSubmit)} className="max-w-md mx-auto mt-8">

                <div className="mb-4">
                    <label htmlFor="selectOption" className="block text-sm font-medium text-gray-600">
                        وضعیت
                    </label>
                    <select
                        defaultValue={status}
                        id="selectOption"
                        {...register('status', { required: 'این فیلد ضروری است' })}
                        className="mt-1 p-2 w-full border rounded-md"
                    >
                        <option value="">انتخاب...</option>
                        <option value="O">باز</option>
                        <option value="E">اعمال شده</option>
                        <option value="C">بسته شده</option>
                    </select>
                </div>

                <div className="mb-4">
                    <label htmlFor="textarea" className="block text-sm font-medium text-gray-600">
                        یادداشت
                    </label>
                    <textarea
                        defaultValue={note}
                        id="textarea"
                        {...register('note',)}
                        className="mt-1 p-2 w-full border rounded-md"
                    ></textarea>
                </div>

                <button type="submit" className="bg-blue-500 text-white text-sm w-full p-2 rounded-md">
                    بروزرسانی
                </button>
            </form>
        </div>
    )
}

export default PostionUpdateForm