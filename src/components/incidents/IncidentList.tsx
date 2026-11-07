import React, { useState } from 'react'
import { Search, AlertTriangle } from 'lucide-react'
import { IncidentCard } from './IncidentCard'
import { IncidentDetailModal } from './IncidentDetailModal'
import type { Incident } from '@/types/log.types'
import { useLogStore } from '@/store/logStore'

export const IncidentList: React.FC = () => {
  const { incidents } = useLogStore()
  const [selectedIncident, setSelectedIncident] = useState<Incident | null>(null)
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL')
  const [riskFilter, setRiskFilter] = useState<string>('ALL')
  const [search, setSearch] = useState<string>('')

  const criticalCount = incidents.filter((i) => i.risk === 'CRITICAL').length
  const highCount = incidents.filter((i) => i.risk === 'HIGH').length

  const categories: { key: string; label: string; count: number }[] = [
    { key: 'ALL', label: 'Todos', count: incidents.length },
    {
      key: 'BRUTE_FORCE',
      label: 'Fuerza Bruta',
      count: incidents.filter((i) => i.category === 'BRUTE_FORCE').length,
    },
    {
      key: 'PERSISTENCE',
      label: 'Persistencia & Svc',
      count: incidents.filter((i) => i.category === 'PERSISTENCE' || i.category === 'ESCALATION').length,
    },
    {
      key: 'MALICIOUS_COMMAND',
      label: 'Ransomware & Cmds',
      count: incidents.filter((i) => i.category === 'MALICIOUS_COMMAND').length,
    },
    {
      key: 'WEBSHELL',
      label: 'Webshell & RCE',
      count: incidents.filter((i) => i.category === 'WEBSHELL').length,
    },
    {
      key: 'LATERAL_MOVEMENT',
      label: 'Mov. Lateral',
      count: incidents.filter((i) => i.category === 'LATERAL_MOVEMENT').length,
    },
    {
      key: 'EXFILTRATION',
      label: 'Exfiltración',
      count: incidents.filter((i) => i.category === 'EXFILTRATION' || i.category === 'ANOMALY').length,
    },
  ]

  const filteredIncidents = incidents.filter((inc) => {
    // Filtro por riesgo
    if (riskFilter !== 'ALL' && inc.risk !== riskFilter) return false

    // Filtro por categoría
    if (categoryFilter !== 'ALL') {
      if (categoryFilter === 'PERSISTENCE' && inc.category !== 'PERSISTENCE' && inc.category !== 'ESCALATION') return false
      if (categoryFilter === 'EXFILTRATION' && inc.category !== 'EXFILTRATION' && inc.category !== 'ANOMALY') return false
      if (categoryFilter !== 'PERSISTENCE' && categoryFilter !== 'EXFILTRATION' && inc.category !== categoryFilter) return false
    }

    // Filtro por búsqueda de texto
    if (search.trim() !== '') {
      const q = search.toLowerCase()
      const inTitle = inc.title.toLowerCase().includes(q)
      const inDesc = inc.justification.toLowerCase().includes(q)
      const inUser = inc.affectedUsers.some((u) => u.toLowerCase().includes(q))
      const inHost = inc.affectedHosts.some((h) => h.toLowerCase().includes(q))
      const inTech = inc.technicalDetail.toLowerCase().includes(q)
      if (!inTitle && !inDesc && !inUser && !inHost && !inTech) return false
    }

    return true
  })

  return (
    <div className="space-y-5">
      {/* Barra de Telemetría Táctica de Estado */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-2xl bg-surface-container border border-outline-variant/30 text-xs font-mono">
        <div className="flex items-center gap-3 flex-wrap text-on-surface-variant">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-error animate-ping" />
            <span className="text-on-surface font-bold">{incidents.length} AMENAZAS DETECTADAS</span>
          </div>
          <span className="text-outline">|</span>
          <span className="text-error font-semibold">NIVEL CRÍTICO: {criticalCount}</span>
          <span className="text-outline">|</span>
          <span className="text-orange-400 font-semibold">ALTO: {highCount}</span>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-2 py-0.5 rounded bg-surface-container-high text-tertiary font-bold">
            MTTD: &lt;2s
          </span>
          <span className="px-2 py-0.5 rounded bg-surface-container-high text-secondary font-bold">
            CORRELACIÓN: 100%
          </span>
        </div>
      </div>

      {/* Barra de Chips de Categorías MITRE ATT&CK */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
        {categories.map((cat) => {
          const isActive = categoryFilter === cat.key
          return (
            <button
              key={cat.key}
              onClick={() => setCategoryFilter(cat.key)}
              className={`px-3 py-1.5 rounded-xl font-mono text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                isActive
                  ? 'bg-primary-container text-on-primary-container shadow'
                  : 'bg-surface-container text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high'
              }`}
            >
              <span>{cat.label}</span>
              <span
                className={`px-1.5 py-0.2 rounded text-[10px] font-bold ${
                  isActive
                    ? 'bg-surface-container-lowest text-primary'
                    : 'bg-surface-container-high text-on-surface-variant'
                }`}
              >
                {cat.count}
              </span>
            </button>
          )
        })}
      </div>

      {/* Controles de Búsqueda y Severidad */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-on-surface-variant absolute left-3.5 top-3" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por usuario, equipo, vector, técnica o palabra clave..."
            className="w-full bg-surface-container rounded-xl pl-10 pr-4 py-2.5 text-xs font-mono text-on-surface border border-outline-variant/30 focus:border-primary focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-1.5 self-start sm:self-auto">
          {['ALL', 'CRITICAL', 'HIGH', 'MEDIUM'].map((risk) => (
            <button
              key={risk}
              onClick={() => setRiskFilter(risk)}
              className={`px-2.5 py-2 rounded-xl text-xs font-mono font-bold transition-all ${
                riskFilter === risk
                  ? 'bg-surface-bright text-primary border border-primary/50'
                  : 'bg-surface-container text-on-surface-variant hover:text-on-surface'
              }`}
            >
              {risk === 'ALL' ? 'Todos' : risk}
            </button>
          ))}
        </div>
      </div>

      {/* Lista de Incidentes */}
      <div className="space-y-4">
        {filteredIncidents.map((incident) => (
          <IncidentCard
            key={incident.id}
            incident={incident}
            onSelect={(inc) => setSelectedIncident(inc)}
          />
        ))}

        {filteredIncidents.length === 0 && (
          <div className="p-12 text-center text-on-surface-variant font-mono text-xs bg-surface-container rounded-2xl border border-outline-variant/20">
            <AlertTriangle className="w-8 h-8 text-secondary mx-auto mb-2 opacity-50" />
            No hay incidentes que coincidan con los filtros seleccionados.
          </div>
        )}
      </div>

      {/* Modal de Detalle Forense */}
      <IncidentDetailModal
        incident={selectedIncident}
        onClose={() => setSelectedIncident(null)}
      />
    </div>
  )
}
