'use client'

import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Cell
} from 'recharts'

interface Props {
  data: { name: string; namaKetua: string; suara: number; percentage: string }[]
}

const COLORS = ['#2563eb', '#f97316', '#22c55e', '#a855f7', '#ec4899']

export default function StatsChart({ data }: Props) {
  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center h-48 text-slate-400 text-sm">
        Belum ada data suara
      </div>
    )
  }

  return (
    <ResponsiveContainer width="100%" height={220}>
      <BarChart data={data} barSize={40} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
        <XAxis
          dataKey="name"
          tick={{ fontSize: 12, fill: '#64748b' }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          tick={{ fontSize: 12, fill: '#64748b' }}
          axisLine={false}
          tickLine={false}
          allowDecimals={false}
        />
        <Tooltip
          contentStyle={{
            background: '#1e293b',
            border: 'none',
            borderRadius: '10px',
            color: '#f8fafc',
            fontSize: '13px',
          }}
          formatter={(value: number, _: string, props) => [
            `${value} suara (${props.payload?.percentage}%)`,
            props.payload?.namaKetua,
          ]}
          cursor={{ fill: '#f1f5f9', radius: 8 }}
        />
        <Bar dataKey="suara" radius={[6, 6, 0, 0]}>
          {data.map((_, i) => (
            <Cell key={i} fill={COLORS[i % COLORS.length]} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  )
}
