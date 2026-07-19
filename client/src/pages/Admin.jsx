import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DashboardLayout from '../components/DashboardLayout';
import { 
  Users, 
  BarChart as BarIcon, 
  FileText, 
  PieChart as PieIcon, 
  ShieldCheck, 
  Activity,
  Layers
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export default function Admin() {
  const [globalHistory, setGlobalHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [usersList, setUsersList] = useState([
    { name: 'Farmer John', email: 'john@agrivision.com', role: 'farmer', date: '2026-07-16' },
    { name: 'Dr. Ramesh Kumar', email: 'ramesh@agrivision.com', role: 'expert', date: '2026-07-15' },
    { name: 'System Admin', email: 'admin@agrivision.com', role: 'admin', date: '2026-07-14' }
  ]);

  useEffect(() => {
    fetchGlobalHistory();
  }, []);

  const fetchGlobalHistory = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_URL}/api/prediction/global-history`);
      setGlobalHistory(res.data.data.history);
    } catch (err) {
      console.error('Error fetching global history:', err);
    } finally {
      setLoading(false);
    }
  };

  // 1. Process Crop Share (Pie Chart data)
  const cropCounts = globalHistory.reduce((acc, curr) => {
    acc[curr.crop] = (acc[curr.crop] || 0) + 1;
    return acc;
  }, {});

  const pieData = Object.keys(cropCounts).map((key) => ({
    name: key,
    value: cropCounts[key]
  }));

  // Fallback data if history is empty
  const defaultPieData = [
    { name: 'Tomato', value: 12 },
    { name: 'Potato', value: 8 },
    { name: 'Rice', value: 15 }
  ];

  const chartPieData = pieData.length > 0 ? pieData : defaultPieData;
  const COLORS = ['#10b981', '#06b6d4', '#f59e0b', '#3b82f6'];

  // 2. Process Disease Status (Bar Chart data)
  const diseaseCounts = globalHistory.reduce((acc, curr) => {
    const key = curr.disease === 'Healthy' ? 'Healthy' : 'Diseased';
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});

  const barData = [
    { name: 'Healthy', Count: diseaseCounts['Healthy'] || 0 },
    { name: 'Diseased', Count: diseaseCounts['Diseased'] || 0 }
  ];

  const defaultBarData = [
    { name: 'Healthy', Count: 14 },
    { name: 'Diseased', Count: 21 }
  ];

  const chartBarData = (diseaseCounts['Healthy'] || diseaseCounts['Diseased']) ? barData : defaultBarData;

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-7xl mx-auto">
        
        {/* Top Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-2xl shadow-sm flex items-center gap-4">
            <div className="p-3 bg-emerald-500/10 text-emerald-600 rounded-xl">
              <Layers className="h-6 w-6" />
            </div>
            <div>
              <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider block">Global Diagnoses</span>
              <span className="text-2xl font-extrabold text-slate-800 dark:text-white">
                {globalHistory.length > 0 ? globalHistory.length : 35}
              </span>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-2xl shadow-sm flex items-center gap-4">
            <div className="p-3 bg-blue-500/10 text-blue-600 rounded-xl">
              <Users className="h-6 w-6" />
            </div>
            <div>
              <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider block">Total Users</span>
              <span className="text-2xl font-extrabold text-slate-800 dark:text-white">{usersList.length}</span>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-2xl shadow-sm flex items-center gap-4">
            <div className="p-3 bg-amber-500/10 text-amber-600 rounded-xl">
              <Activity className="h-6 w-6" />
            </div>
            <div>
              <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider block">Avg Confidence</span>
              <span className="text-2xl font-extrabold text-slate-800 dark:text-white">93.4%</span>
            </div>
          </div>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Crop Share Chart */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl shadow-sm">
            <h4 className="text-base font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
              <PieIcon className="h-5 w-5 text-emerald-500" />
              Crop Distribution
            </h4>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartPieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {chartPieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Disease Prevalence Chart */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl shadow-sm">
            <h4 className="text-base font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
              <BarIcon className="h-5 w-5 text-emerald-500" />
              Leaf Condition Share
            </h4>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartBarData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} />
                  <YAxis axisLine={false} tickLine={false} />
                  <Tooltip />
                  <Bar dataKey="Count" fill="#10b981" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Global Activity Log */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl shadow-sm">
          <h4 className="text-base font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
            <FileText className="h-5 w-5 text-emerald-500" />
            System Global Activity
          </h4>

          {loading ? (
            <div className="py-8 flex justify-center">
              <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : globalHistory.length === 0 ? (
            <div className="py-6 text-center text-sm text-slate-400">
              No global scan activities logged. Showing mock stats.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 dark:border-slate-800">
                    <th className="pb-3 text-xs font-bold text-slate-400 uppercase">User</th>
                    <th className="pb-3 text-xs font-bold text-slate-400 uppercase">Crop</th>
                    <th className="pb-3 text-xs font-bold text-slate-400 uppercase">Condition</th>
                    <th className="pb-3 text-xs font-bold text-slate-400 uppercase">Confidence</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
                  {globalHistory.slice(0, 5).map((item) => (
                    <tr key={item._id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/10">
                      <td className="py-3 text-sm text-slate-800 dark:text-slate-200">
                        {item.userId?.name || 'Local User'}
                      </td>
                      <td className="py-3 text-sm text-slate-655 dark:text-white font-semibold">
                        {item.crop}
                      </td>
                      <td className="py-3 text-sm text-slate-600 dark:text-slate-350">
                        {item.disease}
                      </td>
                      <td className="py-3 text-sm font-bold text-emerald-600">
                        {item.confidence}%
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </div>
    </DashboardLayout>
  );
}
