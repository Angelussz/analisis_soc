import React from 'react'
import { X, ShieldAlert, Users, Server, Database, Lock, AlertOctagon, CheckCircle2, Terminal } from 'lucide-react'
import type { Incident, LogEntry } from '@/types/log.types'
import { evaluateIncidentRisk } from '@/lib/riskClassifier'
import { useReportStore } from '@/store/reportStore'

interface IncidentDetailModalProps {
  incident: Incident | null
  onClose: () => void
}

export const IncidentDetailModal: React.FC<IncidentDetailModalProps> = ({ incident, onClose }) => {
  const { findings, setFindings } = useReportStore()

  if (!incident) return null

  const evalRisk = evaluateIncidentRisk(incident)
  const isConfirmedInReport = findings.some((f) => f.incident.id === incident.id && f.confirmed)

  const handleToggleConfirm = () => {
    const existingIndex = findings.findIndex((f) => f.incident.id === incident.id)
    if (existingIndex >= 0) {
      const updated = [...findings]
      updated[existingIndex].confirmed = !updated[existingIndex].confirmed
      setFindings(updated)
    } else {
      setFindings([...findings, { incident, confirmed: true }])
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-surface-container-lowest/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl max-h-[90vh] bg-surface-container border border-outline-variant/40 rounded-2xl shadow-2xl flex flex-col overflow-hidden text-on-surface">
        {/* Modal Header */}
        <div className="p-5 border-b border-outline-variant/20 flex items-start justify-between gap-4 bg-surface-container-high">
          <div className="flex items-start gap-3">
            <div className={`p-2.5 rounded-xl border mt-0.5 ${evalRisk.badgeClass}`}>
              <ShieldAlert className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className={`px-2.5 py-0.5 rounded text-xs font-mono font-bold border ${evalRisk.badgeClass}`}>
                  {incident.risk}
                </span>
                <span className="text-xs font-mono text-tertiary font-semibold uppercase">
                  {incident.category}
                </span>
                <span className="text-xs font-mono text-on-surface-variant">
                  • {incident.id}
                </span>
                <span className="text-xs font-mono text-outline">
                  ({incident.timestamp instanceof Date ? incident.timestamp.toISOString().replace('T', ' ').substring(0, 19) : ''} UTC)
                </span>
              </div>
              <h2 className="text-lg font-bold text-on-surface mt-1">
                {incident.title}
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">
          {/* Fila de Entidades Afectadas */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-3 bg-surface-container-low rounded-xl border border-outline-variant/20 flex items-center gap-3">
              <Users className="w-5 h-5 text-secondary shrink-0" />
              <div className="min-w-0">
                <p className="text-[11px] font-mono text-on-surface-variant uppercase">Usuarios Afectados</p>
                <p className="text-xs font-mono font-bold text-on-surface truncate">
                  {incident.affectedUsers.join(', ') || 'N/A'}
                </p>
              </div>
            </div>

            <div className="p-3 bg-surface-container-low rounded-xl border border-outline-variant/20 flex items-center gap-3">
              <Server className="w-5 h-5 text-tertiary shrink-0" />
              <div className="min-w-0">
                <p className="text-[11px] font-mono text-on-surface-variant uppercase">Equipos Impactados</p>
                <p className="text-xs font-mono font-bold text-on-surface truncate">
                  {incident.affectedHosts.join(', ') || 'N/A'}
                </p>
              </div>
            </div>

            <div className="p-3 bg-surface-container-low rounded-xl border border-outline-variant/20 flex items-center gap-3">
              <Database className="w-5 h-5 text-primary shrink-0" />
              <div className="min-w-0">
                <p className="text-[11px] font-mono text-on-surface-variant uppercase">Evidencias Vinculadas</p>
                <p className="text-xs font-mono font-bold text-on-surface">
                  {incident.relatedLogs.length} logs SIEM
                </p>
              </div>
            </div>
          </div>

          {/* Justificación y Detalle Técnico */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono uppercase tracking-wider text-secondary font-bold flex items-center gap-1.5">
              <Terminal className="w-4 h-4" />
              Análisis y Justificación Forense
            </h4>
            <div className="p-4 bg-surface-container-low rounded-xl border border-outline-variant/20 text-xs text-on-surface leading-relaxed">
              {incident.justification}
            </div>

            <div className="p-4 bg-surface-container-lowest rounded-xl border border-outline-variant/20 font-mono text-xs text-on-surface-variant space-y-1">
              <p className="text-tertiary font-bold">Detalle Técnico Heurístico:</p>
              <p className="text-on-surface/90 leading-relaxed">{incident.technicalDetail}</p>
            </div>
          </div>

          {/* Impacto Forense */}
          <div className="space-y-2">
            <h4 className="text-xs font-mono uppercase tracking-wider text-error font-bold flex items-center gap-1.5">
              <AlertOctagon className="w-4 h-4" />
              Impacto Organizacional Estimado
            </h4>
            <div className="p-3.5 bg-error-container/20 rounded-xl border border-error/30 text-xs text-on-error-container font-mono leading-relaxed">
              {incident.impact}
            </div>
          </div>

          {/* Tabla de Evidencias (Logs Raw Relacionados) */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-mono uppercase tracking-wider text-primary font-bold flex items-center gap-1.5">
                <Database className="w-4 h-4" />
                Registros SIEM de Evidencia ({incident.relatedLogs.length})
              </h4>
              <span className="text-[11px] font-mono text-on-surface-variant">
                Mostrando hasta 8 registros clave
              </span>
            </div>

            <div className="overflow-x-auto rounded-xl border border-outline-variant/20 bg-surface-container-lowest">
              <table className="w-full text-left font-mono text-[11px] border-collapse">
                <thead>
                  <tr className="border-b border-outline-variant/20 bg-surface-container-low text-on-surface-variant">
                    <th className="p-2.5">Log ID</th>
                    <th className="p-2.5">Timestamp</th>
                    <th className="p-2.5">Host</th>
                    <th className="p-2.5">Event ID</th>
                    <th className="p-2.5">Usuario</th>
                    <th className="p-2.5">IP Origen</th>
                    <th className="p-2.5">Comando / Descripción</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/10 text-on-surface">
                  {incident.relatedLogs.slice(0, 8).map((log: LogEntry) => (
                    <tr key={log.logId} className="hover:bg-surface-container/60 transition-colors">
                      <td className="p-2.5 text-primary font-bold">{log.logId}</td>
                      <td className="p-2.5 text-on-surface-variant whitespace-nowrap">
                        {log.timestamp instanceof Date && !isNaN(log.timestamp.getTime())
                          ? log.timestamp.toISOString().replace('T', ' ').substring(0, 19)
                          : String(log.timestamp)}
                      </td>
                      <td className="p-2.5 text-secondary">{log.hostname}</td>
                      <td className="p-2.5">{log.eventId}</td>
                      <td className="p-2.5">{log.user}</td>
                      <td className="p-2.5 text-tertiary">{log.sourceIp}</td>
                      <td className="p-2.5 text-on-surface-variant truncate max-w-xs">
                        {log.processCommandLine || log.eventDescription}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-outline-variant/20 bg-surface-container-high flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              onClick={() => alert(`Acción táctica ejecutada para aislar o auditar ${incident.affectedHosts.join(', ')}`)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-surface-container-lowest hover:bg-surface-container border border-outline-variant/30 text-xs font-mono font-semibold text-on-surface transition-all"
            >
              <Lock className="w-3.5 h-3.5 text-error" />
              <span>Aislamiento de Emergencia</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleToggleConfirm}
              className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all shadow-md ${
                isConfirmedInReport
                  ? 'bg-tertiary-container text-on-tertiary-container'
                  : 'bg-primary-container text-on-primary-container hover:bg-primary-container/90'
              }`}
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{isConfirmedInReport ? 'Confirmado para Informe (S3)' : 'Incluir en Informe Forense'}</span>
            </button>

            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-surface-container-high hover:bg-surface-bright text-xs font-mono font-medium text-on-surface transition-colors"
            >
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
