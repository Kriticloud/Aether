import React, { useState, useEffect, useRef } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { motion } from 'motion/react';
import { triggerHaptic } from './haptics';

export default function AmbientSoundToggle() {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioContextRef = useRef<AudioContext | null>(null);
  const sourceRef = useRef<AudioBufferSourceNode | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);

  useEffect(() => {
    return () => {
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);

  const generatePinkNoise = (context: AudioContext) => {
    const bufferSize = context.sampleRate * 2; // 2 seconds of noise
    const buffer = context.createBuffer(1, bufferSize, context.sampleRate);
    const output = buffer.getChannelData(0);

    let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0;
    let b5 = 0, b6 = 0;
    
    for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        b0 = 0.99886 * b0 + white * 0.0555179;
        b1 = 0.99332 * b1 + white * 0.0750759;
        b2 = 0.96900 * b2 + white * 0.1538520;
        b3 = 0.86650 * b3 + white * 0.3104856;
        b4 = 0.55000 * b4 + white * 0.5329522;
        b5 = -0.7616 * b5 - white * 0.0168980;
        output[i] = b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362;
        output[i] *= 0.11; // (roughly) compensate for gain
        b6 = white * 0.115926;
    }
    return buffer;
  };

  const toggleSound = () => {
    triggerHaptic('medium');
    
    if (isPlaying) {
      if (gainNodeRef.current && audioContextRef.current) {
        gainNodeRef.current.gain.setTargetAtTime(0, audioContextRef.current.currentTime, 0.5);
        setTimeout(() => {
          if (sourceRef.current) {
            sourceRef.current.stop();
            sourceRef.current.disconnect();
          }
          setIsPlaying(false);
        }, 500);
      }
    } else {
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      
      const ctx = audioContextRef.current;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }
      
      const buffer = generatePinkNoise(ctx);
      const source = ctx.createBufferSource();
      source.buffer = buffer;
      source.loop = true;
      
      // Filter to sound more like cabin noise/wind
      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.value = 400; // Low hum
      
      const gainNode = ctx.createGain();
      gainNode.gain.setValueAtTime(0, ctx.currentTime);
      gainNode.gain.setTargetAtTime(0.5, ctx.currentTime, 2); // Fade in to soft volume
      
      source.connect(filter);
      filter.connect(gainNode);
      gainNode.connect(ctx.destination);
      
      source.start();
      
      sourceRef.current = source;
      gainNodeRef.current = gainNode;
      setIsPlaying(true);
    }
  };

  return (
    <div className="fixed bottom-8 left-8 z-50 flex items-center gap-4">
      <button
        onClick={toggleSound}
        className={`w-12 h-12 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 border ${
           isPlaying 
             ? 'bg-aether-black text-aether-gold border-aether-gold/50 shadow-[0_0_15px_rgba(212,197,185,0.2)]' 
             : 'bg-aether-black/50 text-aether-steel border-white/5 hover:text-aether-cloud hover:border-white/10 backdrop-blur-sm'
        }`}
      >
        {isPlaying ? (
           <Volume2 className="w-5 h-5 opacity-90" />
        ) : (
           <VolumeX className="w-5 h-5 opacity-70" />
        )}
      </button>
      {isPlaying && (
        <motion.div
           initial={{ opacity: 0, x: -10 }}
           animate={{ opacity: 1, x: 0 }}
           className="text-[10px] uppercase tracking-widest text-aether-steel font-medium hidden sm:block"
        >
          Ambient Cabin <br/> <span className="text-aether-gold">Active</span>
        </motion.div>
      )}
    </div>
  );
}
