import { useMemo } from 'react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts'
import { useFilterContext } from '@/context/FilterContext'
import type { Instrument, Stakeholder } from '@/types/entities'
import {
  groupByCountry,
  groupByTheme,
  groupByImpact,
} from '@/utils/analytics/grouping'
import { toChartData } from '@/utils/analytics/chartTransformers'

// ─── Palettes ─────────────────────────────────────────────────────────────────

const IMPACT_COLORS: Record<string, string> = {
  symbolic:             '#94a3b8',
  advisory:             '#f5a623',
  binding:              '#6366f1',
  'highly influential': '#ef4444',
}

const STATUS_COLORS: Record<string, string> = {
  draft:          '#94a3b8',
  development:    '#f5a623',
  implementation: '#4f86c6',
  evaluation:     '#5aab6e',
  archive:        '#8a8a8a',
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function StatCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="cl-stat-card">
      <span className="cl-stat-card__value">{value}</span>
      <span className="cl-stat-card__label">{label}</span>
    </div>
  )
}

function ChartCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="cl-chart-card">
      <h3 className="cl-chart-card__title">{title}</h3>
      <div className="cl-chart-card__body">{children}</div>
    </div>
  )
}

// ─── Analytics ────────────────────────────────────────────────────────────────

export function Analytics() {
  const { filteredEntities } = useFilterContext()

  const stakeholders = useMemo(
    () => filteredEntities.filter((e): e is Stakeholder => e.category === 'stakeholders'),
    [filteredEntities],
  )
  const instruments = useMemo(
    () => filteredEntities.filter((e): e is Instrument => e.category === 'instruments'),
    [filteredEntities],
  )

  // ── Chart data ───────────────────────────────────────────────────────────
  const countryData = useMemo(
    () => toChartData(groupByCountry(filteredEntities)),
    [filteredEntities],
  )
  const themeData = useMemo(
    () => toChartData(groupByTheme(filteredEntities)),
    [filteredEntities],
  )
  const impactData = useMemo(
    () => toChartData(groupByImpact(filteredEntities)),
    [filteredEntities],
  )
  const implStatusData = useMemo(() => {
    const counts: Record<string, number> = {}
    for (const inst of instruments) {
      counts[inst.implementationStatus] = (counts[inst.implementationStatus] ?? 0) + 1
    }
    return Object.entries(counts).map(([label, value]) => ({ label, value }))
  }, [instruments])

  const ratioData = useMemo(
    () => [
      { label: 'Stakeholders', value: stakeholders.length },
      { label: 'Instruments',  value: instruments.length },
    ],
    [stakeholders.length, instruments.length],
  )

  // ── Stat card values ─────────────────────────────────────────────────────
  const countriesCount = useMemo(
    () => new Set(filteredEntities.map((e) => e.country)).size,
    [filteredEntities],
  )
  const mostCommonTheme = useMemo(() => {
    const groups = groupByTheme(filteredEntities)
    return groups[0]?.label ?? '—'
  }, [filteredEntities])

  // ── Shared tooltip style ─────────────────────────────────────────────────
  const tooltipStyle = {
    fontSize: 11.5,
    borderRadius: 6,
    border: '1px solid var(--color-border)',
    boxShadow: '0 2px 8px rgb(0 0 0 / 0.08)',
    fontFamily: 'Geist Variable, sans-serif',
  }

  return (
    <div className="cl-analytics-page">

      {/* ── Stat cards ─────────────────────────────────────────────────── */}
      <div className="cl-stat-cards">
        <StatCard label="Total Stakeholders" value={stakeholders.length} />
        <StatCard label="Total Instruments"  value={instruments.length} />
        <StatCard label="Countries Covered"  value={countriesCount} />
        <StatCard label="Most Common Theme"  value={mostCommonTheme} />
      </div>

      {/* ── Charts ─────────────────────────────────────────────────────── */}
      <div className="cl-chart-grid">

        {/* Entries by country */}
        <ChartCard title="Entries by Country">
          <ResponsiveContainer width="100%" height={Math.max(180, countryData.length * 26)}>
            <BarChart
              data={countryData}
              layout="vertical"
              margin={{ top: 0, right: 16, bottom: 0, left: 0 }}
            >
              <XAxis type="number" tick={{ fontSize: 10.5 }} axisLine={false} tickLine={false} />
              <YAxis
                type="category"
                dataKey="label"
                width={90}
                tick={{ fontSize: 10.5 }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip contentStyle={tooltipStyle} cursor={{ fill: 'rgba(0,0,0,0.04)' }} />
              <Bar dataKey="value" name="Entries" fill="#4f86c6" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Entries by thematic focus */}
        <ChartCard title="Entries by Thematic Focus">
          <ResponsiveContainer width="100%" height={Math.max(180, themeData.length * 32)}>
            <BarChart
              data={themeData}
              layout="vertical"
              margin={{ top: 0, right: 16, bottom: 0, left: 0 }}
            >
              <XAxis type="number" tick={{ fontSize: 10.5 }} axisLine={false} tickLine={false} />
              <YAxis
                type="category"
                dataKey="label"
                width={170}
                tick={{ fontSize: 10 }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip contentStyle={tooltipStyle} cursor={{ fill: 'rgba(0,0,0,0.04)' }} />
              <Bar dataKey="value" name="Entries" fill="#4cb8a0" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Impact level breakdown (donut) */}
        <ChartCard title="Breakdown by Impact Level">
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie
                data={impactData}
                dataKey="value"
                nameKey="label"
                innerRadius={56}
                outerRadius={90}
                paddingAngle={2}
              >
                {impactData.map((d) => (
                  <Cell key={d.label} fill={IMPACT_COLORS[d.label] ?? '#8a8a8a'} />
                ))}
              </Pie>
              <Tooltip contentStyle={tooltipStyle} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Stakeholder vs instrument ratio (donut) */}
        <ChartCard title="Stakeholders vs Instruments">
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie
                data={ratioData}
                dataKey="value"
                nameKey="label"
                innerRadius={56}
                outerRadius={90}
                paddingAngle={2}
              >
                <Cell fill="#4f86c6" />
                <Cell fill="#d64f4f" />
              </Pie>
              <Tooltip contentStyle={tooltipStyle} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Implementation status (instruments only, donut) */}
        <ChartCard title="Implementation Status (Instruments)">
          {implStatusData.length === 0 ? (
            <div className="cl-chart-empty">No instruments in current filter.</div>
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie
                  data={implStatusData}
                  dataKey="value"
                  nameKey="label"
                  innerRadius={56}
                  outerRadius={90}
                  paddingAngle={2}
                >
                  {implStatusData.map((d) => (
                    <Cell key={d.label} fill={STATUS_COLORS[d.label] ?? '#8a8a8a'} />
                  ))}
                </Pie>
                <Tooltip contentStyle={tooltipStyle} />
                <Legend wrapperStyle={{ fontSize: 11 }} />
              </PieChart>
            </ResponsiveContainer>
          )}
        </ChartCard>

      </div>
    </div>
  )
}
