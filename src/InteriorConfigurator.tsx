import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Briefcase, Bed, Users } from 'lucide-react';
import { triggerHaptic } from './haptics';

type LayoutType = 'lounge' | 'meeting' | 'bedroom';

interface Props {
  aircraftName: string;
}

export default function InteriorConfigurator({ aircraftName }: Props) {
  const [layout, setLayout] = useState<LayoutType>('lounge');

  const layouts: { id: LayoutType; icon: any; label: string; image: string }[] = [
    { id: 'lounge', icon: Users, label: 'Executive Lounge', image: 'https://images.unsplash.com/photo-1540998145320-fa724fa2b415?auto=format&fit=crop&q=80&w=1200' },
    { id: 'meeting', icon: Briefcase, label: 'Conference Room', image: 'https://images.unsplash.com/photo-1497215898163-956276ad39df?auto=format&fit=crop&q=80&w=1200' },
    { id: 'bedroom', icon: Bed, label: 'Master Suite', image: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&q=80&w=1200' }
  ];

  const handleSelect = (id: LayoutType) => {
    setLayout(id);
    triggerHaptic('medium');
  };

  const activeLayout = layouts.find(l => l.id === layout);

  return (
    <div className="absolute inset-0 z-20 pointer-events-none flex flex-col justify-end p-8 pb-32">
       {/* 2D Interior Overlay - partially opaque */}
       <AnimatePresence mode="wait">
         <motion.div 
           key={layout}
           initial={{ opacity: 0 }}
           animate={{ opacity: 0.8 }}
           exit={{ opacity: 0 }}
           transition={{ duration: 0.5 }}
           className="absolute inset-0 z-[-1]"
         >
            <div className="absolute inset-0 bg-black/60 z-10 mix-blend-multiply" />
            <img src={activeLayout?.image} alt={activeLayout?.label} className="w-full h-full object-cover" />
         </motion.div>
       </AnimatePresence>

       {/* Controls */}
       <div className="pointer-events-auto flex items-center justify-center gap-4 bg-black/50 backdrop-blur-md p-2 rounded-xl border border-white/10 w-fit mx-auto relative z-30 mb-8 shadow-2xl">
          {layouts.map(l => {
             const Icon = l.icon;
             const isActive = layout === l.id;
             return (
                <button
                  key={l.id}
                  onClick={() => handleSelect(l.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all text-sm font-medium ${isActive ? 'bg-aether-gold text-black shadow-lg' : 'text-white hover:bg-white/10'}`}
                >
                   <Icon className="w-4 h-4" />
                   <span className="hidden sm:inline">{l.label}</span>
                </button>
             );
          })}
       </div>
    </div>
  );
}
