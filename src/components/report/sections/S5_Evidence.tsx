import React from 'react'
import { useReportStore } from '@/store/reportStore'

export const S5_Evidence: React.FC = () => {
  const { evidenceLogs } = useReportStore()

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between text-xs font-mono text-on-surface-variant">
        <span>Muestra de eventos SIEM clave que respaldan las evidencias periciales:</span>
        <strong className="text-secondary">{evidenceLogs.length} logs vinculados</strong>
      </div>

      <div className="overflow-x-auto rounded-xl border border-outline-variant/20 bg-surface-container-lowest max-h-60 overflow-y-auto">
        <table className="w-full text-left font-mono text-[11px] border-collapse">
          <thead>
            <tr className="border-b border-outline-variant/20 bg-surface-container-low text-on-surface-variant sticky top-0">
              <th className="p-2">Log ID</th>
              <th className="p-2">Timestamp (UTC)</th>
              <th className="p-2">Host</th>
              <th className="p-2">Event ID</th>
              <th className="p-2">Usuario</th>
              <th className="p-2">Comando / Descripción</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-outline-variant/10 text-on-surface">
            {evidenceLogs.map((log) => (
              <tr key={log.logId} className="hover:bg-surface-container/60 transition-colors">
                <td className="p-2 text-primary font-bold">{log.logId}</td>
                <td className="p-2 text-on-surface-variant whitespace-nowrap">
                  {log.timestamp instanceof Date && !isNaN(log.timestamp.getTime())
                    ? log.timestamp.toISOString().replace('T', ' ').substring(0, 19)
                    : String(log.timestamp)}
                </td>
                <td className="p-2 text-secondary">{log.hostname}</td>
                <td className="p-2">{log.eventId}</td>
                <td className="p-2">{log.user}</td>
                <td className="p-2 text-on-surface/90 truncate max-w-xs" title={log.processCommandLine || log.eventDescription}>
                  {log.processCommandLine || log.eventDescription}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
