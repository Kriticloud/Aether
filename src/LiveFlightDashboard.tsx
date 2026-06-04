import React, { useRef, useState, useEffect } from "react";
import { motion, useAnimationFrame } from "motion/react";
import { activeFlights } from "./data";
import {
  Plane,
  CloudLightning,
  Wind,
  Navigation,
  Droplets,
  BatteryCharging,
  PlaneTakeoff,
  PlaneLanding,
  ClipboardList,
  MoveRight,
  MapPin,
  Satellite,
  Activity,
  AlertTriangle,
  Settings,
  RefreshCw,
} from "lucide-react";
import Globe from "react-globe.gl";

import GlobalTimezoneSync from "./GlobalTimezoneSync";
import InFlightMode from "./InFlightMode";
import ARSkyView from "./ARSkyView";
import InFlightLuggageTracker from "./InFlightLuggageTracker";
import { triggerHaptic } from "./haptics";
import { AnimatePresence } from "motion/react";

const initialArcsData = [
  {
    id: "f1",
    from: "JFK",
    to: "LHR",
    startLat: 40.6413,
    startLng: -73.7781,
    endLat: 51.47,
    endLng: -0.4543,
    color: "#4ade80",
    progress: 0.65,
  }, // JFK to LHR
  {
    id: "f2",
    from: "DXB",
    to: "VKO",
    startLat: 25.2532,
    startLng: 55.3657,
    endLat: 55.5915,
    endLng: 37.2615,
    color: "#D4C5B9",
    progress: 0.1,
  }, // DXB to VKO
  {
    id: "f3",
    from: "LAX",
    to: "HND",
    startLat: 33.9416,
    startLng: -118.4085,
    endLat: 35.5494,
    endLng: 139.7798,
    color: "#8E95A3",
    progress: 0.95,
  }, // LAX to HND
];

const airportsData = initialArcsData.flatMap((d) => [
  { name: d.from, lat: d.startLat, lng: d.startLng },
  { name: d.to, lat: d.endLat, lng: d.endLng },
]);

const CircularProgress = ({
  progress,
  label,
  color,
  alert,
}: {
  progress: number;
  label: string;
  color: string;
  alert?: boolean;
}) => {
  const radius = 26;
  const stroke = 3;
  const normalizedRadius = radius - stroke * 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div className="flex flex-col items-center">
      <div className="relative mb-2">
        <svg height={radius * 2} width={radius * 2} className="-rotate-90">
          <circle
            stroke="rgba(255,255,255,0.1)"
            fill="transparent"
            strokeWidth={stroke}
            r={normalizedRadius}
            cx={radius}
            cy={radius}
          />
          <circle
            stroke={color}
            fill="transparent"
            strokeWidth={stroke}
            strokeDasharray={circumference + " " + circumference}
            style={{ strokeDashoffset }}
            strokeLinecap="round"
            r={normalizedRadius}
            cx={radius}
            cy={radius}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span
            className="text-[10px] font-mono font-medium"
            style={{ color: alert ? "#f87171" : "#FAFAFA" }}
          >
            {progress}%
          </span>
        </div>
      </div>
      <span className="text-[9px] text-aether-steel text-center uppercase tracking-wider">
        {label}
      </span>
      {alert && (
        <span className="text-[9px] text-red-400 uppercase tracking-widest mt-1 font-semibold flex items-center gap-1">
          <AlertTriangle className="w-3 h-3" /> Maint. Req.
        </span>
      )}
    </div>
  );
};

