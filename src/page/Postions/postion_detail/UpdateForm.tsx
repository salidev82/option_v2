import axios from 'axios';
import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { toast } from 'react-toastify';

type Props = {
    postion_id?: number | undefined,
    row?: any | undefined,
}

const UpdateForm = (props: Props) => {

    const formatNumberWithSeparator = (value: string) => {
        return value?.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    };

    const { handleSubmit, control, formState: { errors } } = useForm();

    const default_data = props.row.row.original;

    const onSubmit = async (data) => {
        const { price, volume, net_value } = data;


        let response = await axios.patch(`position/trade/${props.postion_id}`, {
            price: +price.replace(/,/g, ''),
            volume: +volume.replace(/,/g, ''),
            net_value: net_value !== "" && net_value !== default_data.net_value ? +net_value.replace(/,/g, '') : 0
        }).then((res) => {
            if (res.status == 200) window.location.reload();
        })
    };

    const deleteRow = (id) => {
        if (window.confirm("سطر مورد نظر حذف شود؟")) {
            axios.delete(`position/${id.row.original.position_id}`).then((res) => {
                if (res?.status === 200) {
                    toast.success("سطر  مورد نظر با موفقیت حذف شد", {
                        style: {
                            fontSize: 13,
                        },
                    });
                }
            })
        }
    };

    return (
        <div className='mt-4'>
            <form onSubmit={handleSubmit(onSubmit)} className="max-w-md mx-auto p-4 bg-gray-100 shadow-md rounded-md">
                <div className="mb-4">
                    <label htmlFor="price" className="block text-gray-700 text-sm font-bold mb-2">قیمت </label>
                    <Controller
                        name='price'
                        control={control}
                        rules={{ required: true, valueAsNumber: true }}
                        defaultValue={formatNumberWithSeparator(default_data?.price?.toString())}
                        render={({ field }) => (
                            <input
                                {...field}
                                value={formatNumberWithSeparator(field.value)}
                                onChange={(e) => {
                                    e.target.value = formatNumberWithSeparator(e.target.value.replace(/,/g, ''));
                                    field.onChange(e);
                                }}
                                type='text'
                                className='w-full py-2 px-3 border rounded leading-tight focus:outline-none focus:shadow-outline'
                            />
                        )}
                    />
                    {errors.price && <p className="text-red-500 text-xs italic">این فیلد اجباری است</p>}
                </div>
                <div className="mb-4">
                    <label htmlFor="volume" className="block text-gray-700 text-sm font-bold mb-2">تعداد برگه</label>
                    <Controller
                        name='volume'
                        control={control}
                        rules={{ required: true, valueAsNumber: true }}
                        defaultValue={formatNumberWithSeparator(default_data?.volume?.toString())}
                        render={({ field }) => (
                            <input
                                {...field}
                                value={formatNumberWithSeparator(field.value)}
                                onChange={(e) => {
                                    e.target.value = formatNumberWithSeparator(e.target.value.replace(/,/g, ''));
                                    field.onChange(e);
                                }}
                                type='text'
                                className='w-full py-2 px-3 border rounded leading-tight focus:outline-none focus:shadow-outline'
                            />
                        )}
                    />
                    {errors.volume && <p className="text-red-500 text-xs italic">این فیلد اجباری است</p>}
                </div>
                <div className="mb-4">
                    <label htmlFor="net_value" className="block text-gray-700 text-sm font-bold mb-2">ارزش خالص</label>
                    <Controller
                        name='net_value'
                        control={control}
                        defaultValue={formatNumberWithSeparator(default_data?.net_value?.toString())}
                        rules={{ required: true, valueAsNumber: true }}
                        render={({ field }) => (
                            <input
                                {...field}
                                value={formatNumberWithSeparator(field.value)}
                                onChange={(e) => {
                                    e.target.value = formatNumberWithSeparator(e.target.value.replace(/,/g, ''));
                                    field.onChange(e);
                                }}
                                type='text'
                                className='w-full py-2 px-3 border rounded leading-tight focus:outline-none focus:shadow-outline'
                            />
                        )}
                    />
                </div>
                <input type="submit" value="به روز رسانی" className="cursor-pointer bg-blue-500 hover:bg-blue-700 text-white text-xs py-2 px-4 rounded focus:outline-none focus:shadow-outline" />
            </form>
        </div>
    );
};

export default UpdateForm;
