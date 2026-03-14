"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useMemo } from "react";
import ReactMarkdown from "react-markdown";
import remarkDirective from "remark-directive";
import { remarkAnimark } from "animark-core";
import { BlockProvider } from "./BlockContext";
import { CSSAnimatedWrapper } from "./CSSAnimatedWrapper";
import { AnimarkControls } from "./AnimarkControls";
// ─── Helpers ──────────────────────────────────────────────────────────────────
function toNum(v) {
    return v !== undefined && v !== "" && v !== null ? Number(v) : undefined;
}
function extractConfig(props) {
    return {
        type: props["data-amk-type"] ?? "fade",
        trigger: props["data-amk-trigger"] ?? "auto",
        delay: toNum(props["data-amk-delay"]) ?? 0,
        duration: toNum(props["data-amk-duration"]) ?? 600,
        stagger: toNum(props["data-amk-stagger"]) ?? 0,
        direction: props["data-amk-direction"] ?? "up",
        easing: props["data-amk-easing"] ?? "ease-out",
        ...(toNum(props["data-amk-amount"]) != null && { amount: toNum(props["data-amk-amount"]) }),
        ...(toNum(props["data-amk-repeat"]) != null && { repeat: toNum(props["data-amk-repeat"]) }),
    };
}
const BASE_PLUGINS = [remarkDirective, remarkAnimark];
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
export function Animark({ children: markdown, controls = "above", controlsProps = {}, pluginOptions, remarkPlugins = [], rehypePlugins = [], components = {}, autoPlay = true, className, style, }) {
    const remarkPluginList = useMemo(() => {
        const base = pluginOptions
            ? [remarkDirective, [remarkAnimark, pluginOptions]]
            : BASE_PLUGINS;
        return [...base, ...remarkPlugins];
    }, [pluginOptions, remarkPlugins]);
    const rehypePluginList = useMemo(() => [...rehypePlugins], [rehypePlugins]);
    const finalComponents = useMemo(() => ({
        ...components,
        /**
         * div[data-amk-scope] → isolated BlockProvider + optional controls + children
         * Any other div passes through untouched.
         */
        div(props) {
            const { children: kids, ...rest } = props;
            if (!rest["data-amk-scope"]) {
                return _jsx("div", { ...rest, children: kids });
            }
            // Strip our data attribute from the DOM element
            const { "data-amk-scope": _scope, ...domRest } = rest;
            return (_jsxs(BlockProvider, { autoPlay: autoPlay, children: [controls === "above" && _jsx(AnimarkControls, { ...controlsProps }), _jsx("div", { ...domRest, children: kids }), controls === "below" && _jsx(AnimarkControls, { ...controlsProps })] }));
        },
        /**
         * span[data-amk] → CSSAnimatedWrapper (animated inline text)
         * Any other span passes through untouched.
         */
        span(props) {
            const { children: kids, ...rest } = props;
            if (!rest["data-amk"]) {
                return _jsx("span", { ...rest, children: kids });
            }
            return (_jsx(CSSAnimatedWrapper, { animation: extractConfig(rest), children: kids }));
        },
    }), [components, controls, controlsProps, autoPlay]);
    return (_jsx("div", { className: className, style: style, children: _jsx(ReactMarkdown, { remarkPlugins: remarkPluginList, rehypePlugins: rehypePluginList, components: finalComponents, children: markdown }) }));
}
// Compound subcomponents for headless / custom layouts
Animark.Controls = AnimarkControls;
Animark.Provider = BlockProvider;
//# sourceMappingURL=Animark.js.map