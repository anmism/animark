# animark

Animated inline text for React Markdown. Normal markdown renders completely untouched. `:::animation` is just a **scope boundary** — it defines where animation state lives. The actual animated elements are the `:animate[text]{...}` spans inside it.

---

## Install

```bash
npm install animark-react
```

```tsx
// app/layout.tsx (or any global CSS entry)
import "animark-react/styles";
```

---

## Mental model

```
# Hello                        ← normal markdown, renders as <h1>
                                 no animation state at all

:::animation                     ← scope boundary: mounts a BlockProvider
                                 + controls. The div itself does NOT animate.

It is about                    ← plain text, untouched
:animate[working with the brain]{type="highlight" duration=700}
rather than against it —       ← plain text, untouched
:animate[human connection]{type="highlight" duration=700 delay=400 trigger="on-click"}.

:::                            ← end of scope

More normal markdown here.     ← completely unaffected by anything above
```

Each `:::animation` block is a fully isolated island. Two blocks on the same page have zero shared state.

---

## Quick start

```tsx
import { Animark } from "animark-react";
import "animark-react/styles";

export default function Page() {
  return (
    <Animark controls="above">
      {`
# The Science of Attention

:::animation
It is about :animate[working with the brain]{type="highlight" duration=700} rather
than against it — feeding its hunger for pattern, surprise, resolution, and
:animate[human connection]{type="highlight" duration=700 delay=400 trigger="on-click"}.
:::

## Another section

This paragraph is normal markdown, no animation involved.

:::animation
A second, completely independent scope. Has its own replay button.
:animate[Each scope]{type="fade"} is isolated.
:::
      `}
    </Animark>
  );
}
```

---

## Inline animation syntax

```
:animate[the text to animate]{type="highlight" duration=700 delay=400 trigger="on-click"}
```

| Attribute | Type | Default | Notes |
|---|---|---|---|
| `type` | `AnimationType` | `"fade"` | Which animation |
| `trigger` | `AnimationTrigger` | `"auto"` | When to play |
| `delay` | ms | `0` | Start delay |
| `duration` | ms | `600` | Animation duration |
| `direction` | `up\|down\|left\|right` | `"up"` | For slide / translate / rotate |
| `stagger` | ms | `0` | Per-character delay (typing only) |
| `amount` | number | — | px / deg for transform types |
| `repeat` | number | — | `0` = infinite, for looping types |

### Trigger values

| Trigger | Behaviour |
|---|---|
| `auto` | Plays on mount and on replay |
| `on-click` | Waits for click-advance within this scope (1st, 2nd, 3rd…) |
| `with-previous` | Starts at the same time as the previous `:animate` in this scope |
| `after-previous` | Starts after the previous `:animate` in this scope finishes |

---

## Animation types

**Entrance:** `fade` `slide` `scale` `blur` `bounce` `flip` `glitch` `translateX` `translateY` `translateZ` `rotate` `rotateX` `rotateY` `skew` `scaleX` `scaleY` `appear` `reveal`

**Exit:** `fade-out` `slide-out` `scale-out` `blur-out` `translateX-out` `translateY-out` `translateZ-out` `rotate-out` `rotateX-out` `rotateY-out` `skew-out` `scaleX-out` `scaleY-out` `disappear` `reveal-out`

**Attention (looping):** `pulse` `shake` `wiggle` `heartbeat` `float` `hover-lift` `magnetic`

**Text:** `typing` `highlight`

---

## `<Animark>` props

```tsx
<Animark
  controls="above"        // "above" | "below" | "none" — where controls render per scope
  controlsProps={{        // forwarded to <AnimarkControls> inside each scope
    showNavigation: true,
    labels: { replay: "↺ Play again", prev: "← Back", next: "Next →" },
  }}
  autoPlay={true}         // auto-play on mount
  pluginOptions={{        // forwarded to remarkAnimark
    defaults: { duration: 400 },
  }}
  remarkPlugins={[]}      // e.g. [remarkMath]
  rehypePlugins={[]}      // e.g. [rehypeKatex]
>
  {markdownString}
</Animark>
```

---

## Custom controls layout

```tsx
// "none" suppresses the auto-controls.
// Use Animark.Controls inside your own layout.
<Animark controls="none">
  {`
:::animation
:animate[Text]{type="fade"} here.
:::
  `}
</Animark>
```

Or use the headless API for full control:

```tsx
import { BlockProvider, useBlockContext, AnimarkControls, CSSAnimatedWrapper } from "animark-react";

function MyControls() {
  const { playing, clickCount, totalClickSteps, replay, nextStep, prevStep } = useBlockContext();
  return (
    <div>
      <button onClick={replay} disabled={playing}>Replay</button>
      {totalClickSteps > 0 && (
        <>
          <button onClick={prevStep}>◀</button>
          <button onClick={nextStep}>▶</button>
          <span>{clickCount}/{totalClickSteps}</span>
        </>
      )}
    </div>
  );
}
```

---

## With remark-math / rehype-katex

```tsx
import remarkMath  from "remark-math";
import rehypeKatex from "rehype-katex";
import "katex/dist/katex.min.css";

<Animark remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>
  {`
:::animation
The formula :animate[$E = mc^2$]{type="highlight"} changed everything.
:::
  `}
</Animark>
```

---

## License

MIT
