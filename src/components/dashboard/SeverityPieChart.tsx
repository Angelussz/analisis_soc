import React from 'react'
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts'
import { PieChart as PieIcon } from 'lucide-react'
import { useLogStore } from '@/store/logStore'

export const SeverityPieChart: React.FC = () => {
  const { incidents } = useLogStore()

  const critical = incidents.filter((i) => i.risk === 'CRITICAL').length
  const high = incidents.filter((i) => i.risk === 'HIGH').length
  const medium = incidents.filter((i) => i.risk === 'MEDIUM').length
  const low = incidents.filter((i) => i.risk === 'LOW').length
  const total = incidents.length

  const data = [
    { name: 'Crítico', value: critical, color: '#EF4444' },
    { name: 'Alto', value: high, color: '#F97316' },
    { name: 'Medio', value: medium, color: '#F59E0B' },
    { name: 'Bajo', value: low, color: '#06B6D4' },
  ].filter((d) => d.value > 0)

  const dominantPercent = total > 0 ? Math.round((critical / total) * 100) : 0

  return (
    <div className="bg-surface-container rounded-2xl p-5 border border-outline-variant/30 shadow-sm flex flex-col justify-between">
      <div className="flex items-center justify-between mb-3 border-b border-outline-variant/20 pb-2.5">
        <div className="flex items-center gap-2">
          <PieIcon className="w-5 h-5 text-primary" />
          <h3 className="text-sm font-bold text-on-surface">Distribución de Severidad</h3>
        </div>
        <span className="font-mono text-xs text-on-surface-variant font-semibold">
          {total} Incidentes
        </span>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-around gap-4 py-2">
        {/* Gráfico Donut Recharts */}
        <div className="relative w-36 h-36 flex items-center justify-center shrink-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Tooltip
                contentStyle={{
                  backgroundColor: '#191f31',
                  borderColor: '#424754',
                  borderRadius: '8px',
                  color: '#dce1fb',
                  fontSize: '12px',
                  fontFamily: 'monospace',
                }}
              />
              <Pie
                data={data}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={42}
                outerRadius={62}
                paddingAngle={4}
                stroke="#0c1324"
                strokeWidth={2}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>

          {/* Texto Central */}
          <div className="absolute flex flex-col items-center justify-center pointer-events-none text-center">
            <span className="font-mono text-xl font-bold text-on-surface leading-tight">
              {dominantPercent}%
            </span>
            <span className="font-mono text-[9px] uppercase tracking-wider text-error font-semibold">
              Crítico
            </span>
          </div>
        </div>

        {/* Leyenda Detallada */}
        <div className="flex-1 w-full space-y-2 text-xs font-mono">
          <div className="flex items-center justify-between text-on-surface p-1.5 rounded-lg bg-surface-container-low">
            <div className="flex items-center gap-2 truncate">
              <span className="w-2.5 h-2.5 rounded bg-rose-500 shrink-0" />
              <span className="truncate">Crítico ({critical})</span>
            </div>
            <span className="font-bold text-error">
              {total > 0 ? Math.round((critical / total) * 100) : 0}%
            </span>
          </div>

          <div className="flex items-center justify-between text-on-surface p-1.5 rounded-lg bg-surface-container-low">
            <div className="flex items-center gap-2 truncate">
              <span className="w-2.5 h-2.5 rounded bg-orange-500 shrink-0" />
              <span className="truncate">Alto ({high})</span>
            </div>
            <span className="font-bold text-orange-400">
              {total > 0 ? Math.round((high / total) * 100) : 0}%
            </span>
          </div>

          <div className="flex items-center justify-between text-on-surface p-1.5 rounded-lg bg-surface-container-low">
            <div className="flex items-center gap-2 truncate">
              <span className="w-2.5 h-2.5 rounded bg-amber-500 shrink-0" />
              <span className="truncate">Medio ({medium})</span>
            </div>
            <span className="font-bold text-amber-400">
              {total > 0 ? Math.round((medium / total) * 100) : 0}%
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
