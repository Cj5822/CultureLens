/**
 * ImportModal.tsx
 *
 * Drag-and-drop / file-picker modal for importing INTRACOMP Excel files.
 * Multiple files can be selected (or dropped) at once. Every file is parsed,
 * then a combined preview is shown (per-file row counts, totals and any
 * warnings/errors) before the user confirms.
 *
 * Imports are additive: each file becomes its own removable batch, so you can
 * bring in several countries' mapping files together and compare them (on the
 * map, in analytics, etc.) instead of the latest import wiping out everything
 * before it.
 */

import { useRef, useState, useCallback } from 'react'
import { createPortal } from 'react-dom'
import { Upload, FileSpreadsheet, X, AlertTriangle, CheckCircle2, Loader2, Trash2 } from 'lucide-react'
import { parseExcelFile, type ParseResult } from '@/utils/excelParser'
import { useDataContext } from '@/context/DataContext'

// ─── Props ─────────────────────────────────────────────────────────────────────

interface ImportModalProps {
  onClose: () => void
}

// ─── Internal state machine ────────────────────────────────────────────────────

type ParsedFile =
  | { key: string; fileName: string; ok: true; result: ParseResult }
  | { key: string; fileName: string; ok: false; message: string }

type Step =
  | { type: 'idle' }
  | { type: 'parsing'; done: number; total: number }
  | { type: 'preview'; files: ParsedFile[] }
  | { type: 'error'; message: string }

const EXCEL_RE = /\.(xlsx|xls)$/i

async function parseOne(file: File, key: string): Promise<ParsedFile> {
  if (!EXCEL_RE.test(file.name)) {
    return { key, fileName: file.name, ok: false, message: 'Not an Excel file (.xlsx or .xls).' }
  }
  try {
    const buffer = await file.arrayBuffer()
    const result = parseExcelFile(buffer)
    if (result.stakeholders.length === 0 && result.instruments.length === 0) {
      return {
        key,
        fileName: file.name,
        ok: false,
        message: 'No data rows found. Needs "Stakeholders" and "Instruments" sheets with a header row.',
      }
    }
    return { key, fileName: file.name, ok: true, result }
  } catch (err) {
    return {
      key,
      fileName: file.name,
      ok: false,
      message: err instanceof Error ? err.message : 'Failed to parse the file.',
    }
  }
}

// ─── Component ─────────────────────────────────────────────────────────────────

