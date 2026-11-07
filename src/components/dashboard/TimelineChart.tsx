import React from 'react'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import { Activity } from 'lucide-react'
import { useLogStore } from '@/store/logStore'

export const TimelineChart: React.FC = () => {
  const { logs, incidents } = useLogStore()

  // Agrupar logs por intervalos horarios (HH:00)
  const hourlyMap = new Map<string, { time: string; total: number; warningOrHigh: number }>()

  for (const log of logs) {
    if (!(log.timestamp instanceof Date) || isNaN(log.timestamp.getTime())) continue
    const hourKey = log.timestamp.toISOString().substring(11, 13) + ':00'
    if (!hourlyMap.has(hourKey)) {
      hourlyMap.set(hourKey, { time: hourKey, total: 0, warningOrHigh: 0 })
    }
    const bucket = hourlyMap.get(hourKey)!
    bucket.total++
    if (log.severity === 'High' || log.severity === 'Warning' || log.severity === 'Medium') {
      bucket.warningOrHigh++
    }
  }

  const chartData = Array.from(hourlyMap.values()).sort((a, b) =>
    a.time.localeCompare(b.time)
  )

  return (
    <div className="bg-surface-container rounded-2xl p-5 border border-outline-variant/30 shadow-sm flex flex-col justify-between">
      <div className="flex items-center justify-between mb-3 border-b border-outline-variant/20 pb-2.5">
        <div className="flex items-center gap-2">
          <Activity className="w-5 h-5 text-secondary" />
          <h3 className="text-sm font-bold text-on-surface">Vector Temporal y Volumen (Killchain)</h3>
        </div>
        <span className="font-mono text-xs bg-surface-container-high text-on-surface-variant px-2 py-0.5 rounded font-semibold">
          CRONOLOGÍA SIEM
        </span>
      </div>

      {/* Gráfico Recharts de Área */}
      <div className="w-full h-44 mb-4">
        {chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#4cd7f6" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#4cd7f6" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorThreat" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#EF4444" stopOpacity={0.6} />
                  <stop offset="95%" stopColor="#EF4444" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis
                dataKey="time"
                stroke="#8c909f"
                fontSize={11}
                tickLine={false}
                fontFamily="monospace"
              />
              <YAxis
                stroke="#8c909f"
                fontSize={11}
                tickLine={false}
                fontFamily="monospace"
              />
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
              <Area
                type="monotone"
                dataKey="total"
                name="Total Eventos"
                stroke="#4cd7f6"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorTotal)"
              />
              <Area
                type="monotone"
                dataKey="warningOrHigh"
                name="Eventos Anómalos / Riesgo"
                stroke="#EF4444"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorThreat)"
              />
            </AreaChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-full flex items-center justify-center font-mono text-xs text-on-surface-variant">
            Cargue un archivo para generar el histograma temporal
          </div>
        )}
      </div>

      {/* Hitos Tácticos Clave Detectados */}
      <div className="space-y-2">
        {incidents.slice(0, 3).map((inc) => (
          <div
            key={inc.id}
            className={`p-2.5 rounded-xl bg-surface-container-low font-mono text-xs flex items-center justify-between border-l-2 ${
              inc.risk === 'CRITICAL' ? 'border-error' : 'border-secondary'
            }`}
          >
            <div className="flex items-center gap-2 truncate">
              <span className={`font-bold ${inc.risk === 'CRITICAL' ? 'text-error' : 'text-secondary'}`}>
                {inc.timestamp instanceof Date ? inc.timestamp.toISOString().substring(11, 16) : ''} UTC
              </span>
              <span className="text-outline">•</span>
              <span className="text-on-surface truncate max-w-[220px] font-medium">
                {inc.title}
              </span>
            </div>
            <span
              className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                inc.risk === 'CRITICAL'
                  ? 'bg-error-container/40 text-error'
                  : 'bg-secondary-container/20 text-secondary'
              }`}
            >
              {inc.risk}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
