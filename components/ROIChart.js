import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

export default function ROIChart({ data }) {
  const { processedData, pieChartData, totalUniqueShops } = data;

  return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-xl font-semibold mb-2">新/老店铺占比变化-按照上月是否出现对应店铺</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={processedData}>
              <CartesianGrid strokeDasharray="3 3"/>
              <XAxis dataKey="month"/>
              <YAxis/>
              <Tooltip/>
              <Legend/>
              <Line type="monotone" dataKey="newShopsRatio" name="新店比例" stroke="#8884d8"/>
              <Line type="monotone" dataKey="oldShopsRatio" name="老店比例" stroke="#82ca9d"/>
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-xl font-semibold mb-2">新/老店铺占比变化-按照注册时间</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={processedData}>
              <CartesianGrid strokeDasharray="3 3"/>
              <XAxis dataKey="month"/>
              <YAxis/>
              <Tooltip/>
              <Legend/>
              <Line type="monotone" dataKey="newShopsRatioAccordingToRegisterTime" name="新店比例" stroke="#8884d8"/>
              <Line type="monotone" dataKey="oldShopsRatioAccordingToRegisterTime" name="老店比例" stroke="#82ca9d"/>
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-xl font-semibold mb-2">店铺运营状态占比</h2>
          <p className="text-sm text-gray-600 mb-2">总唯一店铺数：{totalUniqueShops}</p>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                  data={pieChartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({name, percent}) => `${name}: ${(percent * 100).toFixed(2)}%`}
              >
                {pieChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]}/>
                ))}
              </Pie>
              <Tooltip/>
              <Legend/>
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-white p-4 rounded shadow col-span-2">
          <h2 className="text-xl font-semibold mb-2">单店铺侵权数量变化</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={processedData}>
              <CartesianGrid strokeDasharray="3 3"/>
              <XAxis dataKey="month"/>
              <YAxis/>
              <Tooltip/>
              <Legend/>
              <Line type="monotone" dataKey="avgActiveCluesPerShop" name="单店铺侵权数量" stroke="#ff7300"/>
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
  );
}
