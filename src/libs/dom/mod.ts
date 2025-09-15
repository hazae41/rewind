export interface List<T> {

  readonly length: number

  item(index: number): T

}

// deno-lint-ignore no-namespace
export namespace List {

  export function* allItemsOf<T>(items: List<T>) {
    for (let i = 0, x = items.item(i); i < items.length && x != null; i++, x = items.item(i))
      yield x
  }

}