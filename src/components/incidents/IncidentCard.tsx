import React from 'react'
import { Users, Server, Database, Link as LinkIcon, ArrowRight, ShieldAlert, CheckCircle2 } from 'lucide-react'
import type { Incident } from '@/types/log.types'
import { evaluateIncidentRisk } from '@/lib/riskClassifier'
import { useReportStore } from '@/store/reportStore'

interface IncidentCardProps {
  incident: Incident
  onSelect: (incident: Incident) => void
}

export const IncidentCard: React.FC<IncidentCardProps> = ({ incident, onSelect }) => {
  const evalRisk = evaluateIncidentRisk(incident)
  const { findings } = useReportStore()
  const isConfirmed = findings.some((f) => f.incident.id === incident.id && f.confirmed)

  const isCritical = incident.risk === 'CRITICAL'

  return (
    <div
      onClick={() => onSelect(incident)}
      className="group relative bg-surface-container rounded-2xl p-5 border border-outline-variant/30 hover:border-primary/60 transition-all duration-200 cursor-pointer shadow-sm hover:shadow-xl flex flex-col gap-3.5 overflow-hidden"
    >
      {/* Borde izquierdo semántico de severidad */}
      <div
        className={`absolute left-0 top-0 bottom-0 w-1.5 ${
          incident.risk === 'CRITICAL'
            ? 'bg-rose-500'
            : incident.risk === 'HIGH'
            ? 'bg-orange-500'
            : incident.risk === 'MEDIUM'
            ? 'bg-amber-500'
            : 'bg-cyan-500'
        }`}
      />

      {/* Cabecera del Card */}
      <div className="flex flex-wrap items-center justify-between gap-2 pl-2">
        <div className="flex items-center gap-2">
          {isCritical ? (
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-error opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-error" />
            </span>
          ) : (
            <ShieldAlert className="w-4 h-4 text-secondary" />
          )}

          <span className={`px-2 py-0.5 rounded text-[11px] font-mono font-bold border ${evalRisk.badgeClass}`}>
            {incident.risk}
          </span>

          <span className="text-xs font-mono text-tertiary font-semibold uppercase">
            {incident.category}
          </span>

          <span className="text-xs font-mono text-on-surface-variant">
            • {incident.id}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {isConfirmed && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-tertiary-container/30 text-tertiary font-mono text-[10px] font-semibold">
              <CheckCircle2 className="w-3 h-3" /> EN INFORME
            </span>
          )}

          <span className="text-xs font-mono text-on-surface-variant">
            {incident.timestamp instanceof Date ? incident.timestamp.toISOString().substring(11, 19) : ''} UTC
          </span>
        </div>
      </div>

      {/* Título y Justificación */}
      <div className="space-y-1 pl-2">
        <h3 className="text-base font-bold text-on-surface group-hover:text-primary transition-colors leading-snug">
          {incident.title}
        </h3>
        <p className="text-xs text-on-surface-variant leading-relaxed line-clamp-2">
          {incident.justification}
        </p>
      </div>

      {/* Footer de Entidades e Interactividad */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-outline-variant/15 pl-2 text-xs font-mono text-on-surface-variant">
        <div className="flex flex-wrap items-center gap-3.5">
          <div className="flex items-center gap-1.5">
            <Users className="w-3.5 h-3.5 text-secondary" />
            <span>
              Usuario: <strong className="text-on-surface">{incident.affectedUsers[0] || 'N/A'}</strong>
              {incident.affectedUsers.length > 1 && ` (+${incident.affectedUsers.length - 1})`}
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <Server className="w-3.5 h-3.5 text-tertiary" />
            <span>
              Host: <strong className="text-on-surface">{incident.affectedHosts[0] || 'N/A'}</strong>
              {incident.affectedHosts.length > 1 && ` (+${incident.affectedHosts.length - 1})`}
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <Database className="w-3.5 h-3.5 text-primary" />
            <span>
              Evidencias: <strong className="text-on-surface">{incident.relatedLogs.length} logs</strong>
            </span>
          </div>

          {incident.correlatedWith && incident.correlatedWith.length > 0 && (
            <div className="flex items-center gap-1 text-primary">
              <LinkIcon className="w-3 h-3" />
              <span>{incident.correlatedWith.length} correlación(es)</span>
            </div>
          )}
        </div>

        <button
          onClick={(e) => {
            e.stopPropagation()
            onSelect(incident)
          }}
          className="inline-flex items-center gap-1 text-primary text-xs font-semibold group-hover:translate-x-1 transition-transform ml-auto"
        >
          <span>Detalles</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  )
}
