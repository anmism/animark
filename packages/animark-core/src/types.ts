import type { Parent, Node } from "unist";

// ─── Animation config (lives on inline :animate[text]{...} nodes) ─────────────

export type AnimationType =
  // Basic entrances
  | "fade" | "slide" | "scale" | "blur" | "bounce" | "flip" | "glitch"
  // Transform entrances
  | "translateX" | "translateY" | "translateZ"
  | "rotate" | "rotateX" | "rotateY"
  | "skew" | "scaleX" | "scaleY"
  // Special entrances
  | "appear" | "reveal"
  // Basic exits
  | "fade-out" | "slide-out" | "scale-out" | "blur-out"
  // Transform exits
  | "translateX-out" | "translateY-out" | "translateZ-out"
  | "rotate-out" | "rotateX-out" | "rotateY-out"
  | "skew-out" | "scaleX-out" | "scaleY-out"
  // Special exits
  | "disappear" | "reveal-out"
  // Attention (looping)
  | "pulse" | "shake" | "wiggle" | "heartbeat" | "float" | "hover-lift" | "magnetic"
  // Text
  | "typing" | "highlight";

export type AnimationDirection = "up" | "down" | "left" | "right";

/**
 * Triggers are scoped to their parent :::animation block.
 *
 * - "auto"           plays immediately when the block mounts / replays
 * - "on-click"       waits for the Nth click-advance within this block
 * - "with-previous"  starts at the same time as the previous inline element
 * - "after-previous" starts after the previous inline element finishes
 */
export type AnimationTrigger =
  | "auto"
  | "on-click"
  | "with-previous"
  | "after-previous";

export interface AnimationConfig {
  type: AnimationType;
  trigger: AnimationTrigger;
  delay: number;
  duration: number;
  stagger: number;
  direction: AnimationDirection;
  easing: string;
  amount?: number;
  repeat?: number;
}

// ─── AST nodes ────────────────────────────────────────────────────────────────

/**
 * Produced by :::animation{...} container directive.
 * Acts as a scope boundary — carries NO animation itself.
 * The React renderer wraps its children in a BlockProvider + controls.
 */
export interface AnimarkScopeNode extends Parent {
  type: "animarkScope";
  children: Node[];
}

/**
 * Produced by :animate[text]{...} text directive.
 * This is the actual animated element.
 */
export interface AnimarkInlineNode extends Parent {
  type: "animarkInline";
  animation: AnimationConfig;
  children: Node[];
}

// ─── Plugin options ───────────────────────────────────────────────────────────

export interface RemarkAnimarkOptions {
  defaults?: Partial<AnimationConfig>;
  allowUnknownTypes?: boolean;
}
