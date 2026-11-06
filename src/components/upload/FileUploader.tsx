import { useRef, useState, type FC, type DragEvent } from 'react'
import { UploadCloud, FileSpreadsheet, CheckCircle2, AlertCircle, RefreshCw, Cpu } from 'lucide-react'
import { useLogStore } from '@/store/logStore'

export const FileUploader: FC = () => {
  const { logs, isLoading, progress, stage, fileName, fileSize, error, analyzeFile, reset } = useLogStore()
  const [isDragOver, setIsDragOver] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFile = (file: File) => {
    if (!file) return
    const isExcel = file.name.endsWith('.xlsx') || file.name.endsWith('.xls')
    if (!isExcel) {
      alert('Por favor selecciona un archivo Excel (.xlsx o .xls)')
      return
    }
    analyzeFile(file)
  }

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragOver(false)
    const file = e.dataTransfer.files?.[0]
    if (file) {
      handleFile(file)
    }
  }

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragOver(true)
  }

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragOver(false)
  }

  const handleClick = () => {
    if (!isLoading) {
      fileInputRef.current?.click()
    }
  }

  const formatFileSize = (bytes: number | null) => {
    if (!bytes) return ''
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`
  }

  return (
    <div className="w-full">
      <input
        ref={fileInputRef}
        type="file"
        accept=".xlsx, .xls"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0]
          if (file) handleFile(file)
        }}
      />

      {/* Estado 1: Error */}
      {error && (
        <div className="mb-4 p-4 rounded-xl bg-error-container/40 border border-error/30 text-on-error-container flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-error shrink-0 mt-0.5" />
          <div className="flex-1 text-sm">
            <p className="font-semibold text-error">Error al procesar el archivo SIEM</p>
            <p className="text-xs text-on-error-container/90 mt-0.5">{error}</p>
          </div>
          <button
            onClick={reset}
            className="px-3 py-1 bg-surface-container hover:bg-surface-container-high rounded text-xs font-medium text-on-surface transition-colors"
          >
            Reintentar
          </button>
        </div>
      )}

      {/* Estado 2: Procesando en Web Worker */}
      {isLoading && (
        <div className="p-8 rounded-2xl bg-surface-container border border-primary/30 shadow-2xl flex flex-col items-center justify-center text-center">
          <div className="relative mb-5 flex items-center justify-center">
            <div className="w-16 h-16 rounded-full border-4 border-surface-container-highest border-t-primary animate-spin" />
            <Cpu className="w-7 h-7 text-primary absolute" />
          </div>

          <h3 className="text-base font-semibold text-on-surface mb-1">
            Procesando en Web Worker (Hilo Secundario)
          </h3>
          <p className="text-xs font-mono text-tertiary mb-4">
            {stage || 'Analizando hoja de cálculo...'}
          </p>

          <div className="w-full max-w-md bg-surface-container-lowest rounded-full h-2.5 overflow-hidden mb-2 border border-outline-variant/30">
            <div
              className="bg-gradient-to-r from-primary to-tertiary h-full transition-all duration-300 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>

          <div className="flex justify-between w-full max-w-md text-[11px] font-mono text-on-surface-variant">
            <span>0% Backend (Client-Side)</span>
            <span className="font-bold text-primary">{progress}%</span>
          </div>
        </div>
      )}

      {/* Estado 3: Archivo Cargado Exitosamente */}
      {!isLoading && logs.length > 0 && (
        <div className="p-6 rounded-2xl bg-surface-container border border-tertiary/30 shadow-xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="p-3 rounded-xl bg-tertiary-container/20 text-tertiary border border-tertiary/30">
                <FileSpreadsheet className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="font-semibold text-on-surface text-sm">{fileName}</h4>
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono font-medium bg-tertiary/10 text-tertiary border border-tertiary/30">
                    <CheckCircle2 className="w-3 h-3" /> LISTO
                  </span>
                </div>
                <div className="flex items-center gap-3 text-xs text-on-surface-variant font-mono mt-0.5">
                  <span>{logs.length} eventos normalizados</span>
                  <span>•</span>
                  <span>{formatFileSize(fileSize)}</span>
                  <span>•</span>
                  <span className="text-tertiary">12 columnas validadas</span>
                </div>
              </div>
            </div>

            <button
              onClick={handleClick}
              className="inline-flex items-center justify-center gap-2 px-3.5 py-2 rounded-lg bg-surface-container-high hover:bg-surface-bright border border-outline-variant/30 text-xs font-medium text-on-surface transition-all active:scale-95"
            >
              <RefreshCw className="w-3.5 h-3.5 text-primary" />
              <span>Cargar otro archivo</span>
            </button>
          </div>
        </div>
      )}

      {/* Estado 4: Reposo / Drag & Drop */}
      {!isLoading && logs.length === 0 && (
        <div
          onClick={handleClick}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          className={`relative cursor-pointer rounded-2xl border-2 border-dashed p-10 transition-all flex flex-col items-center justify-center text-center ${
            isDragOver
              ? 'border-primary bg-primary/5 scale-[1.01]'
              : 'border-outline-variant/40 hover:border-primary/60 bg-surface-container/50 hover:bg-surface-container'
          }`}
        >
          <div className="w-14 h-14 rounded-2xl bg-surface-container-high flex items-center justify-center mb-4 text-primary shadow-inner border border-outline-variant/30">
            <UploadCloud className="w-7 h-7" />
          </div>

          <h3 className="text-sm font-semibold text-on-surface mb-1">
            Cargar Logs SIEM para Análisis Forense
          </h3>
          <p className="text-xs text-on-surface-variant max-w-sm mb-4">
            Arrastra tu hoja de cálculo <span className="text-primary font-mono font-medium">.xlsx</span> o haz clic para seleccionarla desde tu equipo.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-2">
            <span className="px-2.5 py-1 rounded-md bg-surface-container-low text-[11px] font-mono text-on-surface-variant border border-outline-variant/20">
              12 columnas fijas SIEM
            </span>
            <span className="px-2.5 py-1 rounded-md bg-surface-container-low text-[11px] font-mono text-tertiary border border-outline-variant/20">
              ⚡ Web Worker Off-Thread
            </span>
            <span className="px-2.5 py-1 rounded-md bg-surface-container-low text-[11px] font-mono text-secondary border border-outline-variant/20">
              🔒 100% Local (0% Servidor)
            </span>
          </div>
        </div>
      )}
    </div>
  )
}
