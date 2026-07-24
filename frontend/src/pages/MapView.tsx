import { useState, useCallback, useMemo } from 'react'
import type { Entity } from '@/types/entities'
import { WorldMap } from '@/components/map/WorldMap'
import { EntityDetailPanel } from '@/components/detail/EntityDetailPanel'
import { CountryEntityList } from '@/components/map/CountryEntityList'
import { useFilterContext } from '@/context/FilterContext'
import { VisualizationProvider } from '@/context/VisualizationContext'
import { useVisualizationSync } from '@/hooks/useVisualizationSync'

// ─── Inner component ──────────────────────────────────────────────────────────

function MapViewContent() {
  const [isPanelOpen, setIsPanelOpen]       = useState(false)
  const [selectedCountry, setSelectedCountry] = useState<{ name: string } | null>(null)
  const [isCountryListOpen, setIsCountryListOpen] = useState(false)

  const { filteredEntities } = useFilterContext()
  const { selectedEntity, selectEntityById } = useVisualizationSync({ entities: filteredEntities })

  const countryEntities = useMemo(() => {
    if (!selectedCountry) return []
    return filteredEntities.filter(
      e => e.country.toLowerCase().trim() === selectedCountry.name.toLowerCase().trim()
    )
  }, [filteredEntities, selectedCountry])

  const handleCountryClick = useCallback(
    (_iso3: string, name: string) => {
      if (selectedCountry?.name.toLowerCase() === name.toLowerCase()) {
        setSelectedCountry(null)
        setIsCountryListOpen(false)
        selectEntityById(null)
        setIsPanelOpen(false)
        return
      }
      setSelectedCountry({ name })
      setIsCountryListOpen(true)
      selectEntityById(null)
      setIsPanelOpen(false)
    },
    [selectedCountry, selectEntityById],
  )

  const handleListEntitySelect = useCallback(
    (entity: Entity) => {
      selectEntityById(entity.id)
      setIsPanelOpen(true)
    },
    [selectEntityById],
  )

  const handleClosePanel = useCallback(() => {
    selectEntityById(null)
    setIsPanelOpen(false)
  }, [selectEntityById])

  const handleCloseCountryList = useCallback(() => {
    setSelectedCountry(null)
    setIsCountryListOpen(false)
    selectEntityById(null)
    setIsPanelOpen(false)
  }, [selectEntityById])

  const handleSelectConnection = useCallback(
    (entity: Entity) => {
      selectEntityById(entity.id)
      setIsPanelOpen(true)
    },
    [selectEntityById],
  )

  return (
    <div className="cl-map-page">
      <div className="cl-map-page__main">
        <div className="cl-map-wrap">
          <WorldMap height="100%" onCountryClick={handleCountryClick} />
        </div>

        {selectedCountry && (
          <CountryEntityList
            countryName={selectedCountry.name}
            entities={countryEntities}
            isOpen={isCountryListOpen}
            onClose={handleCloseCountryList}
            onSelectEntity={handleListEntitySelect}
          />
        )}

        <EntityDetailPanel
          entity={selectedEntity}
          entities={filteredEntities}
          isOpen={isPanelOpen}
          onClose={handleClosePanel}
          onSelectConnection={handleSelectConnection}
        />
      </div>
    </div>
  )
}

export function MapView() {
  return (
    <VisualizationProvider>
      <MapViewContent />
    </VisualizationProvider>
  )
}
