import React from 'react'
import { Globe } from 'lucide-react'
import { useLogStore } from '@/store/logStore'

export const TopIPsChart: React.FC = () => {
  const { logs } = useLogStore()

  // Calcular frecuencia por IP
  const ipCounts = new Map<string, number>()
  for (const log of logs) {
    const ip = log.sourceIp?.trim()
    if (!ip || ip === 'N/A' || ip === '-' || ip === '127.0.0.1') continue
    ipCounts.set(ip, (ipCounts.get(ip) || 0) + 1)
  }

  const topIps = Array.from(ipCounts.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([ip, count]) => {
      const isInternal =
        ip.startsWith('10.') || ip.startsWith('192.168.') || ip.startsWith('172.')
      const isAttacker = ip === '203.0.113.74' || ip === '192.0.2.91'
      return {
        ip,
        count,
        tag: isAttacker ? 'EXT / HOSTIL' : isInternal ? 'LAN INTERNA' : 'EXTERNA',
        tagClass: isAttacker
          ? 'bg-error-container/40 text-error border-error/30'
          : isInternal
          ? 'bg-tertiary-container/20 text-tertiary border-tertiary/30'
          : 'bg-secondary-container/20 text-secondary border-secondary/30',
        barColor: isAttacker ? 'bg-error' : isInternal ? 'bg-tertiary' : 'bg-secondary',
      }
    })

  const maxCount = topIps.length > 0 ? topIps[0].count : 1

  return (
    <div className="bg-surface-container rounded-2xl p-5 border border-outline-variant/30 shadow-sm flex flex-col justify-between">
      <div className="flex items-center justify-between mb-3 border-b border-outline-variant/20 pb-2.5">
        <div className="flex items-center gap-2">
          <Globe className="w-5 h-5 text-tertiary" />
          <h3 className="text-sm font-bold text-on-surface">Top 5 Orígenes Sospechosos</h3>
        </div>
        <span className="font-mono text-xs text-on-surface-variant font-semibold">
          GEOIP / SEGMENTO
        </span>
      </div>

      <div className="space-y-3.5 my-auto">
        {topIps.map((item) => {
          const percent = Math.round((item.count / maxCount) * 100)
          return (
            <div key={item.ip} className="space-y-1">
              <div className="flex justify-between items-center text-xs font-mono">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-on-surface">{item.ip}</span>
                  <span
                    className={`px-1.5 py-0.2 rounded text-[10px] font-semibold uppercase border ${item.tagClass}`}
                  >
                    {item.tag}
                  </span>
                </div>
                <span className="text-on-surface-variant font-semibold">
                  {item.count} evts
                </span>
              </div>
              <div className="w-full bg-surface-container-highest rounded-full h-1.5 overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${item.barColor}`}
                  style={{ width: `${percent}%` }}
                />
              </div>
            </div>
          )
        })}

        {topIps.length === 0 && (
          <p className="text-xs font-mono text-on-surface-variant text-center py-6">
            Sin datos de IP disponibles
          </p>
        )}
      </div>
    </div>
  )
}
