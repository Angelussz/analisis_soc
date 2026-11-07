import React from 'react'
import { useReportStore } from '@/store/reportStore'

export const S6_Critique: React.FC = () => {
  const { critique, setCritique } = useReportStore()

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-[11px] font-mono text-on-surface-variant">
        <span>Evaluación y justificación analítica del nivel de riesgo y severidad asignado</span>
        <span>{critique.length} caracteres</span>
      </div>
      <textarea
        rows={5}
        value={critique}
        onChange={(e) => setCritique(e.target.value)}
        placeholder="Escriba la justificación crítica del riesgo asignado..."
        className="w-full bg-surface-container-lowest text-on-surface text-xs leading-relaxed rounded-xl p-3.5 border border-outline-variant/30 focus:border-primary focus:outline-none font-sans"
      />
    </div>
  )
}
