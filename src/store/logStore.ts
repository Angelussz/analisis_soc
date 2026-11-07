import { create } from 'zustand'
import type { LogEntry, Incident, WorkerResponse } from '@/types/log.types'

export type NavigationTab = 'dashboard' | 'incidents' | 'logs' | 'report'

interface LogStoreState {
  logs: LogEntry[]
  incidents: Incident[]
  isLoading: boolean
  progress: number
  stage: string
  fileName: string | null
  fileSize: number | null
  error: string | null
  selectedLog: LogEntry | null
  activeTab: NavigationTab

  // Acciones
  setActiveTab: (tab: NavigationTab) => void
  analyzeFile: (file: File) => Promise<void>
  setLogs: (logs: LogEntry[]) => void
  setIncidents: (incidents: Incident[]) => void
  setSelectedLog: (log: LogEntry | null) => void
  reset: () => void
}

export const useLogStore = create<LogStoreState>((set) => ({
  logs: [],
  incidents: [],
  isLoading: false,
  progress: 0,
  stage: '',
  fileName: null,
  fileSize: null,
  error: null,
  selectedLog: null,
  activeTab: 'dashboard',

  setActiveTab: (activeTab) => set({ activeTab }),

  analyzeFile: async (file: File) => {
    set({
      isLoading: true,
      progress: 5,
      stage: 'Iniciando Web Worker...',
      fileName: file.name,
      fileSize: file.size,
      error: null,
    })

    let worker: Worker | null = null

    try {
      const buffer = await file.arrayBuffer()

      // Instanciación nativa de Vite Web Worker (hilo separado)
      worker = new Worker(
        new URL('../workers/logAnalyzer.worker.ts', import.meta.url),
        { type: 'module' }
      )

      worker.onmessage = (event: MessageEvent<WorkerResponse>) => {
        const data = event.data

        if (data.type === 'PROGRESS') {
          set({
            progress: data.progress,
            stage: data.stage,
          })
        } else if (data.type === 'SUCCESS') {
          set({
            logs: data.logs,
            incidents: data.incidents,
            isLoading: false,
            progress: 100,
            stage: 'Completado',
          })
          worker?.terminate()
        } else if (data.type === 'ERROR') {
          set({
            error: data.error,
            isLoading: false,
            progress: 0,
            stage: 'Error',
          })
          worker?.terminate()
        }
      }

      worker.onerror = (err) => {
        set({
          error: `Error crítico en Web Worker: ${err.message || 'Fallo desconocido'}`,
          isLoading: false,
          progress: 0,
          stage: 'Error',
        })
        worker?.terminate()
      }

      // Enviar búfer al hilo del worker
      worker.postMessage(
        {
          type: 'START_ANALYSIS',
          fileBuffer: buffer,
          fileName: file.name,
        },
        [buffer] // Transferencia de memoria (Zero-Copy Transferable Object)
      )
    } catch (err) {
      set({
        error: err instanceof Error ? err.message : 'Error al procesar el archivo',
        isLoading: false,
        progress: 0,
        stage: 'Error',
      })
      worker?.terminate()
    }
  },

  setLogs: (logs) => set({ logs }),
  setIncidents: (incidents) => set({ incidents }),
  setSelectedLog: (selectedLog) => set({ selectedLog }),

  reset: () =>
    set({
      logs: [],
      incidents: [],
      isLoading: false,
      progress: 0,
      stage: '',
      fileName: null,
      fileSize: null,
      error: null,
      selectedLog: null,
    }),
}))
