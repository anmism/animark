"use client";
import { jsx as _jsx, Fragment as _Fragment } from "react/jsx-runtime";
import React, { useEffect, useId, useRef, useCallback, useState } from "react";
import { useBlockContext } from "./BlockContext";
// ─── Classification ───────────────────────────────────────────────────────────
const LOOP_TYPES = new Set(["pulse", "shake", "wiggle", "heartbeat", "float", "magnetic"]);
const EXIT_TYPES = new Set([
    "fade-out", "slide-out", "scale-out", "blur-out",
    "translateX-out", "translateY-out", "translateZ-out",
    "rotate-out", "rotateX-out", "rotateY-out",
    "skew-out", "scaleX-out", "scaleY-out",
    "disappear", "reveal-out",
]);
const CLIP_TYPES = new Set([
    "slide", "bounce", "translateX", "translateY", "translateZ",
    "rotate", "rotateX", "rotateY", "skew", "flip", "glitch",
    "slide-out", "translateX-out", "translateY-out", "translateZ-out",
    "rotate-out", "rotateX-out", "rotateY-out", "skew-out",
]);
// ─── CSS class lookup ─────────────────────────────────────────────────────────
function getClass(type, dir) {
    switch (type) {
        case "fade": return "amk-fade";
        case "scale": return "amk-scale";
        case "blur": return "amk-blur";
        case "bounce": return "amk-bounce";
        case "flip": return "amk-flip";
        case "glitch": return "amk-glitch";
        case "appear": return "amk-appear";
        case "reveal": return "amk-reveal";
        case "slide": return `amk-slide-${dir}`;
        case "translateX": return dir === "right" ? "amk-translateX-right" : "amk-translateX-left";
        case "translateY": return dir === "down" ? "amk-translateY-down" : "amk-translateY-up";
        case "translateZ": return "amk-translateZ";
        case "rotate": return dir === "left" ? "amk-rotate-ccw" : "amk-rotate-cw";
        case "rotateX": return "amk-rotateX";
        case "rotateY": return "amk-rotateY";
        case "skew": return "amk-skew";
        case "scaleX": return "amk-scaleX";
        case "scaleY": return "amk-scaleY";
        case "fade-out": return "amk-fade-out";
        case "scale-out": return "amk-scale-out";
        case "blur-out": return "amk-blur-out";
        case "disappear": return "amk-disappear";
        case "reveal-out": return "amk-reveal-out";
        case "slide-out": return `amk-slide-out-${dir}`;
        case "translateX-out": return dir === "right" ? "amk-translateX-out-right" : "amk-translateX-out-left";
        case "translateY-out": return dir === "down" ? "amk-translateY-out-down" : "amk-translateY-out-up";
        case "translateZ-out": return "amk-translateZ-out";
        case "rotate-out": return dir === "left" ? "amk-rotate-out-ccw" : "amk-rotate-out-cw";
        case "rotateX-out": return "amk-rotateX-out";
        case "rotateY-out": return "amk-rotateY-out";
        case "skew-out": return "amk-skew-out";
        case "scaleX-out": return "amk-scaleX-out";
        case "scaleY-out": return "amk-scaleY-out";
        case "pulse": return "amk-pulse";
        case "shake": return "amk-shake";
        case "wiggle": return "amk-wiggle";
        case "heartbeat": return "amk-heartbeat";
        case "float": return "amk-float";
        case "hover-lift": return "amk-hover-lift";
        case "magnetic": return "amk-magnetic";
        case "typing": return "amk-typing";
        case "highlight": return "amk-highlight";
        default: return "amk-fade";
    }
}
function getAmountVars(type, amount) {
    if (amount == null)
        return {};
    switch (type) {
        case "translateX":
        case "translateY":
        case "translateX-out":
        case "translateY-out":
            return { "--amk-amount": `${amount}px`, "--amk-amount-neg": `-${amount}px` };
        case "translateZ":
        case "translateZ-out":
            return { "--amk-amount": `${-Math.abs(amount)}px` };
        case "rotate":
        case "rotateX":
        case "rotateY":
        case "rotate-out":
        case "rotateX-out":
        case "rotateY-out":
        case "skew":
        case "skew-out":
        case "wiggle":
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
function TypingInner({ children, baseDelay, charDelay, playKey }) {
    let idx = 0;
    function process(node) {
        if (typeof node === "string") {
            return node.split("").map((ch) => {
                const i = idx++;
                return (_jsx("span", { className: "amk-typing-char", style: { animationDelay: `${baseDelay + i * charDelay}ms` }, children: ch === " " ? "\u00A0" : ch }, `${playKey}-${i}`));
            });
        }
        if (React.isValidElement(node)) {
            return React.cloneElement(node, {}, React.Children.map(node.props.children, process));
        }
        if (Array.isArray(node))
            return node.map((c, i) => _jsx(React.Fragment, { children: process(c) }, i));
        return node;
    }
    return _jsx(_Fragment, { children: React.Children.map(children, c => process(c)) });
}
// ─── Magnetic helper ──────────────────────────────────────────────────────────
function Magnetic({ children, strength, playCount }) {
    const ref = useRef(null);
    const onMove = useCallback((e) => {
        const el = ref.current;
        if (!el)
            return;
        const r = el.getBoundingClientRect();
        const dx = ((e.clientX - (r.left + r.width / 2)) / (r.width / 2)) * strength;
        const dy = ((e.clientY - (r.top + r.height / 2)) / (r.height / 2)) * strength;
        el.style.transform = `translate(${dx}px,${dy}px)`;
    }, [strength]);
    const onLeave = useCallback(() => {
        const el = ref.current;
        if (!el)
            return;
        el.style.transition = "transform 0.4s ease";
        el.style.transform = "translate(0,0)";
    }, []);
    useEffect(() => {
        const el = ref.current;
        if (!el)
            return;
        el.addEventListener("mousemove", onMove);
        el.addEventListener("mouseleave", onLeave);
        return () => { el.removeEventListener("mousemove", onMove); el.removeEventListener("mouseleave", onLeave); };
    }, [onMove, onLeave]);
    return (_jsx("span", { ref: ref, className: "amk-wrapper amk-magnetic", style: { display: "inline-block", transition: "transform 0.15s ease" }, children: children }, playCount));
}
export const CSSAnimatedWrapper = ({ animation, children, className = "", style = {}, }) => {
    const id = useId();
    const { playCount, register, unregister, clickCount } = useBlockContext();
    const { type, direction = "up", trigger = "auto", delay = 0, duration = 600 } = animation;
    const charDelay = animation.stagger || 30;
    const isLoop = LOOP_TYPES.has(type);
    const isExit = EXIT_TYPES.has(type);
    const [reg, setReg] = useState(null);
    useEffect(() => {
        const r = register(id, delay, duration, trigger);
        setReg(r);
        return () => unregister(id);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id, playCount]);
    // ── Derived ───────────────────────────────────────────────────────────────
    const isSequenced = trigger === "with-previous" || trigger === "after-previous";
    const isOnClick = trigger === "on-click";
    const effectiveDelay = isSequenced ? (reg?.effectiveDelay ?? delay) : delay;
    const clickIndex = reg?.clickIndex ?? 0;
    const isActivated = clickIndex === 0 || clickCount >= clickIndex;
    // Guards: render invisible placeholder until ready
    if (isSequenced && reg === null) {
        return _jsx("span", { style: { visibility: isExit ? "visible" : "hidden" }, children: children });
    }
    if (!isActivated) {
        return _jsx("span", { style: { visibility: isExit ? "visible" : "hidden" }, children: children });
    }
    const animKey = isOnClick
        ? `${playCount}-click-${clickIndex}`
        : playCount;
    const iterCount = (() => {
        if (animation.repeat === 0 || (animation.repeat == null && isLoop))
            return "infinite";
        if (animation.repeat != null && animation.repeat > 0)
            return String(animation.repeat);
        return "1";
    })();
    // ── Text: typing ──────────────────────────────────────────────────────────
    if (type === "typing") {
        return (_jsx("span", { className: `amk-wrapper amk-typing ${className}`.trim(), style: style, children: _jsx(TypingInner, { baseDelay: effectiveDelay, charDelay: charDelay, playKey: animKey, children: children }) }, animKey));
    }
    // ── Text: highlight ───────────────────────────────────────────────────────
    if (type === "highlight") {
        return (_jsx("span", { className: `amk-highlight amk-highlight--inline ${className}`.trim(), style: { "--amk-hl-duration": `${duration}ms`, "--amk-hl-delay": `${effectiveDelay}ms`, ...style }, children: children }, animKey));
    }
    // ── Attention: hover-lift ─────────────────────────────────────────────────
    if (type === "hover-lift") {
        return _jsx("span", { className: `amk-hover-lift ${className}`.trim(), style: style, children: children });
    }
    // ── Attention: magnetic ───────────────────────────────────────────────────
    if (type === "magnetic") {
        return (_jsx(Magnetic, { strength: animation.amount ?? 12, playCount: animKey, children: children }));
    }
    // ── Standard keyframe ─────────────────────────────────────────────────────
    const animClass = getClass(type, direction);
    const amountVars = getAmountVars(type, animation.amount);
    const wrapperClass = isLoop
        ? `amk-loop ${animClass} ${className}`
        : isExit
            ? `amk-exit ${animClass} ${className}`
            : `amk-wrapper ${animClass} ${className}`;
    const inlineStyle = {
        animationDuration: `${duration}ms`,
        animationDelay: `${effectiveDelay}ms`,
        animationIterationCount: iterCount,
        "--amk-duration": `${duration}ms`,
        "--amk-delay": `${effectiveDelay}ms`,
        ...(Object.keys(amountVars).length > 0 && amountVars),
        ...style,
    };
    const inner = (_jsx("span", { className: wrapperClass.trim(), style: { ...inlineStyle, display: "inline-block", verticalAlign: "bottom" }, children: children }, animKey));
    // Clip overflow for translate/rotate/skew
    return CLIP_TYPES.has(type) ? (_jsx("span", { style: { overflow: "hidden", display: "inline-block", verticalAlign: "bottom" }, children: inner })) : inner;
};
//# sourceMappingURL=CSSAnimatedWrapper.js.map