import React, { useState } from 'react'
import { FileCode2, Search, Filter } from 'lucide-react'
import { useLogStore } from '@/store/logStore'

export const LogsPage: React.FC = () => {
  const { logs, fileName } = useLogStore()
  const [search, setSearch] = useState('')
  const [severityFilter, setSeverityFilter] = useState('ALL')
  const [page, setPage] = useState(1)
  const pageSize = 25

  const filteredLogs = logs.filter((l) => {
    const matchesSev = severityFilter === 'ALL' || l.severity === severityFilter
    const q = search.toLowerCase()
    const matchesSearch =
      q === '' ||
      l.logId.toLowerCase().includes(q) ||
      l.hostname.toLowerCase().includes(q) ||
      String(l.eventId).includes(q) ||
      l.user.toLowerCase().includes(q) ||
      l.sourceIp.toLowerCase().includes(q) ||
      l.eventDescription.toLowerCase().includes(q) ||
      (l.processCommandLine && l.processCommandLine.toLowerCase().includes(q))
    return matchesSev && matchesSearch
  })

  const totalPages = Math.ceil(filteredLogs.length / pageSize) || 1
  const paginatedLogs = filteredLogs.slice((page - 1) * pageSize, page * pageSize)

  return (
    <div className="space-y-6">
      {/* Cabecera */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-outline-variant/20 pb-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-on-surface flex items-center gap-2.5">
            <FileCode2 className="w-6 h-6 text-primary" />
            Visor Forense de Logs SIEM
          </h2>
          <p className="text-xs text-on-surface-variant font-mono mt-0.5">
            {logs.length} eventos cargados desde {fileName || 'archivo'} • 12 columnas SIEM validadas
          </p>
        </div>

        {/* Filtros de Severidad */}
        <div className="flex items-center gap-2 flex-wrap">
          <Filter className="w-4 h-4 text-on-surface-variant mr-1" />
          {['ALL', 'High', 'Medium', 'Warning', 'Informational'].map((sev) => (
            <button
              key={sev}
              onClick={() => {
                setSeverityFilter(sev)
                setPage(1)
              }}
              className={`px-2.5 py-1 rounded-lg text-xs font-mono font-medium transition-all ${
                severityFilter === sev
                  ? 'bg-primary-container text-on-primary-container shadow'
                  : 'bg-surface-container-high text-on-surface-variant hover:text-on-surface'
              }`}
            >
              {sev === 'ALL' ? 'Todos' : sev}
            </button>
          ))}
        </div>
      </div>

      {/* Buscador */}
      <div className="relative">
        <Search className="w-4 h-4 text-on-surface-variant absolute left-3.5 top-3" />
        <input
          type="text"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value)
            setPage(1)
          }}
          placeholder="Filtrar por ID, host, usuario, IP, Event ID o comando..."
          className="w-full bg-surface-container rounded-xl pl-10 pr-4 py-2.5 text-xs font-mono text-on-surface border border-outline-variant/30 focus:border-primary focus:outline-none"
        />
      </div>

      {/* Tabla SIEM */}
      <div className="overflow-x-auto rounded-2xl border border-outline-variant/30 bg-surface-container shadow-sm">
        <table className="w-full text-left font-mono text-xs border-collapse">
          <thead>
            <tr className="border-b border-outline-variant/20 bg-surface-container-high text-on-surface-variant text-[11px] uppercase tracking-wider">
              <th className="p-3">Log ID</th>
              <th className="p-3">Timestamp (UTC)</th>
              <th className="p-3">Host</th>
              <th className="p-3">Event ID</th>
              <th className="p-3">Usuario</th>
              <th className="p-3">IP Origen</th>
              <th className="p-3">Severidad</th>
              <th className="p-3">Descripción</th>
              <th className="p-3">Proceso / Comando</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-outline-variant/10 text-on-surface">
            {paginatedLogs.map((log) => (
              <tr key={log.logId} className="hover:bg-surface-container-high/60 transition-colors">
                <td className="p-3 text-primary font-bold">{log.logId}</td>
                <td className="p-3 text-on-surface-variant whitespace-nowrap">
                  {log.timestamp instanceof Date && !isNaN(log.timestamp.getTime())
                    ? log.timestamp.toISOString().replace('T', ' ').substring(0, 19)
                    : String(log.timestamp)}
                </td>
                <td className="p-3 text-secondary font-semibold">{log.hostname}</td>
                <td className="p-3">{log.eventId}</td>
                <td className="p-3 font-semibold">{log.user}</td>
                <td className="p-3 text-tertiary">{log.sourceIp}</td>
                <td className="p-3">
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
                </td>
                <td className="p-3 text-on-surface-variant truncate max-w-xs" title={log.eventDescription}>
                  {log.eventDescription}
                </td>
                <td className="p-3 text-on-surface/90 font-mono text-[11px] truncate max-w-xs" title={log.processCommandLine}>
                  {log.processCommandLine || '-'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Paginación */}
      <div className="flex items-center justify-between font-mono text-xs text-on-surface-variant">
        <span>
          Mostrando {(page - 1) * pageSize + 1} a {Math.min(page * pageSize, filteredLogs.length)} de {filteredLogs.length} eventos
        </span>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-3 py-1 rounded bg-surface-container-high hover:bg-surface-bright disabled:opacity-40 transition-colors"
          >
            Anterior
          </button>
          <span>
            Página {page} de {totalPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="px-3 py-1 rounded bg-surface-container-high hover:bg-surface-bright disabled:opacity-40 transition-colors"
          >
            Siguiente
          </button>
        </div>
      </div>
    </div>
  )
}
