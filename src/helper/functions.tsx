import { Button } from "@/components/ui/button";
import { BsArrowUpShort, BsArrowDownShort } from "react-icons/bs"
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/Tooltip"
import moment from "jalali-moment";
import * as ExcelJS from "exceljs";


function compareNumericString(rowA, rowB, id, desc) {
    let a = Number.parseFloat(rowA.values[id]);
    let b = Number.parseFloat(rowB.values[id]);
    if (Number.isNaN(a)) {
        a = desc ? Number.NEGATIVE_INFINITY : Number.POSITIVE_INFINITY;
    }
    if (Number.isNaN(b)) {
        b = desc ? Number.NEGATIVE_INFINITY : Number.POSITIVE_INFINITY;
    }
    if (a > b) return 1;
    if (a < b) return -1;
    return 0;
}



export function generateColumnsArray(data: any, customColumns?: any, tooltips?: any) {
    const columns = Object.entries(data).map(([key, value]) => {
        let columnObj = {
            accessor: key,
            Header: () => (
                <>
                    {tooltips ? <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger>{value}</TooltipTrigger>
                            {tooltips && <TooltipContent>
                                <p>{tooltips ? tooltips[key] : ''}</p>
                            </TooltipContent>}
                        </Tooltip>
                    </TooltipProvider> : value}
                </>
            ),
            Cell: (row: any) => {

                if (key.endsWith('_percent')) {
                    return makePercented(row.value);
                }

                // if (["ticker_buy", "strike_price_buy", "premium_buy"].includes(key)) {
                //     return <div className="w-full text-center  items-center justify-center">{row.value}</div>
                // }

                // if (["total_trade_volume", "total_trade_value", "cc_traded_value", "total_trade_value_call", "total_trade_value_put"].includes(key)) {
                //     return <p title={row.value.toLocaleString('en-US')}>{convertToGreaterUnit(row.value)}</p>;
                // }

                // if (["bubble_percent"].includes(key)) {
                //     if (row.value == 0) {
                //         return <span>-</span>
                //     }
                // }
                // if (["ua_ticker"].includes(key)) {
                //     return row.value
                // }

                // if (['days_to_maturity'].includes(key)) {
                //     return row.value < 0 ? 'منقضی شده' : row.value
                // }
                // if (['offset_date'].includes(key)) {
                //     return moment(row.value).locale('fa').format('YYYY-MM-DD')
                // }

                // if (["close_price"].includes(key)) {
                //     const DifrencePrice = (((row.value / row.row.original.yesterday_price) - 1) * 100).toFixed(2)
                //     return <div dir="ltr" className="flex mx-auto w-8/12 items-center justify-around ">
                //         <span className="text-right">
                //             {makePercentedAndColored(DifrencePrice)}
                //         </span>
                //         <span className="text-left ">
                //             {row.value}
                //         </span>
                //     </div>
                // }

                return row.value?.toLocaleString('en-Us');
            },
            ...(!["ua_ticker", "strategy_name", 'offset_date', 'ticker'].includes(key) && {
                sortType: compareNumericString,
            })
        }

        const customColumn = customColumns?.find((col: any) => col.accessorKey === key);

        if (customColumn) {
            columnObj = { ...columnObj, ...customColumn };
        }

        return columnObj;
    });

    return columns;
}

export const convertToGreaterUnit = (value: any, limit = 0) => {
    if (value === "-") return value;
    let numberValue = Number(value);
    const K = 1_000;
    const M = 1_000_000;
    const B = 1_000_000_000;

    if (numberValue > B && numberValue >= limit)
        return (numberValue / B).toFixed(1).toLocaleString('en-Us') + " B";
    else if (numberValue > M && numberValue >= limit)
        return (numberValue / M).toFixed(1).toLocaleString('en-Us') + " M";
    else if (numberValue > K && numberValue >= limit)
        return (numberValue / K).toFixed(1).toLocaleString('en-Us') + " K";

    return numberValue.toLocaleString("en-US");
};


const makePercented = (value: any) => {

    return (
        <span className="" dir={"ltr"} >
            {value}%
        </span>
    );
};

export const makePercentedAndColored = (value: any) => {


    const color = value > 0 ? 'green' : 'red'
    return (
        <span className="w-full" style={{ color: color }} dir={"ltr"} >
            {value}%
        </span>
    );
};


