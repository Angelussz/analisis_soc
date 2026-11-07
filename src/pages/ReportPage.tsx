import React from 'react'
import { FileText, Shield, AlertTriangle, CheckSquare, Download, Printer } from 'lucide-react'
import { useReportStore } from '@/store/reportStore'
import { useLogStore } from '@/store/logStore'

export const ReportPage: React.FC = () => {
  const report = useReportStore()
  const { incidents } = useLogStore()

  const criticals = incidents.filter((i) => i.risk === 'CRITICAL')

  return (
    <div className="space-y-6">
      {/* Cabecera */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-outline-variant/20 pb-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-on-surface flex items-center gap-2.5">
            <FileText className="w-6 h-6 text-tertiary" />
            Generador de Informes Forenses L2
          </h2>
          <p className="text-xs text-on-surface-variant font-mono mt-0.5">
            Estructura formal de 9 secciones con vista previa A4 y exportación a PDF (Fase 6)
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => alert('La exportación directa a PDF A4 se integrará en la Fase 7.')}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-primary-container text-on-primary-container text-xs font-mono font-semibold hover:bg-primary-container/90 transition-all shadow"
          >
            <Download className="w-4 h-4" />
            <span>Descargar PDF</span>
          </button>
          <button
            onClick={() => window.print()}
            className="p-1.5 rounded-lg bg-surface-container-high text-on-surface-variant hover:text-on-surface transition-colors"
            title="Imprimir"
          >
            <Printer className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Grid de Secciones del Reporte */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Panel Resumen del Caso */}
        <div className="md:col-span-1 bg-surface-container rounded-2xl p-5 border border-outline-variant/30 space-y-4 shadow-sm">
          <div className="flex items-center gap-2 text-primary font-bold text-sm border-b border-outline-variant/20 pb-2">
            <Shield className="w-4 h-4" />
            <span>Sección 1: Datos del Caso</span>
          </div>

          <div className="space-y-2 text-xs font-mono">
            <div>
              <span className="text-on-surface-variant">Número de Caso:</span>
              <p className="font-bold text-on-surface">{report.caseNumber}</p>
            </div>
            <div>
              <span className="text-on-surface-variant">Analista Asignado:</span>
              <p className="font-bold text-on-surface">{report.analyst}</p>
            </div>
            <div>
              <span className="text-on-surface-variant">Organización:</span>
              <p className="font-bold text-on-surface">{report.organization}</p>
            </div>
            <div>
              <span className="text-on-surface-variant">Clasificación:</span>
              <span className="inline-block mt-1 px-2 py-0.5 rounded bg-error-container/40 text-error font-bold text-[10px] border border-error/30">
                {report.classification}
              </span>
            </div>
          </div>
        </div>

        {/* Panel Resumen de Secciones 2-9 */}
        <div className="md:col-span-2 bg-surface-container rounded-2xl p-5 border border-outline-variant/30 space-y-4 shadow-sm">
          <div className="flex items-center justify-between border-b border-outline-variant/20 pb-2">
            <div className="flex items-center gap-2 text-tertiary font-bold text-sm">
              <CheckSquare className="w-4 h-4" />
              <span>Estructura del Informe (9 Secciones Forenses)</span>
            </div>
            <span className="font-mono text-xs text-on-surface-variant">
              {incidents.length} Hallazgos Listos
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono">
            <div className="p-3 rounded-xl bg-surface-container-low border border-outline-variant/20 space-y-1">
              <span className="text-primary font-bold">S2. Resumen Ejecutivo</span>
              <p className="text-on-surface-variant text-[11px]">
                {criticals.length} amenazas críticas detectadas, incluyendo ransomware y fuga de datos.
              </p>
            </div>

            <div className="p-3 rounded-xl bg-surface-container-low border border-outline-variant/20 space-y-1">
              <span className="text-secondary font-bold">S3. Hallazgos Forenses</span>
              <p className="text-on-surface-variant text-[11px]">
                {incidents.length} incidentes clasificados con confirmación analista.
              </p>
            </div>

            <div className="p-3 rounded-xl bg-surface-container-low border border-outline-variant/20 space-y-1">
              <span className="text-tertiary font-bold">S4. Explicación Técnica</span>
              <p className="text-on-surface-variant text-[11px]">
                Correlación MITRE ATT&CK, TTPs y artefactos de ejecución.
              </p>
            </div>

            <div className="p-3 rounded-xl bg-surface-container-low border border-outline-variant/20 space-y-1">
              <span className="text-amber-400 font-bold">S5. Evidencias Clave</span>
              <p className="text-on-surface-variant text-[11px]">
                Tablas raw de logs de seguridad asociados a cada ataque.
              </p>
            </div>

            <div className="p-3 rounded-xl bg-surface-container-low border border-outline-variant/20 space-y-1">
              <span className="text-orange-400 font-bold">S6. Crítica y Justificación</span>
              <p className="text-on-surface-variant text-[11px]">
                Argumentación de severidad basada en matrices de riesgo.
              </p>
            </div>

            <div className="p-3 rounded-xl bg-surface-container-low border border-outline-variant/20 space-y-1">
              <span className="text-rose-400 font-bold">S7. Impacto Organizacional</span>
              <p className="text-on-surface-variant text-[11px]">
                Afectación operacional, confidencialidad y continuidad.
              </p>
            </div>

            <div className="p-3 rounded-xl bg-surface-container-low border border-outline-variant/20 space-y-1">
              <span className="text-primary font-bold">S8. Plan de Acción</span>
              <p className="text-on-surface-variant text-[11px]">
                Fases de Investigación, Contención Activa y Remediación.
              </p>
            </div>

            <div className="p-3 rounded-xl bg-surface-container-low border border-outline-variant/20 space-y-1">
              <span className="text-tertiary font-bold">S9. Recomendaciones</span>
              <p className="text-on-surface-variant text-[11px]">
                Hardening de políticas de contraseñas, RDP, y endpoints.
              </p>
            </div>
          </div>

          <div className="p-3 bg-surface-container-lowest rounded-xl font-mono text-[11px] text-tertiary flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-secondary shrink-0" />
            <span>
              El editor interactivo dividido con previsualización PDF A4 en vivo se desarrollará en las Fases 6 y 7.
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
