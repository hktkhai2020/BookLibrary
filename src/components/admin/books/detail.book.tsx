import { Drawer, Descriptions, Badge } from "antd";
import type { DescriptionsProps } from "antd";
import dayjs from "dayjs";
const DetailBook: React.FC<{
  open: boolean;
  onClose: (T: boolean) => void;
  detailBook: Partial<IBookTable | null>;
}> = ({ open, onClose, detailBook }) => {
  const items: DescriptionsProps["items"] = [
    {
      key: "1",
      label: "id",
      children: detailBook?._id,
      span: 1.5,
    },
    {
      key: "2",
      label: "Tên Sách",
      children: detailBook?.mainText,
      span: 1.5,
    },
    {
      key: "3",
      label: "Tác Giả",
      children: detailBook?.author,
      span: 1.5,
    },
    {
      key: "4",
      label: "Thể Loại",
      children: detailBook?.category,
      span: 1.5,
    },
    {
      key: "5",
      label: "Số lượng",
      children: <Badge status="processing" text={detailBook?.quantity} />,

      span: 1.5,
    },
    {
      key: "6",
      label: "Thumbnail",
      children: (
        <img
          src={`http://localhost:8080/images/avatar/${detailBook?.thumbnail}`}
          style={{ width: "5rem", height: "4rem", objectFit: "cover" }}
          alt=""
        />
      ),
      span: 1.5,
    },
    {
      key: "7",
      label: "Created At",
      children: <>{dayjs(detailBook?.createdAt).format("YYYY-MM-DD")}</>,
      span: 1.5,
    },
    {
      key: "8",
      label: "Updated At",
      children: <>{dayjs(detailBook?.updatedAt).format("YYYY-MM-DD")}</>,
      span: 1.5,
    },
  ];
  return (
    <>
      <Drawer
        title="Detail User"
        open={open}
        onClose={() => {
          onClose(false);
        }}
        maskClosable={true}
        width={800}
      >
        <Descriptions title="Book Info" items={items} bordered />
      </Drawer>
    </>
  );
};

export default DetailBook;
