import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { fleet } from "./data";
import InteriorConfigurator from "./InteriorConfigurator";
import {
  Users,
  Gauge,
  Move,
  X,
  ChevronRight,
  CheckSquare,
  Square,
  BarChart2,
} from "lucide-react";
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip as RechartsTooltip,
  Legend,
} from "recharts";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Environment, ContactShadows } from "@react-three/drei";
import * as THREE from "three";
import { useCurrency } from "./CurrencyContext";

function StylizedJet({ color = "#FAFAFA" }: { color?: string }) {
  const group = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (group.current) {
      group.current.position.y = Math.sin(state.clock.elapsedTime * 2) * 0.05;
    }
  });

  const material = new THREE.MeshStandardMaterial({
    color,
    metalness: 0.6,
    roughness: 0.3,
  });
  const windowMaterial = new THREE.MeshStandardMaterial({
    color: "#111216",
    metalness: 0.9,
    roughness: 0.1,
  });

  return (
    <group ref={group} dispose={null} scale={1.2}>
      {/* Fuselage body */}
      <mesh material={material} rotation={[0, 0, -Math.PI / 2]}>
        <capsuleGeometry args={[0.3, 3, 16, 32]} />
      </mesh>

      {/* Cockpit */}
      <mesh
        material={windowMaterial}
        position={[1.4, 0.12, 0]}
        rotation={[0, 0, -Math.PI / 4]}
      >
        <cylinderGeometry args={[0.2, 0.28, 0.6, 16]} />
      </mesh>

      {/* Wings */}
      <mesh material={material} position={[-0.2, 0, 0]}>
        <boxGeometry args={[1.0, 0.04, 3.2]} />
      </mesh>

      {/* Tail (Vertical Stabilizer) */}
      <mesh
        material={material}
        position={[-1.5, 0.35, 0]}
        rotation={[0, 0, -0.4]}
      >
        <boxGeometry args={[0.4, 0.8, 0.04]} />
      </mesh>

      {/* Horizontal Stabilizers */}
      <mesh material={material} position={[-1.6, 0.7, 0]}>
        <boxGeometry args={[0.3, 0.04, 1.2]} />
      </mesh>

      {/* Engines */}
      <mesh material={material} position={[-1.1, 0.15, 0.5]}>
        <cylinderGeometry args={[0.15, 0.15, 0.6, 16]} />
      </mesh>
      <mesh
        material={windowMaterial}
        position={[-0.8, 0.15, 0.5]}
        rotation={[0, 0, Math.PI / 2]}
      >
        <cylinderGeometry args={[0.13, 0.13, 0.05, 16]} />
      </mesh>

      <mesh material={material} position={[-1.1, 0.15, -0.5]}>
        <cylinderGeometry args={[0.15, 0.15, 0.6, 16]} />
      </mesh>
      <mesh
        material={windowMaterial}
        position={[-0.8, 0.15, -0.5]}
        rotation={[0, 0, Math.PI / 2]}
      >
        <cylinderGeometry args={[0.13, 0.13, 0.05, 16]} />
      </mesh>
    </group>
  );
}

