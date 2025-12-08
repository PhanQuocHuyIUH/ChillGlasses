"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  MessageCircle,
  X,
  Send,
  Loader2,
  Sparkles,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import axios from "@/lib/api/axios";
import Link from "next/link";
import Image from "next/image";

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
  productSlug?: string;
  productUrl?: string;
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
    } catch (error: unknown) {
      const err = error as {
        message?: string;
        response?: { data?: unknown; status?: number };
        config?: { url?: string; method?: string; baseURL?: string };
        code?: string;
      };
      console.error("ChatBot Error Details:", {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status,
        config: {
          url: err.config?.url,
          method: err.config?.method,
          baseURL: err.config?.baseURL,
        },
      });

      let errorContent = "❌ Xin lỗi, đã có lỗi xảy ra. Vui lòng thử lại sau.";

      if (err.response?.status === 404) {
        errorContent =
          "❌ Không tìm thấy API endpoint. Vui lòng kiểm tra backend.";
      } else if (err.response?.status === 500) {
        errorContent =
          "❌ Lỗi server. Có thể thiếu OpenAI API key hoặc backend chưa chạy.";
      } else if (err.code === "ERR_NETWORK") {
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

  // Convert [PRODUCT_ID:123] to clickable product links
  const renderMessageContent = (content: string) => {
    // Regex to match product ID pattern: [PRODUCT_ID:123]
    const productIdRegex = /\[PRODUCT_ID:(\d+)\]/g;
    const parts: (string | React.ReactElement)[] = [];
    let lastIndex = 0;
    let match;

    while ((match = productIdRegex.exec(content)) !== null) {
      // Add text before the product link
      if (match.index > lastIndex) {
        parts.push(content.substring(lastIndex, match.index));
      }

      // Add the product link
      const productId = match[1];
      const productUrl = `/products/${productId}`;
      parts.push(
        <Link
          key={match.index}
          href={productUrl}
          className="text-blue-600 hover:text-blue-800 underline font-medium inline-flex items-center gap-1"
        >
          sản phẩm này
          <ExternalLink className="h-3 w-3 inline" />
        </Link>
      );

      lastIndex = match.index + match[0].length;
    }

    // Add remaining text
    if (lastIndex < content.length) {
      parts.push(content.substring(lastIndex));
    }

    return parts.length > 0 ? parts : content;
  };

  return (
    <>
      {/* Floating Button */}
      <div className="fixed bottom-6 right-6 z-50">
        {!isOpen && (
          <Button
            onClick={() => setIsOpen(true)}
            className="h-16 w-16 rounded-full shadow-2xl bg-linear-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-all duration-300 hover:scale-110"
          >
            <MessageCircle className="h-8 w-8 text-white" />
          </Button>
        )}

        {/* Chat Window */}
        {isOpen && (
          <Card className="w-96 h-[600px] shadow-2xl flex flex-col animate-in slide-in-from-bottom-5 duration-300">
            {/* Header */}
            <div className="bg-linear-to-r from-blue-600 to-purple-600 text-white p-4 rounded-t-lg flex items-center justify-between">
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
                          ? "bg-linear-to-r from-blue-600 to-purple-600 text-white"
                          : "bg-white shadow-md border border-gray-100"
                      }`}
                    >
                      <div className="whitespace-pre-wrap text-sm">
                        {renderMessageContent(message.content)}
                      </div>
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
                        {message.productSuggestions.map((product) => {
                          const productLink =
                            product.productUrl ||
                            `/products/${
                              product.productSlug || product.productId
                            }`;

                          return (
                            <Link
                              key={product.productId}
                              href={productLink}
                              target="_blank"
                            >
                              <Card className="p-3 hover:shadow-lg transition-all cursor-pointer hover:border-blue-500">
                                <div className="flex gap-3">
                                  {product.imageUrl && (
                                    <Image
                                      src={product.imageUrl}
                                      alt={product.productName}
                                      width={64}
                                      height={64}
                                      className="w-16 h-16 object-cover rounded-lg"
                                    />
                                  )}
                                  <div className="flex-1">
                                    <div className="flex items-center gap-1">
                                      <h4 className="font-semibold text-sm text-gray-800">
                                        {product.productName}
                                      </h4>
                                      <ExternalLink className="h-3 w-3 text-blue-500" />
                                    </div>
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
                            </Link>
                          );
                        })}
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
                  className="bg-linear-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
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
