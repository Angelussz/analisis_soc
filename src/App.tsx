import { Shield, Activity, Terminal, AlertTriangle } from 'lucide-react'

export default function App() {
  return (
    <div className="min-h-screen bg-surface text-on-surface flex flex-col items-center justify-center p-6">
      <div className="max-w-xl w-full bg-surface-container border border-outline-variant/30 rounded-xl p-8 shadow-2xl backdrop-blur-xl">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2.5 rounded-lg bg-primary-container/20 text-primary border border-primary/30">
            <Shield className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-on-surface">
              SOC L2 Sentinel
            </h1>
            <p className="text-xs font-mono text-tertiary flex items-center gap-1.5 mt-0.5">
              <span className="w-2 h-2 rounded-full bg-tertiary animate-pulse"></span>
              FASE 1 COMPLETADA // ENTORNO LISTO
            </p>
          </div>
        </div>

        <p className="text-sm text-on-surface-variant leading-relaxed mb-6">
          Plataforma de análisis forense SIEM y correlación de amenazas (100% Client-Side).
        </p>

        <div className="grid grid-cols-2 gap-3 font-mono text-xs">
          <div className="p-3 bg-surface-container-low rounded-lg border border-outline-variant/20 flex items-center gap-2">
            <Activity className="w-4 h-4 text-secondary" />
            <span>Tailwind v3 + Vite 5</span>
          </div>
          <div className="p-3 bg-surface-container-low rounded-lg border border-outline-variant/20 flex items-center gap-2">
            <Terminal className="w-4 h-4 text-tertiary" />
            <span>Web Worker Ready</span>
          </div>
          <div className="p-3 bg-surface-container-low rounded-lg border border-outline-variant/20 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-error" />
            <span>Recharts & TanStack</span>
          </div>
          <div className="p-3 bg-surface-container-low rounded-lg border border-outline-variant/20 flex items-center gap-2">
            <span className="font-bold text-primary">TS</span>
            <span>Tipos Core Definidos</span>
          </div>
        </div>
      </div>
    </div>
  )
}
