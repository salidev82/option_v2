import DataTable from "@/components/shared/DataTable";
import Loading from "@/components/shared/Loading";
import { Button } from "@/components/ui/button";
import { generateColumnsArray } from "@/helper/functions";
import axios from "axios";
import { useQuery } from "react-query";
import { PiTrashLight } from 'react-icons/pi'
import { Switch } from "@/components/ui/switch"
import MultiSelect, { Option } from "@/components/shared/MultiSelect";


import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { useEffect, useState } from "react";
import { Label } from "@radix-ui/react-dropdown-menu";
import { Input } from "@/components/ui/input";

type Props = {}

const Users = (props: Props) => {


    // list Roles

    const [roles, setRoles] = useState<any>(null)


    useEffect(() => {
        async function getData() {
            axios.get(`/users/rolesList`).then((res) => {
                return setRoles(res.data)
            })
        }

        getData()

    }, [])


    const getUser = async () => {
        const response = await axios.get(`users`);
        return response.data;
    };

    const { data, isFetching, isError, refetch }: { data: any, isFetching: boolean, isError: boolean, refetch: any } = useQuery('getUsers', getUser)





    const activeUser = async (userId: string) => {
        let response = axios.patch(`/users/changeStatus`, {
            email: userId,
            new_status: "active"
        }).then(() => {
            window.location.reload()
        })
    }

    const DeactiveUser = async (userId: string) => {

        let response = axios.patch(`/users/changeStatus`, {
            email: userId,
            new_status: "inactive"
        }).then(() => {
            window.location.reload()
        })
    }

    const handleDeleteUser = async (userId: string) => {


        if (confirm('کاربر مورد نظر حذف شود؟')) {
            axios.delete(`/users/delete`, {
                data: {
                    email: userId
                }
            }).then(() => {
                window.location.reload()
            }).catch((e) => e)
        } else {
            return
        }
    }


    const HandleUserRole = (props: { userId: any }) => {


        const [optionSelected, setSelected] = useState<Option[] | null>(props.userId.row.original.roles.map((item) => {
            return {
                value: item.name,
                label: item.name,
            }
        }));

        const optionSelectedArr = optionSelected?.map((item) => item.value)

        const handleChange = (selected: Option[]) => {
            setSelected(selected);
        };

        const onSubmit = () => {
            axios.patch(`/users/addRole`, {
                email: props.userId.row.original.email,
                roles: [...optionSelectedArr],
            }).then(() => {
                window.location.reload()
            })
        }

        return (<div className="mt-8 px-12 flex flex-col items-center gap-8">
            <Button onClick={() => onSubmit()} className="w-full">به روز رسانی</Button>
            <MultiSelect
                placeholder="انتخاب سطح دسترسی"
                options={roles?.map((role: any) => {
                    return {
                        label: role,
                        value: role,
                    }
                })}
                onChange={handleChange}
                value={optionSelected}
                isSelectAll={true}
                className="w-full"
                menuPlacement={"bottom"}

            />
        </div>)
    }

    const columns = data && generateColumnsArray(data?.metadata?.column_names, [
        {
            header: 'سطح‌دسترسی',
            accessorKey: 'roles',
            Cell: (row: any) => {
                const val = row.value
                return <div className="flex gap-1 space-x-2 justify-center">
                    <Dialog>
                        <DialogTrigger asChild>
                            <Button className="text-lg my-2 rounded-full w-8 h-8 bg-gray-400 hover:bg-primary" variant={"destructive"}>
                                +
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-lg">
                            <div className="grid gap-4 py-3">
                                <HandleUserRole userId={row} />
                            </div>

                        </DialogContent>
                    </Dialog>
                    {val.map((item: any) => <span key={item.name} className="bg-gray-200 p-2 my-2 rounded-full text-xs">
                        {item.name}
                    </span>)}

                </div>
            },
        },
        {
            header: 'عملیات',
            accessorKey: 'operations',
            Cell: (row: any) => {
                const val = row.row.original.is_active
                return <div className="flex justify-center gap-4">
                    <div className="cursor-pointer">
                        <PiTrashLight onClick={() => handleDeleteUser(row.row.original.email)} fontSize={22} color="red" />
                    </div>
                    <div className="cursor-pointer">
                        {val === false ? <Switch onCheckedChange={() => activeUser(row.row.original.email)} /> : <Switch onCheckedChange={() => DeactiveUser(row.row.original.email)} defaultChecked />}
                    </div>
                </div>
            },
        },

    ]);



    if (isFetching) return <Loading />

    return (
        <div>
            {(isError) && 'error getting Data'}
            {data && <DataTable columns={columns} data={data?.data} />}
        </div>
    )


}

export default Users