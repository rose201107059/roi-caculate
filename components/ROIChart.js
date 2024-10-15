import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const COLORS = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A'];

export default function ROIChart({ data }) {
  const { totalShops, shopStatusData, top10Shops } = data;

  return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white p-4 rounded shadow col-span-2">
          <h2 className="text-xl font-semibold mb-2">店铺状态分布</h2>
          <p className="text-sm text-gray-600 mb-2">总店铺数：{totalShops}</p>
          <ResponsiveContainer width="100%" height={400}>
            <PieChart>
              <Pie
                  data={shopStatusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={150}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(2)}%`}
              >
                {shopStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-white p-4 rounded shadow col-span-2">
          <h2 className="text-xl font-semibold mb-2">Top 10 侵权店铺</h2>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={top10Shops}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="shopName" />
              <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
              <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
              <Tooltip />
              <Legend />
              <Bar yAxisId="left" dataKey="totalClues" name="侵权线索量" fill="#8884d8" />
              <Bar yAxisId="left" dataKey="downClues" name="下架线索量" fill="#82ca9d" />
              <Bar yAxisId="right" dataKey="processingRate" name="线索处理率" fill="#ff7300" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
  );
}