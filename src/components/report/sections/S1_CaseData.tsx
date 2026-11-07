import React from 'react'
import { useReportStore } from '@/store/reportStore'

export const S1_CaseData: React.FC = () => {
  const { caseNumber, analyst, organization, classification, incidentDate, setCaseData } = useReportStore()

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-[11px] font-mono text-on-surface-variant uppercase mb-1">
            Número de Caso / Incidente
          </label>
          <input
            type="text"
            value={caseNumber}
            onChange={(e) => setCaseData({ caseNumber: e.target.value })}
            className="w-full bg-surface-container-lowest text-on-surface font-mono text-xs rounded-xl px-3 py-2 border border-outline-variant/30 focus:border-primary focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-[11px] font-mono text-on-surface-variant uppercase mb-1">
            Clasificación de Seguridad (TLP)
          </label>
          <select
            value={classification}
            onChange={(e) => setCaseData({ classification: e.target.value as any })}
            className="w-full bg-surface-container-lowest text-error font-mono text-xs font-bold rounded-xl px-3 py-2 border border-outline-variant/30 focus:border-primary focus:outline-none"
          >
            <option value="CONFIDENCIAL">CONFIDENCIAL // TLP:AMBER</option>
            <option value="INTERNO">USO INTERNO // TLP:GREEN</option>
            <option value="PÚBLICO">PÚBLICO // TLP:CLEAR</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div>
          <label className="block text-[11px] font-mono text-on-surface-variant uppercase mb-1">
            Analista SOC Nivel 2
          </label>
          <input
            type="text"
            value={analyst}
            onChange={(e) => setCaseData({ analyst: e.target.value })}
            className="w-full bg-surface-container-lowest text-on-surface font-mono text-xs rounded-xl px-3 py-2 border border-outline-variant/30 focus:border-primary focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-[11px] font-mono text-on-surface-variant uppercase mb-1">
            Organización / Entidad
          </label>
          <input
            type="text"
            value={organization}
            onChange={(e) => setCaseData({ organization: e.target.value })}
            className="w-full bg-surface-container-lowest text-on-surface font-mono text-xs rounded-xl px-3 py-2 border border-outline-variant/30 focus:border-primary focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-[11px] font-mono text-on-surface-variant uppercase mb-1">
            Fecha de Incidente
          </label>
          <input
            type="date"
            value={incidentDate}
            onChange={(e) => setCaseData({ incidentDate: e.target.value })}
            className="w-full bg-surface-container-lowest text-on-surface font-mono text-xs rounded-xl px-3 py-2 border border-outline-variant/30 focus:border-primary focus:outline-none"
          />
        </div>
      </div>
    </div>
  )
}
