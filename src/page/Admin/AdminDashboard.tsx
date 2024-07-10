import React, { useState } from 'react'
import { BiSolidChevronLeft, BiSolidChevronRight } from 'react-icons/bi';
import { Link, Outlet } from 'react-router-dom';

type Props = {}

const AdminDashboard = (props: Props) => {

    const [isMiniSidebar, setIsMiniSidebar] = useState(false);

    const toggleSidebar = () => {
        setIsMiniSidebar(!isMiniSidebar);
    };


    return (
        <div className="flex h-screen">
            <div
                className={`${isMiniSidebar ? 'w-16' : 'w-56'
                    } bg-gray-800 text-white transition-all`}
            >
                <div className="py-4 mr-auto w-fit" dir='ltr'>
                    <div
                        className="cursor-pointer px-4 py-2"
                        onClick={toggleSidebar}
                    >
                        {!isMiniSidebar ? <BiSolidChevronRight /> : <BiSolidChevronLeft />}
                    </div>
                </div>
                <div className="py-4 w-full bg-blue-400 text-right text-sm flex items-center px-4">
                    مدیریت کاربران
                </div>
            </div>
            <div className="flex-1 bg-white p-6">
                <nav className='flex mb-4 items-center justify-between border-b-2 pb-4'>
                    <div className="text-md">
                        پنل ادمین
                    </div>
                    <div>
                        <Link to={'/'} className='text-base text-blue-400'>
                            برگشت به صفحه اصلی
                        </Link>
                    </div>
                </nav>
                <Outlet />
            </div>
        </div>
    )
}

export default AdminDashboard