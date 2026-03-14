# animark demo

A Next.js app that exercises every feature of `animark-react` using the local workspace packages.

## Running

From the **monorepo root**:

```bash
pnpm install
pnpm demo
# → http://localhost:3000
```

Or from inside this folder:

```bash
pnpm install
pnpm dev
```

## What's tested

| Section | What it covers |
|---|---|
| 1 · Basic highlight + on-click | The headline use-case — `highlight` + `trigger="on-click"` |
| 2 · All trigger types | `auto` → `after-previous` → `with-previous` → two `on-click` steps |
| 3 · Animation type sampler | `fade`, `scale`, `blur`, `bounce`, `flip`, `glitch`, `slide`, `highlight`, `typing` |
| 4 · Looping attention | `pulse`, `shake`, `wiggle`, `float` — all loop forever |
| 5 · Two independent scopes | Replaying scope A has zero effect on scope B |
| 6 · Normal markdown mix | `h1`, `blockquote`, list, `**bold**`, `` `code` `` all render untouched |
| 7 · Controls below | `controls="below"` prop |
| 8 · Custom labels | `controlsProps.labels` override |
