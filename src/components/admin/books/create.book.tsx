import {
  Modal,
  Form,
  Row,
  Col,
  Input,
  App,
  InputNumber,
  Select,
  Upload,
  Image,
} from "antd";
import type { FormProps, UploadFile } from "antd";
import { createBook, uploadImage } from "services/api.service";
import { ActionType } from "@ant-design/pro-components";
import { PlusOutlined } from "@ant-design/icons";
import { useEffect, useState, type MutableRefObject } from "react";
import axios from "axios";
import { UploadRequestOption as RcCustomRequestOptions } from "rc-upload/lib/interface";

type AxiosErrorResponse = {
  message?: string;
};
interface IUploadFile {
  fileName: string;
}
type FieldType = {
  thumbnail: IUploadFile[];
  slider: IUploadFile[];
  mainText: string;
  author: string;
  price: number;
  quantity: number;
  category: string;
};
interface category {
  statusCode: number;
  message: string;
  data: string[];
  author: string;
}
type imageType = "thumbnail" | "slider";

const CreateBook: React.FC<{
  open: boolean;
  setOpenModalCreate: (T: boolean) => void;
  actionRef: MutableRefObject<ActionType | undefined>;
}> = ({ open, setOpenModalCreate, actionRef }) => {
  const { message } = App.useApp();
  const [category, setCategory] = useState<category>();
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [fileListThumbnail, setFileListThumbnail] = useState<UploadFile[]>([]);
  const [fileListSlider, setFileListSlider] = useState<UploadFile[]>([]);

  const [form] = Form.useForm<FieldType>();
  // Sử dụng Form.useWatch để theo dõi giá trị thay đổi của thumbnail và slider
  const thumbnailValue = Form.useWatch("thumbnail", form);
  const sliderValue = Form.useWatch("slider", form);

  const onFinish: FormProps<FieldType>["onFinish"] = async (values) => {
    try {
      await createBook(
        fileListThumbnail[0].fileName as unknown as UploadFile[],
        fileListSlider.map((x) => x.fileName) as unknown as UploadFile[],
        values.mainText,
        values.author,
        values.price,
        values.quantity,
        values.category
      );
      message.success("Đăng ký thành công. Vui lòng đăng nhập.");
      actionRef.current?.reload();
      setOpenModalCreate(false);
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        //, dùng axios.isAxiosError() để xác định error có response, rồi mới đọc response.data
        const msg =
          (error.response?.data as AxiosErrorResponse | undefined)?.message ??
          "Tạo book thất bại";
        //?? "Tạo user thất bại" (nullish coalescing): nếu vế trái là null hoặc undefined thì dùng chuỗi fallback "Tạo user thất bại".
        message.error(msg);
        return;
      }
      message.error(error instanceof Error ? error.message : "Có lỗi xảy ra");
    }
  };

  useEffect(() => {
    fetch("http://localhost:8080/api/v1/database/category")
      .then((data) => {
        return data.json();
      })
      .then((data) => {
        setCategory(data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  // Cleanup object URLs khi modal đóng hoặc component unmount
  useEffect(() => {
    if (!open) {
      // Cleanup thumbnail preview URLs khi modal đóng
      const thumbnailFiles = form.getFieldValue("thumbnail");
      if (thumbnailFiles && Array.isArray(thumbnailFiles)) {
        thumbnailFiles.forEach((file: UploadFile) => {
          if (file?.thumbUrl && file.thumbUrl.startsWith("blob:")) {
            URL.revokeObjectURL(file.thumbUrl);
          }
          if (file?.url && file.url.startsWith("blob:")) {
            URL.revokeObjectURL(file.url);
          }
        });
      }

      // Cleanup slider preview URLs khi modal đóng
      const sliderFiles = form.getFieldValue("slider");
      if (sliderFiles && Array.isArray(sliderFiles)) {
        sliderFiles.forEach((file: UploadFile) => {
          if (file?.thumbUrl && file.thumbUrl.startsWith("blob:")) {
            URL.revokeObjectURL(file.thumbUrl);
          }
          if (file?.url && file.url.startsWith("blob:")) {
            URL.revokeObjectURL(file.url);
          }
        });
      }
    }

    // Cleanup khi component unmount
    return () => {
      const thumbnailFiles = form.getFieldValue("thumbnail");
      if (thumbnailFiles && Array.isArray(thumbnailFiles)) {
        thumbnailFiles.forEach((file: UploadFile) => {
          if (file?.thumbUrl && file.thumbUrl.startsWith("blob:")) {
            URL.revokeObjectURL(file.thumbUrl);
          }
          if (file?.url && file.url.startsWith("blob:")) {
            URL.revokeObjectURL(file.url);
          }
        });
      }

      const sliderFiles = form.getFieldValue("slider");
      if (sliderFiles && Array.isArray(sliderFiles)) {
        sliderFiles.forEach((file: UploadFile) => {
          if (file?.thumbUrl && file.thumbUrl.startsWith("blob:")) {
            URL.revokeObjectURL(file.thumbUrl);
          }
          if (file?.url && file.url.startsWith("blob:")) {
            URL.revokeObjectURL(file.url);
          }
        });
      }
    };
  }, [open, form]);

  const uploadButton = (
    <button style={{ border: 0, background: "none" }} type="button">
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>Upload</div>
    </button>
  );

  /**
   * Hàm validateFile: Kiểm tra file có hợp lệ không
   * - Kiểm tra file size < 10MB
   * - Kiểm tra file type là ảnh (image/*)
   */
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

  /**
   * Hàm beforeUpload: Validate file trước khi thêm vào form
   * - Nếu file hợp lệ: return false để không upload lên server, chỉ lưu trong form state
   * - Nếu file không hợp lệ: return Upload.LIST_IGNORE để loại bỏ file khỏi fileList
   */
  const beforeUpload = (file: File) => {
    const isValid = validateFile(file);
    if (!isValid) {
      // Sử dụng Upload.LIST_IGNORE để loại bỏ file không hợp lệ khỏi fileList
      return Upload.LIST_IGNORE;
    }
    return true; // Return false để không upload và không gọi customRequest chỉ lưu trong form state
  };

  /**
   * Hàm onRemove: Cleanup object URL khi file bị xóa
   */
  const onRemove = (file: UploadFile, type: imageType) => {
    // Cleanup object URL khi file bị xóa
    if (file.thumbUrl && file.thumbUrl.startsWith("blob:")) {
      URL.revokeObjectURL(file.thumbUrl);
    }
    if (file.url && file.url.startsWith("blob:")) {
      URL.revokeObjectURL(file.url);
    }

    if (type === "thumbnail") {
      const newList: UploadFile[] = [];
      setFileListThumbnail(newList);
      // Sync to Form value immediately so Form.Item nhận giá trị mới
      form.setFieldsValue({ thumbnail: newList });
    }

    if (type === "slider") {
      const newSlider = fileListSlider.filter((x) => x.uid !== file.uid);
      setFileListSlider(newSlider);
      // Sync to Form value immediately
      form.setFieldsValue({ slider: newSlider });
    }
  };

  // const onChange = (info: UploadChangeParam, type: imageType) => {
  //     if (info.file.status === 'uploading'){
  //       type === 'slider' ? // set loading = true but no need
  //     }
  // };

  const handleUploadFile = async (
    option: RcCustomRequestOptions,
    type: imageType
  ) => {
    const { onSuccess, onError, file } = option;

    try {
      // `file` may be an UploadFile wrapper or a native File; ensure we pass a File to API
      const fileToUpload = (file as UploadFile).originFileObj || (file as File);

      const res = await uploadImage(fileToUpload as File, "book");

      if (res && res.data && res.data.data) {
        const uploadFile: UploadFile = {
          uid: (file as UploadFile).uid,
          name: res.data.data.fileUploaded,
          fileName: res.data.data.fileUploaded,
          status: "done",
          url: `http://localhost:8080/images/book/${res.data.data.fileUploaded}`,
        } as UploadFile;

        if (type === "thumbnail") {
          // Replace existing placeholder entry with the uploaded file (by uid), or set array
          setFileListThumbnail([uploadFile]);
          form.setFieldsValue({ thumbnail: [uploadFile] });
        } else {
          // Replace matching uid entry or append
          const newSliderList = [...fileListSlider, uploadFile];
          setFileListSlider(newSliderList);
          form.setFieldsValue({ slider: newSliderList });
        }

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

  // Handle onChange for Upload: create preview object URLs immediately and sync to state/form
  // const handleChange = (info: UploadChangeParam, type: imageType) => {};

  /**
   * Hàm onPreview: Xử lý khi click vào ảnh để preview
   */
  const onPreview = async (file: UploadFile) => {
    // Lấy URL của ảnh để preview
    let src = file.url || file.thumbUrl;

    // Nếu chưa có URL, tạo từ originFileObj
    if (!src && file.originFileObj) {
      src = URL.createObjectURL(file.originFileObj);
    }

    if (src) {
      setPreviewImage(src);
      setPreviewOpen(true);
    }
  };

  /**
   * Hàm normFile: Chuyển đổi event từ Upload component thành giá trị để lưu vào Form
   *
   * Khi user chọn file, Upload component gọi onChange với tham số là object có dạng:
   * { fileList: UploadFile[], file: UploadFile, event: ... }
   *
   * Hàm này trích xuất fileList từ event object và tạo preview URL cho các file mới
   */
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
  return (
    <>
      <Modal
        title="Create Book"
        open={open}
        onOk={() => {
          form.submit();
        }}
        onCancel={() => {
          setOpenModalCreate(false);
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
                label="Tên Sách"
                name="mainText"
                rules={[{ required: true, message: "Vui lòng nhập tên sách" }]}
              >
                <Input placeholder="" />
              </Form.Item>
            </Col>
          </Row>
          <Col xs={24} sm={24}>
            <Form.Item<FieldType>
              label="Tác Giả"
              name="author"
              rules={[{ required: true, message: "Vui lòng tên tác giả" }]}
            >
              <Input placeholder="" />
            </Form.Item>
          </Col>
          <Row gutter={16}>
            <Col xs={24} sm={24} md={24} xl={24} xxl={24}>
              <Form.Item<FieldType> label="Giá Tiền" name="price">
                <InputNumber<number>
                  min={0}
                  max={100000000}
                  size="large"
                  style={{ width: "100%" }}
                  formatter={(value) => {
                    // formatter: Chuyển số thành chuỗi hiển thị (ví dụ: 100000 -> "100.000 ₫")
                    if (!value && value !== 0) return "";
                    const numValue =
                      typeof value === "string" ? parseFloat(value) : value;
                    if (isNaN(numValue)) return "";
                    return new Intl.NumberFormat("vi-VN", {
                      style: "currency",
                      currency: "VND",
                    }).format(numValue);
                  }}
                  parser={(value) => {
                    // parser: Chuyển chuỗi hiển thị về số (ví dụ: "100.000 ₫" -> 100000)
                    if (!value) return 0;
                    // Loại bỏ tất cả ký tự không phải số (bao gồm dấu phẩy, khoảng trắng, ký tự tiền tệ)
                    const numValue = parseFloat(value.replace(/\D/g, ""));
                    return isNaN(numValue) ? 0 : numValue;
                  }}
                />
              </Form.Item>
            </Col>
          </Row>

          <Col xs={24} sm={24}>
            <Form.Item<FieldType>
              label="Thể Loại"
              name="category"
              rules={[{ required: true, message: "Vui lòng chọn thể loại" }]}
            >
              <Select
                style={{ width: "100%" }}
                options={category?.data.map((item) => {
                  return { value: item, lable: item };
                })}
              />
            </Form.Item>
          </Col>
          <Row gutter={16}>
            <Col xs={24} sm={24}>
              <Form.Item<FieldType>
                label="Số Lượng"
                name="quantity"
                rules={
                  [
                    // { required: true, message: "Vui lòng nhập số điện thoại" },
                    // {
                    //   pattern: /^\d{9,15}$/,
                    //   message: "Số điện thoại không hợp lệ",
                    // },
                  ]
                }
              >
                <InputNumber
                  min={1}
                  max={10}
                  defaultValue={1}
                  style={{ width: "100%" }}
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col xs={12} sm={12} md={12}>
              <Form.Item<FieldType>
                label="Slider"
                name="slider"
                /**
                 * valuePropName="fileList":
                 * - Mặc định Form.Item sẽ bind giá trị vào prop "value" của component con
                 * - Nhưng Upload component không dùng prop "value", mà dùng prop "fileList"
                 * - valuePropName nói với Form.Item: "Hãy bind giá trị vào prop 'fileList' thay vì 'value'"
                 *
                 * Cơ chế hoạt động:
                 * 1. Form lưu giá trị: form.setFieldValue("slider", [file1, file2, ...])
                 * 2. Form.Item tự động truyền giá trị vào: <Upload fileList={[file1, file2, ...]} />
                 * 3. Upload component nhận fileList và hiển thị hình ảnh
                 *
                 * => Vì vậy KHÔNG CẦN truyền fileList={...} thủ công, Form.Item tự động làm điều đó!
                 */
                valuePropName="fileList"
                /**
                 * getValueFromEvent={normFile}:
                 * - Khi user chọn/xóa file, Upload component gọi onChange với event object
                 * - Event object có dạng: { fileList: [...], file: {...}, event: ... }
                 * - getValueFromEvent nhận event này và trả về giá trị để Form lưu trữ
                 * - normFile() trích xuất fileList từ event: return e?.fileList
                 *
                 * Flow:
                 * User chọn file → Upload.onChange({ fileList: [newFile] })
                 * → getValueFromEvent(normFile) nhận event
                 * → normFile trả về [newFile]
                 * → Form lưu: form.setFieldValue("slider", [newFile])
                 * → Form.Item tự động truyền vào Upload: <Upload fileList={[newFile]} />
                 * → Upload hiển thị hình ảnh
                 */
                getValueFromEvent={normFile}
              >
                <Upload
                  multiple={true}
                  listType="picture-card"
                  /**
                   * beforeUpload={beforeUpload}:
                   * - Hàm này được gọi TRƯỚC KHI upload file lên server
                   * - Validate file (size < 10MB, type là ảnh)
                   * - Trả về false = KHÔNG upload file lên server, chỉ lưu file trong form state
                   * - Trả về true = cho phép upload (mặc định)
                   *
                   * Tại sao cần false?
                   * - Chúng ta chỉ muốn user CHỌN file, không muốn upload ngay
                   * - File sẽ được lưu trong form state (values.slider)
                   * - Khi submit form, chúng ta mới xử lý upload file lên server
                   *
                   * Nếu không có beforeUpload hoặc return true:
                   * - Upload sẽ tự động gửi file lên server ngay khi chọn
                   * - Cần phải có prop "action" (URL endpoint) để upload
                   * - File sẽ bị upload trước khi form submit
                   */
                  beforeUpload={beforeUpload}
                  onRemove={(file) => {
                    onRemove(file, "slider");
                  }}
                  onPreview={onPreview}
                  customRequest={(options) => {
                    handleUploadFile(options, "slider");
                  }}
                  // onChange={(info) => {
                  //    handleChange(info, "slider");
                  // }}
                  fileList={fileListSlider}
                >
                  {sliderValue?.length >= 4 ? null : uploadButton}
                </Upload>
              </Form.Item>
            </Col>
            <Col sm={12} md={12} xl={12}>
              <Form.Item<FieldType>
                label="Thumbail"
                name="thumbnail"
                valuePropName="fileList"
                getValueFromEvent={normFile}
              >
                <Upload
                  listType="picture-card"
                  beforeUpload={beforeUpload} // quyết dịnh rằng customRequest được phép chạy hay không
                  onRemove={(file) => {
                    onRemove(file, "thumbnail");
                  }}
                  customRequest={(options) => {
                    handleUploadFile(options, "thumbnail");
                  }}
                  // onChange={(info) => {
                  //   handleChange(info, "thumbnail");
                  // }}
                  onPreview={onPreview}
                  fileList={fileListThumbnail}
                >
                  {thumbnailValue?.length >= 1 ? null : uploadButton}
                </Upload>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
      {/* Image Preview Modal */}
      <Image
        style={{ display: "none" }}
        preview={{
          visible: previewOpen,
          onVisibleChange: (visible) => {
            setPreviewOpen(visible);
            if (!visible) {
              setPreviewImage("");
            }
          },
        }}
        src={previewImage}
      />
    </>
  );
};

export default CreateBook;
