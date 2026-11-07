import React, { useState } from 'react'
import { Plus, Trash2, CheckCircle2 } from 'lucide-react'
import { useReportStore } from '@/store/reportStore'

export const S9_Recommendations: React.FC = () => {
  const { recommendations, addRecommendation, removeRecommendation } = useReportStore()
  const [newRec, setNewRec] = useState('')

  const handleAdd = () => {
    if (newRec.trim()) {
      addRecommendation(newRec.trim())
      setNewRec('')
    }
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between text-xs font-mono text-on-surface-variant">
        <span>Recomendaciones técnicas y de hardening preventivo:</span>
        <strong className="text-tertiary">{recommendations.length} medidas activas</strong>
      </div>

      <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
        {recommendations.map((rec, idx) => (
          <div
            key={idx}
            className="p-3 rounded-xl bg-surface-container-low border border-outline-variant/20 flex items-start justify-between gap-3 text-xs"
          >
            <div className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-tertiary shrink-0 mt-0.5" />
              <span className="text-on-surface leading-relaxed">{rec}</span>
            </div>

            <button
              onClick={() => removeRecommendation(idx)}
              className="p-1 rounded-lg text-on-surface-variant hover:text-error hover:bg-error-container/20 transition-colors shrink-0"
              title="Eliminar recomendación"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>

      {/* Input para agregar nueva recomendación */}
      <div className="flex items-center gap-2 pt-2">
        <input
          type="text"
          value={newRec}
          onChange={(e) => setNewRec(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
          placeholder="Escriba una nueva recomendación de hardening..."
          className="flex-1 bg-surface-container-lowest text-on-surface font-mono text-xs rounded-xl px-3 py-2 border border-outline-variant/30 focus:border-primary focus:outline-none"
        />
        <button
          onClick={handleAdd}
          className="inline-flex items-center gap-1 px-3 py-2 rounded-xl bg-primary-container text-on-primary-container font-mono text-xs font-bold hover:bg-primary-container/90 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Agregar</span>
        </button>
      </div>
    </div>
  )
}
