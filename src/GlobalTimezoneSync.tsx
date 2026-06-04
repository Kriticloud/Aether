import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Clock } from "lucide-react";
import { activeFlights } from "./data";

const airportTimezones: Record<string, string> = {
  JFK: "America/New_York",
  LHR: "Europe/London",
  DXB: "Asia/Dubai",
  VKO: "Europe/Moscow",
  LAX: "America/Los_Angeles",
  HND: "Asia/Tokyo",
  CDG: "Europe/Paris",
  SIN: "Asia/Singapore",
};

export default function GlobalTimezoneSync({
  selectedFlightId: initialFlightId = null,
}: {
  selectedFlightId?: string | null;
}) {
  const [time, setTime] = useState(new Date());
  const [currentFlightId, setCurrentFlightId] = useState<string | null>(
    initialFlightId,
  );

  useEffect(() => {
    setCurrentFlightId(initialFlightId);
  }, [initialFlightId]);

  useEffect(() => {
    const handleSelect = (e: Event) => {
      setCurrentFlightId((e as CustomEvent).detail);
    };
    window.addEventListener("selectFlight", handleSelect);
    return () => window.removeEventListener("selectFlight", handleSelect);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const flight = currentFlightId
    ? activeFlights.find((f) => f.id === currentFlightId)
    : null;

  const displayAirports = flight
    ? [flight.from, flight.to]
    : ["JFK", "LHR", "DXB"];

  return (
    <div className="flex bg-[#111216]/80 border border-white/5 rounded-xl p-3 gap-6 backdrop-blur-md shadow-xl items-center">
      <div className="hidden sm:flex items-center justify-center p-2 bg-[#050507] rounded-lg border border-white/5">
        <Clock className="w-5 h-5 text-aether-gold" />
      </div>
      <div className="flex gap-6 divide-x divide-white/10">
        <AnimatePresence mode="popLayout">
          {displayAirports.map((airport) => {
            const tz = airportTimezones[airport] || "UTC";
            let timeStr = "";
            try {
              const formatter = new Intl.DateTimeFormat("en-US", {
                timeZone: tz,
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
                hour12: false,
              });
              timeStr = formatter.format(time);
            } catch (e) {
              const formatter = new Intl.DateTimeFormat("en-US", {
                timeZone: "UTC",
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
                hour12: false,
              });
              timeStr = formatter.format(time);
            }

            return (
              <motion.div
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                key={airport}
                className="pl-6 first:pl-0 flex flex-col"
              >
                <span className="text-[10px] text-aether-steel font-semibold uppercase tracking-widest mb-1">
                  {airport}
                </span>
                <span className="font-mono text-[#FAFAFA] text-lg tabular-nums tracking-wider leading-none">
                  {timeStr}
                </span>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
}
