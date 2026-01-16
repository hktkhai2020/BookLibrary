import React, { useState, useRef, useEffect } from "react";
import { Modal, Input, Button, Spin, message } from "antd";
import { SendOutlined, RobotOutlined, UserOutlined } from "@ant-design/icons";

interface Message {
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

interface AIChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialQuestion?: string;
}

const AIChatModal: React.FC<AIChatModalProps> = ({
  isOpen,
  onClose,
  initialQuestion = "",
}) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (initialQuestion && isOpen) {
      setInputValue(initialQuestion);
      handleSendMessage(initialQuestion);
    }
  }, [isOpen, initialQuestion]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Mock AI API - Có thể thay thế bằng API thật
  const callAPI = async (question: string): Promise<string> => {
    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Mock responses based on keywords
    const lowerQuestion = question.toLowerCase();

    if (lowerQuestion.includes("sách") || lowerQuestion.includes("book")) {
      return "Tôi có thể giúp bạn tìm kiếm sách. Bạn đang tìm sách về chủ đề gì? Ví dụ: tiểu thuyết, khoa học, lịch sử...";
    }

    if (lowerQuestion.includes("tác giả") || lowerQuestion.includes("author")) {
      return "Bạn muốn tìm hiểu về tác giả nào? Tôi có thể giúp bạn tìm thông tin về các tác giả và tác phẩm của họ.";
    }

    if (lowerQuestion.includes("giá") || lowerQuestion.includes("price")) {
      return "Bạn có thể xem giá sách chi tiết trên trang sản phẩm. Nếu bạn có câu hỏi cụ thể về giá, vui lòng cho tôi biết tên sách.";
    }

    if (lowerQuestion.includes("mua") || lowerQuestion.includes("buy")) {
      return "Để mua sách, bạn cần đăng nhập vào tài khoản. Sau đó thêm sách vào giỏ hàng và tiến hành thanh toán.";
    }

    // Default response
    return `Cảm ơn bạn đã hỏi: "${question}". Tôi là trợ lý AI của BookStore. Tôi có thể giúp bạn:
- Tìm kiếm sách theo chủ đề, tác giả
- Tư vấn về sách phù hợp
- Hướng dẫn mua hàng
- Giải đáp thắc mắc về giá và khuyến mãi

Bạn muốn hỏi gì tiếp theo?`;
  };

  const handleSendMessage = async (question?: string) => {
    const userMessage = question || inputValue.trim();
    if (!userMessage) return;

    // Add user message
    const newUserMessage: Message = {
      role: "user",
      content: userMessage,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, newUserMessage]);
    setInputValue("");

    // Call AI API
    setIsLoading(true);
    try {
      const aiResponse = await callAPI(userMessage);
      const newAIMessage: Message = {
        role: "assistant",
        content: aiResponse,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, newAIMessage]);
    } catch {
      message.error("Không thể kết nối với AI. Vui lòng thử lại sau.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey && !isLoading) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleClose = () => {
    setMessages([]);
    setInputValue("");
    onClose();
  };

  return (
    <Modal
      open={isOpen}
      onCancel={handleClose}
      footer={null}
      width={600}
      title={
        <div className="flex items-center gap-2">
          <RobotOutlined className="text-blue-500" />
          <span>Trợ lý AI BookStore</span>
        </div>
      }
      className="ai-chat-modal"
    >
      <div className="flex flex-col h-[500px]">
        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 mb-4 bg-gray-50 rounded-lg">
          {messages.length === 0 && (
            <div className="text-center text-gray-500 py-8">
              <RobotOutlined className="text-4xl mb-2 text-blue-500" />
              <p>Xin chào! Tôi có thể giúp gì cho bạn?</p>
              <p className="text-sm mt-2">
                Hỏi về sách, tác giả, giá cả, hoặc cách mua hàng...
              </p>
            </div>
          )}

          {messages.map((msg, index) => (
            <div
              key={index}
              className={`flex gap-3 ${
                msg.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              {msg.role === "assistant" && (
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center">
                    <RobotOutlined className="text-white text-sm" />
                  </div>
                </div>
              )}

              <div
                className={`max-w-[80%] rounded-lg px-4 py-2 ${
                  msg.role === "user"
                    ? "bg-blue-500 text-white"
                    : "bg-white border border-gray-200 text-gray-800"
                }`}
              >
                <div className="text-sm whitespace-pre-wrap">{msg.content}</div>
                <div
                  className={`text-xs mt-1 ${
                    msg.role === "user" ? "text-blue-100" : "text-gray-400"
                  }`}
                >
                  {msg.timestamp.toLocaleTimeString("vi-VN", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </div>
              </div>

              {msg.role === "user" && (
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center">
                    <UserOutlined className="text-gray-600 text-sm" />
                  </div>
                </div>
              )}
            </div>
          ))}

          {isLoading && (
            <div className="flex gap-3 justify-start">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center">
                  <RobotOutlined className="text-white text-sm" />
                </div>
              </div>
              <div className="bg-white border border-gray-200 rounded-lg px-4 py-2">
                <Spin size="small" />
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="flex gap-2">
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onPressEnter={handleKeyPress}
            placeholder="Nhập câu hỏi của bạn..."
            disabled={isLoading}
            className="flex-1"
            size="large"
          />
          <Button
            type="primary"
            icon={<SendOutlined />}
            onClick={() => handleSendMessage()}
            disabled={!inputValue.trim() || isLoading}
            size="large"
          >
            Gửi
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default AIChatModal;
