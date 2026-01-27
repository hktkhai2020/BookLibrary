import { ActionType, ProColumns, ProTable } from "@ant-design/pro-components";
import { Grid } from "antd";
import { useMemo, useRef, useState } from "react";
import { listOrderAPI } from "services/api.service";
const ManagerOrderPage: React.FC = () => {
  const { useBreakpoint } = Grid;
  const screens = useBreakpoint();
  const isMobile = !screens.md; // md
  const actionRef = useRef<ActionType>();
  const [meta, setMeta] = useState({
    current: 1,
    pageSize: 5,
    pages: 0,
    total: 0,
  });
  const columns: ProColumns<IOrderTable>[] = useMemo(
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
            <span>{record._id}</span>
          </>,
        ],
        width: "auto",
      },
      {
        disable: true, // in here show in setting table direction top right
        title: "Full Name",
        dataIndex: "name",
        sorter: true,
        width: "auto",
        hideInSearch: true,
        hideInTable: isMobile, // Ẩn trên mobile
      },
      {
        disable: true,
        copyable: true,
        title: "Address",
        dataIndex: "address",
        width: "auto",
        hideInSearch: true,
        hideInTable: isMobile, // Ẩn trên mobile
      },
      {
        hideInSearch: true,
        disable: true,
        copyable: true,
        title: "Phone",
        dataIndex: "phone",
        width: "auto",
        hideInTable: isMobile, // Ẩn trên mobile
      },
      {
        disable: true,
        sorter: true,
        title: "Tổng Giá Tiền",
        dataIndex: "totalPrice",
        width: "auto",
        hideInSearch: true,
        hideInTable: isMobile, // Ẩn trên mobile
        render: (_, record) => {
          return new Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: "VND",
          }).format(record.totalPrice);
        },
      },
      {
        title: "Ngày Tạo",
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
    ],
    [isMobile],
  );
  return (
    <>
      <ProTable<IOrderTable>
        columns={columns}
        actionRef={actionRef}
        cardBordered
        scroll={{ x: "max-content" }}
        size={isMobile ? "small" : "middle"}
        request={async (
          params,
          sort,
          //,filter
        ) => {
          let query = "";
          if (params && Object.keys(params).length > 0) {
            query += `current=${params.current}&pageSize=${params.pageSize}`;
          }
          if (sort && sort.totalPrice) {
            if (sort.totalPrice === "ascend") {
              query += `&sort=-totalPrice`;
            } else {
              query += `&sort=totalPrice`;
            }
          }
          if (sort && sort.createdAt) {
            if (sort.createdAt === "ascend") {
              query += `&sort=-createdAt`;
            } else {
              query += `&sort=createdAt`;
            }
          }
          if (sort && sort.name) {
            if (sort.name === "ascend") {
              query += `&sort=-name`;
            } else {
              query += `&sort=name`;
            }
          }
          const res = await listOrderAPI(query);
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
        search={false}
      />
    </>
  );
};
export default ManagerOrderPage;
