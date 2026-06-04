import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import {
  Briefcase,
  CheckCircle2,
  Truck,
  Plane,
  MapPin,
  Search,
} from "lucide-react";
import { triggerHaptic } from "./haptics";

interface LuggageTrackerProps {
  flightId: string;
}

const LUGGAGE_STATUSES = [
  { id: "checked", label: "Checked", icon: Briefcase, time: "T-02:15" },
  { id: "loaded", label: "Loaded", icon: Truck, time: "T-00:30" },
  { id: "intransit", label: "In-Transit", icon: Plane, time: "T+00:00" },
  {
    id: "delivered",
    label: "Delivered",
    icon: MapPin,
    time: "Pending",
  },
];

export default function InFlightLuggageTracker({
  flightId,
}: LuggageTrackerProps) {
  const [activeStep, setActiveStep] = useState(2);

  useEffect(() => {
    // Simulate real-time RFID progress updates
    const interval = setInterval(() => {
      setActiveStep((prev) => (prev < 3 ? prev + 1 : prev));
    }, 15000); // Progresses one step every 15 seconds (simulated)
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="py-2"
    >
      <div className="bg-aether-black border border-white/5 p-4 rounded-xl mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-aether-navy rounded-lg border border-aether-glass-border">
            <Briefcase className="w-5 h-5 text-aether-gold" />
          </div>
          <div>
            <p className="text-xs uppercase tracking-widest text-[#a1a1aa] mb-1">
              RFID Tag ID
            </p>
            <p className="text-sm font-mono text-white">NFC-0824-AET</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-xs uppercase tracking-widest text-[#a1a1aa] mb-1">
            Status
          </p>
          <p className="text-sm font-medium text-[#4ade80] flex items-center gap-1.5 justify-end">
            <span className="w-1.5 h-1.5 rounded-full bg-[#4ade80] animate-pulse"></span>
            {LUGGAGE_STATUSES[activeStep].label}
          </p>
        </div>
      </div>

      <div className="relative pl-3 space-y-6">
        <div className="absolute left-[17px] top-2 bottom-2 w-px bg-white/10" />

        {LUGGAGE_STATUSES.map((step, idx) => {
          const isActive = idx === activeStep;
          const isPast = idx < activeStep;

          return (
            <div key={step.id} className="relative flex items-center gap-4">
              <div
                className={`w-2.5 h-2.5 rounded-full relative z-10 flex-shrink-0 transition-colors duration-500 line-clamp-1 ${
                  isActive
                    ? "bg-aether-gold outline outline-4 outline-aether-gold/20"
                    : isPast
                      ? "bg-white/50"
                      : "bg-aether-navy border border-white/20"
                }`}
              />
              <div
                className={`flex p-3 rounded-lg border items-center justify-between flex-1 transition-all duration-300 ${isActive ? "bg-aether-navy/50 border-aether-gold/30 shadow-[0_0_15px_rgba(212,197,185,0.05)]" : "bg-aether-navy/20 border-white/5"}`}
              >
                <div className="flex gap-3 items-center">
                  <div
                    className={`p-1.5 rounded-md transition-colors ${isActive ? "bg-aether-gold/10" : "bg-transparent"}`}
                  >
                    <step.icon
                      className={`w-4 h-4 transition-colors ${isActive ? "text-aether-gold" : isPast ? "text-white/50" : "text-white/20"}`}
                    />
                  </div>
                  <div className="flex flex-col">
                    <span
                      className={`text-sm font-medium transition-colors ${isActive ? "text-aether-gold" : isPast ? "text-white/80" : "text-white/30"}`}
                    >
                      {step.label}
                    </span>
                    {isActive && (
                      <span className="text-[10px] text-aether-gold/70 mt-0.5">
                        Current Location
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1">
                  {isPast && (
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#4ade80]" />
                  )}
                  <span
                    className={`text-[10px] font-mono tracking-wider ${isActive ? "text-white" : "text-white/40"}`}
                  >
                    {step.time}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}
