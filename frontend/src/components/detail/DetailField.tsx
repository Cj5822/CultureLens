import type { ReactNode } from 'react'

// ─── Props ─────────────────────────────────────────────────────────────────────

export interface DetailFieldProps {
  label: string
  value?: ReactNode
}

// ─── DetailField ───────────────────────────────────────────────────────────────

/**
 * Reusable detail row — renders a labelled field inside the EntityDetailPanel.
 * Hides itself gracefully when value is empty / null / undefined.
 * Uses semantic <dl>/<dt>/<dd> markup for screen-reader compatibility.
 */
export function DetailField({ label, value }: DetailFieldProps) {
  // Hide empty values — treat empty string, null, and undefined as absent
  if (value === null || value === undefined || value === '') return null

  return (
    <div className="cl-detail-field">
      <dt className="cl-detail-field__label">{label}</dt>
      <dd className="cl-detail-field__value">{value}</dd>
    </div>
  )
}

export default DetailField
