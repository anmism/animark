import React from "react";
import ReactMarkdown from "react-markdown";
import type { RemarkAnimarkOptions } from "animark-core";
import type { Components } from "react-markdown";
import { BlockProvider } from "./BlockContext";
import { AnimarkControls } from "./AnimarkControls";
import type { AnimarkControlsProps } from "./AnimarkControls";
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
export declare function Animark({ children: markdown, controls, controlsProps, pluginOptions, remarkPlugins, rehypePlugins, components, autoPlay, className, style, }: AnimarkProps): import("react/jsx-runtime").JSX.Element;
export declare namespace Animark {
    var Controls: typeof AnimarkControls;
    var Provider: typeof BlockProvider;
}
//# sourceMappingURL=Animark.d.ts.map