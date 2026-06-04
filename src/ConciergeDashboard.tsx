import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { conciergeRequests } from "./data";
import {
  Utensils,
  Car,
  Building,
  Shield,
  Plus,
  X,
  Send,
  Bot,
  User,
} from "lucide-react";
import { triggerHaptic } from "./haptics";
import InFlightCatering from "./InFlightCatering";

export default function ConciergeDashboard() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCateringOpen, setIsCateringOpen] = useState(false);
  const [messages, setMessages] = useState<
    { role: "user" | "agent"; text: string }[]
  >([
    {
      role: "agent",
      text: "Welcome to Aether Concierge. How may I assist you with your upcoming travel arrangements?",
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const getIcon = (type: string) => {
    switch (type) {
      case "Dining":
        return <Utensils className="w-5 h-5 text-aether-gold" />;
      case "Transport":
        return <Car className="w-5 h-5 text-aether-gold" />;
      case "Hotel":
        return <Building className="w-5 h-5 text-aether-gold" />;
      case "Security":
        return <Shield className="w-5 h-5 text-aether-gold" />;
      default:
        return <Shield className="w-5 h-5 text-aether-gold" />;
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    triggerHaptic("light");
    const userMsg = inputValue;
    setMessages((prev) => [...prev, { role: "user", text: userMsg }]);
    setInputValue("");
    setIsTyping(true);

    // Simulate WebSocket / AI delay
    setTimeout(
      () => {
        triggerHaptic("medium");
        let response =
          "I have received your request and our team is working on the logistics.";

        const lower = userMsg.toLowerCase();
        if (
          lower.includes("michelin") ||
          lower.includes("restaurant") ||
          lower.includes("dining")
        ) {
          response =
            "I have scanned the culinary database near your arrival. I can secure a chef's tasting menu reservation at 'Le Bernardin' or 'Eleven Madison Park'. Shall I proceed with the booking for your party?";
        } else if (
          lower.includes("car") ||
          lower.includes("transport") ||
          lower.includes("chauffeur")
        ) {
          response =
            "Certainly. I will arrange for a matte black Maybach S-Class to be waiting at the private terminal tarmac upon your landing. Would you prefer a security escort as well?";
        }

        setMessages((prev) => [...prev, { role: "agent", text: response }]);
        setIsTyping(false);
      },
      1500 + Math.random() * 2000,
    );
  };

  return (
    <div className="p-8 pb-32">
      <div className="flex justify-between items-end mb-10">
        <header>
          <h1 className="text-4xl font-serif text-aether-cloud mb-2">
            Concierge Services
          </h1>
          <p className="text-aether-steel">
            Curated experiences and logical logistics.
          </p>
        </header>
        <div className="flex gap-4">
          <button
            onClick={() => setIsCateringOpen(true)}
            className="px-6 py-3 bg-[#111216] text-[#FAFAFA] border border-white/10 font-medium tracking-wide hover:border-aether-gold transition-colors flex items-center gap-2 rounded-xl"
          >
            <Utensils className="w-4 h-4" /> In-Flight Catering
          </button>
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-6 py-3 bg-aether-gold text-aether-black font-medium tracking-wide hover:bg-white transition-colors flex items-center gap-2 rounded-xl"
          >
            <Plus className="w-4 h-4" /> New Request
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {conciergeRequests.map((req, idx) => (
          <motion.div
            key={req.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="bg-aether-navy border border-aether-glass-border p-6 rounded-2xl relative"
          >
            <div className="absolute top-6 right-6">
              <span
                className={`text-[10px] font-bold px-2 py-1 uppercase tracking-wider rounded border ${
                  req.status === "Confirmed"
                    ? "text-green-400 border-green-400/20 bg-green-400/10"
                    : req.status === "Pending"
                      ? "text-aether-gold border-aether-gold/20 bg-aether-gold/10"
                      : "text-aether-steel border-aether-steel/20 bg-aether-steel/10"
                }`}
              >
                {req.status}
              </span>
            </div>
            <div className="w-12 h-12 rounded-full bg-aether-glass flex items-center justify-center mb-6">
              {getIcon(req.type)}
            </div>
            <h3 className="text-lg font-serif mb-1 pr-16">{req.title}</h3>
            <p className="text-xs text-aether-steel mb-4">{req.date}</p>
            <p className="text-sm text-aether-cloud/80 line-clamp-3">
              {req.details}
            </p>
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {isCateringOpen && (
          <InFlightCatering onClose={() => setIsCateringOpen(false)} />
        )}
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-aether-black/80 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              className="bg-aether-navy border border-aether-glass-border p-8 rounded-2xl w-full max-w-lg relative"
            >
              <button
                onClick={() => setIsModalOpen(false)}
                className="absolute top-4 right-4 text-aether-steel hover:text-aether-cloud z-10 w-8 h-8 rounded-full border border-white/5 flex items-center justify-center bg-black/50"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="flex items-center gap-3 mb-6 pb-4 border-b border-white/5">
                <div className="w-10 h-10 rounded-full bg-aether-gold/10 border border-aether-gold/20 flex items-center justify-center pointer-events-none text-aether-gold">
                  <Bot className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-xl font-serif text-white leading-none">
                    Aether AI Concierge
                  </h2>
                  <p className="text-[10px] uppercase tracking-widest text-aether-steel mt-1 font-semibold flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-[#4ade80] rounded-full animate-pulse" />{" "}
                    Encrypted Link Active
                  </p>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto pr-2 space-y-4 mb-4 min-h-[300px] max-h-[400px]">
                {messages.map((msg, i) => (
                  <div
                    key={i}
                    className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[85%] rounded-2xl p-4 flex gap-3 ${msg.role === "user" ? "bg-[#D4C5B9] text-[#050507] rounded-br-sm" : "bg-white/5 text-white border border-white/10 rounded-bl-sm"}`}
                    >
                      {msg.role === "agent" && (
                        <Bot className="w-4 h-4 flex-shrink-0 mt-0.5 opacity-50" />
                      )}
                      <p className="text-sm leading-relaxed">{msg.text}</p>
                    </div>
                  </div>
                ))}
                {isTyping && (
                  <div className="flex justify-start">
                    <div className="bg-white/5 border border-white/10 rounded-2xl rounded-bl-sm p-4 text-white flex gap-2 items-center">
                      <Bot className="w-4 h-4 opacity-50" />
                      <div className="flex gap-1 items-center">
                        <motion.div
                          animate={{ opacity: [0.3, 1, 0.3] }}
                          transition={{
                            duration: 1,
                            repeat: Infinity,
                            delay: 0,
                          }}
                          className="w-1.5 h-1.5 bg-aether-gold rounded-full"
                        />
                        <motion.div
                          animate={{ opacity: [0.3, 1, 0.3] }}
                          transition={{
                            duration: 1,
                            repeat: Infinity,
                            delay: 0.2,
                          }}
                          className="w-1.5 h-1.5 bg-aether-gold rounded-full"
                        />
                        <motion.div
                          animate={{ opacity: [0.3, 1, 0.3] }}
                          transition={{
                            duration: 1,
                            repeat: Infinity,
                            delay: 0.4,
                          }}
                          className="w-1.5 h-1.5 bg-aether-gold rounded-full"
                        />
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              <div className="relative">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                  placeholder="E.g. Find me a Michelin star restaurant near my arrival..."
                  className="w-full bg-[#050507] border border-white/10 rounded-full py-4 pl-6 pr-14 text-sm text-white focus:outline-none focus:border-aether-gold focus:ring-1 focus:ring-aether-gold transition-all placeholder:text-white/30"
                />
                <button
                  onClick={handleSendMessage}
                  disabled={!inputValue.trim() || isTyping}
                  className="absolute right-2 top-2 bottom-2 aspect-square rounded-full bg-aether-gold text-black flex items-center justify-center hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
