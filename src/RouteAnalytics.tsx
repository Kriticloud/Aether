import React from "react";
import { motion } from "motion/react";
import { analyticsData } from "./data";
import { useCurrency } from "./CurrencyContext";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";
import { TrendingUp, Award, Clock, DollarSign } from "lucide-react";

export default function RouteAnalytics() {
  const { formatPrice } = useCurrency();

  return (
    <div className="p-8 pb-32">
      <header className="mb-10">
        <h1 className="text-4xl font-serif text-aether-cloud mb-2">
          Analytics & Usage
        </h1>
        <p className="text-aether-steel">
          Financial overview and flight hours telemetry.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {[
          {
            label: "Total Spend (YTD)",
            value: formatPrice(740000),
            icon: DollarSign,
            trend: "+12%",
          },
          { label: "Flight Hours", value: "142.5h", icon: Clock, trend: "+5%" },
          {
            label: "Carbon Offset",
            value: "100%",
            icon: Award,
            trend: "Net Zero",
          },
          {
            label: "Cost per Hour",
            value: formatPrice(8250),
            icon: TrendingUp,
            trend: "-2%",
          },
        ].map((stat, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="bg-aether-glass border border-aether-glass-border p-6 rounded-xl relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <stat.icon className="w-16 h-16" />
            </div>
            <div className="flex items-center justify-between mb-4">
              <p className="text-xs font-medium text-aether-steel tracking-wider uppercase">
                {stat.label}
              </p>
              <span className="text-[10px] font-bold px-2 py-1 bg-white/5 text-aether-gold rounded">
                {stat.trend}
              </span>
            </div>
            <p className="text-3xl font-serif text-aether-cloud">
              {stat.value}
            </p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-aether-glass border border-aether-glass-border p-6 rounded-xl">
          <h3 className="text-sm tracking-widest text-aether-steel uppercase mb-6">
            Expenditure Analysis
          </h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={analyticsData}
                margin={{ top: 10, right: 0, left: -20, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="colorSpend" x1="0" y1="0" x2="0" y2="1">
                    <stop
                      offset="5%"
                      stopColor="var(--color-aether-gold)"
                      stopOpacity={0.3}
                    />
                    <stop
                      offset="95%"
                      stopColor="var(--color-aether-gold)"
                      stopOpacity={0}
                    />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="rgba(255,255,255,0.05)"
                  vertical={false}
                />
                <XAxis
                  dataKey="month"
                  stroke="var(--color-aether-steel)"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  stroke="var(--color-aether-steel)"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(val) => {
                    const str = formatPrice(val);
                    return str.replace(/,\d{3}$/, 'k').replace(/,\d{3}k$/, 'm');
                  }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "var(--color-aether-navy)",
                    borderColor: "var(--color-aether-glass-border)",
                  }}
                  itemStyle={{ color: "var(--color-aether-gold)" }}
                  formatter={(val: number) => [formatPrice(val), "Spend"]}
                />
                <Area
                  type="monotone"
                  dataKey="spend"
                  stroke="var(--color-aether-gold)"
                  fillOpacity={1}
                  fill="url(#colorSpend)"
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-aether-glass border border-aether-glass-border p-6 rounded-xl">
          <h3 className="text-sm tracking-widest text-aether-steel uppercase mb-6">
            Flight Volume
          </h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={analyticsData}
                margin={{ top: 10, right: 0, left: -20, bottom: 0 }}
                barSize={32}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="rgba(255,255,255,0.05)"
                  vertical={false}
                />
                <XAxis
                  dataKey="month"
                  stroke="var(--color-aether-steel)"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  stroke="var(--color-aether-steel)"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip
                  cursor={{ fill: "rgba(255,255,255,0.05)" }}
                  contentStyle={{
                    backgroundColor: "var(--color-aether-navy)",
                    borderColor: "var(--color-aether-glass-border)",
                  }}
                  itemStyle={{ color: "#fff" }}
                />
                <Bar
                  dataKey="flights"
                  fill="var(--color-aether-steel)"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="mt-8">
        <CarbonImpactWidget />
      </div>
    </div>
  );
}

function CarbonImpactWidget() {
  const [distance, setDistance] = React.useState(3400); // km
  const [duration, setDuration] = React.useState(6.5); // hours
  const [offsetPercentage, setOffsetPercentage] = React.useState(0);
  const [isOffsetting, setIsOffsetting] = React.useState(false);

  // Simple theoretical calculation: ~250kg per hour or base it on distance
  const carbonEmissions = Math.floor(distance * 0.12 + duration * 150);
  const currentOffset = Math.floor((carbonEmissions * offsetPercentage) / 100);
  const netEmissions = carbonEmissions - currentOffset;

  const handleOffset = () => {
    setIsOffsetting(true);
    let current = offsetPercentage;
    const interval = setInterval(() => {
      current += 5;
      if (current >= 100) {
        clearInterval(interval);
        setOffsetPercentage(100);
        setIsOffsetting(false);
      } else {
        setOffsetPercentage(current);
      }
    }, 50);
  };

  return (
    <div className="bg-gradient-to-br from-[#080F1F] to-[#050507] border border-aether-glass-border p-8 rounded-xl relative overflow-hidden">
      <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
        <Award className="w-64 h-64" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 relative z-10">
        <div>
          <h3 className="text-xl font-serif text-aether-cloud mb-2">
            Carbon Impact Analysis
          </h3>
          <p className="text-sm text-aether-steel mb-8">
            Dynamic CO2 estimation based on flight telemetry and sustainable
            offset credits.
          </p>

          <div className="space-y-6">
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-xs text-aether-steel uppercase tracking-widest">
                  Flight Distance
                </span>
                <span className="text-sm font-mono text-aether-cloud">
                  {distance} km
                </span>
              </div>
              <input
                type="range"
                min="500"
                max="12000"
                value={distance}
                onChange={(e) => setDistance(Number(e.target.value))}
                className="w-full accent-aether-gold"
              />
            </div>

            <div>
              <div className="flex justify-between mb-2">
                <span className="text-xs text-aether-steel uppercase tracking-widest">
                  Flight Duration
                </span>
                <span className="text-sm font-mono text-aether-cloud">
                  {duration} h
                </span>
              </div>
              <input
                type="range"
                min="1"
                max="16"
                step="0.5"
                value={duration}
                onChange={(e) => setDuration(Number(e.target.value))}
                className="w-full accent-aether-gold"
              />
            </div>
          </div>
        </div>

        <div className="flex flex-col justify-center">
          <div className="bg-aether-glass border border-white/5 p-6 rounded-lg mb-6 flex justify-between items-center text-center">
            <div>
              <p className="text-[10px] uppercase tracking-widest text-aether-steel mb-1">
                Gross Emissions
              </p>
              <p className="text-3xl font-serif">
                {carbonEmissions}{" "}
                <span className="text-sm text-aether-steel">kg</span>
              </p>
            </div>
            <div className="text-aether-steel/30 text-2xl font-light">-</div>
            <div>
              <p className="text-[10px] uppercase tracking-widest text-[#4ade80] mb-1">
                SAF Offset
              </p>
              <p className="text-3xl font-serif text-[#4ade80]">
                {currentOffset} <span className="text-sm">kg</span>
              </p>
            </div>
            <div className="text-aether-steel/30 text-2xl font-light">=</div>
            <div>
              <p className="text-[10px] uppercase tracking-widest text-aether-gold mb-1">
                Net Impact
              </p>
              <p className="text-3xl font-serif text-aether-gold">
                {netEmissions}{" "}
                <span className="text-sm text-aether-steel">kg</span>
              </p>
            </div>
          </div>

          <button
            onClick={handleOffset}
            disabled={offsetPercentage === 100 || isOffsetting}
            className={`w-full py-4 rounded-md font-medium tracking-wide uppercase transition-all duration-300 ${
              offsetPercentage === 100
                ? "bg-[#4ade80]/10 text-[#4ade80] border border-[#4ade80]/20 cursor-not-allowed"
                : "bg-aether-gold text-aether-black hover:bg-white"
            }`}
          >
            {offsetPercentage === 100
              ? "Carbon Neutral Achieved"
              : isOffsetting
                ? "Allocating SAF Credits..."
                : "Offset Remaining Impact via SAF"}
          </button>

          {offsetPercentage > 0 && (
            <div className="mt-4 h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
              <div
                className="h-full bg-[#4ade80] transition-all duration-150"
                style={{ width: `${offsetPercentage}%` }}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
