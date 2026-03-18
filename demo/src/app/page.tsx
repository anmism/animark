"use client";

import React, { useState } from "react";
import { Animark } from "animark-react";

// ─── Dark-mode variable overrides ────────────────────────────────────────────
// Applied to .demo-dark wrapper; all CSS vars cascade through children
const DARK_CSS = `
.demo-dark {
  --brand: #F59E0B; --brand-light: rgba(245,158,11,.1); --brand-dark: #D97706;
  --text: #F0EEE9; --text-2: #9A9691; --text-3: #4A4643;
  --border: #1E2128; --bg: #0D1117; --surface: #161B22; --surface-2: #1C2230;
  --code-bg: #060A0E; --code-text: #E2E8F0;
  --shadow: 0 1px 3px rgba(0,0,0,.45); --shadow-md: 0 4px 16px rgba(0,0,0,.55);
}
.demo-dark .navbar {
  background: rgba(13,17,23,.9);
}
.demo-dark .hero-card {
  background: linear-gradient(135deg, #1C2A45 0%, #1E1640 100%);
}
.demo-dark .amk-highlight--inline {
  background-image: linear-gradient(rgba(245,158,11,.45), rgba(245,158,11,.45)) !important;
}
`;

// ─── Animation demo data ──────────────────────────────────────────────────────

const ENTRANCE_DEMOS = [
  { label: "fade",       md: `:::animation\n:animate[Fading into existence]{type="fade" duration=600}\n:::` },
  { label: "slide ↑",   md: `:::animation\n:animate[Sliding up from below]{type="slide" direction="up" duration=600}\n:::` },
  { label: "slide ↓",   md: `:::animation\n:animate[Sliding down from above]{type="slide" direction="down" duration=600}\n:::` },
  { label: "slide ←",   md: `:::animation\n:animate[Coming in from the right]{type="slide" direction="left" duration=600}\n:::` },
  { label: "slide →",   md: `:::animation\n:animate[Coming in from the left]{type="slide" direction="right" duration=600}\n:::` },
  { label: "scale",      md: `:::animation\n:animate[Scaling into view]{type="scale" duration=500}\n:::` },
  { label: "blur",       md: `:::animation\n:animate[Blurring into focus]{type="blur" duration=700}\n:::` },
  { label: "bounce",     md: `:::animation\n:animate[Bouncing in!]{type="bounce" duration=800}\n:::` },
  { label: "flip",       md: `:::animation\n:animate[Flipping into place]{type="flip" duration=600}\n:::` },
  { label: "glitch",     md: `:::animation\n:animate[Gl1tch eff3ct]{type="glitch" duration=700}\n:::` },
  { label: "appear",     md: `:::animation\n:animate[Appears instantly]{type="appear" duration=100}\n:::` },
  { label: "reveal",     md: `:::animation\n:animate[Revealed left to right]{type="reveal" duration=700}\n:::` },
];

const TRANSFORM_DEMOS = [
  { label: "translateX", md: `:::animation\n:animate[Moving from the right]{type="translateX" amount=60 duration=600}\n:::` },
  { label: "translateY", md: `:::animation\n:animate[Moving from below]{type="translateY" amount=60 duration=600}\n:::` },
  { label: "rotate ↻",  md: `:::animation\n:animate[Rotating clockwise]{type="rotate" direction="right" duration=600}\n:::` },
  { label: "rotate ↺",  md: `:::animation\n:animate[Counter-clockwise]{type="rotate" direction="left" duration=600}\n:::` },
  { label: "rotateX",   md: `:::animation\n:animate[3D flip on X axis]{type="rotateX" duration=700}\n:::` },
  { label: "rotateY",   md: `:::animation\n:animate[3D flip on Y axis]{type="rotateY" duration=700}\n:::` },
  { label: "skew",      md: `:::animation\n:animate[Skewing into place]{type="skew" amount=20 duration=600}\n:::` },
  { label: "scaleX",    md: `:::animation\n:animate[Expanding on X axis]{type="scaleX" duration=600}\n:::` },
  { label: "scaleY",    md: `:::animation\n:animate[Expanding on Y axis]{type="scaleY" duration=600}\n:::` },
];

