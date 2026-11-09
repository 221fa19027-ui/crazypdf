import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api, type DashboardData } from '../services/api';
import { 
  FileText, Shield, Clock, HardDrive, Sparkles, LogOut, 
  ArrowRight, CheckCircle2, AlertCircle, Trash2, Zap, ArrowUpRight 
} from 'lucide-react';

export const Dashboard: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    const fetchDashboard = async () => {
      try {
        const res = await api.getDashboard();
        setData(res);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, [isAuthenticated, navigate]);

  if (loading || !data) {
    return (
      <div className="max-w-5xl mx-auto py-20 text-center">
        <div className="w-8 h-8 mx-auto border-2 border-brand-600 border-t-transparent rounded-full animate-spin" />
        <p className="mt-3 text-xs text-slate-500">Loading your CrazyPDF dashboard...</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Welcome Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-8 rounded-3xl bg-gradient-to-tr from-brand-900 via-slate-900 to-brand-950 text-white shadow-xl">
        <div className="flex items-center gap-4">
          {data.profile.profile_picture ? (
            <img
              src={data.profile.profile_picture}
              alt={data.profile.name}
              className="w-16 h-16 rounded-2xl border-2 border-brand-400 shadow-md"
            />
          ) : (
            <div className="w-16 h-16 rounded-2xl bg-brand-600 text-white font-extrabold text-2xl flex items-center justify-center">
              {data.profile.name.charAt(0)}
            </div>
          )}
          <div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
              Welcome back, {data.profile.name.split(' ')[0]}!
            </h1>
            <p className="text-xs text-slate-300">
              {data.profile.email} • Member since {data.profile.joined_date}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/tools"
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-white text-slate-900 font-bold text-xs shadow hover:bg-slate-100 transition-colors"
          >
            <Zap className="w-4 h-4 text-brand-600" />
            <span>Process New PDF</span>
          </Link>
          <button
            onClick={() => {
              logout();
              navigate('/');
            }}
            className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors"
            title="Log out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold">Processed Documents</span>
            <FileText className="w-4 h-4 text-brand-600" />
          </div>
          <p className="text-3xl font-black text-slate-900 dark:text-white">
            {data.stats.total_documents_processed}
          </p>
          <p className="text-[11px] text-slate-400">Total jobs executed</p>
        </div>

        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold">Data Handled</span>
            <HardDrive className="w-4 h-4 text-electric-500" />
          </div>
          <p className="text-3xl font-black text-slate-900 dark:text-white">
            {data.stats.total_megabytes_processed} MB
          </p>
          <p className="text-[11px] text-slate-400">Ephemeral throughput</p>
        </div>

        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold">Storage Policy</span>
            <Shield className="w-4 h-4 text-emerald-500" />
          </div>
          <p className="text-xl font-black text-emerald-600 dark:text-emerald-400">
            Zero Storage
          </p>
          <p className="text-[11px] text-slate-400">Files destroyed after 60 min</p>
        </div>

        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold">Account Plan</span>
            <Sparkles className="w-4 h-4 text-purple-500" />
          </div>
          <p className="text-xl font-black text-slate-900 dark:text-white">
            CrazyPDF Free
          </p>
          <p className="text-[11px] text-brand-600 dark:text-electric-400 font-semibold">Standard limits</p>
        </div>
      </div>

      {/* Privacy-Conscious History */}
      <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-4">
          <div>
            <h3 className="font-extrabold text-lg text-slate-900 dark:text-white">Privacy-Conscious Activity History</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Metadata logs only. Actual document files are automatically shredded and never stored permanently.
            </p>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-3 py-1 rounded-full border border-emerald-200">
            <Trash2 className="w-3.5 h-3.5" />
            <span>Files Auto-Deleted</span>
          </div>
        </div>

        {data.recent_history.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 uppercase tracking-wider">
                  <th className="py-3 px-2 font-semibold">Tool</th>
                  <th className="py-3 px-2 font-semibold">Date</th>
                  <th className="py-3 px-2 font-semibold">Input Size</th>
                  <th className="py-3 px-2 font-semibold">Duration</th>
                  <th className="py-3 px-2 font-semibold">Status</th>
                  <th className="py-3 px-2 font-semibold text-right">File Storage</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-medium">
                {data.recent_history.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="py-3.5 px-2 font-bold text-slate-900 dark:text-white">
                      <Link to={`/tools/${item.tool_name}`} className="hover:text-brand-600 transition-colors">
                        {item.tool_name}
                      </Link>
                    </td>
                    <td className="py-3.5 px-2 text-slate-500">
                      {new Date(item.created_at).toLocaleDateString()} {new Date(item.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </td>
                    <td className="py-3.5 px-2 text-slate-500">
                      {(item.input_file_size / 1024).toFixed(1)} KB
                    </td>
                    <td className="py-3.5 px-2 text-slate-500">
                      {item.processing_time}s
                    </td>
                    <td className="py-3.5 px-2">
                      <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Completed
                      </span>
                    </td>
                    <td className="py-3.5 px-2 text-right text-slate-400 italic">
                      Purged (60m policy)
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-12 space-y-2">
            <FileText className="w-10 h-10 mx-auto text-slate-300" />
            <p className="font-bold text-sm text-slate-700 dark:text-slate-300">No documents processed yet</p>
            <p className="text-xs text-slate-500">Choose any tool to convert, compress, or edit your first PDF.</p>
            <Link
              to="/tools"
              className="inline-block mt-2 px-4 py-2 rounded-xl bg-brand-600 text-white font-bold text-xs"
            >
              Browse Tools
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};
