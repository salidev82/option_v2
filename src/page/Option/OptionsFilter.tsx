// @ts-ignore
// @ts-nocheck

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useDispatch, useSelector } from "react-redux";
import { updateOptionsFilter } from "@/store/reducers/OptionFilterSlice";

import { CaretSortIcon, CheckIcon } from "@radix-ui/react-icons";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { englishToPersianTranslate } from "@/helper/functions";

const OptionsFilter = () => {
  const isAutoUpdate = useSelector((state: any) => state.config.isAutoUpdate);

  const handleCheckboxChange = () => {
    dispatch({ type: "TOGGLE_CHECKBOX" });
  };

  // Retrieve optionsFilter data from Redux store
  const inputValues = useSelector((state: any) => state.optionsFilter);

  // Get the Redux dispatch function
  const dispatch = useDispatch();

  // Function to handle changes in the Select elements
  const handleSelectChange = (field: any, value: any) => {
    dispatch(updateOptionsFilter({ [field]: value }));
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
      setTimer(
        setTimeout(() => {
          callback(...args);
        }, delay)
      );
    };

    return debouncedCallback;
  };

  const debouncedHandleSelectChange = useDebounce(
    (field: any, value: any) => {
      handleSelectChange(field, value);
    },
    100 // Adjust the delay (in milliseconds) as per your requirement
  );

  const tseAssets: any = JSON.parse(localStorage.getItem("data"))?.map(
    (item) => {
      return {
        value: item.ua_tse_code,
        label: item.ua_ticker,
      };
    }
  );

  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");

  const extse =
    tseAssets && tseAssets?.find((el) => el.value == inputValues.ua_tse_code);

  const [translatedValue, setTranslatedValue] = useState("");

  const handleInputChange = (e) => {
    const inputValue = e;
    let translatedText = "";

    for (let i = 0; i < inputValue.length; i++) {
      const char = inputValue[i];
      const translatedChar = englishToPersianTranslate(char);
      translatedText += translatedChar || char; // Keep original if not found in mapping
    }

    setTranslatedValue(translatedText);
  };


  return (
    <div className="flex items-center border-2 p-2 justify-between">
      <div className="flex gap-3 rounded-sm  ">
        <div className="flex flex-col">
          <div className="flex items-center justify-between">
            <span className="text-xs mx-1 py-1">دارایی پایه</span>
            {extse?.value ? (
              <span
                className="text-xs text-blue-700 cursor-pointer"
                onClick={() => {
                  setValue("0");
                  debouncedHandleSelectChange("ua_tse_code", "0");
                }}
              >
                نمایش همه
              </span>
            ) : (
              ""
            )}
          </div>

          {tseAssets && (
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={open}
                  className="w-[150px] justify-between"
                >
                  {extse ? extse?.label : "همه موارد"}
                  <CaretSortIcon className="-ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[200px] p-0">
                <Command>
                  <CommandInput
                    placeholder="جستجو"
                    value={translatedValue}
                    onValueChange={handleInputChange}
                  />
                  <CommandEmpty>چیزی پیدا نشد</CommandEmpty>
                  <div className="w-full bg-gray-50 h-40 overscroll-contain">
                    <div className="h-full overflow-y-scroll">
                      <CommandGroup>
                        {tseAssets.map((tseAsset) => {
                          return (
                            <CommandItem
                              key={tseAsset.value}
                              onSelect={(currentValue) => {
                                debouncedHandleSelectChange(
                                  "ua_tse_code",
                                  tseAsset.value
                                );
                                setValue(
                                  currentValue === value ? "" : currentValue
                                );
                                setOpen(false);
                              }}
                            >
                              <CheckIcon
                                className={cn(
                                  "mr-2 h-4 w-4",
                                  value === tseAsset.value
                                    ? "opacity-100"
                                    : "opacity-0"
                                )}
                              />
                              {tseAsset.label}
                            </CommandItem>
                          );
                        })}
                      </CommandGroup>
                    </div>
                  </div>
                </Command>
              </PopoverContent>
            </Popover>
          )}
        </div>
        <div>
          <span className="text-xs mx-1 py-2">حداقل موقعیت باز</span>

          <Input
            className="h-9 w-28"
            defaultValue={0}
            onChange={(e) =>
              debouncedHandleSelectChange("min_open_position", e.target.value)
            }
            defaultValue={inputValues.min_open_position}
          />
        </div>
        <div>
          <span className="text-xs mx-1 py-2">حداکثر سررسید</span>

          <Input
            className="h-9 w-28 "
            onChange={(e) =>
              debouncedHandleSelectChange(
                "maximum_days_to_maturity",
                e.target.value
              )
            }
            defaultValue={inputValues.maximum_days_to_maturity}
          />
        </div>
        <div>
          <span className="text-xs mx-1 py-2">نوع قرارداد</span>

          <Select
            dir="rtl"
            defaultValue={inputValues.option_type}
            onValueChange={(value) =>
              debouncedHandleSelectChange("option_type", value)
            } // Use debouncedHandleSelectChange
          >
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="call">اختیار خرید</SelectItem>
              </SelectGroup>
              <SelectGroup>
                <SelectItem value="put">اختیار فروش</SelectItem>
              </SelectGroup>
              <SelectGroup>
                <SelectItem value="both">هر دو</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="flex gap-2 mx-2">
        <input
          type="checkbox"
          defaultChecked={isAutoUpdate}
          onChange={handleCheckboxChange}
        />
        <label className="text-xs">بروزرسانی خودکار</label>
      </div>
    </div>
  );
};

export default OptionsFilter;
