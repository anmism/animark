import { Plugin } from 'unified';
import { Root } from 'mdast';
import { Parent, Node } from 'unist';

type AnimationType = "fade" | "slide" | "scale" | "blur" | "bounce" | "flip" | "glitch" | "translateX" | "translateY" | "translateZ" | "rotate" | "rotateX" | "rotateY" | "skew" | "scaleX" | "scaleY" | "appear" | "reveal" | "fade-out" | "slide-out" | "scale-out" | "blur-out" | "translateX-out" | "translateY-out" | "translateZ-out" | "rotate-out" | "rotateX-out" | "rotateY-out" | "skew-out" | "scaleX-out" | "scaleY-out" | "disappear" | "reveal-out" | "pulse" | "shake" | "wiggle" | "heartbeat" | "float" | "hover-lift" | "magnetic" | "typing" | "highlight";
type AnimationDirection = "up" | "down" | "left" | "right";
/**
 * Triggers are scoped to their parent :::animation block.
 *
 * - "auto"           plays immediately when the block mounts / replays
 * - "on-click"       waits for the Nth click-advance within this block
 * - "with-previous"  starts at the same time as the previous inline element
 * - "after-previous" starts after the previous inline element finishes
 */
type AnimationTrigger = "auto" | "on-click" | "with-previous" | "after-previous";
interface AnimationConfig {
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
/**
 * Produced by :::animation{...} container directive.
 * Acts as a scope boundary — carries NO animation itself.
 * The React renderer wraps its children in a BlockProvider + controls.
 */
interface AnimarkScopeNode extends Parent {
    type: "animarkScope";
    children: Node[];
}
/**
 * Produced by :animate[text]{...} text directive.
 * This is the actual animated element.
 */
interface AnimarkInlineNode extends Parent {
    type: "animarkInline";
    animation: AnimationConfig;
    children: Node[];
}
interface RemarkAnimarkOptions {
    defaults?: Partial<AnimationConfig>;
    allowUnknownTypes?: boolean;
}

/**
 * remarkAnimark
 *
 * Two transforms:
 *
 * 1. :::animation{...} container directive
 *    → becomes a <div data-amk-scope="true"> wrapper.
 *    The wrapper itself has NO animation. It is purely a scope boundary that
 *    the React renderer uses to mount an isolated BlockProvider + controls.
 *    Any attributes on :::animation are ignored (reserved for future use).
 *
 * 2. :animate[text]{...} text directive  (must be inside :::animation)
 *    → becomes a <span data-amk="true" data-amk-type="..." ...>
 *    This is the actual animated element.
 *
 * Normal markdown outside :::animation blocks renders completely untouched.
 */
declare const remarkAnimark: Plugin<[RemarkAnimarkOptions?], Root>;

declare const DEFAULT_ANIMATION_CONFIG: AnimationConfig;
declare const VALID_TYPES: Set<string>;
declare const VALID_TRIGGERS: Set<string>;
declare const VALID_DIRECTIONS: Set<string>;

type RawAttrs = Record<string, string | null | undefined>;
declare function parseAttributes(attrs: RawAttrs, defaults: AnimationConfig, allowUnknownTypes: boolean): AnimationConfig;

export { type AnimarkInlineNode, type AnimarkScopeNode, type AnimationConfig, type AnimationDirection, type AnimationTrigger, type AnimationType, DEFAULT_ANIMATION_CONFIG, type RemarkAnimarkOptions, VALID_DIRECTIONS, VALID_TRIGGERS, VALID_TYPES, parseAttributes, remarkAnimark };
