"use client";

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useRef,
} from "react";
import type { AnimationTrigger } from "animark-core";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface BlockRegistration {
  /** CSS animation-delay this element should use after sequencing is resolved */
  effectiveDelay: number;
  /**
   * For on-click elements: which click number reveals this (1-based).
   * 0 = not click-gated.
   */
  clickIndex: number;
}

export interface BlockContextValue {
  /** Increments on every Replay — causes all CSS animations to restart */
  playCount: number;
  /** True while the auto-play animation is running */
  playing: boolean;
  /** How many click-advances have happened in this scope */
  clickCount: number;
  /** Total distinct on-click steps registered in this scope */
  totalClickSteps: number;
  /** Restart all animations from zero */
  replay: () => void;
  /** Reveal the next on-click element */
  nextStep: () => void;
  /** Hide the most recently revealed on-click element */
  prevStep: () => void;
  /**
   * Called by each inline :animate span on mount.
   * Returns the resolved effectiveDelay + clickIndex for that element.
   */
  register: (
    id: string,
    delay: number,
    duration: number,
    trigger: AnimationTrigger,
  ) => BlockRegistration;
  unregister: (id: string) => void;
}

const defaultValue: BlockContextValue = {
  playCount: 0,
  playing: false,
  clickCount: 0,
  totalClickSteps: 0,
  replay: () => {},
  nextStep: () => {},
  prevStep: () => {},
  register: (_id, delay) => ({ effectiveDelay: delay, clickIndex: 0 }),
  unregister: () => {},
};

export const BlockContext = createContext<BlockContextValue>(defaultValue);

export function useBlockContext() {
  return useContext(BlockContext);
}

// ─── Provider ─────────────────────────────────────────────────────────────────

interface BlockProviderProps {
  children: React.ReactNode;
  autoPlay?: boolean;
}

interface ElementMeta {
  effectiveDelay: number;
  duration: number;
  clickIndex: number;
}

export function BlockProvider({ children, autoPlay = true }: BlockProviderProps) {
  const [playCount,       setPlayCount]       = useState(() => autoPlay ? 1 : 0);
  const [playing,         setPlaying]         = useState(false);
  const [clickCount,      setClickCount]      = useState(0);
  const [totalClickSteps, setTotalClickSteps] = useState(0);

  const metaRef         = useRef<Map<string, ElementMeta>>(new Map());
  const lastRef         = useRef<ElementMeta | null>(null);
  const clickCounterRef = useRef(0);
  const rafRef          = useRef<number | null>(null);

  // ── register ─────────────────────────────────────────────────────────────
  const register = useCallback(
    (id: string, delay: number, duration: number, trigger: AnimationTrigger): BlockRegistration => {
      // Stable across StrictMode double-invoke
      const cached = metaRef.current.get(id);
      if (cached) return { effectiveDelay: cached.effectiveDelay, clickIndex: cached.clickIndex };

      const prev = lastRef.current;
      let effectiveDelay: number;
      let clickIndex = 0;

      switch (trigger) {
        case "with-previous":
          effectiveDelay = (prev?.effectiveDelay ?? 0) + delay;
          clickIndex     = prev?.clickIndex ?? 0;
          break;
        case "after-previous":
          effectiveDelay = prev != null
            ? prev.effectiveDelay + prev.duration + delay
            : delay;
          clickIndex = prev?.clickIndex ?? 0;
          break;
        case "on-click":
          clickCounterRef.current += 1;
          clickIndex     = clickCounterRef.current;
          effectiveDelay = 0;
          setTotalClickSteps(clickCounterRef.current);
          break;
        default: // "auto"
          effectiveDelay = delay;
      }

      const meta: ElementMeta = { effectiveDelay, duration, clickIndex };
      metaRef.current.set(id, meta);
      lastRef.current = meta;
      return { effectiveDelay, clickIndex };
    },
    [],
  );

  const unregister = useCallback((id: string) => {
    metaRef.current.delete(id);
  }, []);

  // ── replay ────────────────────────────────────────────────────────────────
  const replay = useCallback(() => {
    if (rafRef.current != null) { cancelAnimationFrame(rafRef.current); rafRef.current = null; }

    metaRef.current.clear();
    lastRef.current       = null;
    clickCounterRef.current = 0;

    setClickCount(0);
    setTotalClickSteps(0);
    setPlaying(true);
    setPlayCount(c => c + 1);

    // Estimate total duration for "playing" flag
    const total = (() => {
      let max = 0;
      metaRef.current.forEach(({ effectiveDelay, duration }) => {
        max = Math.max(max, effectiveDelay + duration);
      });
      return max || 1200;
    })();

    const start = performance.now();
    const tick = (now: number) => {
      if (now - start >= total) { setPlaying(false); rafRef.current = null; }
      else { rafRef.current = requestAnimationFrame(tick); }
    };
    rafRef.current = requestAnimationFrame(tick);
  }, []);

  // ── step navigation ───────────────────────────────────────────────────────
  const nextStep = useCallback(() => {
    setClickCount(c => Math.min(c + 1, clickCounterRef.current));
  }, []);

  const prevStep = useCallback(() => {
    setClickCount(c => Math.max(c - 1, 0));
  }, []);

  return (
    <BlockContext.Provider value={{
      playCount, playing,
      clickCount, totalClickSteps,
      replay, nextStep, prevStep,
      register, unregister,
    }}>
      {children}
    </BlockContext.Provider>
  );
}
