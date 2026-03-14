// ─── Main component ───────────────────────────────────────────────────────────
export { Animark } from "./Animark";
export type { AnimarkProps } from "./Animark";

// ─── Controls (standalone, must be inside BlockProvider / Animark.Provider) ──
export { AnimarkControls } from "./AnimarkControls";
export type { AnimarkControlsProps, AnimarkControlsTheme } from "./AnimarkControls";

// ─── Context (headless usage) ─────────────────────────────────────────────────
export { BlockProvider, BlockContext, useBlockContext } from "./BlockContext";
export type { BlockContextValue, BlockRegistration } from "./BlockContext";

// ─── Primitive ────────────────────────────────────────────────────────────────
export { CSSAnimatedWrapper } from "./CSSAnimatedWrapper";
export type { CSSAnimatedWrapperProps } from "./CSSAnimatedWrapper";

// ─── Core re-exports ──────────────────────────────────────────────────────────
export { remarkAnimark } from "animark-core";
export type {
  AnimationConfig,
  AnimationType,
  AnimationDirection,
  AnimationTrigger,
  RemarkAnimarkOptions,
} from "animark-core";
