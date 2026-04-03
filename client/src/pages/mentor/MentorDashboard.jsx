import React, { useState, useEffect } from 'react';
import axiosInstance from '../../api/axiosInstance';
import toast from 'react-hot-toast';
import { format } from 'date-fns';
import { Users, FileText, CheckCircle, Clock, AlertCircle, MessageSquare } from 'lucide-react';
import DashboardLayout from '../../components/shared/DashboardLayout';
import PlagiarismResultCard from '../../components/mentor/PlagiarismResultCard';

const MentorDashboard = () => {
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Feedback form state
  const [reviewingLog, setReviewingLog] = useState(null);
  const [feedbackState, setFeedbackState] = useState({ comment: '', rating: 3, status: 'approved', commend: false });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const res = await axiosInstance.get('/mentor/students');
        setStudents(res.data);
      } catch (error) {
        toast.error('Failed to load assigned students');
      } finally {
        setLoading(false);
      }
    };
    fetchStudents();
  }, []);

  const selectStudent = async (student) => {
    setSelectedStudent(student);
    setReviewingLog(null);
    try {
      const res = await axiosInstance.get(`/mentor/students/${student.studentId._id}/logs`);
      setLogs(res.data);
    } catch (error) {
      toast.error('Failed to load logs');
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await axiosInstance.post(`/mentor/logs/${reviewingLog._id}/review`, feedbackState);
      toast.success('Review submitted successfully');
      setReviewingLog(null);
      // Refresh logs
      selectStudent(selectedStudent);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Review failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'submitted': return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
      case 'approved': return 'bg-green-500/10 text-green-400 border-green-500/20';
      case 'revision_requested': return 'bg-red-500/10 text-red-400 border-red-500/20';
      case 'reviewed': return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
      default: return 'bg-white/5 text-gray-300 border-white/10';
    }
  };

  return (
    <DashboardLayout title="Mentor Portal">
      <div className="space-y-6">
        {loading ? (
          <div className="flex h-64 items-center justify-center">
            <span className="flex items-center gap-2 text-brand-400 font-medium">
              <span className="h-5 w-5 rounded-full border-2 border-brand-400/20 border-t-brand-400 animate-spin"></span>
              Loading assignments...
            </span>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            
            {/* Student Sidebar */}
            <div className="glass rounded-2xl border border-white/5 shadow-2xl flex flex-col h-[calc(100vh-12rem)] lg:sticky lg:top-24 overflow-hidden">
              <div className="p-5 border-b border-white/5 bg-white/5 flex items-center gap-3">
                <div className="p-2 rounded-lg bg-brand-500/20 text-brand-400 border border-brand-500/30">
                  <Users size={18} />
                </div>
                <h2 className="font-bold text-white">My Students</h2>
              </div>
              <div className="overflow-y-auto flex-1 p-3 space-y-2">
                {students.map(assignment => (
                  <button
                    key={assignment._id}
                    onClick={() => selectStudent(assignment)}
                    className={`w-full text-left p-3 rounded-xl transition-all duration-300 ${
                      selectedStudent?._id === assignment._id 
                        ? 'bg-brand-600/20 border border-brand-500/30 text-white shadow-[0_0_15px_rgba(37,99,235,0.2)]' 
                        : 'bg-white/5 hover:bg-white/10 border border-transparent text-gray-300'
                    }`}
                  >
                    <p className="font-medium truncate">
                      {assignment.studentId?.name || 'Unknown Student'}
                    </p>
                    <p className={`text-xs truncate mt-1 ${selectedStudent?._id === assignment._id ? 'text-brand-300' : 'text-gray-500'}`}>
                      {assignment.projectId?.title || 'No Project'}
                    </p>
                  </button>
                ))}
                {students.length === 0 && <p className="p-6 text-center text-sm text-gray-500">No students assigned yet.</p>}
              </div>
            </div>

            {/* Main Content Area */}
            <div className="lg:col-span-3 space-y-6">
              {!selectedStudent ? (
                <div className="glass rounded-2xl border border-white/5 p-16 text-center flex flex-col items-center shadow-xl">
                  <div className="h-20 w-20 rounded-full bg-white/5 flex items-center justify-center border border-white/5 mb-6">
                    <Users className="h-10 w-10 text-gray-500" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">Select a Student</h3>
                  <p className="text-gray-400 max-w-sm">Choose a student from the sidebar to view their progress logs and submit reviews.</p>
                </div>
              ) : (
                <>
                  <div className="glass rounded-2xl border border-white/5 p-6 shadow-xl flex items-center gap-4">
                    <div className="h-12 w-12 rounded-full bg-brand-600/20 flex items-center justify-center text-brand-400 font-bold border border-brand-500/30 text-lg shadow-[0_0_15px_rgba(59,130,246,0.3)]">
                      {selectedStudent.studentId?.name?.charAt(0) || 'U'}
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-white">{selectedStudent.studentId?.name || 'Unknown Student'}'s Logs</h2>
                      <p className="text-sm text-brand-300 mt-1">Project: {selectedStudent.projectId?.title || 'No Project'}</p>
                    </div>
                  </div>

                  {reviewingLog ? (
                    <div className="glass rounded-2xl border border-white/5 p-6 shadow-2xl">
                      <div className="flex justify-between items-center mb-6 pb-4 border-b border-white/5">
                        <h3 className="text-xl font-bold text-white flex items-center gap-3">
                          <div className="p-2 bg-brand-500/20 text-brand-400 rounded-lg border border-brand-500/30">
                            <MessageSquare size={18} />
                          </div>
                          Reviewing Week {reviewingLog.weekNumber}
                        </h3>
                        <button onClick={() => setReviewingLog(null)} className="text-sm text-gray-400 hover:text-white transition-colors">Cancel</button>
                      </div>

                      <div className="bg-dark-800/60 p-5 rounded-xl border border-white/5 mb-6">
                        <h4 className="font-bold text-white text-lg">{reviewingLog.title}</h4>
                        <p className="text-gray-300 mt-3 leading-relaxed">{reviewingLog.workDone}</p>
                        {reviewingLog.challenges && (
                          <div className="mt-4 p-4 bg-red-500/10 text-red-200 text-sm rounded-lg border border-red-500/20">
                            <strong className="text-red-400">Challenges:</strong> {reviewingLog.challenges}
                          </div>
                        )}
                      </div>

                      {(() => {
                        const repoUrl = reviewingLog.evidenceLinks?.find(link => link.includes('github.com'));
                        if (repoUrl) {
                          return (
                            <PlagiarismResultCard
                              logId={reviewingLog._id}
                              repoUrl={repoUrl}
                              onFlagLog={(verdict) => {
                                setFeedbackState({...feedbackState, status: 'revision_requested'});
                              }}
                            />
                          );
                        } else {
                          return (
                            <div style={{
                              padding: '10px 14px',
                              background: 'var(--color-background-secondary)',
                              borderRadius: '8px',
                              fontSize: '12px',
                              color: 'var(--color-text-secondary)',
                              marginTop: '12px',
                              border: '0.5px solid var(--color-border-tertiary)',
                              marginBottom: '24px'
                            }}>
                              No GitHub repository URL found in this log. Ask the student to include their repo link in evidence links.
                            </div>
                          );
                        }
                      })()}

                      <form onSubmit={handleReviewSubmit} className="space-y-6 mt-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">Status Action</label>
                            <select 
                              className="w-full bg-dark-800/50 border border-white/10 text-white rounded-xl p-3 text-sm focus:ring-2 focus:ring-brand-500 outline-none cursor-pointer"
                              value={feedbackState.status}
                              onChange={e => setFeedbackState({...feedbackState, status: e.target.value})}
                            >
                              <option value="approved" className="bg-dark-900">Approve Progress</option>
                              <option value="revision_requested" className="bg-dark-900">Request Revision</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">Rating (1-5)</label>
                            <input 
                              type="number" min="1" max="5" required
                              className="w-full bg-dark-800/50 border border-white/10 text-white rounded-xl p-3 text-sm focus:ring-2 focus:ring-brand-500 outline-none"
                              value={feedbackState.rating}
                              onChange={e => setFeedbackState({...feedbackState, rating: parseInt(e.target.value, 10)})}
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">Feedback Comments</label>
                          <textarea 
                            required rows={4}
                            className="w-full bg-dark-800/50 border border-white/10 text-white rounded-xl p-3 text-sm focus:ring-2 focus:ring-brand-500 outline-none resize-none placeholder-gray-500"
                            placeholder="Provide constructive feedback..."
                            value={feedbackState.comment}
                            onChange={e => setFeedbackState({...feedbackState, comment: e.target.value})}
                          />
                        </div>

                        <div className="flex items-center gap-3 bg-brand-600/10 p-4 rounded-xl border border-brand-500/20">
                          <input 
                            type="checkbox" id="commend" className="w-5 h-5 accent-brand-500 rounded cursor-pointer"
                            checked={feedbackState.commend}
                            onChange={e => setFeedbackState({...feedbackState, commend: e.target.checked})}
                          />
                          <label htmlFor="commend" className="text-sm text-brand-300 font-medium cursor-pointer">
                            Commend this log (Awards a stellar badge to the student)
                          </label>
                        </div>

                        <div className="pt-2">
                          <button 
                            type="submit" disabled={isSubmitting}
                            className="w-full sm:w-auto bg-brand-600 px-8 py-3 rounded-xl text-sm font-medium text-white hover:bg-brand-500 transition-all duration-300 disabled:opacity-50 hover:shadow-[0_0_20px_rgba(37,99,235,0.4)] disabled:hover:shadow-none"
                          >
                            {isSubmitting ? (
                              <span className="flex items-center justify-center gap-2">
                                <span className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin"></span>
                                Submitting...
                              </span>
                            ) : 'Submit Review'}
                          </button>
                        </div>
                      </form>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {logs.length === 0 ? (
                        <div className="glass rounded-2xl border border-white/5 p-12 text-center text-gray-400">
                          This student hasn't submitted any logs yet.
                        </div>
                      ) : (
                        logs.map((log, idx) => (
                          <div key={log._id} className="glass p-6 rounded-2xl border border-white/5 hover:border-brand-500/30 transition-all duration-300 hover:shadow-[0_8px_30px_rgba(0,0,0,0.5)]">
                            <div className="flex justify-between items-start mb-4">
                              <div>
                                <h3 className="text-lg font-bold text-white">Week {log.weekNumber}: {log.title}</h3>
                                <time className="text-xs text-gray-400 flex items-center gap-1.5 mt-1.5">
                                  <Clock size={12} className="text-brand-400" /> Submitted {format(new Date(log.submittedAt || log.createdAt), 'MMM d, yyyy')}
                                </time>
                              </div>
                              <span className={`px-3 py-1.5 rounded-lg text-xs font-semibold border ${getStatusColor(log.status)} capitalize tracking-wide`}>
                                {log.status.replace('_', ' ')}
                              </span>
                            </div>
                            
                            <p className="text-sm text-gray-300 line-clamp-2 mb-6 leading-relaxed">{log.workDone}</p>
                            
                            {log.status === 'submitted' || log.status === 'revision_requested' ? (
                              <button 
                                onClick={() => setReviewingLog(log)}
                                className="text-sm font-medium text-white bg-brand-600 hover:bg-brand-500 px-5 py-2.5 rounded-xl transition-all duration-300 shadow-[0_0_15px_rgba(37,99,235,0.2)]"
                              >
                                Review Log
                              </button>
                            ) : (
                              <div className="inline-flex items-center text-sm font-medium text-green-400 bg-green-500/10 px-4 py-2 rounded-xl border border-green-500/20">
                                <CheckCircle size={16} className="mr-2" /> Reviewed
                              </div>
                            )}
                          </div>
                        ))
                      )}
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default MentorDashboard;
