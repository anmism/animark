"use client";

import React, { useEffect, useId, useRef, useCallback, useState } from "react";
import type { AnimationConfig } from "animark-core";
import { useBlockContext } from "./BlockContext";

// ─── Classification ───────────────────────────────────────────────────────────

const LOOP_TYPES  = new Set(["pulse","shake","wiggle","heartbeat","float","magnetic"]);
const EXIT_TYPES  = new Set([
  "fade-out","slide-out","scale-out","blur-out",
  "translateX-out","translateY-out","translateZ-out",
  "rotate-out","rotateX-out","rotateY-out",
  "skew-out","scaleX-out","scaleY-out",
  "disappear","reveal-out",
]);

const CLIP_TYPES  = new Set([
  "slide","bounce","translateX","translateY","translateZ",
  "rotate","rotateX","rotateY","skew","flip","glitch",
  "slide-out","translateX-out","translateY-out","translateZ-out",
  "rotate-out","rotateX-out","rotateY-out","skew-out",
]);

// ─── CSS class lookup ─────────────────────────────────────────────────────────

function getClass(type: string, dir: string): string {
  switch (type) {
    case "fade":     return "amk-fade";
    case "scale":    return "amk-scale";
    case "blur":     return "amk-blur";
    case "bounce":   return "amk-bounce";
    case "flip":     return "amk-flip";
    case "glitch":   return "amk-glitch";
    case "appear":   return "amk-appear";
    case "reveal":   return "amk-reveal";
    case "slide":    return `amk-slide-${dir}`;
    case "translateX": return dir === "right" ? "amk-translateX-right" : "amk-translateX-left";
    case "translateY": return dir === "down"  ? "amk-translateY-down"  : "amk-translateY-up";
    case "translateZ": return "amk-translateZ";
    case "rotate":   return dir === "left" ? "amk-rotate-ccw" : "amk-rotate-cw";
    case "rotateX":  return "amk-rotateX";
    case "rotateY":  return "amk-rotateY";
    case "skew":     return "amk-skew";
    case "scaleX":   return "amk-scaleX";
    case "scaleY":   return "amk-scaleY";
    case "fade-out": return "amk-fade-out";
    case "scale-out": return "amk-scale-out";
    case "blur-out": return "amk-blur-out";
    case "disappear": return "amk-disappear";
    case "reveal-out": return "amk-reveal-out";
    case "slide-out": return `amk-slide-out-${dir}`;
    case "translateX-out": return dir === "right" ? "amk-translateX-out-right" : "amk-translateX-out-left";
    case "translateY-out": return dir === "down"  ? "amk-translateY-out-down"  : "amk-translateY-out-up";
    case "translateZ-out": return "amk-translateZ-out";
    case "rotate-out": return dir === "left" ? "amk-rotate-out-ccw" : "amk-rotate-out-cw";
    case "rotateX-out": return "amk-rotateX-out";
    case "rotateY-out": return "amk-rotateY-out";
    case "skew-out":  return "amk-skew-out";
    case "scaleX-out": return "amk-scaleX-out";
    case "scaleY-out": return "amk-scaleY-out";
    case "pulse":     return "amk-pulse";
    case "shake":     return "amk-shake";
    case "wiggle":    return "amk-wiggle";
    case "heartbeat": return "amk-heartbeat";
    case "float":     return "amk-float";
    case "hover-lift": return "amk-hover-lift";
    case "magnetic":  return "amk-magnetic";
    case "typing":    return "amk-typing";
    case "highlight": return "amk-highlight";
    default:          return "amk-fade";
  }
}

function getAmountVars(type: string, amount?: number): Record<string, string> {
  if (amount == null) return {};
  switch (type) {
    case "translateX": case "translateY":
    case "translateX-out": case "translateY-out":
      return { "--amk-amount": `${amount}px`, "--amk-amount-neg": `-${amount}px` };
    case "translateZ": case "translateZ-out":
      return { "--amk-amount": `${-Math.abs(amount)}px` };
    case "rotate": case "rotateX": case "rotateY":
    case "rotate-out": case "rotateX-out": case "rotateY-out":
    case "skew": case "skew-out": case "wiggle":
      return { "--amk-amount": `${amount}deg` };
    case "shake":
      return { "--amk-amount": `${amount}px` };
    case "heartbeat":
      return { "--amk-amount": String(amount) };
    case "float":
      return { "--amk-amount": `${-Math.abs(amount)}px` };
    default:
      return {};
  }
}

// ─── Typing helper ────────────────────────────────────────────────────────────

function TypingInner({ children, baseDelay, charDelay, playKey }: {
  children: React.ReactNode;
  baseDelay: number;
  charDelay: number;
  playKey: number;
}) {
  let idx = 0;

  function process(node: React.ReactNode): React.ReactNode {
    if (typeof node === "string") {
      return node.split("").map((ch) => {
        const i = idx++;
        return (
          <span key={`${playKey}-${i}`} className="amk-typing-char"
            style={{ animationDelay: `${baseDelay + i * charDelay}ms` }}>
            {ch === " " ? "\u00A0" : ch}
          </span>
        );
      });
    }
    if (React.isValidElement<{ children?: React.ReactNode }>(node)) {
      return React.cloneElement(node, {}, React.Children.map(node.props.children, process));
    }
    if (Array.isArray(node)) return node.map((c, i) => <React.Fragment key={i}>{process(c)}</React.Fragment>);
    return node;
  }

  return <>{React.Children.map(children, c => process(c))}</>;
}

// ─── Magnetic helper ──────────────────────────────────────────────────────────

