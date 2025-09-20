import { readdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";

export function* walkSync(dir) {
  const files = readdirSync(dir, { withFileTypes: true }).sort((a, b) => a.name > b.name ? 1 : -1)

  for (const file of files) {
    if (file.isDirectory()) {
      yield* walkSync(path.join(dir, file.name))
    } else {
      yield path.join(dir, file.name)
    }
  }
}

function dot(path: string) {
  return path.startsWith(".") ? path : `./${path}`
}

for (const file of walkSync("./out")) {
  if (!file.endsWith(".js"))
    continue
  const original = readFileSync(file, "utf-8")

  const replaced = original.replaceAll(/@\/([a-zA-Z0-9_\-\/]*)/g, (_, absolute) => dot(path.relative(path.dirname(file), path.join("./src", absolute))))

  if (original === replaced)
    continue

  writeFileSync(file, replaced)
}
