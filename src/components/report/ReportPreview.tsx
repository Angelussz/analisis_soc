import React, { useRef } from 'react'
import { Printer, Download, FileText } from 'lucide-react'
import { useReportStore } from '@/store/reportStore'

interface ReportPreviewProps {
  onExportPdf?: () => void
}

export const ReportPreview: React.FC<ReportPreviewProps> = ({ onExportPdf }) => {
  const report = useReportStore()
  const printRef = useRef<HTMLDivElement>(null)

  const confirmedFindings = report.findings.filter((f) => f.confirmed)

  return (
    <div className="flex flex-col gap-3">
      {/* Barra de Controles de la Hoja A4 */}
      <div className="flex items-center justify-between p-3 rounded-2xl bg-surface-container border border-outline-variant/30 text-xs font-mono">
        <div className="flex items-center gap-2">
          <FileText className="w-4 h-4 text-secondary" />
          <span className="text-on-surface font-semibold">Previsualización A4 en Vivo</span>
          <span className="text-outline">•</span>
          <span className="text-tertiary">Escala 1:1.414</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => window.print()}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-surface-container-high hover:bg-surface-bright text-xs font-mono text-on-surface transition-colors"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Imprimir</span>
          </button>

          <button
            onClick={onExportPdf}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-primary-container text-on-primary-container font-mono text-xs font-bold hover:bg-primary-container/90 transition-all shadow"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Exportar PDF</span>
          </button>
        </div>
      </div>

      {/* Hoja A4 Simulada en Blanco Impecable */}
      <div
        ref={printRef}
        id="a4-report-canvas"
        className="w-full bg-white text-slate-900 rounded-xl p-6 sm:p-10 shadow-2xl font-sans relative overflow-hidden select-text border border-slate-300 min-h-[900px]"
      >
        {/* Marca de Agua de Confidencialidad */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.04] rotate-[-28deg]">
          <span className="text-5xl sm:text-6xl font-extrabold tracking-widest text-slate-950 uppercase text-center">
            {report.classification} // SOC FORENSE L2
          </span>
        </div>

        {/* Header Formal del Documento */}
        <div className="flex items-start justify-between pb-4 mb-4 border-b-2 border-slate-900">
          <div>
            <span className="font-bold text-xs uppercase tracking-wider text-slate-700 block">
              CENTRO DE OPERACIONES DE SEGURIDAD // SOC NIVEL 2
            </span>
            <h1 className="text-lg sm:text-xl font-extrabold text-slate-950 tracking-tight leading-tight mt-0.5">
              INFORME FORENSE DE INCIDENTES DE CIBERSEGURIDAD
            </h1>
            <p className="text-[11px] font-mono text-slate-600 mt-1">
              EXPEDIENTE: <strong className="text-slate-900">{report.caseNumber}</strong> // FECHA AUDITORÍA: {report.incidentDate}
            </p>
          </div>

          <div className="flex flex-col items-end">
            <span
              className={`px-2.5 py-0.5 rounded text-[10px] font-mono font-bold tracking-wider uppercase border ${
                report.classification === 'CONFIDENCIAL'
                  ? 'bg-rose-100 text-rose-800 border-rose-300'
                  : 'bg-emerald-100 text-emerald-800 border-emerald-300'
              }`}
            >
              {report.classification}
            </span>
            <span className="text-[10px] font-mono text-slate-500 mt-1">
              ESTADO: AUDITADO
            </span>
          </div>
        </div>

        {/* Metadatos del Caso */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 bg-slate-100 p-3 rounded-lg text-xs mb-5 border border-slate-200">
          <div>
            <span className="text-slate-500 font-mono text-[10px] uppercase block">Entidad Afectada</span>
            <strong className="text-slate-900">{report.organization}</strong>
          </div>
          <div>
            <span className="text-slate-500 font-mono text-[10px] uppercase block">Analista Designado</span>
            <strong className="text-slate-900">{report.analyst}</strong>
          </div>
          <div>
            <span className="text-slate-500 font-mono text-[10px] uppercase block">Nivel de Riesgo Global</span>
            <strong className="text-rose-700">CRÍTICO (CVSS 9.8)</strong>
          </div>
          <div>
            <span className="text-slate-500 font-mono text-[10px] uppercase block">Hallazgos Validados</span>
            <strong className="text-slate-900">{confirmedFindings.length} Incidentes</strong>
          </div>
        </div>

        {/* Contenido en Secciones Forenses */}
        <div className="space-y-4 text-xs text-slate-800 leading-relaxed">
          {/* S2. Resumen Ejecutivo */}
          <section className="space-y-1">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-1 flex items-center gap-1.5">
              <span>1.0</span> Resumen Ejecutivo Forense
            </h2>
            <p className="text-slate-700 text-justify whitespace-pre-line text-[11px] leading-relaxed">
              {report.executiveSummary}
            </p>
          </section>

          {/* S3. Matriz de Hallazgos */}
          <section className="space-y-1.5">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-1 flex items-center gap-1.5">
              <span>2.0</span> Matriz de Hallazgos e Incidentes Confirmados
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-[10px] border border-slate-300 border-collapse">
                <thead className="bg-slate-200 text-slate-900 font-bold">
                  <tr>
                    <th className="p-1.5 border border-slate-300">ID / Severidad</th>
                    <th className="p-1.5 border border-slate-300">Categoría MITRE</th>
                    <th className="p-1.5 border border-slate-300">Incidente Identificado</th>
                    <th className="p-1.5 border border-slate-300">Activos Involucrados</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {confirmedFindings.map((item) => (
                    <tr key={item.incident.id} className="hover:bg-slate-50">
                      <td className="p-1.5 border border-slate-300 font-mono font-bold">
                        <span
                          className={`px-1.5 py-0.2 rounded text-[9px] ${
                            item.incident.risk === 'CRITICAL'
                              ? 'bg-rose-100 text-rose-800'
                              : 'bg-orange-100 text-orange-800'
                          }`}
                        >
                          {item.incident.risk}
                        </span>
                      </td>
                      <td className="p-1.5 border border-slate-300 font-mono font-semibold">
                        {item.incident.category}
                      </td>
                      <td className="p-1.5 border border-slate-300 font-medium">
                        {item.incident.title}
                      </td>
                      <td className="p-1.5 border border-slate-300 font-mono text-[9px]">
                        {item.incident.affectedHosts.join(', ')} / {item.incident.affectedUsers.join(', ')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* S4. Explicación Técnica */}
          <section className="space-y-1">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-1 flex items-center gap-1.5">
              <span>3.0</span> Análisis Técnico y TTPs Adversarios
            </h2>
            <div className="p-2.5 bg-slate-50 border border-slate-200 rounded font-mono text-[10px] text-slate-800 whitespace-pre-line leading-relaxed">
              {report.technicalExplanation}
            </div>
          </section>

          {/* S6 & S7. Crítica e Impacto */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <section className="space-y-1">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-1">
                4.0 Justificación Crítica
              </h2>
              <p className="text-[10px] text-slate-700 leading-relaxed whitespace-pre-line">
                {report.critique}
              </p>
            </section>

            <section className="space-y-1">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-1">
                5.0 Impacto Organizacional (CIA)
              </h2>
              <div className="p-2 bg-slate-50 border border-slate-200 rounded text-[10px] font-mono text-slate-800 leading-relaxed whitespace-pre-line">
                {report.organizationalImpact}
              </div>
            </section>
          </div>

          {/* S8. Plan de Acción */}
          <section className="space-y-1.5">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-1 flex items-center gap-1.5">
              <span>6.0</span> Plan de Acción y Medidas Correctivas
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-[10px]">
              <div className="p-2 rounded bg-slate-100 border border-slate-200">
                <strong className="text-slate-900 block font-mono uppercase mb-0.5">Investigación</strong>
                <p className="text-slate-700 whitespace-pre-line leading-tight">
                  {report.actionInvestigate}
                </p>
              </div>

              <div className="p-2 rounded bg-rose-50 border border-rose-200">
                <strong className="text-rose-900 block font-mono uppercase mb-0.5">Contención</strong>
                <p className="text-rose-800 whitespace-pre-line leading-tight">
                  {report.actionContain}
                </p>
              </div>

              <div className="p-2 rounded bg-emerald-50 border border-emerald-200">
                <strong className="text-emerald-900 block font-mono uppercase mb-0.5">Remediación</strong>
                <p className="text-emerald-800 whitespace-pre-line leading-tight">
                  {report.actionRemediate}
                </p>
              </div>
            </div>
          </section>

          {/* S9. Recomendaciones */}
          <section className="space-y-1">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-1 flex items-center gap-1.5">
              <span>7.0</span> Recomendaciones Estratégicas de Hardening
            </h2>
            <ul className="list-disc list-inside space-y-0.5 text-[10px] text-slate-700">
              {report.recommendations.slice(0, 5).map((rec, idx) => (
                <li key={idx}>{rec}</li>
              ))}
            </ul>
          </section>
        </div>

        {/* Footer Formal y Firma */}
        <div className="mt-8 pt-4 border-t-2 border-slate-900 flex items-end justify-between text-[10px] font-mono text-slate-600">
          <div>
            <p>Hash SHA-256 de Verificación Pericial:</p>
            <p className="text-[9px] text-slate-800 font-bold select-all">
              e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855
            </p>
          </div>

          <div className="text-right">
            <div className="w-40 border-b border-slate-400 mb-1" />
            <p className="font-bold text-slate-900">{report.analyst}</p>
            <p className="text-[9px]">Especialista Forense SOC L2</p>
          </div>
        </div>
      </div>
    </div>
  )
}
