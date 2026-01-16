import React, { useEffect, useState } from "react";
import {
  Button,
  Checkbox,
  Divider,
  Form,
  Input,
  Row,
  Col,
  notification,
  message,
  Spin,
} from "antd";
import type { FormProps } from "antd";
import "./login.scss";
import { useNavigate } from "react-router-dom";
import { LoginApi } from "services/api.service";
import { useCurrentContext } from "components/context/context";
import { LoadingOutlined } from "@ant-design/icons";
const Login: React.FC = () => {
  type FieldType = {
    username: string;
    password: string;
    remember?: boolean;
  };
  const { isUser, setUser } = useCurrentContext();

  // ! là non‑null assertion operator. Nó nói với TypeScript: "Tin tôi đi, giá trị này không phải null hoặc undefined ở runtime",
  // auth.setUser!(res.data.data); // ép TS bỏ qua khả năng undefined
  // const auth = useContext(AuthContext)!; // ép TS tin rằng context không null

  const [form] = Form.useForm();
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  // Handle Login
  const onFinish: FormProps<FieldType>["onFinish"] = async (values) => {
    setIsLoading(true);
    try {
      const { username, password } = values;
      const res = await LoginApi(username, password);

      const payload = res?.data?.data;
      //?? là nullish coalescing: chọn giá trị bên phải chỉ khi bên trái là null hoặc undefined.
      const user = payload;

      if (user) {
        message.success("Login Success !");
        localStorage.setItem("access_token", payload?.access_token || "");
        setUser(user.user);
        console.log(user.user.role);
        if (user.user.role === "USER") {
          navigate("/");
        } else {
          navigate("/admin");
        }
      } else {
        notification.error({
          message: res.data.message || "Login failed!",
        });
      }
    } catch (err) {
      console.error("Login error:", err);
      let msg = "Login failed!";
      if (err && typeof err === "object") {
        const error = err as {
          response?: { data?: { message?: string } };
          message?: string;
        };
        msg =
          error?.response?.data?.message || error?.message || "Login failed!";
      }
      notification.error({ message: msg });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Failed Login
  const onFinishFailed: FormProps<FieldType>["onFinishFailed"] = (
    errorInfo
  ) => {
    console.log("Failed:", errorInfo);
  };
  const onReset = () => {
    form.resetFields();
  };

  const onKeyEnter = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter" || event.keyCode === 13) {
      form.submit();
    }
  };

  useEffect(() => {
    console.log(isUser);
    if (isUser?.id) {
      const timer = setTimeout(() => {
        // redirect theo role
        if (isUser.role === "USER") {
          navigate("/");
        } else if (isUser.role === "ADMIN") {
          navigate("/admin");
        }
      }, 3000); // 3 giây

      return () => clearTimeout(timer); // cleanup timer nếu component unmount
    }
  }, [isUser]);
  return isUser?.id ? (
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
      <div className="loginPage">
        <Form
          name="basic"
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
          style={{ maxWidth: 600 }}
          initialValues={{ remember: true }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
          form={form}
          className="formStyle"
        >
          <div
            style={{
              marginBottom: "2rem",
              fontSize: "2rem",
              fontWeight: "bolder",
              textAlign: "center",
            }}
          >
            <div>Đăng Nhập</div>
          </div>
          <Form.Item<FieldType>
            label="Username"
            name="username"
            rules={[
              { required: true, message: "Please input your username!" },
              { type: "email", message: "please fill in email" },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item<FieldType>
            label="Password"
            name="password"
            rules={[
              { required: true, message: "Please input your password!" },
              {
                min: 5,
                message: "it nhat 5 ky tu",
              },
            ]}
          >
            <Input.Password onKeyDown={onKeyEnter} />
          </Form.Item>

          <Form.Item<FieldType>
            name="remember"
            valuePropName="checked"
            label={null}
          >
            <Checkbox>Remember me</Checkbox>
          </Form.Item>
          <Form.Item label={null}>
            <Button
              type="primary"
              // htmlType="submit"
              className="loginPag"
              onClick={() => {
                form.submit();
              }}
              loading={isLoading}
            >
              Submit
            </Button>

            <Button onClick={onReset} style={{ padding: "0 2rem" }}>
              Reset
            </Button>
          </Form.Item>
          <Divider />
          <Row>
            <Col
              style={{
                width: "100%",
                display: "flex",
                justifyContent: "center",
              }}
            >
              <a href="/register" target="_blank" rel="noopener noreferrer">
                Đăng ký
              </a>
            </Col>
          </Row>
        </Form>
      </div>
    </>
  );
};
export default Login;
