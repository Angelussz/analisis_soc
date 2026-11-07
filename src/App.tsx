import { Shield, MemoryStick as Memory, Database, AlertTriangle, Users, Server, Link as LinkIcon, CheckCircle } from 'lucide-react'
import { FileUploader } from '@/components/upload/FileUploader'
import { useLogStore } from '@/store/logStore'
import { evaluateIncidentRisk } from '@/lib/riskClassifier'

export default function App() {
  const { logs, incidents, fileName } = useLogStore()

  const criticalCount = incidents.filter((i) => i.risk === 'CRITICAL').length
  const highCount = incidents.filter((i) => i.risk === 'HIGH').length
  const mediumCount = incidents.filter((i) => i.risk === 'MEDIUM').length

  return (
    <div className="min-h-screen bg-surface text-on-surface flex flex-col items-center justify-start p-4 sm:p-8">
      <div className="max-w-5xl w-full flex flex-col gap-6">
        {/* Header Superior */}
        <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-surface-container border border-outline-variant/30 shadow-lg">
          <div className="flex items-center gap-3.5">
            <div className="p-2.5 rounded-xl bg-primary-container/20 text-primary border border-primary/30">
              <Shield className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-bold tracking-tight text-on-surface">
                  SOC L2 Sentinel
                </h1>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-tertiary-container/20 text-tertiary border border-tertiary/30">
                  NIVEL 2 // MOTOR CORRELADOR LISTO
                </span>
              </div>
              <p className="text-xs text-on-surface-variant mt-0.5">
                Plataforma de análisis forense SIEM y correlación de amenazas (100% Client-Side)
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 text-xs font-mono text-on-surface-variant">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface-container-low border border-outline-variant/20">
              <Memory className="w-3.5 h-3.5 text-tertiary" />
              <span>Web Worker: <strong className="text-tertiary">Activo</strong></span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface-container-low border border-outline-variant/20">
              <Database className="w-3.5 h-3.5 text-secondary" />
              <span>Logs: <strong className="text-on-surface">{logs.length}</strong></span>
            </div>
            {incidents.length > 0 && (
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-error-container/30 border border-error/40 text-error">
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>Incidentes: <strong>{incidents.length}</strong></span>
              </div>
            )}
          </div>
        </header>

        {/* Zona de Carga (FileUploader) */}
        <section>
          <FileUploader />
        </section>

        {/* Resumen de Incidentes Detectados (Fase 3) */}
        {incidents.length > 0 && (
          <section className="flex flex-col gap-4 p-5 rounded-2xl bg-surface-container border border-outline-variant/30 shadow-xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-outline-variant/20 pb-3">
              <div>
                <h3 className="text-base font-bold text-on-surface flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-error" />
                  Incidentes Correlacionados por los 6 Detectores ({incidents.length})
                </h3>
                <p className="text-xs text-on-surface-variant mt-0.5 font-mono">
                  Heurística MITRE ATT&CK aplicada sobre {logs.length} eventos en {fileName}
                </p>
              </div>

              <div className="flex items-center gap-2 text-xs font-mono">
                <span className="px-2 py-0.5 rounded bg-rose-500/10 text-rose-400 border border-rose-500/30">
                  {criticalCount} Críticos
                </span>
                <span className="px-2 py-0.5 rounded bg-orange-500/10 text-orange-400 border border-orange-500/30">
                  {highCount} Altos
                </span>
                <span className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/30">
                  {mediumCount} Medios
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-3">
              {incidents.map((inc) => {
                const evalRisk = evaluateIncidentRisk(inc)
                return (
                  <div
                    key={inc.id}
                    className="p-4 rounded-xl bg-surface-container-low border border-outline-variant/20 hover:border-primary/40 transition-all flex flex-col gap-2"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-0.5 rounded text-[11px] font-bold font-mono border ${evalRisk.badgeClass}`}>
                          {inc.risk}
                        </span>
                        <span className="text-[11px] font-mono text-tertiary">
                          {inc.category}
                        </span>
                        <span className="text-[11px] font-mono text-on-surface-variant">
                          • {inc.id}
                        </span>
                      </div>
                      <span className="text-[11px] font-mono text-on-surface-variant">
                        {inc.timestamp instanceof Date ? inc.timestamp.toISOString().substring(11, 19) : ''} UTC
                      </span>
                    </div>

                    <h4 className="text-sm font-semibold text-on-surface">
                      {inc.title}
                    </h4>

                    <p className="text-xs text-on-surface-variant leading-relaxed">
                      {inc.justification}
                    </p>

                    <div className="flex flex-wrap items-center gap-4 text-[11px] font-mono text-on-surface-variant pt-2 border-t border-outline-variant/10">
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
            </div>
          </section>
        )}

        {/* Previsualización rápida de logs de ejemplo tras la carga */}
        {logs.length > 0 && incidents.length === 0 && (
          <section className="flex flex-col gap-3 p-5 rounded-2xl bg-surface-container border border-outline-variant/30 shadow-lg">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-tertiary" />
              <h3 className="text-sm font-semibold text-on-surface">
                {logs.length} eventos procesados (Sin incidentes de alta severidad identificados)
              </h3>
            </div>
          </section>
        )}
      </div>
    </div>
  )
}
