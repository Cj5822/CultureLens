// Runs a TypeScript evaluation tool against the application's own source.
//
// The entry point is bundled with esbuild together with every module it
// imports from ../frontend/src (the "@/..." alias is resolved exactly as Vite
// resolves it). Third-party packages (xlsx, d3-force, ...) are resolved from
// ../frontend/node_modules, so the tools use the same library versions as the
// application. The bundle is then executed with the current Node binary.
//
// Usage: node run.mjs <entry.ts> [args...]
import { build } from 'esbuild'
import { spawnSync } from 'node:child_process'
import { mkdirSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const here = path.dirname(fileURLToPath(import.meta.url))
const frontend = path.resolve(here, '..', 'frontend')
const [entry, ...args] = process.argv.slice(2)
if (!entry) {
  console.error('Usage: node run.mjs <entry.ts> [args...]')
  process.exit(1)
}

const buildDir = path.join(here, '.build')
mkdirSync(buildDir, { recursive: true })
const outfile = path.join(buildDir, entry.replace(/[\\/]/g, '_').replace(/\.ts$/, '.mjs'))

await build({
  entryPoints: [path.resolve(here, entry)],
  outfile,
  bundle: true,
  platform: 'node',
  format: 'esm',
  target: 'node20',
  alias: { '@': path.join(frontend, 'src') },
  nodePaths: [path.join(frontend, 'node_modules')],
  // Native module, optional: loaded at run time from evaluation/node_modules.
  external: ['@resvg/resvg-js'],
  // xlsx and some d3 modules are CommonJS; give the ESM bundle a require().
  banner: { js: "import { createRequire } from 'node:module'; const require = createRequire(import.meta.url);" },
  logLevel: 'warning',
})

const res = spawnSync(process.execPath, [outfile, ...args], { stdio: 'inherit', cwd: here })
process.exit(res.status ?? 1)
