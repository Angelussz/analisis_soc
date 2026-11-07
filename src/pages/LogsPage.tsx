import React from 'react'
import { LogTable } from '@/components/logs/LogTable'
import { FileUploader } from '@/components/upload/FileUploader'
import { useLogStore } from '@/store/logStore'
import { FileCode2 } from 'lucide-react'

export const LogsPage: React.FC = () => {
  const { logs } = useLogStore()

  if (logs.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] max-w-2xl mx-auto text-center gap-6">
        <div className="space-y-2">
          <FileCode2 className="w-12 h-12 text-primary mx-auto" />
          <h2 className="text-2xl font-bold tracking-tight text-on-surface">
            Visor Forense de Logs SIEM
          </h2>
          <p className="text-sm text-on-surface-variant">
            Cargue una hoja de cálculo Excel (.xlsx) para explorar los eventos con virtual scrolling de alta velocidad.
          </p>
        </div>
        <FileUploader />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <LogTable />
    </div>
  )
}
