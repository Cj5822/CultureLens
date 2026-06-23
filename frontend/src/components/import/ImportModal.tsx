/**
 * ImportModal.tsx
 *
 * Drag-and-drop / file-picker modal for importing INTRACOMP Excel files.
 * Shows a parse preview (row counts + any warnings) before the user confirms.
 */

import { useRef, useState, useCallback } from 'react'
import { createPortal } from 'react-dom'
import { Upload, FileSpreadsheet, X, AlertTriangle, CheckCircle2, Loader2, RotateCcw } from 'lucide-react'
import { parseExcelFile, mergeEntities, type ParseResult } from '@/utils/excelParser'
import { useDataContext } from '@/context/DataContext'

// ─── Props ─────────────────────────────────────────────────────────────────────

interface ImportModalProps {
  onClose: () => void
}

// ─── Internal state machine ────────────────────────────────────────────────────

type Step =
  | { type: 'idle' }
  | { type: 'parsing' }
  | { type: 'preview'; fileName: string; result: ParseResult }
  | { type: 'error'; message: string }

// ─── Component ─────────────────────────────────────────────────────────────────

export function ImportModal({ onClose }: ImportModalProps) {
  const { setEntities, isImported, resetToMock } = useDataContext()
  const [step, setStep] = useState<Step>({ type: 'idle' })
  const [dragging, setDragging] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  // ── File processing ──────────────────────────────────────────────────────────

  const processFile = useCallback(async (file: File) => {
    if (!file.name.match(/\.(xlsx|xls)$/i)) {
      setStep({ type: 'error', message: 'Please upload an Excel file (.xlsx or .xls).' })
      return
    }

    setStep({ type: 'parsing' })

    try {
      const buffer = await file.arrayBuffer()
      const result = parseExcelFile(buffer)

      if (result.stakeholders.length === 0 && result.instruments.length === 0) {
        setStep({
          type: 'error',
          message:
            'No data rows found. Make sure the file has "Stakeholders" and "Instruments" sheets with a header row.',
        })
        return
      }

      setStep({ type: 'preview', fileName: file.name, result })
    } catch (err) {
      setStep({
        type: 'error',
        message: err instanceof Error ? err.message : 'Failed to parse the file.',
      })
    }
  }, [])

  // ── Drag-and-drop handlers ───────────────────────────────────────────────────

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setDragging(false)
      const file = e.dataTransfer.files[0]
      if (file) processFile(file)
    },
    [processFile],
  )

  const onDragOver = (e: React.DragEvent) => { e.preventDefault(); setDragging(true) }
  const onDragLeave = () => setDragging(false)

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) processFile(file)
    e.target.value = ''
  }

  // ── Confirm import ───────────────────────────────────────────────────────────

  const confirmImport = () => {
    if (step.type !== 'preview') return
    setEntities(mergeEntities(step.result))
    onClose()
  }

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

          {/* Active data badge */}
          {isImported && step.type === 'idle' && (
            <div className="cl-import-badge cl-import-badge--active">
              <CheckCircle2 size={14} />
              <span>Custom data is active.</span>
              <button
                className="cl-import-badge-reset"
                onClick={() => { resetToMock(); onClose() }}
              >
                <RotateCcw size={12} /> Revert to demo data
              </button>
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
              <p className="cl-drop-primary">Drag & drop your Excel file here</p>
              <p className="cl-drop-secondary">or click to browse .xlsx / .xls</p>
              <input
                ref={fileRef}
                type="file"
                accept=".xlsx,.xls"
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
              <span>Parsing file…</span>
            </div>
          )}

          {/* Preview */}
          {step.type === 'preview' && (
            <div className="cl-preview">
              <div className="cl-preview-header">
                <CheckCircle2 size={16} className="cl-preview-check" />
                <div>
                  <div className="cl-preview-filename">{step.fileName}</div>
                  <div className="cl-preview-sub">Ready to import</div>
                </div>
              </div>

              <div className="cl-preview-counts">
                <div className="cl-preview-count-card">
                  <span className="cl-preview-count-num">{step.result.stakeholders.length}</span>
                  <span className="cl-preview-count-label">Stakeholders</span>
                </div>
                <div className="cl-preview-count-card">
                  <span className="cl-preview-count-num">{step.result.instruments.length}</span>
                  <span className="cl-preview-count-label">Instruments</span>
                </div>
              </div>

              {step.result.warnings.length > 0 && (
                <details className="cl-preview-warnings">
                  <summary>
                    <AlertTriangle size={13} />
                    {step.result.warnings.length} warning{step.result.warnings.length !== 1 ? 's' : ''}
                  </summary>
                  <ul>
                    {step.result.warnings.map((w, i) => (
                      <li key={i}>{w}</li>
                    ))}
                  </ul>
                </details>
              )}

              <div className="cl-preview-actions">
                <button className="cl-btn cl-btn--ghost" onClick={() => setStep({ type: 'idle' })}>
                  Cancel
                </button>
                <button className="cl-btn cl-btn--primary" onClick={confirmImport}>
                  Import data
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Format hint */}
        {step.type !== 'preview' && step.type !== 'parsing' && (
          <div className="cl-modal-footer">
            Expected format: 2-sheet workbook with sheets named <em>Stakeholders</em> and <em>Instruments</em>, each with a header row matching the INTRACOMP mapping template.
          </div>
        )}
      </div>
    </div>,
    document.body,
  )
}
