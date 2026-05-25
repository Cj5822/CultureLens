import { useState } from 'react'

export interface MultiSelectFilterProps<T extends string> {
  label: string
  options: readonly T[]
  selected: readonly T[]
  onChange: (values: T[]) => void
}

export function MultiSelectFilter<T extends string>({
  label,
  options,
  selected,
  onChange,
}: MultiSelectFilterProps<T>) {
  const [search, setSearch] = useState('')

  const visible = search
    ? options.filter((o) => o.toLowerCase().includes(search.toLowerCase()))
    : options

  function toggle(value: T) {
    if (selected.includes(value)) {
      onChange(selected.filter((v) => v !== value) as T[])
    } else {
      onChange([...selected, value] as T[])
    }
  }

  return (
    <div className="cl-multiselect" role="group" aria-label={label}>
      {options.length > 5 && (
        <input
          type="search"
          placeholder="Search…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="cl-multiselect__search"
          aria-label={`Search ${label} options`}
        />
      )}

      <div className="cl-multiselect__list">
        {visible.length === 0 ? (
          <p className="cl-multiselect__empty">No options match</p>
        ) : (
          visible.map((option) => (
            <label key={option} className="cl-multiselect__item">
              <input
                type="checkbox"
                checked={selected.includes(option)}
                onChange={() => toggle(option)}
                className="cl-multiselect__checkbox"
              />
              <span className="cl-multiselect__label">{option}</span>
            </label>
          ))
        )}
      </div>

      {selected.length > 0 && (
        <p className="cl-multiselect__count">
          {selected.length} selected
        </p>
      )}
    </div>
  )
}
