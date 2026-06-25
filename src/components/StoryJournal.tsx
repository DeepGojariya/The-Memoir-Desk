import { useState, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Heart, Sparkles, BookOpen } from "lucide-react";
import { WeddingEvent } from "../types";
import { weddingEvents } from "../data";
import { SafeImage } from "./SafeImage.tsx";

const cardPositions = [
  { left: "6%", top: "8%", rotate: -8 },
  { left: "56%", top: "4%", rotate: 6 },
  { left: "30%", top: "22%", rotate: -4 },
  { left: "4%", top: "50%", rotate: 5 },
  { left: "54%", top: "48%", rotate: -7 },
  { left: "28%", top: "66%", rotate: 8 }
];

export function StoryJournal() {
  const [selectedEventIndex, setSelectedEventIndex] = useState(0);
  const [activeCardIndex, setActiveCardIndex] = useState<number | null>(null);
  const rightPageRef = useRef<HTMLDivElement>(null);

  return (
    <div className="bg-white overflow-hidden w-full flex flex-col md:flex-row h-full min-h-[550px]">
      {/* Diary Left Pages - Event Selection Tabs */}
      <div className="w-full md:w-80 bg-[#FAF6F0] p-5 border-r border-[#e8dfca] flex flex-col gap-3">
        <div className="pb-3 border-b border-[#e1d9c4] flex items-center gap-1.5">
          <BookOpen className="w-4 h-4 text-[#bf9c56]" />
          <h3 className="font-serif font-bold text-stone-800 text-sm tracking-wider uppercase">
            Wedding Registry
          </h3>
        </div>
        
        <p className="text-[11px] text-stone-500 font-sans leading-relaxed mb-2">
          Explore the beautiful milestones of our wedding journey, from pre-wedding memories to our main wedding ceremonies. Click on a card to read details.
        </p>

        <div className="space-y-2.5">
          {weddingEvents.map((evt, idx) => (
            <button
              key={evt.title}
              onClick={() => setSelectedEventIndex(idx)}
              className={`w-full cursor-pointer text-left p-3.5 rounded-lg border transition-all relative flex flex-col gap-1.5 focus:outline-hidden ${
                selectedEventIndex === idx
                  ? "bg-white border-[#bf9c56] shadow-xs ring-1 ring-[#bf9c56]/30"
                  : "bg-white/40 hover:bg-white border-[#e6dfcb] text-stone-500"
              }`}
            >
              <div className="flex justify-between items-start">
                <span className={`text-[10px] font-sans font-semibold tracking-wider uppercase px-2 py-0.5 rounded-full ${
                  selectedEventIndex === idx ? "bg-[#bf9c56] text-white" : "bg-stone-100 text-[#6b5d44]"
                }`}>
                  Day {weddingEvents.length - idx}
                </span>
                <span className="text-[10px] font-mono text-stone-400 font-semibold">{evt.date.split(" ")[0] + " " + evt.date.split(" ")[1]}</span>
              </div>
              <h4 className={`font-serif text-xs font-semibold leading-snug ${
                selectedEventIndex === idx ? "text-stone-900 font-bold" : "text-stone-600"
              }`}>
                {evt.title.split(" (")[0]}
              </h4>
              {selectedEventIndex === idx && (
                <span className="absolute right-3 bottom-3 text-[#bf9c56] animate-pulse">
                  <Heart className="w-3.5 h-3.5 fill-[#bf9c56]" />
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Diary Right Pages - Floating Draggable Photos Playground */}
      <div 
        ref={rightPageRef} 
        className="flex-1 min-h-[500px] flex flex-col justify-between vintage-paper relative overflow-hidden select-none cursor-default"
      >
        {/* Binder Holes layout accent at the divider side */}
        <div className="absolute top-0 left-0 bottom-0 w-3 hidden md:flex flex-col justify-around py-4 opacity-50 select-none pointer-events-none z-30">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="w-1.5 h-4 bg-stone-300 rounded-full shadow-inner border border-stone-400/10"></div>
          ))}
        </div>

        {/* Header Ribbon of the Active Ceremony */}
        <div className="p-3.5 border-b border-stone-200/40 bg-white/30 backdrop-blur-xs relative z-20 select-none text-center pointer-events-none">
          <span className="font-cursive text-xl text-[#bf9c56]">Our Forever Journey</span>
          <h2 className="font-serif text-stone-950 text-xs font-bold tracking-wide uppercase mt-0.5 leading-none">
            {weddingEvents[selectedEventIndex].title}
          </h2>
        </div>

        {/* Interactive Floating Polaroid Sandbox */}
        <div className="flex-1 relative w-full h-full overflow-hidden">
          <AnimatePresence mode="popLayout">
            {weddingEvents[selectedEventIndex].photos.map((photo, photoIdx) => {
              const pos = cardPositions[photoIdx % cardPositions.length];
              return (
                <motion.div
                  key={`${selectedEventIndex}-${photoIdx}`}
                  drag
                  dragElastic={0.05}
                  dragMomentum={false}
                  dragConstraints={rightPageRef}
                  initial={{ 
                    opacity: 0, 
                    scale: 0.82,
                    x: (photoIdx % 2 === 0 ? -30 : 30),
                    y: (photoIdx < 3 ? -30 : 30),
                    rotate: pos.rotate * 2.2
                  }}
                  animate={{ 
                    opacity: 1, 
                    scale: 1,
                    x: 0,
                    y: 0,
                    rotate: pos.rotate
                  }}
                  exit={{ 
                    opacity: 0, 
                    scale: 0.8,
                    rotate: pos.rotate * 1.5 
                  }}
                  transition={{ 
                    type: "spring", 
                    stiffness: 90, 
                    damping: 14,
                    delay: photoIdx * 0.04
                  }}
                  onDragStart={() => setActiveCardIndex(photoIdx)}
                  onPointerDown={() => setActiveCardIndex(photoIdx)}
                  className="absolute w-36 sm:w-40 md:w-44 cursor-grab active:cursor-grabbing hover:scale-[1.07] active:scale-[0.98] transition-transform duration-150 ease-out"
                  style={{
                    left: pos.left,
                    top: pos.top,
                    zIndex: activeCardIndex === photoIdx ? 40 : 10 + photoIdx
                  }}
                >
                  <div className="bg-white p-2.5 pb-4 border border-[#ebdcb9]/40 shadow-md hover:shadow-xl rounded-xs select-none">
                    <div className="relative aspect-square w-full bg-stone-100 overflow-hidden rounded-xs border border-stone-100">
                      <SafeImage
                        src={photo.url}
                        alt={photo.caption}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover select-none pointer-events-none"
                      />
                    </div>
                    <div className="pt-2 text-[11px] font-serif text-center text-stone-600 leading-none select-none font-bold tracking-tight truncate">
                      {photo.caption}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        {/* Simple instructional status footer */}
        <div className="p-3 border-t border-stone-200/30 bg-white/25 flex justify-between items-center text-[9px] text-stone-400 font-sans select-none z-20">
          <span>✨ Tip: Drag the photos around like floating memories!</span>
          <span className="flex items-center gap-1 text-[#bf9c56] font-semibold font-serif uppercase tracking-wider">
            MEMORIES FOREVER <Heart className="w-2.5 h-2.5 fill-[#bf9c56]" />
          </span>
        </div>
      </div>
    </div>
  );
}
