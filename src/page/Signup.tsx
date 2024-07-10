import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import axios from 'axios'
import {  useForm } from 'react-hook-form'
import { useDispatch } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'

type Props = {}


type Inputs = {
    full_name: string
    password: string,
    phone_number: string,
    email: string,
}


const Signup = (props: Props) => {

    let navigate = useNavigate()


    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<Inputs>()

    const dispatch = useDispatch()

    const onSubmit = async (data) => {



        let response = await axios.post(`/users`, { ...data })
            .then(() => {
                toast.success('ثبت نام با موفقیت انجام شد', {
                    autoClose: 2000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    theme: "colored",
                });

                navigate('/login')

            }).catch((err) => {
                toast.error(`${''}ثبت نام با خطا مواجه شد`, {
                    autoClose: 2000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    theme: "colored",
                });
            })
    }



    return (
        <div>
            <div className="w-full h-screen flex-col items-center justify-center bg-pattern">
                <div className="flex h-screen flex-col items-center justify-center ">
                    <img src="/LoginLogo.png" className="w-40 object-contain mb-10" />
                    <div className="bg-white w-1/5 flex border-gray-200 border-dashed  border-2 p-12 rounded-md">
                        <form className="flex flex-col gap-3" onSubmit={handleSubmit(onSubmit)}>
                            <Input placeholder="نام و نام خانوادگی"  {...register("full_name", { required: true, minLength: 3, maxLength: 32 })} />
                            {errors.full_name && <span className="text-red-400 text-xs">لطفا نام و نام خانوادگی خود را وارد کنید.</span>}
                            <Input placeholder="تلفن همراه"  {...register("phone_number", { required: true, pattern: /^(\+98|0)?9\d{9}$/ })} />
                            {errors.phone_number && <span className='text-red-400 text-xs'>لطفا شماره تلفن خود را درست وارد کنید</span>}
                            <Input placeholder="ایمیل" type='email' {...register("email", { required: true, pattern: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/ })} />
                            {errors.email && <span className='text-red-400 text-xs'>لطفا ایمیل خود را درست وارد کنید</span>}

                            <Input type="password" className="w-[17rem]" placeholder="رمز عبور" {...register("password", { required: true, pattern: /^(?=.*\d)(?=.*[a-zA-Z])[a-zA-Z\d\S]{8,32}$/ })} />
                            {errors.password && <span className="text-red-400 text-xs">رمز عبور باید حداقل 8 کاراکتری و شامل حداقل یک حرف و یک عدد باشد.</span>}
                            <Button className="w-[17rem] mt-3" type="submit">
                                ثبت نام
                            </Button>
                            <Link to="/login" className="text-sm text-primary">اکانت دارید؟ ورود کنید</Link>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Signup