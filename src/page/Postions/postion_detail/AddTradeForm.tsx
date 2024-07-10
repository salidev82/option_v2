import React, { useEffect, useState } from "react";
import axios from "axios";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Controller, useForm } from "react-hook-form";
import { ScrollArea } from "@/components/ui/scroll-area";

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

type Props = {
  postion_id?: number;
};

// Function to format numbers with thousand separators
const formatNumberWithSeparator = (value: string) => {
  return value && value?.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

const AddTradeForm = (props: Props) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    getValues,
    control,
  } = useForm();

  const [openIsin, setIsInOpen] = useState(false);
  const [openAction, setOpenAction] = useState(false);
  const [isIn, setIsIn] = useState<string | null>(null);
  const [actionId, setActionId] = useState(null);
  const [actionsList, setActionList] = useState([]);
  const [isInList, setIsInList] = useState([]);
  const [action, setAction] = useState<string | null>(null);

  const onSubmit = async (data) => {
    const { price, volume, net_value } = data;

    const formData = {
      price: +price.replace(/,/g, ""),
      volume: +volume.replace(/,/g, ""),
      isin: isIn,
      position_id: props.postion_id,
      action_id: actionId ? actionId : action,
      net_value: net_value ? +net_value?.replace(/,/g, "") : 0,
    };

    let response = await axios
      .post(`/position/trade`, {
        ...formData,
      })
      .then((res) => {
        if (res.status == 200) window.location.reload();
      });
  };

  useEffect(() => {
    async function getActionId() {
      let response = await axios.get(
        `position/not_added_trade/${props.postion_id}`
      );
      return setActionId(response.data.action_id);
    }

    getActionId();
    
  }, []);

  useEffect(() => {
    async function getActionList() {
      let response = await axios.get(`position/action/list`);
      return setActionList(response.data);
    }

    getActionList();
  }, []);

  useEffect(() => {
    async function getActionList() {
      let response = await axios.get(
        `position/isin_list/${props.postion_id}?action_id=${actionId || action}`
      );
      if (response.data?.length <= 1) {
        setIsIn(response.data[0].isin);
      }
      return setIsInList(response.data);
    }

    getActionList();
  }, [action, actionId]);

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="flex flex-col">
          <span className="text-sm mt-2 relative top-1">عمل</span>
          <Popover open={openAction} onOpenChange={setOpenAction}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={openAction}
                className="w-full mt-2 justify-between text-xs"
              >
                {action != null
                  ? actionsList.find((act) => act.action_id === action)
                    ?.persian_name
                  : actionsList.find((el) => el.action_id === actionId)
                    ?.persian_name}
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            {actionId == null && (
              <PopoverContent className="w-[200px] p-0">
                <div className="flex flex-col">
                  {actionsList.map((act) => (
                    <Button
                      key={act.action_id}
                      className={cn(
                        "text-xs w-full text-left bg-transparent text-black",
                        action === act.action_id && "bg-transparent text-black"
                      )}
                      onClick={() => {
                        setAction(act.action_id);
                        setOpenAction(false);
                      }}
                    >
                      {act.persian_name}
                    </Button>
                  ))}
                </div>
              </PopoverContent>
            )}
          </Popover>
        </div>
        <div className="flex flex-col">
          <span className="text-sm mt-2 relative top-1">نماد</span>
          <Popover open={openIsin} onOpenChange={setIsInOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={openIsin}
                className="w-full mt-2 justify-between text-xs "
              >
                {isIn
                  ? isInList.find((is) => is.isin === isIn)?.ticker
                  : "نمادی را انتخاب کنید"}
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[200px] scroll-smooth p-0">
              <Command 
              filter={(value, search) => {
                if ((value).startsWith(search)) return 1
                return 0
              }}
              >
                <CommandInput placeholder="جستجو" className="h-9" />
                <CommandEmpty >نمادی پیدا نشد.</CommandEmpty>
                <CommandGroup className="h-[200px] overflow-scroll overflow-x-hidden">
                  {isInList.map((is) => (
                    <CommandItem
                      key={is.ticker}
                      value={is.ticker}
                      className={cn(
                        "text-xs w-full block bg-transparent cursor-pointer text-black p-2 text-center",
                        isIn === is.isin && ""
                      )}
                      onSelect={(currentValue) => {
                        setIsIn(is.isin);
                        setIsInOpen(false);
                      }}
                    >
                      {is.ticker}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </Command>
            </PopoverContent>
          </Popover>
        </div>
        <div className="flex flex-col">
          <span className="text-sm my-2">قیمت</span>
          <Controller
            name="price"
            control={control}
            rules={{ required: false, valueAsNumber: true }}
            render={({ field }) => (
              <input
                {...field}
                value={formatNumberWithSeparator(field.value)}
                onChange={(e) => {
                  e.target.value = formatNumberWithSeparator(
                    e.target.value.replace(/,/g, "")
                  );
                  field.onChange(e);
                }}
                type="text"
                className="w-full py-2 px-3 border rounded leading-tight focus:outline-none focus:shadow-outline"
              />
            )}
          />
        </div>
        <div className="flex flex-col">
          <span className="text-sm my-2">تعداد برگه</span>

          <Controller
            name="volume"
            control={control}
            rules={{ required: true, valueAsNumber: true }}
            render={({ field }) => (
              <input
                {...field}
                value={formatNumberWithSeparator(field.value)}
                onChange={(e) => {
                  e.target.value = formatNumberWithSeparator(
                    e.target.value.replace(/,/g, "")
                  );
                  field.onChange(e);
                }}
                type="text"
                className="w-full py-2 px-3 border rounded leading-tight focus:outline-none focus:shadow-outline"
              />
            )}
          />
        </div>

        <div className="flex flex-col">
          <span className="text-sm my-2">ارزش خالص</span>

          <Controller
            name="net_value"
            control={control}
            defaultValue={0}
            rules={{ required: true, valueAsNumber: true }}
            render={({ field }) => (
              <input
                {...field}
                value={formatNumberWithSeparator(field.value)}
                onChange={(e) => {
                  e.target.value = formatNumberWithSeparator(
                    e?.target?.value?.replace(/,/g, "")
                  );
                  field.onChange(e);
                }}
                defaultValue={0}
                type="text"
                className="w-full py-2 px-3 border rounded leading-tight focus:outline-none focus:shadow-outline"
              />
            )}
          />
        </div>

        <div className="w-full">
          <Button type="submit" className="w-full mt-8">
            تایید
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AddTradeForm;
