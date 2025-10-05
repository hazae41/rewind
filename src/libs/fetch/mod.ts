import { readFile } from "node:fs/promises"

export async function fetchOrReadAsTextOrThrow(input: string) {
  const url = new URL(input.toString())

  if (url.protocol === "file:")
    return await readFile(url, "utf8")

  const response = await fetch(url)

  if (!response.ok)
    throw new Error("Failed to fetch", { cause: response })

  return response.text()
}