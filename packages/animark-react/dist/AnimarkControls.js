"use client";
import { Fragment as _Fragment, jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useBlockContext } from "./BlockContext";
export function AnimarkControls({ showNavigation = true, showStepCount = true, className = "", style = {}, theme = {}, labels = {}, render, }) {
    const ctx = useBlockContext();
    if (render)
        return _jsx(_Fragment, { children: render(ctx) });
    const containerStyle = {
        display: "flex", alignItems: "center", gap: 10,
        padding: "6px 0", flexWrap: "wrap",
        ...theme.container, ...style,
    };
    const btn = {
        padding: "4px 12px", border: "1px solid currentColor",
        borderRadius: 5, background: "transparent",
        fontSize: 12, cursor: "pointer",
        fontFamily: "inherit", transition: "opacity 0.15s",
        userSelect: "none",
        ...theme.button,
    };
    return (_jsxs("div", { className: `amk-controls ${className}`.trim(), style: containerStyle, children: [_jsx("button", { onClick: ctx.replay, disabled: ctx.playing, "aria-label": "Replay", style: { ...btn, opacity: ctx.playing ? 0.4 : 1, cursor: ctx.playing ? "not-allowed" : "pointer" }, children: ctx.playing ? "▶ Playing…" : (labels.replay ?? "↺ Replay") }), showNavigation && ctx.totalClickSteps > 0 && (_jsxs(_Fragment, { children: [_jsx("button", { onClick: ctx.prevStep, disabled: ctx.clickCount <= 0, "aria-label": "Previous step", style: { ...btn, opacity: ctx.clickCount <= 0 ? 0.3 : 1, cursor: ctx.clickCount <= 0 ? "not-allowed" : "pointer" }, children: labels.prev ?? "◀ Prev" }), _jsx("button", { onClick: ctx.nextStep, disabled: ctx.clickCount >= ctx.totalClickSteps, "aria-label": "Next step", style: { ...btn, opacity: ctx.clickCount >= ctx.totalClickSteps ? 0.3 : 1, cursor: ctx.clickCount >= ctx.totalClickSteps ? "not-allowed" : "pointer" }, children: labels.next ?? "Next ▶" }), showStepCount && (_jsxs("span", { style: { fontSize: 11, opacity: 0.45, fontVariantNumeric: "tabular-nums" }, children: [ctx.clickCount, " / ", ctx.totalClickSteps] }))] }))] }));
}
//# sourceMappingURL=AnimarkControls.js.map