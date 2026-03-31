import React, { useEffect, useState } from 'react';
import axiosInstance from '../../api/axiosInstance';
import { format } from 'date-fns';
import { CheckCircle, Clock, FileText, AlertCircle, MessageSquare, Star, Award } from 'lucide-react';

const ProgressTimeline = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFeedback, setActiveFeedback] = useState(null); // logId being viewed
  const [feedbackData, setFeedbackData] = useState(null);
  const [feedbackLoading, setFeedbackLoading] = useState(false);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const res = await axiosInstance.get('/logs/my');
        setLogs(res.data);
      } catch (error) {
        console.error('Failed to fetch logs', error);
      } finally {
        setLoading(false);
      }
    };
    fetchLogs();
  }, []);

  const viewFeedback = async (logId) => {
    if (activeFeedback === logId) {
      setActiveFeedback(null);
      return;
    }
    setActiveFeedback(logId);
    setFeedbackLoading(true);
    try {
      const res = await axiosInstance.get(`/logs/${logId}/feedback`);
      // Assuming the most recent feedback is the last one or we just take the first
      if (res.data && res.data.length > 0) {
        setFeedbackData(res.data[res.data.length - 1]);
      } else {
        setFeedbackData(null);
      }
    } catch (error) {
      console.error('Failed to load feedback');
    } finally {
      setFeedbackLoading(false);
    }
  };

  const getStatusConfig = (status) => {
    switch (status) {
      case 'approved': return { color: 'bg-green-500', text: 'text-green-700', bg: 'bg-green-50', icon: <CheckCircle size={16} /> };
      case 'reviewed': return { color: 'bg-amber-500', text: 'text-amber-700', bg: 'bg-amber-50', icon: <MessageSquare size={16} /> };
      case 'submitted': return { color: 'bg-blue-500', text: 'text-blue-700', bg: 'bg-blue-50', icon: <Clock size={16} /> };
      case 'revision_requested': return { color: 'bg-red-500', text: 'text-red-700', bg: 'bg-red-50', icon: <AlertCircle size={16} /> };
      default: return { color: 'bg-gray-400', text: 'text-gray-700', bg: 'bg-gray-50', icon: <FileText size={16} /> }; // draft
    }
  };

  if (loading) return <div className="py-8 text-center text-gray-500 animate-pulse">Loading timeline...</div>;

  if (logs.length === 0) {
    return (
      <div className="py-12 border-2 border-dashed border-gray-200 rounded-xl text-center">
        <FileText className="mx-auto h-12 w-12 text-gray-400 mb-3" />
        <h3 className="text-lg font-medium text-gray-900">No logs yet</h3>
        <p className="mt-1 text-gray-500">Submit your first progress log to start your timeline.</p>
      </div>
    );
  }

  return (
    <div className="relative border-l-2 border-indigo-100 ml-4 py-4 space-y-8">
      {logs.map((log) => {
        const config = getStatusConfig(log.status);
        
        return (
          <div key={log._id} className="relative pl-8">
            <span className={`absolute -left-2.5 top-1 h-5 w-5 rounded-full flex items-center justify-center ring-4 ring-white ${config.color} text-white`}>
              {config.icon}
            </span>
            
            <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="flex flex-wrap items-center justify-between mb-2 gap-4">
                <div className="flex flex-col">
                  <h4 className="text-lg font-bold text-gray-900">Week {log.weekNumber}: {log.title}</h4>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold flex items-center gap-1 ${config.bg} ${config.text}`}>
                      <span className="capitalize">{log.status.replace('_', ' ')}</span>
                    </span>
                    {log.submittedAt && (
                      <time className="text-sm text-gray-500">
                        • {format(new Date(log.submittedAt), 'MMM d, yyyy')}
                      </time>
                    )}
                  </div>
                </div>
                
                {(log.status === 'approved' || log.status === 'revision_requested' || log.status === 'reviewed') && (
                  <button 
                    onClick={() => viewFeedback(log._id)}
                    className="text-sm font-medium text-indigo-600 bg-indigo-50 hover:bg-indigo-100 px-3 py-1.5 rounded-lg transition"
                  >
                    {activeFeedback === log._id ? 'Close Feedback' : 'View Feedback'}
                  </button>
                )}
              </div>
              
              <div className="text-gray-600 mt-3 text-sm line-clamp-2">
                {log.workDone}
              </div>

              {log.skillsLearned && log.skillsLearned.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-2">
                  {log.skillsLearned.map((skill, i) => (
                    <span key={i} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-md font-medium">
                      {skill}
                    </span>
                  ))}
                </div>
              )}

              {/* Feedback Section Overlay */}
              {activeFeedback === log._id && (
                <div className="mt-5 p-4 bg-gray-50 border border-gray-200 rounded-lg animate-in fade-in slide-in-from-top-2 duration-200">
                  {feedbackLoading ? (
                    <div className="text-sm text-gray-500 text-center py-2">Loading feedback details...</div>
                  ) : feedbackData ? (
                    <div>
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold">
                            {feedbackData.mentorId?.name?.charAt(0) || 'M'}
                          </div>
                          <div>
                            <p className="text-sm font-bold text-gray-900">{feedbackData.mentorId?.name || 'Mentor'}</p>
                            <p className="text-xs text-gray-500">{format(new Date(feedbackData.reviewedAt), 'MMM d, h:mm a')}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-1">
                          {[1,2,3,4,5].map(star => (
                            <Star key={star} size={14} className={star <= feedbackData.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'} />
                          ))}
                        </div>
                      </div>
                      
                      <div className="text-gray-700 text-sm whitespace-pre-wrap pl-10 border-l-2 border-indigo-200">
                        {feedbackData.comment}
                      </div>

                      {feedbackData.commend && (
                        <div className="mt-4 ml-10 inline-flex items-center gap-2 px-3 py-1.5 bg-yellow-50 text-yellow-800 border border-yellow-200 rounded-lg text-xs font-bold font-amber-900">
                          <Award size={14} className="text-yellow-600" /> Commended: Excellent Work!
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-sm text-gray-500 text-center py-2">No feedback found.</div>
                  )}
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ProgressTimeline;
