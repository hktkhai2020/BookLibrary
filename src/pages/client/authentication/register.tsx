import React, { useState } from "react";
import { Form, Input, Button, Row, Col, message } from "antd";
import type { FormProps } from "antd";
import { registerAPI } from "services/api.service";
import "./register.scss";
import { useNavigate } from "react-router-dom";

const Register: React.FC = () => {
  type FieldType = {
    fullName: string;
    email: string;
    password: string;
    phone: string;
  };

  const [form] = Form.useForm<FieldType>();
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const onFinish: FormProps<FieldType>["onFinish"] = async (values) => {
    setIsLoading(true);
    try {
      const res = await registerAPI(
        values.fullName,
        values.email,
        values.password,
        values.phone
      );
      message.success("Đăng ký thành công. Vui lòng đăng nhập.");
      form.resetFields();
      navigate("/login", { replace: true });
    } catch (err: any) {
      console.error("register error:", err);
      const text = err?.response?.data?.message || "Đăng ký thất bại";
      message.error(text);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="registerPage">
      <div className="registerCard">
        <div className="cardHeader">
          <h2>Đăng ký</h2>
          <p>Hoàn tất thông tin để tạo tài khoản</p>
        </div>

        <Form
          form={form}
          name="registerForm"
          layout="vertical"
          onFinish={onFinish}
          className="registerForm"
        >
          <Row gutter={16}>
            <Col xs={24} sm={24}>
              <Form.Item
                label="Full name"
                name="fullName"
                rules={[
                  { required: true, message: "Vui lòng nhập họ tên" },
                  { min: 2, message: "Tên phải có ít nhất 2 ký tự" },
                ]}
              >
                <Input placeholder="Full name" />
              </Form.Item>
            </Col>
          </Row>
          <Col xs={24} sm={24}>
            <Form.Item
              label="Email"
              name="email"
              rules={[
                { required: true, message: "Vui lòng nhập email" },
                { type: "email", message: "Email không hợp lệ" },
              ]}
            >
              <Input placeholder="Email" />
            </Form.Item>
          </Col>

          <Col xs={24} sm={24}>
            <Form.Item
              label="Password"
              name="password"
              rules={[
                { required: true, message: "Vui lòng nhập mật khẩu" },
                { min: 6, message: "Mật khẩu tối thiểu 6 ký tự" },
              ]}
            >
              <Input.Password placeholder="Password" style={{ color: "red" }} />
            </Form.Item>
          </Col>

          <Col xs={24} sm={24}>
            <Form.Item
              label="Confirm Password"
              name="confirmPassword"
              dependencies={["password"]}
              rules={[
                { required: true, message: "Vui lòng xác nhận mật khẩu" },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue("password") === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error("Mật khẩu không khớp!"));
                  },
                }),
              ]}
            >
              <Input.Password placeholder="Confirm Password" />
            </Form.Item>
          </Col>
          <Col xs={24} sm={24}>
            <Form.Item
              label="Phone"
              name="phone"
              rules={[
                { required: true, message: "Vui lòng nhập số điện thoại" },
                {
                  pattern: /^\d{9,15}$/,
                  message: "Số điện thoại không hợp lệ",
                },
              ]}
            >
              <Input placeholder="Phone" />
            </Form.Item>
          </Col>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={isLoading}
              disabled={isLoading}
              className="submitBtn"
            >
              Đăng ký
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default Register;
