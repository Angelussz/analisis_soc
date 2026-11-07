import React, { useEffect, useState } from 'react'
import { ReportEditor } from '@/components/report/ReportEditor'
import { ReportPreview } from '@/components/report/ReportPreview'
import { FileUploader } from '@/components/upload/FileUploader'
import { useReportStore } from '@/store/reportStore'
import { useLogStore } from '@/store/logStore'
import { generateAutoReport } from '@/lib/reportAutoGenerator'
import { FileText, Edit3, Eye, Columns } from 'lucide-react'

export const ReportPage: React.FC = () => {
  const { logs, incidents } = useLogStore()
  const report = useReportStore()
  const [viewMode, setViewMode] = useState<'split' | 'editor' | 'preview'>('split')

  // Auto-llenar las secciones si aún no tienen datos y hay logs disponibles
  useEffect(() => {
    if (logs.length > 0 && report.findings.length === 0 && incidents.length > 0) {
      const generated = generateAutoReport(incidents, logs, {
        caseNumber: report.caseNumber,
        analyst: report.analyst,
        organization: report.organization,
        classification: report.classification,
      })

      report.setExecutiveSummary(generated.executiveSummary)
      report.setFindings(generated.findings)
      report.setTechnicalExplanation(generated.technicalExplanation)
      report.setEvidenceLogs(generated.evidenceLogs)
      report.setCritique(generated.critique)
      report.setOrganizationalImpact(generated.organizationalImpact)
      report.setActionPlan({
        actionInvestigate: generated.actionInvestigate,
        actionContain: generated.actionContain,
        actionRemediate: generated.actionRemediate,
      })
      report.setRecommendations(generated.recommendations)
    }
  }, [logs.length, incidents.length])

  if (logs.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] max-w-2xl mx-auto text-center gap-6">
        <div className="space-y-2">
          <FileText className="w-12 h-12 text-tertiary mx-auto" />
          <h2 className="text-2xl font-bold tracking-tight text-on-surface">
            Generador de Informes Forenses L2
          </h2>
          <p className="text-sm text-on-surface-variant">
            Cargue un archivo Excel (.xlsx) para auto-sintetizar las 9 secciones del informe con previsualización A4 en tiempo real.
          </p>
        </div>
        <FileUploader />
      </div>
    )
  }

  return (
    <div className="space-y-5">
      {/* Selector de Modo de Vista Segmentado */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-outline-variant/20 pb-3">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-on-surface flex items-center gap-2">
            <FileText className="w-5 h-5 text-tertiary" />
            Editor Forense & Previsualización A4
          </h2>
          <p className="text-xs text-on-surface-variant font-mono mt-0.5">
            9 secciones estructuradas con actualización bidireccional en tiempo real
          </p>
        </div>

        <div className="inline-flex items-center p-1 bg-surface-container rounded-xl border border-outline-variant/30 text-xs font-mono">
          <button
            onClick={() => setViewMode('split')}
            className={`hidden xl:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
              viewMode === 'split'
                ? 'bg-primary-container text-on-primary-container font-bold shadow'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            <Columns className="w-3.5 h-3.5" />
            <span>Dividida (Editor + A4)</span>
          </button>

          <button
            onClick={() => setViewMode('editor')}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
              viewMode === 'editor'
                ? 'bg-primary-container text-on-primary-container font-bold shadow'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>9 Secciones</span>
          </button>

          <button
            onClick={() => setViewMode('preview')}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
              viewMode === 'preview'
                ? 'bg-primary-container text-on-primary-container font-bold shadow'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Hoja A4 Live</span>
          </button>
        </div>
      </div>

      {/* Contenedor Principal: Dividido o Pestaña Única */}
      {viewMode === 'split' ? (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 items-start">
          <div className="space-y-4">
            <ReportEditor />
          </div>
          <div className="sticky top-20">
            <ReportPreview />
          </div>
        </div>
      ) : viewMode === 'editor' ? (
        <div className="max-w-4xl mx-auto">
          <ReportEditor />
        </div>
      ) : (
        <div className="max-w-4xl mx-auto">
          <ReportPreview />
        </div>
      )}
    </div>
  )
}
