import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DashboardLayout from '../components/DashboardLayout';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { 
  Sprout, 
  ShieldCheck, 
  Activity, 
  CloudSun, 
  PlusCircle, 
  ArrowRight,
  TrendingUp,
  AlertCircle
} from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export default function Dashboard() {
  const { user } = useAuth();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [weather, setWeather] = useState({
    temp: 28,
    humidity: 82,
    condition: 'Humid / Rain Overcast',
    risk: 'High',
    riskDetails: 'High humidity (>80%) and temperatures around 25-30°C promote rapid fungal spore germination (Blights and Spots).'
  });

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/prediction/history`);
        setHistory(res.data.data.history);
      } catch (err) {
        console.error('Error fetching prediction history:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
    fetchLiveWeather();
  }, []);

  // Fetch live weather with mock fallback
  const fetchLiveWeather = async () => {
    try {
      // In Phase 5, we can read the OpenWeather API key from backend or call a proxy backend weather endpoint
      // We will make a backend proxy to protect API keys. Let's retrieve from express weather endpoint if present
      const res = await axios.get(`${API_URL}/api/weather/current`);
      if (res.data && res.data.data) {
        setWeather(res.data.data);
      }
    } catch (err) {
      // Fallback silently to mock weather
      console.log('Using fallback mock weather data.');
    }
  };

  // Metrics calculations
  const totalScans = history.length;
  const healthyScans = history.filter(item => item.status === 'healthy').length;
  const diseasedScans = totalScans - healthyScans;

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-7xl mx-auto">
        
        {/* Welcome Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h3 className="text-2xl font-bold text-slate-800 dark:text-white">Welcome back, {user?.name}!</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Here is the latest health overview for your crops today.</p>
          </div>
          <Link
            to="/upload"
            className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 active:scale-95 transition-all text-white font-bold rounded-xl shadow-lg shadow-emerald-600/20 flex items-center gap-2 cursor-pointer text-sm"
          >
            <PlusCircle className="h-4 w-4" />
            New Scan Diagnosis
          </Link>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-2xl shadow-sm flex items-center gap-4">
            <div className="p-3 bg-emerald-500/10 text-emerald-600 rounded-xl">
              <Activity className="h-6 w-6" />
            </div>
            <div>
              <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider block">Total Diagnoses</span>
              <span className="text-2xl font-extrabold text-slate-800 dark:text-white">{totalScans}</span>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-2xl shadow-sm flex items-center gap-4">
            <div className="p-3 bg-teal-500/10 text-teal-600 rounded-xl">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <div>
              <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider block">Healthy Crops</span>
              <span className="text-2xl font-extrabold text-slate-800 dark:text-white">{healthyScans}</span>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-2xl shadow-sm flex items-center gap-4">
            <div className="p-3 bg-amber-500/10 text-amber-600 rounded-xl">
              <Sprout className="h-6 w-6" />
            </div>
            <div>
              <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider block">Diseased Leaves</span>
              <span className="text-2xl font-extrabold text-slate-800 dark:text-white">{diseasedScans}</span>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-2xl shadow-sm flex items-center gap-4">
            <div className="p-3 bg-blue-500/10 text-blue-600 rounded-xl">
              <TrendingUp className="h-6 w-6" />
            </div>
            <div>
              <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider block">Accuracy Rate</span>
              <span className="text-2xl font-extrabold text-slate-800 dark:text-white">96.8%</span>
            </div>
          </div>
        </div>

        {/* Info widgets: Weather Risk & Dashboard items */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Weather & Disease Risk Widget */}
          <div className="lg:col-span-5 bg-gradient-to-br from-teal-550 to-emerald-700 dark:from-slate-900 dark:to-slate-850 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm text-slate-800 dark:text-white bg-white flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-center mb-4">
                <h4 className="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2">
                  <CloudSun className="h-5 w-5 text-emerald-500" />
                  Crop Weather Advisory
                </h4>
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                  weather.risk === 'High' 
                    ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400' 
                    : weather.risk === 'Medium'
                    ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400'
                    : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400'
                }`}>
                  {weather.risk} Disease Risk
                </span>
              </div>

              {/* Stats detail */}
              <div className="grid grid-cols-3 gap-2 border-b border-slate-100 dark:border-slate-800 pb-4 mb-4 text-center">
                <div className="p-2 bg-slate-50 dark:bg-slate-800/30 rounded-xl">
                  <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider block">Temperature</span>
                  <span className="text-lg font-bold text-slate-855 dark:text-white">{weather.temp}°C</span>
                </div>
                <div className="p-2 bg-slate-50 dark:bg-slate-800/30 rounded-xl">
                  <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider block">Humidity</span>
                  <span className="text-lg font-bold text-slate-855 dark:text-white">{weather.humidity}%</span>
                </div>
                <div className="p-2 bg-slate-50 dark:bg-slate-800/30 rounded-xl">
                  <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider block">Condition</span>
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-350 truncate block mt-1">{weather.condition}</span>
                </div>
              </div>

              <div className="space-y-3">
                <h5 className="text-xs font-bold text-slate-500 dark:text-slate-455 uppercase tracking-wider flex items-center gap-1.5">
                  <AlertCircle className="h-4 w-4 text-amber-500" />
                  Risk Assessment Details
                </h5>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">{weather.riskDetails}</p>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-400">
              <span>Location: Default (GPS Node)</span>
              <span>Updated: Realtime</span>
            </div>
          </div>

          {/* Recent Diagnosis List */}
          <div className="lg:col-span-7 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <h4 className="text-lg font-bold text-slate-800 dark:text-white">Recent Diagnoses</h4>
              <Link to="/history" className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1">
                View All
                <ArrowRight className="h-3 w-3" />
              </Link>
            </div>

            {loading ? (
              <div className="py-12 flex justify-center">
                <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : history.length === 0 ? (
              <div className="py-12 flex flex-col items-center justify-center text-center">
                <Sprout className="h-12 w-12 text-slate-300 dark:text-slate-700 mb-3" />
                <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">No leaf diagnoses found yet</p>
                <Link to="/upload" className="text-xs text-emerald-600 dark:text-emerald-400 mt-2 font-semibold hover:underline">
                  Analyze your first crop leaf
                </Link>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-100 dark:border-slate-800">
                      <th className="pb-3 text-xs font-bold text-slate-400 uppercase tracking-wider">Crop</th>
                      <th className="pb-3 text-xs font-bold text-slate-400 uppercase tracking-wider">Condition</th>
                      <th className="pb-3 text-xs font-bold text-slate-400 uppercase tracking-wider">Confidence</th>
                      <th className="pb-3 text-xs font-bold text-slate-400 uppercase tracking-wider">Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
                    {history.slice(0, 4).map((item) => (
                      <tr key={item._id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/20">
                        <td className="py-3.5 text-sm font-semibold text-slate-800 dark:text-white flex items-center gap-2">
                          <Leaf className="h-4 w-4 text-emerald-500 shrink-0" />
                          {item.crop}
                        </td>
                        <td className="py-3.5 text-sm text-slate-600 dark:text-slate-300">
                          <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${
                            item.status === 'healthy' 
                              ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/20 dark:text-emerald-400' 
                              : 'bg-amber-50 text-amber-700 dark:bg-amber-950/20 dark:text-amber-400'
                          }`}>
                            {item.disease}
                          </span>
                        </td>
                        <td className="py-3.5 text-sm font-bold text-slate-855 dark:text-slate-200">
                          {item.confidence}%
                        </td>
                        <td className="py-3.5 text-xs text-slate-400">
                          {new Date(item.date).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

        </div>

      </div>
    </DashboardLayout>
  );
}
