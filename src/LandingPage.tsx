import React from 'react';
import { motion } from 'motion/react';
import { ArrowRight, PlaneTakeoff, Clock, CreditCard, Shield, ChevronDown } from 'lucide-react';

interface LandingPageProps {
  onEnter: () => void;
}

export default function LandingPage({ onEnter }: LandingPageProps) {
  return (
    <div className="min-h-screen relative bg-aether-black flex flex-col font-sans">
      {/* Hero Section (Case Study Intro) */}
      <div className="relative min-h-screen flex flex-col justify-center items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-b from-aether-black/60 via-aether-black/80 to-aether-black z-10" />
          <img 
            src="https://images.unsplash.com/photo-1621213303649-6efc96cb883b?ixlib=rb-4.0.3&auto=format&fit=crop&w=2400&q=80" 
            alt="Luxury Private Jet" 
            className="w-full h-full object-cover opacity-60"
          />
        </div>

        <div className="z-10 text-center max-w-4xl px-6 pt-32">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: 'easeOut' }}
          >
            <h2 className="text-aether-gold uppercase tracking-[0.3em] text-sm font-medium mb-6">UI/UX Case Study</h2>
            <h1 className="text-6xl md:text-8xl font-serif mb-8 text-aether-cloud font-light tracking-tight">
              AETHER OS
            </h1>
            <p className="text-aether-steel text-lg md:text-xl max-w-2xl mx-auto mb-12 font-light leading-relaxed">
              Private Aviation, Reimagined. An elite travel operating system for high-net-worth individuals and concierge teams.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <button 
                onClick={onEnter}
                className="px-8 py-4 bg-aether-gold text-aether-black font-medium tracking-wide hover:bg-white transition-colors duration-300 flex items-center gap-3 w-full sm:w-auto justify-center rounded-sm"
              >
                Launch Interactive Prototype
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </motion.div>
        </div>
        
        <div className="absolute bottom-10 z-10 animate-bounce">
          <ChevronDown className="w-8 h-8 text-aether-steel opacity-50" />
        </div>
      </div>

      {/* Project Overview */}
      <div className="py-32 px-6 max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
        <div>
          <h3 className="text-aether-gold uppercase tracking-widest text-sm mb-4">01 — Overview</h3>
          <h2 className="text-4xl font-serif text-aether-cloud mb-8">The Problem & Solution</h2>
          <div className="space-y-6 text-aether-steel font-light leading-relaxed">
            <p>
              <strong className="text-aether-cloud font-medium">Problem:</strong> Legacy private aviation booking software is fragmented, utilitarian, and lacks the premium feel that high-net-worth clients expect. It relies heavily on phone calls, disjointed emails, and opaque pricing structures.
            </p>
            <p>
              <strong className="text-aether-cloud font-medium">Solution:</strong> Aether unifies flight booking, active flight telemetry, concierge requests, and passenger profiles into a single, cohesive interface. Utilizing dark glass aesthetics and real-time data, it delivers an Apple-level polish with Gulfstream-style sophistication.
            </p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
           {/* Abstract representational images */}
           <img src="https://images.unsplash.com/photo-1590494541539-775b8ce1121d?auto=format&fit=crop&w=600&q=80" alt="Jet Interior" className="w-full h-48 object-cover rounded-xl" />
           <img src="https://images.unsplash.com/photo-1583416750470-965b2707b355?auto=format&fit=crop&w=600&q=80" alt="Jet Exterior" className="w-full h-64 object-cover rounded-xl -mt-8" />
        </div>
      </div>

      {/* Personas */}
      <div className="py-24 bg-aether-navy px-6">
        <div className="max-w-7xl mx-auto">
          <h3 className="text-aether-gold uppercase tracking-widest text-sm mb-4 text-center">02 — Users</h3>
          <h2 className="text-4xl font-serif text-aether-cloud mb-16 text-center">Target Personas</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="p-8 border border-aether-glass-border rounded-2xl bg-aether-black/50">
              <div className="w-16 h-16 rounded-full bg-aether-gold/20 flex items-center justify-center mb-6">
                <span className="text-2xl font-serif text-aether-gold">E</span>
              </div>
              <h4 className="text-xl font-medium text-aether-cloud mb-2">The Elite Traveler</h4>
              <p className="text-aether-steel text-sm mb-4">High net-worth principle utilizing aviation for business and leisure.</p>
              <ul className="text-sm text-aether-steel space-y-2 list-disc pl-4">
                <li>Expects zero friction in booking.</li>
                <li>Requires intense privacy and data security.</li>
                <li>Values unified concierge and transport details.</li>
              </ul>
            </div>
            
            <div className="p-8 border border-aether-glass-border rounded-2xl bg-aether-black/50">
              <div className="w-16 h-16 rounded-full bg-aether-steel/20 flex items-center justify-center mb-6">
                <span className="text-2xl font-serif text-aether-steel">C</span>
              </div>
              <h4 className="text-xl font-medium text-aether-cloud mb-2">The Concierge Team</h4>
              <p className="text-aether-steel text-sm mb-4">Operations staff managing logistics for clients.</p>
              <ul className="text-sm text-aether-steel space-y-2 list-disc pl-4">
                <li>Needs at-a-glance dashboard for active flights.</li>
                <li>Requires quick turnaround for specialized requests.</li>
                <li>Demands clear history and analytic insight.</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Design System */}
      <div className="py-32 px-6 max-w-7xl mx-auto">
        <h3 className="text-aether-gold uppercase tracking-widest text-sm mb-4">03 — Design System</h3>
        <h2 className="text-4xl font-serif text-aether-cloud mb-16">Visual Language</h2>
        
        <div className="mb-20">
          <h4 className="text-lg text-aether-steel font-medium tracking-wide mb-6">Color Palette</h4>
          <div className="flex flex-wrap gap-4">
             {[
               { name: 'Carbon Black', hex: '#111216', bg: 'bg-aether-navy', text: 'text-white' },
               { name: 'Obsidian', hex: '#050507', bg: 'bg-aether-black', text: 'text-white border border-white/10' },
               { name: 'Pearl', hex: '#FAFAFA', bg: 'bg-[#FAFAFA]', text: 'text-black' },
               { name: 'Champagne', hex: '#D4C5B9', bg: 'bg-aether-gold', text: 'text-black' },
               { name: 'Platinum', hex: '#8E95A3', bg: 'bg-aether-steel', text: 'text-white' }
             ].map(color => (
               <div key={color.name} className="flex flex-col items-center gap-3">
                 <div className={`w-24 h-24 rounded-full ${color.bg} ${color.text} flex items-center justify-center shadow-lg`}>
                 </div>
                 <div className="text-center">
                   <p className="text-sm font-medium text-aether-cloud">{color.name}</p>
                   <p className="text-xs font-mono text-aether-steel mt-1">{color.hex}</p>
                 </div>
               </div>
             ))}
          </div>
        </div>

        <div className="mb-20">
          <h4 className="text-lg text-aether-steel font-medium tracking-wide mb-6">Typography</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="p-8 border border-white/10 rounded-xl bg-gradient-to-br from-white/5 to-transparent">
              <p className="text-aether-steel text-sm uppercase tracking-widest mb-4">Headings</p>
              <h1 className="text-5xl font-serif text-aether-cloud font-light mb-2">Outfit</h1>
              <h1 className="text-5xl font-serif text-aether-cloud font-bold mb-4">Display</h1>
              <p className="text-aether-steel/60">Aa Bb Cc Dd Ee Ff Gg Hh Ii Jj Kk Ll Mm Nn Oo Pp Qq Rr Ss Tt Uu Vv Ww Xx Yy Zz</p>
            </div>
            <div className="p-8 border border-white/10 rounded-xl bg-gradient-to-br from-white/5 to-transparent">
              <p className="text-aether-steel text-sm uppercase tracking-widest mb-4">Body</p>
              <h1 className="text-5xl font-sans text-aether-cloud font-medium mb-4">Manrope</h1>
              <p className="text-aether-steel/60 font-sans">Aa Bb Cc Dd Ee Ff Gg Hh Ii Jj Kk Ll Mm Nn Oo Pp Qq Rr Ss Tt Uu Vv Ww Xx Yy Zz</p>
            </div>
          </div>
        </div>
      </div>

      {/* Mockups */}
      <div className="py-24 bg-gradient-to-b from-aether-black to-aether-navy px-6">
        <div className="max-w-5xl mx-auto text-center">
          <h3 className="text-aether-gold uppercase tracking-widest text-sm mb-4">04 — The Product</h3>
          <h2 className="text-4xl font-serif text-aether-cloud mb-12">Operational Excellence</h2>
          
          <div className="relative w-full aspect-video rounded-2xl overflow-hidden border border-white/10 shadow-[0_0_50px_rgba(200,169,106,0.1)] group">
             <div className="absolute inset-0 bg-aether-black/50 z-10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm">
                <button 
                  onClick={onEnter}
                  className="px-8 py-4 bg-aether-gold text-aether-black font-medium transition-transform scale-90 group-hover:scale-100 uppercase tracking-widest text-sm rounded-sm"
                >
                  Enter Interactive Application
                </button>
             </div>
             {/* Fake screenshot composition using unsplash pattern */}
             <img src="https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=1200&q=80" className="w-full h-full object-cover opacity-30" alt="App Background" />
             <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-aether-navy to-transparent" />
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center z-0">
               <PlaneTakeoff className="w-16 h-16 text-aether-gold mx-auto mb-4 opacity-50" />
               <p className="font-serif text-2xl text-aether-cloud tracking-wide">AETHER DASHBOARD</p>
             </div>
          </div>
        </div>
      </div>

      <div className="py-32 flex justify-center text-center">
        <div>
          <h2 className="text-4xl font-serif mb-8 text-aether-cloud">Experience the Prototype</h2>
          <button 
                onClick={onEnter}
                className="px-8 py-4 bg-white text-aether-black font-medium tracking-wide hover:bg-aether-gold transition-colors duration-300 rounded-sm"
              >
                Launch Now
          </button>
        </div>
      </div>
    </div>
  );
}