function Magnetic({ children, strength, playCount }: {
  children: React.ReactNode; strength: number; playCount: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);

  const onMove = useCallback((e: MouseEvent) => {
    const el = ref.current; if (!el) return;
    const r = el.getBoundingClientRect();
    const dx = ((e.clientX - (r.left + r.width  / 2)) / (r.width  / 2)) * strength;
    const dy = ((e.clientY - (r.top  + r.height / 2)) / (r.height / 2)) * strength;
    el.style.transform = `translate(${dx}px,${dy}px)`;
  }, [strength]);

  const onLeave = useCallback(() => {
    const el = ref.current; if (!el) return;
    el.style.transition = "transform 0.4s ease";
    el.style.transform  = "translate(0,0)";
  }, []);

  useEffect(() => {
    const el = ref.current; if (!el) return;
    el.addEventListener("mousemove", onMove);
    el.addEventListener("mouseleave", onLeave);
    return () => { el.removeEventListener("mousemove", onMove); el.removeEventListener("mouseleave", onLeave); };
  }, [onMove, onLeave]);

  return (
    <span ref={ref} key={playCount} className="amk-wrapper amk-magnetic"
      style={{ display: "inline-block", transition: "transform 0.15s ease" }}>
      {children}
    </span>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────

export interface CSSAnimatedWrapperProps {
  animation: AnimationConfig;
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export const CSSAnimatedWrapper: React.FC<CSSAnimatedWrapperProps> = ({
  animation, children, className = "", style = {},
}) => {
  const id = useId();
  const { playCount, register, unregister, clickCount } = useBlockContext();

  const { type, direction = "up", trigger = "auto", delay = 0, duration = 600 } = animation;
  const charDelay = animation.stagger || 30;
  const isLoop = LOOP_TYPES.has(type);
  const isExit = EXIT_TYPES.has(type);

  const [reg, setReg] = useState<{ effectiveDelay: number; clickIndex: number } | null>(null);

  useEffect(() => {
    const r = register(id, delay, duration, trigger);
    setReg(r);
    return () => unregister(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, playCount]);

  // ── Derived ───────────────────────────────────────────────────────────────
  const isSequenced = trigger === "with-previous" || trigger === "after-previous";
  const isOnClick   = trigger === "on-click";
  const effectiveDelay = isSequenced ? (reg?.effectiveDelay ?? delay) : delay;
  const clickIndex     = reg?.clickIndex ?? 0;
  const isActivated = clickIndex === 0 || clickCount >= clickIndex;

  // Guards: render invisible placeholder until ready
  if (isSequenced && reg === null) {
    return <span style={{ visibility: isExit ? "visible" : "hidden" }}>{children}</span>;
  }
  if (!isActivated) {
  return <span style={{ visibility: isExit ? "visible" : "hidden" }}>{children}</span>;
}

  const animKey = isOnClick
    ? `${playCount}-click-${clickIndex}`
    : playCount;

  const iterCount = (() => {
    if (animation.repeat === 0 || (animation.repeat == null && isLoop)) return "infinite";
    if (animation.repeat != null && animation.repeat > 0) return String(animation.repeat);
    return "1";
  })();

  // ── Text: typing ──────────────────────────────────────────────────────────
  if (type === "typing") {
    return (
      <span key={animKey} className={`amk-wrapper amk-typing ${className}`.trim()} style={style}>
        <TypingInner baseDelay={effectiveDelay} charDelay={charDelay} playKey={animKey as number}>
          {children}
        </TypingInner>
      </span>
    );
  }

  // ── Text: highlight ───────────────────────────────────────────────────────
  if (type === "highlight") {
    return (
      <span
        key={animKey}
        className={`amk-highlight amk-highlight--inline ${className}`.trim()}
        style={{ "--amk-hl-duration": `${duration}ms`, "--amk-hl-delay": `${effectiveDelay}ms`, ...style } as React.CSSProperties}
      >
        {children}
      </span>
    );
  }

  // ── Attention: hover-lift ─────────────────────────────────────────────────
  if (type === "hover-lift") {
    return <span className={`amk-hover-lift ${className}`.trim()} style={style}>{children}</span>;
  }

  // ── Attention: magnetic ───────────────────────────────────────────────────
  if (type === "magnetic") {
    return (
      <Magnetic strength={animation.amount ?? 12} playCount={animKey as number}>
        {children}
      </Magnetic>
    );
  }

  // ── Standard keyframe ─────────────────────────────────────────────────────
  const animClass = getClass(type, direction);
  const amountVars = getAmountVars(type, animation.amount);

  const wrapperClass = isLoop
    ? `amk-loop ${animClass} ${className}`
    : isExit
      ? `amk-exit ${animClass} ${className}`
      : `amk-wrapper ${animClass} ${className}`;

  const inlineStyle: React.CSSProperties = {
    animationDuration:       `${duration}ms`,
    animationDelay:          `${effectiveDelay}ms`,
    animationIterationCount: iterCount,
    "--amk-duration": `${duration}ms`,
    "--amk-delay":    `${effectiveDelay}ms`,
    ...(Object.keys(amountVars).length > 0 && (amountVars as React.CSSProperties)),
    ...style,
  } as React.CSSProperties;

  const inner = (
    <span
      key={animKey}
      className={wrapperClass.trim()}
      style={{ ...inlineStyle, display: "inline-block", verticalAlign: "bottom" }}
    >
      {children}
    </span>
  );

  // Clip overflow for translate/rotate/skew
  return CLIP_TYPES.has(type) ? (
    <span style={{ overflow: "hidden", display: "inline-block", verticalAlign: "bottom" }}>
      {inner}
    </span>
  ) : inner;
};
