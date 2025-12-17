import React, { useState, useEffect } from "react";
import { Menu, message } from "antd";
import type { MenuProps } from "antd";
import {
  HomeOutlined,
  BookOutlined,
  HighlightOutlined,
  LoginOutlined,
  EditOutlined,
  SettingOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import { NavLink, useLocation } from "react-router-dom";
import { useCurrentContext } from "components/context/context";
import { logoutAccountAPI } from "@/services/api.service";

const Header: React.FC = () => {
  type MenuItem = Required<MenuProps>["items"][number];

  const [current, setCurrent] = useState("home");

  const { isUser, setUser } = useCurrentContext();
  const location = useLocation();
  // const onClick = useCallback<NonNullable<MenuProps["onClick"]>>((e) => {
  //   setCurrent(e.key);
  // }, []);

  const handleLogout = async () => {
    const res = await logoutAccountAPI();
    if (res.data) {
      setUser(null);
      localStorage.removeItem("access_token");
      message.success(`${res.data.data}`);
    }
  };

  useEffect(() => {
    if (location.pathname === "/") {
      setCurrent("home");
    } else if (location.pathname === "/book") {
      setCurrent("book");
    } else if (location.pathname === "/about") {
      setCurrent("about");
    }
  }, [location.pathname]);

  console.log("Header: render");

  const items: MenuItem[] = [
    {
      label: <NavLink to={"/"}> Home</NavLink>,
      key: "home",
      icon: <HomeOutlined />,
      disabled: false,
    },
    {
      label: <NavLink to={"/book"}> Book</NavLink>,
      key: "book",
      icon: <BookOutlined />,
      disabled: false,
    },
    {
      label: <NavLink to={"/about"}> About</NavLink>,
      key: "about",
      icon: <HighlightOutlined />,
      disabled: false,
    },
    ...(isUser
      ? [
          {
            label: `Welcome ${isUser.id ? isUser.fullName : "Settings"}`,
            key: "setting",
            icon: <SettingOutlined />,
            disabled: false,
            children: [
              {
                label: (
                  <NavLink to={"/"} onClick={handleLogout}>
                    LogOut
                  </NavLink>
                ),
                key: "logOut",
                icon: <LogoutOutlined />,
              },
            ],
          },
        ]
      : [
          {
            label: <NavLink to={"/login"}> Login</NavLink>,
            key: "login",
            icon: <LoginOutlined />,
            disabled: false,
            children: [
              {
                label: (
                  <NavLink to={"/register"} replace>
                    {" "}
                    Register
                  </NavLink>
                ),
                key: "register",
                icon: <EditOutlined />,
              },
            ],
          },
        ]),
  ];
  return (
    <>
      <Menu
        // onClick={onClick}
        selectedKeys={[current]}
        mode="horizontal"
        items={items}
      />
    </>
  );
};
export default React.memo(Header);
