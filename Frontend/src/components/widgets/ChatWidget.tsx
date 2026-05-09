import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X, Send, User } from "lucide-react";
import { Input } from "@/components/ui";
import { useTranslation } from "react-i18next";
import { useLanguage } from "@/hooks";

export const ChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const { t } = useTranslation();
  const { isRTL } = useLanguage();
  const [messages, setMessages] = useState<
    { id: number; text: string; isBot: boolean }[]
  >(() => [
    {
      id: 1,
      text: t("common:chat.welcome_message"),
      isBot: true,
    },
  ]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSend = () => {
    if (!message.trim()) return;

    const userMsg = { id: Date.now(), text: message, isBot: false };
    setMessages((prev) => [...prev, userMsg]);
    setMessage("");

    // Mock bot response
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          text: t("common:chat.bot_response"),
          isBot: true,
        },
      ]);
    }, 1000);
  };

  return (
    <div className="fixed bottom-24 md:bottom-6 right-6 z-[100]" dir={isRTL ? "rtl" : "ltr"}>
      <AnimatePresence mode="wait">
        {isOpen ? (
          <motion.div
            key="chat-window"
            initial={{
              opacity: 0,
              scale: 0.9,
              y: 20,
              transformOrigin: "bottom right",
            }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="w-[90vw] md:w-[400px] bg-white dark:bg-zinc-900 rounded-[2.5rem] shadow-2xl border border-gray-100 dark:border-zinc-800 overflow-hidden flex flex-col h-[600px] max-h-[80vh]"
          >
            {/* Header */}
            <div className="bg-starbucks-green p-8 text-white relative">
              <div className="flex items-center gap-4 text-start">
                <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-md">
                  <MessageCircle className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="font-black text-xl">{t("common:chat.support_title")}</h3>
                  <p className="text-white/80 text-sm italic">
                    {t("common:chat.support_status")}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="absolute top-6 end-6 p-2 hover:bg-white/10 rounded-2xl transition-colors z-10"
                aria-label={t("common:chat.aria_label_close")}
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Messages Area */}
            <div className="flex-1 p-8 overflow-y-auto space-y-6 bg-gray-50/50 dark:bg-zinc-950/50">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex gap-4 ${msg.isBot ? "" : "flex-row-reverse"}`}
                >
                  {msg.isBot && (
                    <div className="w-10 h-10 bg-starbucks-green/10 rounded-2xl flex items-center justify-center flex-shrink-0">
                      <User className="w-5 h-5 text-starbucks-green" />
                    </div>
                  )}
                  <div
                    className={`p-5 rounded-3xl shadow-sm text-base border max-w-[80%] text-start ${
                      msg.isBot
                        ? "bg-white dark:bg-zinc-800 border-gray-100 dark:border-zinc-700 rounded-ss-none"
                        : "bg-starbucks-green text-white border-starbucks-green rounded-se-none"
                    }`}
                  >
                    <p className="leading-relaxed">{msg.text}</p>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-6 bg-white dark:bg-zinc-900 border-t border-gray-100 dark:border-zinc-800 relative z-20">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSend();
                }}
                className="relative flex items-center"
              >
                <Input
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder={t("common:chat.input_placeholder")}
                  className="h-14 pe-14 ps-6 rounded-2xl border-gray-100 dark:border-zinc-800 bg-gray-50 dark:bg-zinc-950 focus:bg-white transition-all text-base w-full"
                  dir="auto"
                />
                <button
                  type="submit"
                  disabled={!message.trim()}
                  className="absolute end-3 p-2.5 text-starbucks-green hover:bg-starbucks-green/10 disabled:opacity-30 disabled:hover:bg-transparent rounded-xl transition-all z-30"
                  aria-label={t("common:chat.aria_label_send")}
                >
                  <Send className={`w-6 h-6 ${isRTL ? "scale-x-[-1]" : ""}`} />
                </button>
              </form>
            </div>
          </motion.div>
        ) : (
          <motion.button
            key="chat-trigger"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsOpen(true)}
            className="w-16 h-16 bg-starbucks-green text-white rounded-[2rem] shadow-2xl shadow-starbucks-green/30 flex items-center justify-center group relative overflow-hidden"
            aria-label={t("common:chat.aria_label_open")}
          >
            <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
            <MessageCircle className="w-8 h-8" />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
};
