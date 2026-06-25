import { useState, useEffect, useRef } from "react";
import { Music, Volume2, VolumeX } from "lucide-react";

export function AudioPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioContextRef = useRef<AudioContext | null>(null);
  const intervalIdRef = useRef<NodeJS.Timeout | null>(null);
  const scheduledNodesRef = useRef<AudioNode[]>([]);

  const startMusic = () => {
    try {
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      
      const ctx = audioContextRef.current;
      if (ctx.state === "suspended") {
        ctx.resume();
      }

      // Romatic arpeggio chords in F Major & C Major (F - C - Dm - Bb / C major music box vibe)
      // Notes: C4=261.63, E4=329.63, G4=392.00, A4=440.00, B4=493.88, C5=523.25
      const pentatonic = [261.63, 293.66, 329.63, 392.00, 440.00, 523.25, 587.33, 659.25];
      let beat = 0;

      const playChime = (freq: number, time: number, volume = 0.15) => {
        if (!ctx) return;
        
        const osc = ctx.createOscillator();
        const gainNode = ctx.createGain();
        
        // Music box timbre: mix of sine and triangle with soft attack
        osc.type = Math.random() > 0.6 ? "triangle" : "sine";
        osc.frequency.setValueAtTime(freq, time);
        
        // Smooth exponential gain curve
        gainNode.gain.setValueAtTime(0, time);
        gainNode.gain.linearRampToValueAtTime(volume, time + 0.1);
        gainNode.gain.exponentialRampToValueAtTime(0.001, time + 2.5);
        
        osc.connect(gainNode);
        gainNode.connect(ctx.destination);
        
        osc.start(time);
        osc.stop(time + 2.6);

        scheduledNodesRef.current.push(osc);
        scheduledNodesRef.current.push(gainNode);
      };

      const tick = () => {
        const now = ctx.currentTime;
        
        // Clear old completed nodes from ref to avoid leaks
        scheduledNodesRef.current = scheduledNodesRef.current.filter((node: any) => {
          try {
            // Check if node is done
            return now - node.context.currentTime < 3;
          } catch {
            return false;
          }
        });

        // Arpeggiate melody
        const chordIndex = Math.floor(beat / 4) % 4; // 4 chords
        // Golden chord progression chords
        let chordFreqs: number[] = [];
        if (chordIndex === 0) { // C Major: C, E, G, C
          chordFreqs = [261.63, 329.63, 392.00, 523.25];
        } else if (chordIndex === 1) { // G Major: G, B, D, G
          chordFreqs = [196.00, 246.94, 293.66, 392.00];
        } else if (chordIndex === 2) { // A minor: A, C, E, A
          chordFreqs = [220.00, 261.63, 329.63, 440.00];
        } else { // F Major: F, A, C, F
          chordFreqs = [174.61, 220.00, 261.63, 349.23];
        }

        const noteIndex = beat % 4;
        const baseNote = chordFreqs[noteIndex];
        
        // Main arpeggio
        playChime(baseNote, now, 0.08);

        // High twinkling chimes randomly
        if (Math.random() > 0.5) {
          const highPitch = pentatonic[Math.floor(Math.random() * pentatonic.length)] * 2;
          playChime(highPitch, now + 0.2, 0.03);
        }

        beat++;
      };

      // Run sequencer tick every 500ms (120 bpm, 8th notes/quarter notes)
      tick();
      intervalIdRef.current = setInterval(tick, 600);
      setIsPlaying(true);
    } catch (err) {
      console.warn("Could not start Web Audio API synth", err);
    }
  };

  const stopMusic = () => {
    if (intervalIdRef.current) {
      clearInterval(intervalIdRef.current);
      intervalIdRef.current = null;
    }
    // Fade out or close context to stop all sound
    if (audioContextRef.current) {
      audioContextRef.current.suspend();
    }
    setIsPlaying(false);
  };

  const toggleMusic = () => {
    if (isPlaying) {
      stopMusic();
    } else {
      startMusic();
    }
  };

  useEffect(() => {
    return () => {
      if (intervalIdRef.current) {
        clearInterval(intervalIdRef.current);
      }
    };
  }, []);

  return (
    <div className="flex items-center gap-3 bg-[white]/70 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-[#e8dfca] shadow-sm select-none">
      <Music className={`w-4 h-4 text-[#bf9c56] ${isPlaying ? 'animate-spin' : ''}`} style={{ animationDuration: '6s' }} />
      <span className="text-xs font-serif text-[#6b5d44] tracking-wide hidden sm:inline">
        {isPlaying ? "Chimes of Love Playing" : "Play Theme Music"}
      </span>
      <button
        onClick={toggleMusic}
        className="cursor-pointer p-1 rounded-full text-[#bf9c56] hover:bg-[#FAF6F0] transition-colors focus:outline-hidden"
        title={isPlaying ? "Mute Music" : "Play Ambient Soundtrack"}
      >
        {isPlaying ? (
          <div className="flex items-center gap-1.5">
            {/* simple equalizer bar animation */}
            <div className="flex gap-0.5 items-end h-3 mr-1">
              <span className="w-0.5 bg-[#bf9c56] rounded-sm animate-bounce h-2.5" style={{ animationDelay: '0.1s', animationDuration: '0.6s' }}></span>
              <span className="w-0.5 bg-[#bf9c56] rounded-sm animate-bounce h-1.5" style={{ animationDelay: '0.3s', animationDuration: '0.9s' }}></span>
              <span className="w-0.5 bg-[#bf9c56] rounded-sm animate-bounce h-3" style={{ animationDelay: '0.2s', animationDuration: '0.7s' }}></span>
            </div>
            <Volume2 className="w-4 h-4" />
          </div>
        ) : (
          <VolumeX className="w-4 h-4 text-stone-400" />
        )}
      </button>
    </div>
  );
}