const EXIT_DEMOS = [
  { label: "fade-out",    md: `:::animation\n:animate[Fading away…]{type="fade-out" duration=1000}\n:::` },
  { label: "slide-out ↑", md: `:::animation\n:animate[Exiting upward]{type="slide-out" direction="up" duration=700}\n:::` },
  { label: "slide-out ↓", md: `:::animation\n:animate[Exiting downward]{type="slide-out" direction="down" duration=700}\n:::` },
  { label: "slide-out →", md: `:::animation\n:animate[Exiting to the right]{type="slide-out" direction="right" duration=700}\n:::` },
  { label: "scale-out",   md: `:::animation\n:animate[Shrinking to nothing]{type="scale-out" duration=700}\n:::` },
  { label: "blur-out",    md: `:::animation\n:animate[Blurring out]{type="blur-out" duration=700}\n:::` },
  { label: "disappear",   md: `:::animation\n:animate[Gone.]{type="disappear" duration=200}\n:::` },
  { label: "reveal-out",  md: `:::animation\n:animate[Wiped away]{type="reveal-out" duration=700}\n:::` },
  { label: "translateX-out", md: `:::animation\n:animate[Sliding off to the left]{type="translateX-out" direction="left" duration=700}\n:::` },
  { label: "rotate-out",  md: `:::animation\n:animate[Spinning out]{type="rotate-out" direction="right" duration=700}\n:::` },
  { label: "skew-out",    md: `:::animation\n:animate[Skewing away]{type="skew-out" duration=700}\n:::` },
  { label: "scaleY-out",  md: `:::animation\n:animate[Collapsing on Y]{type="scaleY-out" duration=700}\n:::` },
];

const ATTENTION_DEMOS = [
  { label: "pulse",      md: `:::animation\n:animate[Pulsing]{type="pulse" duration=800 repeat=4}\n:::` },
  { label: "shake",      md: `:::animation\n:animate[Shaking alert!]{type="shake" duration=600 repeat=3}\n:::` },
  { label: "wiggle",     md: `:::animation\n:animate[Wiggling]{type="wiggle" duration=800 repeat=3}\n:::` },
  { label: "heartbeat",  md: `:::animation\n:animate[♥ Heartbeat]{type="heartbeat" duration=1200 repeat=3}\n:::` },
  { label: "float",      md: `:::animation\n:animate[Floating gently]{type="float" duration=2000 repeat=4}\n:::` },
  { label: "hover-lift", md: `:::animation\n:animate[Hover over me!]{type="hover-lift"}\n:::` },
  { label: "magnetic",   md: `:::animation\n:animate[Move your cursor here]{type="magnetic"}\n:::` },
];

const TEXT_DEMOS = [
  { label: "typing",    md: `:::animation\n:animate[One character at a time...]{type="typing" stagger=55}\n:::` },
  { label: "highlight", md: `:::animation\n:animate[Sweeping highlight]{type="highlight" duration=900}\n:::` },
];

// ─── Trigger mode examples ────────────────────────────────────────────────────

const TRIGGER_DEMOS = [
  {
    label: "auto",
    badge: `trigger="auto"`,
    desc: "Animates immediately on mount. Replays when ↺ is clicked.",
    md: `:::animation
:animate[I play automatically on load]{type="slide" direction="up" duration=600}
:::`,
  },
  {
    label: "on-click",
    badge: `trigger="on-click"`,
    desc: "Each element waits for the next click-advance — great for step-through presentations.",
    md: `:::animation
:animate[Step 1 — always visible on load]{type="fade" duration=500}

:animate[Step 2 — revealed on Next ▶]{type="slide" direction="up" trigger="on-click" duration=500}

:animate[Step 3 — click again!]{type="bounce" trigger="on-click" duration=600}
:::`,
  },
  {
    label: "with-previous",
    badge: `trigger="with-previous"`,
    desc: "Starts at the same time as the preceding element — for parallel entrances.",
    md: `:::animation
:animate[←  both at once]{type="slide" direction="right" duration=700} :animate[both at once  →]{type="slide" direction="left" trigger="with-previous" duration=700}
:::`,
  },
  {
    label: "after-previous",
    badge: `trigger="after-previous"`,
    desc: "Waits for the previous animation to finish before starting — for chained sequences.",
    md: `:::animation
:animate[First →]{type="fade" duration=400} :animate[→ then →]{type="slide" direction="right" trigger="after-previous" duration=400} :animate[→ then this!]{type="scale" trigger="after-previous" duration=500}
:::`,
  },
];

