import React from 'react'
import { useReportStore } from '@/store/reportStore'

export const S8_ActionPlan: React.FC = () => {
  const { actionInvestigate, actionContain, actionRemediate, setActionPlan } = useReportStore()

  return (
    <div className="space-y-4">
      {/* 1. Investigación */}
      <div>
        <label className="block text-[11px] font-mono text-secondary uppercase font-bold mb-1">
          8.1 Fase de Investigación & Adquisición Forense
        </label>
        <textarea
          rows={3}
          value={actionInvestigate}
          onChange={(e) => setActionPlan({ actionInvestigate: e.target.value })}
          placeholder="Acciones de preservación de evidencia, volcados de memoria RAM, inspección de tráfico..."
          className="w-full bg-surface-container-lowest text-on-surface text-xs leading-relaxed rounded-xl p-3 border border-outline-variant/30 focus:border-primary focus:outline-none font-sans"
        />
      </div>

      {/* 2. Contención */}
      <div>
        <label className="block text-[11px] font-mono text-error uppercase font-bold mb-1">
          8.2 Fase de Contención Inmediata
        </label>
        <textarea
          rows={3}
          value={actionContain}
          onChange={(e) => setActionPlan({ actionContain: e.target.value })}
          placeholder="Aislamiento de red (NIC OFF), reseteo masivo de contraseñas, bloqueo perimetral de IPs..."
          className="w-full bg-surface-container-lowest text-on-surface text-xs leading-relaxed rounded-xl p-3 border border-outline-variant/30 focus:border-primary focus:outline-none font-sans"
        />
      </div>

      {/* 3. Remediación */}
      <div>
        <label className="block text-[11px] font-mono text-tertiary uppercase font-bold mb-1">
          8.3 Fase de Erradicación & Remediación
        </label>
        <textarea
          rows={3}
          value={actionRemediate}
          onChange={(e) => setActionPlan({ actionRemediate: e.target.value })}
          placeholder="Reinstalación de sistemas desde imágenes limpias, restauración de copias inmutables..."
          className="w-full bg-surface-container-lowest text-on-surface text-xs leading-relaxed rounded-xl p-3 border border-outline-variant/30 focus:border-primary focus:outline-none font-sans"
        />
      </div>
    </div>
  )
}
