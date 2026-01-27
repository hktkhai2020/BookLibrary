import { Link, useNavigate, Outlet, useLocation } from "react-router-dom";
import React, { useEffect, useState } from "react";
import {
  AppstoreOutlined,
  DollarCircleOutlined,
  ExceptionOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  TeamOutlined,
  UserOutlined,
} from "@ant-design/icons";
import type { MenuProps } from "antd";
import { Layout, Menu, theme, Dropdown, Space, App } from "antd";
import { useCurrentContext } from "components/context/context";
import { logoutAccountAPI } from "@/services/api.service";

const LayoutAdmin: React.FC = () => {
  const { message } = App.useApp();

  const location = useLocation();

  const [activeMenu, setActiveMenu] = useState("dashboard");
  const [openKeys, setOpenKeys] = useState<string[]>([]);
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();

  const { isUser, setUser } = useCurrentContext();
  const { Content, Sider } = Layout;
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  useEffect(() => {
    if (location.pathname === "/admin/dashboard") {
      setActiveMenu("dashboard");
      setOpenKeys([]);
    } else if (location.pathname === "/admin/user") {
      setActiveMenu("crud");
      setOpenKeys(["user"]);
    } else if (location.pathname === "/admin/book") {
      setActiveMenu("book");
      setOpenKeys([]);
    } else if (location.pathname === "/admin/order") {
      setActiveMenu("order");
      setOpenKeys([]);
    }
  }, [location.pathname]);
  const items: MenuProps["items"] = [
    {
      label: <Link to="/admin/dashboard">Dashboard</Link>,
      key: "dashboard",
      icon: <AppstoreOutlined />,
    },
    { type: "divider" },
    {
      label: <span>Manage Users</span>,
      key: "user",
      icon: <UserOutlined />,
      children: [
        {
          label: <Link to="/admin/user">CRUD</Link>,
          key: "crud",
          icon: <TeamOutlined />,
        },
        // {
        //     label: 'Files1',
        //     key: 'file1',
        //     icon: <TeamOutlined />,
        // }
      ],
    },
    { type: "divider" },
    {
      label: <Link to="/admin/book">Manage Books</Link>,
      key: "book",
      icon: <ExceptionOutlined />,
    },
    { type: "divider" },
    {
      label: <Link to="/admin/order">Manage Orders</Link>,
      key: "order",
      icon: <DollarCircleOutlined />,
    },
  ];
  const handleLogout = async () => {
    const res = await logoutAccountAPI();
    if (res.data) {
      setUser(null);
      localStorage.removeItem("access_token");
      message.success(`${res.data.data}`);
      navigate("/");
    }
  };
  const itemsDropdown = [
    {
      label: (
        <label style={{ cursor: "pointer" }} onClick={() => alert("me")}>
          Quản lý tài khoản
        </label>
      ),
      key: "account",
    },
    {
      label: <Link to={"/"}>Trang chủ</Link>,
      key: "home",
    },
    {
      label: (
        <label style={{ cursor: "pointer" }} onClick={() => handleLogout()}>
          Đăng xuất
        </label>
      ),
      key: "logout",
    },
  ];

  return (
    <>
      <div style={{ height: "100vh" }}>
        <Layout
          style={{
            //   padding: "24px 0",
            //   background: colorBgContainer,
            borderRadius: borderRadiusLG,
            height: "100%",
          }}
        >
          <Sider
            style={{ background: colorBgContainer, padding: "1rem 0" }}
            width={200}
            collapsible
            collapsed={collapsed}
            onCollapse={(value) => {
              setCollapsed(value);
            }}
          >
            <Menu
              mode="inline"
              selectedKeys={[activeMenu]}
              openKeys={openKeys}
              onOpenChange={setOpenKeys}
              style={{ height: "100%" }}
              items={items}
              onClick={(e) => {
                setActiveMenu(e.key);
              }}
            />
          </Sider>
          <Layout>
            <div
              className="admin-header"
              style={{
                height: "5rem",
                borderBottom: "1px solid #ebebeb",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "0 15px",
              }}
            >
              <span>
                {React.createElement(
                  collapsed ? MenuUnfoldOutlined : MenuFoldOutlined,
                  {
                    className: "trigger",
                    onClick: () => setCollapsed(!collapsed),
                  },
                )}
              </span>
              <Dropdown menu={{ items: itemsDropdown }} trigger={["click"]}>
                <Space style={{ cursor: "pointer" }}>
                  <img
                    src={`https://backend-booklaborary.onrender.com/images/avatar/${isUser?.avatar}`}
                    alt="avatar"
                    style={{
                      width: "4rem",
                      height: "4rem",
                      objectFit: "cover",
                      borderRadius: "50%",
                      border: "0.5px solid gray",
                    }}
                  />
                  <span> {isUser?.fullName}</span>
                </Space>
              </Dropdown>
            </div>
            <Content style={{ padding: "0 24px", minHeight: 280 }}>
              <Outlet />
            </Content>
          </Layout>
        </Layout>
      </div>
    </>
  );
};
export default LayoutAdmin;
