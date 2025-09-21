import { List } from "@/libs/dom/mod.ts";
import * as Tailwind from "tailwindcss";

export interface Compiler {
  build(classes: string[]): string
}

export class Rewind {

  readonly classes: Set<string> = new Set()

  readonly styles: Map<HTMLStyleElement, Compiler> = new Map()

  readonly observer: MutationObserver = new MutationObserver(() => this.#recompile())

  constructor(
    readonly document: Document
  ) { }

  async compile() {
    for (const element of List.allItemsOf(this.document.querySelectorAll("[class]")))
      for (const name of List.allItemsOf(element.classList))
        this.classes.add(name)

    for (const link of List.allItemsOf(this.document.getElementsByTagName("link"))) {
      if (link == null)
        continue
      if (link.rel !== "stylesheet")
        continue
      const source = await fetch(link.href).then(r => r.text())

      const compiler = await Tailwind.compile(source)

      const style = this.document.createElement("style")

      style.textContent = compiler.build([...this.classes])

      this.styles.set(style, compiler)

      link.replaceWith(style)
    }

    this.observer.observe(this.document, { attributes: true, attributeFilter: ["class"], subtree: true, childList: true })
  }

  #recompile() {
    const size = this.classes.size

    for (const x of List.allItemsOf(this.document.querySelectorAll("[class]")))
      for (const y of List.allItemsOf(x.classList))
        this.classes.add(y)

    if (size === this.classes.size)
      return

    for (const [style, compiler] of this.styles)
      style.textContent = compiler.build([...this.classes])

    return
  }

}

console.log("lol")