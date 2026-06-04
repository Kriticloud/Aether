import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Utensils, X, Plus, User, Coffee, Wine, ChefHat } from "lucide-react";
import { triggerHaptic } from "./haptics";

interface MenuItem {
  id: string;
  name: string;
  category: string;
  description: string;
}

const MENU: MenuItem[] = [
  {
    id: "m1",
    name: "Almas Caviar Reserve",
    category: "Appetizer",
    description: "Served with mother of pearl spoon.",
  },
  {
    id: "m2",
    name: "Wagyu A5 Tartare",
    category: "Appetizer",
    description: "Toasted brioche, quail egg, truffle.",
  },
  {
    id: "m3",
    name: "Miso-Glazed Black Cod",
    category: "Main",
    description: "Bok choy, dashi foam, yuzu.",
  },
  {
    id: "m4",
    name: "Chateaubriand",
    category: "Main",
    description: "Pommes purée, bone marrow reduction.",
  },
  {
    id: "m5",
    name: "Grand Cru Chocolate",
    category: "Dessert",
    description: "Gold leaf, sea salt caramel, espresso dust.",
  },
  {
    id: "m6",
    name: "Dom Pérignon 2012",
    category: "Beverage",
    description: "Vintage Champagne.",
  },
];

const PASSENGERS = [
  { id: "p1", name: "Passenger 1 (Primary)" },
  { id: "p2", name: "Passenger 2" },
];

export default function InFlightCatering({ onClose }: { onClose: () => void }) {
  const [passengerMeals, setPassengerMeals] = useState<
    Record<string, MenuItem[]>
  >({
    p1: [],
    p2: [],
  });

  const handleDragStart = (e: React.DragEvent, item: MenuItem) => {
    e.dataTransfer.setData("application/json", JSON.stringify(item));
    triggerHaptic("light");
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, passengerId: string) => {
    e.preventDefault();
    const data = e.dataTransfer.getData("application/json");
    if (!data) return;

    const item = JSON.parse(data) as MenuItem;
    setPassengerMeals((prev) => ({
      ...prev,
      [passengerId]: [
        ...prev[passengerId],
        { ...item, id: `${item.id}-${Date.now()}` },
      ], // unique id for multiple instances
    }));
    triggerHaptic("medium");
  };

  const removeMeal = (passengerId: string, itemInstanceId: string) => {
    setPassengerMeals((prev) => ({
      ...prev,
      [passengerId]: prev[passengerId].filter(
        (meal) => meal.id !== itemInstanceId,
      ),
    }));
    triggerHaptic("light");
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-center items-center p-4 sm:p-8 bg-black/80 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="w-full max-w-6xl max-h-[90vh] bg-[#111216] border border-white/10 rounded-2xl flex flex-col overflow-hidden shadow-2xl relative"
      >
        <div className="flex justify-between items-center p-6 border-b border-white/5 bg-[#050507]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-aether-gold/10 text-aether-gold rounded-full flex items-center justify-center">
              <ChefHat className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-serif text-white">
                In-Flight Catering
              </h2>
              <p className="text-xs uppercase tracking-widest text-[#8E95A3] mt-1 font-semibold">
                Tasting Menu Selection
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 flex items-center justify-center rounded-full bg-white/5 border border-white/5 text-white/50 hover:bg-white/10 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex flex-1 overflow-hidden flex-col lg:flex-row">
          {/* Menu Browser */}
          <div className="lg:w-1/3 border-r border-white/5 p-6 bg-[#050507]/50 overflow-y-auto">
            <h3 className="text-sm font-semibold uppercase tracking-widest text-[#FAFAFA] mb-6 flex items-center gap-2">
              <Utensils className="w-4 h-4 text-aether-gold" /> The Menu
            </h3>
            <div className="space-y-4">
              {MENU.map((item) => (
                <div
                  key={item.id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, item)}
                  className="bg-[#111216] border border-white/5 rounded-xl p-4 cursor-grab active:cursor-grabbing hover:border-aether-gold/50 transition-colors"
                >
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="text-white font-medium text-sm">
                      {item.name}
                    </h4>
                    <span className="text-[9px] uppercase tracking-wider bg-white/10 text-white/70 px-2 py-0.5 rounded">
                      {item.category}
                    </span>
                  </div>
                  <p className="text-xs text-white/50">{item.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Passenger Assignment */}
          <div className="lg:w-2/3 p-6 bg-[#111216] overflow-y-auto flex-1">
            <h3 className="text-sm font-semibold uppercase tracking-widest text-[#FAFAFA] mb-6 flex items-center gap-2">
              <User className="w-4 h-4 text-[#4ade80]" /> Passenger Manifest
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-full">
              {PASSENGERS.map((p) => (
                <div
                  key={p.id}
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, p.id)}
                  className="bg-[#050507] border border-white/10 rounded-xl p-6 flex flex-col h-[400px] lg:h-auto"
                >
                  <h4 className="text-white font-serif text-lg mb-1">
                    {p.name}
                  </h4>
                  <p className="text-[10px] uppercase tracking-widest text-aether-gold mb-4 font-semibold">
                    Drag courses here
                  </p>

                  <div className="flex-1 rounded-lg border-2 border-dashed border-white/10 p-4 overflow-y-auto bg-black/20 flex flex-col space-y-3">
                    {passengerMeals[p.id].length === 0 ? (
                      <div className="flex-1 flex flex-col items-center justify-center text-white/30 text-center">
                        <Coffee className="w-8 h-8 mb-2 opacity-50" />
                        <span className="text-xs uppercase tracking-widest">
                          No courses assigned
                        </span>
                      </div>
                    ) : (
                      <AnimatePresence>
                        {passengerMeals[p.id].map((meal, index) => (
                          <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            key={meal.id}
                            className="bg-aether-gold/10 border border-aether-gold/20 rounded-lg p-3 relative group"
                          >
                            <div className="pr-6">
                              <p className="text-xs font-semibold text-white">
                                {index + 1}. {meal.name}
                              </p>
                              <p className="text-[10px] text-aether-gold uppercase tracking-widest mt-1">
                                {meal.category}
                              </p>
                            </div>
                            <button
                              onClick={() => removeMeal(p.id, meal.id)}
                              className="absolute top-2 right-2 w-6 h-6 rounded-full bg-black/50 text-white/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:text-white"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </motion.div>
                        ))}
                      </AnimatePresence>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="p-4 border-t border-white/5 bg-[#050507] flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-3 bg-aether-gold text-aether-black font-medium tracking-wide hover:bg-white transition-colors rounded-xl flex items-center gap-2"
          >
            Confirm Selections <Wine className="w-4 h-4" />
          </button>
        </div>
      </motion.div>
    </div>
  );
}
