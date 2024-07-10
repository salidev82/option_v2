import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import DatePicker from "react-multi-date-picker";
import InputIcon from "react-multi-date-picker/components/input_icon";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import "react-multi-date-picker/styles/backgrounds/bg-dark.css";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Button } from "@/components/ui/button";
import axios from "axios";
import moment from "jalali-moment";
import { generateColumnsArray } from "../../../helper/functions";
import DataTable from "../../../components/shared/DataTable";
import { AiOutlineEye } from "react-icons/ai";
import { Link } from "react-router-dom";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"

import PostionReportsGrouped from "./PostionReportsGrouped";

type FormData = {
  FromDate: number;
  toDate: number;
  status: string;
};

const PostionReports = () => {
  const startYear = moment().startOf("jYear").unix();

  const currentDate = Math.floor(Date.now() / 1000); // Convert to seconds
  const [status, setStatus] = useState("O");
  const [url, setUrl] = useState('cc');
  const [data, setData] = useState(null);
  const [config, setConfig] = useState(null)
  const [formData, setFromData] = useState<any>(null)

  const oneMonthAgo = new Date();
  oneMonthAgo.setMonth(oneMonthAgo.getMonth());
  const oneMonthAgoUnix = Math.floor(oneMonthAgo.getTime() / 1000);

  const onSubmit = async (data: FormData) => {
    const { FromDate, toDate } = data;
    setFromData(data)
    let response = await axios
      .post(`${config[url].url}`, {
        start_date: moment(FromDate).format("YYYY-MM-DD"),
        end_date: moment(toDate).format("YYYY-MM-DD"),
        status,
      })
      .then((res) => {
        setData(res.data);
      });
  };

  const renderTicker = (value: any, tseCode: string) => {
    return (
      <div
        className="w-9/12 mx-auto flex items-center gap-4 justify-center text-center"
        dir="rtl"
      >
        <a
          target="_blank"
          href={`http://www.tsetmc.com/instInfo/${tseCode}`}
          className="w-8 h-8 cursor-pointer"
        >
          <img src="/tse.png" className="w-6 h-6 relative top-1 right-3" alt="" />
        </a>
        <span className="w-full text-right ">{value}</span>
      </div>
    );
  };

  const columns =
    data &&
    generateColumnsArray(data?.metadata?.column_names, [
      {
        header: "نماد",
        accessorKey: "ticker",
        Cell: (row: any) => {
          const val = row.value;
          return renderTicker(val, row.row.original.tse_code);
        },
        width: 220
      },
      {
        header: "عملیات",
        accessorKey: "actions",
        Cell: (row: any) => {
          const val = row.value;
          return (
            <div className="w-full flex items-center justify-center text-blue-800">
              <Link
                target="_blank"
                rel="noopener noreferrer"
                to={`/postions/${row.row.original.position_id}`}
              >
                <AiOutlineEye />
              </Link>
            </div>
          );
        },
      },
      {
        header: "تاریخ ایجاد",
        accessorKey: "created_at",
        Cell: (row: any) => {
          const val = row.value;
          return (
            moment(val).locale('fa').format('YYYY/MM/DD')
          );
        },
        sortType: (rowA, rowB, columnId) => {

          const dateA = new Date(rowA.original[columnId].replace('/', '-'));
          const dateB = new Date(rowB.original[columnId].replace('/', '-'));
          return dateA - dateB;

        },
      },
      {
        header: "سررسید",
        accessorKey: "jalali_maturity_date",
        Cell: (row: any) => {
          const val = row.value;
          return row.value
        },
        sortType: (rowA, rowB, columnId) => {
          const dateA = new Date(rowA.original[columnId].replace('/', '-'));
          const dateB = new Date(rowB.original[columnId].replace('/', '-'));

          return dateA - dateB;
        },
      },
      {
        header: "تاریخ آفست",
        accessorKey: "jalali_offset_date",
        Cell: (row: any) => {
          const val = row.value;
          return row.value
        },
        sortType: (rowA, rowB, columnId) => {
          const dateA = new Date(rowA.original[columnId].replace('/', '-'));
          const dateB = new Date(rowB.original[columnId].replace('/', '-'));

          return dateA - dateB;
        },
      },
      {
        header: "تاریخ بازدهی معادل سالانه",
        accessorKey: "annual_return_percent",
        Cell: (row: any) => {
          const val = row.value;
          return row.value.toLocaleString('en-US' , {maximumFractionDigits : 2}) + '%'
        },
      },
    ]);

  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    watch,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      // از اول معاملات
      FromDate: 1700644819 * 1000,
      toDate: currentDate * 1000,
    },
  });

  useEffect(() => {
    async function get_data() {
      let response = await axios.get('position/reports/').then((res) => {
        setConfig(res.data)
      })
    }

    get_data()
  }, [])

  const handleDownload = async () => {
    const { FromDate, toDate } = formData;

    try {
      const response = await axios.post(`position/reports/${url}/download`, {
        start_date: moment(FromDate).format("YYYY-MM-DD"),
        end_date: moment(toDate).format("YYYY-MM-DD"),
        status,
      }, {
        responseType: 'blob', // Set the response type to blob
      });

      // Create a Blob with BOM
      const bom = new Uint8Array([0xEF, 0xBB, 0xBF]); // UTF-8 BOM
      const blobWithBOM = new Blob([bom, response.data], { type: 'text/csv;charset=utf-8' });

      // Create a link element and set its attributes
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blobWithBOM);
      link.download = 'your_filename.csv';

      // Append the link to the document body
      document.body.appendChild(link);

      // Programmatically click the link to trigger the download
      link.click();

      // Remove the link from the document
      document.body.removeChild(link);
    } catch (error) {
      console.error('Error downloading file:', error);
      // Handle the error appropriately
    }
  };


  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="flex gap-4 justify-between bg-white shadow-lg p-3 mt-2 rounded border">

          <div className="flex">
            {
              config && <div className="flex">
                <span className="text-xs mx-1 py-2">استراتژی : </span>
                <Select
                  onValueChange={(value) => setUrl(value)}
                  dir="rtl"
                  defaultValue={url}
                >
                  <SelectTrigger className="w-40 h-8 border border-gray-400">
                    <SelectValue value={url} placeholder={config[url]?.name || "انتخاب"} />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.keys(config).map((strategy) => (
                      <SelectGroup key={strategy}>
                        <SelectItem value={strategy}>{config[strategy].name}</SelectItem>
                      </SelectGroup>
                    ))}
                  </SelectContent>
                </Select>
                {errors.status && (
                  <span className="text-red-500 text-xs">
                    {errors.status.message}
                  </span>
                )}
              </div>
            }
            <div className="flex items-center gap-2 mx-4">
              <div className="text-sm">از تاریخ: </div>
              <DatePicker
                render={<InputIcon />}
                {...register("FromDate", {
                  required: "تاریخ اجباری است",
                })}
                value={watch("FromDate")}
                onChange={(val: any) => setValue("FromDate", val.unix * 1000)}
                minDate="1395/1/1"
                maxDate={currentDate * 1000}
                calendar={persian}
                locale={persian_fa}
                calendarPosition="bottom-right"
                style={{
                  padding: ".8rem",
                  textAlign: "center",
                  width: "120px",
                  fontSize: "13px",
                }}
              />
              {errors.FromDate && (
                <span className="text-red-500 text-xs">
                  {errors.FromDate.message}
                </span>
              )}
            </div>
            <div className="flex items-center gap-2">
              <div className="text-sm">تا تاریخ: </div>
              <DatePicker
                render={<InputIcon />}
                {...register("toDate", {
                  required: "تاریخ اجباری است",
                })}
                value={watch("toDate")}
                onChange={(val: any) => setValue("toDate", val.unix * 1000)}
                calendar={persian}
                locale={persian_fa}
                minDate={getValues("FromDate")}
                maxDate={currentDate * 1000}
                calendarPosition="bottom-right"
                style={{
                  padding: ".8rem",
                  textAlign: "center",
                  width: "120px",
                  fontSize: "13px",
                }}
              />
              {errors.toDate && (
                <span className="text-red-500 text-xs">
                  {errors.toDate.message}
                </span>
              )}
            </div>
            {
               url !== 'other' &&  <div className="flex">
               <span className="text-xs mx-1 py-2">وضعیت : </span>
               <Select
                 onValueChange={(value) => setStatus(value)}
                 dir="rtl"
                 defaultValue={status}
               >
                 <SelectTrigger className="w-32 h-8 border border-gray-400">
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
                   {
                     url === 'total_investment' && <SelectGroup>
                       <SelectItem value="A">همه</SelectItem>
                     </SelectGroup>
                   }
 
                 </SelectContent>
               </Select>
               {errors.status && (
                 <span className="text-red-500 text-xs">
                   {errors.status.message}
                 </span>
               )}
             </div>
            }
           

            <div>
              <Button type="submit" className="h-8 mx-2">
                نمایش
              </Button>
            </div>

            <Dialog className="">
              <DialogTrigger>
                {
                  status === 'O' && url === 'cc' && <Button className="h-8 mx-2">
                  گروه‌بندی
                </Button>
                }
              </DialogTrigger>
              <DialogContent className="absolute top-[30rem]">
                <ScrollArea dir='rtl' className="h-[800px] w-full rounded-md border p-4">
                <PostionReportsGrouped />
                </ScrollArea>
              </DialogContent>
            </Dialog>



          </div>
          <div>
            {
              data && <span>
                مجموع هزینه اتخاذ این استراتژی ها برابر با {(data.total_initial_cost / 1_000_000_000)?.toLocaleString('en-US', { maximumFractionDigits: 0 })} (میلیارد ریال) میباشد
              </span>
            }
          </div>
        </div>
      </form>
      <div className="mt-4">
        {data && <DataTable columns={columns} data={data.data} isExportable originalColumns={data} />}
      </div>
    </>
  );
};

export default PostionReports;
