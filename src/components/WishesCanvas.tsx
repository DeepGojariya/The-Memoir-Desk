import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Heart, Plus, Send, RefreshCw, Sparkles, Smile } from "lucide-react";
import { WishNote } from "../types";

interface WishesCanvasProps {
  wishes: WishNote[];
  onAddWish: (wish: WishNote) => void;
  onResetWishes: () => void;
}

const pastelColors = [
  { hex: "#FFF9E6", label: "Vanilla Cream" },
  { hex: "#FFF0F5", label: "Lavender Blush" },
  { hex: "#E0F7FA", label: "Mint Ice" },
  { hex: "#FFF3E0", label: "Peach Apricot" },
  { hex: "#F1F8E9", label: "Pale Celery" }
];

export function WishesCanvas({
  wishes,
  onAddWish,
  onResetWishes
}: WishesCanvasProps) {
  const [author, setAuthor] = useState("");
  const [message, setMessage] = useState("");
  const [selectedColor, setSelectedColor] = useState(pastelColors[0].hex);
  
  const boardRef = useRef<HTMLDivElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!author.trim() || !message.trim()) return;

    // Generate a secure offset in bounds of our wishing board
    const randomX = 50 + Math.random() * (boardRef.current ? Math.max(50, boardRef.current.clientWidth - 300) : 400);
    const randomY = 50 + Math.random() * (boardRef.current ? Math.max(50, boardRef.current.clientHeight - 220) : 250);
    const randomRotate = -8 + Math.random() * 16;

    const newWish: WishNote = {
      id: `wish_${Date.now()}`,
      author: author.trim(),
      message: message.trim(),
      color: selectedColor,
      x: randomX,
      y: randomY,
      rotate: randomRotate,
      date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
    };

    onAddWish(newWish);
    setAuthor("");
    setMessage("");
    // Pick another random color for the next time
    const nextColor = pastelColors[Math.floor(Math.random() * pastelColors.length)].hex;
    setSelectedColor(nextColor);
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 w-full h-full min-h-[620px]">
      {/* Wishing Letter Form */}
      <div className="w-full lg:w-80 bg-white p-5 rounded-lg border border-[#e8dfca] shadow-sm flex flex-col justify-between">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="text-center pb-2 border-b border-[#faf6f0]">
            <h3 className="font-serif text-[#6b5d44] font-semibold text-lg flex items-center justify-center gap-1.5">
              <Heart className="w-4.5 h-4.5 text-rose-400 fill-rose-400 animate-pulse" />
              Wishing Well
            </h3>
            <p className="text-xs text-stone-400 font-sans mt-0.5">Leave a message in our digital scrapbook</p>
          </div>

          <div className="space-y-1">
            <label className="text-stone-500 text-xs font-serif font-medium">Your Human Name</label>
            <input
              type="text"
              required
              placeholder="e.g. Aunt Jennifer"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              className="w-full px-3 py-1.5 bg-[#FAF6F0] border border-[#e8dfca] rounded-md text-sm text-stone-800 placeholder-stone-400 focus:outline-hidden focus:ring-1 focus:ring-[#bf9c56] focus:border-[#bf9c56] transition-all"
            />
          </div>

          <div className="space-y-1">
            <label className="text-stone-500 text-xs font-serif font-medium">Blessing Message</label>
            <textarea
              required
              rows={4}
              maxLength={180}
              placeholder="Write your wishes, advice, or sweet thoughts here..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full px-3 py-1.5 bg-[#FAF6F0] border border-[#e8dfca] rounded-md text-sm text-stone-800 placeholder-stone-400 focus:outline-hidden focus:ring-1 focus:ring-[#bf9c56] focus:border-[#bf9c56] resize-none transition-all"
            />
            <div className="flex justify-between text-[10px] text-stone-400 font-sans px-1">
              <span>Short & sweet!</span>
              <span>{message.length}/180</span>
            </div>
          </div>

          {/* Color Select */}
          <div className="space-y-1.5 pb-2">
            <label className="text-stone-500 text-xs font-serif font-medium">Select Note Color</label>
            <div className="flex gap-2">
              {pastelColors.map((color) => (
                <button
                  key={color.hex}
                  type="button"
                  onClick={() => setSelectedColor(color.hex)}
                  title={color.label}
                  className={`w-7 h-7 rounded-full border cursor-pointer relative transition-transform ${
                    selectedColor === color.hex 
                      ? "border-[#6b5d44] scale-110 shadow-xs" 
                      : "border-stone-200"
                  }`}
                  style={{ backgroundColor: color.hex }}
                >
                  {selectedColor === color.hex && (
                    <span className="absolute inset-0 flex items-center justify-center text-[#6b5d44]">
                      <Plus className="w-3.5 h-3.5 stroke-[3]" />
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          <button
            type="submit"
            className="w-full cursor-pointer bg-[#bf9c56] hover:bg-[#a68241] text-white py-2 rounded-md font-serif text-sm font-semibold transition-all shadow-xs flex items-center justify-center gap-2 active:scale-98"
          >
            <Send className="w-4 h-4" /> Share Blessings
          </button>
        </form>

        <div className="pt-4 border-t border-[#faf6f0] mt-6">
          <button
            onClick={onResetWishes}
            className="w-full cursor-pointer text-stone-400 hover:text-stone-600 font-sans text-xs flex items-center justify-center gap-1.5 py-1"
            title="Reload initial family wishes"
          >
            <RefreshCw className="w-3 h-3" /> Reset default wishes
          </button>
        </div>
      </div>

      {/* Wishing Board Cork Board */}
      <div 
        ref={boardRef}
        className="flex-1 bg-stone-100 rounded-lg relative overflow-hidden border border-[#ddd3be] select-none p-4 min-h-[500px]"
        style={{
          boxShadow: "inset 0 10px 30px rgba(0,0,0,0.03)",
          backgroundImage: "radial-gradient(#d3c6ab 1px, transparent 1px)",
          backgroundSize: "24px 24px"
        }}
      >
        {/* Banner */}
        <div className="absolute top-3 left-3 bg-[#6b5d44]/10 backdrop-blur-xs px-2.5 py-1 rounded-full text-[10px] text-[#6b5d44] font-serif tracking-wider uppercase">
          📌 Tabletop interactive board (Drag notes)
        </div>

        {/* Wishes Cards render */}
        <AnimatePresence>
          {wishes.map((wish) => (
            <motion.div
              key={wish.id}
              drag
              dragConstraints={boardRef}
              dragElastic={0.12}
              dragMomentum={true}
              dragTransition={{ power: 0.15, timeConstant: 200 }}
              initial={{ 
                x: wish.x, 
                y: wish.y, 
                rotate: wish.rotate,
                scale: 0.8,
                opacity: 0
              }}
              animate={{ 
                rotate: wish.rotate,
                scale: 1,
                opacity: 1,
                zIndex: 10
              }}
              whileDrag={{ scale: 1.05, rotate: 2, zIndex: 50 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="absolute w-52 p-4 polaroid-shadow border cursor-grab active:cursor-grabbing rounded-xs"
              style={{ backgroundColor: wish.color, borderColor: "rgba(0,0,0,0.06)" }}
            >
              {/* Cute Washi Tape Effect */}
              <div 
                className="absolute -top-3.5 left-1/2 -translate-x-1/2 w-20 h-5"
                style={{
                  backgroundColor: "rgba(223, 196, 126, 0.35)",
                  backdropFilter: "blur(0.5px)",
                  transform: "translateX(-50%) rotate(3deg)",
                  borderLeft: "2px dashed rgba(0,0,0,0.05)",
                  borderRight: "2px dashed rgba(0,0,0,0.05)",
                  boxShadow: "inset 0 0 2px rgba(0,0,0,0.03)"
                }}
              />

              {/* Message */}
              <p className="font-handwritten text-[#3e321a] text-lg font-bold leading-tight pb-3">
                "{wish.message}"
              </p>

              {/* Author & Date */}
              <div className="flex justify-between items-center pt-2 border-t border-[rgba(0,0,0,0.05)] text-[10px] text-stone-500 font-sans">
                <span className="font-semibold text-stone-700 font-serif flex items-center gap-1">
                  <Smile className="w-3 h-3 text-[#bf9c56]" />
                  {wish.author}
                </span>
                <span>{wish.date}</span>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {wishes.length === 0 && (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-stone-400 p-8 text-center pointer-events-none">
            <Heart className="w-12 h-12 stroke-[1] mb-2 text-[#bf9c56]/50" />
            <h4 className="font-serif text-[#6b5d44] text-md font-semibold mb-1">Board is clean & quiet</h4>
            <p className="text-xs font-sans max-w-xs text-stone-400">Be the first to leave a wedding wish! Type a message in the panel on the left.</p>
          </div>
        )}
      </div>
    </div>
  );
}
