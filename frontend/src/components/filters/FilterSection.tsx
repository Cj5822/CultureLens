import { useState } from 'react'
import { ChevronDown } from 'lucide-react'

export interface FilterSectionProps {
  title: string
  children: React.ReactNode
  defaultOpen?: boolean
}

export function FilterSection({ title, children, defaultOpen = false }: FilterSectionProps) {
  const [open, setOpen] = useState(defaultOpen)
  const id = `fs-${title.toLowerCase().replace(/\s+/g, '-')}`

  return (
    <div className="cl-filter-section">
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

      {open && (
        <div id={id} className="cl-filter-section__body">
          {children}
        </div>
      )}
    </div>
  )
}
