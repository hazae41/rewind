import { List } from "@/libs/dom/mod.ts";
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
    for (const element of List.allItemsOf(this.document.querySelectorAll("[class]")))
      for (const name of List.allItemsOf(element.classList))
        this.names.add(name)

    for (const link of List.allItemsOf(this.document.querySelectorAll("link"))) {
      if (link == null)
        continue
      if (link.rel !== "stylesheet")
        continue
      if (link.dataset.rewind == null)
        continue
      const source = await fetch(link.href).then(r => r.text())

      const compiler = await Tailwind.compile(source)

      const style = this.document.createElement("style")

      style.id = crypto.randomUUID().slice(0, 8)
      style.textContent = compiler.build([...this.names])

      link.dataset.style = style.id
      link.after(style)

      this.cache.set(compiler, style)
    }

    new MutationObserver(() => this.#rebuild()).observe(this.document, { attributes: true, attributeFilter: ["class"], subtree: true, childList: true })
  }

  async prerender() {
    for (const element of List.allItemsOf(this.document.querySelectorAll("[class]")))
      for (const name of List.allItemsOf(element.classList))
        this.names.add(name)

    for (const link of List.allItemsOf(this.document.querySelectorAll("link"))) {
      if (link == null)
        continue
      if (link.rel !== "stylesheet")
        continue
      if (link.dataset.rewind == null)
        continue
      const source = await fetch(link.href).then(r => r.text())

      const compiler = await Tailwind.compile(source)

      const style = this.document.createElement("style")

      style.id = crypto.randomUUID().slice(0, 8)
      style.textContent = compiler.build([...this.names])

      link.dataset.style = style.id
      link.after(style)
    }
  }

  async hydrate() {
    for (const link of List.allItemsOf(this.document.querySelectorAll("link"))) {
      if (link == null)
        continue
      if (link.rel !== "stylesheet")
        continue
      if (link.dataset.rewind == null)
        continue
      const source = await fetch(link.href).then(r => r.text())

      const compiler = await Tailwind.compile(source)

      const style = this.document.getElementById(link.dataset.rewind) as HTMLStyleElement

      this.cache.set(compiler, style)
    }

    new MutationObserver(() => this.#rebuild()).observe(this.document, { attributes: true, attributeFilter: ["class"], subtree: true, childList: true })
  }

  #rebuild() {
    const size = this.names.size

    for (const x of List.allItemsOf(this.document.querySelectorAll("[class]")))
      for (const y of List.allItemsOf(x.classList))
        this.names.add(y)

    if (size === this.names.size)
      return

    for (const [compiler, style] of this.cache)
      style.textContent = compiler.build([...this.names])

    return
  }

}