export default function LiveFlightDashboard() {
  const globeContainerRef = useRef<HTMLDivElement>(null);
  const globeRef = useRef<any>();
  const [dimensions, setDimensions] = useState({ width: 0, height: 400 });
  const [selectedFlightId, setSelectedFlightId] = useState<string | null>(null);
  const [realTimeMeteo, setRealTimeMeteo] = useState<any[] | null>(null);
  const [arcsData, setArcsData] = useState(initialArcsData);
  const [showWeather, setShowWeather] = useState(false);
  const [activeFlightTab, setActiveFlightTab] = useState<
    "Timeline" | "Health" | "Luggage"
  >("Timeline");
  const [viewMode, setViewMode] = useState<
    "Telemetry" | "In-Flight" | "AR Sky-View"
  >("Telemetry");

  const [signalStrength, setSignalStrength] = useState(85);
  const [isReconnecting, setIsReconnecting] = useState(false);

  // Mobile Gestures State
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [refreshProgress, setRefreshProgress] = useState(0);
  const [notifications, setNotifications] = useState([
    { id: 1, message: "F1: Cleared for direct routing", type: "info" },
    { id: 2, message: "F2: Expected light turbulence in 30m", type: "warning" },
  ]);

  const handleRefreshDrag = (event: any, info: any) => {
    if (info.offset.y > 0) {
      setRefreshProgress(Math.min(info.offset.y, 100));
      if (info.offset.y > 80 && !isRefreshing) {
        setIsRefreshing(true);
        setRefreshProgress(100);
        triggerHaptic("heavy");
        // Simulate refresh
        setTimeout(() => {
          setIsRefreshing(false);
          setRefreshProgress(0);
          setArcsData(
            arcsData.map((d) => ({
              ...d,
              progress: Math.min(1, d.progress + 0.05),
            })),
          );
          triggerHaptic("success");
        }, 1500);
      }
    }
  };

  const handleRefreshDragEnd = () => {
    if (!isRefreshing) {
      setRefreshProgress(0);
    }
  };

  const removeNotification = (id: number) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
    triggerHaptic("light");
  };

  useEffect(() => {
    const interval = setInterval(() => {
      if (!isReconnecting) {
        setSignalStrength((prev) => {
          const drop =
            Math.random() > 0.8 ? -Math.random() * 20 : Math.random() * 5 - 2.5;
          return Math.max(10, Math.min(100, prev + drop));
        });
      }
    }, 2000);
    return () => clearInterval(interval);
  }, [isReconnecting]);

  const handleReconnect = () => {
    setIsReconnecting(true);
    setSignalStrength(0);
    setTimeout(() => {
      setSignalStrength(95);
      setIsReconnecting(false);
    }, 2500);
  };

  // Generate mock wind paths for weather overlay
  const windPaths = React.useMemo(() => {
    return Array.from({ length: 300 }).map(() => {
      const startLat = (Math.random() - 0.5) * 160;
      const startLng = (Math.random() - 0.5) * 360;
      const isNorthern = startLat > 0;
      const latMovement = (Math.random() - 0.5) * 5;
      const lngMovement = isNorthern
        ? Math.random() * 15 + 5
        : -(Math.random() * 15 + 5);

      const path = [];
      const segments = 20;
      for (let i = 0; i < segments; i++) {
        const progress = i / (segments - 1);
        path.push([
          startLat + latMovement * progress,
          startLng + lngMovement * progress,
          0.005,
        ]);
      }
      return { path, color: "rgba(255, 255, 255, 0.15)" };
    });
  }, []);

  // Animate plane progress along Bezier path
  useEffect(() => {
    let animationFrameId: number;
    let startTime = Date.now();

    const updateProgress = () => {
      const timeElapsed = Date.now() - startTime;

      setArcsData((prev) =>
        prev.map((arc) => {
          // Slow progression: loop every 60 seconds (60000ms)
          const progressIncrement = (timeElapsed / 60000) % 1;

          return {
            ...arc,
            progress: (arc.progress + progressIncrement) % 1,
          };
        }),
      );

      startTime = Date.now();
      animationFrameId = requestAnimationFrame(updateProgress);
    };

    animationFrameId = requestAnimationFrame(updateProgress);
    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  const planeData = arcsData.map((d) => {
    // Generate simple bezier curve interpolation for lat/lng based on progress
    // This is a naive linear interpolation for the example. Real arcs are great circle.
    // For visual purposes, we interpolate with slight curve.

    // Simple interpolation
    const lat = d.startLat + (d.endLat - d.startLat) * d.progress;
    // Handle longitudes crossing the anti-meridian
    let lngDiff = d.endLng - d.startLng;
    if (lngDiff > 180) lngDiff -= 360;
    if (lngDiff < -180) lngDiff += 360;

    let lng = d.startLng + lngDiff * d.progress;

    // Add artificial altitude/bezier curve in the middle
    // React Globe handles arc rendering, but HTML elements follow ground path.
    return {
      ...d,
      lat,
      lng,
    };
  });

  const handleFlightClick = async (id: string | null) => {
    setSelectedFlightId(id);
    setRealTimeMeteo(null); // Reset when clicking

    if (id && globeRef.current) {
      const flight = arcsData.find((f) => f.id === id);
      if (flight) {
        globeRef.current.pointOfView(
          {
            lat: (flight.startLat + flight.endLat) / 2,
            lng: (flight.startLng + flight.endLng) / 2,
            altitude: 2,
          },
          1000,
        );

        try {
          // Fetch real-time weather for destination
          const response = await fetch(
            `https://api.open-meteo.com/v1/forecast?latitude=${flight.endLat}&longitude=${flight.endLng}&current=temperature_2m,wind_speed_10m,visibility,weather_code`,
          );
          const data = await response.json();

          if (data && data.current) {
            setRealTimeMeteo([
              {
                label: `${flight.to} Temp`,
                value: `${data.current.temperature_2m}°C`,
                icon: CloudLightning,
              },
              {
                label: `${flight.to} Wind`,
                value: `${data.current.wind_speed_10m} km/h`,
                icon: Wind,
              },
              {
                label: `${flight.to} Visibility`,
                value: `${(data.current.visibility / 1000).toFixed(1)} km`,
                icon: Navigation,
              },
              {
                label: "Routing",
                value: flight.id === "f1" ? "NAT Track" : "Direct",
                icon: Plane,
              },
            ]);
          }
        } catch (error) {
          console.error("Failed to fetch METAR data", error);
        }
      }
    }
  };

  const meteoData: Record<string, any> = {
    f1: [
      { label: "Jet Stream", value: "110 kts Tailwind", icon: Wind },
      { label: "OAT", value: "-54°C", icon: CloudLightning },
      { label: "Turbulence", value: "Light (CAT)", icon: Navigation },
      { label: "Routing", value: "NAT Track B", icon: Plane },
    ],
    f2: [
      { label: "Jet Stream", value: "45 kts Crosswind", icon: Wind },
      { label: "OAT", value: "-48°C", icon: CloudLightning },
      { label: "Turbulence", value: "Moderate", icon: Navigation },
      { label: "Routing", value: "Direct", icon: Plane },
    ],
    f3: [
      { label: "Jet Stream", value: "130 kts Headwind", icon: Wind },
      { label: "OAT", value: "-58°C", icon: CloudLightning },
      { label: "Turbulence", value: "Smooth", icon: Navigation },
      { label: "Routing", value: "NOPAC R220", icon: Plane },
    ],
  };

  useEffect(() => {
    const handleSelectFlight = (e: Event) => {
      handleFlightClick((e as CustomEvent).detail);
    };
    window.addEventListener("selectFlight", handleSelectFlight);
    return () => window.removeEventListener("selectFlight", handleSelectFlight);
  }, []);

  useEffect(() => {
    if (!globeContainerRef.current) return;
    const observer = new ResizeObserver((entries) => {
      if (entries[0]) {
        setDimensions({
          width: Math.floor(entries[0].contentRect.width),
          height: Math.floor(entries[0].contentRect.height),
        });
      }
    });
    observer.observe(globeContainerRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (globeRef.current) {
      globeRef.current.controls().autoRotate = true;
      globeRef.current.controls().autoRotateSpeed = 0.5;
      globeRef.current.controls().enableZoom = false;
      globeRef.current.pointOfView({ lat: 35, lng: -40, altitude: 2 }, 1000);
    }
  }, [dimensions.width]);

  return (
    <motion.div
      className="p-8 pb-32 min-h-screen relative"
      drag="y"
      dragConstraints={{ top: 0, bottom: 0 }}
      dragElastic={{ top: 0, bottom: 0.1 }}
      onDrag={handleRefreshDrag}
      onDragEnd={handleRefreshDragEnd}
    >
      {/* Pull to Refresh Indicator */}
      <div
        className="absolute top-0 left-0 right-0 flex justify-center pointer-events-none"
        style={{
          opacity: refreshProgress / 100,
          transform: `translateY(${Math.min(refreshProgress, 50)}px)`,
        }}
      >
        <div className="bg-aether-gold/20 text-aether-gold border border-aether-gold/40 px-4 py-2 rounded-full text-xs font-medium backdrop-blur-sm flex items-center gap-2">
          <RefreshCw
            className={`w-4 h-4 ${isRefreshing ? "animate-spin" : ""}`}
          />
          {isRefreshing ? "Refreshing Telemetry..." : "Pull to Refresh"}
        </div>
      </div>

      {/* Swipeable Notifications */}
      <div className="fixed top-24 right-8 z-50 flex flex-col gap-2 w-72 pointer-events-none">
        <AnimatePresence>
          {notifications.map((notif) => (
            <motion.div
              key={notif.id}
              initial={{ opacity: 0, x: 50, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 100, scale: 0.95 }}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={{ left: 0, right: 1 }}
              onDragEnd={(e, info) => {
                if (info.offset.x > 100) removeNotification(notif.id);
              }}
              className={`pointer-events-auto cursor-grab active:cursor-grabbing p-4 rounded-xl border backdrop-blur-md shadow-2xl ${notif.type === "info" ? "bg-[#111216]/90 border-white/10 text-white" : "bg-red-500/10 border-red-500/20 text-red-500"}`}
            >
              <div className="flex gap-3 items-start">
                <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium">{notif.message}</p>
                  <p className="text-[10px] uppercase tracking-widest mt-2 opacity-60">
                    Swipe right to dismiss
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <header className="mb-10 flex flex-col xl:flex-row justify-between items-start xl:items-end gap-6 relative z-10">
        <div>
          <h1 className="text-4xl font-serif text-aether-cloud mb-2">
            Live Operations
          </h1>
          <p className="text-aether-steel">
            Real-time telemetry and flight tracking.
          </p>
          <div className="mt-6 flex bg-aether-black border border-white/5 p-1 rounded-xl w-max overflow-x-auto">
            <button
              onClick={() => setViewMode("Telemetry")}
              className={`px-6 py-2.5 rounded-lg text-xs font-semibold uppercase tracking-widest transition-all whitespace-nowrap ${viewMode === "Telemetry" ? "bg-aether-gold text-aether-black shadow-lg shadow-aether-gold/20" : "text-aether-steel hover:text-white"}`}
            >
              Operations Telemetry
            </button>
            <button
              onClick={() => setViewMode("In-Flight")}
              className={`px-6 py-2.5 rounded-lg text-xs font-semibold uppercase tracking-widest transition-all whitespace-nowrap ${viewMode === "In-Flight" ? "bg-[#4ade80] text-[#050507] shadow-lg shadow-[#4ade80]/20" : "text-aether-steel hover:text-white"}`}
            >
              In-Flight View
            </button>
            <button
              onClick={() => setViewMode("AR Sky-View")}
              className={`px-6 py-2.5 rounded-lg text-xs font-semibold uppercase tracking-widest transition-all whitespace-nowrap ${viewMode === "AR Sky-View" ? "bg-[#0ea5e9] text-white shadow-lg shadow-[#0ea5e9]/20" : "text-aether-steel hover:text-white"}`}
            >
              AR Sky-View
            </button>
          </div>
        </div>
      </header>

      {viewMode === "In-Flight" ? (
        <InFlightMode selectedFlightId={selectedFlightId} />
      ) : viewMode === "AR Sky-View" ? (
        <ARSkyView selectedFlightId={selectedFlightId} />
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Active Flights List */}
          <div className="xl:col-span-1 space-y-4">
            <h2 className="text-sm font-medium tracking-widest text-aether-gold uppercase mb-4">
              Active Fleet
            </h2>
            {activeFlights.map((flight, idx) => (
              <motion.div
                key={flight.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
                onClick={() => handleFlightClick(flight.id)}
                className={`bg-aether-glass border ${selectedFlightId === flight.id ? "border-aether-gold" : "border-aether-glass-border"} p-5 rounded-xl hover:border-aether-gold transition-colors cursor-pointer`}
              >
                <div className="flex justify-between items-center mb-4">
                  <span className="text-xs font-semibold px-2 py-1 bg-aether-navy text-aether-cloud rounded">
                    {flight.id.toUpperCase()}
                  </span>
                  <span
                    className={`text-xs px-2 py-1 rounded flex items-center gap-2 ${
                      flight.status === "In-Flight"
                        ? "text-green-400 bg-green-400/10"
                        : flight.status === "Scheduled"
                          ? "text-aether-gold bg-aether-gold/10"
                          : "text-aether-steel bg-aether-steel/10"
                    }`}
                  >
                    {flight.status === "In-Flight" && (
                      <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                    )}
                    {flight.status}
                  </span>
                </div>

                <div className="flex justify-between items-end mb-4">
                  <div>
                    <p className="text-3xl font-serif">{flight.from}</p>
                    <p className="text-xs text-aether-steel">
                      {flight.departureTime}
                    </p>
                  </div>
                  <div className="flex-1 px-4 flex flex-col items-center justify-center relative">
                    <div className="w-full h-px border-t border-dashed border-aether-steel/50 relative">
                      <Plane
                        className="w-4 h-4 text-aether-gold absolute top-1/2 -translate-y-1/2"
                        style={{
                          left: `${flight.progress * 100}%`,
                          transform: "translate(-50%, -50%) rotate(45deg)",
                        }}
                      />
                    </div>
                    <p className="text-[10px] text-aether-steel mt-2">
                      {flight.duration}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-3xl font-serif">{flight.to}</p>
                    <p className="text-xs text-aether-steel">
                      {flight.arrivalTime}
                    </p>
                  </div>
                </div>

                <div className="h-1.5 w-full bg-aether-navy rounded-full overflow-hidden">
                  <div
                    className="h-full bg-aether-gold"
                    style={{ width: `${flight.progress * 100}%` }}
                  />
                </div>

                {selectedFlightId === flight.id && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="mt-6 pt-6 border-t border-white/5 overflow-hidden"
                  >
                    <div className="flex gap-4 mb-6 border-b border-white/5 pb-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveFlightTab("Timeline");
                        }}
                        className={`text-xs uppercase tracking-widest font-semibold pb-2 border-b-2 transition-colors ${activeFlightTab === "Timeline" ? "text-aether-gold border-aether-gold" : "text-aether-steel border-transparent hover:text-white"}`}
                      >
                        Timeline
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveFlightTab("Health");
                        }}
                        className={`text-xs uppercase tracking-widest font-semibold pb-2 border-b-2 transition-colors flex items-center gap-1.5 ${activeFlightTab === "Health" ? "text-aether-gold border-aether-gold" : "text-aether-steel border-transparent hover:text-white"}`}
                      >
                        <Activity className="w-3.5 h-3.5" /> Health
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveFlightTab("Luggage");
                        }}
                        className={`text-xs uppercase tracking-widest font-semibold pb-2 border-b-2 transition-colors flex items-center gap-1.5 ${activeFlightTab === "Luggage" ? "text-aether-gold border-aether-gold" : "text-aether-steel border-transparent hover:text-white"}`}
                      >
                        Luggage
                      </button>
                    </div>

                    {activeFlightTab === "Luggage" && (
                      <InFlightLuggageTracker flightId={flight.id} />
                    )}

                    {activeFlightTab === "Timeline" && (
                      <div className="relative pl-3 space-y-6">
                        <div className="absolute left-[17px] top-2 bottom-2 w-px bg-white/10" />
                        {[
                          {
                            label: "Pre-flight",
                            threshold: 0.0,
                            icon: ClipboardList,
                            time: "T-00:45",
                          },
                          {
                            label: "Taxi",
                            threshold: 0.05,
                            icon: MoveRight,
                            time: "T-00:10",
                          },
                          {
                            label: "Take-off",
                            threshold: 0.1,
                            icon: PlaneTakeoff,
                            time: "T+00:00",
                          },
                          {
                            label: "Cruise",
                            threshold: 0.2,
                            icon: Plane,
                            time: "T+01:30",
                          },
                          {
                            label: "Descent",
                            threshold: 0.8,
                            icon: PlaneLanding,
                            time: "T+05:45",
                          },
                          {
                            label: "Arrival",
                            threshold: 0.95,
                            icon: MapPin,
                            time: "T+06:15",
                          },
                        ].map((step, idx, arr) => {
                          const activeIndex = arr.reduce(
                            (acc, curr, i) =>
                              curr.threshold <= flight.progress ? i : acc,
                            0,
                          );
                          const isActive = idx === activeIndex;
                          const isPast = idx < activeIndex;

                          return (
                            <div
                              key={idx}
                              className="relative flex items-center gap-4"
                            >
                              <div
                                className={`w-2.5 h-2.5 rounded-full relative z-10 flex-shrink-0 ${
                                  isActive
                                    ? "bg-aether-gold outline outline-4 outline-aether-gold/20"
                                    : isPast
                                      ? "bg-white/50"
                                      : "bg-aether-navy border border-white/20"
                                }`}
                              />
                              <div className="flex bg-aether-navy/30 p-2 rounded-lg border border-white/5 items-center justify-between flex-1">
                                <div className="flex gap-3 items-center">
                                  <div
                                    className={`p-1.5 rounded-md ${
                                      isActive
                                        ? "bg-aether-gold/10"
                                        : "bg-transparent"
                                    }`}
                                  >
                                    <step.icon
                                      className={`w-3.5 h-3.5 ${
                                        isActive
                                          ? "text-aether-gold"
                                          : isPast
                                            ? "text-white/50"
                                            : "text-white/20"
                                      }`}
                                    />
                                  </div>
                                  <span
                                    className={`text-sm ${
                                      isActive
                                        ? "text-aether-gold font-medium"
                                        : isPast
                                          ? "text-white/70"
                                          : "text-white/30"
                                    }`}
                                  >
                                    {step.label}
                                  </span>
                                </div>
                                <span
                                  className={`text-[10px] font-mono tracking-wider ${
                                    isActive ? "text-white" : "text-white/30"
                                  }`}
                                >
                                  {step.time}
                                </span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}

                    {activeFlightTab === "Health" && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="py-2"
                      >
                        <div className="grid grid-cols-2 gap-y-8 gap-x-4 mb-6">
                          <CircularProgress
                            progress={12}
                            label="Port Engine (L)"
                            color="#f87171"
                            alert
                          />
                          <CircularProgress
                            progress={87}
                            label="Starboard (R)"
                            color="#4ade80"
                          />
                          <CircularProgress
                            progress={94}
                            label="Avionics"
                            color="#4ade80"
                          />
                          <CircularProgress
                            progress={62}
                            label="APU System"
                            color="#fbbf24"
                          />
                        </div>

                        <div className="bg-red-400/10 border border-red-400/20 p-3 rounded-lg flex items-start gap-3">
                          <AlertTriangle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
                          <div>
                            <p className="text-xs font-semibold text-red-400 mb-1">
                              Scheduled Maintenance Required
                            </p>
                            <p className="text-[10px] text-white/70 leading-relaxed">
                              Port Engine (L) lifecycle is below 15% threshold.
                              Aether maintenance engineers dispatched for
                              arrival at {flight.to}.
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>

          {/* Map Placeholder & Telemetry */}
          <div className="xl:col-span-2 flex flex-col gap-8">
            <div
              ref={globeContainerRef}
              className="bg-aether-navy border border-aether-glass-border rounded-xl h-[400px] relative overflow-hidden flex items-center justify-center cursor-move"
            >
              {dimensions.width > 0 && (
                <div className="absolute inset-0 z-0">
                  <Globe
                    ref={globeRef}
                    width={dimensions.width}
                    height={dimensions.height}
                    globeImageUrl="https://unpkg.com/three-globe/example/img/earth-dark.jpg"
                    backgroundColor="rgba(0,0,0,0)"
                    arcsData={arcsData}
                    arcStartLat={(d: any) => d.startLat}
                    arcStartLng={(d: any) => d.startLng}
                    arcEndLat={(d: any) => d.endLat}
                    arcEndLng={(d: any) => d.endLng}
                    arcColor={(d: any) =>
                      selectedFlightId
                        ? selectedFlightId === d.id
                          ? "#D4C5B9"
                          : "rgba(255,255,255,0.1)"
                        : d.color
                    }
                    arcDashLength={0.4}
                    arcDashGap={0.2}
                    arcDashAnimateTime={1500}
                    arcAltitudeAutoScale={0.3}
                    arcStroke={(d: any) =>
                      selectedFlightId === d.id ? 1.5 : 1
                    }
                    onArcClick={(d: any) => handleFlightClick(d.id)}
                    onGlobeClick={() => handleFlightClick(null)}
                    pathsData={showWeather ? windPaths : []}
                    pathPoints={(d: any) => d.path}
                    pathPointLat={(p: any) => p[0]}
                    pathPointLng={(p: any) => p[1]}
                    pathPointAlt={(p: any) => p[2]}
                    pathColor={(d: any) => d.color}
                    pathDashLength={0.05}
                    pathDashGap={0.1}
                    pathDashAnimateTime={4000}
                    pathStroke={0.5}
                    labelsData={airportsData}
                    labelLat={(d: any) => d.lat}
                    labelLng={(d: any) => d.lng}
                    labelText={(d: any) => d.name}
                    labelSize={1.2}
                    labelDotRadius={0.5}
                    labelColor={() => "rgba(255,255,255,0.7)"}
                    labelResolution={2}
                    htmlElementsData={planeData}
                    htmlElement={(d: any) => {
                      const el = document.createElement("div");
                      const isSelected = selectedFlightId === d.id;
                      const opacity = selectedFlightId && !isSelected ? 0.3 : 1;
                      el.innerHTML = `
                      <div style="background-color: rgba(5,5,7,0.9); border: 1px solid ${isSelected ? "#FFFFFF" : d.color}66; padding: 4px 8px; border-radius: 6px; display: flex; align-items: center; gap: 8px; cursor: pointer; transition: all 0.3s ease; transform: translate(-50%, -50%); opacity: ${opacity};">
                         <div style="width: 8px; height: 8px; border-radius: 50%; position: relative;">
                            <div style="position: absolute; inset: 0; border-radius: 50%; background-color: ${isSelected ? "#FFFFFF" : d.color}; opacity: 0.7; animation: ping 1s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>
                            <div style="position: relative; width: 100%; height: 100%; border-radius: 50%; background-color: ${isSelected ? "#FFFFFF" : d.color};"></div>
                         </div>
                         <span style="font-size: 10px; font-family: 'JetBrains Mono', monospace; font-weight: 500; color: white;">${d.id.toUpperCase()}</span>
                      </div>
                    `;
                      el.style.pointerEvents = "auto";
                      el.onclick = () =>
                        window.dispatchEvent(
                          new CustomEvent("selectFlight", { detail: d.id }),
                        );
                      el.onmouseenter = () =>
                        el.firstElementChild!.setAttribute(
                          "style",
                          `background-color: rgba(17,18,22,1); border: 1px solid ${isSelected ? "#FFFFFF" : d.color}; padding: 4px 8px; border-radius: 6px; display: flex; align-items: center; gap: 8px; cursor: pointer; transition: all 0.3s ease; transform: translate(-50%, -50%); opacity: ${opacity};`,
                        );
                      el.onmouseleave = () =>
                        el.firstElementChild!.setAttribute(
                          "style",
                          `background-color: rgba(5,5,7,0.9); border: 1px solid ${isSelected ? "#FFFFFF" : d.color}66; padding: 4px 8px; border-radius: 6px; display: flex; align-items: center; gap: 8px; cursor: pointer; transition: all 0.3s ease; transform: translate(-50%, -50%); opacity: ${opacity};`,
                        );
                      return el;
                    }}
                  />
                </div>
              )}

              <div className="absolute top-4 left-4 z-10 bg-aether-black/70 backdrop-blur-md px-3 py-2 rounded-lg border border-aether-glass-border pointer-events-none">
                <p className="text-xs font-semibold text-aether-gold uppercase tracking-widest flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-aether-gold animate-pulse" />{" "}
                  Live Telemetry Activated
                </p>
              </div>

              <div className="absolute top-4 right-4 z-10">
                <button
                  onClick={() => setShowWeather(!showWeather)}
                  className={`px-4 py-2 rounded-lg text-xs font-semibold uppercase tracking-widest border transition-colors flex items-center gap-2 ${
                    showWeather
                      ? "bg-aether-gold text-aether-black border-aether-gold"
                      : "bg-aether-black/70 text-aether-steel border-aether-glass-border hover:text-aether-cloud backdrop-blur-md"
                  }`}
                >
                  <CloudLightning className="w-4 h-4" />
                  {showWeather
                    ? "Weather Overlay Active"
                    : "Enable Weather Overlay"}
                </button>
              </div>

              <div className="absolute bottom-4 right-4 z-10 bg-aether-black/70 backdrop-blur-md p-3 rounded-lg border border-aether-glass-border w-56">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs font-semibold uppercase tracking-widest text-aether-steel flex items-center gap-2">
                    <Satellite className="w-3 h-3" /> Link
                  </span>
                  <span
                    className={`text-xs font-mono font-medium ${signalStrength < 40 ? "text-red-400" : "text-aether-gold"}`}
                  >
                    {isReconnecting
                      ? "RECONNECTING..."
                      : `${Math.round(signalStrength)}%`}
                  </span>
                </div>
                <div className="flex items-end gap-1 h-6 mb-3">
                  {[1, 2, 3, 4, 5].map((bar) => {
                    const threshold = bar * 20;
                    const isActive = signalStrength >= threshold - 10;
                    const height = `${20 + bar * 16}%`;

                    return (
                      <motion.div
                        key={bar}
                        animate={{
                          opacity: isReconnecting
                            ? [0.2, 1, 0.2]
                            : isActive
                              ? 1
                              : 0.2,
                        }}
                        transition={{
                          repeat: isReconnecting ? Infinity : 0,
                          duration: 1,
                          delay: bar * 0.1,
                        }}
                        className={`flex-1 rounded-sm ${isActive ? "bg-aether-gold" : "bg-aether-steel/30"}`}
                        style={{ height }}
                      />
                    );
                  })}
                </div>
                <button
                  onClick={handleReconnect}
                  disabled={isReconnecting}
                  className="w-full py-1.5 text-[10px] uppercase tracking-widest font-semibold border border-aether-glass-border rounded bg-aether-navy text-aether-cloud hover:bg-aether-gold hover:text-aether-black transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isReconnecting ? "Acquiring Signal..." : "Reset Connection"}
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {selectedFlightId &&
              (realTimeMeteo || meteoData[selectedFlightId])
                ? (realTimeMeteo || meteoData[selectedFlightId]).map(
                    (stat: any, idx: number) => (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        key={`meteo-${selectedFlightId}-${idx}`}
                        className="bg-aether-glass border border-aether-gold/30 p-4 rounded-xl flex items-start gap-4"
                      >
                        <div className="p-2 bg-aether-navy rounded-lg border border-aether-gold/20">
                          <stat.icon className="w-5 h-5 text-aether-gold" />
                        </div>
                        <div>
                          <p className="text-xs text-aether-steel mb-1">
                            {stat.label}
                          </p>
                          <p className="text-lg font-medium text-aether-cloud">
                            {stat.value}
                          </p>
                        </div>
                      </motion.div>
                    ),
                  )
                : [
                    {
                      label: "Fleet Altitude (Avg)",
                      value: "41,000 ft",
                      icon: Navigation,
                    },
                    {
                      label: "Ground Speed (Avg)",
                      value: "520 kts",
                      icon: Wind,
                    },
                    {
                      label: "Fuel Reserved",
                      value: "42,500 lbs",
                      icon: Droplets,
                    },
                    {
                      label: "System Status",
                      value: "Optimal",
                      icon: BatteryCharging,
                    },
                  ].map((stat, idx) => (
                    <div
                      key={idx}
                      className="bg-aether-glass border border-aether-glass-border p-4 rounded-xl flex items-start gap-4"
                    >
                      <div className="p-2 bg-aether-navy rounded-lg">
                        <stat.icon className="w-5 h-5 text-aether-steel" />
                      </div>
                      <div>
                        <p className="text-xs text-aether-steel mb-1">
                          {stat.label}
                        </p>
                        <p className="text-lg font-medium text-aether-cloud">
                          {stat.value}
                        </p>
                      </div>
                    </div>
                  ))}
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
}