export function ImportModal({ onClose }: ImportModalProps) {
  const { imports, addImport, removeImport, clearAll } = useDataContext()
  const [step, setStep] = useState<Step>({ type: 'idle' })
  const [dragging, setDragging] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  // ── File processing ──────────────────────────────────────────────────────────

  const processFiles = useCallback(async (fileList: File[]) => {
    if (fileList.length === 0) return

    if (!fileList.some((f) => EXCEL_RE.test(f.name))) {
      setStep({ type: 'error', message: 'Please upload Excel files (.xlsx or .xls).' })
      return
    }

    setStep({ type: 'parsing', done: 0, total: fileList.length })

    const parsed: ParsedFile[] = []
    for (let i = 0; i < fileList.length; i++) {
      parsed.push(await parseOne(fileList[i], `${i}-${fileList[i].name}`))
      setStep({ type: 'parsing', done: i + 1, total: fileList.length })
    }

    setStep({ type: 'preview', files: parsed })
  }, [])

  // ── Drag-and-drop handlers ───────────────────────────────────────────────────

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setDragging(false)
      processFiles(Array.from(e.dataTransfer.files))
    },
    [processFiles],
  )

  const onDragOver = (e: React.DragEvent) => { e.preventDefault(); setDragging(true) }
  const onDragLeave = () => setDragging(false)

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? [])
    e.target.value = ''
    processFiles(files)
  }

  // ── Preview helpers ──────────────────────────────────────────────────────────

  const dropFromPreview = (key: string) => {
    if (step.type !== 'preview') return
    const files = step.files.filter((f) => f.key !== key)
    setStep(files.length > 0 ? { type: 'preview', files } : { type: 'idle' })
  }

  // ── Confirm import ───────────────────────────────────────────────────────────

  const confirmImport = () => {
    if (step.type !== 'preview') return
    for (const f of step.files) {
      if (f.ok) addImport(f.result, f.fileName)
    }
    setStep({ type: 'idle' })
  }

  // ── Derived preview data ─────────────────────────────────────────────────────

  const okFiles = step.type === 'preview' ? step.files.filter((f): f is Extract<ParsedFile, { ok: true }> => f.ok) : []
  const failedCount = step.type === 'preview' ? step.files.length - okFiles.length : 0
  const totalStakeholders = okFiles.reduce((n, f) => n + f.result.stakeholders.length, 0)
  const totalInstruments = okFiles.reduce((n, f) => n + f.result.instruments.length, 0)
  const allWarnings = okFiles.flatMap((f) =>
    f.result.warnings.map((w) => (okFiles.length > 1 ? `${f.fileName}: ${w}` : w)),
  )
  const loadedNames = new Set(imports.map((b) => b.fileName))

  // ── Render ───────────────────────────────────────────────────────────────────

  return createPortal(
    <div className="cl-modal-backdrop" onClick={onClose}>
      <div
        className="cl-modal"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label="Import Excel data"
      >
        {/* Header */}
        <div className="cl-modal-header">
          <div className="cl-modal-title-row">
            <FileSpreadsheet size={18} />
            <span>Import Excel Data</span>
          </div>
          <button className="cl-modal-close" onClick={onClose} aria-label="Close">
            <X size={16} />
          </button>
        </div>

        {/* Body */}
        <div className="cl-modal-body">

          {/* Loaded imports — shown whenever there's data, regardless of step */}
          {imports.length > 0 && (step.type === 'idle' || step.type === 'error') && (
            <div className="cl-loaded-imports">
              <div className="cl-loaded-imports__header">
                <span>
                  {imports.length} file{imports.length !== 1 ? 's' : ''} loaded
                </span>
                <button
                  type="button"
                  className="cl-loaded-imports__clear"
                  onClick={clearAll}
                >
                  Clear all
                </button>
              </div>
              <ul className="cl-loaded-imports__list" role="list">
                {imports.map((batch) => (
                  <li key={batch.id} className="cl-loaded-imports__row">
                    <div className="cl-loaded-imports__info">
                      <span className="cl-loaded-imports__country">
                        {batch.country || batch.fileName}
                      </span>
                      <span className="cl-loaded-imports__meta">
                        {batch.stakeholderCount} stakeholders · {batch.instrumentCount} instruments
                        {batch.partner ? ` · ${batch.partner}` : ''}
                      </span>
                    </div>
                    <button
                      type="button"
                      className="cl-loaded-imports__remove"
                      onClick={() => removeImport(batch.id)}
                      aria-label={`Remove ${batch.country || batch.fileName}`}
                      title="Remove this file's data"
                    >
                      <Trash2 size={14} />
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Drop zone — shown in idle and error states */}
          {(step.type === 'idle' || step.type === 'error') && (
            <div
              className={`cl-drop-zone ${dragging ? 'cl-drop-zone--active' : ''}`}
              onDrop={onDrop}
              onDragOver={onDragOver}
              onDragLeave={onDragLeave}
              onClick={() => fileRef.current?.click()}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === 'Enter' && fileRef.current?.click()}
            >
              <Upload size={28} className="cl-drop-icon" />
              <p className="cl-drop-primary">
                {imports.length > 0
                  ? 'Drag & drop more Excel files here'
                  : 'Drag & drop your Excel files here'}
              </p>
              <p className="cl-drop-secondary">
                or click to browse .xlsx / .xls — select as many files as you like
              </p>
              <input
                ref={fileRef}
                type="file"
                accept=".xlsx,.xls"
                multiple
                style={{ display: 'none' }}
                onChange={onFileChange}
              />
            </div>
          )}

          {/* Error state */}
          {step.type === 'error' && (
            <div className="cl-import-badge cl-import-badge--error">
              <AlertTriangle size={14} />
              <span>{step.message}</span>
            </div>
          )}

          {/* Parsing spinner */}
          {step.type === 'parsing' && (
            <div className="cl-import-parsing">
              <Loader2 size={24} className="cl-spin" />
              <span>
                {step.total > 1
                  ? `Parsing files… (${step.done}/${step.total})`
                  : 'Parsing file…'}
              </span>
            </div>
          )}

          {/* Preview */}
          {step.type === 'preview' && (
            <div className="cl-preview">
              <div className="cl-preview-header">
                {okFiles.length > 0 ? (
                  <CheckCircle2 size={16} className="cl-preview-check" />
                ) : (
                  <AlertTriangle size={16} className="cl-preview-fail" />
                )}
                <div>
                  <div className="cl-preview-filename">
                    {okFiles.length === 1 && step.files.length === 1
                      ? okFiles[0].fileName
                      : `${okFiles.length} file${okFiles.length !== 1 ? 's' : ''} ready to add`}
                  </div>
                  <div className="cl-preview-sub">
                    {okFiles.length === 1 && step.files.length === 1
                      ? `${okFiles[0].result.meta.country ? `${okFiles[0].result.meta.country} · ` : ''}Ready to add`
                      : failedCount > 0
                        ? `${failedCount} file${failedCount !== 1 ? 's' : ''} couldn't be read and will be skipped`
                        : 'All files parsed successfully'}
                  </div>
                </div>
              </div>

              {okFiles.length > 0 && (
                <div className="cl-preview-counts">
                  <div className="cl-preview-count-card">
                    <span className="cl-preview-count-num">{totalStakeholders}</span>
                    <span className="cl-preview-count-label">Stakeholders</span>
                  </div>
                  <div className="cl-preview-count-card">
                    <span className="cl-preview-count-num">{totalInstruments}</span>
                    <span className="cl-preview-count-label">Instruments</span>
                  </div>
                </div>
              )}

              {/* Per-file breakdown (only when more than one file was chosen) */}
              {step.files.length > 1 && (
                <div className="cl-loaded-imports">
                  <ul className="cl-loaded-imports__list" role="list">
                    {step.files.map((f) => (
                      <li
                        key={f.key}
                        className={`cl-loaded-imports__row ${f.ok ? '' : 'cl-preview-file--error'}`}
                      >
                        <div className="cl-loaded-imports__info">
                          <span className="cl-loaded-imports__country" title={f.fileName}>
                            {f.ok && f.result.meta.country
                              ? `${f.result.meta.country} — ${f.fileName}`
                              : f.fileName}
                          </span>
                          <span className="cl-loaded-imports__meta">
                            {f.ok
                              ? `${f.result.stakeholders.length} stakeholders · ${f.result.instruments.length} instruments` +
                                (loadedNames.has(f.fileName) ? ' · already loaded' : '')
                              : f.message}
                          </span>
                        </div>
                        <button
                          type="button"
                          className="cl-loaded-imports__remove"
                          onClick={() => dropFromPreview(f.key)}
                          aria-label={`Don't import ${f.fileName}`}
                          title="Leave this file out"
                        >
                          <X size={14} />
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Single failed file: show its reason */}
              {step.files.length === 1 && !step.files[0].ok && (
                <div className="cl-import-badge cl-import-badge--error">
                  <AlertTriangle size={14} />
                  <span>{step.files[0].fileName}: {step.files[0].message}</span>
                </div>
              )}

              {allWarnings.length > 0 && (
                <details className="cl-preview-warnings">
                  <summary>
                    <AlertTriangle size={13} />
                    {allWarnings.length} warning{allWarnings.length !== 1 ? 's' : ''}
                  </summary>
                  <ul>
                    {allWarnings.map((w, i) => (
                      <li key={i}>{w}</li>
                    ))}
                  </ul>
                </details>
              )}

              <div className="cl-preview-actions">
                <button className="cl-btn cl-btn--ghost" onClick={() => setStep({ type: 'idle' })}>
                  Cancel
                </button>
                <button
                  className="cl-btn cl-btn--primary"
                  onClick={confirmImport}
                  disabled={okFiles.length === 0}
                >
                  {okFiles.length > 1
                    ? `Import ${okFiles.length} files`
                    : imports.length > 0
                      ? 'Add to loaded data'
                      : 'Import data'}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Format hint */}
        {step.type !== 'preview' && step.type !== 'parsing' && (
          <div className="cl-modal-footer">
            Expected format: INTRACOMP Policy Mapping Template (.xlsx) with <em>Stakeholders</em> and <em>Instruments</em> sheets.
            Metadata rows at the top (Partner, Date, Country) are read automatically. You can select several files at
            once (Ctrl/Shift-click) — each is added alongside what's already loaded, and can be removed individually above.
          </div>
        )}
      </div>
    </div>,
    document.body,
  )
}
