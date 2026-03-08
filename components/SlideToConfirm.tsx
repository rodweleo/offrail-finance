import { useState, useRef, useCallback, useEffect } from "react";
import { ArrowRight, Check, Loader2 } from "lucide-react";

interface SlideToConfirmProps {
  onConfirm: () => void;
  loading?: boolean;
  success?: boolean;
  label?: string;
}

const TRACK_PADDING = 4;
const THUMB_SIZE = 52;

const SlideToConfirm = ({
  onConfirm,
  loading,
  success,
  label = "Slide to confirm",
}: SlideToConfirmProps) => {
  const trackRef = useRef<HTMLDivElement>(null);
  const [offset, setOffset] = useState(0);
  const [dragging, setDragging] = useState(false);
  const [slid, setSlid] = useState(false);

  const getMaxOffset = useCallback(() => {
    if (!trackRef.current) return 200;
    return trackRef.current.offsetWidth - THUMB_SIZE - TRACK_PADDING * 2;
  }, []);

  // When success becomes true, trigger haptic
  useEffect(() => {
    if (success && navigator.vibrate) {
      navigator.vibrate(80);
    }
  }, [success]);

  const handleStart = () => {
    if (loading || slid) return;
    setDragging(true);
  };

  const handleMove = useCallback(
    (clientX: number) => {
      if (!dragging || !trackRef.current || slid) return;
      const rect = trackRef.current.getBoundingClientRect();
      const x = clientX - rect.left - TRACK_PADDING - THUMB_SIZE / 2;
      const max = getMaxOffset();
      setOffset(Math.max(0, Math.min(x, max)));
    },
    [dragging, slid, getMaxOffset],
  );

  const handleEnd = useCallback(() => {
    if (!dragging) return;
    setDragging(false);
    const max = getMaxOffset();
    if (offset >= max * 0.85) {
      setOffset(max);
      setSlid(true);
      onConfirm();
    } else {
      setOffset(0);
    }
  }, [dragging, offset, getMaxOffset, onConfirm]);

  useEffect(() => {
    if (success || !loading) {
      const timer = setTimeout(() => {
        setOffset(0);
        setSlid(false);
      }, 1200);

      return () => clearTimeout(timer);
    }
  }, [success, loading]);

  const progress = getMaxOffset() > 0 ? offset / getMaxOffset() : 0;

  const thumbIcon = loading ? (
    <Loader2 className="w-5 h-5 text-primary-foreground animate-spin" />
  ) : success ? (
    <Check className="w-6 h-6 text-primary-foreground animate-success-pop" />
  ) : (
    <ArrowRight className="w-6 h-6 text-primary-foreground" />
  );

  const thumbBg = slid
    ? success
      ? "bg-green-500 shadow-lg shadow-green-500/30"
      : "bg-primary shadow-lg"
    : "bg-primary shadow-lg";

  return (
    <div
      ref={trackRef}
      className="relative w-full h-[60px] rounded-2xl bg-primary/10 overflow-hidden select-none touch-none"
      onMouseMove={(e) => handleMove(e.clientX)}
      onMouseUp={handleEnd}
      onMouseLeave={handleEnd}
      onTouchMove={(e) => handleMove(e.touches[0].clientX)}
      onTouchEnd={handleEnd}
    >
      {/* Progress fill */}
      <div
        className="absolute inset-y-0 left-0 bg-primary/20 rounded-2xl transition-none"
        style={{ width: offset + THUMB_SIZE + TRACK_PADDING * 2 }}
      />

      {/* Label */}
      <div
        className="absolute inset-0 flex items-center justify-center text-sm font-semibold text-primary transition-opacity"
        style={{ opacity: slid ? 0 : 1 - progress * 1.5 }}
      >
        {label}
        {!slid && <ArrowRight className="w-4 h-4 ml-1.5 animate-pulse" />}
      </div>

      {/* Thumb */}
      <div
        className={`absolute top-1 rounded-xl w-[52px] h-[52px] flex items-center justify-center transition-colors cursor-grab active:cursor-grabbing ${thumbBg}`}
        style={{
          left: TRACK_PADDING + offset,
          transition: dragging
            ? "none"
            : "left 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        }}
        onMouseDown={handleStart}
        onTouchStart={handleStart}
      >
        {thumbIcon}
      </div>
    </div>
  );
};

export default SlideToConfirm;
