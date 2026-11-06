import { Shield, MemoryStick as Memory, Database, CheckCircle, Clock } from 'lucide-react'
import { FileUploader } from '@/components/upload/FileUploader'
import { useLogStore } from '@/store/logStore'

export default function App() {
  const { logs, fileName } = useLogStore()

  return (
    <div className="min-h-screen bg-surface text-on-surface flex flex-col items-center justify-start p-4 sm:p-8">
      <div className="max-w-4xl w-full flex flex-col gap-6">
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
                  NIVEL 2 // FORENSE
                </span>
              </div>
              <p className="text-xs text-on-surface-variant mt-0.5">
                Plataforma de análisis forense SIEM y correlación de amenazas (100% Client-Side)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 text-xs font-mono text-on-surface-variant">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface-container-low border border-outline-variant/20">
              <Memory className="w-3.5 h-3.5 text-tertiary" />
              <span>Web Worker: <strong className="text-tertiary">Activo</strong></span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface-container-low border border-outline-variant/20">
              <Database className="w-3.5 h-3.5 text-secondary" />
              <span>Logs: <strong className="text-on-surface">{logs.length}</strong></span>
            </div>
          </div>
        </header>

        {/* Zona de Carga (FileUploader) */}
        <section>
          <FileUploader />
        </section>

        {/* Previsualización rápida de logs tras la carga (Fase 2) */}
        {logs.length > 0 && (
          <section className="flex flex-col gap-3 p-5 rounded-2xl bg-surface-container border border-outline-variant/30 shadow-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-tertiary" />
                <h3 className="text-sm font-semibold text-on-surface">
                  Muestra de Eventos Normalizados ({fileName})
                </h3>
              </div>
              <span className="text-xs font-mono text-on-surface-variant">
                Primeros 5 de {logs.length} registros
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
                    <th className="p-2.5">Severidad</th>
                    <th className="p-2.5">Descripción</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/10 text-on-surface">
                  {logs.slice(0, 5).map((log) => (
                    <tr key={log.logId} className="hover:bg-surface-container/60 transition-colors">
                      <td className="p-2.5 text-primary font-bold">{log.logId}</td>
                      <td className="p-2.5 text-on-surface-variant">
                        {log.timestamp instanceof Date && !isNaN(log.timestamp.getTime())
                          ? log.timestamp.toISOString().replace('T', ' ').substring(0, 19)
                          : String(log.timestamp)}
                      </td>
                      <td className="p-2.5 text-secondary">{log.hostname}</td>
                      <td className="p-2.5">{log.eventId}</td>
                      <td className="p-2.5">{log.user}</td>
                      <td className="p-2.5 text-tertiary">{log.sourceIp}</td>
                      <td className="p-2.5">
                        <span
                          className={`px-1.5 py-0.5 rounded text-[10px] font-semibold ${
                            log.severity === 'High'
                              ? 'bg-error-container/40 text-error border border-error/30'
                              : log.severity === 'Medium'
                              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                              : log.severity === 'Warning'
                              ? 'bg-orange-500/20 text-orange-300 border border-orange-500/30'
                              : 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                          }`}
                        >
                          {log.severity}
                        </span>
                      </td>
                      <td className="p-2.5 text-on-surface-variant truncate max-w-xs" title={log.eventDescription}>
                        {log.eventDescription}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <p className="text-[11px] text-on-surface-variant font-mono text-right flex items-center justify-end gap-1">
              <Clock className="w-3 h-3 text-secondary" />
              Datos en memoria reactiva de Zustand listos para la Fase 3 (Detectores).
            </p>
          </section>
        )}
      </div>
    </div>
  )
}
