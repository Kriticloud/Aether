import React from "react";
import { motion } from "motion/react";
import {
  CloudLightning,
  Wind,
  Navigation,
  User,
  MapPin,
  Clock,
  Coffee,
  Bell,
} from "lucide-react";
import { activeFlights } from "./data";
import { triggerHaptic } from "./haptics";

export default function InFlightMode({
  selectedFlightId,
}: {
  selectedFlightId: string | null;
}) {
  const flight = selectedFlightId
    ? activeFlights.find((f) => f.id === selectedFlightId)
    : activeFlights[0];

  if (!flight) return null;

  return (
    <div className="flex flex-col gap-8 max-w-5xl mx-auto">
      {/* Flight Progress Simplified */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-aether-navy border border-aether-glass-border p-8 rounded-2xl relative overflow-hidden"
      >
        <div className="absolute top-0 left-0 w-full h-1 bg-white/5">
          <div
            className="h-full bg-[#4ade80]"
            style={{ width: `${flight.progress * 100}%` }}
          />
        </div>

        <div className="flex justify-between items-center mb-6">
          <div>
            <span className="text-[10px] text-aether-steel uppercase tracking-widest font-semibold flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#4ade80] animate-pulse" />{" "}
              Live Status
            </span>
            <h2 className="text-2xl font-serif text-white mt-2">
              Cruising Altitude
            </h2>
          </div>
          <div className="text-right">
            <span className="text-3xl font-mono text-[#FAFAFA] tracking-tight">
              {flight.duration}
            </span>
            <p className="text-xs text-aether-steel uppercase tracking-widest mt-1">
              Time to {flight.to}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4 bg-[#050507] p-4 rounded-xl border border-white/5">
          <div className="flex-1">
            <p className="text-xs text-aether-gold uppercase tracking-widest font-semibold mb-1">
              Origin
            </p>
            <p className="text-xl text-white">{flight.from}</p>
            <p className="text-xs text-aether-steel mt-1 font-mono">
              {flight.departureTime}
            </p>
          </div>
          <div className="flex-1 flex justify-center">
            <Navigation className="w-6 h-6 text-aether-steel opacity-30 transform rotate-90" />
          </div>
          <div className="flex-1 text-right">
            <p className="text-xs text-aether-gold uppercase tracking-widest font-semibold mb-1">
              Destination
            </p>
            <p className="text-xl text-white">{flight.to}</p>
            <p className="text-xs text-aether-steel mt-1 font-mono">
              {flight.arrivalTime}
            </p>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Environment / Weather */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-aether-black border border-aether-glass-border p-6 rounded-2xl flex flex-col justify-between"
        >
          <div className="flex items-center gap-2 mb-6">
            <CloudLightning className="w-5 h-5 text-aether-gold" />
            <h3 className="text-sm font-semibold uppercase tracking-widest text-[#FAFAFA]">
              Outside Environment
            </h3>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-[#111216] border border-white/5 p-4 rounded-xl text-center">
              <span className="block text-2xl text-white font-mono">-48°C</span>
              <span className="text-[9px] uppercase tracking-widest text-aether-steel mt-1">
                OAT
              </span>
            </div>
            <div className="bg-[#111216] border border-white/5 p-4 rounded-xl text-center">
              <Wind className="w-4 h-4 text-aether-gold mx-auto mb-2 opacity-50" />
              <span className="block text-sm text-white font-mono">
                130 kts Headwind
              </span>
              <span className="text-[9px] uppercase tracking-widest text-aether-steel mt-1">
                Winds
              </span>
            </div>
            <div className="bg-[#111216] border border-white/5 p-4 rounded-xl text-center col-span-2">
              <span className="block text-sm text-[#4ade80] font-medium font-serif italic">
                "Smooth air ahead"
              </span>
              <span className="text-[9px] uppercase tracking-widest text-aether-steel mt-1">
                Turbulence Forecast
              </span>
            </div>
          </div>
        </motion.div>

        {/* Passenger Info & Cabin Service */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex flex-col gap-4"
        >
          <div className="bg-aether-navy border border-aether-glass-border p-6 rounded-2xl flex-1">
            <div className="flex items-center gap-2 mb-6">
              <User className="w-5 h-5 text-aether-gold" />
              <h3 className="text-sm font-semibold uppercase tracking-widest text-[#FAFAFA]">
                Passenger Preferences
              </h3>
            </div>
            <div className="space-y-4">
              <div className="flex justify-between items-center bg-[#050507] p-3 rounded-lg border border-white/5">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-aether-black border border-aether-glass-border flex items-center justify-center pointer-events-none">
                    <img
                      src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80"
                      alt="User"
                      className="w-full h-full object-cover rounded-full"
                    />
                  </div>
                  <span className="text-sm font-medium text-white">
                    Eleanor Sterling
                  </span>
                </div>
                <span className="text-[10px] bg-aether-gold/10 text-aether-gold px-2 py-1 rounded">
                  Primary
                </span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-aether-steel flex items-center gap-2">
                  <Clock className="w-4 h-4" /> Next Meal Service:
                </span>
                <span className="text-white font-mono">In 45 mins</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-aether-steel flex items-center gap-2">
                  <Coffee className="w-4 h-4" /> Current Request:
                </span>
                <span className="text-white">Sparkling Water</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => triggerHaptic("heavy")}
            className="w-full p-6 bg-aether-gold hover:bg-white text-black transition-colors rounded-2xl font-serif text-lg font-medium flex items-center justify-center gap-3 shadow-[0_0_20px_rgba(212,197,185,0.2)]"
          >
            <Bell className="w-5 h-5 fill-black" />
            Summon Concierge
          </button>
        </motion.div>
      </div>
    </div>
  );
}