export default function FleetExplorer() {
  const [selectedAircraft, setSelectedAircraft] = useState<any | null>(null);
  const [compareList, setCompareList] = useState<any[]>([]);
  const [showCompare, setShowCompare] = useState(false);
  const { formatPrice } = useCurrency();

  const toggleCompare = (e: React.MouseEvent, aircraft: any) => {
    e.stopPropagation();
    if (compareList.find((a) => a.id === aircraft.id)) {
      setCompareList(compareList.filter((a) => a.id !== aircraft.id));
    } else if (compareList.length < 2) {
      setCompareList([...compareList, aircraft]);
    }
  };

  return (
    <div className="p-8 pb-32">
      <header className="mb-10">
        <h1 className="text-4xl font-serif text-aether-cloud mb-2">
          Fleet Discovery
        </h1>
        <p className="text-aether-steel">
          Explore our meticulously maintained collection of private aircraft.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {fleet.map((aircraft, idx) => (
          <motion.div
            key={aircraft.id}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.15 }}
            onClick={() => setSelectedAircraft(aircraft)}
            className="group relative rounded-2xl overflow-hidden bg-aether-navy border border-aether-glass-border hover:border-aether-gold/50 cursor-pointer transition-all duration-500"
          >
            <div className="h-64 overflow-hidden relative">
              <div className="absolute inset-0 bg-gradient-to-t from-aether-navy via-transparent to-transparent z-10" />
              <img
                src={aircraft.image}
                alt={aircraft.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute top-4 left-4 z-20">
                <span className="px-3 py-1 bg-aether-black/70 backdrop-blur-md text-xs font-semibold uppercase tracking-wider text-cloud rounded-md border border-aether-glass-border">
                  {aircraft.class}
                </span>
              </div>
              <div className="absolute top-4 right-4 z-20">
                <button
                  onClick={(e) => toggleCompare(e, aircraft)}
                  className="w-10 h-10 rounded-full bg-aether-black/70 backdrop-blur-md border border-aether-glass-border flex items-center justify-center text-aether-cloud hover:bg-aether-gold flex-shrink-0 transition-colors"
                >
                  {compareList.find((a) => a.id === aircraft.id) ? (
                    <CheckSquare className="w-5 h-5 text-aether-gold" />
                  ) : (
                    <Square className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            <div className="p-6 relative z-20 bg-aether-navy">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-2xl font-serif text-aether-cloud mb-1">
                    {aircraft.name}
                  </h2>
                  <p className="text-sm text-aether-gold font-medium">
                    From {formatPrice(aircraft.hourlyRate)} / hr
                  </p>
                </div>
                <div className="w-10 h-10 rounded-full border border-aether-glass-border flex items-center justify-center group-hover:bg-aether-gold group-hover:text-aether-black transition-colors">
                  <ChevronRight className="w-5 h-5" />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2 text-aether-steel">
                    <Users className="w-4 h-4" />{" "}
                    <span className="text-xs uppercase">Seats</span>
                  </div>
                  <span className="font-medium">{aircraft.seats} Pax</span>
                </div>
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2 text-aether-steel">
                    <Move className="w-4 h-4" />{" "}
                    <span className="text-xs uppercase">Range</span>
                  </div>
                  <span className="font-medium">
                    {aircraft.rangeKm.toLocaleString()} km
                  </span>
                </div>
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2 text-aether-steel">
                    <Gauge className="w-4 h-4" />{" "}
                    <span className="text-xs uppercase">Speed</span>
                  </div>
                  <span className="font-medium">Mach {aircraft.speedMach}</span>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {compareList.length > 0 && !showCompare && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-8 left-1/2 -translate-x-1/2 z-40 bg-aether-navy border border-aether-glass-border shadow-2xl px-6 py-4 rounded-full flex items-center gap-6"
          >
            <div className="flex -space-x-4">
              {compareList.map((ac) => (
                <img
                  key={ac.id}
                  src={ac.image}
                  alt={ac.name}
                  className="w-12 h-12 rounded-full object-cover border-2 border-aether-navy"
                />
              ))}
            </div>
            <div>
              <p className="text-sm text-aether-steel font-medium">
                {compareList.length}/2 Selected
              </p>
              <p className="text-aether-cloud font-serif">Compare Fleet</p>
            </div>
            <button
              onClick={() => {
                if (compareList.length === 2) setShowCompare(true);
              }}
              disabled={compareList.length < 2}
              className={`px-6 py-2 rounded-full font-medium transition-colors ml-4 flex items-center gap-2 ${
                compareList.length === 2
                  ? "bg-aether-gold text-aether-black hover:bg-white"
                  : "bg-aether-glass border border-white/5 text-aether-steel cursor-not-allowed"
              }`}
            >
              <BarChart2 className="w-4 h-4" /> Compare Specifications
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showCompare && compareList.length === 2 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="w-full max-w-6xl h-[85vh] bg-[#111216] border border-white/10 rounded-2xl overflow-hidden flex flex-col relative"
            >
              <div className="absolute top-0 left-0 w-full h-16 border-b border-white/10 flex items-center justify-between px-6 z-20 bg-[#111216]/80 backdrop-blur-md">
                <h3 className="text-xl font-serif text-aether-cloud flex items-center gap-3">
                  <BarChart2 className="w-5 h-5 text-aether-gold" /> Split-View
                  Comparison
                </h3>
                <button
                  onClick={() => setShowCompare(false)}
                  className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center hover:bg-white hover:text-black transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="flex-1 flex overflow-hidden pt-16">
                {/* Left Panel - AC 1 */}
                <div className="flex-1 flex flex-col border-r border-white/10 overflow-y-auto">
                  <div className="h-64 relative border-b border-white/10 flex-shrink-0">
                    <img
                      src={compareList[0].image}
                      alt={compareList[0].name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#111216] via-transparent to-transparent" />
                    <div className="absolute bottom-6 left-6">
                      <p className="text-xs font-semibold uppercase tracking-wider text-aether-gold mb-1">
                        {compareList[0].class}
                      </p>
                      <h2 className="text-3xl font-serif text-white">
                        {compareList[0].name}
                      </h2>
                    </div>
                  </div>

                  <div className="p-6">
                    <div className="grid grid-cols-2 gap-6 mb-8">
                      <div>
                        <p className="text-[#8E95A3] text-sm mb-1 uppercase tracking-wider text-xs">
                          Hourly Rate
                        </p>
                        <p className="text-xl font-serif text-[#FAFAFA]">
                          {formatPrice(compareList[0].hourlyRate)}
                        </p>
                      </div>
                      <div>
                        <p className="text-[#8E95A3] text-sm mb-1 uppercase tracking-wider text-xs">
                          Capacity
                        </p>
                        <p className="text-xl font-serif text-[#FAFAFA]">
                          {compareList[0].seats} Pax
                        </p>
                      </div>
                      <div>
                        <p className="text-[#8E95A3] text-sm mb-1 uppercase tracking-wider text-xs">
                          Range
                        </p>
                        <p className="text-xl font-serif text-[#FAFAFA]">
                          {compareList[0].rangeKm.toLocaleString()} km
                        </p>
                      </div>
                      <div>
                        <p className="text-[#8E95A3] text-sm mb-1 uppercase tracking-wider text-xs">
                          Top Speed
                        </p>
                        <p className="text-xl font-serif text-[#FAFAFA]">
                          Mach {compareList[0].speedMach}
                        </p>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-white/5">
                      <p className="text-[#8E95A3] text-sm mb-4 uppercase tracking-wider text-xs">
                        Luxury Specs & Features
                      </p>
                      <ul className="space-y-3">
                        {compareList[0].features.map((f: string, i: number) => (
                          <li
                            key={i}
                            className="text-sm text-[#D4C5B9] flex items-center gap-2"
                          >
                            <span className="w-1.5 h-1.5 rounded-full bg-aether-gold/50" />{" "}
                            {f}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Center Panel - Radar Chart */}
                <div className="flex-1 flex flex-col items-center justify-center p-8 bg-gradient-to-b from-[#111216] to-[#0a0a0c] relative">
                  <h4 className="absolute top-8 text-center text-aether-steel font-serif text-lg tracking-wide">
                    Performance Index
                  </h4>

                  <div className="w-full h-[400px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <RadarChart
                        cx="50%"
                        cy="50%"
                        outerRadius="70%"
                        data={[
                          {
                            subject: "Range",
                            A: (compareList[0].rangeKm / 15000) * 100,
                            B: (compareList[1].rangeKm / 15000) * 100,
                            fullMark: 100,
                          },
                          {
                            subject: "Speed",
                            A: (compareList[0].speedMach / 1.0) * 100,
                            B: (compareList[1].speedMach / 1.0) * 100,
                            fullMark: 100,
                          },
                          {
                            subject: "Capacity",
                            A: (compareList[0].seats / 24) * 100,
                            B: (compareList[1].seats / 24) * 100,
                            fullMark: 100,
                          },
                          {
                            subject: "Luxury / Amenities",
                            A: (compareList[0].features.length / 8) * 100,
                            B: (compareList[1].features.length / 8) * 100,
                            fullMark: 100,
                          },
                          {
                            subject: "Cost Efficiency",
                            A: (1 - compareList[0].hourlyRate / 20000) * 100,
                            B: (1 - compareList[1].hourlyRate / 20000) * 100,
                            fullMark: 100,
                          },
                        ]}
                      >
                        <PolarGrid stroke="#D4C5B940" />
                        <PolarAngleAxis
                          dataKey="subject"
                          tick={{
                            fill: "#8E95A3",
                            fontSize: 12,
                            fontFamily: "serif",
                          }}
                        />
                        <PolarRadiusAxis
                          angle={30}
                          domain={[0, 100]}
                          tick={false}
                          axisLine={false}
                        />
                        <Radar
                          name={compareList[0].name}
                          dataKey="A"
                          stroke="#D4C5B9"
                          fill="#D4C5B9"
                          fillOpacity={0.3}
                        />
                        <Radar
                          name={compareList[1].name}
                          dataKey="B"
                          stroke="#4ade80"
                          fill="#4ade80"
                          fillOpacity={0.3}
                        />
                        <Legend
                          wrapperStyle={{
                            paddingTop: "20px",
                            fontFamily: "serif",
                            color: "#FAFAFA",
                          }}
                        />
                        <RechartsTooltip
                          contentStyle={{
                            backgroundColor: "#111216",
                            border: "1px solid #D4C5B940",
                            borderRadius: "8px",
                          }}
                          itemStyle={{ fontFamily: "mono", fontSize: "12px" }}
                          formatter={(value: any, name: any) => [
                            `${Math.round(value)} Pts`,
                            name,
                          ]}
                        />
                      </RadarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Right Panel - AC 2 */}
                <div className="flex-1 flex flex-col border-l border-white/10 overflow-y-auto">
                  <div className="h-64 relative border-b border-white/10 flex-shrink-0">
                    <img
                      src={compareList[1].image}
                      alt={compareList[1].name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#111216] via-transparent to-transparent" />
                    <div className="absolute bottom-6 left-6">
                      <p className="text-xs font-semibold uppercase tracking-wider text-[#4ade80] mb-1">
                        {compareList[1].class}
                      </p>
                      <h2 className="text-3xl font-serif text-white">
                        {compareList[1].name}
                      </h2>
                    </div>
                  </div>

                  <div className="p-6">
                    <div className="grid grid-cols-2 gap-6 mb-8">
                      <div>
                        <p className="text-[#8E95A3] text-sm mb-1 uppercase tracking-wider text-xs">
                          Hourly Rate
                        </p>
                        <p className="text-xl font-serif text-[#FAFAFA]">
                          {formatPrice(compareList[1].hourlyRate)}
                        </p>
                      </div>
                      <div>
                        <p className="text-[#8E95A3] text-sm mb-1 uppercase tracking-wider text-xs">
                          Capacity
                        </p>
                        <p className="text-xl font-serif text-[#FAFAFA]">
                          {compareList[1].seats} Pax
                        </p>
                      </div>
                      <div>
                        <p className="text-[#8E95A3] text-sm mb-1 uppercase tracking-wider text-xs">
                          Range
                        </p>
                        <p className="text-xl font-serif text-[#FAFAFA]">
                          {compareList[1].rangeKm.toLocaleString()} km
                        </p>
                      </div>
                      <div>
                        <p className="text-[#8E95A3] text-sm mb-1 uppercase tracking-wider text-xs">
                          Top Speed
                        </p>
                        <p className="text-xl font-serif text-[#FAFAFA]">
                          Mach {compareList[1].speedMach}
                        </p>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-white/5">
                      <p className="text-[#8E95A3] text-sm mb-4 uppercase tracking-wider text-xs">
                        Luxury Specs & Features
                      </p>
                      <ul className="space-y-3">
                        {compareList[1].features.map((f: string, i: number) => (
                          <li
                            key={i}
                            className="text-sm text-[#D4C5B9] flex items-center gap-2"
                          >
                            <span className="w-1.5 h-1.5 rounded-full bg-[#4ade80]/50" />{" "}
                            {f}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {selectedAircraft && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="w-full max-w-6xl h-[85vh] bg-[#111216] border border-white/10 rounded-2xl overflow-hidden flex flex-col relative"
            >
              <button
                onClick={() => setSelectedAircraft(null)}
                className="absolute top-6 right-6 z-20 w-10 h-10 rounded-full bg-black/40 border border-white/10 flex items-center justify-center hover:bg-white inset-0 hover:text-black transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              {/* 3D Viewer Section */}
              <div className="w-full h-3/5 bg-gradient-to-b from-[#1a1c23] to-[#111216] relative">
                <Canvas camera={{ position: [5, 2, 5], fov: 45 }}>
                  <color attach="background" args={["#111216"]} />
                  <ambientLight intensity={0.5} />
                  <spotLight
                    position={[10, 10, 10]}
                    angle={0.15}
                    penumbra={1}
                    intensity={1}
                    castShadow
                  />
                  <Environment preset="city" />

                  <StylizedJet
                    color={selectedAircraft.id === "a2" ? "#D4C5B9" : "#FAFAFA"}
                  />

                  <ContactShadows
                    position={[0, -1.5, 0]}
                    opacity={0.4}
                    scale={10}
                    blur={2}
                    far={4}
                  />
                  <OrbitControls
                    enableZoom={true}
                    enablePan={false}
                    minPolarAngle={Math.PI / 4}
                    maxPolarAngle={Math.PI / 2.1}
                    autoRotate
                    autoRotateSpeed={1}
                  />
                </Canvas>

                <InteriorConfigurator aircraftName={selectedAircraft.name} />

                <div className="absolute bottom-6 left-8 z-30 pointer-events-none">
                  <span className="px-3 py-1 bg-white/10 backdrop-blur text-xs font-semibold uppercase tracking-wider text-white rounded border border-white/10 mb-3 inline-block">
                    {selectedAircraft.class}
                  </span>
                  <h2 className="text-4xl font-serif text-white">
                    {selectedAircraft.name}
                  </h2>
                </div>
              </div>

              {/* Details Section */}
              <div className="w-full h-2/5 p-8 bg-[#111216] flex flex-col lg:flex-row gap-12 overflow-y-auto">
                <div className="flex-1">
                  <p className="text-aether-steel font-medium tracking-wide uppercase text-xs mb-4">
                    Performance Metrics
                  </p>
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <p className="text-[#8E95A3] text-sm mb-1">
                        Max Passenger Capacity
                      </p>
                      <p className="text-2xl font-serif">
                        {selectedAircraft.seats}{" "}
                        <span className="text-sm font-sans text-[#8E95A3]">
                          Pax
                        </span>
                      </p>
                    </div>
                    <div>
                      <p className="text-[#8E95A3] text-sm mb-1">Max Range</p>
                      <p className="text-2xl font-serif">
                        {selectedAircraft.rangeKm.toLocaleString()}{" "}
                        <span className="text-sm font-sans text-[#8E95A3]">
                          km
                        </span>
                      </p>
                    </div>
                    <div>
                      <p className="text-[#8E95A3] text-sm mb-1">Top Speed</p>
                      <p className="text-2xl font-serif">
                        Mach {selectedAircraft.speedMach}
                      </p>
                    </div>
                    <div>
                      <p className="text-[#8E95A3] text-sm mb-1">
                        Charter Rate
                      </p>
                      <p className="text-2xl font-serif">
                        {formatPrice(selectedAircraft.hourlyRate)}{" "}
                        <span className="text-sm font-sans text-[#8E95A3]">
                          / hr
                        </span>
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex-1">
                  <p className="text-aether-steel font-medium tracking-wide uppercase text-xs mb-4">
                    Signature Amenities
                  </p>
                  <div className="flex flex-wrap gap-2 mb-8">
                    {selectedAircraft.features.map(
                      (feature: string, idx: number) => (
                        <span
                          key={idx}
                          className="text-sm px-4 py-2 bg-white/5 rounded text-white border border-white/5"
                        >
                          {feature}
                        </span>
                      ),
                    )}
                  </div>

                  <button className="w-full py-4 bg-[#D4C5B9] text-black font-semibold rounded hover:bg-white transition-colors">
                    Request Charter
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
