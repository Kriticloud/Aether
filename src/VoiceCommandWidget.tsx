import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Mic, MicOff, Command } from "lucide-react";
import { toast } from "sonner";
import { triggerHaptic } from "./haptics";

interface VoiceCommandWidgetProps {
  onNavigate: (route: string) => void;
}

const SpeechRecognition =
  (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

export default function VoiceCommandWidget({
  onNavigate,
}: VoiceCommandWidgetProps) {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [recognition, setRecognition] = useState<any>(null);

  useEffect(() => {
    if (SpeechRecognition) {
      const recognitionInstance = new SpeechRecognition();
      recognitionInstance.continuous = false;
      recognitionInstance.interimResults = false;
      recognitionInstance.lang = "en-US";

      recognitionInstance.onresult = (event: any) => {
        const text = event.results[0][0].transcript.toLowerCase();
        setTranscript(text);
        processCommand(text);
      };

      recognitionInstance.onerror = (event: any) => {
        console.error("Speech recognition error", event.error);
        setIsListening(false);
        toast.error("Voice recognition error. Please try again.");
      };

      recognitionInstance.onend = () => {
        setIsListening(false);
      };

      setRecognition(recognitionInstance);
    }
  }, []);

  const processCommand = useCallback(
    (text: string) => {
      let matched = false;

      if (
        text.includes("search flight") ||
        text.includes("book flight") ||
        text.includes("flights to")
      ) {
        toast.success(`Voice Command Recognized`, {
          description: `Routing to Flight Booking...`,
        });
        onNavigate("booking");
        matched = true;
      } else if (text.includes("concierge") || text.includes("status")) {
        toast.success(`Voice Command Recognized`, {
          description: `Routing to Concierge...`,
        });
        onNavigate("concierge");
        matched = true;
      } else if (
        text.includes("track") ||
        text.includes("aircraft") ||
        text.includes("dashboard")
      ) {
        toast.success(`Voice Command Recognized`, {
          description: `Routing to Live Dashboard...`,
        });
        onNavigate("dashboard");
        matched = true;
      } else if (text.includes("fleet") || text.includes("explorer")) {
        toast.success(`Voice Command Recognized`, {
          description: `Routing to Fleet Explorer...`,
        });
        onNavigate("fleet");
        matched = true;
      }

      if (!matched) {
        toast("Command not recognized", { description: `Heard: "${text}"` });
      }
    },
    [onNavigate],
  );

  const toggleListening = () => {
    triggerHaptic('medium');
    if (!recognition) {
      toast.error("Speech Recognition API not supported in this browser.");
      return;
    }

    if (isListening) {
      recognition.stop();
      setIsListening(false);
    } else {
      setTranscript("");
      recognition.start();
      setIsListening(true);
      toast("Listening...", {
        description: 'Try saying "Track aircraft" or "Check concierge status"',
      });
    }
  };

  return (
    <div className="fixed bottom-8 right-8 z-50 flex flex-col items-end gap-4 pointer-events-none">
      <AnimatePresence>
        {isListening && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.9 }}
            className="bg-aether-black/80 backdrop-blur-md border border-aether-gold text-aether-cloud p-4 rounded-xl shadow-2xl pointer-events-auto min-w-[200px]"
          >
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              <span className="text-xs uppercase tracking-widest text-aether-gold font-semibold">
                Listening
              </span>
            </div>
            <p className="text-sm font-medium">
              {transcript || "Awaiting command..."}
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      <button
        onClick={toggleListening}
        className={`w-14 h-14 rounded-full pointer-events-auto flex items-center justify-center shadow-2xl transition-all duration-300 border ${
          isListening
            ? "bg-aether-black text-aether-gold border-aether-gold scale-110 shadow-[0_0_20px_rgba(212,197,185,0.3)]"
            : "bg-aether-black/80 text-aether-steel border-aether-glass-border hover:text-aether-cloud hover:border-aether-gold/50 backdrop-blur-md"
        }`}
      >
        {isListening ? (
          <Mic className="w-6 h-6 animate-pulse" />
        ) : (
          <Command className="w-6 h-6" />
        )}
      </button>
    </div>
  );
}
