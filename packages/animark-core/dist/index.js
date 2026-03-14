"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var index_exports = {};
__export(index_exports, {
  DEFAULT_ANIMATION_CONFIG: () => DEFAULT_ANIMATION_CONFIG,
  VALID_DIRECTIONS: () => VALID_DIRECTIONS,
  VALID_TRIGGERS: () => VALID_TRIGGERS,
  VALID_TYPES: () => VALID_TYPES,
  parseAttributes: () => parseAttributes,
  remarkAnimark: () => remarkAnimark
});
module.exports = __toCommonJS(index_exports);

// src/remarkAnimark.ts
var import_unist_util_visit = require("unist-util-visit");

// src/defaults.ts
var DEFAULT_ANIMATION_CONFIG = {
  type: "fade",
  trigger: "auto",
  delay: 0,
  duration: 600,
  stagger: 0,
  direction: "up",
  easing: "ease-out"
};
var VALID_TYPES = /* @__PURE__ */ new Set([
  "fade",
  "slide",
  "scale",
  "blur",
  "bounce",
  "flip",
  "glitch",
  "translateX",
  "translateY",
  "translateZ",
  "rotate",
  "rotateX",
  "rotateY",
  "skew",
  "scaleX",
  "scaleY",
  "appear",
  "reveal",
  "fade-out",
  "slide-out",
  "scale-out",
  "blur-out",
  "translateX-out",
  "translateY-out",
  "translateZ-out",
  "rotate-out",
  "rotateX-out",
  "rotateY-out",
  "skew-out",
  "scaleX-out",
  "scaleY-out",
  "disappear",
  "reveal-out",
  "pulse",
  "shake",
  "wiggle",
  "heartbeat",
  "float",
  "hover-lift",
  "magnetic",
  "typing",
  "highlight"
]);
var VALID_TRIGGERS = /* @__PURE__ */ new Set([
  "auto",
  "on-click",
  "with-previous",
  "after-previous"
]);
var VALID_DIRECTIONS = /* @__PURE__ */ new Set(["up", "down", "left", "right"]);

// src/parseAttributes.ts
function parseAttributes(attrs, defaults, allowUnknownTypes) {
  const rawType = attrs.type ?? "";
  const type = allowUnknownTypes || VALID_TYPES.has(rawType) ? rawType || defaults.type : defaults.type;
  const delay = parseNonNegInt(attrs.delay, defaults.delay);
  const duration = parseNonNegInt(attrs.duration, defaults.duration);
  const stagger = parseNonNegInt(attrs.stagger, defaults.stagger);
  const rawAmount = attrs.amount != null ? parseInt(attrs.amount, 10) : void 0;
  const amount = rawAmount != null && Number.isFinite(rawAmount) ? rawAmount : defaults.amount;
  const rawRepeat = attrs.repeat != null ? parseInt(attrs.repeat, 10) : void 0;
  const repeat = rawRepeat != null && Number.isFinite(rawRepeat) && rawRepeat >= 0 ? rawRepeat : defaults.repeat;
  const rawTrigger = (attrs.trigger ?? "").toLowerCase();
  const trigger = VALID_TRIGGERS.has(rawTrigger) ? rawTrigger : defaults.trigger;
  const rawDirection = (attrs.direction ?? "").toLowerCase();
  const direction = VALID_DIRECTIONS.has(rawDirection) ? rawDirection : defaults.direction;
  const easing = attrs.easing ?? defaults.easing;
  return { type, trigger, delay, duration, stagger, direction, easing, amount, repeat };
}
function parseNonNegInt(raw, fallback) {
  if (raw == null) return fallback;
  const n = parseInt(raw, 10);
  return Number.isFinite(n) && n >= 0 ? n : fallback;
}

// src/remarkAnimark.ts
var remarkAnimark = function(options = {}) {
  return (tree) => {
    const defaults = { ...DEFAULT_ANIMATION_CONFIG, ...options.defaults ?? {} };
    const allowUnknownTypes = options.allowUnknownTypes ?? false;
    (0, import_unist_util_visit.visit)(tree, "containerDirective", (node, index, parent) => {
      const directive = node;
      if (directive.name !== "animation") return;
      directive.data = {
        hName: "div",
        hProperties: {
          "data-amk-scope": "true"
        }
      };
    });
    (0, import_unist_util_visit.visit)(tree, "textDirective", (node, index, parent) => {
      const directive = node;
      if (directive.name !== "animate") return;
      const attrs = directive.attributes ?? {};
      const animation = parseAttributes(attrs, defaults, allowUnknownTypes);
      directive.data = {
        hName: "span",
        hProperties: {
          "data-amk": "true",
          "data-amk-type": animation.type,
          "data-amk-trigger": animation.trigger,
          "data-amk-delay": String(animation.delay),
          "data-amk-duration": String(animation.duration),
          "data-amk-stagger": String(animation.stagger),
          "data-amk-direction": animation.direction,
          "data-amk-easing": animation.easing,
          ...animation.amount != null && { "data-amk-amount": String(animation.amount) },
          ...animation.repeat != null && { "data-amk-repeat": String(animation.repeat) }
        }
      };
    });
  };
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  DEFAULT_ANIMATION_CONFIG,
  VALID_DIRECTIONS,
  VALID_TRIGGERS,
  VALID_TYPES,
  parseAttributes,
  remarkAnimark
});
