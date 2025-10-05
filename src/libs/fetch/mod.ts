export async function readAsTextOrThrow(file: string) {
  const fs = await import("node:fs/promises")
  return await fs.default.readFile(file, "utf8")
}

export async function fetchOrReadAsTextOrThrow(input: string) {
  const url = new URL(input.toString())

  if (url.protocol === "file:")
    return await readAsTextOrThrow(url.pathname)

  const response = await fetch(url)

  if (!response.ok)
    throw new Error("Failed to fetch", { cause: response })

  return response.text()
}