import React from 'react'
import { useReportStore } from '@/store/reportStore'

export const S2_ExecutiveSummary: React.FC = () => {
  const { executiveSummary, setExecutiveSummary } = useReportStore()

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-[11px] font-mono text-on-surface-variant">
        <span>Síntesis de alto nivel para Dirección y Gerencia de Ciberseguridad</span>
        <span>{executiveSummary.length} caracteres</span>
      </div>
      <textarea
        rows={6}
        value={executiveSummary}
        onChange={(e) => setExecutiveSummary(e.target.value)}
        placeholder="Redacte o ajuste el resumen ejecutivo..."
        className="w-full bg-surface-container-lowest text-on-surface text-xs leading-relaxed rounded-xl p-3.5 border border-outline-variant/30 focus:border-primary focus:outline-none font-sans"
      />
    </div>
  )
}
