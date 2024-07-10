import { useQuery } from "react-query";
import OptionsFilter from "./OptionsFilter";
import axios from "axios";
import { DataTable } from "@/components/shared/DataTable";
import { generateColumnsArray } from "@/helper/functions";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Loading from "@/components/shared/Loading";
import { makePercentedAndColored } from "../../helper/functions";

const Option = () => {
  const useDebounce = (callback: any, delay: any) => {
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

  const paramsFromLocalStorage = useSelector(
    (state: any) => state.optionsFilter // Replace with the actual slice name used in the store
  );

  const isAutoUpdate = useSelector((state: any) => state.config.isAutoUpdate);

  const getOption = async () => {
    const response = await axios.get(`options/`, {
      params: paramsFromLocalStorage,
    });
    return response.data;
  };

  const {
    data,
    isFetching,
    isError,
    refetch,
  }: { data: any; isFetching: boolean; isError: boolean; refetch: any } =
    useQuery("Option", getOption);

  const debouncedRefetch = useDebounce(refetch, 800);

  useEffect(() => {
    // Call debouncedRefetch instead of refetch when paramsFromLocalStorage changes
    debouncedRefetch();
  }, [paramsFromLocalStorage]);

  const renderTicker = (value: any, tseCode: string) => {
    return (
      <div
        className="w-6/12 mx-auto flex items-center gap-1 justify-between text-center"
        dir="rtl"
      >
        <a
          target="_blank"
          href={`http://www.tsetmc.com/instInfo/${tseCode}`}
          className="w-10 cursor-pointer"
        >
          <img src="/tse.png" className="w-6 h-6" alt="" />
        </a>
        <span className="w-full text-right ">{value}</span>
      </div>
    );
  };

  useEffect(() => {
    let intervalId: any;

    const startAutoUpdate = () => {
      intervalId = setInterval(() => {
        refetch();
      }, 30000);
    };

    const stopAutoUpdate = () => {
      clearInterval(intervalId);
    };

    if (isAutoUpdate == true) {
      refetch();
      startAutoUpdate();
    } else {
      stopAutoUpdate();
    }

    return () => {
      stopAutoUpdate(); // Clear the interval when the component unmounts or when isAutoUpdate changes to false
    };
  }, [isAutoUpdate]);

  const fetchDataAndUpdateLocalStorage = async () => {
    // Perform your data fetching here (e.g., API call)
    const response = await axios
      .get("options/underlying_assets")
      .then((res) => {
        const data = res.data;

        // Save the data and timestamp to local storage
        localStorage.setItem("data", JSON.stringify(res.data));
        localStorage.setItem("timestamp", Date.now());
      });
  };

  const getDataFromLocalStorage = () => {
    // Get the data and timestamp from local storage
    const data = localStorage.getItem("data");
    const timestamp = localStorage.getItem("timestamp");

    // Check if data and timestamp exist in local storage
    if (data && timestamp) {
      // Convert the timestamp to a number
      const timestampMs = parseInt(timestamp, 10);

      // Calculate the time difference between now and the saved timestamp
      const timeDiff = Date.now() - timestampMs;

      // If the data is still valid (less than 8 hours old), return the data
      if (timeDiff < 8 * 60 * 60 * 1000) {
        return JSON.parse(data);
      }
    }

    // If data doesn't exist in local storage or is outdated, fetch and update it
    fetchDataAndUpdateLocalStorage();
    return null; // You can return a default value if needed
  };

  const [assets, setAssets] = useState(null);

  useEffect(() => {
    // Get data from local storage or fetch it if needed
    const localData = getDataFromLocalStorage();
    if (localData) {
      setAssets(localData);
    }
  }, []);

  useEffect(() => {
    let intervalId: any;

    const startAutoUpdate = () => {
      intervalId = setInterval(() => {
        refetch();
      }, 30000);
    };

    const stopAutoUpdate = () => {
      clearInterval(intervalId);
    };

    if (isAutoUpdate) {
      refetch();
      startAutoUpdate();
    } else {
      stopAutoUpdate();
    }

    return () => {
      stopAutoUpdate(); // Clear the interval when the component unmounts or when isAutoUpdate changes to false
    };
  }, [isAutoUpdate]);

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
          header: "نماد",
          accessorKey: "ticker",
          Cell: (row: any) => {
            const val = row.value;
            return renderTicker(val, row.row.original.tse_code);
          },
        },

        {
          header: "پرمیموم",
          accessorKey: "premium",
          Cell: (row: any) => {
            const val = row.value;
            const DifrencePrice = (
              (row.value / row.row.original.yesterday_price - 1) *
              100
            ).toFixed(0);

            return (
              <div
                dir="ltr"
                className="flex mx-auto  items-center justify-around "
              >
                <span className="text-right">{val}</span>
              </div>
            );
          },
        },
        {
          header: "تغییرات پرمیوم",
          accessorKey: "premium_diff_percent",
          sortType: compareNumericString,

          Cell: (row: any) => {
            const val = row.value;

            return (
              <div
                dir="ltr"
                className="flex mx-auto  items-center justify-around "
              >
                <span className="text-right">
                  {makePercentedAndColored(val)}
                </span>
              </div>
            );
          },
        },
        {
          header: "حباب",
          accessorKey: "bubble_percent",
          sortType: compareNumericString,

          Cell: (row: any) => {
            const val = row.value;

            return (
              <div
                dir="ltr"
                className="flex mx-auto  items-center justify-around "
              >
                <span className="text-right">
                  {val === 0 ? '-' : val}
                </span>
              </div>
            );
          },
        },
      ],
      data?.metadata?.column_annotate
    );

  if (isFetching) return <Loading />;

  return (
    <div className="noTRBold">
      <OptionsFilter />
      {isError && "error getting Data"}
      {data && <DataTable columns={columns} data={data?.data} />}
    </div>
  );
};

export default Option;
