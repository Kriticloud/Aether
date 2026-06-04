import React from "react";
import { Shield } from "lucide-react";
import { triggerHaptic } from "./haptics";

const ACTIVITY_LOG = [
  {
    id: 1,
    type: "FaceID",
    status: "success",
    device: "iPhone 15 Pro",
    os: "iOS 17.4.1",
    browser: "Aether Native App",
    location: "London, GB",
    coordinates: "51.5074° N, 0.1278° W",
    ip: "192.168.1.10",
    asn: "AS7922 Comcast Cable",
    time: "Oct 28, 2026, 14:22:04 UTC",
    relativeTime: "2 mins ago",
    active: true,
  },
  {
    id: 2,
    type: "TouchID",
    status: "success",
    device: 'MacBook Pro 16"',
    os: "macOS 14.3",
    browser: "Chrome 124.0.0",
    location: "London, GB",
    coordinates: "51.5080° N, 0.1281° W",
    ip: "192.168.1.10",
    asn: "AS7922 Comcast Cable",
    time: "Oct 28, 2026, 09:15:32 UTC",
    relativeTime: "5 hours ago",
    active: false,
  },
  {
    id: 3,
    type: "Passcode",
    status: "failed",
    device: "Unknown Device",
    os: "Windows 11",
    browser: "Firefox 125.0",
    location: "Moscow, RU",
    coordinates: "55.7558° N, 37.6173° E",
    ip: "146.120.4.15",
    asn: "AS8359 MTS PJSC",
    time: "Oct 26, 2026, 22:11:09 UTC",
    relativeTime: "2 days ago",
    active: false,
  },
  {
    id: 4,
    type: "FaceID",
    status: "success",
    device: "iPhone 15 Pro",
    os: "iOS 17.4.1",
    browser: "Aether Native App",
    location: "New York, US",
    coordinates: "40.7128° N, 74.0060° W",
    ip: "10.0.0.42",
    asn: "AS701 Verizon",
    time: "Oct 21, 2026, 08:05:22 UTC",
    relativeTime: "1 week ago",
    active: false,
  },
];

export default function AccessActivityLog() {
  const handleRevoke = (id: number) => {
    triggerHaptic("heavy");
    alert("Session ID " + id + " revoked.");
  };

  return (
    <div className="bg-aether-navy border border-aether-glass-border p-8 rounded-2xl overflow-hidden">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h3 className="text-xl font-serif flex items-center gap-2">
            <Shield className="w-5 h-5 text-aether-gold" /> Security Audit
          </h3>
          <p className="text-sm text-aether-steel mt-1">
            Immutable access log of all biometric authentications.
          </p>
        </div>
        <button className="text-xs uppercase tracking-widest text-[#FAFAFA] bg-white/5 px-4 py-2 border border-white/10 rounded-lg hover:border-aether-gold transition-colors block w-max">
          Export CSV
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse whitespace-nowrap">
          <thead>
            <tr className="border-b border-white/10 text-xs uppercase tracking-widest text-aether-steel">
              <th className="pb-3 pr-4 font-semibold">Status</th>
              <th className="pb-3 px-4 font-semibold">Timestamp (UTC)</th>
              <th className="pb-3 px-4 font-semibold">Method</th>
              <th className="pb-3 px-4 font-semibold">Device ID / OS</th>
              <th className="pb-3 px-4 font-semibold">Location</th>
              <th className="pb-3 px-4 font-semibold">IP Address</th>
              <th className="pb-3 pl-4 font-semibold text-right">Action</th>
            </tr>
          </thead>
          <tbody className="text-sm">
            {ACTIVITY_LOG.map((log) => (
              <tr
                key={log.id}
                className="border-b border-white/5 hover:bg-white/5 transition-colors group"
              >
                <td className="py-4 pr-4">
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-2 h-2 rounded-full ${log.status === "success" ? "bg-[#4ade80]" : "bg-red-500"}`}
                    />
                    <span
                      className={
                        log.status === "success"
                          ? "text-[#4ade80]"
                          : "text-red-500"
                      }
                    >
                      {log.status === "success" ? "Granted" : "Denied"}
                    </span>
                    {log.active && (
                      <span className="ml-2 text-[9px] uppercase tracking-widest text-[#4ade80] bg-[#4ade80]/10 border border-[#4ade80]/20 px-1.5 py-0.5 rounded">
                        Active
                      </span>
                    )}
                  </div>
                </td>
                <td className="py-4 px-4 font-mono text-xs text-white/80">
                  {log.time}
                </td>
                <td className="py-4 px-4">{log.type}</td>
                <td className="py-4 px-4">
                  <div className="flex flex-col">
                    <span className="text-white">{log.device}</span>
                    <span className="text-xs text-aether-steel">{log.os}</span>
                  </div>
                </td>
                <td className="py-4 px-4">
                  <div className="flex flex-col">
                    <span className="text-white">{log.location}</span>
                    <span className="text-xs text-aether-steel font-mono">
                      {log.coordinates}
                    </span>
                  </div>
                </td>
                <td className="py-4 px-4 font-mono text-xs text-aether-steel">
                  {log.ip}
                </td>
                <td className="py-4 pl-4 text-right">
                  {log.active ? (
                    <span className="text-xs text-aether-steel">Current</span>
                  ) : (
                    <button
                      onClick={() => handleRevoke(log.id)}
                      className="text-xs font-semibold uppercase tracking-widest text-red-500 hover:text-white transition-colors opacity-0 group-hover:opacity-100"
                    >
                      Revoke
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
