import React from 'react'
import { ShieldCheck, UserX, Server, HardDrive, AlertCircle } from 'lucide-react'
import { useLogStore } from '@/store/logStore'

export const TopUsersChart: React.FC = () => {
  const { incidents } = useLogStore()

  // Extraer entidades impactadas de los incidentes detectados
  const impactedAssets: {
    id: string
    name: string
    type: 'USER' | 'SERVER'
    detail: string
    badge: string
    badgeClass: string
  }[] = []

  // Recorrer incidentes para mapear activos reales
  for (const inc of incidents) {
    for (const user of inc.affectedUsers) {
      if (user && user !== '-' && user !== 'N/A' && !impactedAssets.some((a) => a.name === user)) {
        const isRojas = user.toLowerCase().includes('rrojas')
        const isHelpdesk = user.toLowerCase().includes('helpdesk')
        const isGarcia = user.toLowerCase().includes('mgarcia')

        impactedAssets.push({
          id: `u-${user}`,
          name: user,
          type: 'USER',
          detail: isRojas
            ? 'Exfiltración masiva HTTPS (~240MB) y staging 7z'
            : isHelpdesk
            ? 'Instalación de servicio no autorizado y persistencia'
            : isGarcia
            ? 'Cuenta comprometida por fuerza bruta perimetral'
            : `Impactado por incidente ${inc.category}`,
          badge: isRojas || isGarcia ? 'COMPROMETIDA' : 'INVESTIGAR',
          badgeClass: isRojas || isGarcia
            ? 'bg-error text-on-error font-bold'
            : 'bg-amber-500/20 text-amber-300 border border-amber-500/30',
        })
      }
    }

    for (const host of inc.affectedHosts) {
      if (host && host !== '-' && host !== 'N/A' && !impactedAssets.some((a) => a.name === host)) {
        const isAppSrv = host.includes('APP-SRV01')
        const isFsSrv = host.includes('FS-SRV01')
        const isWeb01 = host.includes('WEB-01')

        impactedAssets.push({
          id: `h-${host}`,
          name: host,
          type: 'SERVER',
          detail: isAppSrv
            ? 'Servicio malicioso wuhelper.exe y tarea UpdateCheck'
            : isFsSrv
            ? 'Acceso anómalo a recursos compartidos (Finance/Legal)'
            : isWeb01
            ? 'Webshell detectada /uploads/test.aspx?cmd='
            : `Afectado por incidente ${inc.category}`,
          badge: isAppSrv || isWeb01 ? 'ISOLATE REQ' : 'INSPECCIÓN',
          badgeClass: isAppSrv || isWeb01
            ? 'bg-error text-on-error font-bold'
            : 'bg-secondary text-on-secondary font-semibold',
        })
      }
    }
  }

  const displayAssets = impactedAssets.slice(0, 4)

  return (
    <div className="bg-surface-container rounded-2xl p-5 border border-outline-variant/30 shadow-sm flex flex-col justify-between">
      <div className="flex items-center justify-between mb-3 border-b border-outline-variant/20 pb-2.5">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-error" />
          <h3 className="text-sm font-bold text-on-surface">Activos y Cuentas Comprometidas</h3>
        </div>
        <span className="font-mono text-xs text-error font-bold bg-error-container/20 px-2 py-0.5 rounded border border-error/30">
          {impactedAssets.length} IMPACTADOS
        </span>
      </div>

      <div className="space-y-2.5 my-auto">
        {displayAssets.map((asset) => (
          <div
            key={asset.id}
            className="flex items-center justify-between p-2.5 bg-surface-container-low rounded-xl border border-outline-variant/10 hover:border-primary/30 transition-colors"
          >
            <div className="flex items-center gap-3 min-w-0">
              <div
                className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                  asset.type === 'USER'
                    ? 'bg-error-container/30 text-error'
                    : 'bg-secondary-container/20 text-secondary'
                }`}
              >
                {asset.type === 'USER' ? (
                  <UserX className="w-4 h-4" />
                ) : asset.name.includes('FS') ? (
                  <HardDrive className="w-4 h-4" />
                ) : (
                  <Server className="w-4 h-4" />
                )}
              </div>
              <div className="flex flex-col min-w-0">
                <span className="font-mono text-xs font-bold text-on-surface truncate">
                  {asset.name}
                </span>
                <span className="text-[11px] text-on-surface-variant truncate">
                  {asset.detail}
                </span>
              </div>
            </div>

            <span
              className={`px-2 py-0.5 rounded text-[10px] font-mono shrink-0 ml-2 ${asset.badgeClass}`}
            >
              {asset.badge}
            </span>
          </div>
        ))}

        {displayAssets.length === 0 && (
          <div className="flex items-center justify-center gap-2 text-xs font-mono text-on-surface-variant py-6">
            <AlertCircle className="w-4 h-4" />
            <span>Sin activos de alta severidad detectados</span>
          </div>
        )}
      </div>
    </div>
  )
}
