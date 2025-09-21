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
- Web-only API

## Why

This is the dependencies graph of the average Tailwind library

## Usage

Client-side any framework to DOM

```tsx
await new Rewind(document).compile()

// document now has a <style> with all your classes

// it will automatically update when your classes are modified
```

Client-side pure React to DOM

```tsx
import { Rewind } from "@hazae41/rewind"
import { createRoot } from "react-dom/client"

function App() {
  return <div className="text-2xl">Hello world</div>
}

createRoot(root).render(<App />)

await new Rewind(document).compile()

// document now has a <style> with all your classes

// it will automatically update when your classes are modified
```

Server-side pure React to HTML

```tsx
import { Rewind } from "@hazae41/rewind"
import { DOMParser, XMLSerializer } from "..."
import { renderToString } from "react-dom/static"

function App() {
  return <div className="text-2xl">Hello world</div>
}

const html = renderToString(<App />)

const document = new DOMParser().parseFromString(html, "text/html")

await new Rewind(document).compile()

// document now has a <style> with all your classes

// you can serialize document to get your static html

const html2 = new XMLSerializer().serializeToString(document)
```

Any-side React any framework to DOM

```tsx
import { Rewind } from "@hazae41/rewind"
import { useEffect } from "react"

export default function App() {

  useEffect(() => {
    await new Rewind(document).compile()

    // document now has a <style> with all your classes

    // it will automatically update when your classes are modified
  }, [])

  return <div className="text-2xl">
    Hello world
  </div>
}
```