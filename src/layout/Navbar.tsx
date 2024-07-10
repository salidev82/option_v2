import React from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuIndicator,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  NavigationMenuViewport,
} from "@/components/ui/navigation-menu";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { BiSolidChevronDown } from "react-icons/bi";
import { Link, useLocation } from "react-router-dom";
import axios from "axios";
import { logout } from "@/store/reducers/userSlice";

const Navbar = () => {
  const selector = useSelector((state: any) => state?.user?.user?.user);
  const userselector = useSelector((state: any) => state?.user?.user);
  const location = useLocation();

  const roles: string[] =
    selector &&
    selector?.roles?.map((item: { name: string }) => {
      return item.name;
    });


  const hasRole = (role: any) => roles && roles.includes(role);

  const menuItems = [
    {
      name: "استراتژی‌های شکاف قیمتی",
      role: "bull_call_spread",
      url: "/market",
      submenu: [
        {
          name: "کال‌اسپرد صعودی",
          role: "bull_call_spread",
          url: "/bull_call_spread",
        },
      ],
    },

    {
      name: "استراتژی با سهم",
      role: "covered_call",
      url: "/market",
      submenu: [
        { name: "مریدپوت", role: "married_put", url: "/married_put" },
        { name: "کاوردکال", role: "covered_call", url: "/covered_call" },
        { name: "کانورژن", role: "covered_call", url: "/conversion" },
      ],
    },
    {
      name: "اختیارها",
      role: "arbitrage",
      url: "/market",
      submenu: [{ name: "آربیتراژ", role: "arbitrage", url: "/arbitrage" }],
    },
    {
      name: "بازار",
      role: "market_screen",
      url: "/market",
      submenu: [
        { name: "دیده‌بان", role: "market_screen", url: "/" },
        { name: "روزانه", role: "trade_statistics", url: "/trade_statistics" },
        {
          name: "تاریخی",
          role: "historical_trade_summary",
          url: "/historical_trade_summary",
        },
      ],
    },
    {
      name: "موقعیت‌ها",
      role: "positions",
      url: "positions",
      submenu: [
        { name: "وضعیت موقعیت‌ها", role: "", url: "/positions" },
        { name: "گزارش‌ها", role: "", url: "/positions/reports" },
        { name: "ریسک", role: "", url: "/positions/risk" },
      ],
    },
  ];

  const dispatch = useDispatch();

  const logoutUser = () => {
    axios
      .post(`/users/logout`, {
        access_token: userselector.access_token,
        refresh_token: userselector.refresh_token,
      })

      .then(() => {
        dispatch(logout());
        window.location.href = "/#/login";
      });
  };

  const NavigationMenu = ({ menuItems }) => {
    return (
      <nav className="mt-1 w-full mx-3">
        <ul className=" flex flex-row-reverse ">
          {menuItems?.map((menuItem, index) => {
            const isActive = location.pathname === menuItem.url;
            const hasMenuItemRole = hasRole(menuItem.role)
            if (hasMenuItemRole) {
              return (
                <li key={index} className="group relative mx-1">
                  {menuItem?.submenu ? (
                    <div className="flex items-center text-white ml-2 gap-1 px-1 -mr-1 text-sm relative top-0.5 ">
                      {menuItem.name} <BiSolidChevronDown fontSize={14} />
                    </div>
                  ) : (
                    <Link
                      className={`${isActive ? "text-white text-black" : "text-white"
                        } text-sm py-3 px-1.5 relative bottom1`}
                      to={menuItem?.submenu ? "" : menuItem.url}
                    >
                      {menuItem.name}
                    </Link>
                  )}

                  {menuItem.submenu && (
                    <ul className="absolute w-36 p-2  hidden group-hover:block -mr-1  bg-blue-800 rounded-md space-y-1 gap-2 shadow-xl text-black z-50">
                      {menuItem.submenu.map(
                        (submenuItem: any, submenuIndex: any) => {
                          const isSubmenuActive =
                            location.pathname === submenuItem.url;

                          return (
                            <li key={submenuIndex}>
                              <Link
                                className={`text-white text-sm py-1 px-1.5 rounded-md`}
                                to={submenuItem.url}
                              >
                                {submenuItem.name}
                              </Link>
                            </li>
                          );
                        }
                      )}
                    </ul>
                  )}
                </li>
              );
            }

          })}
        </ul>
      </nav>
    );
  };

  return (
    <div className="w-full mb-2 px-4 h-14 bg-primary">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div>
            <img src="/logo.png" className="h-8 m-2.5 bg-contain" />
          </div>
          <NavigationMenu menuItems={menuItems} />
          {/* <NavigationMenu>
                        <NavigationMenuList>

                            {
                                menuItems.map((menuItem: any, index: any) => {
                                    const hasMenuItemRole = hasRole(menuItem.role);
                                    const isActive = location.pathname === menuItem.url;

                                    return (
                                        <NavigationMenuItem>
                                            <NavigationMenuTrigger> {menuItem.name}</NavigationMenuTrigger>
                                            <NavigationMenuContent dir='rtl'>
                                                <ul className="grid gap-1 p-1 lg:w-[1200px] lg:grid-cols-[.75fr_1fr] mr-auto">

                                                    1
                                                </ul>
                                            </NavigationMenuContent>
                                        </NavigationMenuItem>
                                    )

                                })
                            }



                        </NavigationMenuList>
                    </NavigationMenu> */}
        </div>

        <div className="ml-8">
          <DropdownMenu dir="rtl">
            <DropdownMenuTrigger className="text-white outline-none flex items-center gap-2">
              {selector && selector.email.split('@')[0]}
              <BiSolidChevronDown />
            </DropdownMenuTrigger>
            <DropdownMenuContent className="text-right flex flex-col">
              {hasRole("admin") && (
                <DropdownMenuItem className="cursor-pointer ">
                  <Link to={"/admin/dashboard/users"}>پنل ادمین</Link>
                </DropdownMenuItem>
              )}
              <Link to="/change-password">
                <DropdownMenuItem className="cursor-pointer ">
                  تغییر رمز عبور
                </DropdownMenuItem>
              </Link>
              <DropdownMenuItem
                className="cursor-pointer text-red-400"
                onClick={() => logoutUser()}
              >
                خروج از حساب کاربری
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
