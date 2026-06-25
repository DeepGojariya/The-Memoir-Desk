import React, { useState, useEffect } from "react";
import { Home } from "lucide-react";

// Global cache to keep converted HEIC blobs alive so they load instantly on first render of any subsequent mount
const heicCache = new Map<string, string>();

export function cleanAssetPath(pathStr: string): string {
  if (pathStr && pathStr.startsWith("/assets/")) {
    return pathStr.substring(1);
  }
  return pathStr;
}

export function getFallbackImage(src: string): string {
  if (!src) return "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1000&q=80";
  
  const lowers = src.toLowerCase();
  
  // Custom m1-m5 local files are now fully populated and valid, so we should map them to themselves or beautiful general wedding placeholders.
  if (lowers.includes("m1.jpg") || lowers.includes("m1.jpeg")) {
    return "assets/m1.jpg";
  }
  if (lowers.includes("m2.jpg") || lowers.includes("m2.jpeg")) {
    return "assets/m2.jpg";
  }
  if (lowers.includes("m3.jpg") || lowers.includes("m3.jpeg")) {
    return "assets/m3.jpg";
  }
  if (lowers.includes("m4.jpg") || lowers.includes("m4.jpeg")) {
    return "assets/m4.JPG";
  }
  if (lowers.includes("m5.jpg") || lowers.includes("m5.jpeg")) {
    return "assets/m5.jpg";
  }

  // Custom h1-h5 local files
  if (lowers.includes("h1.jpg") || lowers.includes("h1.jpeg")) {
    return "assets/h1.jpg";
  }
  if (lowers.includes("h2.jpg") || lowers.includes("h2.jpeg")) {
    return "assets/h2.jpg";
  }
  if (lowers.includes("h3.jpg") || lowers.includes("h3.jpeg")) {
    return "assets/h3.jpg";
  }
  if (lowers.includes("h4.jpg") || lowers.includes("h4.jpeg")) {
    return "assets/h4.jpg";
  }
  if (lowers.includes("h5.jpg") || lowers.includes("h5.jpeg")) {
    return "assets/h5.jpg";
  }

  // Custom p1-p6 local files (handling exact extensions / cases)
  if (lowers.includes("p1.jpg") || lowers.includes("p1.jpeg") || lowers.includes("p1.png")) {
    return "assets/p1.jpg";
  }
  if (lowers.includes("p2.jpg") || lowers.includes("p2.jpeg") || lowers.includes("p2.png")) {
    return "assets/p2.jpg";
  }
  if (lowers.includes("p3.jpg") || lowers.includes("p3.jpeg") || lowers.includes("p3.png")) {
    return "assets/p3.JPG";
  }
  if (lowers.includes("p4.jpg") || lowers.includes("p4.jpeg") || lowers.includes("p4.png")) {
    return "assets/p4.JPG";
  }
  if (lowers.includes("p5.jpg") || lowers.includes("p5.jpeg") || lowers.includes("p5.png")) {
    return "assets/p5.png";
  }
  if (lowers.includes("p6.jpg") || lowers.includes("p6.jpeg") || lowers.includes("p6.png")) {
    return "assets/p6.jpg";
  }

  // Custom s1-s5 local files (handling exact extensions / cases)
  if (lowers.includes("s1.jpg") || lowers.includes("s1.jpeg") || lowers.includes("s1.png")) {
    return "assets/s1.jpg";
  }
  if (lowers.includes("s2.jpg") || lowers.includes("s2.jpeg") || lowers.includes("s2.png")) {
    return "assets/s2.jpg";
  }
  if (lowers.includes("s3.jpg") || lowers.includes("s3.jpeg") || lowers.includes("s3.png")) {
    return "assets/s3.jpg";
  }
  if (lowers.includes("s4.jpg") || lowers.includes("s4.jpeg") || lowers.includes("s4.png")) {
    return "assets/s4.jpg";
  }
  if (lowers.includes("s5.jpg") || lowers.includes("s5.jpeg") || lowers.includes("s5.png")) {
    return "assets/s5.jpg";
  }

  // General fallbacks
  if (lowers.includes("bwportrait")) {
    return "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1000&q=80";
  }
  if (lowers.includes("sunsetportrait")) {
    return "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=1000&q=80";
  }
  if (lowers.includes("domephoto")) {
    return "https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=1000&q=80";
  }
  if (lowers.includes("home.jpg") || lowers.includes("home.jpeg")) {
    return "https://images.unsplash.com/photo-1605649487212-47bdab064df7?auto=format&fit=crop&w=1000&q=80";
  }
  if (lowers.includes("intromov.jpg") || lowers.includes("intromov.jpeg")) {
    return "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1000&q=80";
  }
  
  // Default to a gorgeous general wedding backup
  return "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1000&q=80";
}

