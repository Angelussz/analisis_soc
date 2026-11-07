import React from 'react'
import { TacticalBanner } from '@/components/dashboard/TacticalBanner'
import { KPICards } from '@/components/dashboard/KPICards'
import { SeverityPieChart } from '@/components/dashboard/SeverityPieChart'
import { TimelineChart } from '@/components/dashboard/TimelineChart'
import { TopIPsChart } from '@/components/dashboard/TopIPsChart'
import { TopUsersChart } from '@/components/dashboard/TopUsersChart'
import { FileUploader } from '@/components/upload/FileUploader'
import { useLogStore } from '@/store/logStore'
import { ShieldCheck, Cpu } from 'lucide-react'

export const DashboardPage: React.FC = () => {
  const { logs } = useLogStore()

  if (logs.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] max-w-2xl mx-auto text-center gap-6">
        <div className="space-y-2">
          <h2 className="text-2xl font-bold tracking-tight text-on-surface">
            Bienvenido a SOC L2 Sentinel
          </h2>
          <p className="text-sm text-on-surface-variant">
            Para iniciar la telemetría y correlación heurística MITRE ATT&CK, cargue la hoja de cálculo de eventos SIEM.
          </p>
        </div>

        <FileUploader />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* 1. Banner Táctico de Acción Rápida */}
      <TacticalBanner />

      {/* 2. 4 KPIs Forenses */}
      <KPICards />

      {/* 3. Recharts Analíticos: Fila 1 (Severidad + Timeline) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SeverityPieChart />
        <TimelineChart />
      </div>

      {/* 4. Recharts Analíticos: Fila 2 (Top IPs + Activos Comprometidos) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TopIPsChart />
        <TopUsersChart />
      </div>

      {/* 5. Telemetría del Analista */}
      <div className="p-3.5 rounded-xl bg-surface-container-low border border-outline-variant/20 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs font-mono text-on-surface-variant">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-tertiary" />
          <span>
            Reglas Heurísticas MITRE L2: <strong className="text-tertiary">Activas y correlacionadas</strong>
          </span>
        </div>
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5">
            <Cpu className="w-3.5 h-3.5 text-secondary" />
            <span>Motor en Web Worker</span>
          </span>
          <span className="text-outline">•</span>
          <span>Latencia de render: &lt;16ms</span>
        </div>
      </div>
    </div>
  )
}
