import React from 'react';
import { useAuth } from '../../hooks/useAuth';
import { Link } from 'react-router-dom';
import ProgressTimeline from '../../components/student/ProgressTimeline';
import { Flame, PenTool, Award, MessageSquare, CheckCircle } from 'lucide-react';
import DashboardLayout from '../../components/shared/DashboardLayout';

const StudentDashboard = () => {
  const { user } = useAuth();

  return (
    <DashboardLayout title="Student Dashboard">
      <div className="space-y-8">
        {/* Quick Actions */}
        <div className="flex justify-end">
          <Link 
            to="/student/log/new" 
            className="group relative inline-flex items-center gap-2 rounded-xl bg-brand-600 px-6 py-3 text-sm font-medium text-white shadow-[0_0_15px_rgba(37,99,235,0.3)] transition-all hover:bg-brand-500 hover:shadow-[0_0_25px_rgba(37,99,235,0.5)]"
          >
            <PenTool size={16} />
            Submit Progress Log
          </Link>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="glass rounded-2xl p-6 border border-white/5 shadow-xl flex items-center gap-4 hover:bg-white/[0.02] transition-colors">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-500/20 text-orange-400 border border-orange-500/30 shadow-[0_0_15px_rgba(249,115,22,0.2)]">
              <Flame size={20} />
            </div>
            <div>
              <p className="text-sm text-gray-400 font-medium">Streak</p>
              <p className="text-2xl font-bold text-white">3 wks</p>
            </div>
          </div>
          
          <div className="glass rounded-2xl p-6 border border-white/5 shadow-xl flex items-center gap-4 hover:bg-white/[0.02] transition-colors">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500/20 text-blue-400 border border-blue-500/30 shadow-[0_0_15px_rgba(59,130,246,0.2)]">
              <PenTool size={20} />
            </div>
            <div>
              <p className="text-sm text-gray-400 font-medium">Total Logs</p>
              <p className="text-2xl font-bold text-white">5</p>
            </div>
          </div>

          <div className="glass rounded-2xl p-6 border border-white/5 shadow-xl flex items-center gap-4 hover:bg-white/[0.02] transition-colors">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-500/20 text-purple-400 border border-purple-500/30 shadow-[0_0_15px_rgba(168,85,247,0.2)]">
              <Award size={20} />
            </div>
            <div>
              <p className="text-sm text-gray-400 font-medium">Badges</p>
              <p className="text-2xl font-bold text-white">2</p>
            </div>
          </div>

          <div className="glass rounded-2xl p-6 border border-white/5 shadow-xl flex items-center gap-4 hover:bg-white/[0.02] transition-colors">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-500/20 text-green-400 border border-green-500/30 shadow-[0_0_15px_rgba(34,197,94,0.2)]">
              <MessageSquare size={20} />
            </div>
            <div>
              <p className="text-sm text-gray-400 font-medium">Feedback</p>
              <p className="text-2xl font-bold text-white">1</p>
            </div>
          </div>
        </div>

        {/* Phase Bar */}
        <div className="glass rounded-2xl p-8 border border-white/5 shadow-xl">
          <h3 className="text-sm font-bold text-brand-400 uppercase tracking-widest mb-8">Project Progression</h3>
          <div className="flex items-center justify-between pt-2">
            {['Ideation', 'Design', 'Development', 'Testing', 'Final Review'].map((phase, i) => (
              <div key={phase} className="flex flex-col flex-1 items-center relative group">
                {/* Connecting Line */}
                {i !== 0 && (
                  <div className={`absolute w-[calc(100%-2rem)] h-1 right-[calc(50%+1rem)] top-4 -z-10 rounded-full ${i <= 1 ? 'bg-brand-500' : 'bg-white/10'}`} />
                )}
                
                {/* Node */}
                <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold shadow-lg transition-transform group-hover:scale-110 ${
                  i <= 1 
                    ? 'bg-brand-600 text-white border-2 border-brand-400 ring-4 ring-brand-500/20 shadow-[0_0_15px_rgba(37,99,235,0.5)]' 
                    : 'bg-dark-800 border-2 border-white/20 text-gray-500'
                }`}>
                  {i < 1 ? <CheckCircle size={16} /> : i + 1}
                </div>
                
                <span className={`text-xs mt-4 font-semibold tracking-wide ${i <= 1 ? 'text-brand-300' : 'text-gray-500'}`}>{phase}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Timeline */}
        <div className="glass py-8 px-4 lg:px-8 rounded-2xl border border-white/5 shadow-xl">
          <h2 className="text-xl font-bold text-white mb-6">Your Progress Timeline</h2>
          <ProgressTimeline />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default StudentDashboard;
