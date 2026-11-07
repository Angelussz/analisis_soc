import React from 'react'
import { useReportStore } from '@/store/reportStore'

export const S7_Impact: React.FC = () => {
  const { organizationalImpact, setOrganizationalImpact } = useReportStore()

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-[11px] font-mono text-on-surface-variant">
        <span>Evaluación de afectación a la Triada CIA (Confidencialidad, Integridad, Disponibilidad)</span>
        <span>{organizationalImpact.length} caracteres</span>
      </div>
      <textarea
        rows={5}
        value={organizationalImpact}
        onChange={(e) => setOrganizationalImpact(e.target.value)}
        placeholder="Describa el impacto operacional, fuga de datos y afectación a la continuidad de negocio..."
        className="w-full bg-surface-container-lowest text-on-surface text-xs leading-relaxed rounded-xl p-3.5 border border-outline-variant/30 focus:border-primary focus:outline-none font-sans"
      />
    </div>
  )
}
