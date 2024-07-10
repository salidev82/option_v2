type Props = {}
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import axios from 'axios'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'

const ChangePassword = (props: Props) => {

    const { register, handleSubmit, formState: { errors }, getValues } = useForm()

    const onSubmit = async (data: any) => {
        const { old_password, new_password, new_password_repeat } = data
        axios.put('/users/changePassword', { old_password, new_password, new_password_repeat })
            .then((res) => {
                toast.success('رمز عبور با موفقیت تغییر یافت')
                window.location.href = '/#/'
            })
            .catch((e) => { throw Error(e) })
    }


    const validatePasswordMatch = (value) => {
        const newPassword = getValues('new_password');
        return value === newPassword || 'تکرار رمز عبور با رمز عبور جدید مطابقت ندارد';
    };


    return (
        <div>
            <div className="w-full bg-pattern h-screen flex-col items-center justify-center">
                <div className="flex h-screen flex-col items-center justify-center ">
                    <img src="/LoginLogo.png" className="w-40 object-contain mb-10" />
                    <div className="bg-white w-1/5 flex border-gray-200 border-dashed border-2 p-12 rounded-md">
                        <form className="flex flex-col gap-3 mx-auto w-full" onSubmit={handleSubmit(onSubmit)}>
                            <div className="w-full">
                                <Input
                                    type="password"
                                    className="w-full"
                                    placeholder="رمز عبور قدیمی"
                                    {...register('old_password', { required: true, pattern: /^(?=.*\d)(?=.*[a-zA-Z])[a-zA-Z\d\S]{8,32}$/ })}
                                />
                            </div>
                            {errors.old_password && <span className="text-red-400 text-xs">رمز عبور قدیمی را وارد کنید</span>}
                            <div className="w-full">
                                <Input
                                    type="password"
                                    placeholder="رمز عبور"
                                    {...register('new_password', {
                                        required: true,
                                        minLength: 8,
                                        pattern: /^(?=.*\d)(?=.*[a-zA-Z])[a-zA-Z\d\S]{8,32}$/
                                    })}
                                />
                            </div>
                            {errors.new_password && (
                                <span className="text-red-400 text-xs">
                                    رمز عبور باید حداقل 8 کاراکتری و شامل حداقل یک حرف و یک عدد باشد.
                                </span>
                            )}
                            <div className='w-full'>
                                <Input
                                    type="password"
                                    className="w-full"
                                    placeholder="تکرار رمز عبور"
                                    {...register('new_password_repeat', {
                                        required: true,
                                        validate: validatePasswordMatch,
                                    })}
                                />
                            </div>
                            {errors.new_password_repeat && <span className="text-red-400 text-xs">
                                رمز عبور و تکرار رمز عبور با یکدیگر مغایرت دارند
                            </span>}
                            <Button className="w-full mt-3" type="submit">
                                تغییر رمز عبور
                            </Button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ChangePassword