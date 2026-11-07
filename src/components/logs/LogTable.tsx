import React, { useRef, useState, useMemo } from 'react'
import { useVirtualizer } from '@tanstack/react-virtual'
import { Terminal, Filter, Layers } from 'lucide-react'
import type { LogEntry } from '@/types/log.types'
import { useLogStore } from '@/store/logStore'
import { LogDetailModal } from './LogDetailModal'

export const LogTable: React.FC = () => {
  const { logs } = useLogStore()
  const parentRef = useRef<HTMLDivElement>(null)

  const [search, setSearch] = useState('')
  const [severityFilter, setSeverityFilter] = useState('ALL')
  const [eventFilter, setEventFilter] = useState('ALL')
  const [selectedLog, setSelectedLog] = useState<LogEntry | null>(null)

  // Eventos clave para filtros rápidos
  const quickEventFilters = [
    { key: 'ALL', label: 'Todos' },
    { key: '4625', label: '4625 (Login Fallido)' },
    { key: '4624', label: '4624 (Login Exitoso)' },
    { key: '7045', label: '7045 (Svc Creado)' },
    { key: '4688', label: '4688 (Proceso)' },
    { key: 'PROXY_ACCESS', label: 'PROXY (HTTPS)' },
    { key: 'HTTP_ACCESS', label: 'HTTP (Web/IIS)' },
  ]

  // Filtrado de logs
  const filteredLogs = useMemo(() => {
    return logs.filter((log) => {
      // Filtro de severidad
      if (severityFilter !== 'ALL' && log.severity !== severityFilter) {
        return false
      }

      // Filtro de ID de evento
      if (eventFilter !== 'ALL' && String(log.eventId) !== eventFilter) {
        return false
      }

      // Filtro de búsqueda textual (KQL simplificado / regex / substring)
      if (search.trim() !== '') {
        const q = search.toLowerCase()
        const matchesLogId = log.logId.toLowerCase().includes(q)
        const matchesHost = log.hostname.toLowerCase().includes(q)
        const matchesEventId = String(log.eventId).toLowerCase().includes(q)
        const matchesUser = log.user.toLowerCase().includes(q)
        const matchesIp = log.sourceIp.toLowerCase().includes(q)
        const matchesDesc = log.eventDescription.toLowerCase().includes(q)
        const matchesCmd = (log.processCommandLine || '').toLowerCase().includes(q)

        if (!matchesLogId && !matchesHost && !matchesEventId && !matchesUser && !matchesIp && !matchesDesc && !matchesCmd) {
          return false
        }
      }

      return true
    })
  }, [logs, severityFilter, eventFilter, search])

  // Configuración de TanStack Virtual Scrolling
  const rowVirtualizer = useVirtualizer({
    count: filteredLogs.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 48,
    overscan: 12,
  })

  return (
    <div className="space-y-4 flex flex-col h-full">
      {/* 1. Terminal Monospace KQL Search Command Line */}
      <div className="bg-surface-container-lowest rounded-2xl p-4 border border-outline-variant/30 shadow-md space-y-2">
        <div className="flex items-center justify-between text-on-surface-variant font-mono text-[11px] pb-1 border-b border-outline-variant/10">
          <div className="flex items-center gap-1.5">
            <span className="text-secondary font-bold">sentinel@soc-l2</span>
            <span className="text-outline">:</span>
            <span className="text-primary">~/kql-parser</span>
            <span className="text-outline">$</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-tertiary">TanStack Virtual 60FPS</span>
            <span className="text-outline">•</span>
            <span>{filteredLogs.length} coincidencias</span>
          </div>
        </div>

        <div className="relative flex items-center">
          <Terminal className="w-4 h-4 text-secondary absolute left-3 pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="KQL search: IP, hostname, usuario, EventID, comando (ej. 4625, whoami, 203.0.113.*)..."
            className="w-full bg-surface-container-low text-on-surface font-mono text-xs rounded-xl pl-9 pr-20 py-2.5 placeholder:text-outline focus:outline-none focus:ring-1 focus:ring-primary border border-outline-variant/20 transition-all"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute right-3 px-2 py-0.5 bg-surface-container-high rounded text-[10px] font-mono text-on-surface-variant hover:text-on-surface"
            >
              ESC / LIMPIAR
            </button>
          )}
        </div>
      </div>

      {/* 2. Chips de Filtros Rápidos (Event ID y Severidad) */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 flex-wrap">
        {/* Event Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar text-xs font-mono">
          <span className="text-outline uppercase text-[10px] font-bold mr-1">Eventos:</span>
          {quickEventFilters.map((ef) => {
            const isActive = eventFilter === ef.key
            return (
              <button
                key={ef.key}
                onClick={() => setEventFilter(ef.key)}
                className={`px-2.5 py-1 rounded-lg transition-all whitespace-nowrap ${
                  isActive
                    ? 'bg-primary-container text-on-primary-container font-bold shadow'
                    : 'bg-surface-container text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high'
                }`}
              >
                {ef.label}
              </button>
            )
          })}
        </div>

        {/* Severidad */}
        <div className="flex items-center gap-1.5 text-xs font-mono self-end sm:self-auto">
          <Filter className="w-3.5 h-3.5 text-on-surface-variant" />
          {['ALL', 'High', 'Medium', 'Warning', 'Informational'].map((sev) => {
            const isActive = severityFilter === sev
            return (
              <button
                key={sev}
                onClick={() => setSeverityFilter(sev)}
                className={`px-2 py-0.5 rounded text-[11px] font-bold transition-all ${
                  isActive
                    ? 'bg-surface-bright text-primary border border-primary/50'
                    : 'bg-surface-container text-on-surface-variant hover:text-on-surface'
                }`}
              >
                {sev === 'ALL' ? 'Todos' : sev}
              </button>
            )
          })}
        </div>
      </div>

      {/* 3. Contenedor de Tabla con Virtual Scrolling */}
      <div className="flex-1 bg-surface-container rounded-2xl border border-outline-variant/30 shadow-sm overflow-hidden flex flex-col">
        {/* Cabecera Fija de Columnas */}
        <div className="bg-surface-container-high border-b border-outline-variant/20 font-mono text-[11px] uppercase tracking-wider text-on-surface-variant font-bold grid grid-cols-12 px-4 py-3 select-none">
          <div className="col-span-2 sm:col-span-1">Log ID</div>
          <div className="col-span-3 sm:col-span-2">Timestamp (UTC)</div>
          <div className="col-span-2 sm:col-span-2">Host / Canal</div>
          <div className="col-span-2 sm:col-span-1">Event ID</div>
          <div className="hidden sm:block sm:col-span-2">Usuario</div>
          <div className="hidden sm:block sm:col-span-2">IP Origen &rarr; Dst</div>
          <div className="col-span-3 sm:col-span-2 text-right sm:text-left">Severidad & Proceso</div>
        </div>

        {/* Cuerpo Virtualizado (Scroll Container) */}
        <div
          ref={parentRef}
          className="flex-1 overflow-y-auto min-h-[480px] max-h-[640px] relative divide-y divide-outline-variant/10"
        >
          {filteredLogs.length > 0 ? (
            <div
              style={{
                height: `${rowVirtualizer.getTotalSize()}px`,
                width: '100%',
                position: 'relative',
              }}
            >
              {rowVirtualizer.getVirtualItems().map((virtualRow) => {
                const log = filteredLogs[virtualRow.index]
                if (!log) return null

                return (
                  <div
                    key={log.logId}
                    onClick={() => setSelectedLog(log)}
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: `${virtualRow.size}px`,
                      transform: `translateY(${virtualRow.start}px)`,
                    }}
                    className="grid grid-cols-12 px-4 py-2.5 items-center font-mono text-xs hover:bg-surface-container-high/70 cursor-pointer transition-colors border-b border-outline-variant/10 text-on-surface"
                  >
                    <div className="col-span-2 sm:col-span-1 text-primary font-bold truncate">
                      {log.logId}
                    </div>

                    <div className="col-span-3 sm:col-span-2 text-on-surface-variant text-[11px] truncate">
                      {log.timestamp instanceof Date && !isNaN(log.timestamp.getTime())
                        ? log.timestamp.toISOString().replace('T', ' ').substring(0, 19)
                        : String(log.timestamp)}
                    </div>

                    <div className="col-span-2 sm:col-span-2 truncate">
                      <span className="text-secondary font-semibold">{log.hostname}</span>
                      <span className="text-outline text-[10px] block truncate">{log.logSource}</span>
                    </div>

                    <div className="col-span-2 sm:col-span-1 text-on-surface font-bold">
                      {log.eventId}
                    </div>

                    <div className="hidden sm:block sm:col-span-2 truncate text-on-surface">
                      {log.user}
                    </div>

                    <div className="hidden sm:block sm:col-span-2 truncate text-[11px] text-tertiary">
                      {log.sourceIp} {log.destination ? `→ ${log.destination}` : ''}
                    </div>

                    <div className="col-span-3 sm:col-span-2 flex items-center justify-end sm:justify-start gap-2 truncate">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
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
                      <span className="hidden sm:inline text-on-surface-variant text-[11px] truncate max-w-[120px]" title={log.processCommandLine || log.eventDescription}>
                        {log.processCommandLine || log.eventDescription}
                      </span>
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
            <div className="p-12 text-center text-on-surface-variant font-mono text-xs">
              <Layers className="w-8 h-8 text-secondary mx-auto mb-2 opacity-50" />
              No se encontraron eventos coincidentes con la consulta KQL o filtros activos.
            </div>
          )}
        </div>

        {/* Footer de la Tabla Virtual */}
        <div className="p-3 bg-surface-container-high border-t border-outline-variant/20 flex items-center justify-between font-mono text-xs text-on-surface-variant px-4">
          <div className="flex items-center gap-2">
            <span>Renderizado virtualizado con TanStack:</span>
            <strong className="text-tertiary">
              {filteredLogs.length} de {logs.length} eventos
            </strong>
          </div>
          <span className="text-[11px] text-outline">
            Haz clic en cualquier fila para inspección forense completa
          </span>
        </div>
      </div>

      {/* Modal de Detalle Forense del Log */}
      <LogDetailModal
        log={selectedLog}
        onClose={() => setSelectedLog(null)}
      />
    </div>
  )
}
