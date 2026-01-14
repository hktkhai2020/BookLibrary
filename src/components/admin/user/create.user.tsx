import { Modal, Form, Row, Col, Input, App } from "antd";
import type { FormProps } from "antd";
import { createUser } from "services/api.service";
import axios from "axios";
import { ActionType } from "@ant-design/pro-components";
import type { MutableRefObject } from "react";

type AxiosErrorResponse = {
  message?: string;
};

const CreateUser: React.FC<{
  open: boolean;
  setOpenModal: (T: boolean) => void;
  actionRef: MutableRefObject<ActionType | undefined>;
}> = ({ open, setOpenModal, actionRef }) => {
  type FieldType = {
    fullName: string;
    email: string;
    password: string;
    phone: string;
  };
  const { message } = App.useApp();

  const [form] = Form.useForm<FieldType>();
  const onFinish: FormProps<FieldType>["onFinish"] = async (values) => {
    try {
      await createUser(
        values.fullName,
        values.email,
        values.password,
        values.phone
      );
      message.success("Đăng ký thành công. Vui lòng đăng nhập.");
      actionRef.current?.reload();
      setOpenModal(false);
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        //, dùng axios.isAxiosError() để xác định error có response, rồi mới đọc response.data
        const msg =
          (error.response?.data as AxiosErrorResponse | undefined)?.message ??
          "Tạo user thất bại";
        //?? "Tạo user thất bại" (nullish coalescing): nếu vế trái là null hoặc undefined thì dùng chuỗi fallback "Tạo user thất bại".
        message.error(msg);
        return;
      }
      message.error(error instanceof Error ? error.message : "Có lỗi xảy ra");
    }
  };
  return (
    <>
      <Modal
        title="Create User"
        open={open}
        onOk={() => {
          form.submit();
        }}
        onCancel={() => { 
          setOpenModal(false);
          form.resetFields();
        }}
        maskClosable={false}
        cancelText={"Quit"}
        okText={"ADD"}
      >
        <Form
          form={form}
          name="registerForm"
          layout="vertical"
          onFinish={onFinish}
          className="registerForm"
        >
          <Row gutter={16}>
            <Col xs={24} sm={24}>
              <Form.Item<FieldType>
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
            <Form.Item<FieldType>
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
            <Form.Item<FieldType>
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
            <Form.Item<FieldType>
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
        </Form>
      </Modal>
    </>
  );
};

export default CreateUser;
