import { PlusOutlined } from "@ant-design/icons";
import {
  Col,
  Form,
  Image,
  Input,
  InputNumber,
  Modal,
  Row,
  Select,
  Upload,
  UploadFile,
  App,
} from "antd";
import type { FormProps } from "antd";
import { MutableRefObject, useEffect, useState } from "react";
import { UploadRequestOption as RcCustomRequestOptions } from "rc-upload/lib/interface";
import { ActionType } from "@ant-design/pro-components";
import { updateBook, uploadImage } from "services/api.service";
import axios from "axios";

type FieldType = {
  thumbnail: UploadFile[];
  slider: UploadFile[];
  mainText: string;
  author: string;
  price: number;
  quantity: number;
  category: string;
};

type AxiosErrorResponse = {
  message?: string;
};
type imageType = "thumbnail" | "slider";
interface category {
  statusCode: number;
  message: string;
  data: string[];
  author: string;
}
const UpdateBook: React.FC<{
  open: boolean;
  setOpen: (open: boolean) => void;
  book: IBookTable;
  actionRef: MutableRefObject<ActionType | undefined>;
}> = ({ open, setOpen, book, actionRef }) => {
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

  // Load dữ liệu book vào form khi modal mở
  useEffect(() => {
    if (open && book) {
      // Tạo UploadFile cho thumbnail
      const thumbnailFile: UploadFile = {
        uid: `thumbnail-${book._id}`,
        name: book.thumbnail,
        fileName: book.thumbnail,
        status: "done",
        url: `http://localhost:8080/images/book/${book.thumbnail}`,
      };

      // Tạo UploadFile array cho slider
      const sliderFiles: UploadFile[] = book.slider.map((fileName, index) => ({
        uid: `slider-${book._id}-${index}`,
        name: fileName,
        fileName: fileName,
        status: "done",
        url: `http://localhost:8080/images/book/${fileName}`,
      }));

      // Set form values
      form.setFieldsValue({
        mainText: book.mainText,
        author: book.author,
        price: book.price,
        quantity: book.quantity,
        category: book.category,
        thumbnail: [thumbnailFile],
        slider: sliderFiles,
      });

      // Set state
      setFileListThumbnail([thumbnailFile]);
      setFileListSlider(sliderFiles);
    }
  }, [open, book, form]);

  // Fetch category list
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

  // Hàm onFinish để xử lý update
  const onFinish: FormProps<FieldType>["onFinish"] = async (values) => {
    try {
      // Lấy fileName từ fileList hoặc giữ nguyên giá trị cũ nếu không có file mới
      const thumbnailFileName =
        fileListThumbnail[0]?.fileName || book.thumbnail;
      const sliderFileNames: string[] =
        fileListSlider.length > 0
          ? fileListSlider
              .map((x) => x.fileName)
              .filter((name): name is string => Boolean(name))
          : book.slider;

      await updateBook(
        {
          thumbnail: thumbnailFileName,
          slider: sliderFileNames,
          mainText: values.mainText,
          author: values.author,
          price: values.price,
          quantity: values.quantity,
          category: values.category,
        },
        book._id
      );

      message.success("Cập nhật sách thành công!");
      actionRef.current?.reload();
      setOpen(false);
      form.resetFields();
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        const msg =
          (error.response?.data as AxiosErrorResponse | undefined)?.message ??
          "Cập nhật sách thất bại";
        message.error(msg);
        return;
      }
      message.error(error instanceof Error ? error.message : "Có lỗi xảy ra");
    }
  };

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
      return Upload.LIST_IGNORE;
    }
    return true;
  };
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
        title="Update Book"
        open={open}
        onOk={() => {
          form.submit();
        }}
        onCancel={() => {
          setOpen(false);
          form.resetFields();
          setFileListThumbnail([]);
          setFileListSlider([]);
        }}
        maskClosable={false}
        cancelText={"Quit"}
        okText={"UPDATE"}
      >
        <Form
          form={form}
          name="updateBookForm"
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
              <Form.Item<FieldType> label="Số Lượng" name="quantity" rules={[]}>
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
                valuePropName="fileList"
                getValueFromEvent={normFile}
              >
                <Upload
                  multiple={true}
                  listType="picture-card"
                  beforeUpload={beforeUpload}
                  onRemove={(file) => {
                    onRemove(file, "slider");
                  }}
                  onPreview={onPreview}
                  customRequest={(options) => {
                    handleUploadFile(options, "slider");
                  }}
                  fileList={fileListSlider}
                >
                  {sliderValue?.length >= 4 ? null : uploadButton}
                </Upload>
              </Form.Item>
            </Col>
            <Col sm={12} md={12} xl={12}>
              <Form.Item<FieldType>
                label="Thumbnail"
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
export default UpdateBook;
