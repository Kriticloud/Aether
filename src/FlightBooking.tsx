import React, { useState } from "react";
import { motion, AnimatePresence, Reorder } from "motion/react";
import {
  Plane,
  Calendar,
  Users,
  ArrowRight,
  Search,
  CheckCircle,
  Download,
  MapPin,
  Map,
  GripVertical,
} from "lucide-react";
import { fleet } from "./data";
import BoardingPass from "./BoardingPass";
import { useCurrency } from "./CurrencyContext";
import { triggerHaptic } from "./haptics";

export default function FlightBooking() {
  const [step, setStep] = useState(1);
  const { formatPrice } = useCurrency();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    from: "",
    to: "",
    date: "",
    passengers: "1",
    aircraft: "",
  });

  const [waypoints, setWaypoints] = useState([
    { id: "wp-1", location: "London (LHR)" },
    { id: "wp-2", location: "Paris (CDG)" },
    { id: "wp-3", location: "Dubai (DXB)" },
  ]);

  const handleBooking = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setStep(3);
    }, 2000);
  };

  return (
    <div className="p-8 pb-32 max-w-5xl mx-auto">
      <header className="mb-10 text-center">
        <h1 className="text-4xl font-serif text-aether-cloud mb-2">
          Charter a Flight
        </h1>
        <p className="text-aether-steel">
          Intelligent route planning and seamless booking.
        </p>
      </header>

      <div className="bg-aether-navy border border-aether-glass-border p-8 rounded-2xl relative overflow-hidden">
        {/* Progress indicator */}
        <div className="absolute top-0 left-0 w-full h-1 bg-aether-black">
          <motion.div
            className="h-full bg-aether-gold"
            initial={{ width: 0 }}
            animate={{
              width: step === 1 ? "33%" : step === 2 ? "66%" : "100%",
            }}
          />
        </div>

        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-8 mt-4"
            >
              <div className="flex flex-col md:flex-row gap-6">
                <div className="flex-1 bg-[#111216] border border-white/5 p-4 rounded-xl">
                  <div className="flex justify-between items-center mb-4">
                    <label className="text-xs uppercase tracking-widest text-aether-steel flex items-center gap-2">
                      <Map className="w-4 h-4" /> Route Builder
                    </label>
                    <span className="text-[10px] text-aether-steel bg-white/5 py-1 px-2 rounded">
                      Drag to Reorder
                    </span>
                  </div>
                  <Reorder.Group
                    axis="y"
                    values={waypoints}
                    onReorder={(w) => {
                      triggerHaptic("light");
                      setWaypoints(w);
                    }}
                    className="space-y-3 relative"
                  >
                    <div className="absolute top-6 bottom-6 left-[19px] w-[2px] bg-white/10 z-0" />
                    {waypoints.map((wp, i) => (
                      <Reorder.Item
                        key={wp.id}
                        value={wp}
                        className="relative z-10 flex items-center gap-3 bg-[#050507] border border-white/5 p-3 rounded-lg cursor-grab active:cursor-grabbing shadow-lg"
                      >
                        <GripVertical className="w-4 h-4 text-white/30" />
                        <div
                          className={`w-3 h-3 rounded-full border-2 ${i === 0 ? "border-aether-gold bg-aether-gold/20" : i === waypoints.length - 1 ? "border-[#4ade80] bg-[#4ade80]/20" : "border-white/50 bg-white/10"}`}
                        />
                        <span className="text-sm font-medium text-white flex-1">
                          {wp.location}
                        </span>
                        <span className="text-xs uppercase tracking-widest font-semibold text-white/40">
                          {i === 0
                            ? "Origin"
                            : i === waypoints.length - 1
                              ? "Dest"
                              : "Stop"}
                        </span>
                      </Reorder.Item>
                    ))}
                  </Reorder.Group>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-widest text-aether-steel">
                    Departure Date
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-aether-steel" />
                    <input
                      type="date"
                      value={formData.date}
                      onChange={(e) =>
                        setFormData({ ...formData, date: e.target.value })
                      }
                      className="w-full bg-aether-black border border-aether-glass-border rounded-xl py-4 pl-12 pr-4 text-aether-cloud focus:border-aether-gold focus:outline-none transition-colors [color-scheme:dark]"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-widest text-aether-steel">
                    Passengers
                  </label>
                  <div className="relative">
                    <Users className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-aether-steel" />
                    <select
                      value={formData.passengers}
                      onChange={(e) =>
                        setFormData({ ...formData, passengers: e.target.value })
                      }
                      className="w-full bg-aether-black border border-aether-glass-border rounded-xl py-4 pl-12 pr-4 text-aether-cloud focus:border-aether-gold focus:outline-none transition-colors appearance-none"
                    >
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((n) => (
                        <option key={n} value={n}>
                          {n} Pax
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-4 border-t border-aether-glass-border">
                <button
                  onClick={() => {
                    setFormData({
                      ...formData,
                      from: waypoints[0].location,
                      to: waypoints[waypoints.length - 1].location,
                    });
                    setStep(2);
                  }}
                  disabled={waypoints.length < 2 || !formData.date}
                  className="px-8 py-4 bg-aether-gold text-aether-black font-medium tracking-wide hover:bg-white transition-colors flex items-center gap-2 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Find Aircraft <Search className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="mt-4"
            >
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h3 className="text-xl font-serif">Select Aircraft</h3>
                  <p className="text-sm text-aether-steel">
                    Recommended jets for {formData.from} to {formData.to}
                  </p>
                </div>
                <button
                  onClick={() => setStep(1)}
                  className="text-sm text-aether-gold hover:underline"
                >
                  Edit Route
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                {fleet.slice(0, 2).map((aircraft) => (
                  <div
                    key={aircraft.id}
                    onClick={() =>
                      setFormData({ ...formData, aircraft: aircraft.id })
                    }
                    className={`border rounded-xl p-4 cursor-pointer transition-all ${formData.aircraft === aircraft.id ? "border-aether-gold bg-aether-glass" : "border-aether-glass-border hover:border-aether-steel"}`}
                  >
                    <img
                      src={aircraft.image}
                      alt={aircraft.name}
                      className="w-full h-32 object-cover rounded-lg mb-4"
                    />
                    <h4 className="font-serif text-lg">{aircraft.name}</h4>
                    <div className="flex justify-between items-center mt-2">
                      <span className="text-xs text-aether-steel">
                        {aircraft.seats} Seats • Mach {aircraft.speedMach}
                      </span>
                      <span className="text-aether-gold font-medium">
                        Est. {formatPrice(aircraft.hourlyRate * 4)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex justify-between items-center pt-6 border-t border-aether-glass-border">
                <p className="text-sm text-aether-steel">
                  Estimated flight time:{" "}
                  <span className="text-aether-cloud">4h 15m</span>
                </p>
                <button
                  onClick={handleBooking}
                  disabled={!formData.aircraft || isSubmitting}
                  className="px-8 py-4 bg-aether-gold text-aether-black font-medium tracking-wide hover:bg-white transition-colors flex items-center gap-2 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? "Processing..." : "Confirm Request"}{" "}
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-10 w-full"
            >
              <h3 className="text-3xl font-serif mb-2">Itinerary Confirmed</h3>
              <p className="text-aether-steel mb-10">
                Your elite charter has been secured.
              </p>

              <div className="mb-12 text-left">
                <BoardingPass
                  from={formData.from}
                  to={formData.to}
                  date={formData.date}
                  aircraftId={formData.aircraft}
                  passengers={formData.passengers}
                />
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <button
                  onClick={() => {
                    setFormData({
                      from: "",
                      to: "",
                      date: "",
                      passengers: "1",
                      aircraft: "",
                    });
                    setStep(1);
                  }}
                  className="px-8 py-4 border border-aether-glass-border hover:bg-aether-glass transition-colors rounded-sm font-medium w-full sm:w-auto"
                >
                  Start New Booking
                </button>
                <button className="px-8 py-4 bg-aether-gold text-aether-black font-medium tracking-wide hover:bg-white transition-colors flex items-center justify-center gap-2 rounded-sm w-full sm:w-auto">
                  <Download className="w-4 h-4" /> Download Pass
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
