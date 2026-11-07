import React, { useState } from 'react'
import { X, Terminal, Copy, Check, Server, User, Globe, Calendar } from 'lucide-react'
import type { LogEntry } from '@/types/log.types'

interface LogDetailModalProps {
  log: LogEntry | null
  onClose: () => void
}

export const LogDetailModal: React.FC<LogDetailModalProps> = ({ log, onClose }) => {
  const [copied, setCopied] = useState(false)

  if (!log) return null

  const handleCopyJson = () => {
    navigator.clipboard.writeText(JSON.stringify(log, null, 2))
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-surface-container-lowest/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl max-h-[90vh] bg-surface-container border border-outline-variant/40 rounded-2xl shadow-2xl flex flex-col overflow-hidden text-on-surface">
        {/* Modal Header */}
        <div className="p-5 border-b border-outline-variant/20 flex items-center justify-between gap-4 bg-surface-container-high">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-primary-container/20 text-primary border border-primary/30">
              <Terminal className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-base font-bold text-primary">
                  {log.logId}
                </span>
                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                    log.severity === 'High'
                      ? 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                      : log.severity === 'Medium'
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                      : log.severity === 'Warning'
                      ? 'bg-orange-500/20 text-orange-300 border border-orange-500/30'
                      : 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                  }`}
                >
                  {log.severity}
                </span>
              </div>
              <p className="text-xs font-mono text-on-surface-variant">
                Event ID: <strong className="text-on-surface">{log.eventId}</strong> • Canal: {log.logSource}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyJson}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-surface-container hover:bg-surface-bright text-xs font-mono text-on-surface transition-colors border border-outline-variant/20"
              title="Copiar objeto JSON"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-tertiary" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copiado' : 'Copiar JSON'}</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-5">
          {/* Grid de 4 Atributos Principales */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono">
            <div className="p-3 rounded-xl bg-surface-container-low border border-outline-variant/20 flex items-center gap-3">
              <Calendar className="w-4 h-4 text-secondary shrink-0" />
              <div>
                <span className="text-on-surface-variant text-[11px]">Timestamp (UTC)</span>
                <p className="font-bold text-on-surface">
                  {log.timestamp instanceof Date && !isNaN(log.timestamp.getTime())
                    ? log.timestamp.toISOString().replace('T', ' ').substring(0, 19)
                    : String(log.timestamp)}
                </p>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-surface-container-low border border-outline-variant/20 flex items-center gap-3">
              <Server className="w-4 h-4 text-tertiary shrink-0" />
              <div>
                <span className="text-on-surface-variant text-[11px]">Host Objetivo</span>
                <p className="font-bold text-on-surface">{log.hostname}</p>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-surface-container-low border border-outline-variant/20 flex items-center gap-3">
              <User className="w-4 h-4 text-primary shrink-0" />
              <div>
                <span className="text-on-surface-variant text-[11px]">Usuario / Cuenta</span>
                <p className="font-bold text-on-surface">{log.user}</p>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-surface-container-low border border-outline-variant/20 flex items-center gap-3">
              <Globe className="w-4 h-4 text-amber-400 shrink-0" />
              <div>
                <span className="text-on-surface-variant text-[11px]">IP Origen & Destino</span>
                <p className="font-bold text-on-surface">
                  {log.sourceIp} &rarr; {log.destination || 'N/A'}
                </p>
              </div>
            </div>
          </div>

          {/* Descripción del Evento */}
          <div className="space-y-1.5">
            <h4 className="text-xs font-mono uppercase tracking-wider text-secondary font-bold">
              Descripción del Evento SIEM
            </h4>
            <div className="p-3.5 rounded-xl bg-surface-container-low border border-outline-variant/20 text-xs text-on-surface leading-relaxed font-sans">
              {log.eventDescription}
            </div>
          </div>

          {/* Línea de Comandos / Proceso (si existe) */}
          {log.processCommandLine && (
            <div className="space-y-1.5">
              <h4 className="text-xs font-mono uppercase tracking-wider text-tertiary font-bold flex items-center gap-1.5">
                <Terminal className="w-4 h-4" />
                Línea de Comandos Ejecutada (Process_CommandLine)
              </h4>
              <div className="p-3.5 rounded-xl bg-surface-container-lowest border border-outline-variant/30 text-xs font-mono text-tertiary break-all select-all">
                {log.processCommandLine}
              </div>
            </div>
          )}

          {/* Resultado / Estado */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-surface-container-low border border-outline-variant/20 text-xs font-mono">
            <span className="text-on-surface-variant">Resultado de Ejecución / Status:</span>
            <span
              className={`font-bold px-2 py-0.5 rounded ${
                log.result?.toLowerCase() === 'success' || log.result === '200'
                  ? 'bg-tertiary-container/30 text-tertiary'
                  : 'bg-error-container/30 text-error'
              }`}
            >
              {log.result}
            </span>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-outline-variant/20 bg-surface-container-high flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-surface-container hover:bg-surface-bright text-xs font-mono font-medium text-on-surface transition-colors"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  )
}
