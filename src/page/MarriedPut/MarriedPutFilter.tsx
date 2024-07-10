//@ts-nocheck

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

import { CaretSortIcon, CheckIcon, FontItalicIcon } from "@radix-ui/react-icons"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
} from "@/components/ui/command"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { updateCoveredFilter } from '@/store/reducers/CoveredFilterSlice';
import { updateArbitrageFilter } from '@/store/reducers/ArbitrageFilter.Slice';
import { Toggle } from "@/components/ui/toggle"
import { updateMarriedPutFilter } from '@/store/reducers/MarriedPutFilterSlice';

type Props = {}

const MarriedPutFilter = (props: Props) => {
    const isAutoUpdate = useSelector((state: any) => state.config.isAutoUpdate);

    const handleCheckboxChange = () => {
        dispatch({ type: 'TOGGLE_CHECKBOX' });
    };

    // Retrieve optionsFilter data from Redux store
    const inputValues = useSelector((state: any) => state.MarriedPutFilterSlice);



    // Get the Redux dispatch function
    const dispatch = useDispatch();

    // Function to handle changes in the Select elements
    const handleSelectChange = (field: any, value: any) => {
        dispatch(updateMarriedPutFilter({ [field]: value }));
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
        100 // Adjust the delay (in milliseconds) as per your requirement
    );


    const [open, setOpen] = useState(false)
    const [value, setValue] = useState("")


    return (
        <div>
            <div>
                <div className='flex items-center border-2 p-2 justify-between'>

                    <div className="flex gap-3 rounded-sm items-end">
                        <div>
                            <span className='text-xs mx-1 py-2'>خرید اختیار بر اساس</span>

                            <Select
                                dir="rtl"
                                defaultValue={inputValues.buy_option_price_by}
                                onValueChange={(value) => debouncedHandleSelectChange('buy_option_price_by', value)} // Use debouncedHandleSelectChange
                            >
                                <SelectTrigger className="w-[200px]">
                                    <SelectValue
                                    />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        <SelectItem value="bid_price_1">بهترین مظنه خرید </SelectItem>
                                    </SelectGroup>
                                    <SelectGroup>
                                        <SelectItem value="ask_price_1">بهترین مظنه فروش </SelectItem>
                                    </SelectGroup>
                                    <SelectGroup>
                                        <SelectItem value="last_price">آخرین قیمت </SelectItem>
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </div>
                        <div>
                            <span className='text-xs mx-1 py-2'>معامله دارایی پایه بر اساس</span>

                            <Select dir="rtl"
                                defaultValue={inputValues.ua_trade_price_by}
                                onValueChange={(value) => debouncedHandleSelectChange('ua_trade_price_by', value)} // Use debouncedHandleSelectChange
                            >
                                <SelectTrigger className="w-[230px]">
                                    <SelectValue
                                    />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        <SelectItem value="last_price">آخرین قیمت</SelectItem>
                                    </SelectGroup>
                                    <SelectGroup>
                                        <SelectItem value="bid_price_1">بهترین مظنه خرید</SelectItem>
                                    </SelectGroup>
                                    <SelectGroup>
                                        <SelectItem value="ask_price_1">بهترین مظنه فروش</SelectItem>
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </div>

                        <div>
                            <span className='text-xs mx-1 py-2'>
                                حداقل موقعیت  باز
                            </span>

                            <Input
                                className="h-9"
                                onChange={(e) => debouncedHandleSelectChange('min_open_position', e.target.value)}
                                defaultValue={inputValues.min_open_position}
                            />
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
            </div>
        </div>
    )
}

export default MarriedPutFilter