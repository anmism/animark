"use client";

import React from "react";
import { useBlockContext } from "./BlockContext";

export interface AnimarkControlsTheme {
  container?: React.CSSProperties;
  button?:    React.CSSProperties;
}

export interface AnimarkControlsProps {
  showNavigation?: boolean;
  showStepCount?:  boolean;
  className?:      string;
  style?:          React.CSSProperties;
  theme?:          AnimarkControlsTheme;
  labels?: {
    replay?: string;
    prev?:   string;
    next?:   string;
  };
  render?: (ctx: {
    playing:         boolean;
    clickCount:      number;
    totalClickSteps: number;
    replay:          () => void;
    nextStep:        () => void;
    prevStep:        () => void;
  }) => React.ReactNode;
}

export function AnimarkControls({
  showNavigation = true,
  showStepCount  = true,
  className      = "",
  style          = {},
  theme          = {},
  labels         = {},
  render,
}: AnimarkControlsProps) {
  const ctx = useBlockContext();

  if (render) return <>{render(ctx)}</>;

  const containerStyle: React.CSSProperties = {
    display: "flex", alignItems: "center", gap: 10,
    padding: "6px 0", flexWrap: "wrap",
    ...theme.container, ...style,
  };
  const btn: React.CSSProperties = {
    padding: "4px 12px", border: "1px solid currentColor",
    borderRadius: 5, background: "transparent",
    fontSize: 12, cursor: "pointer",
    fontFamily: "inherit", transition: "opacity 0.15s",
    userSelect: "none",
    ...theme.button,
  };

  return (
    <div className={`amk-controls ${className}`.trim()} style={containerStyle}>
      <button onClick={ctx.replay} disabled={ctx.playing} aria-label="Replay"
        style={{ ...btn, opacity: ctx.playing ? 0.4 : 1, cursor: ctx.playing ? "not-allowed" : "pointer" }}>
        {ctx.playing ? "▶ Playing…" : (labels.replay ?? "↺ Replay")}
      </button>

      {showNavigation && ctx.totalClickSteps > 0 && (
        <>
          <button onClick={ctx.prevStep} disabled={ctx.clickCount <= 0} aria-label="Previous step"
            style={{ ...btn, opacity: ctx.clickCount <= 0 ? 0.3 : 1, cursor: ctx.clickCount <= 0 ? "not-allowed" : "pointer" }}>
            {labels.prev ?? "◀ Prev"}
          </button>

          <button onClick={ctx.nextStep} disabled={ctx.clickCount >= ctx.totalClickSteps} aria-label="Next step"
            style={{ ...btn, opacity: ctx.clickCount >= ctx.totalClickSteps ? 0.3 : 1, cursor: ctx.clickCount >= ctx.totalClickSteps ? "not-allowed" : "pointer" }}>
            {labels.next ?? "Next ▶"}
          </button>

          {showStepCount && (
            <span style={{ fontSize: 11, opacity: 0.45, fontVariantNumeric: "tabular-nums" }}>
              {ctx.clickCount} / {ctx.totalClickSteps}
            </span>
          )}
        </>
      )}
    </div>
  );
}
