import React from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "react-query";
import axios from "axios";
import MainPostion from "./MainPostion";
import TradePostion from "./TradePostion";
import PNL from "./PNL";
import Exercises from "./Exercises";
import LivePNL from "./LivePNL";
import { toast } from "react-toastify";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import PostionUpdateForm from "../PostionUpdateForm";
import Margins from "./Margins";


type Props = {};

const PostionDetail = (props: Props) => {

  const { id } = useParams()

  const getData = async () => {
    const response = await axios.get(`position/${id}`)
    return response.data
  };

  const { data, isError, refetch } = useQuery("postion_detail" + id, getData)

  const closePostion = async () => {
    const response = await axios.patch(`position/${id}`, {
      status: "C"
    }).then((res) => {
      if (res.status === 200) {
        refetch()
      }
    }).catch((err) => console.log(err))


  }


  return (
    <div className="max-w-7xl mx-auto">
      {data && (
        <>
          <div className="relative">
            <div className="absolute left-0 top-0">
              <Dialog>
                <DialogTrigger>
                  <button className="bg-red-500 px-3 py-1.5 text-white  ">
                    تغییر وضعیت
                  </button>
                </DialogTrigger>
                <DialogContent>
                  <PostionUpdateForm row={data} />
                </DialogContent>
              </Dialog>
            </div>
          </div>
          <MainPostion row={data} />
          <TradePostion id={id} />
          {
            Object.keys(data.margins.data).length > 0 &&
            <Margins data={data?.margins} />
          }
          <Exercises id={id} />
          <PNL row={data} />
          <LivePNL row={data} />
        </>
      )}
    </div>
  );
};

export default PostionDetail;
