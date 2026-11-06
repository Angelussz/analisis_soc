import { parseExcelLogs } from '@/lib/parser'
import type { WorkerResponse, Incident } from '@/types/log.types'

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

    // Simular un micro delay para permitir que la UI pinte la barra suavemente
    await new Promise((resolve) => setTimeout(resolve, 80))

    postProgress(40, 'Extrayendo y mapeando 12 columnas fijas SIEM...')
    const logs = parseExcelLogs(fileBuffer)

    postProgress(75, `Normalizados ${logs.length} eventos de seguridad...`)
    await new Promise((resolve) => setTimeout(resolve, 60))

    postProgress(90, 'Estructurando registros para el almacén forense...')

    // En Fase 2 los detectores aún no se ejecutan (se integrarán en Fase 3)
    const incidents: Incident[] = []

    postProgress(100, 'Análisis en hilo secundario completado.')

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
