import React from 'react'
import { CheckSquare, Square } from 'lucide-react'
import { useReportStore } from '@/store/reportStore'
import { evaluateIncidentRisk } from '@/lib/riskClassifier'

export const S3_Findings: React.FC = () => {
  const { findings, updateFindingStatus } = useReportStore()

  const confirmedCount = findings.filter((f) => f.confirmed).length

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between text-xs font-mono text-on-surface-variant">
        <span>Confirme o descarte hallazgos para incluirlos en el informe oficial:</span>
        <strong className="text-tertiary">
          {confirmedCount} de {findings.length} confirmados
        </strong>
      </div>

      <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
        {findings.map((item, index) => {
          const evalRisk = evaluateIncidentRisk(item.incident)
          return (
            <div
              key={item.incident.id}
              onClick={() => updateFindingStatus(index, !item.confirmed)}
              className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                item.confirmed
                  ? 'bg-surface-container-low border-primary/40 shadow-sm'
                  : 'bg-surface-container-lowest/50 border-outline-variant/20 opacity-50'
              }`}
            >
              <div className="flex items-center gap-3 min-w-0">
                <button
                  type="button"
                  className={`p-1 rounded-lg transition-colors ${
                    item.confirmed ? 'text-primary' : 'text-outline'
                  }`}
                >
                  {item.confirmed ? (
                    <CheckSquare className="w-5 h-5 text-primary" />
                  ) : (
                    <Square className="w-5 h-5" />
                  )}
                </button>

                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-0.2 rounded text-[10px] font-mono font-bold border ${evalRisk.badgeClass}`}>
                      {item.incident.risk}
                    </span>
                    <span className="text-[11px] font-mono text-tertiary font-medium">
                      {item.incident.category}
                    </span>
                  </div>
                  <h4 className="text-xs font-semibold text-on-surface truncate mt-0.5">
                    {item.incident.title}
                  </h4>
                </div>
              </div>

              <span className="text-[11px] font-mono text-on-surface-variant shrink-0">
                {item.incident.relatedLogs.length} logs
              </span>
            </div>
          )
        })}

        {findings.length === 0 && (
          <p className="text-xs font-mono text-on-surface-variant text-center py-4">
            No hay hallazgos disponibles. Cargue un archivo para auto-generar los hallazgos.
          </p>
        )}
      </div>
    </div>
  )
}
