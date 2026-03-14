import { visit } from "unist-util-visit";
import type { Plugin } from "unified";
import type { Root } from "mdast";
import type { ContainerDirective, TextDirective } from "mdast-util-directive";

import { parseAttributes } from "./parseAttributes";
import { DEFAULT_ANIMATION_CONFIG } from "./defaults";
import type { RemarkAnimarkOptions } from "./types";

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
const remarkAnimark: Plugin<[RemarkAnimarkOptions?], Root> = function (options = {}) {
  return (tree: Root) => {
    const defaults = { ...DEFAULT_ANIMATION_CONFIG, ...(options.defaults ?? {}) };
    const allowUnknownTypes = options.allowUnknownTypes ?? false;

    // ── 1. Container directives → scope wrappers ──────────────────────────
    visit(tree, "containerDirective", (node, index, parent) => {
      const directive = node as ContainerDirective;
      if (directive.name !== "animation") return;

      // Replace the container with a plain div carrying data-amk-scope.
      // All children are kept as-is; inline directives inside will be handled
      // by the next visitor pass.
      (directive as unknown as Record<string, unknown>).data = {
        hName: "div",
        hProperties: {
          "data-amk-scope": "true",
        },
      };
    });

    // ── 2. Text directives → animated spans ───────────────────────────────
    visit(tree, "textDirective", (node, index, parent) => {
      const directive = node as TextDirective;
      if (directive.name !== "animate") return;

      const attrs = (directive.attributes ?? {}) as Record<string, string | null | undefined>;
      const animation = parseAttributes(attrs, defaults, allowUnknownTypes);

      (directive as unknown as Record<string, unknown>).data = {
        hName: "span",
        hProperties: {
          "data-amk":           "true",
          "data-amk-type":      animation.type,
          "data-amk-trigger":   animation.trigger,
          "data-amk-delay":     String(animation.delay),
          "data-amk-duration":  String(animation.duration),
          "data-amk-stagger":   String(animation.stagger),
          "data-amk-direction": animation.direction,
          "data-amk-easing":    animation.easing,
          ...(animation.amount != null && { "data-amk-amount": String(animation.amount) }),
          ...(animation.repeat != null && { "data-amk-repeat": String(animation.repeat) }),
        },
      };
    });
  };
};

export default remarkAnimark;
export { remarkAnimark };
