import React from "react";
import { Button, Row, Col, Typography, Card, Carousel, Divider } from "antd";
import {
  LoginOutlined,
  UserAddOutlined,
  ReadOutlined,
  SafetyCertificateOutlined,
  RocketOutlined,
  PhoneOutlined,
  MailOutlined,
  EnvironmentOutlined,
  TrophyOutlined,
  TeamOutlined,
  HeartFilled,
  StarFilled,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const { Title, Paragraph } = Typography;

// ============ ANIMATION VARIANTS ============
const fadeInUp = {
  hidden: { opacity: 0, y: 60 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.8 } },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.2 },
  },
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.5 } },
};

const floatAnimation = {
  animate: {
    y: [0, -20, 0],
    transition: { duration: 4, repeat: Infinity },
  },
};

// ============ BANNER DATA ============
import banner1 from "../../assets/banners/banner-1.png";
import banner2 from "../../assets/banners/banner-2.png";
import banner3 from "../../assets/banners/banner-3.png";

const bannerSlides = [
  {
    title: "Giảm Giá 50%",
    subtitle: "Sách văn học kinh điển",
    description: "Áp dụng cho tất cả sách văn học trong tuần này",
    image: banner1,
  },
  {
    title: "Sách Mới Nhất 2026",
    subtitle: "Cập nhật hàng ngày",
    description: "Khám phá những tựa sách best‑seller mới nhất",
    image: banner2,
  },
  {
    title: "Freeship Toàn Quốc",
    subtitle: "Đơn hàng từ 200K",
    description: "Giao hàng nhanh chóng trong 1‑3 ngày",
    image: banner3,
  },
];

// ============ STATISTICS DATA ============
const statistics = [
  {
    number: "50,000+",
    label: "Đầu Sách",
    icon: <ReadOutlined />,
    color: "#6366f1",
  },
  {
    number: "100,000+",
    label: "Khách Hàng",
    icon: <TeamOutlined />,
    color: "#8b5cf6",
  },
  { number: "99%", label: "Hài Lòng", icon: <HeartFilled />, color: "#ec4899" },
  {
    number: "50+",
    label: "Giải Thưởng",
    icon: <TrophyOutlined />,
    color: "#f59e0b",
  },
];

// ============ TESTIMONIALS DATA ============
const testimonials = [
  {
    name: "Nguyễn Văn A",
    role: "Sinh viên",
    content:
      "Trang web tuyệt vời với kho sách đa dạng. Giao hàng nhanh và đóng gói cẩn thận!",
    avatar: "👨‍🎓",
  },
  {
    name: "Trần Thị B",
    role: "Giáo viên",
    content:
      "Tôi đã tìm được nhiều sách giáo khoa quý hiếm ở đây. Rất hài lòng với dịch vụ!",
    avatar: "👩‍🏫",
  },
  {
    name: "Lê Văn C",
    role: "Doanh nhân",
    content:
      "Sách kinh doanh chất lượng, giá cả hợp lý. Đội ngũ hỗ trợ rất nhiệt tình.",
    avatar: "👨‍💼",
  },
];

// ============ FEATURES DATA ============
const features = [
  {
    icon: <ReadOutlined />,
    title: "Kho Sách Khổng Lồ",
    description:
      "Hơn 50,000 đầu sách từ văn học, khoa học, kinh tế đến sách thiếu nhi.",
    color: "#3b82f6",
    bgColor: "rgba(59, 130, 246, 0.1)",
  },
  {
    icon: <SafetyCertificateOutlined />,
    title: "Thanh Toán An Toàn",
    description:
      "Tích hợp đa dạng cổng thanh toán bảo mật. Hỗ trợ COD, ví điện tử.",
    color: "#8b5cf6",
    bgColor: "rgba(139, 92, 246, 0.1)",
  },
  {
    icon: <RocketOutlined />,
    title: "Giao Hàng Siêu Tốc",
    description: "Freeship toàn quốc đơn từ 200K. Giao hàng trong 1‑3 ngày.",
    color: "#ec4899",
    bgColor: "rgba(236, 72, 153, 0.1)",
  },
];

