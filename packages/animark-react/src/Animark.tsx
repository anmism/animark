"use client";

import React, { useMemo } from "react";
import ReactMarkdown from "react-markdown";
import remarkDirective from "remark-directive";
import { remarkAnimark } from "animark-core";
import type { AnimationConfig, RemarkAnimarkOptions } from "animark-core";
import type { Components } from "react-markdown";

import { BlockProvider } from "./BlockContext";
import { CSSAnimatedWrapper } from "./CSSAnimatedWrapper";
import { AnimarkControls } from "./AnimarkControls";
import type { AnimarkControlsProps } from "./AnimarkControls";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function toNum(v: unknown): number | undefined {
  return v !== undefined && v !== "" && v !== null ? Number(v) : undefined;
}

function extractConfig(props: Record<string, unknown>): AnimationConfig {
  return {
    type:      (props["data-amk-type"]      as string) ?? "fade",
    trigger:   (props["data-amk-trigger"]   as string) ?? "auto",
    delay:     toNum(props["data-amk-delay"])    ?? 0,
    duration:  toNum(props["data-amk-duration"]) ?? 600,
    stagger:   toNum(props["data-amk-stagger"])  ?? 0,
    direction: (props["data-amk-direction"] as string) ?? "up",
    easing:    (props["data-amk-easing"]    as string) ?? "ease-out",
    ...(toNum(props["data-amk-amount"]) != null && { amount: toNum(props["data-amk-amount"]) }),
    ...(toNum(props["data-amk-repeat"]) != null && { repeat: toNum(props["data-amk-repeat"]) }),
  } as AnimationConfig;
}

// ─── Public API ───────────────────────────────────────────────────────────────

export interface AnimarkProps {
  /** Markdown content. Normal markdown renders as-is. :::animation defines scopes. */
  children: string;
  /**
   * Where to render controls for each :::animation scope.
   * - "above" (default) — controls appear above the scope content
   * - "below"           — controls appear below
   * - "none"            — no auto-rendered controls (use <Animark.Controls> yourself)
   */
  controls?: "above" | "below" | "none";
  /** Props forwarded to the auto-rendered <AnimarkControls> inside each scope */
  controlsProps?: AnimarkControlsProps;
  /** Options forwarded to remarkAnimark */
  pluginOptions?: RemarkAnimarkOptions;
  /** Additional remark plugins (e.g. remark-math) */
  remarkPlugins?: NonNullable<Parameters<typeof ReactMarkdown>[0]["remarkPlugins"]>;
  /** Additional rehype plugins (e.g. rehype-katex) */
  rehypePlugins?: NonNullable<Parameters<typeof ReactMarkdown>[0]["rehypePlugins"]>;
  /** Extra ReactMarkdown component overrides */
  components?: Components;
  /** Auto-play animations on mount (default: true) */
  autoPlay?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

const BASE_PLUGINS = [remarkDirective, remarkAnimark] as const;

/**
 * <Animark>
 *
 * Renders a markdown string. Normal markdown is untouched.
 * Each :::animation block becomes an isolated animation scope with its own
 * replay / click-step state and optional controls.
 *
 * ```tsx
 * <Animark controls="above">
 *   {`
 * # Hello
 *
 * :::animation
 * It is about :animate[working with the brain]{type="highlight" duration=700} rather
 * than against it — feeding its hunger for pattern, surprise, resolution, and
 * :animate[human connection]{type="highlight" duration=700 delay=400 trigger="on-click"}.
 * :::
 *
 * More normal markdown here, totally unaffected.
 *   `}
 * </Animark>
 * ```
 */
export function Animark({
  children: markdown,
  controls      = "above",
  controlsProps = {},
  pluginOptions,
  remarkPlugins = [],
  rehypePlugins = [],
  components    = {},
  autoPlay      = true,
  className,
  style,
}: AnimarkProps) {
  const remarkPluginList = useMemo(() => {
    const base = pluginOptions
      ? [remarkDirective, [remarkAnimark, pluginOptions] as [typeof remarkAnimark, RemarkAnimarkOptions]]
      : BASE_PLUGINS;
    return [...base, ...remarkPlugins];
  }, [pluginOptions, remarkPlugins]);

  const rehypePluginList = useMemo(() => [...rehypePlugins], [rehypePlugins]);

  const finalComponents = useMemo<Components>(() => ({
    ...components,

    /**
     * div[data-amk-scope] → isolated BlockProvider + optional controls + children
     * Any other div passes through untouched.
     */
    div(props) {
      const { children: kids, ...rest } = props as Record<string, unknown> & { children: React.ReactNode };

      if (!rest["data-amk-scope"]) {
        return <div {...(rest as React.HTMLAttributes<HTMLDivElement>)}>{kids}</div>;
      }

      // Strip our data attribute from the DOM element
      const { "data-amk-scope": _scope, ...domRest } = rest;

      return (
        <BlockProvider autoPlay={autoPlay}>
          {controls === "above" && <AnimarkControls {...controlsProps} />}
          <div {...(domRest as React.HTMLAttributes<HTMLDivElement>)}>{kids}</div>
          {controls === "below" && <AnimarkControls {...controlsProps} />}
        </BlockProvider>
      );
    },

    /**
     * span[data-amk] → CSSAnimatedWrapper (animated inline text)
     * Any other span passes through untouched.
     */
    span(props) {
      const { children: kids, ...rest } = props as Record<string, unknown> & { children: React.ReactNode };

      if (!rest["data-amk"]) {
        return <span {...(rest as React.HTMLAttributes<HTMLSpanElement>)}>{kids}</span>;
      }

      return (
        <CSSAnimatedWrapper animation={extractConfig(rest)}>
          {kids}
        </CSSAnimatedWrapper>
      );
    },
  }), [components, controls, controlsProps, autoPlay]);

  return (
    <div className={className} style={style}>
      <ReactMarkdown
        remarkPlugins={remarkPluginList as Parameters<typeof ReactMarkdown>[0]["remarkPlugins"]}
        rehypePlugins={rehypePluginList as Parameters<typeof ReactMarkdown>[0]["rehypePlugins"]}
        components={finalComponents}
      >
        {markdown}
      </ReactMarkdown>
    </div>
  );
}

// Compound subcomponents for headless / custom layouts
Animark.Controls = AnimarkControls;
Animark.Provider = BlockProvider;
