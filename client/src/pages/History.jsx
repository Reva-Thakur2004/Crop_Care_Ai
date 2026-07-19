import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DashboardLayout from '../components/DashboardLayout';
import { 
  Search, 
  Filter, 
  Calendar, 
  Download, 
  Trash2, 
  Leaf, 
  CheckCircle,
  FileText
} from 'lucide-react';
import { jsPDF } from 'jspdf';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export default function History() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [cropFilter, setCropFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_URL}/api/prediction/history`);
      setHistory(res.data.data.history);
    } catch (err) {
      console.error('Error fetching prediction history:', err);
    } finally {
      setLoading(false);
    }
  };

  // Filtered list
  const filteredHistory = history.filter((item) => {
    const matchesSearch = 
      item.crop.toLowerCase().includes(search.toLowerCase()) ||
      item.disease.toLowerCase().includes(search.toLowerCase());
    
    const matchesCrop = cropFilter === 'All' || item.crop === cropFilter;
    const matchesStatus = statusFilter === 'All' || item.status === statusFilter;

    return matchesSearch && matchesCrop && matchesStatus;
  });

  // Re-generate report for history entries (standard jsPDF build)
  const downloadReport = (item) => {
    const doc = new jsPDF();
    doc.setFillColor(15, 118, 110);
    doc.rect(0, 0, 210, 40, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(22);
    doc.text("AgriVision AI - Diagnosis Report", 15, 25);
    
    doc.setTextColor(200, 200, 200);
    doc.setFontSize(10);
    doc.text(`Generated: ${new Date(item.date).toLocaleDateString()}`, 150, 25);
    
    doc.setTextColor(30, 41, 59);
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("Diagnosis Results Summary", 15, 55);
    doc.line(15, 57, 195, 57);
    
    doc.setFont("helvetica", "normal");
    doc.setFontSize(12);
    doc.text(`Target Crop: ${item.crop}`, 15, 68);
    doc.text(`Condition Identified: ${item.disease}`, 15, 76);
    doc.text(`Diagnosis Confidence: ${item.confidence}%`, 15, 84);
    doc.text(`Condition Status: ${item.status}`, 15, 92);
    
    doc.setFontSize(10);
    doc.setTextColor(150, 150, 150);
    doc.text("Report compiled by AgriVision AI. Consult an agricultural expert for final review.", 15, 280);
    
    doc.save(`AgriVision_Report_${item.crop}_${item.disease.replace(/\s+/g, '_')}.pdf`);
  };

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Filter Toolbar Card */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Search box */}
          <div className="relative w-full md:w-80">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
              <Search className="h-4.5 w-4.5" />
            </span>
            <input
              type="text"
              placeholder="Search by crop or disease..."
              className="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {/* Select Dropdowns */}
          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            <div className="flex items-center gap-1.5 text-xs text-slate-400 font-semibold uppercase">
              <Filter className="h-4 w-4" />
              <span>Filters</span>
            </div>

            <select
              className="px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-700 dark:text-slate-200 cursor-pointer"
              value={cropFilter}
              onChange={(e) => setCropFilter(e.target.value)}
            >
              <option value="All">All Crops</option>
              <option value="Tomato">Tomato</option>
              <option value="Potato">Potato</option>
              <option value="Rice">Rice</option>
            </select>

            <select
              className="px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-700 dark:text-slate-200 cursor-pointer"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="All">All Statuses</option>
              <option value="healthy">Healthy</option>
              <option value="diseased">Diseased</option>
            </select>
          </div>
        </div>

        {/* History Results */}
        {loading ? (
          <div className="py-24 flex justify-center">
            <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : filteredHistory.length === 0 ? (
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-12 text-center shadow-sm">
            <Leaf className="h-14 w-14 text-slate-350 dark:text-slate-700 mx-auto mb-4" />
            <h4 className="text-lg font-bold text-slate-855 dark:text-white">No diagnoses fit this filter</h4>
            <p className="text-xs text-slate-400 mt-1">Try resetting the dropdowns or uploading a new leaf leaf for analysis.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 animate-fade-in">
            {filteredHistory.map((item) => (
              <div 
                key={item._id}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
              >
                {/* Photo Previews */}
                <div className="bg-slate-100 dark:bg-slate-950 h-44 w-full relative flex items-center justify-center overflow-hidden">
                  {item.imageUrl ? (
                    <img 
                      src={`${API_URL}${item.imageUrl}`} 
                      alt="Crop leaf diagnostic upload" 
                      className="h-full w-full object-cover"
                      onError={(e) => {
                        // Fallback image source if static file unavailable
                        e.target.onerror = null;
                        e.target.src = 'https://images.unsplash.com/photo-1592417817098-8f3d6eb19675?auto=format&fit=crop&q=80&w=400';
                      }}
                    />
                  ) : (
                    <Leaf className="h-10 w-10 text-slate-300" />
                  )}
                  {/* Status Badge */}
                  <span className={`absolute top-3 right-3 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                    item.status === 'healthy' 
                      ? 'bg-emerald-500 text-white' 
                      : 'bg-amber-500 text-white'
                  }`}>
                    {item.status}
                  </span>
                </div>

                {/* Details Section */}
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start gap-2">
                      <h5 className="font-bold text-slate-800 dark:text-white truncate text-base">{item.crop}</h5>
                      <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 shrink-0">{item.confidence}% Match</span>
                    </div>
                    
                    <p className="text-sm font-semibold text-slate-500 dark:text-slate-400 mt-1 truncate">
                      {item.status === 'healthy' ? 'Crop Healthy' : item.disease}
                    </p>

                    <div className="mt-4 flex items-center gap-1.5 text-xs text-slate-400">
                      <Calendar className="h-4 w-4 shrink-0" />
                      <span>{new Date(item.date).toLocaleDateString()}</span>
                    </div>
                  </div>

                  <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800/80 flex items-center gap-2">
                    <button
                      onClick={() => downloadReport(item)}
                      className="flex-1 py-2 bg-slate-50 hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer border border-slate-200 dark:border-slate-700"
                    >
                      <Download className="h-3.5 w-3.5" />
                      PDF Report
                    </button>
                  </div>
                </div>

              </div>
            ))}
          </div>
        )}

      </div>
    </DashboardLayout>
  );
}
