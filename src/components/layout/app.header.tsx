import React, { useState } from "react";
import { Input, Dropdown, Avatar, message } from "antd";
import type { MenuProps } from "antd";
import {
  SearchOutlined,
  UserOutlined,
  LogoutOutlined,
  HomeOutlined,
  SettingOutlined,
  RobotOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useCurrentContext } from "components/context/context";
import { logoutAccountAPI } from "@/services/api.service";
import AIChatModal from "./ai-chat.modal";

const Header: React.FC = () => {
  const { isUser, setUser } = useCurrentContext();
  const navigate = useNavigate();
  const [searchValue, setSearchValue] = useState("");
  const [isAIModalOpen, setIsAIModalOpen] = useState(false);

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
          type: "divider" as const,
        },
        ...(isUser.role === "ADMIN"
          ? [
              {
                key: "admin",
                label: (
                  <div
                    className="flex items-center gap-2 cursor-pointer"
                    onClick={() => navigate("/admin")}
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
            <div className="flex items-center gap-4">
              {isUser ? (
                <Dropdown
                  menu={{ items: userMenuItems }}
                  placement="bottomRight"
                  trigger={["click"]}
                >
                  <div className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity">
                    <Avatar
                      src={isUser.avatar}
                      icon={<UserOutlined />}
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
    </>
  );
};

export default React.memo(Header);
