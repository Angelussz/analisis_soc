import { parseExcelLogs } from '@/lib/parser'
import { runCorrelationPipeline } from '@/lib/correlator'
import type { WorkerResponse } from '@/types/log.types'

// Declaración de contexto Worker
const ctx: Worker = self as unknown as Worker

ctx.addEventListener('message', async (event: MessageEvent) => {
  const { type, fileBuffer } = event.data || {}

  if (type !== 'START_ANALYSIS' || !fileBuffer) {
    return
  }

  try {
    const postProgress = (progress: number, stage: string) => {
      const msg: WorkerResponse = { type: 'PROGRESS', progress, stage }
      ctx.postMessage(msg)
    }

    postProgress(15, 'Leyendo archivo Excel...')
    await new Promise((resolve) => setTimeout(resolve, 60))

    postProgress(35, 'Extrayendo y mapeando 12 columnas fijas SIEM...')
    const logs = parseExcelLogs(fileBuffer)

    postProgress(60, `Normalizados ${logs.length} eventos. Ejecutando 6 detectores heurísticos...`)
    await new Promise((resolve) => setTimeout(resolve, 80))

    postProgress(85, 'Correlacionando vectores de ataque y calculando criticidad...')
    const incidents = runCorrelationPipeline(logs)

    postProgress(100, `Análisis finalizado: ${incidents.length} incidentes identificados.`)

    const successMsg: WorkerResponse = {
      type: 'SUCCESS',
      logs,
      incidents,
    }
    ctx.postMessage(successMsg)
  } catch (error) {
    const errMsg: WorkerResponse = {
      type: 'ERROR',
      error: error instanceof Error ? error.message : 'Error desconocido al analizar logs',
    }
    ctx.postMessage(errMsg)
  }
})
