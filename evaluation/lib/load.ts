// Loads workbooks exactly as the application does: each file is parsed with
// parseExcelFile (one import batch per file, ID counter shared across files),
// the batches are flattened, and the flattened array is passed through
// resolveConnections (see frontend/src/context/DataContext.tsx).
import { readFileSync, readdirSync } from 'node:fs'
import path from 'node:path'
import { parseExcelFile, mergeEntities, type ParseResult } from '@/utils/excelParser'
import { resolveConnections } from '@/utils/resolveConnections'
import type { Entity } from '@/types/entities'

export const DEMO_DIR = path.resolve(process.cwd(), '..', 'frontend', 'src', 'data')

export function readArrayBuffer(file: string): ArrayBuffer {
  const buf = readFileSync(file)
  return buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength) as ArrayBuffer
}

export interface LoadedBatch {
  file: string
  result: ParseResult
  entities: Entity[]
}

export interface LoadedDataset {
  batches: LoadedBatch[]
  /** Flattened, before connection resolution (raw connection strings). */
  raw: Entity[]
  /** Flattened and resolved, as exposed by DataContext. */
  entities: Entity[]
}

export function demoFiles(dir = DEMO_DIR): string[] {
  return readdirSync(dir)
    .filter((f) => f.toLowerCase().endsWith('.xlsx'))
    .sort()
    .map((f) => path.join(dir, f))
}

export function loadWorkbooks(files: string[]): LoadedDataset {
  const batches = files.map((file) => {
    const result = parseExcelFile(readArrayBuffer(file))
    return { file, result, entities: mergeEntities(result) }
  })
  const raw = batches.flatMap((b) => b.entities)
  return { batches, raw, entities: resolveConnections(raw) }
}
