import React from 'react'
import { Sparkles, ChevronDown, Shield, FileText, CheckCircle2, Terminal, AlertTriangle, AlertOctagon, Activity, Wrench } from 'lucide-react'
import { useReportStore } from '@/store/reportStore'
import { useLogStore } from '@/store/logStore'
import { generateAutoReport } from '@/lib/reportAutoGenerator'

import { S1_CaseData } from './sections/S1_CaseData'
import { S2_ExecutiveSummary } from './sections/S2_ExecutiveSummary'
import { S3_Findings } from './sections/S3_Findings'
import { S4_TechnicalExplanation } from './sections/S4_TechnicalExplanation'
import { S5_Evidence } from './sections/S5_Evidence'
import { S6_Critique } from './sections/S6_Critique'
import { S7_Impact } from './sections/S7_Impact'
import { S8_ActionPlan } from './sections/S8_ActionPlan'
import { S9_Recommendations } from './sections/S9_Recommendations'

export const ReportEditor: React.FC = () => {
  const { incidents, logs } = useLogStore()
  const report = useReportStore()

  const handleRegenerate = () => {
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

  const sections = [
    {
      id: 's1',
      num: '1.0',
      title: 'Datos Generales del Caso',
      icon: <Shield className="w-4 h-4 text-primary" />,
      component: <S1_CaseData />,
      defaultOpen: true,
    },
    {
      id: 's2',
      num: '2.0',
      title: 'Resumen Ejecutivo Forense',
      icon: <FileText className="w-4 h-4 text-tertiary" />,
      component: <S2_ExecutiveSummary />,
      defaultOpen: true,
    },
    {
      id: 's3',
      num: '3.0',
      title: 'Matriz de Hallazgos Forenses',
      icon: <CheckCircle2 className="w-4 h-4 text-secondary" />,
      component: <S3_Findings />,
      defaultOpen: true,
    },
    {
      id: 's4',
      num: '4.0',
      title: 'Explicación Técnica y TTPs MITRE',
      icon: <Terminal className="w-4 h-4 text-primary" />,
      component: <S4_TechnicalExplanation />,
      defaultOpen: false,
    },
    {
      id: 's5',
      num: '5.0',
      title: 'Evidencias y Registros SIEM Clave',
      icon: <Activity className="w-4 h-4 text-amber-400" />,
      component: <S5_Evidence />,
      defaultOpen: false,
    },
    {
      id: 's6',
      num: '6.0',
      title: 'Justificación y Evaluación Crítica',
      icon: <AlertTriangle className="w-4 h-4 text-orange-400" />,
      component: <S6_Critique />,
      defaultOpen: false,
    },
    {
      id: 's7',
      num: '7.0',
      title: 'Impacto Organizacional (Triada CIA)',
      icon: <AlertOctagon className="w-4 h-4 text-error" />,
      component: <S7_Impact />,
      defaultOpen: false,
    },
    {
      id: 's8',
      num: '8.0',
      title: 'Plan de Acción Tripartito',
      icon: <Wrench className="w-4 h-4 text-secondary" />,
      component: <S8_ActionPlan />,
      defaultOpen: false,
    },
    {
      id: 's9',
      num: '9.0',
      title: 'Recomendaciones de Mitigación',
      icon: <CheckCircle2 className="w-4 h-4 text-tertiary" />,
      component: <S9_Recommendations />,
      defaultOpen: false,
    },
  ]

  return (
    <div className="space-y-4">
      {/* Barra de Herramientas de Síntesis */}
      <div className="p-3.5 bg-surface-container rounded-2xl border border-outline-variant/30 flex items-center justify-between gap-3 flex-wrap shadow-sm">
        <div className="flex items-center gap-2 text-xs font-mono">
          <span className="w-2 h-2 rounded-full bg-tertiary animate-pulse" />
          <span className="text-on-surface font-semibold">Editor de 9 Secciones Forenses</span>
          <span className="text-outline">•</span>
          <span className="text-on-surface-variant">Sincronizado en tiempo real</span>
        </div>

        <button
          onClick={handleRegenerate}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-surface-container-high hover:bg-surface-bright text-xs font-mono font-semibold text-primary border border-primary/30 transition-all active:scale-95 shadow"
        >
          <Sparkles className="w-3.5 h-3.5 text-secondary" />
          <span>Auto-Completar desde Heurística</span>
        </button>
      </div>

      {/* Acordeones Colapsables de las 9 Secciones */}
      <div className="space-y-3">
        {sections.map((sec) => (
          <details
            key={sec.id}
            open={sec.defaultOpen}
            className="group bg-surface-container rounded-2xl border border-outline-variant/30 overflow-hidden shadow-sm transition-all"
          >
            <summary className="flex items-center justify-between p-3.5 bg-surface-container-high/80 hover:bg-surface-container-high cursor-pointer list-none select-none transition-colors">
              <div className="flex items-center gap-2.5">
                <span className="w-6 h-6 rounded-lg bg-surface-container-lowest text-primary flex items-center justify-center font-mono text-xs font-bold border border-outline-variant/20">
                  {sec.num.replace('.0', '')}
                </span>
                <span className="font-semibold text-xs sm:text-sm text-on-surface flex items-center gap-2">
                  {sec.icon}
                  {sec.title}
                </span>
              </div>
              <ChevronDown className="w-4 h-4 text-on-surface-variant group-open:rotate-180 transition-transform" />
            </summary>

            <div className="p-4 bg-surface-container border-t border-outline-variant/15">
              {sec.component}
            </div>
          </details>
        ))}
      </div>
    </div>
  )
}
