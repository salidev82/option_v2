//@ts-nocheck
import { useForm, SubmitHandler } from "react-hook-form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import axios from "axios"
import { useDispatch, useSelector } from "react-redux"
import { login } from "@/store/reducers/userSlice"
import { Link } from "react-router-dom"
import { toast } from "react-toastify"
import { useEffect } from "react"


type Inputs = {
    identifier: string
    password: string
}

type Props = {}

const Login = (props: Props) => {


    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<Inputs>()


    const dispatch = useDispatch()

    const onSubmit: SubmitHandler<Inputs> = async (data) => {
        const response: any = await axios.post('/users/login', { ...data })
            .catch((e) => {
            }).then((res: any) => {
                dispatch(login(res.data))
            })
        window.location.href = "/"
    }



    return (
        <div className="w-full bg-pattern h-screen flex-col items-center justify-center">
            <div className="flex  h-screen flex-col items-center justify-center ">
                <img src="/LoginLogo.png" className="w-40 object-contain mb-10" />
                <div className="bg-white w-1/5 flex border-gray-200 border-dashed  border-2 p-12 rounded-md">
                    <form className="flex flex-col gap-3" onSubmit={handleSubmit(onSubmit)}>
                        <Input placeholder="تلفن همراه یا ایمیل"  {...register("identifier", { required: true })} />
                        {errors.identifier && <span className="text-red-400 text-xs">لطفا تلفن همراه یا ایمیل خود را وارد کنید.</span>}
                        <Input type="password" className="w-[17rem]" placeholder="رمز عبور" {...register("password", { required: true })} />
                        {errors.password && <span className="text-red-400 text-xs">رمز عبور باید حداقل 8 کاراکتری و شامل حداقل یک حرف و یک عدد باشد.</span>}
                        <Button className="w-[17rem] mt-3" type="submit">
                            ورود
                        </Button>
                        <Link to="/signup" className="text-sm text-primary">اکانت ندارید؟ ثبت نام کنید</Link>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default Login