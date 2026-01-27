import { Drawer, Descriptions, Badge, Image } from "antd";
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
        // <img
        //   src={`https://backend-booklaborary.onrender.com/images/avatar/${detailBook?.thumbnail}`}
        //   style={{ width: "5rem", height: "4rem", objectFit: "cover" }}
        //   alt=""
        // />

        <Image
          width={200}
          alt="basic"
          src={`https://backend-booklaborary.onrender.com/images/book/${detailBook?.thumbnail}`}
          style={{ width: "5rem", height: "4rem", objectFit: "cover" }}
        />
      ),
      span: 1.5,
    },
    {
      key: "7",
      label: "Created At",
      children: <>{dayjs(detailBook?.createdAt).format("DD-MM-YYYY")}</>,
      span: 1.5,
    },
    {
      key: "8",
      label: "Updated At",
      children: <>{dayjs(detailBook?.updatedAt).format("DD-MM-YYYY")}</>,
      span: 1.5,
    },
    {
      key: "9",
      label: "preview",
      children: (
        <>
          {detailBook?.slider && detailBook.slider.length > 0 ? (
            <Image.PreviewGroup>
              {detailBook.slider.map((item, index) => {
                return (
                  <Image
                    key={index}
                    width={200}
                    alt={`book-image-${index}`}
                    src={`https://backend-booklaborary.onrender.com/images/book/${item}`}
                    style={{
                      width: "5rem",
                      height: "4rem",
                      objectFit: "cover",
                      marginRight: "8px",
                      marginBottom: "8px",
                    }}
                  />
                );
              })}
            </Image.PreviewGroup>
          ) : (
            <span>No images available</span>
          )}
        </>
      ),
      span: 3,
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
