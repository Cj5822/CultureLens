import { useState } from 'react'
import { ChevronDown } from 'lucide-react'

export interface FilterSectionProps {
  title: string
  children: React.ReactNode
  defaultOpen?: boolean
  /** Optional control rendered in the header, next to the collapse chevron (e.g. a "show as column" toggle). */
  headerAction?: React.ReactNode
}

export function FilterSection({ title, children, defaultOpen = false, headerAction }: FilterSectionProps) {
  const [open, setOpen] = useState(defaultOpen)
  const id = `fs-${title.toLowerCase().replace(/\s+/g, '-')}`

  return (
    <div className="cl-filter-section">
      <div className="cl-filter-section__header">
        <button
          type="button"
          className="cl-filter-section__toggle"
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
          aria-controls={id}
        >
          <span>{title}</span>
          <ChevronDown
            size={13}
            aria-hidden
            style={{
              transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
              transition: 'transform 0.2s ease',
              flexShrink: 0,
            }}
          />
        </button>
        {headerAction && <div className="cl-filter-section__action">{headerAction}</div>}
      </div>

      {open && (
        <div id={id} className="cl-filter-section__body">
          {children}
        </div>
      )}
    </div>
  )
}
