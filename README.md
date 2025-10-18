# Rewind

Just-in-time Tailwind compiler but supply-chain hardened

```bash
npm install @hazae41/rewind
```

```bash
deno install jsr:@hazae41/rewind
```

[**📦 NPM**](https://www.npmjs.com/package/@hazae41/rewind) • [**📦 JSR**](https://jsr.io/@hazae41/rewind)

## Features

### Current features
- 100% TypeScript and ESM
- No external dependencies
- Works with any framework
- Just-in-time rendering
- Prerender and hydrate

## Why

Look at the dependencies graph of the average Tailwind library

## Usage

### HTML

Just add `data-rewind` to your `link` tag with some unique name (it will become an HTML id)

```html
<link rel="stylesheet" data-rewind="mystyle" href="./index.css" />
```

### JavaScript

Client-side any framework (just-in-time rendering)

```tsx
await new Rewind(document).render()

// document now has a <style> with all your classes

// it will automatically update when your classes are modified
```

Client-side any React framework (just-in-time rendering)

```tsx
import { Rewind } from "@hazae41/rewind"
import { useEffect } from "react"

export default function App() {

  useEffect(() => {
    await new Rewind(document).render()

    // document now has a <style> with all your classes

    // it will automatically update when your classes are modified
  }, [])

  return <div className="text-2xl">
    Hello world
  </div>
}
```

Client-side pure React (just-in-time rendering)

```tsx
import { Rewind } from "@hazae41/rewind"
import { createRoot } from "react-dom/client"

function App() {
  return <div className="text-2xl">Hello world</div>
}

await new Rewind(document).render()

createRoot(document.body).render(<App />)
```

Client-side pure React with SSG (prerendering and hydration)

```tsx
import { Rewind } from "@hazae41/rewind"
import { hydrateRoot } from "react-dom/static"

function App() {
  return <div className="text-2xl">Hello world</div>
}

if (client) {
  await new Rewind(document).hydrate()
  hydrateRoot(document.body, <App />)
}

if (server) {
  await new Rewind(document).prerender()
  document.body = prerenderToString(<App />)
}
```

Server-side pure React to HTML (prerendering)

```tsx
import { Rewind } from "@hazae41/rewind"
import { DOMParser, XMLSerializer } from "..."
import { renderToString } from "react-dom/static"

function App() {
  return <div className="text-2xl">Hello world</div>
}

const html = renderToString(<App />)

const document = new DOMParser().parseFromString(html, "text/html")

await new Rewind(document).prerender()

const html2 = new XMLSerializer().serializeToString(document)
```