import React from "react";
import type { AnimationTrigger } from "animark-core";
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
    register: (id: string, delay: number, duration: number, trigger: AnimationTrigger) => BlockRegistration;
    unregister: (id: string) => void;
}
export declare const BlockContext: React.Context<BlockContextValue>;
export declare function useBlockContext(): BlockContextValue;
interface BlockProviderProps {
    children: React.ReactNode;
    autoPlay?: boolean;
}
export declare function BlockProvider({ children, autoPlay }: BlockProviderProps): import("react/jsx-runtime").JSX.Element;
export {};
//# sourceMappingURL=BlockContext.d.ts.map