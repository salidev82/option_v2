import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { useDispatch, useSelector } from 'react-redux';

import { updateBullCallSpreadFilter } from '@/store/reducers/BullCallSpreadFilterSlice';

type Props = {}

const BullCallSpreadFilter = (props: any) => {


    const isAutoUpdate = useSelector((state: any) => state.config.isAutoUpdate);

    const handleCheckboxChange = () => {
        dispatch({ type: 'TOGGLE_CHECKBOX' });
    };

    // Retrieve optionsFilter data from Redux store
    const inputValues = useSelector((state: any) => state.BullCallSpreadFilterSlice);



    // Get the Redux dispatch function
    const dispatch = useDispatch();

    // Function to handle changes in the Select elements
    const handleSelectChange = (field: any, value: any) => {
        dispatch(updateBullCallSpreadFilter({ [field]: value }));
    };



    const useDebounce = (callback, delay) => {
        const [timer, setTimer] = useState(null);

        useEffect(() => {
            return () => {
                if (timer) clearTimeout(timer);
            };
        }, [timer]);

        const debouncedCallback = (...args) => {
            if (timer) clearTimeout(timer);
            setTimer(setTimeout(() => {
                callback(...args);
            }, delay));
        };

        return debouncedCallback;
    };

    const debouncedHandleSelectChange = useDebounce(
        (field: any, value: any) => {
            handleSelectChange(field, value);
        },
        400 // Adjust the delay (in milliseconds) as per your requirement
    );



    const [open, setOpen] = useState(false)
    const [value, setValue] = useState("")

    return (
        <div className='flex items-center border-2 p-2 justify-between'>

            <div className="flex gap-3 rounded-sm items-end  ">

                <div>
                    <span className='text-xs mx-1 py-2'>وضیعت قراردادها</span>

                    <Select dir="rtl"
                        defaultValue={inputValues.status}
                        onValueChange={(value) => debouncedHandleSelectChange('status', value)} // Use debouncedHandleSelectChange
                    >
                        <SelectTrigger className="w-[150px]">
                            <SelectValue
                            />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectItem value="OTM_ITM">تنها یکی در سود</SelectItem>
                            </SelectGroup>
                            <SelectGroup>
                                <SelectItem value="both_ITM">هر دو در سود</SelectItem>
                            </SelectGroup>
                            <SelectGroup>
                                <SelectItem value="both_OTM">هر دو در ضرر</SelectItem>
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                </div>

                <div>
                    <span className='text-xs mx-1 py-2'>خرید اختیار با</span>

                    <Select dir="rtl"
                        defaultValue={inputValues.buy_option_by}
                        onValueChange={(value) => debouncedHandleSelectChange('buy_option_by', value)} // Use debouncedHandleSelectChange
                    >
                        <SelectTrigger className="w-[200px]">
                            <SelectValue
                            />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectItem value="bid_price_1">بهترین مظنه خرید اختیار</SelectItem>
                            </SelectGroup>
                            <SelectGroup>
                                <SelectItem value="ask_price_1">بهترین مظنه فروش اختیار</SelectItem>
                            </SelectGroup>
                            <SelectGroup>
                                <SelectItem value="last_price">آخرین قیمت اختیار</SelectItem>
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                </div>
                <div>
                    <span className='text-xs mx-1 py-2'>فروش اختیار با</span>

                    <Select dir="rtl"
                        defaultValue={inputValues.sell_option_by}
                        onValueChange={(value) => debouncedHandleSelectChange('sell_option_by', value)} // Use debouncedHandleSelectChange
                    >
                        <SelectTrigger className="w-[200px]">
                            <SelectValue
                            />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectItem value="bid_price_1">بهترین مظنه خرید اختیار</SelectItem>
                            </SelectGroup>
                            <SelectGroup>
                                <SelectItem value="ask_price_1">بهترین مظنه فروش اختیار</SelectItem>
                            </SelectGroup>
                            <SelectGroup>
                                <SelectItem value="last_price">آخرین قیمت اختیار</SelectItem>
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                </div>



                <div>
                    <span className='text-xs mx-1 py-2'>
                        حداکثر سر‌ رسید
                    </span>

                    <Input
                        className="h-9"
                        onChange={(e) => debouncedHandleSelectChange('max_days_to_maturity', e.target.value)}
                        defaultValue={inputValues.max_days_to_maturity}
                    />
                </div>



            </div>
            <div className='flex gap-2 mx-2'>
                <input type="checkbox" defaultChecked={isAutoUpdate} onChange={handleCheckboxChange} />
                <label className='text-xs'>بروزرسانی خودکار</label>
            </div>
        </div >
    )
}

export default BullCallSpreadFilter