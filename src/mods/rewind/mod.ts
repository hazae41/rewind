import { List } from "@/libs/dom/mod.ts";
import { fetchOrReadAsTextOrThrow } from "@/libs/fetch/mod.ts";
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

  async renderOrThrow() {
    for (const element of List.iterate(this.document.querySelectorAll("[class]")))
      for (const name of List.iterate(element.classList))
        this.names.add(name)

    for (const link of List.iterate(this.document.querySelectorAll("link"))) {
      if (link == null)
        continue
      if (link.rel !== "stylesheet")
        continue
      if (link.dataset.rewind == null)
        continue
      const source = await fetchOrReadAsTextOrThrow(link.href)

      const compiler = await Tailwind.compile(source)

      const style = this.document.createElement("style")

      style.id = crypto.randomUUID().slice(0, 8)
      style.textContent = compiler.build([...this.names])

      link.dataset.style = style.id
      link.after(style)

      this.cache.set(compiler, style)
    }

    new MutationObserver(() => this.#rebuildOrThrow()).observe(this.document, { attributes: true, attributeFilter: ["class"], subtree: true, childList: true })
  }

  async prerenderOrThrow() {
    for (const element of List.iterate(this.document.querySelectorAll("[class]")))
      for (const name of List.iterate(element.classList))
        this.names.add(name)

    for (const link of List.iterate(this.document.querySelectorAll("link"))) {
      if (link == null)
        continue
      if (link.rel !== "stylesheet")
        continue
      if (link.dataset.rewind == null)
        continue
      const source = await fetchOrReadAsTextOrThrow(link.href)

      const compiler = await Tailwind.compile(source)

      const style = this.document.createElement("style")

      style.id = crypto.randomUUID().slice(0, 8)
      style.textContent = compiler.build([...this.names])

      link.dataset.style = style.id
      link.after(style)
    }
  }

  async hydrateOrThrow() {
    for (const link of List.iterate(this.document.querySelectorAll("link"))) {
      if (link == null)
        continue
      if (link.rel !== "stylesheet")
        continue
      if (link.dataset.rewind == null)
        continue
      const source = await fetchOrReadAsTextOrThrow(link.href)

      const compiler = await Tailwind.compile(source)

      const element = this.document.getElementById(link.dataset.style)

      if (element == null)
        continue
      if (element instanceof HTMLStyleElement === false)
        continue

      const style = element as HTMLStyleElement

      this.cache.set(compiler, style)
    }

    new MutationObserver(() => this.#rebuildOrThrow()).observe(this.document, { attributes: true, attributeFilter: ["class"], subtree: true, childList: true })
  }

  #rebuildOrThrow() {
    const size = this.names.size

    for (const x of List.iterate(this.document.querySelectorAll("[class]")))
      for (const y of List.iterate(x.classList))
        this.names.add(y)

    if (size === this.names.size)
      return

    for (const [compiler, style] of this.cache)
      style.textContent = compiler.build([...this.names])

    return
  }

}