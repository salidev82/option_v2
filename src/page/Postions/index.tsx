import axios from "axios";
import React, { useEffect, useState } from "react";
import { useQuery } from "react-query";
import { DataTable } from "@/components/shared/DataTable";
import { generateColumnsArray } from "../../helper/functions";
import PostionsForm from "./PostionsForm";
import { AiOutlineEye } from "react-icons/ai";
import { Input } from '@/components/ui/input'

import { FiTrash2 } from "react-icons/fi";
import { FiEdit2 } from "react-icons/fi";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { CaretSortIcon, CheckIcon } from "@radix-ui/react-icons";
import { cn } from "@/lib/utils";
import { toast } from "react-toastify";
import MainPostion from "./view/MainPostion";
import { Link } from "react-router-dom";
import PostionUpdateForm from "./PostionUpdateForm";
import moment from "jalali-moment";
import InfinateDataTable from "../../components/shared/InfinateDataTable";
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

import { Button } from "@/components/ui/button";
import { englishToPersianTranslate } from "@/helper/functions";
import { useDispatch, useSelector } from "react-redux";
import { updateArbitrageFilter } from "../../store/reducers/PositionsFilterSlice";


type Props = {};

const Postions = (props: Props) => {

  const store = useSelector((state) => state.PositionsFilterSlice)


  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(store.ua_isin);
  const [label, setLabel] = useState(store.label);
  const [translatedValue, setTranslatedValue] = useState("");
  const [startiges, setStartiges] = useState([]);
  const [Maturit, setMaturities] = useState([]);

  const [maturit, setMaturit] = useState(null);
  const [stratgie, setStartgie] = useState(store.strategy_id);
  const [status, setStatus] = useState(store.status);
  const [maturityDays, setMaturityDays] = useState(+store.maximum_days_to_maturity);



  const [skip, setSkip] = useState(0)
  const [limit, setLimit] = useState(30)
  const [displayData, setDisplayData] = useState([])
  const [loader, setLoader] = useState("در حال بارگذاری اطلاعات")

  const dispatch = useDispatch()


  const getData = async () => {


    const response = await axios.get(`position/list`, {

      params: {
        ua_isin: store.ua_isin,
        strategy_id: store.strategy_id,
        status: store.status,
        maximum_days_to_maturity: +store.maximum_days_to_maturity,
        skip: skip,
        limit: 30
      }

    })


    if (response.data.data.length === 0) {
      setLoader('')
    }
    setDisplayData((prevState) => [...prevState, ...response.data.data]);
    return response.data;
  };

  const { data, isFetched, isError, refetch } = useQuery("postions", getData);

  useEffect(() => {

    async function getData() {
      let response = await axios.get(`position/strategy/list`);
      return setStartiges(response.data);
    }

    getData();
    refetch()
  }, [skip])

  const deleteRow = (id) => {
    if (window.confirm("سطر مورد نظر حذف شود؟")) {
      axios
        .delete(`position/${id.row.original.position_id}`)
        .then((res) => {
          if (res?.status === 200) {
            toast.success("موقعیت  مورد نظر با موفقیت حذف شد", {
              style: {
                fontSize: 13,
              },
            });
            refetch();
            window.location.reload()

          }
        })
        .catch((e) => {
          toast.error(e.response.data.detail, {
            style: {
              fontSize: 12,
            },
          });
        });
    }
  };

  function compareNumericString(rowA, rowB, id, desc) {
    let a = Number.parseFloat(rowA.values[id]);
    let b = Number.parseFloat(rowB.values[id]);
    if (Number.isNaN(a)) {
      // Blanks and non-numeric strings to bottom
      a = desc ? Number.NEGATIVE_INFINITY : Number.POSITIVE_INFINITY;
    }
    if (Number.isNaN(b)) {
      b = desc ? Number.NEGATIVE_INFINITY : Number.POSITIVE_INFINITY;
    }
    if (a > b) return 1;
    if (a < b) return -1;
    return 0;
  }

  const columns =
    data &&
    generateColumnsArray(
      data?.metadata?.column_names,
      [
        {
          header: "عملیات",
          accessorKey: "actions",
          Cell: (row: any) => {
            const val = row.value;
            return (
              <span className="flex items-center justify-center gap-2 flex-row-reverse">
                <div className="cursor-pointer">
                  <Link to={`/postions/${row.row.original.position_id}`}>
                    <AiOutlineEye className="text-xl text-blue-500 relative" />
                  </Link>
                </div>
                <div className="cursor-pointer" onClick={() => deleteRow(row)}>
                  <FiTrash2 className="text-xl text-red-500" />
                </div>
                <div className="cursor-pointer">
                  <Dialog>
                    <DialogTrigger>
                      <FiEdit2 className="text-xl top-1 relative text-gray-600" />
                    </DialogTrigger>
                    <DialogContent className="max-w-sm shadow-2xl border-2">
                      <PostionUpdateForm row={row.row.original} />
                    </DialogContent>
                  </Dialog>
                </div>
              </span>
            );
          },
        },
        {
          header: "تاریخ ایجاد",
          accessorKey: "created_at",
          Cell: (row: any) => {
            const val = row.value;
            return (
              <span className="flex items-center justify-center gap-2 flex-row-reverse">
                {moment(val).locale("fa").format("YY-MM-DD")}
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
      ],
      data?.metadata?.column_annotate
    );



  const [formdata, setFormData] = useState({
    ua_isin: null,
    strategy_id: null,
    status: "O",
    note: "",
  });

  const handleFormData = (data) => {
    setFormData(data);
    axios.post(`position`, { ...data }).then((res) => {
      refetch();
    });
  };

  const fetchMoreData = () => {
    setTimeout(() => {
      setSkip((prevState) => prevState + 30)

    }, 1500);
  };

  const handleMaturity = async (code) => {
    let response = await axios.get(`options/maturity_dates?ua_isin=${code}`);
    setMaturities(response.data);
  };


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

  const tseAssets: any = JSON.parse(localStorage.getItem("data"))?.map(
    (item) => {
      return {
        value: item.ua_isin,
        label: item.ua_ticker,
      };
    }
  );

  const handleFilter = async () => {

    setSkip(0)

    dispatch(updateArbitrageFilter({
      ua_isin: value,
      strategy_id: stratgie,
      status: status,
      maximum_days_to_maturity: maturityDays,
      label: label
    }))


    const response = await axios.get(`position/list`, {
      params: {
        ua_isin: value,
        strategy_id: stratgie,
        status: status,
        maximum_days_to_maturity: maturityDays,
      }
    })
    if (response.data) {
      setDisplayData(response.data.data)
    }
  }


  return (
    <div className="">
      {isError && "error getting Data"}
      {data && (
        <div className="postions__table">
          <div className="flex gap-12 w-full">
            <PostionsForm formData={formdata} handleFormData={handleFormData} />
            <div className="w-full mt-3">
              <div className="bg-gray-100 p-2 flex gap-4">
                <div className="flex flex-col mt-1">
                  <span className="block text-xs pb-1">دارایی پایه</span>
                  {tseAssets && (
                    <Popover open={open} onOpenChange={setOpen}>

                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          role="combobox"
                          aria-expanded={open}
                          className="w-[150px] justify-between"
                        >
                          {value !== null ? label : 'همه'}
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
                                <CommandItem
                                  key={'all'}
                                  onSelect={(currentValue) => {
                                    setValue(null)
                                    setOpen(false)
                                  }}
                                >
                                  <CheckIcon
                                    className={cn(
                                      "mr-2 h-4 w-4",
                                      value === null
                                        ? "opacity-100"
                                        : "opacity-0"
                                    )}
                                  />
                                  همه
                                </CommandItem>
                                {tseAssets.map((tseAsset) => {
                                  return (
                                    <CommandItem
                                      key={tseAsset.value}
                                      onSelect={(currentValue) => {
                                        setMaturit(null);
                                        handleMaturity(tseAsset.value);
                                        setValue(tseAsset.value);
                                        setLabel(tseAsset.label);
                                        localStorage.setItem('teseAsset', tseAsset.value)
                                        localStorage.setItem('tseAssetLabel', tseAsset.label)
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
                  <span className="text-xs mx-1 py-2">استراتژی*</span>
                  <Select
                    defaultValue={+stratgie}
                    onValueChange={(currentValue) => {
                      localStorage.setItem('stratgie', currentValue)
                      setStartgie(currentValue)
                    }}
                    dir="rtl"
                  >
                    <SelectTrigger className="w-[200px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>

                      <SelectGroup>
                        <SelectItem value={null}>
                          همه
                        </SelectItem>
                        {startiges.map((item) => {
                          return (
                            <SelectItem value={item.strategy_id}>
                              {item.persian_name}
                            </SelectItem>
                          );
                        })}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <div>
                    <span className="text-xs mx-1 py-2 ">وضعیت</span>
                    <Select
                      dir="rtl"
                      className
                      onValueChange={(currentValue) => {
                        localStorage.setItem('status', currentValue)
                        setStatus(currentValue)
                      }}
                      defaultValue={status}
                    >
                      <SelectTrigger className="w-[150px]">
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

                <div>
                  <div className="flex items-center gap-4">
                    <div className="flex flex-col">
                      <span className="text-xs mx-1 py-1">حداکثر فاصله تا سررسید</span>
                      <Input
                        defaultValue={maturityDays}
                        onChange={(e) => {
                          setMaturityDays(e.target.value)
                          localStorage.setItem('MaturityDays', e.target.value)
                        }} className="w-[150px] h-[38px]" type='number' min={-730} max={730} />
                    </div>
                    <Button onClick={() => handleFilter()} className="block mt-5">
                      فیلتر
                    </Button>
                  </div>
                </div>
              </div>

              <InfinateDataTable
                loader={displayData.length < 30 ? '' : loader}
                columns={columns}
                data={displayData}
                update={fetchMoreData}
              />

            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Postions;
