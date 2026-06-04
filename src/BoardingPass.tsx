import React from "react";
import { Plane, Calendar, Download, Smartphone } from "lucide-react";
import { currentUser, fleet } from "./data";
import { triggerHaptic } from "./haptics";

interface BoardingPassProps {
  from: string;
  to: string;
  date: string;
  aircraftId: string;
  passengers: string;
}

export default function BoardingPass({
  from,
  to,
  date,
  aircraftId,
  passengers,
}: BoardingPassProps) {
  const aircraft = fleet.find((a) => a.id === aircraftId) || fleet[0];
  const displayDate = date
    ? new Date(date).toLocaleDateString("en-US", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : "Oct 24, 2026";

  const downloadFile = (content: BlobPart, filename: string, type: string) => {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExportCalendar = (e: React.MouseEvent) => {
    e.stopPropagation();
    triggerHaptic("medium");
    const startDate = date ? new Date(date) : new Date("2026-10-24");
    startDate.setHours(10, 0, 0, 0);
    const endDate = new Date(startDate);
    endDate.setHours(12, 0, 0, 0);

    const formatDate = (d: Date) => {
      return d.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
    };

    const icsContent = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//Aether Luxury Fleet//Aether Flights//EN",
      "BEGIN:VEVENT",
      `UID:${Math.random().toString(36).substring(2)}@aether.luxury`,
      `DTSTAMP:${formatDate(new Date())}`,
      `DTSTART:${formatDate(startDate)}`,
      `DTEND:${formatDate(endDate)}`,
      `SUMMARY:Aether Flight: ${from || "JFK"} to ${to || "LHR"}`,
      `DESCRIPTION:Private Charter\\nAircraft: ${aircraft.name}\\nClass: ${aircraft.class}\\nPassengers: ${passengers}`,
      "END:VEVENT",
      "END:VCALENDAR",
    ].join("\r\n");

    downloadFile(
      icsContent,
      `Aether-Flight-${from || "JFK"}-${to || "LHR"}.ics`,
      "text/calendar;charset=utf-8",
    );
  };

  const handleExportPDF = (e: React.MouseEvent) => {
    e.stopPropagation();
    triggerHaptic("medium");
    // Using window.print() to allow native PDF saving of the current view,
    // or generating a mock PDF download
    const mockPdfContent =
      "%PDF-1.4\n1 0 obj\n<< /Title (Boarding Pass) >>\nendobj\n%Mock PDF format";
    downloadFile(
      mockPdfContent,
      `Aether-Boarding-Pass-${from || "JFK"}-${to || "LHR"}.pdf`,
      "application/pdf",
    );
  };

  const handleAddToWallet = (e: React.MouseEvent) => {
    e.stopPropagation();
    triggerHaptic("success");
    const mockPkpassContent =
      'PKZip structure mock data... {"passTypeIdentifier": "pass.luxury.aether"}';
    downloadFile(
      mockPkpassContent,
      `Aether-Boarding-Pass.pkpass`,
      "application/vnd.apple.pkpass",
    );
  };

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col md:flex-row bg-[#FAFAFA] text-[#050507] rounded-xl overflow-hidden shadow-2xl relative font-sans">
      {/* Main Section */}
      <div className="flex-1 p-8 md:pr-12 relative flex flex-col justify-between">
        <div className="flex justify-between items-start mb-12">
          <div>
            <h3 className="font-serif text-3xl font-bold tracking-widest uppercase mb-1">
              AETHER
            </h3>
            <p className="text-[10px] font-mono tracking-widest text-[#8E95A3] uppercase">
              Private Charter • Confirmed
            </p>
          </div>
          <Plane className="w-8 h-8 text-[#D4C5B9]" />
        </div>

        <div className="flex items-center justify-between mb-16 relative">
          <div className="w-full absolute top-1/2 left-0 h-px border-t border-dashed border-[#8E95A3]/40 -z-10" />
          <div className="bg-[#FAFAFA] pr-6">
            <p className="text-6xl font-serif font-light tracking-tight">
              {from || "JFK"}
            </p>
            <p className="text-xs uppercase tracking-widest text-[#8E95A3] mt-3">
              Origin
            </p>
          </div>
          <div className="bg-[#FAFAFA] px-4">
            <Plane className="w-6 h-6 text-[#D4C5B9]" />
          </div>
          <div className="bg-[#FAFAFA] pl-6 text-right">
            <p className="text-6xl font-serif font-light tracking-tight">
              {to || "LHR"}
            </p>
            <p className="text-xs uppercase tracking-widest text-[#8E95A3] mt-3">
              Destination
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-4 border-t border-[#E5E5E5]">
          <div>
            <p className="text-[10px] uppercase tracking-widest text-[#8E95A3] mb-1">
              Passenger
            </p>
            <p className="font-semibold text-sm uppercase tracking-wide truncate">
              {currentUser.name}
            </p>
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-widest text-[#8E95A3] mb-1">
              Date
            </p>
            <p className="font-semibold text-sm uppercase tracking-wide">
              {displayDate}
            </p>
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-widest text-[#8E95A3] mb-1">
              Aircraft
            </p>
            <p className="font-semibold text-sm uppercase tracking-wide truncate">
              {aircraft.name}
            </p>
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-widest text-[#8E95A3] mb-1">
              Class
            </p>
            <p className="font-semibold text-sm uppercase tracking-wide truncate">
              {aircraft.class}
            </p>
          </div>
        </div>

        {/* Perforation visual on the right edge (desktop only) */}
        <div className="hidden md:flex absolute right-0 top-0 bottom-0 w-3 flex-col justify-between -mr-[6px] py-2 z-10">
          {Array.from({ length: 16 }).map((_, i) => (
            <div key={i} className="w-3 h-3 rounded-full bg-aether-navy" />
          ))}
        </div>
      </div>

      {/* Stub Section */}
      <div className="w-full md:w-72 border-t md:border-t-0 md:border-l-2 border-dashed border-[#8E95A3]/30 p-8 flex flex-col justify-center items-center bg-[#F3F1EC]">
        <img
          src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=AETHER_BOARDING_PASS_${currentUser.name.replace(" ", "_")}`}
          alt="Boarding Pass QR"
          className="w-32 h-32 mb-8 mix-blend-multiply opacity-90"
        />
        <div className="text-center w-full">
          <p className="text-[10px] uppercase tracking-widest text-[#8E95A3] mb-1">
            Boarding Zone
          </p>
          <p className="text-3xl font-serif font-medium mb-6">FBO VIP</p>
          <div className="w-full space-y-3 pt-6 border-t border-[#E5E5E5]">
            <div className="flex justify-between text-xs">
              <span className="text-[#8E95A3] uppercase tracking-widest text-[10px]">
                Flight Ref
              </span>
              <span className="font-mono font-medium">
                AE-{Math.floor(Math.random() * 900) + 100}
              </span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-[#8E95A3] uppercase tracking-widest text-[10px]">
                Passengers
              </span>
              <span className="font-mono font-medium">{passengers} Pax</span>
            </div>
          </div>

          <div className="mt-6 flex flex-col gap-2 w-full">
            <button
              onClick={handleAddToWallet}
              className="w-full py-2.5 px-4 bg-[#050507] text-[#FAFAFA] text-[10px] font-semibold uppercase tracking-widest rounded flex items-center justify-center gap-2 hover:bg-[#D4C5B9] hover:text-[#050507] transition-colors"
            >
              <Smartphone className="w-4 h-4" /> Add to Apple Wallet
            </button>
            <button
              onClick={handleExportPDF}
              className="w-full py-2.5 px-4 bg-transparent border border-[#050507]/20 text-[#050507] text-[10px] font-semibold uppercase tracking-widest rounded flex items-center justify-center gap-2 hover:bg-[#050507]/5 transition-colors"
            >
              <Download className="w-4 h-4" /> Export as PDF
            </button>
            <button
              onClick={handleExportCalendar}
              className="w-full py-2.5 px-4 bg-transparent border border-[#050507]/20 text-[#050507] text-[10px] font-semibold uppercase tracking-widest rounded flex items-center justify-center gap-2 hover:bg-[#050507]/5 transition-colors"
            >
              <Calendar className="w-4 h-4" /> Add to Calendar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
