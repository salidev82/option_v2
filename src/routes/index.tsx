import Navbar from "@/layout/Navbar";
import CoverdCall from "@/page/CoverdCall";
import Login from "@/page/Login";
import Option from "@/page/Option";
import Arbitrage from '@/page/Arbitrage'


import { useSelector } from "react-redux";
import { Outlet, useNavigate } from 'react-router-dom'
import TradeStatisics from "@/page/TradeStatisics";
import MarriedPut from "@/page/MarriedPut";
import AdminDashboard from "@/page/Admin/AdminDashboard";
import Users from "@/page/Admin/Users";
import Signup from "@/page/Signup";
import BullCallSpread from "@/page/BullCallSpread";
import ChangePassword from "@/page/ChangePassword";
import HistoricalTradeSummary from "@/page/HistoricalTradeSummary";
import { useEffect } from "react";
import Conversion from "../page/Conversion";
import Postions from "../page/Postions";
import PostionDetail from "../page/Postions/postion_detail";
import PostionReports from "../page/Postions/postion_reports/PostionReports";
import PostionRisk from "../page/Postions/postion_risk";




const AppLayout = () => {
    const roles = useSelector((state: any) => state?.user?.user?.user?.roles);
    const navigate = useNavigate();

    useEffect(() => {
        if (!roles) {
            navigate('/login');
        }
    }, [roles, navigate]);


    if (!roles) {
        return null;
    }

    return (
        <div>
            <Navbar />
            <main className="w-[99%] mx-auto">
                <div>
                    <Outlet />
                </div>
            </main>
        </div>
    );
};


export const routesConfig = (selector: any) => {


    const rolesName = selector?.map((item: any) => item.name)


    return [
        {
            path: "/login",
            element: <Login />,
        },
        {
            path: "/signup",
            element: <Signup />,
        },
        {
            path: "/change-password",
            element: <ChangePassword />,
        },
        {
            path: '/admin/dashboard/',
            element: <AdminDashboard />,
            children: [
                {
                    path: 'users',
                    element: rolesName && rolesName.includes('admin') ? <Users /> : 'Permission Denied!',
                }
            ]
        },
        {
            element: <AppLayout />,
            children: [
                {
                    path: "/",
                    element: rolesName && rolesName.includes('market_screen') ? <Option /> : 'Permission Denied!',
                },
                {
                    path: "/positions",
                    element: rolesName && rolesName.includes('positions') ? <Postions /> : 'Permission Denied!',
                },
                {
                    path: "/positions/reports",
                    element: rolesName && rolesName.includes('positions') ? <PostionReports /> : 'Permission Denied!',
                },
                {
                    path: "/positions/risk",
                    element: rolesName && rolesName.includes('positions') ? <PostionRisk /> : 'Permission Denied!',
                },
                {
                    path: "/postions/:id",
                    element: rolesName && rolesName.includes('positions') ? <PostionDetail /> : 'Permission Denied!',
                },
                {
                    path: "/covered_call",
                    element: rolesName && rolesName.includes('covered_call') ? <CoverdCall /> : 'Permission Denied!',
                },
                {
                    path: "/arbitrage",
                    element: rolesName && rolesName.includes('arbitrage') ? <Arbitrage /> : 'Permission Denied!',
                },
                {
                    path: "/trade_statistics",
                    element: rolesName && rolesName.includes('trade_statistics') ? <TradeStatisics /> : 'Permission Denied!',
                },
                {
                    path: "/married_put",
                    element: rolesName && rolesName.includes('married_put') ? <MarriedPut /> : 'Permission Denied!',
                },
                {
                    path: "/bull_call_spread",
                    element: rolesName && rolesName.includes('bull_call_spread') ? <BullCallSpread /> : 'Permission Denied!',
                },
                {
                    path: "/historical_trade_summary",
                    element: rolesName && rolesName.includes('bull_call_spread') ? <HistoricalTradeSummary /> : 'Permission Denied!',
                },
                {
                    path: "/conversion",
                    element: rolesName && rolesName.includes('conversion') ? <Conversion /> : 'Permission Denied!',
                },
            ],
        },
    ];
}