export const englishToPersianTranslate = (char: any) => {
    const englishToPersian: any = {
        q: "ض",
        w: "ص",
        e: "ث",
        r: "ق",
        t: "ف",
        y: "غ",
        u: "ع",
        i: "ه",
        o: "خ",
        p: "ح",
        "[": "ج",
        "]": "چ",
        a: "ش",
        s: "س",
        d: "ی",
        f: "ب",
        g: "ل",
        h: "ا",
        j: "ت",
        k: "ن",
        l: "م",
        ";": "ک",
        "'": "گ",
        "<": "<",
        z: "ظ",
        x: "ط",
        c: "ز",
        v: "ر",
        b: "ذ",
        n: "د",
        m: "پ",
        ",": "و",
        ".": ".",
        "/": "/",
        H: "آ",
    };
    return englishToPersian[char];
};


export const excelHeaderGenerator = (data: any) => {
    const arr: any = [];

    const key = data?.metadata?.column_names;



    for (let item in key) {
        const counter = item;

        let newObj = {
            key: counter,
            header: key[item],
            name: key[item],
        };

        arr.push(newObj);
    }

    arr.pop()
    return arr;
};


export const handleXLSXExport = (
    columns: any,
    data: any,
    name: string,
    width?: any,
    lastColumnFormat?: string // Custom number format for the last column
) => {
    // CreateBook
    const wb = new ExcelJS.Workbook();
    // Add Sheet
    const sheet = wb.addWorksheet(name);
    // columns
    sheet.columns = columns;
    sheet.views = [{ rightToLeft: true }];

    sheet.properties.defaultRowHeight = 20;

    sheet.columns.forEach((column) => {
        column.width = width ? width : 18;
    });

    const headersRow = sheet.getRow(1);
    const lastColumn = sheet.lastColumn;
    const lastColumnLetter = lastColumn ? lastColumn.letter : "A";
    sheet.spliceRows(1, 0, [""]);
    sheet.mergeCells(`A1:${lastColumnLetter}1`);

    // Row
    data.map((item: any) => {
        return sheet.addRow({
            ...item,
        });
    });

    sheet.autoFilter = {
        from: { row: 2, column: 1 },
        to: { row: sheet.rowCount, column: sheet.columnCount },
    };

    // Format currency values

    sheet.eachRow((row) => {
        row.eachCell((cell, colNumber) => {
            if (colNumber === columns.length) { // Check if it's the last column
                if (lastColumnFormat) {
                    cell.numFmt = lastColumnFormat; // Apply the custom format
                } else {
                    cell.numFmt = "#,##;[Red]-#,##"; // Default format if no custom format provided
                }
            } else {
                cell.numFmt = "#,##;[Red]-#,##"; // Default format for other columns
            }
        });
    });

    sheet.eachRow({ includeEmpty: true }, function (row, rowNumber) {
        row.eachCell(function (cell, colNumber) {
            cell.font = {
                name: "Arial",
                family: 2,
                bold: false,
                size: 10,
            };
            cell.alignment = {
                vertical: "middle",
                horizontal: "center",
            };
            if (rowNumber) {
                for (var i = 1; i < columns.length + 1; i++) {
                    if (rowNumber == 1) {
                        row.getCell(i).fill = {
                            type: "pattern",
                            pattern: "solid",
                            fgColor: { argb: "002060" },
                        };
                        row.getCell(i).font = {
                            color: {
                                argb: "ffffff",
                            },
                        };
                    } else if (rowNumber == 2) {
                        row.getCell(i).fill = {
                            type: "pattern",
                            pattern: "solid",
                            fgColor: { argb: "3E54AC" },
                        };
                        row.getCell(i).font = {
                            color: {
                                argb: "ffffff",
                            },
                        };
                    } else {
                        row.getCell(i).fill = {
                            type: "pattern",
                            pattern: "solid",
                            fgColor: { argb: "FFFFFF" },
                        };
                        row.getCell(i).font = {
                            color: {
                                argb: "333333",
                            },
                        };
                        row.getCell(i).border = {
                            top: { style: "thin", color: { argb: "cccccc" } },
                            bottom: { style: "thin", color: { argb: "cccccc" } },
                            left: { style: "thin", color: { argb: "cccccc" } },
                            right: { style: "thin", color: { argb: "cccccc" } },
                        };
                    }
                }
            }
        });
    });

    wb.xlsx.writeBuffer().then((data) => {
        const blob = new Blob([data], {
            type: "application/vmd.openxmlformats-officedocument.spreadsheet.sheet",
        });
        const url = window.URL.createObjectURL(blob);
        const anchor = document.createElement("a");
        anchor.href = url;
        anchor.download = name + ".xlsx";
        anchor.click();
        window.URL.revokeObjectURL(url);
    });
};