// ─── Example full document ───────────────────────────────────────────────────

const EXAMPLE_DOC = `# The Art of Meaningful Motion

Good design :animate[guides the eye]{type="highlight" duration=700} without demanding it.
Effective animation doesn't decorate — it :animate[communicates]{type="highlight" duration=700 delay=400}.

---

:::animation
## Working With the Brain

The human visual system evolved to detect :animate[motion]{type="slide" direction="right" duration=600} above all else.

When we animate with intention, we tap into this ancient reflex — we don't fight for attention,
we :animate[earn it]{type="scale" trigger="after-previous" delay=100 duration=500}.
:::

---

:::animation
## Three Principles

:animate[**1. Timing**]{type="reveal" duration=600} — 600ms for entrances. 150ms for micro-interactions.

:animate[**2. Purpose**]{type="reveal" trigger="after-previous" delay=50 duration=600} — every animation should answer *why*, not just *how*.

:animate[**3. Restraint**]{type="reveal" trigger="after-previous" delay=50 duration=600} — the best animations are the ones users don't consciously notice.
:::

---

:::animation
## A Practical Example

Consider a product launch :animate[announcement]{type="typing" stagger=40}:

> :animate["We didn't just build a product.]{type="slide" direction="right" duration=600 trigger="on-click"}

> :animate[We built a feeling."]{type="slide" direction="right" trigger="on-click" duration=600 delay=100}
:::`;

// ─── Shared styles ────────────────────────────────────────────────────────────

const MONO: React.CSSProperties = {
  fontFamily: "'JetBrains Mono', monospace",
};

const TAG: React.CSSProperties = {
  ...MONO,
  fontSize: 11,
  padding: "2px 8px",
  borderRadius: 4,
  border: "1px solid var(--border)",
  background: "var(--surface-2)",
  color: "var(--brand)",
  whiteSpace: "nowrap",
};

const GHOST_BTN: React.CSSProperties = {
  all: "unset",
  cursor: "pointer",
  fontSize: 11,
  color: "var(--text-3)",
  borderBottom: "1px dashed var(--border)",
  paddingBottom: 1,
  letterSpacing: "0.03em",
  transition: "color 0.15s",
};

// ─── DemoCard ─────────────────────────────────────────────────────────────────

