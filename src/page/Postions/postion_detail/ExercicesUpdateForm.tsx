import axios from 'axios';
import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { toast } from 'react-toastify';

type Props = {
    row?: any;
};

// Function to format numbers with thousand separators
const formatNumberWithSeparator = (value: number) => {
    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

const ExercicesUpdateForm = (props: Props) => {
    const { handleSubmit, control, formState: { errors } } = useForm();
    const [data, setData] = useState<any>(null);
    const default_data = props.row;

    const onSubmit = async (data) => {
        // Remove thousand separators before sending data to the server
        const datas = data && {
            ...data,
            exercised_volume: +(data?.exercised_volume).toString().replace(/,/g, ''),
            unexercised_volume: typeof data.unexercised_volume === 'string' ? +data.unexercised_volume?.replace(/,/g, '') : data.unexercised_volume,
            net_value: typeof data.net_value === 'string' ? +data.net_value?.replace(/,/g, '') : data.net_value,
            received_default_value: typeof data.received_default_value === 'string' ? +data.received_default_value?.replace(/,/g, '') : data.received_default_value,
        };

        let response = await axios.patch(`position/exercise/${props.row.exercise_id}`, datas).then((res) => {
            if (res.status == 200) window.location.reload();
        });
    };

    return (
        <div className='mt-8'>
            <form action='' onSubmit={handleSubmit(onSubmit)}>
                <div className='mb-4'>
                    <label htmlFor='exercised_volume' className='block text-gray-700 text-sm font-bold mb-2'>
                        تعداد برگه اعمال شده
                    </label>
                    <Controller
                        name='exercised_volume'
                        control={control}
                        defaultValue={default_data.exercised_volume}
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
                    {errors.exercised_volume && <p className='text-red-500 text-xs italic'>این فیلد اجباری است</p>}
                </div>

                <div className='mb-4'>
                    <label htmlFor='unexercised_volume' className='block text-gray-700 text-sm font-bold mb-2'>
                        تعداد برگه اعمال نشده
                    </label>
                    <Controller
                        name='unexercised_volume'
                        control={control}
                        defaultValue={default_data.unexercised_volume}
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
                    {errors.unexercised_volume && <p className='text-red-500 text-xs italic'>این فیلد اجباری است</p>}
                </div>

                <div className='mb-4'>
                    <label htmlFor='net_value' className='block text-gray-700 text-sm font-bold mb-2'>
                        ارزش خالص اعمال‌شده
                    </label>
                    <Controller
                        name='net_value'
                        control={control}
                        defaultValue={default_data.net_value}
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
                    {errors.net_value && <p className='text-red-500 text-xs italic'>این فیلد اجباری است</p>}
                </div>

                <div className='mb-4'>
                    <label htmlFor='received_default_value' className='block text-gray-700 text-sm font-bold mb-2'>
                        ارزش خالص دریافتی از نکول
                    </label>
                    <Controller
                        name='received_default_value'
                        control={control}
                        defaultValue={default_data.received_default_value}
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
                    {errors.received_default_value && <p className='text-red-500 text-xs italic'>این فیلد اجباری است</p>}
                </div>

                <button className='w-full text-sm rounded-md bg-blue-500 py-2 text-white' type='submit'>
                    بروزرسانی
                </button>
            </form>
        </div>
    );
};

export default ExercicesUpdateForm;
