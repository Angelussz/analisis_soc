import { create } from 'zustand'
import type { ReportState, ReportFinding, LogEntry } from '@/types/log.types'

interface ReportStoreState extends ReportState {
  evidenceLogs: LogEntry[]
  incidentDate: string

  // Acciones para actualizar secciones
  setCaseData: (data: Partial<Pick<ReportState, 'caseNumber' | 'analyst' | 'organization' | 'classification'>> & { incidentDate?: string }) => void
  setExecutiveSummary: (summary: string) => void
  setFindings: (findings: ReportFinding[]) => void
  updateFindingStatus: (index: number, confirmed: boolean) => void
  setTechnicalExplanation: (explanation: string) => void
  setEvidenceLogs: (logs: LogEntry[]) => void
  setCritique: (critique: string) => void
  setOrganizationalImpact: (impact: string) => void
  setActionPlan: (plan: Partial<Pick<ReportState, 'actionInvestigate' | 'actionContain' | 'actionRemediate'>>) => void
  setRecommendations: (recommendations: string[]) => void
  addRecommendation: (rec: string) => void
  removeRecommendation: (index: number) => void
  resetReport: () => void
}

const initialReportState: ReportState & { evidenceLogs: LogEntry[]; incidentDate: string } = {
  // Sección 1 - Manual
  caseNumber: 'INC-2026-001',
  analyst: 'Analista SOC Nivel 2',
  organization: 'Corporación Financiera S.A.',
  classification: 'CONFIDENCIAL',
  incidentDate: new Date().toISOString().split('T')[0],

  // Secciones 2-9 - Editables
  executiveSummary: '',
  findings: [],
  technicalExplanation: '',
  evidenceLogs: [],
  critique: '',
  organizationalImpact: '',
  actionInvestigate: '',
  actionContain: '',
  actionRemediate: '',
  recommendations: [],
}

export const useReportStore = create<ReportStoreState>((set) => ({
  ...initialReportState,

  setCaseData: (data) => set((state) => ({ ...state, ...data })),
  setExecutiveSummary: (executiveSummary) => set({ executiveSummary }),
  setFindings: (findings) => set({ findings }),
  updateFindingStatus: (index, confirmed) =>
    set((state) => {
      const nextFindings = [...state.findings]
      if (nextFindings[index]) {
        nextFindings[index] = { ...nextFindings[index], confirmed }
      }
      return { findings: nextFindings }
    }),
  setTechnicalExplanation: (technicalExplanation) => set({ technicalExplanation }),
  setEvidenceLogs: (evidenceLogs) => set({ evidenceLogs }),
  setCritique: (critique) => set({ critique }),
  setOrganizationalImpact: (organizationalImpact) => set({ organizationalImpact }),
  setActionPlan: (plan) => set((state) => ({ ...state, ...plan })),
  setRecommendations: (recommendations) => set({ recommendations }),
  addRecommendation: (rec) =>
    set((state) => ({ recommendations: [...state.recommendations, rec] })),
  removeRecommendation: (index) =>
    set((state) => ({
      recommendations: state.recommendations.filter((_, i) => i !== index),
    })),
  resetReport: () => set(initialReportState),
}))
