import { fetchOrReadAsText } from "@/libs/fetch/mod.ts";
import * as Tailwind from "tailwindcss";

export interface Compiler {
  build(classes: string[]): string
}

export class Rewind {

  readonly names: Set<string> = new Set()

  readonly cache: Map<Compiler, HTMLStyleElement> = new Map()

  constructor(
    readonly document: Document
  ) { }

  async render() {
    for (const element of this.document.querySelectorAll("[class]"))
      for (const name of element.classList)
        this.names.add(name)

    for (const link of this.document.querySelectorAll("link")) {
      if (link == null)
        continue
      if (link.rel !== "stylesheet")
        continue
      if (!link.dataset.rewind)
        continue

      link.dataset.rewind = crypto.randomUUID().slice(0, 8)[0]

      const source = await fetchOrReadAsText(link.href)

      const compiler = await Tailwind.compile(source)

      const style = this.document.createElement("style")

      style.id = link.dataset.rewind
      style.textContent = compiler.build([...this.names])

      link.after(style)

      this.cache.set(compiler, style)
    }

    new MutationObserver(() => this.#rebuild()).observe(this.document, { attributes: true, attributeFilter: ["class"], subtree: true, childList: true })
  }

  async prerender() {
    for (const element of this.document.querySelectorAll("[class]"))
      for (const name of element.classList)
        this.names.add(name)

    for (const link of this.document.querySelectorAll("link")) {
      if (link == null)
        continue
      if (link.rel !== "stylesheet")
        continue
      if (!link.dataset.rewind)
        continue

      link.dataset.rewind = crypto.randomUUID().slice(0, 8)[0]

      const source = await fetchOrReadAsText(link.href)

      const compiler = await Tailwind.compile(source)

      const style = this.document.createElement("style")

      style.id = link.dataset.rewind
      style.textContent = compiler.build([...this.names])

      link.after(style)
    }
  }

  async hydrate() {
    for (const link of this.document.querySelectorAll("link")) {
      if (link == null)
        continue
      if (link.rel !== "stylesheet")
        continue
      if (!link.dataset.rewind)
        continue

      const source = await fetchOrReadAsText(link.href)

      const compiler = await Tailwind.compile(source)

      const style = this.document.getElementById(link.dataset.rewind)

      if (style == null)
        continue
      if (style instanceof HTMLStyleElement === false)
        continue

      this.cache.set(compiler, style)
    }

    new MutationObserver(() => this.#rebuild()).observe(this.document, { attributes: true, attributeFilter: ["class"], subtree: true, childList: true })
  }

  #rebuild() {
    const size = this.names.size

    for (const x of this.document.querySelectorAll("[class]"))
      for (const y of x.classList)
        this.names.add(y)

    if (size === this.names.size)
      return

    for (const [compiler, style] of this.cache)
      style.textContent = compiler.build([...this.names])

    return
  }

}