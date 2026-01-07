import React, { MutableRefObject, useEffect } from "react";
import { Form, Input, Modal, App } from "antd";
import { updateUser } from "services/api.service";
import { ActionType } from "@ant-design/pro-components";
const UpdateUser: React.FC<{
  open: boolean;
  setUpdateUser: (open: boolean) => void;
  userUpdate: IUserTable | null;
  actionRef: MutableRefObject<ActionType | undefined>;
}> = ({ open, setUpdateUser, userUpdate, actionRef }) => {
  const [form] = Form.useForm<IUserTable>();
  const { message } = App.useApp();

  // Set giá trị vào form khi userUpdate thay đổi hoặc modal mở
  useEffect(() => {
    if (open && userUpdate) {
      form.setFieldsValue({
        _id: userUpdate._id,
        email: userUpdate.email,
        fullName: userUpdate.fullName,
        phone: userUpdate.phone,
      });
    }
  }, [open, userUpdate, form]);

  const onFinish = async () => {
    try {
      const allValues = form.getFieldsValue();
      // Chỉ lấy _id, fullName, phone - bỏ qua email
      const values = {
        _id: allValues._id,
        fullName: allValues.fullName,
        phone: allValues.phone,
      };
      const res = await updateUser(values);
      if (res.data.data) {
        message.success(res.data.message || "Update user successfully!");
        setUpdateUser(false);
        form.resetFields();
        actionRef.current?.reload();
      }
    } catch (error) {
      console.error("Update user error:", error);
      message.error("Failed to update user. Please try again.");
    }
  };

  return (
    <>
      <Modal
        title="Update User"
        open={open}
        onCancel={() => {
          setUpdateUser(false);
          form.resetFields(); // Reset form khi đóng
        }}
        onOk={() => {
          form.submit();
        }}
        cancelText="Quit"
        okText="Update"
      >
        <Form form={form} layout="vertical" onFinish={onFinish}>
          {/* Hidden field để lưu _id */}
          <Form.Item<IUserTable> name="_id" hidden>
            <Input type="hidden" />
          </Form.Item>
          <Form.Item<IUserTable> label="email" name="email">
            {/* name ở đây ăn theo dữ liệu ở trên */}
            <Input placeholder="Email" disabled />
          </Form.Item>
          <Form.Item<IUserTable> label="fullName" name="fullName">
            <Input placeholder="Full name" />
          </Form.Item>
          <Form.Item<IUserTable> label="phone" name="phone">
            <Input placeholder="Phone" />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};
export default UpdateUser;
