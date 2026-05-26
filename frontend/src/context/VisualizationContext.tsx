import {
  createContext,
  useContext,
  useState,
  useCallback,
  useMemo,
  type ReactNode,
} from 'react'

// ─── State & value types ───────────────────────────────────────────────────────

export interface VisualizationState {
  selectedId: string | null
  highlightedIds: string[]
  hoveredId: string | null
}

export interface VisualizationContextValue extends VisualizationState {
  setSelectedId: (id: string | null) => void
  setHoveredId: (id: string | null) => void
  setHighlightedIds: (ids: string[]) => void
  clearVisualizationState: () => void
}

// ─── Context ───────────────────────────────────────────────────────────────────

const VisualizationContext = createContext<VisualizationContextValue | null>(null)

// ─── Provider ──────────────────────────────────────────────────────────────────

export interface VisualizationProviderProps {
  children: ReactNode
}

export function VisualizationProvider({ children }: VisualizationProviderProps) {
  const [selectedId,    setSelectedIdState]    = useState<string | null>(null)
  const [highlightedIds, setHighlightedIdsState] = useState<string[]>([])
  const [hoveredId,     setHoveredIdState]     = useState<string | null>(null)

  const setSelectedId = useCallback((id: string | null) => {
    setSelectedIdState(id)
  }, [])

  const setHoveredId = useCallback((id: string | null) => {
    setHoveredIdState(id)
  }, [])

  const setHighlightedIds = useCallback((ids: string[]) => {
    // Deduplicate before storing
    setHighlightedIdsState(Array.from(new Set(ids)))
  }, [])

  const clearVisualizationState = useCallback(() => {
    setSelectedIdState(null)
    setHighlightedIdsState([])
    setHoveredIdState(null)
  }, [])

  // Memoised context value — only re-creates when state actually changes
  const value = useMemo<VisualizationContextValue>(
    () => ({
      selectedId,
      highlightedIds,
      hoveredId,
      setSelectedId,
      setHoveredId,
      setHighlightedIds,
      clearVisualizationState,
    }),
    [
      selectedId,
      highlightedIds,
      hoveredId,
      setSelectedId,
      setHoveredId,
      setHighlightedIds,
      clearVisualizationState,
    ],
  )

  return (
    <VisualizationContext.Provider value={value}>
      {children}
    </VisualizationContext.Provider>
  )
}

// ─── Consumer hook ─────────────────────────────────────────────────────────────

/**
 * Returns the shared visualization state. Must be used inside a
 * `<VisualizationProvider>` — throws otherwise so misconfiguration is caught early.
 */
export function useVisualizationContext(): VisualizationContextValue {
  const ctx = useContext(VisualizationContext)
  if (!ctx) {
    throw new Error('useVisualizationContext must be used within a VisualizationProvider')
  }
  return ctx
}
