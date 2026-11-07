import React, { useRef } from 'react'
import { Shield, MemoryStick as Memory, Database, UploadCloud, RefreshCw } from 'lucide-react'
import { useLogStore } from '@/store/logStore'

export const Header: React.FC = () => {
  const { logs, fileName, isLoading, analyzeFile, reset } = useLogStore()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      analyzeFile(file)
    }
  }

  return (
    <header className="sticky top-0 z-40 bg-surface/90 backdrop-blur-xl border-b border-outline-variant/30 shadow-[0_1px_8px_rgba(0,0,0,0.5)]">
      <input
        ref={fileInputRef}
        type="file"
        accept=".xlsx, .xls"
        className="hidden"
        onChange={handleFileChange}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2.5 flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Logo & Marca */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-primary-container/20 border border-primary/30 text-primary flex items-center justify-center shrink-0">
            <Shield className="w-5 h-5" />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-base tracking-tight text-on-surface">
                SOC L2 Sentinel
              </span>
              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-mono font-medium bg-tertiary-container/20 text-tertiary border border-tertiary/30">
                <span className="w-1.5 h-1.5 rounded-full bg-tertiary animate-pulse" />
                NIVEL 2 // LIVE
              </span>
            </div>
            <div className="flex items-center gap-2 text-xs font-mono text-on-surface-variant">
              <span className="text-secondary font-medium">Consola de Operaciones</span>
              <span className="opacity-40">•</span>
              <span className="truncate max-w-[200px] text-on-surface/80">
                {fileName ? `${fileName} (${logs.length} logs)` : 'Sin archivo cargado'}
              </span>
            </div>
          </div>
        </div>

        {/* Telemetría y Controles de Archivo */}
        <div className="flex items-center gap-2.5 flex-wrap">
          {/* Badge Web Worker */}
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-surface-container-low border border-outline-variant/20 text-xs font-mono text-on-surface-variant">
            <Memory className="w-3.5 h-3.5 text-tertiary" />
            <span>
              Web Worker: <strong className="text-tertiary font-medium">Activo (0% Backend)</strong>
            </span>
          </div>

          {/* Badge Conteo de Eventos */}
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-surface-container-low border border-outline-variant/20 text-xs font-mono text-on-surface-variant">
            <Database className="w-3.5 h-3.5 text-secondary" />
            <span className="text-on-surface font-semibold">{logs.length}</span>
            <span>eventos</span>
          </div>

          {/* Botón Cargar / Reemplazar Archivo */}
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={isLoading}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary-container text-on-primary-container hover:bg-primary-container/90 active:scale-95 text-xs font-mono font-semibold transition-all shadow-sm disabled:opacity-50"
            title="Cargar nuevo archivo Excel de logs SIEM"
          >
            {isLoading ? (
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <UploadCloud className="w-3.5 h-3.5" />
            )}
            <span>{logs.length > 0 ? 'Cambiar Excel' : 'Cargar Logs'}</span>
          </button>

          {logs.length > 0 && (
            <button
              onClick={reset}
              className="p-1.5 rounded-lg text-on-surface-variant hover:text-error hover:bg-error-container/20 transition-colors"
              title="Limpiar datos y reiniciar"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </header>
  )
}
