# animark

:::animation
Animated inline text, :animate[built on top of react-markdown]{type="highlight" duration=700}. Normal markdown renders completely untouched.
:::

---

## How it works

animark has two primitives. Everything else is plain markdown.

`:::animation` is a **scope boundary**. It mounts an isolated animation context with its own replay state, click steps, and sequencing. The wrapper itself has no animation — it's just a container.

`:animate[text]{...}` is the **animated element**. Only these spans are processed by animark. Regular text, headings, bold, italic, lists — none of it is touched.

---

## Installation

```bash
npm install animark-react
```

Import the stylesheet once at your app root:

```ts
import "animark-react/styles";
```

---

## Quick start

```tsx
import { Animark } from "animark-react";

export default function Page() {
  return (
    <Animark controls="above">
      {`
# The Science of Attention

:::animation
It is about :animate[working with the brain]{type="highlight" duration=700}
rather than against it — feeding its hunger for
:animate[human connection]{type="highlight" duration=700 delay=400 trigger="on-click"}.
:::
      `}
    </Animark>
  );
}
```

---

## Syntax

### Scope — `:::animation`

Wrap any block in `:::animation ... :::` to define a scope. Each scope is fully isolated — replaying one scope has zero effect on any other scope on the page.

```markdown
:::animation
Your content with :animate[animated words]{type="fade"} here.
:::
```

### Inline — `:animate[text]{...}`

Place `:animate[text]{...}` inside a scope to animate a span of text.

```markdown
:animate[the text to animate]{type="highlight" duration=700 delay=200 trigger="on-click"}
```

---

## Config reference

| Attribute | Type | Default | Description |
|---|---|---|---|
| `type` | `AnimationType` | `"fade"` | Which animation to play |
| `trigger` | `AnimationTrigger` | `"auto"` | When to play |
| `delay` | `number` ms | `0` | Delay before starting |
| `duration` | `number` ms | `600` | Animation duration |
| `direction` | `up \| down \| left \| right` | `"up"` | Direction for slide / translate |
| `stagger` | `number` ms | `30` | Per-character delay — `typing` only |
| `amount` | `number` | — | Offset in px or deg for transform types |
| `repeat` | `number` | — | `0` = infinite. Looping types default to infinite. |

---

## Triggers

| Value | Behaviour |
|---|---|
| `auto` | Plays immediately on mount and on replay. Default. |
| `on-click` | Hidden until the user presses Next ▶. Each `on-click` span gets a sequential slot within its scope. |
| `with-previous` | Starts at the same time as the previous `:animate` span. |
| `after-previous` | Starts after the previous span finishes. |

---

## Animation types

**Entrance** — `fade` `slide` `scale` `blur` `bounce` `flip` `glitch` `translateX` `translateY` `translateZ` `rotate` `rotateX` `rotateY` `skew` `scaleX` `scaleY` `appear` `reveal`

**Exit** — `fade-out` `slide-out` `scale-out` `blur-out` `translateX-out` `translateY-out` `translateZ-out` `rotate-out` `disappear` `reveal-out`

**Attention (looping)** — `pulse` `shake` `wiggle` `heartbeat` `float` `hover-lift` `magnetic`

**Text** — `typing` `highlight`

---

## `<Animark>` props

| Prop | Type | Default | Description |
|---|---|---|---|
| `controls` | `"above" \| "below" \| "none"` | `"above"` | Where controls render per scope |
| `controlsProps` | `AnimarkControlsProps` | — | Forwarded to each scope's controls |
| `autoPlay` | `boolean` | `true` | Auto-play on mount |
| `pluginOptions` | `RemarkAnimarkOptions` | — | Options for `remarkAnimark` |
| `remarkPlugins` | `Plugin[]` | — | Extra remark plugins |
| `rehypePlugins` | `Plugin[]` | — | Extra rehype plugins |

---

## Controls

Each `:::animation` scope automatically gets a controls bar with a Replay button. When a scope has `on-click` steps registered, Prev ◀ and Next ▶ buttons appear automatically.

```tsx
<Animark controls="above">...</Animark>   // controls above content
<Animark controls="below">...</Animark>   // controls below content
<Animark controls="none">...</Animark>    // no controls (looping animations, etc.)
```

Custom labels:

```tsx
<Animark
  controls="above"
  controlsProps={{
    labels: { replay: "▷ Play again", prev: "← Back", next: "Forward →" }
  }}
>
  {markdown}
</Animark>
```

---

## Multiple scopes on one page

Each `:::animation` block is independent. You can have as many as you need.

```markdown
:::animation
:animate[Scope A]{type="fade"} — has its own replay button.
:::

Some normal markdown between scopes.

:::animation
:animate[Scope B]{type="slide"} — completely separate state.
:::
```

---

## With remark-math / rehype-katex

animark ships zero extra dependencies and leaves your plugin chain open.

```tsx
import remarkMath  from "remark-math";
import rehypeKatex from "rehype-katex";
import "katex/dist/katex.min.css";

<Animark remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>
  {`
:::animation
The formula :animate[$E = mc^2$]{type="highlight"} changed physics.
:::
  `}
</Animark>
```
