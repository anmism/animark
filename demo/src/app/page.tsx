import { Animark } from "animark-react";

// ─── Markdown strings (defined outside the component to avoid re-creation) ────

const MD_BASIC = `
# The Science of Attention

:::animation
It is about :animate[working with the brain]{type="highlight" duration=700} rather
than against it — feeding its hunger for pattern, surprise, resolution, and
:animate[human connection]{type="highlight" duration=700 delay=400 trigger="on-click"}.
:::


:::animation
It is about :animate[working with the brain]{type="highlight" duration=700} rather
than against it — feeding its hunger for pattern, surprise, resolution, and
:animate[human connection]{type="highlight" duration=700 delay=400 trigger="on-click"}.
:animate[human connection]{type="highlight" duration=700 delay=400 trigger="with-previous"}.
:::

`;

const MD_TRIGGERS = `
:::animation
:animate[First — plays immediately (auto)]{type="fade" duration=500}

:animate[Second — after previous finishes]{type="slide" direction="right" trigger="after-previous"}

:animate[Third — at the same time as second]{type="scale" trigger="with-previous"}

:animate[Fourth — waits for a click]{type="highlight" duration=600 trigger="on-click"}

:animate[Fifth — another click]{type="highlight" duration=600 delay=100 trigger="on-click"}
:::
`;

const MD_TYPES = `
:::animation
:animate[fade]{type="fade"} ·
:animate[scale]{type="scale"} ·
:animate[blur]{type="blur"} ·
:animate[bounce]{type="bounce"} ·
:animate[flip]{type="flip"} ·
:animate[glitch]{type="glitch"} ·
:animate[slide up]{type="slide" direction="up"} ·
:animate[slide right]{type="slide" direction="right"} ·
:animate[highlight]{type="highlight" duration=800} ·
:animate[typing…]{type="typing" stagger=40}
:::
`;

const MD_LOOPING = `
:::animation
This text has a :animate[pulsing word]{type="pulse"} and a
:animate[shaking word]{type="shake"} and one that
:animate[wiggles]{type="wiggle"} and one that
:animate[floats]{type="float"}.
:::
`;

const MD_INDEPENDENT = `
## Scope A

:::animation
:animate[I am scope A]{type="slide" direction="up"} — replaying me does not affect scope B.
:::

## Scope B

:::animation
:animate[I am scope B]{type="fade"} — completely independent state.
:animate[Click to reveal me]{type="highlight" duration=500 trigger="on-click"}
:::
`;

const MD_NORMAL_MIX = `
# Normal markdown is untouched

This paragraph has **bold**, *italic*, and \`inline code\` — none of it
goes through the animation system.

:::animation
But this scope is animated: :animate[hello from inside a scope]{type="highlight" duration=600}.
:::

> A blockquote after the scope. Still just normal markdown.

- List item one
- List item two
- List item three
`;

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function DemoPage() {
  return (
    <main className="demo-page">
      <h1>animark demo</h1>
      <p style={{ color: "#666", marginBottom: "2.5rem" }}>
        Each <code>:::animation</code> block is an isolated scope. Replaying one
        does not affect any other.
      </p>

      {/* 1 ── The headline use case from the spec */}
      <div className="demo-section">
        <h2>1 · Basic highlight + on-click</h2>
        <Animark controls="above">{MD_BASIC}</Animark>
      </div>

      {/* 2 ── All trigger types */}
      <div className="demo-section">
        <h2>2 · All trigger types</h2>
        <p style={{ fontSize: 13, color: "#888", marginBottom: 16 }}>
          auto → after-previous → with-previous → on-click → on-click
        </p>
        <Animark controls="above">{MD_TRIGGERS}</Animark>
      </div>

      {/* 3 ── Sampler of animation types */}
      <div className="demo-section">
        <h2>3 · Animation type sampler</h2>
        <Animark controls="above">{MD_TYPES}</Animark>
      </div>

      {/* 4 ── Looping attention animations */}
      <div className="demo-section">
        <h2>4 · Looping attention animations</h2>
        <Animark controls="none">{MD_LOOPING}</Animark>
      </div>

      {/* 5 ── Two independent scopes */}
      <div className="demo-section">
        <h2>5 · Two independent scopes</h2>
        <Animark controls="above">{MD_INDEPENDENT}</Animark>
      </div>

      {/* 6 ── Mixed normal markdown + scopes */}
      <div className="demo-section">
        <h2>6 · Normal markdown mixed with animated scopes</h2>
        <Animark controls="above">{MD_NORMAL_MIX}</Animark>
      </div>

      {/* 7 ── Controls below */}
      <div className="demo-section">
        <h2>7 · Controls below the content</h2>
        <Animark controls="below">
          {`
:::animation
:animate[Controls can go below]{type="slide" direction="up"} the content too.
:::
          `}
        </Animark>
      </div>

      {/* 8 ── Custom control labels */}
      <div className="demo-section">
        <h2>8 · Custom control labels</h2>
        <Animark
          controls="above"
          controlsProps={{
            labels: { replay: "▷ Play again", prev: "← Back", next: "Forward →" },
          }}
        >
          {`
:::animation
:animate[Custom labels on the controls]{type="highlight" duration=600}.
:animate[Click forward to see me]{type="fade" trigger="on-click"}.
:::
          `}
        </Animark>
      </div>
    </main>
  );
}
