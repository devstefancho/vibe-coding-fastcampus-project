'use client';

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { MonthSummary } from '@/types/budget';

interface MonthlyTrendChartProps {
  data: MonthSummary[];
}

export default function MonthlyTrendChart({ data }: MonthlyTrendChartProps) {
  const formatCurrency = (value: number) => {
    return `${(value / 10000).toFixed(0)}만원`;
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">월별 수입/지출 트렌드</h3>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis
              dataKey="month"
              stroke="#6b7280"
              fontSize={12}
            />
            <YAxis
              stroke="#6b7280"
              fontSize={12}
              tickFormatter={formatCurrency}
            />
            <Tooltip
              formatter={(value: number) => [formatCurrency(value), '']}
              labelStyle={{ color: '#374151' }}
              contentStyle={{
                backgroundColor: 'white',
                border: '1px solid #e5e7eb',
                borderRadius: '8px'
              }}
            />
            <Legend />
            <Line
              type="monotone"
              dataKey="income"
              stroke="#10b981"
              strokeWidth={2}
              name="수입"
              dot={{ r: 4 }}
            />
            <Line
              type="monotone"
              dataKey="expense"
              stroke="#f59e0b"
              strokeWidth={2}
              name="지출"
              dot={{ r: 4 }}
            />
            <Line
              type="monotone"
              dataKey="net"
              stroke="#3b82f6"
              strokeWidth={2}
              name="순익"
              dot={{ r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}