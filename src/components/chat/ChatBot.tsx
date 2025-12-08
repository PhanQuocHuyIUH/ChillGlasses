"use client";

import React, { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, Loader2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import axios from "@/lib/api/axios";

interface Message {
  id: string;
  type: "user" | "bot";
  content: string;
  timestamp: Date;
  productSuggestions?: ProductSuggestion[];
}

interface ProductSuggestion {
  productId: number;
  productName: string;
  imageUrl: string;
  price: number;
  reason: string;
}

export default function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      type: "bot",
      content:
        "Xin chào! 👋 Tôi là trợ lý AI của ChillGlasses. Tôi có thể giúp bạn:\n\n🔍 Tư vấn kính phù hợp với khuôn mặt\n💰 Gợi ý sản phẩm theo ngân sách\n🎨 Tư vấn màu sắc phù hợp với tông da\n✨ Xu hướng thời trang kính mắt\n\nBạn cần tư vấn gì?",
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content: inputValue,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsLoading(true);

    try {
      // Determine context type based on message content
      let contextType = "general_chat";
      const lowerMsg = inputValue.toLowerCase();

      if (
        lowerMsg.includes("mặt") ||
        lowerMsg.includes("khuôn") ||
        lowerMsg.includes("da")
      ) {
        contextType = "style_advice";
      } else if (
        lowerMsg.includes("giá") ||
        lowerMsg.includes("tiền") ||
        lowerMsg.includes("mua")
      ) {
        contextType = "product_recommendation";
      }

      console.log("Sending request to:", "/chat-ai/guest-chat");
      console.log("Request data:", { message: inputValue, contextType });

      const response = await axios.post("/chat-ai/guest-chat", {
        message: inputValue,
        contextType: contextType,
      });

      console.log("API Response:", response.data);

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: "bot",
        content: response.data.data.message,
        timestamp: new Date(),
        productSuggestions: response.data.data.suggestedProducts,
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (error: any) {
      console.error("ChatBot Error Details:", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        config: {
          url: error.config?.url,
          method: error.config?.method,
          baseURL: error.config?.baseURL,
        },
      });

      let errorContent = "❌ Xin lỗi, đã có lỗi xảy ra. Vui lòng thử lại sau.";

      if (error.response?.status === 404) {
        errorContent =
          "❌ Không tìm thấy API endpoint. Vui lòng kiểm tra backend.";
      } else if (error.response?.status === 500) {
        errorContent =
          "❌ Lỗi server. Có thể thiếu OpenAI API key hoặc backend chưa chạy.";
      } else if (error.code === "ERR_NETWORK") {
        errorContent =
          "❌ Không kết nối được backend. Đảm bảo backend đang chạy ở http://localhost:8080";
      }

      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: "bot",
        content: errorContent,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <>
      {/* Floating Button */}
      <div className="fixed bottom-6 right-6 z-50">
        {!isOpen && (
          <Button
            onClick={() => setIsOpen(true)}
            className="h-16 w-16 rounded-full shadow-2xl bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-all duration-300 hover:scale-110"
          >
            <MessageCircle className="h-8 w-8 text-white" />
          </Button>
        )}

        {/* Chat Window */}
        {isOpen && (
          <Card className="w-96 h-[600px] shadow-2xl flex flex-col animate-in slide-in-from-bottom-5 duration-300">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 rounded-t-lg flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Sparkles className="h-6 w-6" />
                  <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-white"></span>
                </div>
                <div>
                  <h3 className="font-semibold">ChillGlasses AI</h3>
                  <p className="text-xs text-blue-100">
                    Trợ lý tư vấn kính mắt
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsOpen(false)}
                className="hover:bg-white/20 text-white"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
              {messages.map((message) => (
                <div key={message.id}>
                  <div
                    className={`flex ${
                      message.type === "user" ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-[80%] rounded-2xl p-3 ${
                        message.type === "user"
                          ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white"
                          : "bg-white shadow-md border border-gray-100"
                      }`}
                    >
                      <p className="whitespace-pre-wrap text-sm">
                        {message.content}
                      </p>
                      <span
                        className={`text-xs mt-1 block ${
                          message.type === "user"
                            ? "text-blue-100"
                            : "text-gray-500"
                        }`}
                      >
                        {formatTime(message.timestamp)}
                      </span>
                    </div>
                  </div>

                  {/* Product Suggestions */}
                  {message.productSuggestions &&
                    message.productSuggestions.length > 0 && (
                      <div className="mt-3 space-y-2">
                        <p className="text-xs text-gray-500 font-medium">
                          💡 Gợi ý sản phẩm:
                        </p>
                        {message.productSuggestions.map((product) => (
                          <Card
                            key={product.productId}
                            className="p-3 hover:shadow-lg transition-shadow cursor-pointer"
                          >
                            <div className="flex gap-3">
                              {product.imageUrl && (
                                <img
                                  src={product.imageUrl}
                                  alt={product.productName}
                                  className="w-16 h-16 object-cover rounded-lg"
                                />
                              )}
                              <div className="flex-1">
                                <h4 className="font-semibold text-sm text-gray-800">
                                  {product.productName}
                                </h4>
                                <p className="text-blue-600 font-bold text-sm">
                                  {new Intl.NumberFormat("vi-VN", {
                                    style: "currency",
                                    currency: "VND",
                                  }).format(product.price)}
                                </p>
                                <p className="text-xs text-gray-600 mt-1">
                                  {product.reason}
                                </p>
                              </div>
                            </div>
                          </Card>
                        ))}
                      </div>
                    )}
                </div>
              ))}

              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-white shadow-md border border-gray-100 rounded-2xl p-3">
                    <Loader2 className="h-5 w-5 animate-spin text-blue-600" />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 bg-white border-t border-gray-200 rounded-b-lg">
              <div className="flex gap-2">
                <Input
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Nhập câu hỏi của bạn..."
                  disabled={isLoading}
                  className="flex-1"
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={isLoading || !inputValue.trim()}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                >
                  <Send className="h-5 w-5" />
                </Button>
              </div>
              <p className="text-xs text-gray-500 mt-2 text-center">
                Nhấn Enter để gửi tin nhắn
              </p>
            </div>
          </Card>
        )}
      </div>
    </>
  );
}
