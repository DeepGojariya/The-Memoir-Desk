import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence, useDragControls } from "motion/react";
import {
  Heart,
  Sparkles,
  BookOpen,
  HelpCircle,
  RefreshCw,
  Camera,
  X,
  Info,
  Trash2,
  Plus,
  Smile,
  Calendar,
  Gift,
  ImageIcon,
  ChevronRight,
  Sparkle,
  Minimize2,
  Folder,
  MapPin,
  Clock,
  Volume2,
  VolumeX,
  PlusCircle,
  Home,
  Info as InfoIcon,
  Upload,
  Loader2,
  Play,
  Pause
} from "lucide-react";

import { PolaroidItem, PlacedSticker, WishNote } from "./types";
import { initialPolaroidMemories, initialWishes, availableStickers } from "./data";

import { AudioPlayer } from "./components/AudioPlayer.tsx";
import { WishesCanvas } from "./components/WishesCanvas.tsx";
import { StoryJournal } from "./components/StoryJournal.tsx";

import { SafeImage, cleanAssetPath } from "./components/SafeImage.tsx";

const MacOSFolder = ({ 
  className = "w-[72px] h-[60px]", 
  variant = "blue" 
}: { 
  className?: string; 
  variant?: "blue" | "green";
}) => {
  const isBlue = variant === "blue";

  // Exact colors, gradients, and shadows from the screenshot
  const backColor = isBlue ? "#0c7cd5" : "#1a9c4b";
  const gradientId = isBlue ? "simpleFolderBlue" : "simpleFolderGreen";

  return (
    <div className={`relative ${className} select-none group/folder active:scale-95 transition-transform duration-150`}>
      <svg 
        viewBox="0 0 100 80" 
        className="w-full h-full drop-shadow-[0_2.5px_4px_rgba(0,0,0,0.22)] group-hover/folder:scale-105 transition-transform duration-200"
      >
        <defs>
          <linearGradient id="simpleFolderBlue" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#55bcfc" />
            <stop offset="100%" stopColor="#1a8ee0" />
          </linearGradient>
          <linearGradient id="simpleFolderGreen" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#5ce08d" />
            <stop offset="100%" stopColor="#20b650" />
          </linearGradient>
        </defs>

        {/* Back panel tab */}
        <path 
          d="M 12,9 
             H 38 
             C 42,9 44,15 48,16.5 
             C 50,17.5 52,18 55,18
             H 88 
             C 91,18 93,20 93,23 
             V 68 
             C 93,71 91,73 88,73 
             H 12 
             C 9,73 7,71 7,68 
             V 14 
             C 7,11 9,9 12,9 Z" 
          fill={backColor}
        />

        {/* Shadow crease between front and back panels */}
        <rect 
          x="7" 
          y="21" 
          width="86" 
          height="4" 
          fill={isBlue ? "#06467a" : "#0b4e20"} 
          opacity="0.35" 
          rx="1.5" 
        />

        {/* Front panel folder body */}
        <path 
          d="M 12,23 
             H 88 
             C 91,23 93,25 93,28 
             V 68 
             C 93,71 91,73 88,73 
             H 12 
             C 9,73 7,71 7,68 
             V 28 
             C 7,25 9,23 12,23 Z" 
          fill={`url(#${gradientId})`}
        />

        {/* Highlight bezel line on top edge of front panel */}
        <path 
          d="M 12,23 H 88 C 91,23 93,25 93,28" 
          fill="none" 
          stroke={isBlue ? "#a2dbff" : "#bdf5cf"} 
          strokeWidth="1" 
          opacity="0.75"
        />
      </svg>
    </div>
  );
};

const getResponsivePositions = (width: number, height: number) => {
  const isLarge = width > 1024;
  if (isLarge) {
    const activeHeight = height - 42; // Space below top navbar

    // 1. introMov (width 320, height ~500). Placed around 29% from left, 45% from top
    let introMovX = Math.round(width * 0.29);
    let introMovY = Math.round(activeHeight * 0.45);
    introMovX = Math.max(20, Math.min(width - 320 - 20, introMovX));
    introMovY = Math.max(50, Math.min(activeHeight - 500 - 20, introMovY));

    // 2. aboutMe (width ~320, height ~310). Placed around 52% from left, 55% from top
    let aboutMeX = Math.round(width * 0.52);
    let aboutMeY = Math.round(activeHeight * 0.55);
    aboutMeX = Math.max(20, Math.min(width - 320 - 20, aboutMeX));
    aboutMeY = Math.max(50, Math.min(activeHeight - 310 - 20, aboutMeY));

    // 3. bwPortrait (width 176, height ~220) - Placed around 10% from left, 11% from top (top left)
    let bwPortraitX = Math.round(width * 0.10);
    let bwPortraitY = Math.round(activeHeight * 0.11);
    bwPortraitX = Math.max(20, Math.min(width - 176 - 20, bwPortraitX));
    bwPortraitY = Math.max(50, Math.min(activeHeight - 220 - 20, bwPortraitY));

    // 4. sunsetPortrait (width 192, height ~240) - Placed around 4% from left, 49% from top (bottom left)
    let sunsetPortraitX = Math.round(width * 0.04);
    let sunsetPortraitY = Math.round(activeHeight * 0.49);
    sunsetPortraitX = Math.max(20, Math.min(width - 192 - 20, sunsetPortraitX));
    sunsetPortraitY = Math.max(50, Math.min(activeHeight - 240 - 20, sunsetPortraitY));

    // 5. domePhoto (width 208, height ~180) - Placed around 68.5% from left, 13% from top (top right-ish)
    let domePhotoX = Math.round(width * 0.685);
    let domePhotoY = Math.round(activeHeight * 0.13);
    domePhotoX = Math.max(20, Math.min(width - 208 - 20, domePhotoX));
    domePhotoY = Math.max(50, Math.min(activeHeight - 180 - 20, domePhotoY));

    // Center alignment coordinates for folder windows (macOS center opening effect)
    const whatIDoX = Math.round(Math.max(20, (width - 1024) / 2));
    const whatIDoY = Math.round(Math.max(50, (activeHeight - 720) / 2));

    const whereILiveX = Math.round(Math.max(20, (width - 672) / 2));
    const whereILiveY = Math.round(Math.max(50, (activeHeight - 560) / 2));

    return {
      aboutMe: { x: aboutMeX, y: aboutMeY },
      introMov: { x: introMovX, y: introMovY },
      bwPortrait: { x: bwPortraitX, y: bwPortraitY },
      sunsetPortrait: { x: sunsetPortraitX, y: sunsetPortraitY },
      domePhoto: { x: domePhotoX, y: domePhotoY },
      whatIDo: { x: whatIDoX, y: whatIDoY },
      whereILive: { x: whereILiveX, y: whereILiveY }
    };
  } else {
    // Elegant vertical feed alignment on small screens to fit perfectly and be fully visible on scroll
    return {
      aboutMe: { x: 10, y: 10 },
      introMov: { x: 10, y: 310 },
      bwPortrait: { x: 10, y: 720 },
      sunsetPortrait: { x: 10, y: 970 },
      domePhoto: { x: 10, y: 1250 },
      whatIDo: { x: 5, y: 1480 },
      whereILive: { x: 5, y: 2020 }
    };
  }
};

