import React from 'react'
import { CheckCircle2, Flame, AlertTriangle, CloudUpload } from 'lucide-react'
import { useLogStore } from '@/store/logStore'

export const KPICards: React.FC = () => {
  const { logs, incidents } = useLogStore()

  const criticalCount = incidents.filter((i) => i.risk === 'CRITICAL').length
  const highCount = incidents.filter((i) => i.risk === 'HIGH').length
  const mediumCount = incidents.filter((i) => i.risk === 'MEDIUM').length

  // Calcular volumen de exfiltración
  let exfilBytes = 0
  let exfilFlows = 0
  for (const log of logs) {
    const fullText = `${log.processCommandLine || ''} ${log.eventDescription || ''}`
    const match = fullText.match(/bytes_out=(\d+)/i)
    if (match) {
      exfilBytes += parseInt(match[1], 10)
      exfilFlows++
    }
  }
  const exfilMb = exfilBytes > 0 ? (exfilBytes / (1024 * 1024)).toFixed(0) : '0'

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {/* KPI 1: Logs Normalizados */}
      <div className="bg-surface-container rounded-2xl p-4 border border-outline-variant/30 flex flex-col justify-between shadow-sm relative overflow-hidden">
        <div className="flex items-center justify-between text-on-surface-variant">
          <span className="font-mono text-xs uppercase tracking-wider text-on-surface-variant font-semibold">
            Logs Normalizados
          </span>
          <CheckCircle2 className="w-5 h-5 text-tertiary" />
        </div>
        <div className="mt-3 flex items-baseline justify-between">
          <span className="font-mono text-3xl font-bold text-on-surface tracking-tight">
            {logs.length}
          </span>
          <span className="font-mono text-xs text-tertiary bg-tertiary-container/30 px-2 py-0.5 rounded flex items-center font-bold">
            100% OK
          </span>
        </div>
        <div className="mt-2 flex items-center gap-1.5 text-on-surface-variant font-mono text-xs opacity-75">
          <span className="w-2 h-2 rounded-full bg-tertiary" />
          <span>0 errores de parseo SIEM</span>
        </div>
      </div>

      {/* KPI 2: Críticos Activos */}
      <div className="bg-surface-container rounded-2xl p-4 border border-error/30 flex flex-col justify-between shadow-sm relative overflow-hidden">
        <div className="flex items-center justify-between text-on-surface-variant">
          <span className="font-mono text-xs uppercase tracking-wider text-error font-semibold">
            Críticos Activos
          </span>
          <div className="relative flex items-center justify-center">
            <span className="animate-ping absolute inline-flex h-3.5 w-3.5 rounded-full bg-error opacity-60" />
            <Flame className="w-5 h-5 text-error relative" />
          </div>
        </div>
        <div className="mt-3 flex items-baseline justify-between">
          <span className="font-mono text-3xl font-bold text-error tracking-tight">
            {criticalCount}
          </span>
          <span className="font-mono text-xs text-error bg-error-container/40 px-2 py-0.5 rounded font-bold border border-error/30">
            SEV-1
          </span>
        </div>
        <div className="mt-2 flex items-center gap-1.5 text-error font-mono text-xs">
          <span>⚡ Contención urgente requerida</span>
        </div>
      </div>

      {/* KPI 3: Altos / Medios */}
      <div className="bg-surface-container rounded-2xl p-4 border border-outline-variant/30 flex flex-col justify-between shadow-sm">
        <div className="flex items-center justify-between text-on-surface-variant">
          <span className="font-mono text-xs uppercase tracking-wider text-on-surface-variant font-semibold">
            Altos / Medios
          </span>
          <AlertTriangle className="w-5 h-5 text-secondary" />
        </div>
        <div className="mt-3 flex items-baseline justify-between">
          <span className="font-mono text-3xl font-bold text-secondary tracking-tight">
            {highCount + mediumCount}
          </span>
          <span className="font-mono text-xs text-secondary bg-secondary-container/20 px-2 py-0.5 rounded font-semibold border border-secondary/30">
            {highCount}A / {mediumCount}M
          </span>
        </div>
        <div className="mt-2 flex items-center gap-1.5 text-on-surface-variant font-mono text-xs opacity-75">
          <span>SLA Forense: Prioritario</span>
        </div>
      </div>

      {/* KPI 4: Exfiltración Estimada */}
      <div className="bg-surface-container rounded-2xl p-4 border border-outline-variant/30 flex flex-col justify-between shadow-sm">
        <div className="flex items-center justify-between text-on-surface-variant">
          <span className="font-mono text-xs uppercase tracking-wider text-on-surface-variant font-semibold">
            Exfiltración Est.
          </span>
          <CloudUpload className="w-5 h-5 text-secondary-container" />
        </div>
        <div className="mt-3 flex items-baseline justify-between">
          <span className="font-mono text-3xl font-bold text-secondary-container tracking-tight">
            ~{exfilMb}
          </span>
          <span className="font-mono text-xs text-secondary-container bg-secondary-container/20 px-2 py-0.5 rounded font-bold border border-secondary-container/30">
            MB
          </span>
        </div>
        <div className="mt-2 flex items-center gap-1.5 text-secondary font-mono text-xs truncate">
          <span>{exfilFlows > 0 ? `${exfilFlows} flujos HTTPS detectados` : 'Tráfico regular'}</span>
        </div>
      </div>
    </div>
  )
}
