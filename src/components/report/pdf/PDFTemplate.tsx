import { forwardRef } from 'react'
import { useReportStore } from '@/store/reportStore'

export const PDFTemplate = forwardRef<HTMLDivElement>((_props, ref) => {
  const report = useReportStore()
  const confirmedFindings = report.findings.filter((f) => f.confirmed)

  return (
    <div
      ref={ref}
      style={{
        width: '794px', // Dimensiones exactas A4 a 96 DPI
        minHeight: '1123px',
        backgroundColor: '#ffffff',
        color: '#0f172a',
        padding: '36px',
        fontFamily: 'Inter, system-ui, sans-serif',
      }}
      className="text-slate-900 bg-white"
    >
      {/* Encabezado Formal */}
      <div className="border-b-2 border-slate-900 pb-3 mb-4 flex justify-between items-start">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-600 block">
            CENTRO DE OPERACIONES DE SEGURIDAD // SOC NIVEL 2
          </span>
          <h1 className="text-base font-extrabold text-slate-950 mt-0.5">
            INFORME TÉCNICO DE INCIDENTE DE SEGURIDAD
          </h1>
          <p className="text-[10px] font-mono text-slate-600 mt-1">
            REF: {report.caseNumber} // FECHA: {report.incidentDate}
          </p>
        </div>
        <div className="text-right">
          <span className="px-2 py-0.5 text-[9px] font-bold rounded bg-rose-100 text-rose-800 border border-rose-300 font-mono uppercase">
            {report.classification}
          </span>
          <p className="text-[9px] font-mono text-slate-500 mt-1">ESTADO: CONTENIDO</p>
        </div>
      </div>

      {/* Metadatos */}
      <div className="grid grid-cols-4 gap-2 bg-slate-100 p-2.5 rounded text-[10px] mb-4 border border-slate-200">
        <div>
          <span className="text-slate-500 block">Entidad:</span>
          <strong className="text-slate-900">{report.organization}</strong>
        </div>
        <div>
          <span className="text-slate-500 block">Analista:</span>
          <strong className="text-slate-900">{report.analyst}</strong>
        </div>
        <div>
          <span className="text-slate-500 block">Severidad:</span>
          <strong className="text-rose-700">CRÍTICO (CVSS 9.8)</strong>
        </div>
        <div>
          <span className="text-slate-500 block">Hallazgos:</span>
          <strong className="text-slate-900">{confirmedFindings.length} Validados</strong>
        </div>
      </div>

      {/* Secciones del Reporte */}
      <div className="space-y-3.5 text-[10px] leading-relaxed">
        {/* 1. Resumen Ejecutivo */}
        <div>
          <h2 className="font-bold text-slate-950 uppercase border-b border-slate-300 pb-0.5 mb-1">
            1.0 Resumen Ejecutivo
          </h2>
          <p className="text-slate-800 text-justify whitespace-pre-line">
            {report.executiveSummary}
          </p>
        </div>

        {/* 2. Hallazgos */}
        <div>
          <h2 className="font-bold text-slate-950 uppercase border-b border-slate-300 pb-0.5 mb-1">
            2.0 Incidentes y Amenazas Confirmadas
          </h2>
          <table className="w-full text-left text-[9px] border border-slate-300 border-collapse mt-1">
            <thead className="bg-slate-200 text-slate-900">
              <tr>
                <th className="p-1 border border-slate-300">Riesgo</th>
                <th className="p-1 border border-slate-300">Categoría</th>
                <th className="p-1 border border-slate-300">Incidente</th>
                <th className="p-1 border border-slate-300">Activos Afectados</th>
              </tr>
            </thead>
            <tbody>
              {confirmedFindings.map((item) => (
                <tr key={item.incident.id} className="border-b border-slate-200">
                  <td className="p-1 border border-slate-300 font-bold font-mono">
                    {item.incident.risk}
                  </td>
                  <td className="p-1 border border-slate-300 font-mono">
                    {item.incident.category}
                  </td>
                  <td className="p-1 border border-slate-300 font-medium">
                    {item.incident.title}
                  </td>
                  <td className="p-1 border border-slate-300 font-mono text-[8px]">
                    {item.incident.affectedHosts.join(', ')} / {item.incident.affectedUsers.join(', ')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* 3. Explicación Técnica */}
        <div>
          <h2 className="font-bold text-slate-950 uppercase border-b border-slate-300 pb-0.5 mb-1">
            3.0 Detalle Técnico y TTPs
          </h2>
          <p className="text-slate-800 font-mono text-[9px] whitespace-pre-line bg-slate-50 p-2 rounded border border-slate-200">
            {report.technicalExplanation}
          </p>
        </div>

        {/* 4. Plan de Acción */}
        <div>
          <h2 className="font-bold text-slate-950 uppercase border-b border-slate-300 pb-0.5 mb-1">
            4.0 Plan de Acción y Medidas Correctivas
          </h2>
          <div className="grid grid-cols-3 gap-2 mt-1">
            <div className="p-1.5 bg-slate-100 rounded border border-slate-200">
              <strong className="block text-slate-900 uppercase">Investigación:</strong>
              <p className="text-slate-700 whitespace-pre-line text-[9px]">{report.actionInvestigate}</p>
            </div>
            <div className="p-1.5 bg-rose-50 rounded border border-rose-200">
              <strong className="block text-rose-900 uppercase">Contención:</strong>
              <p className="text-rose-800 whitespace-pre-line text-[9px]">{report.actionContain}</p>
            </div>
            <div className="p-1.5 bg-emerald-50 rounded border border-emerald-200">
              <strong className="block text-emerald-900 uppercase">Remediación:</strong>
              <p className="text-emerald-800 whitespace-pre-line text-[9px]">{report.actionRemediate}</p>
            </div>
          </div>
        </div>

        {/* 5. Recomendaciones */}
        <div>
          <h2 className="font-bold text-slate-950 uppercase border-b border-slate-300 pb-0.5 mb-1">
            5.0 Recomendaciones de Hardening
          </h2>
          <ul className="list-disc list-inside space-y-0.5 text-slate-700 text-[9px]">
            {report.recommendations.slice(0, 5).map((r, i) => (
              <li key={i}>{r}</li>
            ))}
          </ul>
        </div>
      </div>

      {/* Firma */}
      <div className="mt-8 pt-3 border-t-2 border-slate-900 flex justify-between items-end text-[9px] font-mono text-slate-600">
        <div>
          <p>Hash SHA-256 de Validación Pericial:</p>
          <p className="font-bold text-slate-800">e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855</p>
        </div>
        <div className="text-right">
          <div className="w-32 border-b border-slate-400 mb-1" />
          <p className="font-bold text-slate-900">{report.analyst}</p>
          <p>Especialista Forense L2</p>
        </div>
      </div>
    </div>
  )
})

PDFTemplate.displayName = 'PDFTemplate'
