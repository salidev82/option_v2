// @ts-nocheck
import { CaretSortIcon, CheckIcon } from "@radix-ui/react-icons"

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

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
    SelectGroup
} from "@/components/ui/select"

import { Input } from "@/components/ui/input"


import { updateCoveredFilter } from '@/store/reducers/CoveredFilterSlice';
import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { conversionFilter } from "../../store/reducers/ConversionFilterSlice"

type Props = {}

const ConversionFilter = (props: Props) => {


    const [open, setOpen] = useState(false)
    const [value, setValue] = useState("")

    const isAutoUpdate = useSelector((state: any) => state.config.isAutoUpdate);

    const handleCheckboxChange = () => {
        dispatch({ type: 'TOGGLE_CHECKBOX' });
    };


    // Retrieve optionsFilter data from Redux store
    const inputValues = useSelector((state: any) => state.conversionFilterSlice);


    // Get the Redux dispatch function
    const dispatch = useDispatch();

    // Function to handle changes in the Select elements
    const handleSelectChange = (field: any, value: any) => {
        dispatch(conversionFilter({ [field]: value }));
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


    return (
        <div className='flex items-center border-2 p-2 justify-between'>

            <div className="flex gap-3 rounded-sm  ">

                <div>
                    <span className='text-xs mx-1 py-2'>فروش اختیار خرید بر اساس</span>

                    <Select dir="rtl"
                        defaultValue={inputValues.write_call_based_on}
                        onValueChange={(value) => debouncedHandleSelectChange('write_call_based_on', value)} // Use debouncedHandleSelectChange
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
                    <span className='text-xs mx-1 py-2'>خرید اختیار فروش بر اساس</span>

                    <Select dir="rtl"
                        defaultValue={inputValues.buy_put_based_on}
                        onValueChange={(value) => debouncedHandleSelectChange('buy_put_based_on', value)} // Use debouncedHandleSelectChange
                    >
                        <SelectTrigger className="w-[230px]">
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
                    <span className='text-xs mx-1 py-2'>
                        خرید سهم بر اساس
                    </span>

                    <Select dir="rtl"
                        defaultValue={inputValues.buy_stock_based_on}
                        onValueChange={(value) => debouncedHandleSelectChange('buy_stock_based_on', value)} // Use debouncedHandleSelectChange
                    >
                        <SelectTrigger className="w-[230px]">
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

            </div>
            <div className='flex gap-2 mx-2'>
                <input type="checkbox" defaultChecked={isAutoUpdate} onChange={handleCheckboxChange} />
                <label className='text-xs'>بروزرسانی خودکار</label>
            </div>
        </div >
    )
}

export default ConversionFilter