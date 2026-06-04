import React, { useState } from "react";
import { motion } from "motion/react";
import {
  Bell,
  Mail,
  Smartphone,
  Check,
  PlaneTakeoff,
  PlaneLanding,
  ClipboardList,
} from "lucide-react";
import { triggerHaptic } from "./haptics";

interface AlertSetting {
  id: string;
  label: string;
  icon: React.ElementType;
  email: boolean;
  sms: boolean;
}

const INITIAL_ALERTS: AlertSetting[] = [
  {
    id: "pre-flight",
    label: "Pre-flight check",
    icon: ClipboardList,
    email: true,
    sms: true,
  },
  {
    id: "taxiing",
    label: "Taxiing",
    icon: PlaneTakeoff,
    email: false,
    sms: true,
  },
  {
    id: "arrival",
    label: "Arrival",
    icon: PlaneLanding,
    email: true,
    sms: true,
  },
];

export default function AviationAlertsPanel() {
  const [alerts, setAlerts] = useState<AlertSetting[]>(INITIAL_ALERTS);

  const toggleAlert = (id: string, type: "email" | "sms") => {
    triggerHaptic("light");
    setAlerts((prev) =>
      prev.map((alert) =>
        alert.id === id ? { ...alert, [type]: !alert[type] } : alert,
      ),
    );
  };

  return (
    <div className="bg-aether-navy border border-aether-glass-border p-8 rounded-2xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h3 className="text-xl font-serif flex items-center gap-2">
            <Bell className="w-5 h-5 text-aether-gold" /> Aviation Alerts
          </h3>
          <p className="text-sm text-aether-steel mt-2">
            Manage your real-time notification preferences for critical flight
            stages.
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {alerts.map((alert) => (
          <div
            key={alert.id}
            className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-aether-black border border-white/5 rounded-xl gap-4"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-aether-navy rounded-lg border border-aether-glass-border">
                <alert.icon className="w-4 h-4 text-aether-gold" />
              </div>
              <span className="text-sm font-medium text-white">
                {alert.label}
              </span>
            </div>

            <div className="flex items-center gap-6">
              <button
                onClick={() => toggleAlert(alert.id, "email")}
                className="flex items-center gap-2 group"
              >
                <div
                  className={`w-10 h-6 rounded-full flex items-center px-1 transition-colors ${alert.email ? "bg-[#4ade80]/20 border border-[#4ade80]/30" : "bg-white/5 border border-white/10"}`}
                >
                  <motion.div
                    layout
                    className={`w-4 h-4 rounded-full flex items-center justify-center ${alert.email ? "bg-[#4ade80]" : "bg-white/30"}`}
                    style={{ x: alert.email ? 14 : 0 }}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  />
                </div>
                <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-aether-steel group-hover:text-white transition-colors min-w-[60px]">
                  <Mail className="w-3 h-3" /> Email
                </div>
              </button>

              <button
                onClick={() => toggleAlert(alert.id, "sms")}
                className="flex items-center gap-2 group"
              >
                <div
                  className={`w-10 h-6 rounded-full flex items-center px-1 transition-colors ${alert.sms ? "bg-[#4ade80]/20 border border-[#4ade80]/30" : "bg-white/5 border border-white/10"}`}
                >
                  <motion.div
                    layout
                    className={`w-4 h-4 rounded-full flex items-center justify-center ${alert.sms ? "bg-[#4ade80]" : "bg-white/30"}`}
                    style={{ x: alert.sms ? 14 : 0 }}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  />
                </div>
                <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-aether-steel group-hover:text-white transition-colors min-w-[60px]">
                  <Smartphone className="w-3 h-3" /> SMS
                </div>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
