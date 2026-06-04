import React from "react";
import { motion } from "motion/react";
import {
  Compass,
  Sparkles,
  Navigation,
  Calendar,
  Cloud,
  MapPin,
} from "lucide-react";
import { currentUser } from "./data";
import { triggerHaptic } from "./haptics";

const RECOMMENDATIONS = [
  {
    id: "rec1",
    destination: "Santorini, Greece",
    climate: "Mediterranean, 72°F",
    reason:
      "Matches your preference for coastal retreats. Exclusive Vanguard access to Canaves Oia.",
    image:
      "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5f1?auto=format&fit=crop&q=80&w=600",
  },
  {
    id: "rec2",
    destination: "St. Moritz, Switzerland",
    climate: "Alpine, 28°F",
    reason: `Based on your recent trip to Geneva. Elite access to Kulm Hotel for ${currentUser.loyaltyTier} members.`,
    image:
      "https://images.unsplash.com/photo-1522851965683-12d8a571ea40?auto=format&fit=crop&q=80&w=600",
  },
  {
    id: "rec3",
    destination: "Kyoto, Japan",
    climate: "Temperate, 65°F",
    reason:
      "Inspired by your travel history to Tokyo. Bespoke cultural tours available.",
    image:
      "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&q=80&w=600",
  },
];

export default function TravelAdvisorModule() {
  const handleBook = (e: React.MouseEvent, dest: string) => {
    e.stopPropagation();
    triggerHaptic("success");
    alert(`Initiating curated booking for ${dest}`);
  };

  return (
    <div className="bg-aether-navy border border-aether-glass-border p-8 rounded-2xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h3 className="text-xl font-serif flex items-center gap-2">
            <Compass className="w-5 h-5 text-aether-gold" /> Travel Advisor
          </h3>
          <p className="text-sm text-aether-steel mt-2 max-w-md">
            AI-curated elite destinations based on your flight history,
            preferred climates, and {currentUser.loyaltyTier} status.
          </p>
        </div>
        <div className="hidden sm:flex items-center gap-2 text-xs uppercase tracking-widest text-aether-gold bg-aether-gold/10 px-3 py-1.5 rounded-full border border-aether-gold/20">
          <Sparkles className="w-3 h-3" /> Personalized
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {RECOMMENDATIONS.map((rec, idx) => (
          <motion.div
            key={rec.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="group relative rounded-xl overflow-hidden border border-white/10 bg-aether-black flex flex-col h-full"
          >
            <div className="relative h-40 overflow-hidden shrink-0">
              <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors z-10" />
              <img
                src={rec.image}
                alt={rec.destination}
                className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute top-3 left-3 z-20 flex gap-2">
                <span className="bg-black/60 backdrop-blur text-[10px] text-white uppercase tracking-widest px-2 py-1 rounded border border-white/20 flex items-center gap-1">
                  <Cloud className="w-3 h-3" /> {rec.climate}
                </span>
              </div>
            </div>

            <div className="p-5 flex flex-col flex-grow">
              <h4 className="text-lg font-serif text-white mb-2 flex items-center justify-between">
                {rec.destination}
              </h4>
              <p className="text-xs text-aether-steel leading-relaxed mb-6 flex-grow">
                {rec.reason}
              </p>

              <button
                onClick={(e) => handleBook(e, rec.destination)}
                className="w-full py-3 bg-white/5 border border-white/10 rounded-lg text-xs font-semibold uppercase tracking-widest text-[#FAFAFA] hover:bg-aether-gold hover:text-black hover:border-aether-gold transition-all flex items-center justify-center gap-2"
              >
                <Navigation className="w-4 h-4" /> Book Trip
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
