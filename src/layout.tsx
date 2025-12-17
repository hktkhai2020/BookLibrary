import { Outlet } from "react-router-dom";
import Header from "components/layout/app.header";
import Footer from "components/layout/app.footer";
import { Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import { useCurrentContext } from "components/context/context";
function Layout() {
  const { isAppGlobalLoading } = useCurrentContext();

  return isAppGlobalLoading ? (
    <Spin
      style={{
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translateY(-50%) translateX(-50%)",
      }}
      // spinning={isAppLoading}
      indicator={<LoadingOutlined style={{ fontSize: 48 }} />}
    />
  ) : (
    <>
      <Header />
      <Outlet />
      <Footer />
    </>
  );
}

export default Layout;
