import React from 'react'
import { IncidentList } from '@/components/incidents/IncidentList'
import { FileUploader } from '@/components/upload/FileUploader'
import { useLogStore } from '@/store/logStore'
import { ShieldAlert } from 'lucide-react'

export const IncidentsPage: React.FC = () => {
  const { logs } = useLogStore()

  if (logs.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] max-w-2xl mx-auto text-center gap-6">
        <div className="space-y-2">
          <ShieldAlert className="w-12 h-12 text-secondary mx-auto" />
          <h2 className="text-2xl font-bold tracking-tight text-on-surface">
            Centro de Incidentes Forenses
          </h2>
          <p className="text-sm text-on-surface-variant">
            Cargue un archivo Excel de logs SIEM para ejecutar los 6 detectores y correlacionar amenazas.
          </p>
        </div>
        <FileUploader />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <IncidentList />
    </div>
  )
}
