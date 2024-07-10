import React, { useEffect, useState } from "react";
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

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { CaretSortIcon, CheckIcon } from "@radix-ui/react-icons";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { englishToPersianTranslate } from "@/helper/functions";
import axios from "axios";
import { toast } from "react-toastify";

type Props = {
  handleFormData: (data: any) => void;
  formData: any;
};

const PostionsForm = (props: Props) => {
  const tseAssets: any = JSON.parse(localStorage.getItem("data"))?.map(
    (item) => {
      return {
        value: item.ua_isin,
        label: item.ua_ticker,
      };
    }
  );

  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");
  const [label, setLabel] = useState("");
  const [translatedValue, setTranslatedValue] = useState("");
  const [startiges, setStartiges] = useState([]);
  const [Maturit, setMaturities] = useState([]);

  const [maturit, setMaturit] = useState(null);
  const [stratgie, setStartgie] = useState(null);
  const [status, setStatus] = useState("O");
  const [note, setNote] = useState('');

  useEffect(() => {
    async function getData() {
      let response = await axios.get(`position/strategy/list`);
      return setStartiges(response.data);
    }

    getData();
  }, []);

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

  const handleMaturity = async (code) => {
    let response = await axios.get(`options/maturity_dates?ua_isin=${code}`);
    setMaturities(response.data);
  };

  const submitForm = () => {
    if (stratgie && label) {
      const newData = {
        ...props.formData,
        ua_isin: value,
        strategy_id: stratgie,
        status: status,
        note: note,
      };
      props.handleFormData(newData);
    } else {
      toast.error("لطفا تمامی فیلد های ستاره دار را وارد کنید", {
        style: {
          fontSize: "13px",
        },
      });
    }
    window.location.reload()
  };

  return (
    <div>
      <div className="border-4 border-gray-200 sticky w-auto mt-2 mr-8 p-3 rounded-sm">
        <h1 className="mb-4 border-b-2 pb-2 border-black">فرم ایجاد موقعیت</h1>
        <div className="flex items-center justify-between">
          <div className="flex flex-col justify-start gap-4">
            <div className="flex flex-col">
              <div className="flex items-center justify-between">
                <span className="text-xs mx-1 py-1">دارایی پایه*</span>
              </div>

              {tseAssets && (
                <Popover open={open} onOpenChange={setOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={open}
                      className="w-[300px] justify-between"
                    >
                      {label ? label : "انتخاب کنید"}
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
                          <CommandGroup
                          >
                            {tseAssets.map((tseAsset) => {
                              return (
                                <CommandItem
                                  key={tseAsset.value}
                                  onSelect={(currentValue) => {
                                    setMaturit(null);
                                    handleMaturity(tseAsset.value);
                                    setValue(tseAsset.value);
                                    setLabel(tseAsset.label);
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
            <div className="flex flex-col">
              <div>
                <span className="text-xs mx-1 py-2">استراتژی*</span>
                <Select
                  onValueChange={(currentValue) => setStartgie(currentValue)}
                  dir="rtl"
                >
                  <SelectTrigger className="w-[300px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {startiges.map((item) => {
                      return (
                        <SelectGroup>
                          <SelectItem value={item.strategy_id}>
                            {item.persian_name}
                          </SelectItem>
                        </SelectGroup>
                      );
                    })}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex flex-col">
              <div>
                <span className="text-xs mx-1 py-2 ">وضعیت</span>

                <Select
                  dir="rtl"
                  className
                  onValueChange={(currentValue) => setStatus(currentValue)}
                  defaultValue={"O"}
                >
                  <SelectTrigger className="w-[300px]">
                    <SelectValue value="O" placeholder="باز" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="O">باز</SelectItem>
                    </SelectGroup>
                    <SelectGroup>
                      <SelectItem value="E">اعمال شده</SelectItem>
                    </SelectGroup>
                    <SelectGroup>
                      <SelectItem value="C">بسته شده</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex flex-col relative -top-1">
              <span className="text-xs mx-1 py-2 relative top-1">یادداشت</span>
              <textarea
                className="border py-1 p-2 text-sm"
                name=""
                onChange={(e) => setNote(e.target.value)}
                id=""
                rows="8"
                cols="20"
              ></textarea>
            </div>
            <Button className="mt-5" onClick={() => submitForm()}>
              اضافه کردن موقعیت
            </Button>
          </div>

        </div>
      </div>
    </div>
  );


};

export default PostionsForm;
