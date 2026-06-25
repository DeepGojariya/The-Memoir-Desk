import React, { useRef, useState } from "react";
import { motion } from "motion/react";
import { Upload, ZoomIn, Calendar, ImageIcon } from "lucide-react";
import { PolaroidItem } from "../types";
import { SafeImage } from "./SafeImage.tsx";

interface PolaroidCardProps {
  key?: string | any;
  memory: PolaroidItem;
  onSelect: (memory: PolaroidItem) => void;
  onUpdateImage: (id: string, imageUrl: string) => void;
  containerRef: any;
}

export function PolaroidCard({
  memory,
  onSelect,
  onUpdateImage,
  containerRef
}: PolaroidCardProps): any {
  const [isHovered, setIsHovered] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle manual file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      const objectUrl = URL.createObjectURL(file);
      onUpdateImage(memory.id, objectUrl);
    }
  };

  // Handle Drag & Drop events
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
    
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      const file = files[0];
      if (file.type.startsWith("image/")) {
        const objectUrl = URL.createObjectURL(file);
        onUpdateImage(memory.id, objectUrl);
      }
    }
  };

  const triggerFileSelect = (e: React.MouseEvent) => {
    e.stopPropagation(); // prevent modal trigger
    fileInputRef.current?.click();
  };

  const currentImage = memory.userImage || memory.initialImage;

  return (
    <motion.div
      drag
      dragConstraints={containerRef}
      dragElastic={0.12}
      dragMomentum={true}
      dragTransition={{ power: 0.15, timeConstant: 200 }}
      onDragStart={() => setIsDragging(true)}
      onDragEnd={() => setTimeout(() => setIsDragging(false), 50)}
      initial={{ 
        x: memory.defaultX, 
        y: memory.defaultY, 
        rotation: memory.rotate,
        scale: 0.9,
        opacity: 0
      }}
      animate={{ 
        rotate: isHovered && !isDragging ? 0 : memory.rotate,
        scale: isHovered && !isDragging ? 1.03 : 1,
        opacity: 1,
        zIndex: isHovered || isDragging ? 40 : 10
      }}
      transition={{ type: "spring", stiffness: 260, damping: 25 }}
      whileDrag={{ scale: 1.05, rotate: 2 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      onClick={() => {
        if (!isDragging) {
          onSelect(memory);
        }
      }}
      className={`absolute w-64 p-3 bg-white border border-[#e8dfcb] rounded-xs polaroid-shadow cursor-grab active:cursor-grabbing select-none ${
        isDragOver ? "ring-4 ring-[#d4af37]/30 border-[#d4af37]" : ""
      }`}
      id={`polaroid-${memory.id}`}
    >
      {/* Tape Effect */}
      <div className="tape-top" />

      {/* Picture Frame with Drop Zone */}
      <div 
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`relative aspect-square w-full bg-[#FAF6F0] overflow-hidden rounded-xs border border-stone-100 group transition-all duration-300 ${
          isDragOver ? "bg-amber-50" : ""
        }`}
      >
        <SafeImage
          src={currentImage}
          alt={memory.title}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover select-none pointer-events-none transition-transform duration-500 group-hover:scale-105"
        />

        {/* Hover Controls Overlay */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onSelect(memory);
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white/90 rounded-full text-xs font-serif text-stone-800 font-medium hover:bg-white transition-all cursor-pointer shadow-xs"
          >
            <ZoomIn className="w-3.5 h-3.5" /> Close Look
          </button>
          
          <button
            onClick={triggerFileSelect}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#bf9c56]/90 rounded-full text-xs font-serif text-white font-medium hover:bg-[#bf9c56] transition-all cursor-pointer shadow-xs"
          >
            <Upload className="w-3.5 h-3.5" /> Swap Photo
          </button>
        </div>

        {/* Drag-over indicator overlay */}
        {isDragOver && (
          <div className="absolute inset-0 bg-[#fdfbf7]/90 flex flex-col items-center justify-center p-4 text-center">
            <Upload className="w-8 h-8 text-[#bf9c56] animate-bounce mb-1" />
            <p className="text-xs font-serif font-semibold text-[#6b5d44]">Drop to Swap Wedding Photo</p>
          </div>
        )}

        {/* User uploaded tag */}
        {memory.userImage && (
          <div className="absolute bottom-1 right-1 bg-[#bf9c56] text-[white] text-[9px] font-sans px-1.5 py-0.5 rounded-sm shadow-xs">
            My Photo
          </div>
        )}
      </div>

      {/* Invisible HTML file input for swapping */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
      />

      {/* Handwritten Caption Zone */}
      <div className="pt-2 pb-1 text-center font-handwritten select-none">
        <h3 className="text-xl font-bold text-stone-800 leading-tight">
          {memory.caption}
        </h3>
        <div className="flex items-center justify-center gap-1 text-[#bf9c56] text-xs font-sans font-medium mt-1">
          <Calendar className="w-3 h-3" />
          <span>{memory.date}</span>
        </div>
      </div>
    </motion.div>
  );
}
