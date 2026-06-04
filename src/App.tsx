import React, { useState, useEffect } from "react";
import Layout from "./Layout";
import LandingPage from "./LandingPage";
import LiveFlightDashboard from "./LiveFlightDashboard";
import FlightBooking from "./FlightBooking";
import FleetExplorer from "./FleetExplorer";
import ConciergeDashboard from "./ConciergeDashboard";
import PassengerProfile from "./PassengerProfile";
import RouteAnalytics from "./RouteAnalytics";
import { motion, AnimatePresence } from "motion/react";
import { Toaster, toast } from "sonner";
import { CurrencyProvider } from "./CurrencyContext";

import VoiceCommandWidget from "./VoiceCommandWidget";
import AmbientSoundToggle from "./AmbientSoundToggle";
import MagneticCursor from "./MagneticCursor";
import BiometricAuth from "./BiometricAuth";

// Simple placeholder components for other routes
const CrewManagement = () => (
  <div className="p-8">
    <h1 className="text-4xl font-serif">Crew Operations</h1>
    <p className="text-aether-steel mt-4">Module under development.</p>
  </div>
);

const POSView = () => (
  <div className="min-h-screen bg-aether-black flex flex-col items-center justify-center text-center p-8">
    <div className="max-w-md w-full bg-aether-navy border border-aether-glass-border rounded-3xl p-10 relative overflow-hidden shadow-2xl">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-aether-navy via-aether-gold to-aether-navy" />
      <h2 className="text-sm font-medium tracking-widest uppercase text-aether-steel mb-8">
        Aether Lounge Check-In
      </h2>

      <div className="w-48 h-48 mx-auto bg-white rounded-xl p-4 mb-8">
        <img
          src="https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=AETHER_ACCESS_GRANTED"
          alt="QR Code"
          className="w-full h-full opacity-90 mix-blend-multiply"
        />
      </div>

      <h1 className="text-3xl font-serif text-aether-cloud mb-2">
        Eleanor Sterling
      </h1>
      <p className="text-aether-gold text-sm font-medium tracking-wider mb-8">
        Flight AE-420 • LAX to HND
      </p>

      <button className="w-full py-4 bg-aether-black border border-aether-glass-border hover:border-aether-gold transition-colors rounded-xl font-medium">
        Request Lounge Attendant
      </button>
    </div>
  </div>
);

export default function App() {
  const [currentRoute, setCurrentRoute] = useState("landing");
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const notifications = [
      {
        title: "Boarding Started",
        message: "Flight AE-420 to HND is now boarding at FBO VIP.",
        icon: "✈️",
      },
      {
        title: "Concierge Update",
        message: "Your preferred vintage champagne has been stocked on N739DX.",
        icon: "🍾",
      },
      {
        title: "Weather Advisory",
        message:
          "Tailwinds detected on NAT-track. Estimated 15 min early arrival.",
        icon: "🌤️",
      },
      {
        title: "System Status",
        message: "All telemetry links are nominal and secure.",
        icon: "🟢",
      },
    ];

    let notificationIndex = 0;
    const interval = setInterval(() => {
      // Only show notifications if not on landing/pos page
      if (document.body.innerText.includes("Explore Your Fleet")) {
        const notif = notifications[notificationIndex % notifications.length];
        toast(notif.title, {
          description: notif.message,
          icon: notif.icon,
        });
        notificationIndex++;
      }
    }, 45000); // 45 seconds

    return () => clearInterval(interval);
  }, []);

  // To simulate route changes smoothing
  const renderRoute = () => {
    switch (currentRoute) {
      case "landing":
        return <LandingPage onEnter={() => setCurrentRoute("dashboard")} />;
      case "dashboard":
        return <LiveFlightDashboard />;
      case "booking":
        return <FlightBooking />;
      case "fleet":
        return <FleetExplorer />;
      case "concierge":
        return <ConciergeDashboard />;
      case "profile":
        return <PassengerProfile />;
      case "analytics":
        return <RouteAnalytics />;
      case "crew":
        return <CrewManagement />;
      case "pos":
        return <POSView />;
      default:
        return <LiveFlightDashboard />;
    }
  };

  return (
    <CurrencyProvider>
      {!isAuthenticated && (
        <BiometricAuth onAuthenticated={() => setIsAuthenticated(true)} />
      )}
      <Layout currentRoute={currentRoute} onNavigate={setCurrentRoute}>
        <Toaster
          theme="dark"
          position="top-right"
          toastOptions={{
            style: {
              background: "#111216",
              border: "1px solid #D4C5B940",
              color: "#FAFAFA",
              fontFamily: "Manrope, sans-serif",
            },
            descriptionClassName: "text-[#8E95A3] font-mono text-xs",
          }}
        />
        <VoiceCommandWidget onNavigate={setCurrentRoute} />
        <AmbientSoundToggle />
        <MagneticCursor />
        <AnimatePresence mode="wait">
          <motion.div
            key={currentRoute}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="h-full w-full"
          >
            {renderRoute()}
          </motion.div>
        </AnimatePresence>
      </Layout>
    </CurrencyProvider>
  );
}
