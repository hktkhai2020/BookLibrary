import { useCurrentContext } from "components/context/context";
import { InputNumber, Button, Divider } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
const OrderPage = () => {
  const { shoppingCart, setShoppingCart } = useCurrentContext();
  const navigate = useNavigate();
  return (
    <>
      <div className="w-full py-6 px-4 md:px-10 lg:px-20 lg:pt-10 flex flex-col lg:flex-row gap-6 lg:gap-10 items-start">
        {/* Left Side: Cart Items */}
        <div className="listItems w-full lg:flex-[3]">
          {shoppingCart.length > 0 ? (
            shoppingCart.map((item) => (
              <div
                key={item._id}
                className="flex flex-col sm:flex-row items-center bg-[var(--ant-color-bg-container)] gap-4 mb-4 p-4 rounded-2xl hover:shadow-md transition-shadow border border-gray-100"
              >
                {/* Product Info Group */}
                <div
                  className="flex items-center gap-4 flex-1 w-full cursor-pointer"
                  onClick={() => navigate(`/book/${item._id}`)}
                >
                  <div className="w-20 h-28 sm:w-24 sm:h-32 shrink-0 overflow-hidden rounded-lg shadow-sm">
                    <img
                      src={`http://localhost:8080/images/book/${item.detail.thumbnail}`}
                      alt={item.detail.thumbnail}
                      className="object-cover w-full h-full"
                    />
                  </div>
                  <div className="flex-1 min-w-0 text-sm sm:text-base font-medium text-gray-800 line-clamp-2">
                    {item.detail.mainText}
                  </div>
                </div>

                {/* Price & Quantity Group */}
                <div className="flex items-center justify-between w-full sm:w-auto sm:gap-8 border-t sm:border-t-0 pt-3 sm:pt-0">
                  <div className="flex flex-col items-start sm:items-center">
                    <span className="text-xs text-gray-400 sm:hidden">
                      Đơn giá
                    </span>
                    <div className="font-semibold text-blue-600">
                      {new Intl.NumberFormat("vi-VN", {
                        style: "currency",
                        currency: "VND",
                      }).format(item.detail.price)}
                    </div>
                  </div>

                  <div className="flex flex-col items-center">
                    <span className="text-xs text-gray-400 mb-1 sm:hidden">
                      Số lượng
                    </span>
                    <InputNumber
                      min={1}
                      value={item.quantity}
                      size="small"
                      onChange={(value) => {
                        if (value) {
                          const newCart = shoppingCart.map((x) => {
                            if (x._id === item._id) {
                              return { ...x, quantity: value };
                            }
                            return x;
                          });
                          setShoppingCart(newCart);
                          localStorage.setItem(
                            "shoppingCart",
                            JSON.stringify(newCart)
                          );
                        }
                      }}
                      className="w-16 sm:w-20"
                    />
                  </div>

                  <div className="hidden md:flex flex-col items-end">
                    <span className="text-xs text-gray-400">Thành tiền</span>
                    <div className="font-bold text-gray-900">
                      {new Intl.NumberFormat("vi-VN", {
                        style: "currency",
                        currency: "VND",
                      }).format(item.detail.price * item.quantity)}
                    </div>
                  </div>

                  <div
                    className="text-red-500 cursor-pointer hover:scale-110 transition-transform"
                    onClick={() => {
                      const newCart = shoppingCart.filter(
                        (x) => x._id !== item._id
                      );
                      setShoppingCart(newCart);
                      localStorage.setItem(
                        "shoppingCart",
                        JSON.stringify(newCart)
                      );
                    }}
                  >
                    <DeleteOutlined style={{ fontSize: "1.2rem" }} />
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-20 bg-white rounded-2xl shadow-sm border border-dashed border-gray-300">
              <div className="text-4xl mb-4 opacity-20">🛒</div>
              <p className="text-gray-500">Giỏ hàng rỗng</p>
              <Button type="link" onClick={() => navigate("/")}>
                Tiếp tục mua sắm
              </Button>
            </div>
          )}
        </div>

        {/* Right Side: Payment Info */}
        <div className="Payment w-full lg:flex-1 bg-[var(--ant-color-bg-container)] p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100 sticky top-20">
          <h2 className="text-xl font-bold mb-6 border-b pb-4">Tạm tính</h2>

          <div className="space-y-4 mt-7">
            <div className="flex items-center justify-between text-gray-600 ">
              <span>Tổng tiền hàng</span>
              <span className="font-medium">
                {new Intl.NumberFormat("vi-VN", {
                  style: "currency",
                  currency: "VND",
                }).format(
                  shoppingCart.reduce(
                    (total, item) => total + item.detail.price * item.quantity,
                    0
                  )
                )}
              </span>
            </div>

            <div className="flex items-center justify-between text-gray-600">
              <span>Phí vận chuyển</span>
              <span className="text-green-500">Miễn phí</span>
            </div>

            <Divider className="my-2" />

            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="text-gray-800 font-semibold">Tổng cộng</span>
                <span className="text-2xl font-bold text-red-500">
                  {new Intl.NumberFormat("vi-VN", {
                    style: "currency",
                    currency: "VND",
                  }).format(
                    shoppingCart.reduce(
                      (total, item) =>
                        total + item.detail.price * item.quantity,
                      0
                    )
                  )}
                </span>
              </div>
              <p className="text-[10px] text-gray-400 text-right italic">
                (Đã bao gồm thuế VAT nếu có)
              </p>
            </div>
          </div>

          <Button
            type="primary"
            size="large"
            className="w-full mt-8 h-12 text-lg font-bold shadow-lg shadow-blue-100"
          >
            Đặt Hàng ({shoppingCart.length})
          </Button>

          <div className="mt-4 text-center">
            <p className="text-xs text-gray-400">Đảm bảo an toàn & bảo mật</p>
          </div>
        </div>
      </div>
    </>
  );
};
export default OrderPage;
