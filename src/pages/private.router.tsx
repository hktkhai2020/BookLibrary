import { useCurrentContext } from "components/context/context";
import { Link, useLocation } from "react-router-dom";
import { Result, Button } from "antd";
// use check permission
const PrivateRoute = (props: { children: React.ReactNode }) => {
  const { isUser } = useCurrentContext();
  const location = useLocation();
  if (
    isUser &&
    isUser.role == "USER" &&
    !location.pathname.includes("/admin")
  ) {
    return <>{props.children}</>;
  }

  if (
    isUser &&
    isUser.role == "ADMIN"
    //  && location.pathname.includes("/admin")
  ) {
    return <>{props.children}</>;
  }
  return (
    <Result
      status="403"
      title="Unauthorize!"
      subTitle={"Bạn cần đăng nhập để truy cập nguồn tài nguyên này."}
      extra={
        <Button type="primary">
          <Link to="/">
            <span>Back to page login</span>
          </Link>
        </Button>
      }
    />
  );
};
export default PrivateRoute;
