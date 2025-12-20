import {
  DeleteOutlined,
  EditOutlined,
  EllipsisOutlined,
  ExportOutlined,
  PlusOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import type { ActionType, ProColumns } from "@ant-design/pro-components";
import { ProTable } from "@ant-design/pro-components";
import { Button, Dropdown } from "antd";
import { useRef, useState, useMemo, useCallback } from "react";
import { getUserAPI } from "services/api.service";
import dayjs from "dayjs";
import DetailUser from "@/components/admin/user/detail.user";
import CreateUser from "@/components/admin/user/create.user";
import ImportUser from "components/admin/user/data/import.user";

interface ISearch {
  fullName: string;
  email: string;
  startTime: string;
  endTime: string;
}

const TableUser = () => {
  const actionRef = useRef<ActionType>();
  const [meta, setMeta] = useState({
    current: 1,
    pageSize: 5,
    pages: 0,
    total: 0,
  });
  const [open, setOpen] = useState<boolean>(false);
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [detailUser, setDetailUser] = useState<IUserTable | null>(null);
  const [importUser, setImportUser] = useState<boolean>(false);

  const showDetailUser = useCallback((record: IUserTable) => {
    setDetailUser(record);
    setOpen(true);
  }, []);

  const closeDetailUser = useCallback(() => {
    setOpen(false);
  }, []);

  const showModalCreateUser = useCallback(() => {
    setOpenModal(true);
  }, []);

  // Tối ưu: dùng useMemo để tránh tạo lại columns mỗi lần render
  const columns: ProColumns<IUserTable>[] = useMemo(
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
                showDetailUser(record);
              }}
            >
              {record._id}
            </a>
          </>,
        ],
        width: "auto",
      },
      {
        disable: true,
        title: "full name",
        dataIndex: "fullName",
        sorter: true,

        filters: true,
        // onFilter: true,
        ellipsis: true,
        valueType: "select",
        valueEnum: {
          all: { text: "超长".repeat(50) },
          open: {
            text: "loi",
          },
          closed: {
            text: "thanh cong",
          },
          processing: {
            text: "dang xu ly",
          },
        },
        width: "auto",
      },
      {
        disable: true,
        copyable: true,
        title: "Email",
        dataIndex: "email",
        width: "auto",
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
        render: () =>
          // text, record, index, action
          [
            <>
              <EditOutlined
                style={{
                  color: "orange",
                  marginRight: "2rem",
                  cursor: "pointer",
                }}
              />

              <DeleteOutlined
                style={{
                  color: "red",
                  cursor: "pointer",
                }}
              />
            </>,
          ],
        width: "auto",
      },
    ],
    [showDetailUser]
  ); // Chỉ tạo lại khi showDetailUser thay đổi
  return (
    <>
      <ProTable<IUserTable, ISearch>
        columns={columns}
        actionRef={actionRef}
        cardBordered
        request={async (params, sort, filter) => {
          console.log("filter: ", filter);
          let query = "";
          if (params && Object.keys(params).length > 0) {
            query += `current=${params.current}&pageSize=${params.pageSize}`;
            if (params.email) {
              query += `&email=/${params.email}/i`;
            }
            if (params.fullName) {
              query += `&fullName=/${params.fullName}/i`;
            }

            if (params.startTime && params.endTime) {
              query += `&createdAt>=${dayjs(
                params.startTime
              ).toDate()}&createdAt<=${dayjs(params.endTime).toDate()}`;
            }
          }
          if (sort && sort.createdAt) {
            if (sort.createdAt === "ascend") {
              query += `&sort=-createdAt`;
            } else {
              query += `&sort=createdAt`;
            }
          }
          if (sort && sort.fullName) {
            if (sort.fullName === "ascend") {
              query += `&sort=-fullName`;
            } else {
              query += `&sort=fullName`;
            }
          }
          const res = await getUserAPI(query);

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
              showModalCreateUser();
            }}
            type="primary"
          >
            Add new user
          </Button>,
          <Button
            key="button"
            icon={<UploadOutlined />}
            onClick={() => {
              setImportUser(true);
            }}
            type="primary"
          >
            Import
          </Button>,
          <Button
            key="button"
            icon={<UploadOutlined />}
            onClick={() => {
              <ExportOutlined />;
            }}
            type="primary"
          >
            Export
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
      <DetailUser
        open={open}
        onClose={closeDetailUser}
        detailUser={detailUser}
      />
      <CreateUser
        open={openModal}
        setOpenModal={setOpenModal}
        actionRef={actionRef}
      />
      <ImportUser
        importUser={importUser}
        setImportUser={setImportUser}
        actionRef={actionRef}
      />
    </>
  );
};

export default TableUser;
