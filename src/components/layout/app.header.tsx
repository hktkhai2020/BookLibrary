import React, { useState } from "react";
import {
  Input,
  Dropdown,
  Avatar,
  message,
  Badge,
  Popover,
  Button,
  Divider,
} from "antd";
import type { MenuProps } from "antd";
import {
  SearchOutlined,
  UserOutlined,
  LogoutOutlined,
  HomeOutlined,
  SettingOutlined,
  RobotOutlined,
  ShoppingCartOutlined,
  HistoryOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useCurrentContext } from "components/context/context";
import { logoutAccountAPI } from "@/services/api.service";
import AIChatModal from "./ai-chat.modal";
import ProfilePage from "pages/client/profile/profile";
const Header: React.FC = () => {
  const { isUser, setUser, shoppingCart } = useCurrentContext();
  const navigate = useNavigate();
  const [searchValue, setSearchValue] = useState("");
  const [isAIModalOpen, setIsAIModalOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const handleLogout = async () => {
    try {
      const res = await logoutAccountAPI();
      if (res.data) {
        setUser(null);
        localStorage.removeItem("access_token");
        message.success(`${res.data.data}`);
        navigate("/");
      }
    } catch {
      message.error("Logout failed!");
    }
  };

  const handleSearch = (value: string) => {
    if (value.trim()) {
      setSearchValue(value);
      setIsAIModalOpen(true);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && searchValue.trim()) {
      setIsAIModalOpen(true);
    }
  };
  const contentCart = (
    <div className="w-80 max-h-[400px] flex flex-col ">
      {shoppingCart.length > 0 ? (
        <>
          <div className="flex-1 overflow-y-auto px-1 py-2 space-y-3">
            {shoppingCart.map((item) => (
              <div
                key={item._id}
                className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg transition-colors group"
              >
                <div className="w-12 h-16 shrink-0">
                  <img
                    src={`https://backend-booklaborary.onrender.com/images/book/${item.detail.thumbnail}`}
                    alt={item.detail.thumbnail}
                    className="w-full h-full object-cover rounded shadow-sm group-hover:shadow-md transition-shadow"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold text-gray-800 truncate mb-1">
                    {item.detail.mainText}
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-gray-500 font-medium">
                      SL: {item.quantity}
                    </span>
                    <span className="text-blue-600 font-bold">
                      {new Intl.NumberFormat("vi-VN", {
                        style: "currency",
                        currency: "VND",
                      }).format(item.detail.price)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <Divider className="my-2" />
          <div className="mt-2 p-1">
            <Button
              type="primary"
              className="w-full h-10 bg-blue-600 hover:bg-blue-700 font-semibold"
              onClick={() => navigate("/order")}
            >
              Xem Giỏ Hàng
            </Button>
          </div>
        </>
      ) : (
        <div className="py-10 flex flex-col items-center gap-3 text-gray-400">
          <ShoppingCartOutlined className="text-4xl opacity-20" />
          <p className="text-sm">Giỏ hàng của bạn đang trống</p>
        </div>
      )}
    </div>
  );
  const userMenuItems: MenuProps["items"] = isUser
    ? ([
        {
          key: "user-info",
          label: (
            <div className="px-2 py-1">
              <div className="font-semibold text-sm">{isUser.fullName}</div>
              <div className="text-xs text-gray-500">{isUser.email}</div>
            </div>
          ),
          disabled: true,
        },
        {
          key: "profile-detail",
          label: (
            <div
              className="flex items-center gap-2 cursor-pointer"
              onClick={() => setIsProfileOpen(true)}
            >
              <UserOutlined />
              <span>Thông tin cá nhân</span>
            </div>
          ),
        },
        {
          key: "order-history",
          label: (
            <div
              className="flex items-center gap-2 cursor-pointer"
              onClick={() => navigate("/order/history")}
            >
              <HistoryOutlined />
              <span>Lịch sử đơn hàng</span>
            </div>
          ),
        },
        {
          type: "divider" as const,
        },
        ...(isUser.role === "ADMIN"
          ? [
              {
                key: "admin",
                label: (
                  <div
                    className="flex items-center gap-2 cursor-pointer"
                    onClick={() => navigate("/admin/dashboard")}
                  >
                    <SettingOutlined />
                    <span>Quản trị</span>
                  </div>
                ),
              },
              {
                key: "home",
                label: (
                  <div
                    className="flex items-center gap-2 cursor-pointer"
                    onClick={() => navigate("/")}
                  >
                    <HomeOutlined />
                    <span>Home</span>
                  </div>
                ),
              },
              {
                type: "divider" as const,
              },
            ]
          : []),
        {
          key: "logout",
          label: (
            <div
              className="flex items-center gap-2 cursor-pointer text-red-500"
              onClick={handleLogout}
            >
              <LogoutOutlined />
              <span>Đăng xuất</span>
            </div>
          ),
        },
      ] as MenuProps["items"])
    : [
        {
          key: "login",
          label: (
            <div
              className="flex items-center gap-2 cursor-pointer"
              onClick={() => navigate("/login")}
            >
              <UserOutlined />
              <span>Đăng nhập</span>
            </div>
          ),
        },
      ];

  return (
    <>
      <header className="w-full bg-white border-b border-gray-200 shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo/Brand */}
            <div
              className="flex items-center cursor-pointer"
              onClick={() => navigate("/")}
            >
              <h1 className="text-xl sm:text-2xl font-bold text-blue-600">
                BookStore
              </h1>
            </div>

            {/* Search Bar */}
            <div className="flex-1 max-w-2xl mx-4 sm:mx-8">
              <Input
                size="large"
                placeholder="Hỏi AI về sách, tác giả..."
                prefix={<SearchOutlined className="text-gray-400" />}
                suffix={
                  <RobotOutlined
                    className="text-blue-500 cursor-pointer"
                    title="AI Assistant"
                    onClick={() => {
                      if (searchValue.trim()) {
                        handleSearch(searchValue);
                      }
                    }}
                  />
                }
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                onPressEnter={handleKeyPress}
                allowClear
                className="w-full"
              />
            </div>

            {/* User Menu */}
            <div className="flex items-center gap-10">
              <Badge count={shoppingCart.length || 0} className="w-10 h-10   ">
                <Popover placement="bottom" title="Carts" content={contentCart}>
                  <ShoppingCartOutlined className="text-blue-500 cursor-pointer w-full h-full" />
                </Popover>
              </Badge>

              {isUser ? (
                <Dropdown
                  menu={{ items: userMenuItems }}
                  placement="bottomRight"
                  trigger={["click"]}
                >
                  <div className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity">
                    <Avatar
                      src={`https://backend-booklaborary.onrender.com/images/avatar/${isUser.avatar}`}
                      className="border-2 border-blue-500"
                    />
                    <span className="hidden sm:inline text-sm font-medium">
                      {isUser.fullName}
                    </span>
                  </div>
                </Dropdown>
              ) : (
                <div
                  className="flex items-center gap-2 cursor-pointer px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors"
                  onClick={() => navigate("/login")}
                >
                  <UserOutlined />
                  <span className="hidden sm:inline text-sm">Đăng nhập</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* AI Chat Modal */}
      <AIChatModal
        isOpen={isAIModalOpen}
        onClose={() => {
          setIsAIModalOpen(false);
          setSearchValue("");
        }}
        initialQuestion={searchValue}
      />

      <ProfilePage
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
      />
    </>
  );
};

export default React.memo(Header);
