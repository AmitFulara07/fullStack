import React from 'react';
import { BookOpen } from 'lucide-react';
import DashboardLayout from '../../components/shared/DashboardLayout';

const FacultyDashboard = () => {

  return (
    <DashboardLayout title="Faculty Dashboard">
      <div className="space-y-6">
        <div className="glass rounded-2xl border border-white/5 p-16 shadow-2xl flex flex-col items-center justify-center text-center">
          <div className="h-20 w-20 rounded-full bg-brand-500/10 flex items-center justify-center text-brand-400 border border-brand-500/20 mb-6 shadow-[0_0_20px_rgba(59,130,246,0.3)]">
            <BookOpen className="h-10 w-10 text-brand-400" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Faculty Features Coming Soon</h2>
          <p className="text-gray-400 max-w-md">Faculty-specific project management and oversight features will be implemented in later development phases.</p>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default FacultyDashboard;
