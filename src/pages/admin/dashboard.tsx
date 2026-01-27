import type { StatisticProps } from "antd";
import { Col, Row, Statistic, Card } from "antd";
import CountUp from "react-countup";
import { dashboardAPI } from "@/services/api.service";
import { useEffect, useState } from "react";
import {
  UserOutlined,
  BookOutlined,
  ShoppingCartOutlined,
} from "@ant-design/icons";

const DashboardPage: React.FC = () => {
  const [countOrder, setCountOrder] = useState<number>(0);
  const [countUser, setCountUser] = useState<number>(0);
  const [countBook, setCountBook] = useState<number>(0);

  const formatter: StatisticProps["formatter"] = (value) => (
    <CountUp end={value as number} separator="," duration={1.5} />
  );

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await dashboardAPI();
        if (res.data.data) {
          setCountOrder(res.data.data.countOrder);
          setCountUser(res.data.data.countUser);
          setCountBook(res.data.data.countBook);
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, []);

  const stats = [
    {
      title: "Active Users",
      value: countUser,
      icon: <UserOutlined />,
      color: "#6366f1",
      bgColor: "#eef2ff",
    },
    {
      title: "Total Books",
      value: countBook,
      icon: <BookOutlined />,
      color: "#10b981",
      bgColor: "#ecfdf5",
    },
    {
      title: "Total Orders",
      value: countOrder,
      icon: <ShoppingCartOutlined />,
      color: "#f59e0b",
      bgColor: "#fffbeb",
    },
  ];

  return (
    <div style={{ padding: "24px" }}>
      <Row gutter={[24, 24]}>
        {stats.map((stat, index) => (
          <Col xs={24} sm={12} lg={8} key={index}>
            <Card
              className="dashboard-card"
              style={{
                borderRadius: "16px",
                border: "1px solid #f0f0f0",
                boxShadow: "0 2px 8px rgba(0, 0, 0, 0.06)",
                transition: "all 0.3s ease",
                background: "#ffffff",
              }}
              hoverable
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "16px",
                }}
              >
                <div
                  style={{
                    width: "56px",
                    height: "56px",
                    borderRadius: "12px",
                    background: stat.bgColor,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "24px",
                    color: stat.color,
                  }}
                >
                  {stat.icon}
                </div>
                <div>
                  <p
                    style={{
                      margin: 0,
                      fontSize: "14px",
                      color: "#6b7280",
                      fontWeight: 500,
                    }}
                  >
                    {stat.title}
                  </p>
                  <Statistic
                    value={stat.value}
                    formatter={formatter}
                    valueStyle={{
                      fontSize: "28px",
                      fontWeight: 700,
                      color: "#1f2937",
                    }}
                  />
                </div>
              </div>
            </Card>
          </Col>
        ))}
      </Row>

      <style>{`
        .dashboard-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 24px rgba(0, 0, 0, 0.1) !important;
        }
      `}</style>
    </div>
  );
};

export default DashboardPage;
