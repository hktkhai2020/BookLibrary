import {
  DeleteOutlined,
  EditOutlined,
  EllipsisOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import type { ActionType, ProColumns } from "@ant-design/pro-components";
import { ProTable, TableDropdown } from "@ant-design/pro-components";
import { Button, Dropdown, Space, Tag } from "antd";
import { useRef, useState } from "react";
import { getUserAPI } from "services/api.service";
import dayjs from "dayjs";
interface ISearch {
  fullName: string;
  email: string;
  startTime: string;
  endTime: string;
}

const columns: ProColumns<IUserTable>[] = [
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
        <a>{record._id}</a>
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
    render: (text, record, index, action) => [
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
];

const TableUser = () => {
  const actionRef = useRef<ActionType>();
  const [meta, setMeta] = useState({
    current: 1,
    pageSize: 5,
    pages: 0,
    total: 0,
  });
  return (
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
      // editable={{
      //   type: "multiple",
      // }}
      // columnsState={{
      //   persistenceKey: "pro-table-singe-demos",
      //   persistenceType: "localStorage",
      //   defaultValue: {
      //     option: { fixed: "right", disable: true },
      //   },
      //   onChange(value) {
      //     console.log("value: ", value);
      //   },
      // }}
      rowKey="_id" //để định danh mỗi trường
      // search={{
      //   labelWidth: "auto",
      // }}
      // options={{
      //   setting: {
      //     listsHeight: 400,
      //   },
      // }}
      // form={{
      //   // 由于配置了 transform，提交的参数与定义的不同这里需要转化一下
      //   syncToUrl: (values, type) => {
      //     if (type === "get") {
      //       return {
      //         ...values,
      //         created_at: [values.startTime, values.endTime],
      //       };
      //     }
      //     return values;
      //   },
      // }}
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
            actionRef.current?.reload();
          }}
          type="primary"
        >
          A
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
  );
};

export default TableUser;
