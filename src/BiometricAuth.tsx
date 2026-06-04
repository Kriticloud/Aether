import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ScanFace } from "lucide-react";
import { triggerHaptic } from "./haptics";

export default function BiometricAuth({
  onAuthenticated,
}: {
  onAuthenticated: () => void;
}) {
  const [status, setStatus] = useState<
    "idle" | "scanning" | "success" | "failed"
  >("idle");

  useEffect(() => {
    // Start scan automatically on mount
    triggerHaptic("medium");
    setStatus("scanning");

    const timer1 = setTimeout(() => {
      setStatus("success");
      triggerHaptic("heavy");
    }, 2000);

    const timer2 = setTimeout(() => {
      onAuthenticated();
    }, 3000);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, [onAuthenticated]);

  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#050507] backdrop-blur-3xl">
      <div className="relative flex flex-col items-center">
        <motion.div
          animate={{
            scale:
              status === "scanning"
                ? [1, 1.1, 1]
                : status === "success"
                  ? 1.2
                  : 1,
            opacity: status === "success" ? [1, 0] : 1,
          }}
          transition={{
            duration: 1.5,
            repeat: status === "scanning" ? Infinity : 0,
          }}
          className="relative"
        >
          <div
            className={`w-32 h-32 rounded-[2rem] border-2 flex items-center justify-center transition-colors duration-500 ${status === "success" ? "border-[#4ade80] text-[#4ade80]" : "border-aether-gold/30 text-aether-gold"}`}
          >
            <ScanFace className="w-12 h-12" />
            {status === "scanning" && (
              <motion.div
                className="absolute top-0 left-0 w-full h-[2px] bg-aether-gold shadow-[0_0_10px_#D4C5B9]"
                animate={{ y: [0, 128, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              />
            )}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-8 text-center"
          key={status}
        >
          <p
            className={`font-serif text-xl ${status === "success" ? "text-[#4ade80]" : "text-aether-cloud"}`}
          >
            {status === "idle"
              ? "Awaiting Authorization"
              : status === "scanning"
                ? "Verifying Identity"
                : "Access Granted"}
          </p>
          <p className="text-xs uppercase tracking-widest text-[#8E95A3] mt-2 font-mono">
            Biometric Security Protocol
          </p>
        </motion.div>
      </div>
    </div>
  );
}
