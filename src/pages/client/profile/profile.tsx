import { PlusOutlined } from "@ant-design/icons";
import {
  Modal,
  Tabs,
  Upload,
  Form,
  Row,
  Col,
  Input,
  UploadFile,
  Button,
  message,
  type FormProps,
  type TabsProps,
} from "antd";

import { useCurrentContext } from "components/context/context";
import { useEffect, useState } from "react";

import {
  uploadAvatarAPI,
  updateInfoAPI,
  updatePasswordAPI,
  logoutAccountAPI,
} from "services/api.service";
import { UploadRequestOption as RcCustomRequestOptions } from "rc-upload/lib/interface";
import { useNavigate } from "react-router-dom";
import axios from "axios";
interface IUpdateInfo {
  name: string;
  phone: string;
  avatar: UploadFile[];
  email: string;
}
interface IChangePassword {
  email: string;
  currentPassword: string;
  newPassword: string;
}

const ProfilePage: React.FC<{ isOpen: boolean; onClose: () => void }> = ({
  isOpen,
  onClose,
}) => {
  const { isUser, setUser } = useCurrentContext();

  const [activeTabKey, setActiveTabKey] = useState<string>("Profile");
  const [form] = Form.useForm();
  const [formChangePassword] = Form.useForm();
  const [fileListAvatar, setFileListAvatar] = useState<UploadFile[]>([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  // Quan trọng: Đồng bộ dữ liệu vào Form khi isUser hoặc Modal thay đổi
  useEffect(() => {
    if (isUser && isOpen) {
      const initialAvatar = isUser.avatar
        ? [
            {
              uid: "-1",
              name: isUser.avatar,
              status: "done" as const,
              url: `${import.meta.env.VITE_BACKEND_URL}/images/avatar/${
                isUser.avatar
              }`,
            },
          ]
        : [];

      form.setFieldsValue({
        name: isUser.fullName,
        phone: isUser.phone,
        email: isUser.email,
        avatar: initialAvatar,
      });
      formChangePassword.setFieldsValue({
        email: isUser.email,
      });

      setFileListAvatar(initialAvatar);
    }
  }, [isUser, isOpen, form]);

  const validateFile = (file: File): boolean => {
    const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
    const isValidImageType = file.type.startsWith("image/");

    if (!isValidImageType) {
      message.error("Chỉ chấp nhận file ảnh (JPG, PNG, GIF, WEBP, ...)");
      return false;
    }

    if (file.size > MAX_FILE_SIZE) {
      message.error("Kích thước file phải nhỏ hơn 10MB");
      return false;
    }

    return true;
  };
  const beforeUpload = (file: File) => {
    const isValid = validateFile(file);
    if (!isValid) {
      // Sử dụng Upload.LIST_IGNORE để loại bỏ file không hợp lệ khỏi fileList
      return Upload.LIST_IGNORE;
    }
    return true; // Return false để không upload và không gọi customRequest chỉ lưu trong form state
  };
  const handleUploadAvatar = async (option: RcCustomRequestOptions) => {
    const { onSuccess, onError, file } = option;

    try {
      // `file` may be an UploadFile wrapper or a native File; ensure we pass a File to API
      const fileToUpload = (file as UploadFile).originFileObj || (file as File);

      const res = await uploadAvatarAPI(fileToUpload as File);

      if (res && res.data && res.data.data) {
        const uploadFile: UploadFile = {
          uid: (file as UploadFile).uid,
          name: res.data.data.fileUploaded,
          fileName: res.data.data.fileUploaded,
          status: "done",
          url: `http://localhost:8080/images/book/${res.data.data.fileUploaded}`,
        } as UploadFile;

        setFileListAvatar([uploadFile]);
        form.setFieldsValue({ avatar: [uploadFile] });
        onSuccess?.(res);
        message.success("Upload image success!");
      } else {
        throw new Error("Upload failed: invalid server response");
      }
    } catch (err) {
      onError?.(err as Error);
      message.error((err as Error)?.message || "Upload image failed");
    }
  };
  const onRemove = () => {
    const newList: UploadFile[] = [];
    setFileListAvatar(newList);
    // Sync to Form value immediately so Form.Item nhận giá trị mới
    form.setFieldsValue({ avatar: newList });
  };
  const normFile = (e: { fileList: UploadFile[] } | UploadFile[]) => {
    let fileList: UploadFile[] = [];
    if (Array.isArray(e)) {
      fileList = e;
    } else {
      fileList = e?.fileList || [];
    }

    // Tạo preview URL cho các file mới (file có originFileObj nhưng chưa có thumbUrl)
    return fileList.map((file) => {
      // Nếu file đã có thumbUrl hoặc url thì giữ nguyên
      if (file.thumbUrl || file.url) {
        return file;
      }

      // Nếu file có originFileObj (file mới được chọn), tạo preview URL
      if (file.originFileObj) {
        const objUrl = URL.createObjectURL(file.originFileObj);
        return {
          ...file,
          thumbUrl: objUrl,
          url: objUrl,
        };
      }

      return file;
    });
  };
  const onFinishInfo: FormProps<IUpdateInfo>["onFinish"] = async (values) => {
    const { name, phone } = values;
    const avatar = fileListAvatar[0]?.name || isUser?.avatar || "";

    if (isUser) {
      setLoading(true);
      try {
        const res = await updateInfoAPI({
          fullName: name,
          phone,
          avatar,
          _id: isUser.id,
        });

        if (res && res.data) {
          message.success("Cập nhật thông tin thành công");
          // Cập nhật lại context để Header/Avatar thay đổi theo
          setUser({
            ...isUser,
            fullName: name,
            phone: phone,
            avatar: avatar,
          });
        } else {
          message.error(res.data.message || "Cập nhật thất bại");
        }
      } catch (error) {
        if (axios.isAxiosError(error)) {
          message.error(error.response?.data?.message || "Có lỗi xảy ra");
        } else {
          message.error("Có lỗi xảy ra");
        }
      } finally {
        onClose();
        setLoading(false);
      }
    }
  };
  const onFinishChangePassword: FormProps<IChangePassword>["onFinish"] = async (
    values
  ) => {
    const { currentPassword, newPassword } = values;

    if (isUser) {
      setLoading(true);
      try {
        const res = await updatePasswordAPI({
          email: isUser.email,
          oldpass: currentPassword,
          newpass: newPassword,
        });

        if (res && res.data) {
          message.success("Cập nhật thông tin thành công");
          localStorage.removeItem("access_token");
          logoutAccountAPI();
          onClose();
          setUser(null);
          navigate("/");
        } else {
          message.error(res.data.message || "Cập nhật thất bại");
        }
      } catch (error) {
        if (axios.isAxiosError(error)) {
          message.error(error.response?.data?.message || "Có lỗi xảy ra");
        } else {
          message.error("Có lỗi xảy ra");
        }
      } finally {
        setLoading(false);
      }
    }
  };

  const items: TabsProps["items"] = [
    {
      key: "Profile",
      label: "Cập nhật thông tin",
      children: (
        <div className="profile-info flex w-full">
          <Form
            form={form}
            name="profileForm"
            layout="vertical"
            onFinish={onFinishInfo}
            className=" w-full"
          >
            <Row gutter={[20, 20]}>
              <Col span={10}>
                <div className="flex flex-col items-center justify-center h-full w-full gap-4">
                  <Form.Item<IUpdateInfo>
                    name="avatar"
                    valuePropName="fileList"
                    getValueFromEvent={normFile}
                  >
                    <Upload
                      listType="picture-circle"
                      showUploadList={{ showPreviewIcon: false }}
                      beforeUpload={beforeUpload}
                      fileList={fileListAvatar}
                      onRemove={() => {
                        onRemove();
                      }}
                      customRequest={(options) => {
                        handleUploadAvatar(options);
                      }}
                    >
                      {fileListAvatar.length === 0 && <PlusOutlined />}
                    </Upload>
                  </Form.Item>
                  <span className="text-gray-500 font-medium">
                    Ảnh đại diện
                  </span>
                </div>
              </Col>
              <Col span={14}>
                <Form.Item<IUpdateInfo> name="email" label="Email">
                  <Input disabled />
                </Form.Item>
                <Form.Item<IUpdateInfo> name="name" label="Tên">
                  <Input />
                </Form.Item>

                <Form.Item<IUpdateInfo> name="phone" label="Số điện thoại">
                  <Input />
                </Form.Item>
                <Form.Item>
                  <Button
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                    type="primary"
                    htmlType="submit"
                    loading={loading}
                  >
                    Cập nhật
                  </Button>
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </div>
      ),
    },
    {
      key: "Password",
      label: "Đổi mật khẩu",
      children: (
        <div className="profile-password">
          <Form
            form={formChangePassword}
            name="profileFormChangePassword"
            layout="vertical"
            onFinish={onFinishChangePassword}
            className=" w-full"
          >
            <Row gutter={[20, 20]}>
              <Col span={24}>
                <Form.Item<IChangePassword> name="email" label="Email">
                  <Input disabled />
                </Form.Item>
                <Form.Item<IChangePassword>
                  name="currentPassword"
                  label="Mật khẩu hiện tại"
                >
                  <Input.Password />
                </Form.Item>

                <Form.Item<IChangePassword>
                  name="newPassword"
                  label="Mật khẩu mới"
                >
                  <Input.Password />
                </Form.Item>
                <Form.Item>
                  <Button
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                    type="primary"
                    htmlType="submit"
                    loading={loading}
                  >
                    Cập nhật
                  </Button>
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </div>
      ),
    },
  ];
  return (
    <Modal
      open={isOpen}
      title="Thông tin tài khoản"
      onCancel={onClose}
      footer={null}
      width={700}
    >
      <Tabs
        activeKey={activeTabKey}
        items={items}
        className="text-xs sm:text-sm"
        onChange={(key) => {
          setActiveTabKey(key);
        }}
      />
    </Modal>
  );
};

export default ProfilePage;
