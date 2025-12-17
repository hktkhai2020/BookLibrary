import { Drawer, Descriptions, Badge } from "antd";
import type { DescriptionsProps } from "antd";
import dayjs from "dayjs";
const DetailUser: React.FC<{
  open: boolean;
  onClose: () => void;
  detailUser: IUserTable | null;
}> = ({ open, onClose, detailUser }) => {
  const items: DescriptionsProps["items"] = [
    {
      key: "1",
      label: "id",
      children: detailUser?._id,
      span: 1.5,
    },
    {
      key: "2",
      label: "fullName",
      children: detailUser?.fullName,
      span: 1.5,
    },
    {
      key: "3",
      label: "Email",
      children: detailUser?.email,
      span: 1.5,
    },
    {
      key: "4",
      label: "Phone Number",
      children: detailUser?.phone,
      span: 1.5,
    },
    {
      key: "5",
      label: "Role",
      children: (
        <Badge status="processing" text={detailUser?.role?.toUpperCase()} />
      ),

      span: 1.5,
    },
    {
      key: "6",
      label: "Created At",
      children: (
        <img
          src={`http://localhost:8080/images/avatar/${detailUser?.avatar}`}
          style={{ width: "5rem", height: "4rem", objectFit: "cover" }}
          alt=""
        />
      ),
      span: 1.5,
    },
    {
      key: "7",
      label: "Created At",
      children: <>{dayjs(detailUser?.createdAt).format("YYYY-MM-DD")}</>,
      span: 1.5,
    },
    {
      key: "8",
      label: "Updated At",
      children: <>{dayjs(detailUser?.updatedAt).format("YYYY-MM-DD")}</>,
      span: 1.5,
    },
  ];
  return (
    <>
      <Drawer
        title="Detail User"
        open={open}
        onClose={onClose}
        maskClosable={true}
        width={800}
      >
        <Descriptions title="User Info" items={items} bordered />
      </Drawer>
    </>
  );
};

export default DetailUser;
