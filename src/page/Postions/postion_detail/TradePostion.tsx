import axios from "axios";
import React from "react";
import { useQuery } from "react-query";
import { DataTable } from "@/components/shared/DataTable";
import { generateColumnsArray } from "../../../helper/functions";
import { Button } from "@/components/ui/button";
import { FiTrash2 } from "react-icons/fi";
import { MdModeEditOutline } from "react-icons/md";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import {
  Alert,
  AlertDescription,
} from "@/components/ui/alert"

import AddTradeForm from "./AddTradeForm";
import UpdateForm from "./UpdateForm";
import { toast } from "react-toastify";

type Props = {
  id?: number | undefined;
};

const TradePostion = (props: Props) => {
  const getData = async () => {
    let response = await axios.get(`position/trade/list/${props.id}`);
    return response.data;
  };

  const { data, isError, refetch } = useQuery(`tradePostion/${props.id}`, getData);


  const deleteRow = (id) => {
    if (window.confirm("سطر مورد نظر حذف شود؟")) {
      axios.delete(`position/trade/${id.row.original.trade_id}`).then((res) => {

        if (res.status == 200) {
          toast.success("معامله مورد نظر با موفقیت حذف شد", {
            style: {
              fontSize: 13,
            },
          });

          refetch()
        }

      });

    }
  };

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
                <div className="cursor-pointer" onClick={() => deleteRow(row)}>
                  <FiTrash2 className="text-xl text-red-500 relative" />
                </div>
                <div className="cursor-pointer" >
                  <Dialog>
                    <DialogTrigger className="relative top-1">
                      {" "}
                      <MdModeEditOutline className="text-xl text-blue-900" />
                    </DialogTrigger>
                    <DialogContent className="max-w-xs shadow-2xl border-2">
                      <UpdateForm postion_id={row.row.original.trade_id} row={row} />
                    </DialogContent>
                  </Dialog>
                </div>
              </span>
            );
          },
        },
      ],
      data?.metadata?.column_annotate
    );


  return (
    <div className="postions__table">
      <div className="w-full bg-blue-200 px-2  text-sm rounded-sm flex items-center">
        <div>معاملات</div>
        <div className="mr-auto">
          <Dialog>
            <DialogTrigger>
              {" "}
              <Button size="sm" className="my-2 block mr-auto bg-blue-800">
                اضافه کردن معامله
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-xs shadow-2xl border-2">
              <AddTradeForm postion_id={props.id} />
            </DialogContent>
          </Dialog>
        </div>
      </div>
      {data?.data?.length > 0 ? <DataTable search={false} columns={columns} data={data.data} /> :
        <Alert variant="info" className="mt-4">
          <AlertDescription>
            در حال حاضر هیچ معامله ای وجود ندارد  - لطفا یک معامله را اضافه کنید
          </AlertDescription>
        </Alert>
      }
    </div>
  );
};

export default TradePostion;
