"use client";
import { jsx as _jsx } from "react/jsx-runtime";
import { createContext, useContext, useState, useCallback, useRef, } from "react";
const defaultValue = {
    playCount: 0,
    playing: false,
    clickCount: 0,
    totalClickSteps: 0,
    replay: () => { },
    nextStep: () => { },
    prevStep: () => { },
    register: (_id, delay) => ({ effectiveDelay: delay, clickIndex: 0 }),
    unregister: () => { },
};
export const BlockContext = createContext(defaultValue);
export function useBlockContext() {
    return useContext(BlockContext);
}
export function BlockProvider({ children, autoPlay = true }) {
    const [playCount, setPlayCount] = useState(() => autoPlay ? 1 : 0);
    const [playing, setPlaying] = useState(false);
    const [clickCount, setClickCount] = useState(0);
    const [totalClickSteps, setTotalClickSteps] = useState(0);
    const metaRef = useRef(new Map());
    const lastRef = useRef(null);
    const clickCounterRef = useRef(0);
    const rafRef = useRef(null);
    // ── register ─────────────────────────────────────────────────────────────
    const register = useCallback((id, delay, duration, trigger) => {
        // Stable across StrictMode double-invoke
        const cached = metaRef.current.get(id);
        if (cached)
            return { effectiveDelay: cached.effectiveDelay, clickIndex: cached.clickIndex };
        const prev = lastRef.current;
        let effectiveDelay;
        let clickIndex = 0;
        switch (trigger) {
            case "with-previous":
                effectiveDelay = (prev?.effectiveDelay ?? 0) + delay;
                clickIndex = prev?.clickIndex ?? 0;
                break;
            case "after-previous":
                effectiveDelay = prev != null
                    ? prev.effectiveDelay + prev.duration + delay
                    : delay;
                clickIndex = prev?.clickIndex ?? 0;
                break;
            case "on-click":
                clickCounterRef.current += 1;
                clickIndex = clickCounterRef.current;
                effectiveDelay = 0;
                setTotalClickSteps(clickCounterRef.current);
                break;
            default: // "auto"
                effectiveDelay = delay;
        }
        const meta = { effectiveDelay, duration, clickIndex };
        metaRef.current.set(id, meta);
        lastRef.current = meta;
        return { effectiveDelay, clickIndex };
    }, []);
    const unregister = useCallback((id) => {
        metaRef.current.delete(id);
    }, []);
    // ── replay ────────────────────────────────────────────────────────────────
    const replay = useCallback(() => {
        if (rafRef.current != null) {
            cancelAnimationFrame(rafRef.current);
            rafRef.current = null;
        }
        metaRef.current.clear();
        lastRef.current = null;
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
        const tick = (now) => {
            if (now - start >= total) {
                setPlaying(false);
                rafRef.current = null;
            }
            else {
                rafRef.current = requestAnimationFrame(tick);
            }
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
    return (_jsx(BlockContext.Provider, { value: {
            playCount, playing,
            clickCount, totalClickSteps,
            replay, nextStep, prevStep,
            register, unregister,
        }, children: children }));
}
//# sourceMappingURL=BlockContext.js.map