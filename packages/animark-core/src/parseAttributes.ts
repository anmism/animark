import type { AnimationConfig, AnimationType, AnimationDirection, AnimationTrigger } from "./types";
import { VALID_TYPES, VALID_TRIGGERS, VALID_DIRECTIONS } from "./defaults";

type RawAttrs = Record<string, string | null | undefined>;

export function parseAttributes(
  attrs: RawAttrs,
  defaults: AnimationConfig,
  allowUnknownTypes: boolean,
): AnimationConfig {
  // Do NOT lowercase type — VALID_TYPES has mixed-case (translateX, rotateY…)
  const rawType = attrs.type ?? "";
  const type: AnimationType =
    allowUnknownTypes || VALID_TYPES.has(rawType)
      ? ((rawType as AnimationType) || defaults.type)
      : defaults.type;

  const delay    = parseNonNegInt(attrs.delay,    defaults.delay);
  const duration = parseNonNegInt(attrs.duration, defaults.duration);
  const stagger  = parseNonNegInt(attrs.stagger,  defaults.stagger);

  const rawAmount = attrs.amount != null ? parseInt(attrs.amount, 10) : undefined;
  const amount    = rawAmount != null && Number.isFinite(rawAmount) ? rawAmount : defaults.amount;

  const rawRepeat = attrs.repeat != null ? parseInt(attrs.repeat, 10) : undefined;
  const repeat    =
    rawRepeat != null && Number.isFinite(rawRepeat) && rawRepeat >= 0
      ? rawRepeat
      : defaults.repeat;

  const rawTrigger = (attrs.trigger ?? "").toLowerCase();
  const trigger: AnimationTrigger = VALID_TRIGGERS.has(rawTrigger)
    ? (rawTrigger as AnimationTrigger)
    : defaults.trigger;

  const rawDirection = (attrs.direction ?? "").toLowerCase();
  const direction: AnimationDirection = VALID_DIRECTIONS.has(rawDirection)
    ? (rawDirection as AnimationDirection)
    : defaults.direction;

  const easing = attrs.easing ?? defaults.easing;

  return { type, trigger, delay, duration, stagger, direction, easing, amount, repeat };
}

function parseNonNegInt(raw: string | null | undefined, fallback: number): number {
  if (raw == null) return fallback;
  const n = parseInt(raw, 10);
  return Number.isFinite(n) && n >= 0 ? n : fallback;
}
