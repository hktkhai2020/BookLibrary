import { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ImageGallery from "react-image-gallery";
import {
  Button,
  Divider,
  InputNumber,
  message,
  Rate,
  Spin,
  Tag,
  Breadcrumb,
} from "antd";
import { ShoppingCartOutlined } from "@ant-design/icons";
import { getBookDetailAPI } from "@/services/api.service";
import ModalGallery from "./modal.gallery";
import { useCurrentContext } from "@/components/context/context";

const BookDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [bookDetail, setBookDetail] = useState<IBookTable | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isOpenModalGallery, setIsOpenModalGallery] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const refGallery = useRef<ImageGallery>(null);
  const { isUser, shoppingCart, setShoppingCart } = useCurrentContext();
  const navigative = useNavigate();
  useEffect(() => {
    if (id) {
      setIsLoading(true);
      getBookDetailAPI(id)
        .then((res) => {
          if (res?.data?.data) {
            setBookDetail(res.data.data);
          }
        })
        .catch((error) => {
          console.error("Error fetching book detail:", error);
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [id]);

  // Tạo images array từ thumbnail và slider
  const images =
    bookDetail?.slider && bookDetail.slider.length > 0
      ? [
          {
            original: `https://backend-booklaborary.onrender.com/images/book/${bookDetail.thumbnail}`,
            thumbnail: `https://backend-booklaborary.onrender.com/images/book/${bookDetail.thumbnail}`,
          },
          ...bookDetail.slider.map((img) => ({
            original: `https://backend-booklaborary.onrender.com/images/book/${img}`,
            thumbnail: `https://backend-booklaborary.onrender.com/images/book/${img}`,
          })),
        ]
      : bookDetail?.thumbnail
        ? [
            {
              original: `https://backend-booklaborary.onrender.com/images/book/${bookDetail.thumbnail}`,
              thumbnail: `https://backend-booklaborary.onrender.com/images/book/${bookDetail.thumbnail}`,
            },
          ]
        : [];

  const handleOnclickImage = () => {
    const index = refGallery.current?.getCurrentIndex() as number;
    setCurrentIndex(index || 0);
    setIsOpenModalGallery(true);
  };

  const breadcrumb = [
    {
      title: "Trang chủ",
      href: "/",
    },
    {
      title: "Sách",
    },
    {
      title: bookDetail?.mainText,
      href: `/book/${bookDetail?._id}`,
    },
  ];

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen ">
        <Spin size="large" />
      </div>
    );
  }

  if (!bookDetail) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-xl">Không tìm thấy sách</p>
      </div>
    );
  }

  return (
    <>
      <div className="w-full overflow-x-hidden mt-2 md:mt-4 mx-2 sm:mx-4 md:mx-7 flex flex-col items-center">
        <Breadcrumb items={breadcrumb} />
        <div className="w-full flex justify-center mt-2 md:mt-4 mx-2 sm:mx-4 md:mx-7">
          <div className="main w-full max-w-7xl py-4 sm:py-6 md:py-10 px-4 sm:px-6 md:px-10 bg-[var(--ant-color-bg-container)] border border-black/10 shadow-sm flex flex-col lg:flex-row gap-6 md:gap-10 rounded-[var(--ant-border-radius-lg)]">
            {/* Gallery Section */}
            <div className="gallery-item w-full lg:w-1/2 min-w-0">
              <div className="w-full overflow-hidden">
                <ImageGallery
                  ref={refGallery}
                  items={images}
                  showPlayButton={false}
                  showFullscreenButton={false}
                  showBullets={true}
                  showThumbnails={true}
                  thumbnailPosition="bottom"
                  renderLeftNav={() => <></>}
                  renderRightNav={() => <></>}
                  onClick={handleOnclickImage}
                />
              </div>
            </div>

            {/* Info Section */}
            <div className="info-item w-full lg:w-1/2 flex flex-col gap-4 md:gap-6 min-w-0">
              {/* Author */}
              <div>
                <Tag color="blue" className="text-sm">
                  {bookDetail.category}
                </Tag>
                <p className="text-gray-500 mt-2">
                  Tác giả: {bookDetail.author}
                </p>
              </div>

              {/* Main Text */}
              <div>
                <h1 className="text-xl sm:text-2xl md:text-3xl font-bold break-words">
                  {bookDetail.mainText}
                </h1>
              </div>

              {/* Rating & Sold */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4">
                <Rate
                  disabled
                  defaultValue={4.5}
                  allowHalf
                  className="text-sm sm:text-base"
                />
                <span className="text-sm sm:text-base text-gray-600">
                  Đã bán: {bookDetail.sold || 0}
                </span>
              </div>

              <Divider />

              {/* Price */}
              <div>
                <p className="text-gray-600 text-sm mb-2">Giá bán</p>
                <p className="text-2xl sm:text-3xl md:text-4xl font-bold text-red-600">
                  {new Intl.NumberFormat("vi-VN", {
                    style: "currency",
                    currency: "VND",
                  }).format(bookDetail.price)}
                </p>
              </div>

              <Divider />

              {/* Quantity */}
              <div>
                <p className="text-gray-600 text-sm mb-2">Số lượng</p>
                <InputNumber
                  min={1}
                  max={bookDetail.quantity}
                  value={quantity}
                  onChange={(value) => setQuantity(value || 1)}
                  className="w-32"
                  defaultValue={1}
                />
                <p className="text-gray-500 text-xs mt-2">
                  Còn lại: {bookDetail.quantity} sản phẩm
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-4">
                <Button
                  type="primary"
                  size="large"
                  icon={<ShoppingCartOutlined />}
                  className="w-full sm:flex-1"
                  disabled={bookDetail.quantity === 0}
                  onClick={() => {
                    if (isUser) {
                      const newShoppingCart = [...shoppingCart];
                      const existingItemIndex = newShoppingCart.findIndex(
                        (item) => item._id === bookDetail._id,
                      );
                      console.log(existingItemIndex);
                      if (existingItemIndex > -1) {
                        newShoppingCart[existingItemIndex] = {
                          ...newShoppingCart[existingItemIndex],
                          quantity:
                            newShoppingCart[existingItemIndex].quantity +
                            quantity,
                        };
                      } else {
                        newShoppingCart.push({
                          _id: bookDetail._id,
                          quantity,
                          detail: bookDetail,
                        });
                      }

                      localStorage.setItem(
                        "shoppingCart",
                        JSON.stringify(newShoppingCart),
                      );
                      setShoppingCart(newShoppingCart);
                      message.success("Thêm vào giỏ hàng thành công");
                    } else {
                      message.error("Vui lòng đăng nhập để mua hàng");
                      navigative("/login");
                    }
                  }}
                >
                  <span className="hidden sm:inline">Thêm vào giỏ hàng</span>
                  <span className="sm:hidden">Thêm giỏ</span>
                </Button>
                <Button
                  size="large"
                  className="w-full sm:flex-1"
                  disabled={bookDetail.quantity === 0}
                  onClick={() => {
                    if (isUser) {
                      const newShoppingCart = [...shoppingCart];
                      const existingItemIndex = newShoppingCart.findIndex(
                        (item) => item._id === bookDetail._id,
                      );
                      console.log(existingItemIndex);
                      if (existingItemIndex > -1) {
                        newShoppingCart[existingItemIndex] = {
                          ...newShoppingCart[existingItemIndex],
                          quantity:
                            newShoppingCart[existingItemIndex].quantity +
                            quantity,
                        };
                      } else {
                        newShoppingCart.push({
                          _id: bookDetail._id,
                          quantity,
                          detail: bookDetail,
                        });
                      }

                      localStorage.setItem(
                        "shoppingCart",
                        JSON.stringify(newShoppingCart),
                      );
                      setShoppingCart(newShoppingCart);
                      message.success("Add 1 items success");
                      navigative("/order");
                    } else {
                      message.error("Please Sign in to shopping");
                      navigative("/login");
                    }
                  }}
                >
                  Mua ngay
                </Button>
              </div>

              {/* Delivery Info */}
              <div className="mt-4 md:mt-6 p-3 sm:p-4 bg-gray-50 rounded-lg">
                <h3 className="font-semibold mb-2 text-sm sm:text-base">
                  Thông tin giao hàng
                </h3>
                <ul className="text-xs sm:text-sm text-gray-600 space-y-1">
                  <li>✓ Miễn phí vận chuyển cho đơn hàng trên 500.000đ</li>
                  <li>✓ Giao hàng toàn quốc</li>
                  <li>✓ Nhận hàng trong 2-5 ngày</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal Gallery */}
      <ModalGallery
        isOpen={isOpenModalGallery}
        onClose={() => setIsOpenModalGallery(false)}
        images={images}
        currentIndex={currentIndex}
      />
    </>
  );
};

export default BookDetail;
