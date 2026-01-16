import {
  DeleteOutlined,
  EditOutlined,
  EllipsisOutlined,
  ExportOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import type { ActionType, ProColumns } from "@ant-design/pro-components";
import { ProTable } from "@ant-design/pro-components";
import { Button, Dropdown, App, Popconfirm, Grid } from "antd";
import { useRef, useState, useMemo, useCallback } from "react";
import { CSVLink } from "react-csv";
import { deleteBook, getBooksAPI } from "services/api.service";
import DetailBook from "components/admin/books/detail.book";
import CreateBook from "components/admin/books/create.book";
import UpdateBook from "components/admin/books/update.book.tsx";
const TableBooks = () => {
  const { notification } = App.useApp();
  const actionRef = useRef<ActionType>();
  const { useBreakpoint } = Grid;
  const screens = useBreakpoint();
  const isMobile = !screens.md; // md breakpoint là 768px

  const [exportBook, setExportBook] = useState<Partial<IBookTable>[]>([]);
  const [detailBook, setDetailBook] =
    useState<Partial<IBookTable | null>>(null);
  const [openModalDetail, setOpenModalDetail] = useState<boolean>(false);
  const [openModalCreate, setOpenModalCreate] = useState<boolean>(false);
  const [meta, setMeta] = useState({
    current: 1,
    pageSize: 5,
    pages: 0,
    total: 0,
  });
  const [openModalUpdate, setOpenModalUpdate] = useState<boolean>(false);
  const [bookUpdate, setBookUpdate] = useState<IBookTable | null>(null);

  const handleDeleteBook = useCallback(
    async (id: string) => {
      try {
        const res = await deleteBook(id);
        if (res.data.data) {
          notification.success({
            message: `${res.data.message}`,
          });
          actionRef.current?.reload();
        }
      } catch (error) {
        notification.error({
          message: `${error}`,
        });
      }
    },
    [notification]
  );

  // Tối ưu: dùng useMemo để tránh tạo lại columns mỗi lần render
  const columns: ProColumns<IBookTable>[] = useMemo(
    () => [
      {
        dataIndex: "index",
        valueType: "indexBorder",
        width: 48,
      },
      {
        hideInSearch: true,
        title: "id",
        dataIndex: "_id",
        ellipsis: true,
        tooltip: "This is id for infomation users",
        formItemProps: {
          rules: [
            {
              required: true,
              message: "filed is empty",
            },
          ],
        },
        render: (_, record) => [
          <>
            <a
              onClick={() => {
                setOpenModalDetail(true);
                setDetailBook(record);
              }}
            >
              {record._id}
            </a>
          </>,
        ],
        width: "auto",
      },
      {
        disable: true, // in here show in setting table direction top right
        title: "Tên sách",
        dataIndex: "mainText",
        sorter: true,
        width: "auto",
      },
      {
        disable: true,
        copyable: true,
        title: "Thể Loại",
        dataIndex: "category",
        width: "auto",
        hideInSearch: true,
        hideInTable: isMobile, // Ẩn trên mobile
      },
      {
        disable: true,
        copyable: true,
        title: "Tác Giả",
        dataIndex: "author",
        width: "auto",
        hideInTable: isMobile, // Ẩn trên mobile
      },
      {
        disable: true,
        copyable: true,
        title: "Giá Tiền",
        width: "auto",
        hideInSearch: true,
        hideInTable: isMobile, // Ẩn trên mobile
        render: (_, record) => {
          return new Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: "VND",
          }).format(record.price);
        },
      },
      {
        title: "Create At",
        key: "showTime",
        dataIndex: "createdAt",
        valueType: "date",
        sorter: true,
        // Mặc định vào trang sẽ sort theo ngày mới nhất
        defaultSortOrder: "ascend",
        // Mặc định antd/pro-table sort có 3 trạng thái: ascend -> descend -> null (bỏ sort)
        // Nếu muốn chỉ 2 trạng thái thì giới hạn sortDirections:
        sortDirections: ["ascend", "descend"],
        hideInSearch: true,
        width: "auto",
        hideInTable: isMobile, // Ẩn trên mobile
      },
      {
        title: "Create At",
        dataIndex: "createdAt",
        valueType: "dateRange",
        hideInTable: true,
        search: {
          transform: (value) => {
            return {
              startTime: value[0],
              endTime: value[1],
            };
          },
        },
      },
      {
        title: "Action",
        render: (_dom, entity) =>
          //dom ,entity,index,action,schema
          [
            <>
              <EditOutlined
                style={{
                  color: "orange",
                  marginRight: "2rem",
                  cursor: "pointer",
                }}
                onClick={() => {
                  setOpenModalUpdate(true);
                  setBookUpdate(entity);
                }}
              />

              <Popconfirm
                title="Xóa sách"
                description="Bạn có chắc chắn muốn xóa sách này không?"
                onConfirm={() => {
                  handleDeleteBook(entity._id);
                }}
                okText="Xóa"
                cancelText="Hủy"
                okButtonProps={{ danger: true }}
              >
                <DeleteOutlined
                  style={{
                    color: "red",
                    cursor: "pointer",
                  }}
                />
              </Popconfirm>
            </>,
          ],
        width: "auto",
      },
    ],
    [handleDeleteBook, isMobile]
  ); // Tạo lại khi handleDeleteBook hoặc isMobile thay đổi
  interface ISearch {
    mainText: string;
    author: string;
    startTime: string;
    endTime: string;
  }
  const showModalCreateBook = useCallback(() => {
    setOpenModalCreate(true);
  }, []);
  return (
    <>
      <ProTable<IBookTable, ISearch>
        columns={columns}
        actionRef={actionRef}
        cardBordered
        scroll={{ x: "max-content" }}
        size={isMobile ? "small" : "middle"}
        request={async (
          params,
          sort
          //,filter
        ) => {
          let query = "";
          if (params && Object.keys(params).length > 0) {
            query += `current=${params.current}&pageSize=${params.pageSize}`;
            if (params.mainText) {
              query += `&mainText=/${params.mainText}/i`;
            }
            if (params.author) {
              query += `&author=/${params.author}/i`;
            }
          }
          if (sort && sort.createdAt) {
            if (sort.createdAt === "ascend") {
              query += `&sort=-createdAt`;
            } else {
              query += `&sort=createdAt`;
            }
          }
          if (sort && sort.mainText) {
            if (sort.mainText === "ascend") {
              query += `&sort=-mainText`;
            } else {
              query += `&sort=mainText`;
            }
          }
          const res = await getBooksAPI(query);
          setExportBook(res.data.data.result);
          if (res?.data?.data?.meta) {
            setMeta(res.data.data.meta);
          }
          return {
            data: res.data.data.result,
            // success: true,
            // page: res.data.data.meta.pages,
            // total: res.data.data.meta.total,
          };
        }}
        rowKey="_id" //để định danh mỗi trường
        pagination={{
          current: meta.current,
          pageSize: meta.pageSize,
          total: meta.total,
          showSizeChanger: true,
          pageSizeOptions: ["5", "10", "20"],

          showTotal: (total, range) => {
            return (
              <div>
                {" "}
                {range[0]}-{range[1]} trên {total} rows
              </div>
            );
          },
          onChange: () => {},
        }}
        dateFormatter="string"
        headerTitle="Table User"
        toolBarRender={() => [
          <Button
            key="button"
            icon={<PlusOutlined />}
            onClick={() => {
              showModalCreateBook();
            }}
            type="primary"
          >
            Add new user
          </Button>,
          <Button
            key="button"
            icon={<ExportOutlined />}
            onClick={() => {}}
            type="primary"
          >
            <CSVLink data={exportBook} filename="export.csv">
              Export
            </CSVLink>
          </Button>,
          <Dropdown
            key="menu"
            menu={{
              items: [
                {
                  label: "1st item",
                  key: "1",
                },
                {
                  label: "2nd item",
                  key: "2",
                },
                {
                  label: "3rd item",
                  key: "3",
                },
              ],
            }}
          >
            <Button>
              <EllipsisOutlined />
            </Button>
          </Dropdown>,
        ]}
      />
      <DetailBook
        open={openModalDetail}
        onClose={setOpenModalDetail}
        detailBook={detailBook}
      />
      <CreateBook
        open={openModalCreate}
        actionRef={actionRef}
        setOpenModalCreate={setOpenModalCreate}
      />
      <UpdateBook
        open={openModalUpdate}
        setOpen={setOpenModalUpdate}
        book={bookUpdate!}
        actionRef={actionRef}
      />
    </>
  );
};

export default TableBooks;
