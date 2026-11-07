import React, { useState } from 'react'
import { AlertOctagon, Lock, CheckCircle2, ChevronDown, ChevronUp, ShieldAlert } from 'lucide-react'
import { useLogStore } from '@/store/logStore'

export const TacticalBanner: React.FC = () => {
  const { incidents, setActiveTab } = useLogStore()
  const [isQuarantined, setIsQuarantined] = useState(false)
  const [isQuarantining, setIsQuarantining] = useState(false)
  const [showDetails, setShowDetails] = useState(false)

  // Buscar el incidente de mayor criticidad (ej. vssadmin, webshell o compromiso exitoso)
  const criticalIncident = incidents.find(
    (i) => i.risk === 'CRITICAL' && (
      i.title.toLowerCase().includes('vssadmin') ||
      i.title.toLowerCase().includes('shadow') ||
      i.title.toLowerCase().includes('webshell') ||
      i.title.toLowerCase().includes('exitoso')
    )
  ) || incidents.find((i) => i.risk === 'CRITICAL')

  if (!criticalIncident) return null

  const targetHost = criticalIncident.affectedHosts[0] || 'APP-SRV01'
  const commandText = criticalIncident.relatedLogs[0]?.processCommandLine || criticalIncident.justification

  const handleQuarantine = () => {
    if (isQuarantined) return
    setIsQuarantining(true)
    setTimeout(() => {
      setIsQuarantining(false)
      setIsQuarantined(true)
    }, 1000)
  }

  return (
    <div className="relative overflow-hidden rounded-2xl bg-error-container text-on-error-container p-5 shadow-xl shadow-error-container/20 border border-error/30 mb-6">
      {/* Icono de fondo decorativo */}
      <div className="absolute -right-6 -bottom-6 opacity-10 pointer-events-none">
        <ShieldAlert className="w-36 h-36 text-error" />
      </div>

      <div className="relative z-10 flex flex-col gap-3">
        {/* Cabecera del Banner */}
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-error opacity-75" />
              <span className="relative inline-flex rounded-full h-3 w-3 bg-error" />
            </span>
            <span className="font-mono text-xs tracking-wider uppercase text-error font-bold">
              ALERTA ROJA T1490 // PROTOCOLO DE CONTENCIÓN
            </span>
          </div>

          <span className="font-mono text-xs bg-surface-container-lowest/80 text-error px-2.5 py-0.5 rounded border border-error/30 font-semibold">
            {criticalIncident.timestamp instanceof Date
              ? criticalIncident.timestamp.toISOString().substring(11, 19)
              : '03:00:14'}{' '}
            UTC
          </span>
        </div>

        {/* Título y Comando */}
        <div className="space-y-1">
          <h3 className="text-base sm:text-lg font-bold text-on-error-container leading-tight">
            {criticalIncident.title}
          </h3>
          <p className="font-mono text-xs text-on-error-container/90 truncate bg-surface-container-lowest/60 p-2 rounded-lg border border-outline-variant/20">
            {commandText}
          </p>
        </div>

        {/* Botones de Acción Inmediata */}
        <div className="pt-1 flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <button
              onClick={handleQuarantine}
              disabled={isQuarantined || isQuarantining}
              className={`inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-lg font-mono text-xs font-bold uppercase tracking-wider transition-all shadow-md ${
                isQuarantined
                  ? 'bg-tertiary-container text-on-tertiary-container'
                  : 'bg-error text-on-error hover:bg-error/90 active:scale-95'
              }`}
            >
              {isQuarantined ? (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>AISLADO ({targetHost} NIC OFF)</span>
                </>
              ) : isQuarantining ? (
                <>
                  <AlertOctagon className="w-4 h-4 animate-spin" />
                  <span>AISLANDO RED...</span>
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4" />
                  <span>Aislar {targetHost}</span>
                </>
              )}
            </button>

            <button
              onClick={() => setActiveTab('incidents')}
              className="text-xs font-mono underline hover:text-white transition-colors cursor-pointer"
            >
              Ver en Incidentes &rarr;
            </button>
          </div>

          <button
            onClick={() => setShowDetails(!showDetails)}
            className="inline-flex items-center gap-1 font-mono text-xs text-error underline hover:text-white transition-colors cursor-pointer"
          >
            <span>{showDetails ? 'Ocultar TTPs' : 'Ver TTPs (MITRE)'}</span>
            {showDetails ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        </div>

        {/* Desplegable de TTPs */}
        {showDetails && (
          <div className="mt-2 p-3.5 rounded-xl bg-surface-container-high border border-outline-variant/30 space-y-2 text-on-surface">
            <div className="flex justify-between items-center text-xs font-mono text-on-surface-variant">
              <span>Vector: {criticalIncident.category}</span>
              <span className="text-tertiary">Host Impactado: {targetHost}</span>
            </div>
            <p className="text-xs text-on-surface-variant leading-relaxed font-sans">
              {criticalIncident.technicalDetail}
            </p>
            <div className="p-2 bg-surface-container-lowest rounded font-mono text-[11px] text-error break-all border border-error/20">
              Impacto Forense: {criticalIncident.impact}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
