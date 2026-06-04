import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Crosshair, Lock } from "lucide-react";
import { activeFlights } from "./data";

export default function ARSkyView({
  selectedFlightId,
}: {
  selectedFlightId: string | null;
}) {
  const [altitude, setAltitude] = useState(41000);
  const [heading, setHeading] = useState(135);
  const [speed, setSpeed] = useState(485);

  useEffect(() => {
    const interval = setInterval(() => {
      setAltitude((prev) => prev + (Math.random() - 0.5) * 15);
      setHeading((prev) => prev + (Math.random() - 0.5) * 0.5);
      setSpeed((prev) => prev + (Math.random() - 0.5) * 2);
    }, 100);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full h-[70vh] min-h-[500px] bg-black rounded-2xl overflow-hidden border border-white/10 shadow-2xl flex items-center justify-center font-mono">
      {/* Background simulating sky/cockpit */}
      <img
        src="https://images.unsplash.com/photo-1544265747-d1cb4c3d82a1?auto=format&fit=crop&q=80&w=2400"
        alt="Sky Context"
        className="absolute inset-0 w-full h-full object-cover opacity-70 contrast-125 saturate-50"
      />

      {/* HUD Overlay */}
      <div
        className="absolute inset-0 z-10 pointer-events-none select-none text-[#4ade80] p-6 sm:p-10 flex flex-col justify-between"
        style={{ textShadow: "0 0 10px rgba(74, 222, 128, 0.4)" }}
      >
        {/* Top HUD */}
        <div className="flex justify-between items-start">
          <div className="relative text-left">
            <p className="text-[10px] uppercase tracking-widest opacity-80 mb-1 border-b border-[#4ade80]/30 inline-block pb-1">
              GS
            </p>
            <p className="text-3xl font-bold tabular-nums tracking-tighter">
              {Math.round(speed)} <span className="text-sm">KTS</span>
            </p>
          </div>

          {/* Heading Tape */}
          <div className="flex flex-col items-center">
            <div className="flex items-end gap-1 mb-2">
              <span className="text-[10px] uppercase opacity-80">HDG</span>
              <span className="w-0 h-0 border-l-4 border-r-4 border-b-4 border-transparent border-b-[#4ade80] opacity-80 mb-0.5"></span>
            </div>
            <div className="flex items-center gap-6 sm:gap-8 border-x border-y border-[#4ade80]/30 px-6 py-1.5 bg-black/40 backdrop-blur-md rounded overflow-hidden relative">
              <div className="absolute bg-[#4ade80] w-px h-full left-1/2 -translate-x-1/2 opacity-30"></div>
              <span className="opacity-40 text-sm tabular-nums">
                {(Math.round(heading) - 15 + 360) % 360}
              </span>
              <span className="text-xl font-bold pb-0.5 tabular-nums relative z-10">
                {Math.round(heading).toString().padStart(3, "0")}
              </span>
              <span className="opacity-40 text-sm tabular-nums">
                {(Math.round(heading) + 15) % 360}
              </span>
            </div>
          </div>

          <div className="text-right">
            <p className="text-[10px] uppercase tracking-widest opacity-80 mb-1 border-b border-[#4ade80]/30 inline-block pb-1">
              ALT
            </p>
            <p className="text-3xl font-bold tabular-nums tracking-tighter">
              {Math.round(altitude)} <span className="text-sm">FT</span>
            </p>
          </div>
        </div>

        {/* Center Pitch Ladder */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-10 opacity-80">
          <div className="flex items-center gap-16">
            <div className="w-24 h-0.5 bg-[#4ade80] relative">
              <div className="absolute right-0 top-0 w-0.5 h-3 bg-[#4ade80]"></div>
            </div>
            <span className="text-xs">10</span>
            <div className="w-24 h-0.5 bg-[#4ade80] relative">
              <div className="absolute left-0 top-0 w-0.5 h-3 bg-[#4ade80]"></div>
            </div>
          </div>
          <div className="flex items-center justify-center relative w-full h-[40px]">
            <div className="absolute left-1/2 -translate-x-1/2 w-4 h-4 border-t-2 border-l-2 border-r-2 border-b-0 border-[#4ade80] rounded-t-full"></div>
            <div className="absolute left-1/2 top-4 w-[60px] h-0.5 bg-[#4ade80] -translate-x-[90px]"></div>
            <div className="absolute left-1/2 top-4 w-[60px] h-0.5 bg-[#4ade80] translate-x-[30px]"></div>
          </div>
          <div className="flex items-center gap-16">
            <div className="w-24 h-0.5 border-t-2 border-dashed border-[#4ade80] relative">
              <div className="absolute right-0 top-0 w-0.5 h-3 bg-[#4ade80]"></div>
            </div>
            <span className="text-xs">-10</span>
            <div className="w-24 h-0.5 border-t-2 border-dashed border-[#4ade80] relative">
              <div className="absolute left-0 top-0 w-0.5 h-3 bg-[#4ade80]"></div>
            </div>
          </div>
        </div>

        {/* Bottom HUD Variables */}
        <div className="flex justify-between items-end">
          <div className="space-y-1 text-sm bg-black/40 backdrop-blur-sm p-4 rounded border border-[#4ade80]/20">
            <p className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#4ade80]"></span> AP
              ENGAGED
            </p>
            <p className="flex items-center gap-2 text-white">
              <Lock className="w-3 h-3" /> FMS LNAV / VNAV
            </p>
          </div>

          <div className="flex gap-4">
            <div className="border border-[#4ade80]/30 px-6 py-3 bg-black/40 backdrop-blur-sm rounded text-center min-w-[80px]">
              <p className="text-[10px] uppercase opacity-70 mb-1 border-b border-[#4ade80]/20 pb-1">
                Pitch
              </p>
              <p className="text-lg">2.4°</p>
            </div>
            <div className="border border-[#4ade80]/30 px-6 py-3 bg-black/40 backdrop-blur-sm rounded text-center min-w-[80px]">
              <p className="text-[10px] uppercase opacity-70 mb-1 border-b border-[#4ade80]/20 pb-1">
                Bank
              </p>
              <p className="text-lg">0.0°</p>
            </div>
          </div>
        </div>
      </div>

      {/* Scanline & Vignette Effect */}
      <div
        className="absolute inset-0 z-20 pointer-events-none mix-blend-overlay shadow-[inset_0_0_100px_rgba(0,0,0,0.8)]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%), linear-gradient(90deg, rgba(255, 0, 0, 0.06), rgba(0, 255, 0, 0.02), rgba(0, 0, 255, 0.06))",
          backgroundSize: "100% 4px, 3px 100%",
        }}
      />
    </div>
  );
}
