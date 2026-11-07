import React from 'react'
import { LayoutDashboard, AlertTriangle, FileCode2, FileText, Cpu, Terminal } from 'lucide-react'
import { useLogStore, type NavigationTab } from '@/store/logStore'

export const Sidebar: React.FC = () => {
  const { activeTab, setActiveTab, incidents, logs } = useLogStore()

  const criticalCount = incidents.filter((i) => i.risk === 'CRITICAL').length

  const navItems: { id: NavigationTab; label: string; icon: React.ReactNode; badge?: React.ReactNode }[] = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: <LayoutDashboard className="w-5 h-5" />,
    },
    {
      id: 'incidents',
      label: 'Incidentes',
      icon: <AlertTriangle className="w-5 h-5" />,
      badge: incidents.length > 0 ? (
        <span className="px-1.5 py-0.2 bg-error text-on-error font-mono text-[10px] rounded font-bold leading-tight">
          {criticalCount > 0 ? criticalCount : incidents.length}
        </span>
      ) : null,
    },
    {
      id: 'logs',
      label: 'Visor de Logs',
      icon: <FileCode2 className="w-5 h-5" />,
      badge: logs.length > 0 ? (
        <span className="px-1.5 py-0.2 bg-surface-container-highest text-secondary font-mono text-[10px] rounded leading-tight">
          {logs.length}
        </span>
      ) : null,
    },
    {
      id: 'report',
      label: 'Generador Informe',
      icon: <FileText className="w-5 h-5" />,
      badge: (
        <span className="px-1.5 py-0.2 bg-secondary-container/80 text-on-secondary font-mono text-[10px] rounded font-bold leading-tight">
          A4
        </span>
      ),
    },
  ]

  return (
    <>
      {/* Sidebar Desktop (fijo a la izquierda en pantallas md+) */}
      <aside className="hidden md:flex flex-col w-64 bg-surface-container border-r border-outline-variant/30 h-screen sticky top-0 shrink-0">
        <div className="p-5 border-b border-outline-variant/20 flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-primary-container/20 border border-primary/30 flex items-center justify-center text-primary">
            <Terminal className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-bold tracking-tight text-on-surface">SOC L2 Console</h2>
            <p className="text-[11px] font-mono text-tertiary">v2.4 • Client-Side</p>
          </div>
        </div>

        {/* Lista de Navegación Principal */}
        <nav className="flex-1 p-3 space-y-1.5 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = activeTab === item.id
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-mono text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-primary-container text-on-primary-container shadow-md border-l-4 border-primary'
                    : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className={isActive ? 'text-on-primary-container' : 'text-primary'}>
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                </div>
                {item.badge}
              </button>
            )
          })}
        </nav>

        {/* Footer del Sidebar con métricas de salud */}
        <div className="p-4 border-t border-outline-variant/20 bg-surface-container-low text-[11px] font-mono text-on-surface-variant flex flex-col gap-1.5">
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1.5 text-tertiary">
              <Cpu className="w-3.5 h-3.5" />
              <span>Web Worker</span>
            </span>
            <span className="text-on-surface font-semibold">100% Local</span>
          </div>
          <div className="text-[10px] text-outline">
            Motor heurístico MITRE ATT&CK activo
          </div>
        </div>
      </aside>

      {/* Bottom Nav Bar en móvil (pantallas pequeñas) */}
      <nav className="md:hidden fixed bottom-0 inset-x-0 z-50 bg-surface/95 backdrop-blur-xl border-t border-outline-variant/30 shadow-[0_-1px_12px_rgba(0,0,0,0.6)]">
        <div className="flex justify-around items-center h-16 px-2">
          {navItems.map((item) => {
            const isActive = activeTab === item.id
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex flex-col items-center justify-center gap-1 min-w-[64px] h-12 transition-colors relative ${
                  isActive ? 'text-primary font-semibold' : 'text-on-surface-variant hover:text-on-surface'
                }`}
              >
                <div className="relative">
                  {item.icon}
                  {item.badge && (
                    <span className="absolute -top-1.5 -right-3">
                      {item.badge}
                    </span>
                  )}
                </div>
                <span className="text-[10px] uppercase font-mono tracking-wider">
                  {item.label.split(' ')[0]}
                </span>
              </button>
            )
          })}
        </div>
      </nav>
    </>
  )
}
