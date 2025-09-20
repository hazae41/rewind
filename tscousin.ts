import { existsSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
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

export function dot(path: string) {
  return path.startsWith(".") ? path : `./${path}`
}


if (!existsSync("./tsconfig.json"))
  throw new Error("Missing tsconfig.json")

const tsconfig = JSON.parse(readFileSync("./tsconfig.json", "utf-8"))

function rewrite(file: string, target: string) {
  for (const from in tsconfig.compilerOptions.paths) {
    for (const to of tsconfig.compilerOptions.paths[from]) {
      if (from.endsWith("*")) {
        if (!target.startsWith(from.slice(0, -1)))
          continue

        if (to.endsWith("*")) {
          const retarget = path.join(tsconfig.compilerOptions.outDir, to.slice(0, -1), target.slice(from.slice(0, -1).length))

          if (!existsSync(path.dirname(retarget)))
            continue

          return dot(path.relative(path.dirname(file), retarget))
        } else {
          const retarget = path.join(tsconfig.compilerOptions.outDir, to)

          if (!existsSync(path.dirname(retarget)))
            continue

          return dot(path.relative(path.dirname(file), retarget))
        }
      } else {
        if (target !== from)
          continue

        if (to.endsWith("*"))
          throw new Error("Cannot rewrite non-wildcard to wildcard")

        const retarget = path.join(tsconfig.compilerOptions.outDir, to)

        if (!existsSync(path.dirname(retarget)))
          continue

        return dot(path.relative(path.dirname(file), retarget))
      }
    }
  }

  return target
}

for (const file of walkSync(tsconfig.compilerOptions.outDir)) {
  if (!file.endsWith(".js"))
    continue
  const original = readFileSync(file, "utf-8")

  const replaced = original
    .replaceAll(/import (.+?) from "(.+?)"/g, (_, specifier, target) => `import ${specifier} from "${rewrite(file, target)}"`)
    .replaceAll(/export (.+?) from "(.+?)"/g, (_, specifier, target) => `export ${specifier} from "${rewrite(file, target)}"`)
    .replaceAll(/require\("(.+?)"\)/g, (_, target) => `require("${rewrite(file, target)}")`)
    .replaceAll(/import\("(.+?)"\)/g, (_, target) => `import("${rewrite(file, target)}")`)

  if (original === replaced)
    continue

  writeFileSync(file, replaced)
}
