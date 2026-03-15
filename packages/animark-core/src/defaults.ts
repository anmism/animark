import type { AnimationConfig } from "./types";

export const DEFAULT_ANIMATION_CONFIG: AnimationConfig = {
  type:      "fade",
  trigger:   "auto",
  delay:     0,
  duration:  600,
  stagger:   0,
  direction: "up",
  easing:    "ease-out",
};

export const VALID_TYPES = new Set([
  //in
  "fade","slide","scale","blur","flip","bounce","glitch",
  "translateX","translateY",
  "rotate","rotateX","rotateY",
  "skew",
  "scaleX","scaleY",
  "appear","reveal",
  //out
  "fade-out","slide-out","scale-out","blur-out",
  "translateX-out","translateY-out",
  "rotate-out","rotateX-out","rotateY-out",
  "skew-out",
  "scaleX-out","scaleY-out",
  "disappear","reveal-out",
  //attention
  "pulse","shake","wiggle","heartbeat","float","hover-lift","magnetic",
  //text
  "typing","highlight",
]);

export const VALID_TRIGGERS = new Set([
  "auto","on-click","with-previous","after-previous",
]);

export const VALID_DIRECTIONS = new Set(["up","down","left","right"]);