export default function App() {
  const [time, setTime] = useState<Date>(new Date());
  const [organizeCount, setOrganizeCount] = useState(0);

  const whatIDoDragControls = useDragControls();
  const whereILiveDragControls = useDragControls();

  // Window states: track open, maximized, and position
  const [openWindows, setOpenWindows] = useState({
    aboutMe: true,
    introMov: true,
    whatIDo: false, // folder 1
    whereILive: false, // folder 3
    imagePicker: false // for customization
  });

  const [windowPositions, setWindowPositions] = useState(() => {
    return getResponsivePositions(window.innerWidth, window.innerHeight);
  });

  const [activeWindow, setActiveWindow] = useState<string>("introMov");

  const [viewportSize, setViewportSize] = useState({
    width: typeof window !== "undefined" ? window.innerWidth : 1200,
    height: typeof window !== "undefined" ? window.innerHeight : 800
  });

  const isDesktop = viewportSize.width > 1024;

  const [whatIDoSize, setWhatIDoSize] = useState(() => {
    const w = typeof window !== "undefined" ? window.innerWidth : 1024;
    const h = typeof window !== "undefined" ? window.innerHeight - 42 : 720;
    return {
      width: Math.min(1024, Math.round(w * 0.9)),
      height: Math.min(680, Math.round(h * 0.8))
    };
  });

  const [whereILiveSize, setWhereILiveSize] = useState(() => {
    const w = typeof window !== "undefined" ? window.innerWidth : 672;
    const h = typeof window !== "undefined" ? window.innerHeight - 42 : 560;
    return {
      width: Math.min(680, Math.round(w * 0.85)),
      height: Math.min(560, Math.round(h * 0.75))
    };
  });

  useEffect(() => {
    const handleResize = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      setViewportSize({ width: w, height: h });
      setWindowPositions(getResponsivePositions(w, h));
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const centerWindow = (windowId: "whatIDo" | "whereILive") => {
    const w = window.innerWidth;
    const h = window.innerHeight - 42; // space below navbar

    if (windowId === "whatIDo") {
      const W = Math.min(1024, Math.round(w * 0.9));
      const H = Math.min(680, Math.round(h * 0.8));
      const x = Math.max(10, Math.round((w - W) / 2));
      const y = Math.max(10, Math.round((h - H) / 2));

      setWhatIDoSize({ width: W, height: H });
      setWindowPositions(prev => ({
        ...prev,
        whatIDo: { x, y }
      }));
    } else {
      const W = Math.min(680, Math.round(w * 0.85));
      const H = Math.min(560, Math.round(h * 0.75));
      const x = Math.max(10, Math.round((w - W) / 2));
      const y = Math.max(10, Math.round((h - H) / 2));

      setWhereILiveSize({ width: W, height: H });
      setWindowPositions(prev => ({
        ...prev,
        whereILive: { x, y }
      }));
    }
  };

  const handleResizeStart = (
    e: React.PointerEvent,
    windowId: "whatIDo" | "whereILive",
    direction: "right" | "bottom" | "both"
  ) => {
    e.preventDefault();
    e.stopPropagation();
    bringToFront(windowId);

    const size = windowId === "whatIDo" ? whatIDoSize : whereILiveSize;
    const startWidth = size.width;
    const startHeight = size.height;
    const startX = e.clientX;
    const startY = e.clientY;

    const handlePointerMove = (moveEvent: PointerEvent) => {
      const deltaX = moveEvent.clientX - startX;
      const deltaY = moveEvent.clientY - startY;

      let newWidth = startWidth;
      let newHeight = startHeight;

      if (direction === "right" || direction === "both") {
        const minW = windowId === "whatIDo" ? 640 : 450;
        const maxW = window.innerWidth - 40;
        newWidth = Math.max(minW, Math.min(maxW, startWidth + deltaX));
      }
      if (direction === "bottom" || direction === "both") {
        const minH = windowId === "whatIDo" ? 480 : 380;
        const maxH = window.innerHeight - 100;
        newHeight = Math.max(minH, Math.min(maxH, startHeight + deltaY));
      }

      if (windowId === "whatIDo") {
        setWhatIDoSize({ width: newWidth, height: newHeight });
      } else {
        setWhereILiveSize({ width: newWidth, height: newHeight });
      }
    };

    const handlePointerUp = () => {
      document.removeEventListener("pointermove", handlePointerMove);
      document.removeEventListener("pointerup", handlePointerUp);
    };

    document.addEventListener("pointermove", handlePointerMove);
    document.addEventListener("pointerup", handlePointerUp);
  };

  // Custom customizable images for desktop widgets
  const [images, setImages] = useState(() => {
    return {
      introMov: "assets/4d72a4f824434a55b085828019ca1d77.mp4", // Premium vertical MP4 upload
      bwPortrait: "assets/p1.jpg", // p1 on landing page
      sunsetPortrait: "assets/p2.jpg", // p2 on landing page
      domePhoto: "assets/p6.jpg" // p6 on landing page
    };
  });

  // Video playback states for intro.MOV
  const introVideoRef = useRef<HTMLVideoElement | null>(null);
  const [introVideoPlaying, setIntroVideoPlaying] = useState(true);
  const [introVideoMuted, setIntroVideoMuted] = useState(false);
  const [videoError, setVideoError] = useState(false);

  useEffect(() => {
    setVideoError(false);
  }, [images.introMov]);

  useEffect(() => {
    const video = introVideoRef.current;
    if (!video || videoError) return;

    video.muted = introVideoMuted;

    if (introVideoPlaying) {
      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise.catch((error) => {
          console.log("Autoplay with audio was blocked, falling back to muted autoplay:", error);
          setIntroVideoMuted(true);
          video.muted = true;
          video.play().catch((e) => {
            console.log("Unmuted/muted video playback failed, using static fallback:", e);
            setVideoError(true);
          });
        });
      }
    } else {
      video.pause();
    }
  }, [introVideoPlaying, introVideoMuted, images.introMov, videoError]);

  const [selectedPhotoKey, setSelectedPhotoKey] = useState<string | null>(null);
  const [tempPhotoUrl, setTempPhotoUrl] = useState("");
  const [isConvertingHeic, setIsConvertingHeic] = useState(false);
  const [heicError, setHeicError] = useState("");

  const [wishes, setWishes] = useState<WishNote[]>(() => {
    try {
      const saved = localStorage.getItem("wedding_desktop_wishes");
      return saved ? JSON.parse(saved) : initialWishes;
    } catch {
      return initialWishes;
    }
  });

  const [placedStickers, setPlacedStickers] = useState<PlacedSticker[]>(() => {
    try {
      const saved = localStorage.getItem("wedding_desktop_stickers");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [stampSelection, setStampSelection] = useState<string | null>(null);

  const tabletopRef = useRef<HTMLDivElement>(null);
  const generalUploadRef = useRef<HTMLInputElement>(null);

  // Digital clock logic
  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const bringToFront = (windowId: string) => {
    setActiveWindow(windowId);
  };

  const handleDragEnd = (key: string, info: any) => {
    setWindowPositions(prev => {
      return {
        ...prev,
        [key]: {
          x: prev[key as keyof typeof prev].x + info.offset.x,
          y: prev[key as keyof typeof prev].y + info.offset.y
        }
      };
    });
  };

  const handleUpdateImage = (key: string, url: string) => {
    setImages(prev => {
      return { ...prev, [key]: url };
    });
  };

  const handleAddWish = (newWish: WishNote) => {
    setWishes(prev => {
      const updated = [newWish, ...prev];
      localStorage.setItem("wedding_desktop_wishes", JSON.stringify(updated));
      return updated;
    });
  };

  const handleResetWishes = () => {
    setWishes(() => {
      localStorage.removeItem("wedding_desktop_wishes");
      return initialWishes;
    });
  };

  const toggleWindow = (windowId: string) => {
    setOpenWindows(prev => {
      const willBeOpen = !prev[windowId as keyof typeof prev];
      if (willBeOpen) {
        if (windowId === "whatIDo" || windowId === "whereILive") {
          setTimeout(() => {
            centerWindow(windowId);
          }, 0);
        }
      }
      return {
        ...prev,
        [windowId]: willBeOpen
      };
    });
    bringToFront(windowId);
  };

  const closeWindow = (windowId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setOpenWindows(prev => ({ ...prev, [windowId]: false }));
  };

  const openPhotoPicker = (key: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedPhotoKey(key);
    setTempPhotoUrl(images[key as keyof typeof images]);
    setHeicError("");
    setIsConvertingHeic(false);
    setOpenWindows(prev => ({ ...prev, imagePicker: true }));
    bringToFront("imagePicker");
  };

  const saveCustomPhoto = () => {
    if (selectedPhotoKey && tempPhotoUrl.trim()) {
      handleUpdateImage(selectedPhotoKey, tempPhotoUrl.trim());
    }
    setOpenWindows(prev => ({ ...prev, imagePicker: false }));
    setSelectedPhotoKey(null);
    setHeicError("");
    setIsConvertingHeic(false);
  };

  const uploadBase64Image = async (fileName: string, base64Data: string) => {
    setIsConvertingHeic(true);
    setHeicError("");
    try {
      const response = await fetch("/api/upload-base64", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ filename: fileName, base64Data })
      });
      if (!response.ok) {
        throw new Error(`Upload failed with status ${response.status}`);
      }
      const data = await response.json();
      if (data.success && data.url) {
        setTempPhotoUrl(data.url);
      } else {
        throw new Error(data.error || "Upload failed: unknown server response");
      }
    } catch (err: any) {
      console.error("[App] Upload error:", err);
      // Fallback: save the base64 string directly so they can still see/interact with the app locally
      setTempPhotoUrl(base64Data);
      setHeicError("Image saved to browser state. Server upload failed: " + (err.message || "Network issue"));
    } finally {
      setIsConvertingHeic(false);
    }
  };

  const stampStickerOnDesk = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!stampSelection || !tabletopRef.current) return;

    const rect = tabletopRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left - 24;
    const clickY = e.clientY - rect.top - 24;

    const matchedSticker = availableStickers.find(st => st.id === stampSelection);
    const label = matchedSticker ? matchedSticker.label : "Stamp";

    const newPlaced: PlacedSticker = {
      id: `sticker_${Date.now()}`,
      type: stampSelection,
      label,
      x: clickX,
      y: clickY,
      rotate: -15 + Math.random() * 30,
      scale: 1
    };

    setPlacedStickers(prev => {
      const updated = [...prev, newPlaced];
      localStorage.setItem("wedding_desktop_stickers", JSON.stringify(updated));
      return updated;
    });
    setStampSelection(null); // release stamp item
  };

  const deletePlacedSticker = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setPlacedStickers(prev => {
      const updated = prev.filter(st => st.id !== id);
      localStorage.setItem("wedding_desktop_stickers", JSON.stringify(updated));
      return updated;
    });
  };

  const organizeDesktop = () => {
    const w = window.innerWidth;
    const h = window.innerHeight;
    const newPositions = getResponsivePositions(w, h);
    setWindowPositions(newPositions);
    localStorage.removeItem("wedding_desktop_positions");

    // Reset sizes to default centered sizes
    const activeH = h - 42;
    setWhatIDoSize({
      width: Math.min(1024, Math.round(w * 0.9)),
      height: Math.min(680, Math.round(activeH * 0.8))
    });
    setWhereILiveSize({
      width: Math.min(672, Math.round(w * 0.85)),
      height: Math.min(560, Math.round(activeH * 0.75))
    });

    // Smoothly keep currently open windows open, while opening aboutMe/introMov,
    // and resetting the active window focus.
    setOpenWindows(prev => ({
      ...prev,
      aboutMe: true,
      introMov: true,
      imagePicker: false
    }));

    setOrganizeCount(prev => prev + 1);
  };

  return (
    <div
      className="h-screen relative flex flex-col overflow-hidden text-stone-800 font-sans select-none"
      style={{
        backgroundImage: "url('https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=2000&q=80')",
        backgroundSize: "cover",
        backgroundPosition: "center"
      }}
    >
      {/* Top macOS-style transclucent Menu Bar */}
      <nav id="macos-menubar" className="bg-white/70 backdrop-blur-md text-stone-900 border-b border-white/20 select-none font-sans z-50 text-xs px-4 py-2 flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-4">
          <span className="font-semibold text-sm cursor-pointer hover:opacity-80 transition-opacity" onClick={organizeDesktop} title="Reset & Organize Desktop">
            
          </span>
          <span className="font-bold cursor-pointer" onClick={organizeDesktop}>Finder</span>
          <span className="hover:opacity-75 transition-opacity cursor-pointer hidden md:inline" onClick={() => toggleWindow("aboutMe")}>About</span>
          <span className="hover:opacity-75 transition-opacity cursor-pointer hidden md:inline" onClick={() => toggleWindow("introMov")}>intro.MOV</span>
          <span className="hover:opacity-75 transition-opacity cursor-pointer hidden sm:inline" onClick={() => toggleWindow("whatIDo")}>Wedding Memories</span>
          <span className="hover:opacity-75 transition-opacity cursor-pointer hidden lg:inline" onClick={() => toggleWindow("whereILive")}>Travel Guide</span>
          <span className="text-[#bf9c56] font-semibold text-[10px] bg-amber-100/70 border border-amber-200 px-2 py-0.5 rounded-full select-none inline-flex items-center gap-1 leading-none shadow-3xs animate-pulse">
            ❤️ Deep &amp; Harmy Wedding Registry • Jan 24, 2025
          </span>
        </div>

        {/* Dynamic system chimes stream and live digital clock */}
        <div className="flex items-center gap-3">
          <AudioPlayer />

          <button
            onClick={organizeDesktop}
            className="cursor-pointer text-[10px] bg-stone-800/80 hover:bg-stone-900 text-white font-medium hover:text-[#fff9e6] px-2.5 py-1 rounded-sm border border-stone-700/50 transition-colors shadow-2xs select-none"
            title="Sort windows back into standard position"
          >
            Organize Desktop
          </button>

          <div className="bg-white/50 border border-white/40 px-2.5 py-1 rounded-sm font-mono text-[11px] font-semibold tracking-wider text-stone-800 shadow-3xs cursor-default">
            {time.toLocaleDateString("en-US", { month: "short", day: "numeric" })} • {time.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
          </div>
        </div>
      </nav>

      {/* Main Draggable Desktop Workspace Area */}
      <main
        ref={tabletopRef}
        onClick={stampStickerOnDesk}
        className={`flex-1 relative p-4 overflow-hidden ${stampSelection ? "cursor-crosshair" : "cursor-default"}`}
      >
        {/* Helper Badge for Stamp Stamp Mode */}
        <AnimatePresence>
          {stampSelection && (
            <motion.div
              initial={{ y: -50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -50, opacity: 0 }}
              className="absolute top-4 left-1/2 -translate-x-1/2 bg-[#bf9c56] text-white py-2 px-5 rounded-full border border-amber-600/30 text-xs font-serif font-bold shadow-lg z-50 pointer-events-none flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4 animate-spin" />
              <span>Click anywhere on the open sunset beach desktop to Stamp a sticker!</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Standard Folders Desktop Icons Panel (Aligned top right or right side like real macOS) */}
        <div className="absolute right-6 top-10 flex flex-col gap-6 z-10 items-center">

          {/* Folder 1 Shortcut */}
          <div
            onDoubleClick={() => toggleWindow("whatIDo")}
            onClick={() => { toggleWindow("whatIDo"); bringToFront("whatIDo"); }}
            className="group flex flex-col items-center gap-2 text-center cursor-pointer max-w-[110px]"
          >
            <div className="relative p-2 rounded-2xl hover:bg-white/15 transition-all duration-200 active:scale-95">
              <MacOSFolder className="w-[78px] h-[64px]" variant="blue" />
              <div className="absolute bottom-1 right-1 bg-[#bf9c56] w-5 h-5 rounded-full flex items-center justify-center text-[9px] text-white font-bold border border-white shadow-md">
                4
              </div>
            </div>
            <span className="text-[12px] font-medium text-white bg-stone-900/60 px-2.5 py-0.5 rounded-md shadow-md border border-white/10 truncate max-w-full">
              Wedding Memories
            </span>
          </div>

          {/* Folder 3 Shortcut */}
          <div
            onDoubleClick={() => toggleWindow("whereILive")}
            onClick={() => { toggleWindow("whereILive"); bringToFront("whereILive"); }}
            className="group flex flex-col items-center gap-2 text-center cursor-pointer max-w-[110px]"
          >
            <div className="relative p-2 rounded-2xl hover:bg-white/15 transition-all duration-200 active:scale-95">
              <MacOSFolder className="w-[78px] h-[64px]" variant="green" />
              <div className="absolute bottom-1 right-1 bg-emerald-500 w-5 h-5 rounded-full flex items-center justify-center text-[9px] text-white font-bold border border-white shadow-md">
                🗺️
              </div>
            </div>
            <span className="text-[12px] font-medium text-white bg-stone-900/60 px-2.5 py-0.5 rounded-md shadow-md border border-white/10 truncate max-w-full">
              Where I Live
            </span>
          </div>

        </div>

        {/* Render stamped interactive stickers draggable on tabletop */}
        {placedStickers.map((st) => {
          let stickerEmoji = "❤️";
          if (st.type === "st_rings") stickerEmoji = "💍";
          else if (st.type === "st_sparkles") stickerEmoji = "✨";
          else if (st.type === "st_flowers") stickerEmoji = "💐";
          else if (st.type === "st_love_letter") stickerEmoji = "💌";

          return (
            <motion.div
              key={st.id}
              drag
              dragConstraints={tabletopRef}
              dragElastic={0.12}
              dragMomentum={true}
              dragTransition={{ power: 0.15, timeConstant: 180 }}
              initial={{ x: st.x, y: st.y, rotate: st.rotate }}
              onDragEnd={(event, info) => {
                setPlacedStickers(prev => {
                  const updated = prev.map(item => {
                    if (item.id === st.id) {
                      return {
                        ...item,
                        x: item.x + info.offset.x,
                        y: item.y + info.offset.y
                      };
                    }
                    return item;
                  });
                  localStorage.setItem("wedding_desktop_stickers", JSON.stringify(updated));
                  return updated;
                });
              }}
              whileDrag={{ scale: 1.2, zIndex: 100 }}
              whileHover={{ scale: 1.15 }}
              className="absolute select-none cursor-grab active:cursor-grabbing group z-40 p-2 text-4xl filter drop-shadow"
              style={{ width: "fit-content", height: "fit-content" }}
            >
              <span>{stickerEmoji}</span>

              {/* Delete hover helper overlay */}
              <button
                onClick={(e) => deletePlacedSticker(st.id, e)}
                className="absolute -top-3.5 -right-3.5 cursor-pointer bg-red-500 hover:bg-red-600 text-white p-0.5 rounded-full shadow-md scale-0 group-hover:scale-100 transition-transform"
                title="Remove Sticky Asset"
              >
                <X className="w-2.5 h-2.5" />
              </button>
            </motion.div>
          );
        })}

        {/* ================= 1. THE "ABOUT ME 🌷" NOTE WIDGET (Top Left) ================= */}
        {openWindows.aboutMe && (
          <motion.div
            key={`aboutMe-or-${organizeCount}`}
            drag
            dragElastic={0.12}
            dragMomentum={true}
            dragTransition={{ power: 0.15, timeConstant: 200 }}
            dragConstraints={tabletopRef}
            initial={windowPositions.aboutMe}
            onDragStart={() => bringToFront("aboutMe")}
            onDragEnd={(e, info) => handleDragEnd("aboutMe", info)}
            onClick={() => bringToFront("aboutMe")}
            className="absolute max-w-xs w-full bg-[#fefbf7] border border-stone-200 shadow-lg rounded-2xl p-5 select-none font-sans z-20 cursor-grab active:cursor-grabbing"
            style={{
              zIndex: activeWindow === "aboutMe" ? 45 : 20,
              boxShadow: "0 6px 18px rgba(0,0,0,0.08), 0 1px 3px rgba(0,0,0,0.02)"
            }}
          >
            {/* Ribbon Tape top effect */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-2 bg-[#dfc47e]/35 backdrop-blur-xs w-20 h-5 rotate-1 border-x border-dashed border-stone-400/15" />

            <div className="flex justify-between items-center text-[10px] text-stone-400 font-sans tracking-wide mb-2 pt-1 font-semibold uppercase">
              <span>January 24, 2025 at 5:00 PM</span>
              <button
                onClick={(e) => closeWindow("aboutMe", e)}
                className="cursor-pointer text-stone-400 hover:text-stone-700 bg-stone-100/50 hover:bg-stone-200/50 p-2.5 rounded-full text-center hover:scale-110 active:scale-95 transition-all"
                title="Close Window"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              <h3 className="font-serif text-[#bf9c56] font-bold text-sm tracking-wider uppercase">
                ABOUT ME 🌷
              </h3>

              <div className="space-y-2 text-stone-700">
                <h4 className="font-serif text-[#1c1917] font-bold text-lg leading-tight">
                  Hi, I am Deep
                </h4>
                <ul className="space-y-1.5 text-xs text-stone-600 leading-relaxed font-sans font-medium">
                  <li className="flex items-start gap-1 pb-1 border-b border-stone-100">
                    <span className="text-[#bf9c56]">✦</span> I was Harmy's school senior, but the funny catch is we didn't even know each other back then! 😂
                  </li>
                  <li className="flex items-start gap-1 pb-1 border-b border-stone-100">
                    <span className="text-[#bf9c56]">✦</span> Creative designer &amp; developer at heart
                  </li>
                  <li className="flex items-start gap-1 pb-1 border-b border-stone-100">
                    <span className="text-[#bf9c56]">✦</span> Believer that "a good fit fixes a lot"
                  </li>
                  <li className="flex items-start gap-1">
                    <span className="text-[#bf9c56]">✦</span> Reliving our wedding step-by-step
                  </li>
                </ul>
              </div>
            </div>
          </motion.div>
        )}

        {/* ================= 2. THE "intro.MOV" WINDOW WIDGET (Center Portrait) ================= */}
        {openWindows.introMov && (
          <motion.div
            key={`introMov-or-${organizeCount}`}
            drag
            dragElastic={0.12}
            dragMomentum={true}
            dragTransition={{ power: 0.15, timeConstant: 200 }}
            dragConstraints={tabletopRef}
            initial={windowPositions.introMov}
            onDragStart={() => bringToFront("introMov")}
            onDragEnd={(e, info) => handleDragEnd("introMov", info)}
            onClick={() => bringToFront("introMov")}
            className="absolute w-80 rounded-xl bg-white border border-stone-200/50 shadow-2xl overflow-hidden z-25 cursor-grab active:cursor-grabbing"
            style={{
              zIndex: activeWindow === "introMov" ? 45 : 21,
              boxShadow: "0 22px 35px rgba(0,0,0,0.1), 0 3px 10px rgba(0,0,0,0.05)"
            }}
          >
            {/* macOS styled Title Bar */}
            <div className="bg-[#efebdf]/50 border-b border-stone-200 px-3.5 py-2.5 flex items-center justify-between select-none">
              <div className="flex gap-2.5 items-center">
                <span onClick={(e) => closeWindow("introMov", e)} className="cursor-pointer w-5 h-5 rounded-full bg-red-400 border border-red-500 hover:bg-red-500 hover:scale-110 active:scale-95 text-[11px] text-red-800 flex items-center justify-center font-bold" title="Close">×</span>
                <span className="w-5 h-5 rounded-full bg-amber-300 border border-amber-400 text-[11px] text-amber-800 flex items-center justify-center font-bold font-sans" title="Minimize">-</span>
                <span className="w-5 h-5 rounded-full bg-emerald-400 border border-emerald-500" title="Maximize"></span>
              </div>
              <span className="text-[10px] uppercase font-mono font-bold tracking-widest text-stone-600 cursor-default">
                intro.MOV
              </span>
              <div className="w-10"></div>
            </div>

            {/* Video or Picture Inside with Customizer overlay */}
            <div className="relative group aspect-[320/458] bg-stone-100 overflow-hidden">
              {images.introMov && !videoError && (
                images.introMov.toLowerCase().endsWith(".mov") ||
                images.introMov.toLowerCase().endsWith(".mp4") ||
                images.introMov.toLowerCase().endsWith(".webm") ||
                images.introMov.includes("video") ||
                images.introMov.startsWith("data:video/")
              ) ? (
                <>
                  <video
                    ref={introVideoRef}
                    src={cleanAssetPath(images.introMov)}
                    controls={false}
                    loop
                    playsInline
                    autoPlay
                    muted={introVideoMuted}
                    className="w-full h-full object-cover select-none"
                    onError={() => {
                      console.log("Video fail, falling back to static poster view");
                      setVideoError(true);
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      setIntroVideoPlaying(!introVideoPlaying);
                    }}
                  />
                  {/* Overlay buttons to Play/Pause and Mute/Unmute */}
                  <div className="absolute top-2 right-2 flex items-center gap-1.5 z-20">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setIntroVideoPlaying(!introVideoPlaying);
                      }}
                      className="cursor-pointer p-1.5 rounded-full bg-black/60 hover:bg-black/80 backdrop-blur-xs text-white border border-white/20 transition-all active:scale-95"
                      title={introVideoPlaying ? "Pause Video" : "Play Video"}
                    >
                      {introVideoPlaying ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3 fill-white" />}
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setIntroVideoMuted(!introVideoMuted);
                      }}
                      className="cursor-pointer p-1.5 rounded-full bg-black/60 hover:bg-black/80 backdrop-blur-xs text-white border border-white/20 transition-all active:scale-95"
                      title={introVideoMuted ? "Unmute Sound" : "Mute Sound"}
                    >
                      {introVideoMuted ? <VolumeX className="w-3 h-3" /> : <Volume2 className="w-3 h-3" />}
                    </button>
                  </div>
                </>
              ) : (
                <div className="relative w-full h-full">
                  <img
                    src={cleanAssetPath(
                      images.introMov &&
                        !images.introMov.toLowerCase().endsWith(".mov") &&
                        !images.introMov.toLowerCase().endsWith(".mp4") &&
                        !images.introMov.toLowerCase().endsWith(".webm")
                        ? images.introMov
                        : "assets/DEN02596-Edit.JPEG"
                    )}
                    alt="Harmy"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover select-none pointer-events-none"
                  />
                  {videoError && (
                    <div className="absolute inset-x-0 bottom-12 p-3 bg-black/75 backdrop-blur-xs text-white text-[10px] text-center font-sans tracking-wide leading-normal z-20 flex flex-col items-center gap-1 select-none">
                      <span className="font-semibold text-amber-300">Media Playback Notice</span>
                      <span>The video could not be played. This can happen with empty uploads, unsupported encodings, or Apple <b>.MOV</b> formats.</span>
                      <span>Please ensure a valid <b>.MP4 (H.264 encoded)</b> video is uploaded!</span>
                    </div>
                  )}
                </div>
              )}



              {/* Classic watermark caption */}
              <div
                onClick={(e) => {
                  e.stopPropagation();
                  if (!videoError) {
                    setIntroVideoPlaying(!introVideoPlaying);
                  }
                }}
                className="cursor-pointer absolute bottom-2 inset-x-2 bg-black/45 backdrop-blur-xs text-white text-[9px] px-2 py-1 rounded-sm flex justify-between font-mono font-light select-none tracking-tight hover:bg-black/60 transition-colors z-20"
              >
                <div className="flex items-center gap-1.5">
                  <span className={`w-1.5 h-1.5 rounded-full ${videoError ? "bg-amber-400" : introVideoPlaying ? "bg-red-500 animate-pulse" : "bg-stone-500"}`}></span>
                  <span>{videoError ? "COVER" : introVideoPlaying ? "REC ●" : "PAUSED"} {!videoError && (introVideoMuted ? "MUTED" : "SOUND ON")}</span>
                </div>
                <span>HARMY &amp; DEEP</span>
              </div>
            </div>
          </motion.div>
        )}

        {/* ================= 3. SCATTERED PHOTO 1: BLACK & WHITE PORTRAIT ================= */}
        <motion.div
          key={`bwPortrait-or-${organizeCount}`}
          drag
          dragElastic={0.12}
          dragMomentum={true}
          dragTransition={{ power: 0.15, timeConstant: 200 }}
          dragConstraints={tabletopRef}
          initial={windowPositions.bwPortrait}
          onDragStart={() => bringToFront("bwPortrait")}
          onDragEnd={(e, info) => handleDragEnd("bwPortrait", info)}
          onClick={() => bringToFront("bwPortrait")}
          className="absolute w-44 z-15 cursor-grab active:cursor-grabbing"
          style={{
            zIndex: activeWindow === "bwPortrait" ? 45 : 15
          }}
        >
          <div className="p-2 bg-white rounded-lg border border-stone-200/50 shadow-md -rotate-6 hover:-rotate-2 hover:scale-105 hover:shadow-lg transition-all duration-300 ease-out group select-none">
            <div className="relative aspect-[4/5] w-full bg-stone-100 overflow-hidden rounded-md">
              <SafeImage
                src={images.bwPortrait}
                alt="Deep & Harmy memoir picture"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover filter grayscale select-none pointer-events-none"
              />

            </div>
            <div className="pt-2 text-center text-[10px] font-handwritten text-stone-500 uppercase leading-none mt-1 select-none font-bold">
              together forever 💫
            </div>
          </div>
        </motion.div>

        {/* ================= 4. SCATTERED PHOTO 2: Sunset Lookback ================= */}
        <motion.div
          key={`sunsetPortrait-or-${organizeCount}`}
          drag
          dragElastic={0.12}
          dragMomentum={true}
          dragTransition={{ power: 0.15, timeConstant: 200 }}
          dragConstraints={tabletopRef}
          initial={windowPositions.sunsetPortrait}
          onDragStart={() => bringToFront("sunsetPortrait")}
          onDragEnd={(e, info) => handleDragEnd("sunsetPortrait", info)}
          onClick={() => bringToFront("sunsetPortrait")}
          className="absolute w-48 z-15 cursor-grab active:cursor-grabbing"
          style={{
            zIndex: activeWindow === "sunsetPortrait" ? 45 : 15
          }}
        >
          <div className="p-2.5 bg-white rounded-lg border border-stone-200/50 shadow-md -rotate-6 hover:-rotate-3 hover:scale-105 hover:shadow-lg transition-all duration-300 ease-out group select-none">
            <div className="relative aspect-[4/5] w-full bg-stone-100 overflow-hidden rounded-md">
              <SafeImage
                src={images.sunsetPortrait}
                alt="Scenic Lookback"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover select-none pointer-events-none"
              />

            </div>
            <div className="pt-2 text-center text-[10px] font-handwritten text-[#bf9c56] leading-none mt-1 select-none font-bold">
              chasing the sunset sky ✨
            </div>
          </div>
        </motion.div>

        {/* ================= 5. SCATTERED PHOTO 3: PALACE DOME ================= */}
        <motion.div
          key={`domePhoto-or-${organizeCount}`}
          drag
          dragElastic={0.12}
          dragMomentum={true}
          dragTransition={{ power: 0.15, timeConstant: 200 }}
          dragConstraints={tabletopRef}
          initial={windowPositions.domePhoto}
          onDragStart={() => bringToFront("domePhoto")}
          onDragEnd={(e, info) => handleDragEnd("domePhoto", info)}
          onClick={() => bringToFront("domePhoto")}
          className="absolute w-52 z-15 cursor-grab active:cursor-grabbing"
          style={{
            zIndex: activeWindow === "domePhoto" ? 45 : 15
          }}
        >
          <div className="p-2 bg-white rounded-lg border border-stone-200/50 shadow-md -rotate-4 hover:-rotate-1 hover:scale-105 hover:shadow-lg transition-all duration-300 ease-out group select-none">
            <div className="relative aspect-[3/4] w-full bg-stone-100 overflow-hidden rounded-md">
              <SafeImage
                src={images.domePhoto}
                alt="Dome Cathedral"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover select-none pointer-events-none"
              />

            </div>
            <div className="pt-2 text-center text-[10px] font-handwritten text-stone-600 leading-none mt-1 select-none font-bold">
              Umaid Palace Architecture 🏰

            </div>
          </div>
        </motion.div>


        {/* ================= 6. INTERACTIVE FOLDER WINDOW: WEDDING MEMORIES ================= */}
        <AnimatePresence>
          {openWindows.whatIDo && (
            <motion.div
              key={`whatIDo-or-${organizeCount}`}
              drag={isDesktop}
              dragControls={whatIDoDragControls}
              dragListener={false}
              dragElastic={0.15}
              dragMomentum={true}
              dragTransition={{ power: 0.15, timeConstant: 200 }}
              dragConstraints={tabletopRef}
              initial={isDesktop ? {
                x: windowPositions.whatIDo.x,
                y: windowPositions.whatIDo.y,
                scale: 0.4,
                opacity: 0
              } : {
                x: 0,
                y: 0,
                scale: 0.9,
                opacity: 0
              }}
              animate={{
                x: isDesktop ? windowPositions.whatIDo.x : 0,
                y: isDesktop ? windowPositions.whatIDo.y : 0,
                scale: 1,
                opacity: 1
              }}
              exit={{
                scale: 0.4,
                opacity: 0
              }}
              transition={{
                type: "spring",
                stiffness: 300,
                damping: 24
              }}
              onDragStart={() => bringToFront("whatIDo")}
              onDragEnd={(e, info) => handleDragEnd("whatIDo", info)}
              onClick={() => bringToFront("whatIDo")}
              className="absolute rounded-2xl bg-white border border-stone-300 shadow-2xl overflow-hidden z-30 cursor-default text-xs flex flex-col"
              style={{
                zIndex: activeWindow === "whatIDo" ? 48 : 30,
                width: isDesktop ? whatIDoSize.width : "94vw",
                height: isDesktop ? whatIDoSize.height : "80vh",
                left: isDesktop ? 0 : "3vw",
                top: isDesktop ? 0 : "10vh",
              }}
            >
              {/* macOS Header */}
              <div
                onPointerDown={(e) => {
                  if (isDesktop) {
                    whatIDoDragControls.start(e);
                  }
                  bringToFront("whatIDo");
                }}
                className="bg-[#efebdf]/75 border-b border-stone-200 px-4 py-2.5 flex items-center justify-between select-none cursor-grab active:cursor-grabbing hover:bg-[#ebdca6]/20 transition-colors"
              >
                <div className="flex gap-2.5 items-center">
                  <span onClick={(e) => closeWindow("whatIDo", e)} className="cursor-pointer w-5 h-5 rounded-full bg-red-400 border border-red-500 hover:bg-red-500 text-[11px] text-red-800 flex items-center justify-center font-bold" title="Close">×</span>
                  <span onClick={(e) => closeWindow("whatIDo", e)} className="cursor-pointer w-5 h-5 rounded-full bg-amber-300 border border-amber-400 text-[11px] text-amber-800 flex items-center justify-center font-bold font-sans" title="Minimize">-</span>
                  <span className="w-5 h-5 rounded-full bg-emerald-400 border border-emerald-500" title="Maximize"></span>
                </div>
                <div className="flex items-center gap-2 text-[11px] uppercase font-mono font-bold text-stone-600 cursor-default">
                  <MacOSFolder className="w-5 h-4" variant="blue" />
                  <span>Wedding Memories — Registry Chapters &amp; Floating Photos</span>
                </div>
                <div className="w-10"></div>
              </div>

              {/* Renders dynamic interactive story journal timeline inside this window */}
              <div className="flex-1 overflow-auto bg-stone-50 select-text cursor-default pb-2">
                <StoryJournal />
              </div>

              {/* Resize handles (Desktop only) */}
              {isDesktop && (
                <>
                  {/* Right Edge Resize Handle */}
                  <div
                    onPointerDown={(e) => handleResizeStart(e, "whatIDo", "right")}
                    className="absolute top-0 right-0 w-1.5 h-full cursor-ew-resize z-50 hover:bg-black/5"
                  />
                  {/* Bottom Edge Resize Handle */}
                  <div
                    onPointerDown={(e) => handleResizeStart(e, "whatIDo", "bottom")}
                    className="absolute bottom-0 left-0 w-full h-1.5 cursor-ns-resize z-50 hover:bg-black/5"
                  />
                  {/* Bottom-Right Corner Resize Handle */}
                  <div
                    onPointerDown={(e) => handleResizeStart(e, "whatIDo", "both")}
                    className="absolute bottom-0 right-0 w-4 h-4 cursor-nwse-resize z-50 flex items-end justify-end p-[2px]"
                  >
                    <svg className="w-2.5 h-2.5 text-stone-400/70" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="1.2">
                      <line x1="1" y1="9" x2="9" y2="1" />
                      <line x1="4" y1="9" x2="9" y2="4" />
                      <line x1="7" y1="9" x2="9" y2="7" />
                    </svg>
                  </div>
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>


        {/* ================= 8. INTERACTIVE FOLDER WINDOW: WHERE I LIVE (TRAVEL GUIDE) ================= */}
        <AnimatePresence>
          {openWindows.whereILive && (
            <motion.div
              key={`whereILive-or-${organizeCount}`}
              drag={isDesktop}
              dragControls={whereILiveDragControls}
              dragListener={false}
              dragElastic={0.15}
              dragMomentum={true}
              dragTransition={{ power: 0.15, timeConstant: 200 }}
              dragConstraints={tabletopRef}
              initial={isDesktop ? {
                x: windowPositions.whereILive.x,
                y: windowPositions.whereILive.y,
                scale: 0.4,
                opacity: 0
              } : {
                x: 0,
                y: 0,
                scale: 0.9,
                opacity: 0
              }}
              animate={{
                x: isDesktop ? windowPositions.whereILive.x : 0,
                y: isDesktop ? windowPositions.whereILive.y : 0,
                scale: 1,
                opacity: 1
              }}
              exit={{
                scale: 0.4,
                opacity: 0
              }}
              transition={{
                type: "spring",
                stiffness: 300,
                damping: 24
              }}
              onDragStart={() => bringToFront("whereILive")}
              onDragEnd={(e, info) => handleDragEnd("whereILive", info)}
              onClick={() => bringToFront("whereILive")}
              className="absolute rounded-2xl bg-[#faf6f0] border border-stone-300 shadow-2xl overflow-hidden z-30 cursor-default text-xs flex flex-col"
              style={{
                zIndex: activeWindow === "whereILive" ? 48 : 30,
                width: isDesktop ? whereILiveSize.width : "94vw",
                height: isDesktop ? whereILiveSize.height : "80vh",
                left: isDesktop ? 0 : "3vw",
                top: isDesktop ? 0 : "10vh",
              }}
            >
              {/* macOS Header */}
              <div
                onPointerDown={(e) => {
                  if (isDesktop) {
                    whereILiveDragControls.start(e);
                  }
                  bringToFront("whereILive");
                }}
                className="bg-[#efebdf]/75 border-b border-stone-200 px-4 py-2.5 flex items-center justify-between select-none cursor-grab active:cursor-grabbing hover:bg-[#ebdca6]/20 transition-colors"
              >
                <div className="flex gap-2.5 items-center">
                  <span onClick={(e) => closeWindow("whereILive", e)} className="cursor-pointer w-5 h-5 rounded-full bg-red-400 border border-red-500 hover:bg-red-500 text-[11px] text-red-800 flex items-center justify-center font-bold" title="Close">×</span>
                  <span onClick={(e) => closeWindow("whereILive", e)} className="cursor-pointer w-5 h-5 rounded-full bg-amber-300 border border-amber-400 text-[11px] text-amber-800 flex items-center justify-center font-bold font-sans" title="Minimize">-</span>
                  <span className="w-5 h-5 rounded-full bg-emerald-400 border border-emerald-500" title="Maximize"></span>
                </div>
                <div className="flex items-center gap-2 text-[11px] uppercase font-mono font-bold text-stone-600 cursor-default">
                  <MacOSFolder className="w-5 h-4" variant="green" />
                  <span>Where I Live — Location Postcard Map</span>
                </div>
                <div className="w-10"></div>
              </div>

              {/* Travel Guide Content */}
              <div className="flex-1 overflow-auto p-6 md:p-8 select-text cursor-default space-y-5 pb-8">
                <div className="flex justify-between items-start border-b border-stone-200 pb-3.5">
                  <div>
                    <h3 className="font-serif text-stone-900 text-xl md:text-2xl font-bold">Ahmedabad, India</h3>
                    <p className="text-[11px] text-stone-500 font-mono tracking-tight uppercase mt-0.5">Home coordinates &amp; sacred roots</p>
                  </div>
                  <span className="text-xs md:text-sm font-serif font-semibold text-[#bf9c56] px-3.5 py-1.5 bg-amber-50 rounded-md border border-amber-200 shadow-3xs flex items-center gap-1.5">
                    <Home className="w-4 h-4" /> OUR HOME
                  </span>
                </div>

                <div className="flex flex-col md:flex-row gap-6 items-stretch">
                  {/* Image Left */}
                  <div className="w-full md:w-[45%] bg-white p-2.5 border border-stone-200/60 rounded-xl shadow-2xs flex flex-col justify-between">
                    <SafeImage
                      src="/assets/Home.jpg"
                      alt="Our Home in Ahmedabad"
                      className="w-full aspect-square md:aspect-[3/4] object-cover rounded-lg pointer-events-none select-none"
                    />
                    <div className="mt-2.5 text-center">
                      <span className="font-mono text-[10px] md:text-[11px] text-[#bf9c56] uppercase tracking-wider bg-amber-50 px-2.5 py-1 rounded border border-amber-100/50">
                        📍 23.0225° N, 72.5714° E
                      </span>
                    </div>
                  </div>

                  {/* Content Right */}
                  <div className="w-full md:w-[55%] flex flex-col justify-between space-y-4">
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-[#bf9c56] font-mono text-[10px] md:text-[11px] uppercase font-bold tracking-wider">
                        <MapPin className="w-3.5 h-3.5 text-[#bf9c56] shrink-0" />
                        <span>Vibrant Gujarat</span>
                      </div>

                      <p className="text-xs md:text-[13px] text-stone-600 leading-relaxed font-sans">
                        Where our beautiful story resides, and where our grand royal rituals, swimming pool laughter, and legal marriage declarations were initiated on January 24, 2025.
                      </p>

                      <p className="text-xs md:text-[13px] text-stone-500 leading-relaxed font-sans">
                        It is the cradle of our family roots, vibrant local street food, historic stepwells, and the warmest festive traditions that bind us.
                      </p>
                    </div>

                    <div className="bg-[#ebdca6]/10 border border-[#ebdca6]/30 p-3.5 rounded-lg text-[11px] md:text-[12px] text-stone-700 font-serif italic relative overflow-hidden leading-relaxed">
                      "Home isn't just a coordinate map. It is where our family gathers, where laughter is shared, and where our hearts belong."
                    </div>
                  </div>
                </div>
              </div>

              {/* Resize handles (Desktop only) */}
              {isDesktop && (
                <>
                  {/* Right Edge Resize Handle */}
                  <div
                    onPointerDown={(e) => handleResizeStart(e, "whereILive", "right")}
                    className="absolute top-0 right-0 w-1.5 h-full cursor-ew-resize z-50 hover:bg-black/5"
                  />
                  {/* Bottom Edge Resize Handle */}
                  <div
                    onPointerDown={(e) => handleResizeStart(e, "whereILive", "bottom")}
                    className="absolute bottom-0 left-0 w-full h-1.5 cursor-ns-resize z-50 hover:bg-black/5"
                  />
                  {/* Bottom-Right Corner Resize Handle */}
                  <div
                    onPointerDown={(e) => handleResizeStart(e, "whereILive", "both")}
                    className="absolute bottom-0 right-0 w-4 h-4 cursor-nwse-resize z-50 flex items-end justify-end p-[2px]"
                  >
                    <svg className="w-2.5 h-2.5 text-stone-400/70" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="1.2">
                      <line x1="1" y1="9" x2="9" y2="1" />
                      <line x1="4" y1="9" x2="9" y2="4" />
                      <line x1="7" y1="9" x2="9" y2="7" />
                    </svg>
                  </div>
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>

      </main>


    </div>
  );
}