// ============ MAIN COMPONENT ============
const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 overflow-x-hidden font-sans">
      {/* HERO SECTION */}
      <section className="relative min-h-screen flex items-center justify-center bg-white">
        {/* Subtle gradient overlay */}
        <div className="absolute inset-0 bg-linear-to-br from-white via-gray-50 to-white opacity-70" />
        {/* Floating book emojis */}
        <motion.div
          className="absolute top-[12%] left-[8%] text-7xl  "
          {...floatAnimation}
        >
          📚
        </motion.div>
        <motion.div
          className="absolute bottom-[15%] right-[10%] text-6xl "
          animate={{ y: [0, -30, 0] }}
          transition={{ duration: 6, repeat: Infinity }}
        >
          📔
        </motion.div>
        {/* Hero Content */}
        <motion.div
          className="relative z-10 text-center px-6 max-w-4xl mx-auto"
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
        >
          <motion.div
            variants={fadeInUp}
            className="inline-block mb-6 px-4 py-2 rounded-full bg-gray-100 border border-gray-200"
          >
            <span className="text-gray-700 font-medium tracking-wide text-sm uppercase">
              🚀 Trải nghiệm mua sách thế hệ mới
            </span>
          </motion.div>
          <motion.h1
            variants={fadeInUp}
            className="text-5xl md:text-7xl font-extrabold mb-8 leading-tight text-gray-900"
          >
            Book Library
          </motion.h1>
          <motion.p
            variants={fadeInUp}
            className="text-xl md:text-2xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed"
          >
            Khám phá thế giới tri thức vô tận với hơn{" "}
            <span className="text-gray-900 font-bold border-b-2 border-blue-500">
              50,000
            </span>{" "}
            đầu sách.
            <br />
            Nền tảng mua bán sách trực tuyến{" "}
            <span className="text-gray-900 font-bold border-b-2 border-blue-500">
              hàng đầu Việt Nam
            </span>
            .
          </motion.p>
          <motion.div
            variants={fadeInUp}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
              <Button
                type="primary"
                size="large"
                icon={<LoginOutlined />}
                onClick={() => navigate("/login")}
                style={{
                  height: 56,
                  padding: "0 48px",
                  fontSize: 16,
                  borderRadius: 8,
                  background: "#111827",
                  border: "none",
                  boxShadow: "0 8px 20px rgba(0,0,0,0.1)",
                  fontWeight: 600,
                }}
              >
                Đăng Nhập Ngay
              </Button>
            </motion.div>
            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
              <Button
                size="large"
                icon={<UserAddOutlined />}
                onClick={() => navigate("/register")}
                style={{
                  height: 56,
                  padding: "0 48px",
                  fontSize: 16,
                  borderRadius: 8,
                  background: "white",
                  border: "1px solid #e5e7eb",
                  color: "#111827",
                  fontWeight: 600,
                  boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
                }}
              >
                Tạo Tài Khoản
              </Button>
            </motion.div>
          </motion.div>
        </motion.div>
      </section>

      {/* BANNER CAROUSEL */}
      <section className="py-20 px-6 bg-white border-t border-gray-100">
        <motion.div
          className="max-w-7xl mx-auto"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={fadeIn}
        >
          <Carousel
            autoplay
            effect="fade"
            dotPosition="bottom"
            className="rounded-2xl overflow-hidden shadow-xl ring-1 ring-gray-200"
          >
            {bannerSlides.map((slide, index) => (
              <div key={index}>
                <div
                  className="h-[400px] md:h-[500px] flex items-center justify-center relative"
                  style={{
                    backgroundImage: `url(${slide.image})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                >
                  <div className="absolute inset-0 bg-black/30" />
                  <div className="text-center text-white relative z-10 px-4">
                    <motion.h2 className="text-4xl md:text-6xl font-bold mb-4 drop-shadow-xl">
                      {slide.title}
                    </motion.h2>
                    <motion.h3 className="text-2xl md:text-3xl font-light mb-8 drop-shadow-md">
                      {slide.subtitle}
                    </motion.h3>
                    <motion.p className="text-lg max-w-xl mx-auto mb-8 drop-shadow-md">
                      {slide.description}
                    </motion.p>
                    <Button
                      size="large"
                      style={{
                        height: 50,
                        padding: "0 36px",
                        borderRadius: 6,
                        background: "white",
                        color: "#111827",
                        border: "none",
                        fontWeight: 600,
                        fontSize: 16,
                        boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                      }}
                    >
                      Khám Phá Ngay
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </Carousel>
        </motion.div>
      </section>

      {/* STATISTICS SECTION */}
      <section className="py-24 px-6 bg-gray-50">
        <motion.div
          className="max-w-7xl mx-auto"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={staggerContainer}
        >
          <Row gutter={[32, 32]} className="text-center">
            {statistics.map((stat, index) => (
              <Col xs={12} md={6} key={index}>
                <motion.div
                  variants={scaleIn}
                  whileHover={{ y: -5 }}
                  className="p-8 bg-white rounded-xl shadow-sm border border-gray-100 group hover:shadow-md transition-all"
                >
                  <div className="text-3xl mb-4 text-gray-400 group-hover:text-blue-600 transition-colors">
                    {stat.icon}
                  </div>
                  <div className="text-4xl md:text-5xl font-bold text-gray-900 mb-2 tracking-tight">
                    {stat.number}
                  </div>
                  <div className="text-gray-500 font-medium uppercase tracking-wider text-xs">
                    {stat.label}
                  </div>
                </motion.div>
              </Col>
            ))}
          </Row>
        </motion.div>
      </section>

      {/* FEATURES SECTION */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="text-center mb-20"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            <h2 className="text-3xl md:text-5xl font-bold mb-6 text-gray-900 tracking-tight">
              Tại sao chọn Book Library?
            </h2>
            <p className="text-gray-500 text-lg max-w-2xl mx-auto font-light">
              Cam kết chất lượng dịch vụ hàng đầu
            </p>
          </motion.div>
          <Row gutter={[32, 32]}>
            {features.map((feature, index) => (
              <Col xs={24} md={8} key={index}>
                <motion.div
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  variants={fadeInUp}
                >
                  <Card
                    className="h-full border border-gray-100 hover:shadow-xl transition-shadow duration-300"
                    style={{
                      borderRadius: 16,
                      background: "rgba(255,255,255,0.6)",
                      backdropFilter: "blur(12px)",
                    }}
                    bodyStyle={{ padding: 40 }}
                  >
                    <div className="flex flex-col items-center text-center">
                      <div className="w-16 h-16 rounded-2xl bg-gray-50 flex items-center justify-center mb-6 text-2xl text-gray-800">
                        {feature.icon}
                      </div>
                      <Title level={4} style={{ marginBottom: 16 }}>
                        {feature.title}
                      </Title>
                      <Paragraph style={{ color: "#6b7280", marginBottom: 0 }}>
                        {feature.description}
                      </Paragraph>
                    </div>
                  </Card>
                </motion.div>
              </Col>
            ))}
          </Row>
        </div>
      </section>

      {/* TESTIMONIALS SECTION */}
      <section className="py-24 px-6 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="text-center mb-20"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            <h2 className="text-3xl md:text-5xl font-bold mb-6 text-gray-900 tracking-tight">
              Khách hàng nói về chúng tôi
            </h2>
          </motion.div>
          <Row gutter={[32, 32]}>
            {testimonials.map((testimonial, index) => (
              <Col xs={24} md={8} key={index}>
                <motion.div
                  whileHover={{ y: -5 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card
                    className="h-full border-none shadow-lg"
                    style={{
                      borderRadius: 16,
                      background: "rgba(255,255,255,0.9)",
                    }}
                    bodyStyle={{ padding: 32 }}
                  >
                    <div className="flex items-center gap-4 mb-6">
                      <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center text-xl">
                        {testimonial.avatar}
                      </div>
                      <div>
                        <div className="text-gray-900 font-bold">
                          {testimonial.name}
                        </div>
                        <div className="text-gray-500 text-sm">
                          {testimonial.role}
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-1 mb-4 text-yellow-400">
                      {[...Array(5)].map((_, i) => (
                        <StarFilled key={i} />
                      ))}
                    </div>
                    <Paragraph className="text-gray-600 italic">
                      "{testimonial.content}"
                    </Paragraph>
                  </Card>
                </motion.div>
              </Col>
            ))}
          </Row>
        </div>
      </section>

      {/* CALL TO ACTION SECTION */}
      <section className="py-24 px-6 bg-white border-t border-gray-100">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900 tracking-tight">
            Sẵn sàng đọc sách?
          </h2>
          <p className="text-xl text-gray-500 mb-12 font-light">
            Gia nhập cộng đồng hơn 100,000 độc giả ngay hôm nay.
          </p>
          <Button
            type="primary"
            size="large"
            onClick={() => navigate("/register")}
            style={{
              height: 56,
              padding: "0 60px",
              fontSize: 16,
              borderRadius: 8,
              background: "#111827",
              border: "none",
              fontWeight: 600,
              boxShadow: "0 8px 20px rgba(0,0,0,0.1)",
            }}
          >
            Đăng Ký Tài Khoản
          </Button>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-gray-50 py-16 px-6 border-t border-gray-200">
        <div className="max-w-7xl mx-auto">
          <Row gutter={[48, 48]}>
            <Col xs={24} md={8}>
              <h3 className="text-2xl font-bold mb-6 text-gray-900">
                Book Library
              </h3>
              <Paragraph className="text-gray-500">
                Nền tảng mua bán sách trực tuyến uy tín. Chất lượng thật - Giá
                trị thật.
              </Paragraph>
            </Col>
            <Col xs={12} md={8}>
              <h4 className="font-bold mb-6 text-gray-900">Liên Kết</h4>
              <div className="flex flex-col gap-3 text-gray-500">
                <a href="#" className="hover:text-blue-600 transition-colors">
                  Trang Chủ
                </a>
                <a href="#" className="hover:text-blue-600 transition-colors">
                  Về Chúng Tôi
                </a>
                <a href="#" className="hover:text-blue-600 transition-colors">
                  Điều Khoản
                </a>
              </div>
            </Col>
            <Col xs={24} md={8}>
              <h4 className="font-bold mb-6 text-gray-900">Liên Hệ</h4>
              <ul className="space-y-4 text-gray-500">
                <li className="flex items-center gap-3">
                  <EnvironmentOutlined /> 123 Đường Sách, TP.HCM
                </li>
                <li className="flex items-center gap-3">
                  <PhoneOutlined /> 1900 1234
                </li>
                <li className="flex items-center gap-3">
                  <MailOutlined /> hotro@booklibrary.vn
                </li>
              </ul>
            </Col>
          </Row>
          <Divider className="my-12" />
          <div className="text-center text-gray-400 text-sm">
            © 2026 Book Library. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
