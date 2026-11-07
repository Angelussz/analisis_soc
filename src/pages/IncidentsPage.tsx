import React, { useState } from 'react'
import { AlertTriangle, Users, Server, Database, Link as LinkIcon, Search, ShieldAlert } from 'lucide-react'
import { useLogStore } from '@/store/logStore'
import { evaluateIncidentRisk } from '@/lib/riskClassifier'

export const IncidentsPage: React.FC = () => {
  const { incidents, logs } = useLogStore()
  const [filter, setFilter] = useState<string>('ALL')
  const [search, setSearch] = useState<string>('')

  const filteredIncidents = incidents.filter((inc) => {
    const matchesFilter = filter === 'ALL' || inc.risk === filter
    const matchesSearch =
      search === '' ||
      inc.title.toLowerCase().includes(search.toLowerCase()) ||
      inc.category.toLowerCase().includes(search.toLowerCase()) ||
      inc.affectedUsers.some((u) => u.toLowerCase().includes(search.toLowerCase())) ||
      inc.affectedHosts.some((h) => h.toLowerCase().includes(search.toLowerCase()))
    return matchesFilter && matchesSearch
  })

  return (
    <div className="space-y-6">
      {/* Cabecera */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-outline-variant/20 pb-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-on-surface flex items-center gap-2.5">
            <ShieldAlert className="w-6 h-6 text-error" />
            Centro de Incidentes Forenses
          </h2>
          <p className="text-xs text-on-surface-variant font-mono mt-0.5">
            {incidents.length} incidentes correlacionados mediante 6 detectores heurísticos sobre {logs.length} eventos
          </p>
        </div>

        {/* Filtros de Riesgo */}
        <div className="flex items-center gap-2 flex-wrap">
          {['ALL', 'CRITICAL', 'HIGH', 'MEDIUM'].map((level) => (
            <button
              key={level}
              onClick={() => setFilter(level)}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-semibold transition-all ${
                filter === level
                  ? 'bg-primary-container text-on-primary-container shadow'
                  : 'bg-surface-container-high text-on-surface-variant hover:text-on-surface'
              }`}
            >
              {level === 'ALL' ? 'Todos' : level}
            </button>
          ))}
        </div>
      </div>

      {/* Barra de Búsqueda */}
      <div className="relative">
        <Search className="w-4 h-4 text-on-surface-variant absolute left-3.5 top-3" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar por título, categoría, usuario o host..."
          className="w-full bg-surface-container rounded-xl pl-10 pr-4 py-2.5 text-xs font-mono text-on-surface border border-outline-variant/30 focus:border-primary focus:outline-none"
        />
      </div>

      {/* Lista de Incidentes */}
      <div className="space-y-4">
        {filteredIncidents.map((inc) => {
          const evalRisk = evaluateIncidentRisk(inc)
          return (
            <div
              key={inc.id}
              className="p-5 rounded-2xl bg-surface-container border border-outline-variant/30 hover:border-primary/50 transition-all flex flex-col gap-3 shadow-sm"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className={`px-2.5 py-0.5 rounded text-xs font-mono font-bold border ${evalRisk.badgeClass}`}>
                    {inc.risk}
                  </span>
                  <span className="text-xs font-mono text-tertiary font-semibold">
                    {inc.category}
                  </span>
                  <span className="text-xs font-mono text-on-surface-variant">
                    • {inc.id}
                  </span>
                </div>
                <span className="text-xs font-mono text-on-surface-variant">
                  {inc.timestamp instanceof Date ? inc.timestamp.toISOString().substring(11, 19) : ''} UTC
                </span>
              </div>

              <h3 className="text-base font-bold text-on-surface">
                {inc.title}
              </h3>

              <p className="text-xs text-on-surface-variant leading-relaxed">
                {inc.justification}
              </p>

              <div className="p-3 bg-surface-container-low rounded-xl border border-outline-variant/20 font-mono text-[11px] text-on-surface-variant">
                <strong className="text-secondary">Detalle Técnico:</strong> {inc.technicalDetail}
              </div>

              <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-on-surface-variant pt-2 border-t border-outline-variant/10">
                <div className="flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-secondary" />
                  <span>Usuarios: <strong className="text-on-surface">{inc.affectedUsers.join(', ') || 'N/A'}</strong></span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Server className="w-3.5 h-3.5 text-tertiary" />
                  <span>Hosts: <strong className="text-on-surface">{inc.affectedHosts.join(', ') || 'N/A'}</strong></span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Database className="w-3.5 h-3.5 text-primary" />
                  <span>Evidencias: <strong className="text-on-surface">{inc.relatedLogs.length} logs</strong></span>
                </div>
                {inc.correlatedWith && inc.correlatedWith.length > 0 && (
                  <div className="flex items-center gap-1 text-primary">
                    <LinkIcon className="w-3 h-3" />
                    <span>Correlacionado con {inc.correlatedWith.length} incidente(s)</span>
                  </div>
                )}
              </div>
            </div>
          )
        })}

        {filteredIncidents.length === 0 && (
          <div className="p-12 text-center text-on-surface-variant font-mono text-xs bg-surface-container rounded-2xl border border-outline-variant/20">
            <AlertTriangle className="w-8 h-8 text-secondary mx-auto mb-2 opacity-50" />
            No se encontraron incidentes que coincidan con los criterios de búsqueda.
          </div>
        )}
      </div>
    </div>
  )
}
