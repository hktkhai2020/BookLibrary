import { ordersHistoryAPI } from "@/services/api.service";
import { Table, Tag, Space, Modal, message } from "antd";
import type { ColumnsType } from "antd/es/table";
import { useEffect, useState } from "react";
import dayjs from "dayjs";

interface IOrderHistory {
  _id: string;
  name: string;
  email: string;
  phone: string;
  totalPrice: number;
  type: string;
  paymentStatus: string;
  paymentRef: string;
  createdAt: string;
  updatedAt: string;
  detail: {
    bookName: string;
    quantity: number;
    _id: string;
  }[];
}

const OrderHistoryPage = () => {
  const [orders, setOrders] = useState<IOrderHistory[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<IOrderHistory | null>(
    null
  );
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      try {
        const res = await ordersHistoryAPI();
        if (res.data?.data) {
          setOrders(res.data.data);
        } else {
          message.error(res.data?.message || "Lấy lịch sử đơn hàng thất bại");
        }
      } catch (error) {
        console.log(error);
        message.error("Có lỗi xảy ra khi lấy dữ liệu");
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const showModal = (order: IOrderHistory) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  const columns: ColumnsType<IOrderHistory> = [
    {
      title: "STT",
      key: "index",
      width: 60,
      render: (_, __, index) => index + 1,
    },
    {
      title: "Mã đơn hàng",
      dataIndex: "_id",
      key: "_id",
      ellipsis: true,
    },
    {
      title: "Ngày đặt",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date) => dayjs(date).format("DD-MM-YYYY HH:mm:ss"),
    },
    {
      title: "Tổng tiền",
      dataIndex: "totalPrice",
      key: "totalPrice",
      render: (price) =>
        new Intl.NumberFormat("vi-VN", {
          style: "currency",
          currency: "VND",
        }).format(price),
    },
    {
      title: "Trạng thái thanh toán",
      dataIndex: "paymentStatus",
      key: "paymentStatus",
      render: (status) => (
        <Tag color={status === "PAID" ? "green" : "volcano"}>
          {status === "PAID" ? "Đã thanh toán" : "Chưa thanh toán"}
        </Tag>
      ),
    },
    {
      title: "Hình thức",
      dataIndex: "type",
      key: "type",
      render: (type) => <Tag color="blue">{type}</Tag>,
    },
    {
      title: "Thao tác",
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          <a onClick={() => showModal(record)}>Xem chi tiết</a>
        </Space>
      ),
    },
  ];

  const detailColumns = [
    {
      title: "Tên sách",
      dataIndex: "bookName",
      key: "bookName",
    },
    {
      title: "Số lượng",
      dataIndex: "quantity",
      key: "quantity",
    },
    {
      title: "ID Sách",
      dataIndex: "_id",
      key: "_id",
    },
  ];

  return (
    <div className="container mx-auto p-4 md:p-10">
      <h2 className="text-2xl font-bold mb-6">Lịch sử đơn hàng</h2>
      <Table
        columns={columns}
        dataSource={orders}
        rowKey="_id"
        loading={loading}
        pagination={{
          pageSize: 5,
        }}
      />

      <Modal
        title="Chi tiết đơn hàng"
        open={isModalOpen}
        onOk={() => setIsModalOpen(false)}
        onCancel={() => setIsModalOpen(false)}
        width={800}
        footer={null}
      >
        {selectedOrder && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg">
              <div>
                <p className="text-gray-500 text-sm">Người nhận</p>
                <p className="font-medium">{selectedOrder.name}</p>
              </div>
              <div>
                <p className="text-gray-500 text-sm">Số điện thoại</p>
                <p className="font-medium">{selectedOrder.phone}</p>
              </div>
              <div>
                <p className="text-gray-500 text-sm">Email</p>
                <p className="font-medium">{selectedOrder.email}</p>
              </div>
              <div>
                <p className="text-gray-500 text-sm">Tổng thanh toán</p>
                <p className="font-medium text-red-500">
                  {new Intl.NumberFormat("vi-VN", {
                    style: "currency",
                    currency: "VND",
                  }).format(selectedOrder.totalPrice)}
                </p>
              </div>
            </div>

            <h3 className="font-bold text-lg mt-4">Danh sách sản phẩm</h3>
            <Table
              columns={detailColumns}
              dataSource={selectedOrder.detail}
              rowKey="_id"
              pagination={false}
              bordered
            />
          </div>
        )}
      </Modal>
    </div>
  );
};

export default OrderHistoryPage;