function DemoCard({ label, md }: { label: string; md: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="card" style={{ padding: "18px 18px 14px", textAlign: "center", marginBottom: 0 }}>
      <div style={{ ...MONO, fontSize: 11, color: "var(--brand)", marginBottom: 12, letterSpacing: "0.07em" }}>{label}</div>
      <div style={{ minHeight: 54, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.95rem" }}>
        <Animark controls="below" className="md-section"  controlsProps={{ showNavigation: false, labels: { replay: "↺" } }}>
          
          {md}

        </Animark>
      </div>
      <button
        style={GHOST_BTN}
        onMouseEnter={e => (e.currentTarget.style.color = "var(--text-2)")}
        onMouseLeave={e => (e.currentTarget.style.color = "var(--text-3)")}
        onClick={() => setOpen(o => !o)}
      >
        {open ? "hide" : "syntax"}
      </button>
      {open && (
        <pre style={{ marginTop: 10, textAlign: "left", fontSize: 10.5, background: "var(--code-bg)", color: "var(--code-text)", borderRadius: 6, padding: "10px 12px", overflowX: "auto", lineHeight: 1.6, ...MONO }}>
          {md}
        </pre>
      )}
    </div>
  );
}

// ─── TriggerCard ──────────────────────────────────────────────────────────────

function TriggerCard({ label, badge, desc, md }: typeof TRIGGER_DEMOS[0]) {
  const [open, setOpen] = useState(false);
  return (
    <div className="card">
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
        <strong style={{ color: "var(--text)", fontSize: 14 }}>{label}</strong>
        <span style={TAG}>{badge}</span>
      </div>
      <p style={{ fontSize: 13, color: "var(--text-2)", marginBottom: 16, lineHeight: 1.6 }}>{desc}</p>
      <div style={{ fontSize: "0.95rem" }}>
        <Animark className="md-section" controls="below">{md}</Animark>
      </div>
      <button
        style={{ ...GHOST_BTN, marginTop: 12 }}
        onMouseEnter={e => (e.currentTarget.style.color = "var(--text-2)")}
        onMouseLeave={e => (e.currentTarget.style.color = "var(--text-3)")}
        onClick={() => setOpen(o => !o)}
      >
        {open ? "hide syntax" : "show syntax"}
      </button>
      {open && (
        <pre style={{ marginTop: 10, fontSize: 10.5, background: "var(--code-bg)", color: "var(--code-text)", borderRadius: 6, padding: "10px 12px", overflowX: "auto", lineHeight: 1.65, ...MONO }}>
          {md}
        </pre>
      )}
    </div>
  );
}

// ─── SectionHead ─────────────────────────────────────────────────────────────

function SectionHead({ eyebrow, title, lead }: { eyebrow: string; title: string; lead?: string }) {
  return (
    <div style={{ marginBottom: 32 }}>
      <div className="section-eyebrow">{eyebrow}</div>
      <h2 className="section-title" style={{ marginBottom: lead ? 12 : 0 }}>{title}</h2>
      {lead && <p className="section-lead" style={{ marginBottom: 0 }}>{lead}</p>}
    </div>
  );
}

// ─── Tab bar ──────────────────────────────────────────────────────────────────

const TABS = ["Entrance", "Transform", "Exit", "Attention", "Text"] as const;
type Tab = typeof TABS[number];
const TAB_DATA: Record<Tab, { label: string; md: string }[]> = {
  Entrance: ENTRANCE_DEMOS,
  Transform: TRANSFORM_DEMOS,
  Exit: EXIT_DEMOS,
  Attention: ATTENTION_DEMOS,
  Text: TEXT_DEMOS,
};

// ─── Code snippets ────────────────────────────────────────────────────────────

const INSTALL = `npm install animark-react animark-core
# then import the styles once in your app root:
import "animark-react/styles"`;

const USAGE = `import { Animark } from "animark-react"

export default function Slide() {
  return (
    <Animark controls="above">
      {\`
:::animation
It's about :animate[working with the brain]{type="highlight" duration=700}
rather than against it — feeding its hunger for
:animate[pattern]{type="fade" trigger="after-previous" delay=100 duration=500},
:animate[surprise]{type="bounce" trigger="after-previous" delay=100 duration=500}, and
:animate[human connection]{type="slide" direction="up" trigger="on-click" duration=600}.
:::
      \`}
    </Animark>
  )
}`;

const ATTRS = [
  ["type",      "AnimationType",         "fade",      "The animation effect to apply"],
  ["trigger",   "auto | on-click | …",   "auto",      "When to start — auto · on-click · with-previous · after-previous"],
  ["delay",     "number (ms)",            "0",         "Delay before the animation starts"],
  ["duration",  "number (ms)",            "600",       "How long the animation lasts"],
  ["stagger",   "number (ms)",            "0",         "Delay between characters — used by typing"],
  ["direction", "up|down|left|right",     "up",        "Direction for slide, translateX/Y, rotate"],
  ["easing",    "string",                 "ease-out",  "Any CSS easing function"],
  ["amount",    "number",                 "—",         "Intensity: px for translate/shake, deg for rotate/skew/wiggle, scale for pulse/heartbeat"],
  ["repeat",    "number",                 "—",         "Loop count. 0 = infinite; attention types loop forever by default"],
];

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function Page() {
  const [dark, setDark] = useState(false);
  const [tab, setTab]   = useState<Tab>("Entrance");

  return (
    <div
      className={dark ? "demo-dark" : ""}
      style={{ background: "var(--bg)", minHeight: "100vh", transition: "background 0.25s" }}
    >
      <style>{DARK_CSS}</style>

      {/* ── Navbar ──────────────────────────────────────────────────────────── */}
      <nav className="navbar">
        <a href="#" className="navbar-logo">
          <span className="navbar-logo-badge">amk</span>
          animark
        </a>
        <div className="navbar-links">
          <a href="#gallery"    className="navbar-link">Gallery</a>
          <a href="#triggers"   className="navbar-link">Triggers</a>
          <a href="#example"    className="navbar-link">Example</a>
          <a href="#quickstart" className="navbar-link">Quick Start</a>
        </div>
        <button
          onClick={() => setDark(d => !d)}
          aria-label="Toggle dark mode"
          title={dark ? "Switch to light mode" : "Switch to dark mode"}
          style={{
            all: "unset",
            marginLeft: "auto",
            cursor: "pointer",
            fontSize: 17,
            lineHeight: 1,
            padding: "5px 9px",
            borderRadius: 7,
            border: "1px solid var(--border)",
            background: "var(--surface)",
            color: "var(--text-2)",
            transition: "all 0.2s",
            userSelect: "none",
          }}
        >
          {dark ? "☀️" : "🌙"}
        </button>
      </nav>

      <div className="page-layout">
        <div className="main-content" style={{ paddingLeft: 0 }}>

          {/* ── Hero ──────────────────────────────────────────────────────── */}
          <div className="hero-card">
            <h1>Animate your Markdown.</h1>
            <p>
              Inline animations for React — scoped, sequenceable, replay-able.
              Works with any react-markdown pipeline. Zero config.
            </p>
            <div className="hero-install">
              <code>npm install animark-react</code>
            </div>
          </div>

          {/* Live hero demo */}
          <div className="card" style={{ marginBottom: 48 }}>
            <div className="card-label">✦ Live Demo — click replay or advance step-by-step</div>
            <div className="md-section" style={{ fontSize: "1.1rem" }}>
              <Animark controls="above">
                {`:::animation
It's about :animate[working with the brain]{type="highlight" duration=700} rather than against it — feeding its hunger for :animate[pattern]{type="fade" trigger="after-previous" delay=100 duration=500}, :animate[surprise]{type="bounce" trigger="after-previous" delay=100 duration=500}, and :animate[human connection]{type="slide" direction="up" trigger="on-click" duration=600}.
:::`}
              </Animark>
            </div>
          </div>

          {/* ── Gallery ─────────────────────────────────────────────────────── */}
          <hr className="divider" id="gallery" />
          <SectionHead
            eyebrow="Animation Gallery"
            title="All animation types"
            lead="Click ↺ to replay any card. Click syntax to see the exact markdown that produces it."
          />

          {/* Tab bar */}
          <div style={{ display: "flex", gap: 6, marginBottom: 24, flexWrap: "wrap" }}>
            {TABS.map(t => (
              <button
                key={t}
                onClick={() => setTab(t)}
                style={{
                  all: "unset",
                  cursor: "pointer",
                  padding: "5px 15px",
                  borderRadius: 6,
                  fontSize: 13,
                  fontWeight: 500,
                  background: tab === t ? "var(--brand)" : "var(--surface)",
                  color: tab === t ? "#fff" : "var(--text-2)",
                  border: `1px solid ${tab === t ? "var(--brand)" : "var(--border)"}`,
                  transition: "all 0.15s",
                  userSelect: "none",
                }}
              >
                {t}
              </button>
            ))}
          </div>

          {/* Grid */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(210px, 1fr))", gap: 14, marginBottom: 16 }}>
            {TAB_DATA[tab].map(item => (
              <DemoCard key={`${tab}-${item.label}`} {...item} />
            ))}
          </div>

          {/* ── Trigger modes ─────────────────────────────────────────────── */}
          <hr className="divider" id="triggers" />
          <SectionHead
            eyebrow="Trigger Modes"
            title="Control when things animate"
            lead="Four strategies let you build auto-play sequences, click-through presentations, simultaneous entrances, or chained animations."
          />

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))", gap: 20, marginBottom: 16 }}>
            {TRIGGER_DEMOS.map(t => (
              <TriggerCard key={t.label} {...t} />
            ))}
          </div>

          {/* ── Example page ──────────────────────────────────────────────── */}
          <hr className="divider" id="example" />
          <SectionHead
            eyebrow="Example Document"
            title="What your markdown can look like"
            lead="Normal prose and animated blocks coexist naturally. Animations only apply inside :::animation scopes — everything else is untouched."
          />

          {/* Side-by-side: source + rendered */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 16, alignItems: "start" }}>
            <div className="card" style={{ height: "100%" }}>
              <div className="card-label">Markdown Source</div>
              <pre style={{ fontSize: 11.5, background: "var(--code-bg)", color: "var(--code-text)", borderRadius: 6, padding: "14px 16px", overflowX: "auto", lineHeight: 1.65, ...MONO, whiteSpace: "pre-wrap", margin: 0 }}>
                {EXAMPLE_DOC}
              </pre>
            </div>
            <div className="card" style={{ height: "100%" }}>
              <div className="card-label">Rendered Output</div>
              <div className="md-section">
                <Animark controls="above">{EXAMPLE_DOC}</Animark>
              </div>
            </div>
          </div>

          {/* Responsive stacked version (hidden on wide) */}
          <style>{`@media (max-width: 720px) {
            .example-grid { grid-template-columns: 1fr !important; }
          }`}</style>

          {/* ── Quick start ───────────────────────────────────────────────── */}
          <hr className="divider" id="quickstart" />
          <SectionHead eyebrow="Quick Start" title="Get up and running in 2 minutes" />

          <div className="card">
            <div className="code-label">1. Install</div>
            <div className="code-block"><pre>{INSTALL}</pre></div>
            <div className="code-label" style={{ marginTop: 24 }}>2. Use</div>
            <div className="code-block"><pre>{USAGE}</pre></div>
          </div>

          {/* Attributes table */}
          <h3 className="doc-h2">Attributes Reference</h3>
          <p className="doc-p">All attributes are optional — every one has a sensible default.</p>
          <table className="doc-table">
            <thead>
              <tr>
                <th>Attribute</th>
                <th>Type</th>
                <th>Default</th>
                <th>Description</th>
              </tr>
            </thead>
            <tbody>
              {ATTRS.map(([attr, type, def, desc]) => (
                <tr key={attr}>
                  <td><code>{attr}</code></td>
                  <td><code>{type}</code></td>
                  <td><code>{def}</code></td>
                  <td>{desc}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* All type pills */}
          <h3 className="doc-h2">All AnimationType values</h3>
          <div className="type-grid">
            {[
              "fade","slide","scale","blur","bounce","flip","glitch",
              "translateX","translateY","rotate","rotateX","rotateY","skew","scaleX","scaleY",
              "appear","reveal",
              "fade-out","slide-out","scale-out","blur-out",
              "translateX-out","translateY-out","rotate-out","rotateX-out","rotateY-out",
              "skew-out","scaleX-out","scaleY-out","disappear","reveal-out",
              "pulse","shake","wiggle","heartbeat","float","hover-lift","magnetic",
              "typing","highlight",
            ].map(t => <span key={t} className="type-pill">{t}</span>)}
          </div>

          {/* Plugin options callout */}
          <div className="callout callout-info" style={{ marginTop: 32, marginBottom: 48 }}>
            <span className="callout-icon">💡</span>
            <div>
              Pass <code>pluginOptions</code> to override global defaults for any scope:
              {" "}<code>{`<Animark pluginOptions={{ defaults: { duration: 400, easing: "ease-in-out" } }}>`}</code>.
              Set <code>allowUnknownTypes</code> to use custom CSS animation names.
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}