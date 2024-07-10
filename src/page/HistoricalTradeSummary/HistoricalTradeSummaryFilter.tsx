// @ts-nocheck
import { FC, useEffect, useState } from "react"
import DatePicker from "react-multi-date-picker"
import persian from "react-date-object/calendars/persian"
import persian_fa from "react-date-object/locales/persian_fa"
import "react-multi-date-picker/styles/backgrounds/bg-dark.css"
import InputIcon from "react-multi-date-picker/components/input_icon"
import { toast } from "react-toastify"
import html2canvas from "html2canvas"
import { Button } from "../../components/ui/button"

type Props = {
    FromDate: any,
    setFromDate: any,
    toDate: any,
    setToDate: any,
    currentDate: any
}

const HistoricalTradeSummaryFilter: FC<Props> = ({ FromDate, setFromDate, toDate, setToDate, currentDate }) => {

    const exports = () => {
        setTimeout(() => {
            const targetElement: any = document.getElementById("export");

            html2canvas(targetElement, {
                scale: 2,
            }).then((canvas) => {
                const imgData = canvas.toDataURL("image/jpeg");
                const link = document.createElement("a");
                link.download = `گزارش تاریخی.jpg`;
                link.href = imgData;
                link.click();
            });
        }, 200);
    };
    return (
        <div className='w-full bg-white border shadow-md rounded-md p-3 flex gap-4 mb-4'>
            <div className="flex items-center gap-2">
                <div className="text-sm">از تاریخ: </div>
                <DatePicker
                    render={<InputIcon />}
                    value={FromDate}
                    onChange={(val: any) => setFromDate(val.unix * 1000)}
                    minDate="1395/1/1"
                    maxDate={currentDate * 1000}
                    calendar={persian}
                    locale={persian_fa}
                    calendarPosition="bottom-right"
                    style={{ padding: '.8rem', textAlign: 'center', width: '120px', fontSize: '13px' }}
                />
            </div>
            <div className="flex items-center gap-2">
                <div className="text-sm">تا تاریخ: </div>
                <DatePicker
                    render={<InputIcon />}
                    value={toDate}
                    onChange={(val: any) => setToDate(val.unix * 1000)}
                    calendar={persian}
                    locale={persian_fa}
                    minDate={FromDate}
                    maxDate={currentDate * 1000}
                    calendarPosition="bottom-right"
                    style={{ padding: '.8rem', textAlign: 'center', width: '120px', fontSize: '13px' }}
                />
            </div>
            <div className="mr-auto">
                <Button onClick={exports}>دریافت تصویر</Button>
            </div>
        </div>
    )
}

export default HistoricalTradeSummaryFilter