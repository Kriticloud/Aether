import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { currentUser } from "./data";
import {
  User,
  Plane,
  History,
  Clock,
  CreditCard,
  Award,
  Scan,
} from "lucide-react";
import { useCurrency, Currency } from "./CurrencyContext";
import AviationMilestones from "./AviationMilestones";
import AccessActivityLog from "./AccessActivityLog";
import DocumentScanner from "./DocumentScanner";
import TravelAdvisorModule from "./TravelAdvisorModule";
import AviationAlertsPanel from "./AviationAlertsPanel";

export default function PassengerProfile() {
  const { currency, setCurrency } = useCurrency();
  const [isScannerOpen, setIsScannerOpen] = useState(false);

  return (
    <div className="p-8 pb-32 max-w-6xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: ID Card */}
        <div className="lg:col-span-1 space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-b from-aether-navy to-aether-black border border-aether-glass-border rounded-2xl overflow-hidden relative"
          >
            {/* abstract bg graphic */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-aether-gold/5 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />

            <div className="p-8">
              <div className="w-24 h-24 rounded-full border-2 border-aether-gold/30 mb-6 overflow-hidden mx-auto">
                <img
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80"
                  alt={currentUser.name}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="text-center mb-8">
                <h2 className="text-2xl font-serif text-aether-cloud mb-1">
                  {currentUser.name}
                </h2>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-aether-gold/10 border border-aether-gold/20 rounded-full text-aether-gold text-xs font-medium tracking-wider uppercase">
                  <Award className="w-3 h-3" /> {currentUser.loyaltyTier}
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center border-b border-aether-glass-border pb-3">
                  <span className="text-sm text-aether-steel">
                    Member Since
                  </span>
                  <span className="text-sm">{currentUser.memberSince}</span>
                </div>
                <div className="flex justify-between items-center border-b border-aether-glass-border pb-3">
                  <span className="text-sm text-aether-steel">Passport</span>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-mono tracking-widest text-aether-cloud/70">
                      •••• 4892
                    </span>
                    <button
                      onClick={() => setIsScannerOpen(true)}
                      className="text-[10px] uppercase font-bold tracking-wider bg-aether-gold/10 text-aether-gold px-2 py-1 rounded border border-aether-gold/20 hover:bg-aether-gold hover:text-black transition-colors flex items-center gap-1"
                    >
                      <Scan className="w-3 h-3" /> Update
                    </button>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-aether-steel">
                    Flight Hours
                  </span>
                  <span className="text-sm font-medium text-aether-gold">
                    {currentUser.totalFlightHours}h
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Right Column: Preferences & History */}
        <div className="lg:col-span-2 space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-aether-navy border border-aether-glass-border p-8 rounded-2xl"
          >
            <h3 className="text-xl font-serif mb-6 flex items-center gap-2">
              <User className="w-5 h-5 text-aether-gold" /> Flight Preferences
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <p className="text-xs uppercase tracking-widest text-aether-steel mb-3">
                  Dietary Requirements
                </p>
                <div className="flex flex-wrap gap-2">
                  {currentUser.preferences.food.map((item, idx) => (
                    <span
                      key={idx}
                      className="text-sm px-4 py-2 bg-aether-glass rounded-lg border border-aether-glass-border"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-xs uppercase tracking-widest text-aether-steel mb-3">
                  Preferred Aircraft
                </p>
                <div className="text-sm px-4 py-2 bg-aether-glass rounded-lg border border-aether-glass-border inline-flex items-center gap-2">
                  <Plane className="w-4 h-4 text-aether-gold" />{" "}
                  {currentUser.preferences.favoriteAircraft}
                </div>
              </div>
              <div className="md:col-span-2">
                <p className="text-xs uppercase tracking-widest text-aether-steel mb-3">
                  Seating Config
                </p>
                <p className="text-sm text-aether-cloud bg-aether-black p-4 rounded-xl border border-aether-glass-border">
                  {currentUser.preferences.seat}. Prefer temperature kept at
                  68°F. No pre-departure champagne unless requested.
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-aether-navy border border-aether-glass-border p-8 rounded-2xl"
          >
            <h3 className="text-xl font-serif mb-6 flex items-center gap-2">
              <History className="w-5 h-5 text-aether-gold" /> Recent
              Trajectories
            </h3>
            <div className="space-y-4">
              {currentUser.recentDestinations.map((dest, idx) => (
                <div
                  key={idx}
                  className="flex justify-between items-center p-4 border border-aether-glass-border rounded-xl bg-aether-glass/50 hover:bg-aether-glass transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-aether-black flex items-center justify-center border border-aether-glass-border">
                      <Plane className="w-4 h-4 text-aether-steel hover:text-aether-gold transition-colors" />
                    </div>
                    <div>
                      <p className="font-medium">JFK → {dest}</p>
                      <p className="text-xs text-aether-steel tracking-wide flex items-center gap-1 mt-1">
                        <Clock className="w-3 h-3" /> Completed
                      </p>
                    </div>
                  </div>
                  <button className="text-xs px-4 py-2 border border-aether-glass-border rounded hover:text-aether-gold transition-colors uppercase tracking-wider font-semibold">
                    Rebook
                  </button>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
          >
            <AviationMilestones />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-aether-navy border border-aether-glass-border p-8 rounded-2xl"
          >
            <h3 className="text-xl font-serif mb-6 flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-aether-gold" /> Account &
              Billing
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <p className="text-xs uppercase tracking-widest text-aether-steel mb-3">
                  Display Currency
                </p>
                <select
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value as Currency)}
                  className="w-full bg-aether-black border border-aether-glass-border text-aether-cloud px-4 py-3 rounded-lg appearance-none focus:outline-none focus:border-aether-gold transition-colors font-mono tracking-wider cursor-pointer"
                >
                  <option value="USD">USD - US Dollar ($)</option>
                  <option value="EUR">EUR - Euro (€)</option>
                  <option value="GBP">GBP - British Pound (£)</option>
                  <option value="JPY">JPY - Japanese Yen (¥)</option>
                  <option value="AED">AED - Emirati Dirham (د.إ)</option>
                </select>
              </div>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
          >
            <AccessActivityLog />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <TravelAdvisorModule />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45 }}
          >
            <AviationAlertsPanel />
          </motion.div>
        </div>
      </div>
      <AnimatePresence>
        {isScannerOpen && (
          <DocumentScanner onClose={() => setIsScannerOpen(false)} />
        )}
      </AnimatePresence>
    </div>
  );
}