export function SafeImage({ src, alt, className, ...props }: React.ImgHTMLAttributes<HTMLImageElement> & { src: string }) {
  const cleanedSrc = cleanAssetPath(src);
  const isHeic = cleanedSrc ? (cleanedSrc.toLowerCase().endsWith(".heic") || cleanedSrc.toLowerCase().endsWith(".heif")) : false;
  const cachedUrl = isHeic ? heicCache.get(cleanedSrc) : cleanedSrc;

  const [imgUrl, setImgUrl] = useState<string>(cachedUrl || cleanedSrc || "");
  const [loading, setLoading] = useState<boolean>(isHeic && !cachedUrl);
  const [error, setError] = useState<boolean>(false);
  const [isFallback, setIsFallback] = useState<boolean>(false);

  useEffect(() => {
    if (!cleanedSrc) return;

    // Reset state on search source update
    setIsFallback(false);
    setError(false);

    if (!isHeic) {
      setImgUrl(cleanedSrc);
      setLoading(false);
      return;
    }

    if (heicCache.has(cleanedSrc)) {
      setImgUrl(heicCache.get(cleanedSrc)!);
      setLoading(false);
      return;
    }

    let active = true;
    setLoading(true);

    fetch(cleanedSrc)
      .then(async (response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const blob = await response.blob();
        if (blob.size === 0) {
          throw new Error("Blob is empty - waiting for upload or invalid file");
        }
        return blob;
      })
      .then(async (blob) => {
        const heic2Module = await import("heic2any");
        const heic2anyFn = (heic2Module.default || heic2Module) as any;
        return heic2anyFn({
          blob,
          toType: "image/jpeg",
          quality: 0.8
        });
      })
      .then((converted) => {
        if (!active) return;
        const actualBlob = Array.isArray(converted) ? converted[0] : converted;
        const objectUrl = URL.createObjectURL(actualBlob);
        heicCache.set(cleanedSrc, objectUrl);
        setImgUrl(objectUrl);
        setLoading(false);
      })
      .catch((err) => {
        console.warn("Could not load/convert HEIC file:", cleanedSrc, err);
        if (active) {
          setError(true);
          setLoading(false);
          // Set to fallback immediately on load error
          setImgUrl(getFallbackImage(cleanedSrc));
        }
      });

    return () => {
      active = false;
    };
  }, [cleanedSrc, isHeic]);

  const handleError = () => {
    if (!isFallback) {
      setImgUrl(getFallbackImage(cleanedSrc));
      setIsFallback(true);
    } else {
      setImgUrl("https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1000&q=80");
      setError(true);
    }
  };

  if (loading) {
    return (
      <div className={`flex flex-col items-center justify-center bg-stone-100 text-stone-500 font-serif text-[10px] rounded-md border border-stone-200 p-4 ${className}`}>
        <span>🔄 Processing Image...</span>
      </div>
    );
  }

  const isHome = src && src.toLowerCase().includes("home.jpg");
  if (error && isHome) {
    return (
      <div className={`flex flex-col items-center justify-center bg-amber-50/50 text-[#bf9c56] font-serif p-4 rounded-md border border-[#e8dfca] text-center ${className}`}>
        <Home className="w-5 h-5 text-[#bf9c56] mb-1.5 opacity-80 animate-pulse" />
        <span className="text-[11px] font-bold text-stone-700">Ahmedabad, India</span>
        <span className="text-[9px] text-[#bf9c56] font-mono mt-1 select-none">
          Click customizer or edit files to upload Home.jpg
        </span>
      </div>
    );
  }

  return (
    <img 
      src={imgUrl || getFallbackImage(src)} 
      alt={alt} 
      className={className} 
      onError={handleError}
      {...props} 
    />
  );
}
