import { readFileSync } from "node:fs"

export async function fetchOrReadAsTextOrThrow(input: string) {
  const url = new URL(input.toString())

  if (url.protocol === "file:")
    return readFileSync(url, "utf8")

  const response = await fetch(url)

  if (!response.ok)
    throw new Error("Failed to fetch", { cause: response })

  return response.text()
}