import * as XLSX from 'xlsx'
import type { LogEntry } from '@/types/log.types'

/**
 * Parsea un timestamp de log SIEM a objeto Date nativo.
 * Soporta cadenas ISO, formato 'YYYY-MM-DD HH:mm:ss' y números seriales de Excel.
 */
export function parseLogTimestamp(raw: unknown): Date {
  if (raw instanceof Date && !isNaN(raw.getTime())) {
    return raw
  }

  if (typeof raw === 'number') {
    // Conversión de número serial de fecha de Excel
    const excelEpoch = new Date(Date.UTC(1899, 11, 30))
    const ms = Math.round(raw * 86400 * 1000)
    return new Date(excelEpoch.getTime() + ms)
  }

  if (typeof raw === 'string') {
    const trimmed = raw.trim()
    // Si viene en formato 'YYYY-MM-DD HH:mm:ss', reemplazar espacio por 'T' para compatibilidad estándar
    const isoLike = trimmed.includes(' ') && !trimmed.includes('T')
      ? trimmed.replace(' ', 'T')
      : trimmed
    const parsed = new Date(isoLike)
    if (!isNaN(parsed.getTime())) {
      return parsed
    }
  }

  return new Date()
}

/**
 * Mapea la severidad a los tipos estrictos permitidos.
 */
function normalizeSeverity(raw: unknown): LogEntry['severity'] {
  const str = String(raw || '').trim().toLowerCase()
  if (str.includes('high') || str.includes('alto') || str.includes('crit')) {
    return 'High'
  }
  if (str.includes('med')) {
    return 'Medium'
  }
  if (str.includes('warn') || str.includes('adv')) {
    return 'Warning'
  }
  return 'Informational'
}

/**
 * Parsea el contenido binario de un archivo Excel (.xlsx / .xls)
 * y normaliza las 12 columnas fijas del SIEM a objetos LogEntry.
 */
export function parseExcelLogs(buffer: ArrayBuffer): LogEntry[] {
  const workbook = XLSX.read(buffer, {
    type: 'array',
    cellDates: true,
  })

  const sheetName = workbook.SheetNames[0]
  if (!sheetName) {
    throw new Error('El archivo Excel no contiene ninguna hoja válida.')
  }

  const sheet = workbook.Sheets[sheetName]
  // Obtenemos las filas como matriz de arreglos
  const rows = XLSX.utils.sheet_to_json<unknown[]>(sheet, {
    header: 1,
    defval: '',
    blankrows: false,
  })

  if (!rows || rows.length < 2) {
    throw new Error('La hoja Excel no contiene suficientes datos (mínimo 1 fila de encabezado y 1 de datos).')
  }

  // Mapeo dinámico de encabezados para mayor resiliencia
  const headerRow = (rows[0] as unknown[]).map((col) =>
    String(col || '').trim().toLowerCase().replace(/[\s_-]/g, '')
  )

  const findIdx = (possibleNames: string[]): number => {
    for (const name of possibleNames) {
      const idx = headerRow.findIndex((h) => h === name || h.includes(name))
      if (idx !== -1) return idx
    }
    return -1
  }

  const idxMap = {
    logId: findIdx(['logid', 'id', 'eventidlog']),
    timestamp: findIdx(['timestamp', 'date', 'datetime', 'fecha', 'hora']),
    hostname: findIdx(['hostname', 'host', 'computer', 'equipo']),
    eventId: findIdx(['eventid', 'event', 'idevento']),
    user: findIdx(['user', 'usuario', 'account', 'username']),
    sourceIp: findIdx(['sourceip', 'srcip', 'iporigen', 'source']),
    destination: findIdx(['destination', 'dst', 'dest', 'ipdestino', 'target']),
    logSource: findIdx(['logsource', 'source', 'origen', 'channel']),
    eventDescription: findIdx(['eventdescription', 'description', 'message', 'descripcion']),
    processCommandLine: findIdx(['processcommandline', 'commandline', 'command', 'cmd', 'proceso']),
    result: findIdx(['result', 'status', 'resultado', 'action']),
    severity: findIdx(['severity', 'severidad', 'level', 'nivel']),
  }

  const entries: LogEntry[] = []

  for (let i = 1; i < rows.length; i++) {
    const row = rows[i] as unknown[]
    if (!row || row.length === 0) continue

    const getValue = (idx: number, fallback = ''): string => {
      if (idx === -1 || idx >= row.length) return fallback
      const val = row[idx]
      return val !== null && val !== undefined ? String(val).trim() : fallback
    }

    const logId = getValue(idxMap.logId, `EVT-${String(i).padStart(5, '0')}`)
    const rawTimestamp = idxMap.timestamp !== -1 ? row[idxMap.timestamp] : null
    const timestamp = parseLogTimestamp(rawTimestamp)
    const hostname = getValue(idxMap.hostname, 'UNKNOWN-HOST')
    const rawEventId = idxMap.eventId !== -1 ? row[idxMap.eventId] : ''
    const eventId = typeof rawEventId === 'number' ? rawEventId : String(rawEventId).trim() || '0'
    const user = getValue(idxMap.user, 'N/A')
    const sourceIp = getValue(idxMap.sourceIp, 'N/A')
    const destination = getValue(idxMap.destination, 'N/A')
    const logSource = getValue(idxMap.logSource, 'Security')
    const eventDescription = getValue(idxMap.eventDescription, '')
    const cmdVal = getValue(idxMap.processCommandLine, '')
    const processCommandLine = cmdVal ? cmdVal : undefined
    const result = getValue(idxMap.result, 'Unknown')
    const rawSeverity = idxMap.severity !== -1 ? row[idxMap.severity] : 'Informational'
    const severity = normalizeSeverity(rawSeverity)

    // Descartar filas completamente vacías
    if (!logId && !hostname && !eventDescription) {
      continue
    }

    entries.push({
      logId,
      timestamp,
      hostname,
      eventId,
      user,
      sourceIp,
      destination,
      logSource,
      eventDescription,
      processCommandLine,
      result,
      severity,
    })
  }

  return entries
}
