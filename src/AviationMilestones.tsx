import React, { useState } from "react";
import { motion } from "motion/react";
import { Clock, Plane, MapPin, Award, CheckCircle } from "lucide-react";
import { triggerHaptic } from "./haptics";
import { currentUser } from "./data";

const MILESTONES = [
  {
    id: "m1",
    year: 2026,
    type: "destination",
    title: "Tokyo Touchdown",
    desc: "First landing at HND across the Pacific.",
    icon: MapPin,
  },
  {
    id: "m2",
    year: 2025,
    type: "aircraft",
    title: "Global 7500 Rating",
    desc: "Flown over 200 hours in the Bombardier Global 7500.",
    icon: Plane,
  },
  {
    id: "m3",
    year: 2023,
    type: "hours",
    title: "1,000 Hours Aloft",
    desc: "Surpassed the 1000 flight hours mark within the Aether network.",
    icon: Clock,
  },
  {
    id: "m4",
    year: 2019,
    type: "award",
    title: "AETHER Vanguard",
    desc: "Achieved the most prestigious tier, unlocking global priority.",
    icon: Award,
  },
];

export default function AviationMilestones() {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const handleHover = (id: string | null) => {
    if (id !== hoveredId && id !== null) {
      triggerHaptic("light");
    }
    setHoveredId(id);
  };

  return (
    <div className="bg-aether-navy border border-aether-glass-border p-8 rounded-2xl">
      <h3 className="text-xl font-serif mb-6 flex items-center gap-2">
        <Award className="w-5 h-5 text-aether-gold" /> Aviation Milestones
      </h3>

      {/* Summary Header */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-aether-black border border-aether-glass-border rounded-xl p-4 flex flex-col justify-center items-center">
          <span className="text-2xl text-aether-gold font-mono tracking-tighter">
            {currentUser.totalFlightHours}
          </span>
          <span className="text-[10px] text-aether-steel uppercase tracking-widest mt-1">
            Total Hours
          </span>
        </div>
        <div className="bg-aether-black border border-aether-glass-border rounded-xl p-4 flex flex-col justify-center items-center">
          <span className="text-2xl text-[#FAFAFA] font-mono tracking-tighter">
            14
          </span>
          <span className="text-[10px] text-aether-steel uppercase tracking-widest mt-1">
            Countries
          </span>
        </div>
        <div className="bg-aether-black border border-aether-glass-border rounded-xl p-4 flex flex-col justify-center items-center">
          <span className="text-2xl text-[#FAFAFA] font-mono tracking-tighter">
            4
          </span>
          <span className="text-[10px] text-aether-steel uppercase tracking-widest mt-1">
            Aircraft
          </span>
        </div>
        <div className="bg-aether-black border border-aether-glass-border rounded-xl p-4 flex flex-col justify-center items-center shadow-inner">
          <span className="text-2xl text-aether-cloud font-mono tracking-tighter flex items-center gap-1">
            Vanguard
          </span>
          <span className="text-[10px] text-aether-gold uppercase tracking-widest mt-1 font-semibold flex items-center gap-1">
            <span className="w-1.5 h-1.5 bg-aether-gold rounded-full" /> Status
          </span>
        </div>
      </div>

      {/* Vertical Timeline */}
      <div className="relative pl-6 border-l border-white/5 space-y-8">
        {MILESTONES.map((milestone, idx) => {
          const Icon = milestone.icon;
          const isHovered = hoveredId === milestone.id;
          return (
            <div
              key={milestone.id}
              className="relative"
              onMouseEnter={() => handleHover(milestone.id)}
              onMouseLeave={() => setHoveredId(null)}
            >
              <div className="absolute -left-[35px] top-1 w-5 h-5 rounded-full bg-[#050507] border-2 border-aether-glass-border flex items-center justify-center overflow-hidden">
                {isHovered && (
                  <motion.div
                    layoutId="activeMilestone"
                    transition={{ type: "spring", stiffness: 300, damping: 25 }}
                    className="w-full h-full bg-aether-gold opacity-30"
                  />
                )}
                {isHovered && (
                  <div className="absolute w-1.5 h-1.5 bg-aether-gold rounded-full" />
                )}
              </div>

              <div className="flex gap-4 items-start">
                <span
                  className={`text-xs font-mono font-bold pt-1 transition-colors ${isHovered ? "text-aether-gold" : "text-white/30"}`}
                >
                  {milestone.year}
                </span>
                <motion.div
                  initial={{ scale: 1 }}
                  animate={{
                    scale: isHovered ? 1.02 : 1,
                    backgroundColor: isHovered
                      ? "rgba(255,255,255,0.03)"
                      : "#050507",
                  }}
                  className="flex-1 border border-aether-glass-border p-4 rounded-xl cursor-crosshair transform-gpu"
                >
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-white font-medium flex items-center gap-2">
                      <Icon
                        className={`w-4 h-4 transition-colors ${isHovered ? "text-aether-gold" : "text-aether-steel"}`}
                      />{" "}
                      {milestone.title}
                    </h4>
                    {isHovered && (
                      <CheckCircle className="w-3 h-3 text-aether-gold opacity-50" />
                    )}
                  </div>
                  <p className="text-sm text-aether-steel leading-relaxed">
                    {milestone.desc}
                  </p>
                </motion.div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
