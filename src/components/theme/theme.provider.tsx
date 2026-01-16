import { useEffect } from "react";
import { theme } from "antd";

/**
 * Component để inject Ant Design theme tokens vào CSS variables
 * Cho phép sử dụng các giá trị từ Ant Design theme trong Tailwind CSS
 */
export const ThemeVariablesProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { token } = theme.useToken();

  useEffect(() => {
    // Inject các giá trị từ Ant Design theme vào CSS variables
    const root = document.documentElement;

    // Border radius
    root.style.setProperty(
      "--ant-border-radius-lg",
      `${token.borderRadiusLG}px`
    );
    root.style.setProperty("--ant-border-radius-md", `${token.borderRadius}px`);
    root.style.setProperty(
      "--ant-border-radius-sm",
      `${token.borderRadiusSM}px`
    );

    // Colors
    root.style.setProperty("--ant-color-bg-container", token.colorBgContainer);
    root.style.setProperty("--ant-color-primary", token.colorPrimary);
    root.style.setProperty("--ant-color-success", token.colorSuccess);
    root.style.setProperty("--ant-color-warning", token.colorWarning);
    root.style.setProperty("--ant-color-error", token.colorError);
    root.style.setProperty("--ant-color-info", token.colorInfo);
  }, [token]);

  return <>{children}</>;
};
