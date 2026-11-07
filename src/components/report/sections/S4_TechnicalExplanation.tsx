import React from 'react'
import { useReportStore } from '@/store/reportStore'

export const S4_TechnicalExplanation: React.FC = () => {
  const { technicalExplanation, setTechnicalExplanation } = useReportStore()

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-[11px] font-mono text-on-surface-variant">
        <span>Desglose técnico de TTPs MITRE ATT&CK, comandos y cronología de ataque</span>
        <span>{technicalExplanation.length} caracteres</span>
      </div>
      <textarea
        rows={8}
        value={technicalExplanation}
        onChange={(e) => setTechnicalExplanation(e.target.value)}
        placeholder="Describa los artefactos técnicos, comandos PowerShell, hashes, etc..."
        className="w-full bg-surface-container-lowest text-on-surface font-mono text-xs leading-relaxed rounded-xl p-3.5 border border-outline-variant/30 focus:border-primary focus:outline-none"
      />
    </div>
  )
}
