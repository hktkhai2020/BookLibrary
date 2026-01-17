import { useCurrentContext } from "@/components/context/context";
import { getBooksAPI } from "@/services/api.service";
import { FilterTwoTone, ReloadOutlined } from "@ant-design/icons";
import {
  Button,
  Checkbox,
  Col,
  Divider,
  Flex,
  Form,
  Image,
  InputNumber,
  Pagination,
  PaginationProps,
  Rate,
  Row,
  Spin,
  Tabs,
} from "antd";
import { TabsProps } from "antd/lib";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import LandingPage from "./LandingPage";

interface category {
  statusCode: number;
  message: string;
  data: string[];
  author: string;
}
interface FieldType {
  range: {
    from: number;
    to: number;
  };
  category: string[];
}
const HomePage: React.FC = () => {
  const [form] = Form.useForm();
  const [category, setCategory] = useState<category>();
  const [dataBooks, setDataBooks] = useState<IBookTable[]>([]);
  const [query, setQuery] = useState<string>(
    () => "current=1&pageSize=8&sort=-sold"
  );
  const [current, setCurrent] = useState(1);
  const [pageSize, setPageSize] = useState(8);
  const [toTal, setToTal] = useState();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [activeTabKey, setActiveTabKey] = useState<string>("-sold");
  const desc = ["terrible", "bad", "normal", "good", "wonderful"];
  const navigate = useNavigate();
  const items: TabsProps["items"] = [
    {
      key: "-sold",
      label: "Phổ Biến",
      children: <></>,
    },
    {
      key: "-updateAt",
      label: "Hàng Mới",
      children: <></>,
    },
    {
      key: "-price",
      label: "Giá Cao đến thấp",
      children: <></>,
    },
    {
      key: "price",
      label: "Giá Thấp đến cao",
      children: <></>,
    },
  ];
  const { isUser } = useCurrentContext();
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
  useEffect(() => {
    setIsLoading(true);
    getBooksAPI(query)
      .then((res) => {
        if (res?.data?.data) {
          setDataBooks(res.data.data.result);
          setCurrent(res.data.data.meta.current);
          setPageSize(res.data.data.meta.pageSize);
          setToTal(res.data.data.meta.total);
        }
      })
      .catch((error) => {
        console.error("Error fetching books:", error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [query]);
  const onChangePagination: PaginationProps["onChange"] = (page, size) => {
    setCurrent(page);
    setPageSize(size);
    // Cập nhật query với page và pageSize mới
    // Giữ nguyên các params khác nếu có (sort order từ tabs)
    const params = new URLSearchParams(query); // lấy phần sao dấu / của query
    params.set("current", page.toString());
    params.set("pageSize", size.toString());
    setQuery(params.toString());
  };
  if (!isUser) {
    console.log("isUser", isUser);
    return <LandingPage />;
  } else {
    return (
      <>
        <div className="home-page w-full h-auto flex flex-col lg:flex-row justify-between items-start gap-4 sm:gap-6 lg:gap-8 p-4 sm:p-6 md:p-8 lg:p-16">
          <div className="home-page-left w-full lg:w-1/5 h-auto rounded-[var(--ant-border-radius-lg)] p-3 sm:p-4 flex flex-col bg-[var(--ant-color-bg-container)]">
            <div className="flex justify-between items-center">
              <span className="text-sm sm:text-base">
                <FilterTwoTone className="cursor-pointer" /> Bộ Tìm kiếm
              </span>
              <ReloadOutlined
                className="cursor-pointer text-base sm:text-lg"
                onClick={() => {
                  // Reset form fields
                  form.resetFields();
                  // Reset query về trạng thái ban đầu
                  setQuery("current=1&pageSize=8&sort=-sold");
                  // Reset pagination state
                  setCurrent(1);
                  setPageSize(8);
                  // Reset tab về vị trí ban đầu
                  setActiveTabKey("-sold");
                }}
              />
            </div>
            <Divider />
            <Form<FieldType>
              form={form}
              onFinish={(values) => {
                setIsLoading(true);
                const params = new URLSearchParams(query);

                // Xử lý category (array)
                if (values.category && values.category.length > 0) {
                  params.delete("category"); // Xóa category cũ
                  const tmp = values.category.join(",");
                  params.set("category", tmp);
                } else {
                  params.delete("category");
                }

                // Xử lý price range
                if (values.range?.from) {
                  params.set("price>", values.range.from.toString());
                } else {
                  params.delete("price>");
                }

                if (values.range?.to) {
                  params.set("price<", values.range.to.toString());
                } else {
                  params.delete("price<");
                }

                // Reset về trang 1 khi filter
                params.set("current", "1");

                setQuery(params.toString());
              }}
              layout="vertical"
            >
              <Form.Item
                name={"category"}
                label={
                  <span className="text-sm sm:text-base">
                    Danh Mục Sản Phẩm
                  </span>
                }
              >
                <Checkbox.Group style={{ width: "100%" }}>
                  <Row>
                    {category
                      ? category.data.map((item) => {
                          return (
                            <Col span={24} className="my-2 sm:my-4">
                              <Checkbox
                                value={item}
                                className="text-xs sm:text-sm"
                              >
                                {item}
                              </Checkbox>
                            </Col>
                          );
                        })
                      : []}
                  </Row>
                </Checkbox.Group>
              </Form.Item>
              <Divider />
              <span className="inline-block mb-3 sm:mb-5 text-sm sm:text-base">
                Khoảng giá
              </span>
              <div className="filter-price flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
                <Form.Item name={["range", "from"]} className="flex-1">
                  <InputNumber<number>
                    name="from"
                    min={0}
                    placeholder="Từ"
                    className="w-full"
                    formatter={(value) => {
                      if (!value && value !== 0) return "";
                      if (isNaN(value)) return "";
                      return new Intl.NumberFormat("vi-VN", {
                        style: "currency",
                        currency: "VND",
                      }).format(value);
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
                <span className="hidden sm:inline">-</span>
                <Form.Item name={["range", "to"]} className="flex-1">
                  <InputNumber<number>
                    name="to"
                    min={0}
                    placeholder="Đến"
                    className="w-full"
                    formatter={(value) => {
                      if (!value && value !== 0) return "";
                      if (isNaN(value)) return "";
                      return new Intl.NumberFormat("vi-VN", {
                        style: "currency",
                        currency: "VND",
                      }).format(value);
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
              </div>
              <Button
                onClick={() => {
                  form.submit();
                }}
                className="w-full sm:w-auto"
                type="primary"
              >
                Áp dụng
              </Button>
            </Form>
            <Divider />
          </div>
          <div className="home-page-right w-full lg:w-4/5 h-auto bg-[var(--ant-color-bg-container)] rounded-[var(--ant-border-radius-lg)] p-3 sm:p-4 md:p-6">
            <Spin tip="loading" size="large" spinning={isLoading}>
              <Tabs
                activeKey={activeTabKey}
                items={items}
                onChange={(key) => {
                  setActiveTabKey(key);
                  const params = new URLSearchParams(query);
                  params.set("sort", key.toString());
                  setQuery(params.toString());
                }}
                className="text-xs sm:text-sm"
              />
              <Row gutter={[8, 16]} className="mt-4">
                {dataBooks?.map((item) => {
                  return (
                    <Col
                      xs={24}
                      sm={12}
                      md={8}
                      lg={6}
                      xl={6}
                      className="h-auto cursor-pointer"
                      onClick={() => {
                        navigate(`/book/${item._id}`);
                      }}
                      key={item._id}
                    >
                      <div className="group flex flex-col w-full h-full border border-black/10 shadow-sm rounded-lg p-3 sm:p-4 hover:border-black/20 transition-all duration-300">
                        <div
                          className="book-img w-full flex justify-center items-center overflow-hidden rounded-lg mb-2 sm:mb-3"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                          }}
                        >
                          <Image
                            className="w-full h-full object-cover duration-300 group-hover:scale-110"
                            alt="basic"
                            src={`http://localhost:8080/images/book/${item.thumbnail}`}
                            preview={true}
                          />
                        </div>
                        <div className="book-title font-sans pt-2 sm:pt-4 truncate cursor-pointer text-sm sm:text-base">
                          {item.mainText}
                        </div>
                        <div className="book-price my-3 sm:my-5 text-lg sm:text-xl md:text-2xl font-semibold text-red-600">
                          {new Intl.NumberFormat("vi-VN", {
                            style: "currency",
                            currency: "VND",
                          }).format(item.price)}
                        </div>
                        <Flex
                          gap="small"
                          className="flex-col sm:flex-row sm:items-center"
                        >
                          <Rate
                            tooltips={desc}
                            defaultValue={2}
                            className="text-xs sm:text-sm"
                          />
                          <span className="text-xs sm:text-sm text-gray-600">
                            Đã Bán {item.sold}
                          </span>
                        </Flex>
                      </div>
                    </Col>
                  );
                })}
              </Row>
              <Divider className="my-4 sm:my-6" />
              <Row className="flex justify-center">
                <Pagination
                  current={current}
                  total={toTal}
                  responsive
                  pageSize={pageSize}
                  onChange={onChangePagination}
                  onShowSizeChange={onChangePagination}
                  showSizeChanger
                  showQuickJumper
                  pageSizeOptions={["8", "12", "16", "24"]}
                  className="text-xs sm:text-sm"
                  size="small"
                />
              </Row>
            </Spin>
          </div>
        </div>
      </>
    );
  }
};

export default HomePage;
