import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Plane,
  Compass,
  LayoutDashboard,
  Crown,
  User,
  BarChart3,
  Users,
  MonitorSmartphone,
  Airplay,
  Menu,
  X,
} from "lucide-react";
import { triggerHaptic } from "./haptics";
import GlobalTimezoneSync from "./GlobalTimezoneSync";

interface LayoutProps {
  children: React.ReactNode;
  currentRoute: string;
  onNavigate: (route: string) => void;
}

const navItems = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "booking", label: "Book Flight", icon: Plane },
  { id: "fleet", label: "Fleet Explorer", icon: Compass },
  { id: "concierge", label: "Concierge", icon: Crown },
  { id: "profile", label: "Passenger Profile", icon: User },
  { id: "analytics", label: "Route Analytics", icon: BarChart3 },
  { id: "crew", label: "Crew", icon: Users },
  { id: "pos", label: "Lounge POS", icon: MonitorSmartphone },
  { id: "landing", label: "Case Study", icon: Airplay },
];

export default function Layout({
  children,
  currentRoute,
  onNavigate,
}: LayoutProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isSidebarHovered, setIsSidebarHovered] = useState(false);

  if (currentRoute === "landing" || currentRoute === "pos") {
    return (
      <div className="min-h-screen bg-aether-black text-aether-cloud">
        {children}
      </div>
    );
  }

  const navigateAndClose = (id: string) => {
    triggerHaptic("light");
    onNavigate(id);
    setMobileMenuOpen(false);
  };

  const SidebarContent = ({ expanded = true }: { expanded?: boolean }) => (
    <>
      <div
        className={`p-6 pb-4 flex flex-col ${expanded ? "items-start" : "items-center"} overflow-hidden transition-all duration-300 whitespace-nowrap`}
      >
        <div className="flex items-center gap-3 w-full h-8">
          <Plane className="w-6 h-6 text-aether-gold flex-shrink-0" />
          <AnimatePresence>
            {expanded && (
              <motion.h1
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: "auto" }}
                exit={{ opacity: 0, width: 0 }}
                className="text-2xl font-serif text-aether-cloud tracking-widest uppercase font-semibold m-0 leading-none"
              >
                Aether
              </motion.h1>
            )}
          </AnimatePresence>
        </div>
        <AnimatePresence>
          {expanded && (
            <motion.p
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="text-xs text-aether-steel mt-2 font-medium tracking-wide uppercase"
            >
              Elite Operations
            </motion.p>
          )}
        </AnimatePresence>
      </div>

      <nav
        className={`flex-1 ${expanded ? "px-4" : "px-2"} py-8 space-y-2 overflow-y-auto overflow-x-hidden custom-scrollbar`}
      >
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentRoute === item.id;

          return (
            <button
              key={item.id}
              onClick={() => navigateAndClose(item.id)}
              className={`w-full flex items-center ${expanded ? "gap-3 px-4" : "justify-center px-0"} py-3 rounded-lg text-sm font-medium transition-all duration-300 relative ${
                isActive
                  ? "text-aether-gold bg-aether-glass"
                  : "text-aether-steel hover:text-aether-cloud hover:bg-aether-glass/50"
              }`}
              title={!expanded ? item.label : undefined}
            >
              {isActive && (
                <motion.div
                  layoutId="activeTab"
                  className={`absolute left-0 h-full bg-aether-gold ${expanded ? "w-1 rounded-r-md" : "w-full opacity-10 rounded-lg"}`}
                />
              )}
              <Icon className="w-5 h-5 flex-shrink-0 relative z-10" />
              {expanded && (
                <span className="whitespace-nowrap relative z-10">
                  {item.label}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      <div
        className={`p-4 mt-auto overflow-hidden transition-all duration-300 ${expanded ? "" : "flex justify-center"}`}
      >
        {expanded ? (
          <div className="p-4 rounded-xl bg-gradient-to-br from-aether-glass to-transparent border border-aether-glass-border w-full flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-aether-navy border border-aether-gold/30 flex items-center justify-center overflow-hidden flex-shrink-0">
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80"
                alt="User"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="overflow-hidden whitespace-nowrap">
              <p className="text-sm font-medium truncate">Eleanor Sterling</p>
              <p className="text-xs text-aether-gold truncate">Vanguard Tier</p>
            </div>
          </div>
        ) : (
          <div
            className="w-10 h-10 rounded-full bg-aether-navy border border-aether-gold/30 flex items-center justify-center overflow-hidden flex-shrink-0 mb-4 hover:border-aether-gold transition-colors cursor-pointer"
            title="Eleanor Sterling"
          >
            <img
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80"
              alt="User"
              className="w-full h-full object-cover"
            />
          </div>
        )}
      </div>
    </>
  );

  return (
    <div className="flex min-h-screen w-full bg-aether-navy text-aether-cloud font-sans overflow-hidden">
      {/* Desktop Sidebar Spacer */}
      <div className="hidden md:block w-[80px] flex-shrink-0 h-screen transition-all duration-300" />

      {/* Desktop Sidebar Auto-collapsible */}
      <motion.aside
        initial={{ width: 80 }}
        animate={{ width: isSidebarHovered ? 256 : 80 }}
        onMouseEnter={() => setIsSidebarHovered(true)}
        onMouseLeave={() => setIsSidebarHovered(false)}
        className="hidden md:flex bg-aether-black flex-col border-r border-aether-glass-border shadow-2xl z-40 h-screen fixed left-0 top-0 overflow-hidden"
      >
        <SidebarContent expanded={isSidebarHovered} />
      </motion.aside>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 bg-aether-black/80 backdrop-blur-sm z-40 md:hidden"
            />
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "tween" }}
              className="fixed inset-y-0 left-0 w-72 bg-aether-black flex flex-col border-r border-aether-glass-border shadow-2xl z-50 md:hidden h-screen"
            >
              <button
                onClick={() => {
                  triggerHaptic("light");
                  setMobileMenuOpen(false);
                }}
                className="absolute top-4 right-4 p-2 text-aether-steel hover:text-aether-cloud"
              >
                <X className="w-6 h-6" />
              </button>
              <SidebarContent expanded={true} />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="flex-1 relative flex flex-col h-screen overflow-hidden">
        {/* Subtle radial gradient background */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-aether-steel/10 via-aether-navy to-aether-navy pointer-events-none" />

        {/* Desktop Global Header */}
        <div className="hidden md:flex absolute top-6 right-8 z-50 pointer-events-auto">
          <GlobalTimezoneSync />
        </div>

        {/* Mobile Header Menu Toggle */}
        <div className="md:hidden p-4 relative z-20 flex items-center justify-between border-b border-aether-glass-border bg-aether-black/50 backdrop-blur-md">
          <div className="flex items-center gap-2">
            <Plane className="w-5 h-5 text-aether-gold" />
            <span className="font-serif font-semibold tracking-widest text-lg">
              AETHER
            </span>
          </div>
          <button
            onClick={() => {
              triggerHaptic("medium");
              setMobileMenuOpen(true);
            }}
            className="p-2 text-aether-cloud"
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto overflow-x-hidden relative z-10 w-full h-full custom-scrollbar">
          {children}
        </div>
      </main>
    </div>
  );
}
