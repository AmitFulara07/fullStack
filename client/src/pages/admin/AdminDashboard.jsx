import React, { useState, useEffect } from 'react';
import axiosInstance from '../../api/axiosInstance';
import toast from 'react-hot-toast';
import { Users, UserCheck, ShieldAlert, ArrowRight } from 'lucide-react';
import DashboardLayout from '../../components/shared/DashboardLayout';

const AdminDashboard = () => {
  const [students, setStudents] = useState([]);
  const [mentors, setMentors] = useState([]);
  const [loading, setLoading] = useState(true);

  // Assignment Modal State
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [selectedMentor, setSelectedMentor] = useState('');
  const [assignmentNote, setAssignmentNote] = useState('');
  const [isAssigning, setIsAssigning] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [studentsRes, mentorsRes] = await Promise.all([
        axiosInstance.get('/admin/students'),
        axiosInstance.get('/admin/mentors')
      ]);
      setStudents(studentsRes.data);
      setMentors(mentorsRes.data);
    } catch (error) {
      toast.error('Failed to load admin data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAssign = async () => {
    if (!selectedStudent || !selectedMentor) {
      toast.error('Please select both a student and a mentor');
      return;
    }
    
    setIsAssigning(true);
    try {
      if (selectedStudent.hasActiveMentor) {
        // Reassign
        await axiosInstance.patch(`/admin/assignments/${selectedStudent.activeAssignment[0]._id}/reassign`, {
          newMentorId: selectedMentor,
          reason: assignmentNote
        });
        toast.success('Mentor reassigned successfully');
      } else {
        // Assign New
        await axiosInstance.post('/admin/assign-mentor', {
          studentId: selectedStudent._id,
          mentorId: selectedMentor,
          projectId: '60d21b4667d0d8992e610c85', // Mock Project ID for Phase 4
          note: assignmentNote
        });
        toast.success('Mentor assigned successfully');
      }
      setSelectedStudent(null);
      setSelectedMentor('');
      setAssignmentNote('');
      fetchData(); // Refresh data
    } catch (error) {
      toast.error(error.response?.data?.message || 'Assignment failed');
    } finally {
      setIsAssigning(false);
    }
  };

  return (
    <DashboardLayout title="Admin Control Panel">
      <div className="space-y-8">
        {loading ? (
          <div className="flex h-64 items-center justify-center">
            <span className="flex items-center gap-2 text-brand-400 font-medium">
              <span className="h-5 w-5 rounded-full border-2 border-brand-400/20 border-t-brand-400 animate-spin"></span>
              Loading system data...
            </span>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Students List */}
            <div className="lg:col-span-2 glass rounded-2xl overflow-hidden border border-white/5 shadow-2xl">
              <div className="p-6 border-b border-white/5 bg-white/5 flex justify-between items-center">
                <h2 className="text-lg font-bold text-white flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-brand-500/20 text-brand-400 border border-brand-500/30">
                    <Users size={18} />
                  </div>
                  Students Requiring Mentorship
                </h2>
              </div>
              <div className="divide-y divide-white/5">
                {students.map(student => (
                  <div key={student._id} className="p-6 flex items-center justify-between hover:bg-white/[0.02] transition-colors">
                    <div>
                      <h3 className="font-semibold text-white text-lg">{student.name}</h3>
                      <p className="text-sm text-gray-400 mt-1">{student.email} • {student.department} • Batch {student.batch}</p>
                      
                      {student.hasActiveMentor ? (
                        <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-green-500/10 text-green-400 text-xs font-medium border border-green-500/20">
                          <UserCheck size={14} /> Assigned to {student.currentMentorId?.name}
                        </div>
                      ) : (
                        <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500/10 text-amber-400 text-xs font-medium border border-amber-500/20">
                          <ShieldAlert size={14} /> Unassigned
                        </div>
                      )}
                    </div>
                    <button
                      onClick={() => setSelectedStudent(student)}
                      className={`px-4 py-2 text-sm font-medium rounded-lg border transition-all duration-300 ${
                        selectedStudent?._id === student._id 
                          ? 'bg-brand-600 border-brand-500 text-white shadow-[0_0_15px_rgba(37,99,235,0.4)]' 
                          : 'bg-white/5 border-white/10 text-gray-300 hover:bg-white/10 hover:text-white'
                      }`}
                    >
                      {selectedStudent?._id === student._id ? 'Selected' : (student.hasActiveMentor ? 'Reassign' : 'Assign')}
                    </button>
                  </div>
                ))}
                {students.length === 0 && <div className="p-12 text-center text-gray-500">No students found.</div>}
              </div>
            </div>

            {/* Assignment Panel */}
            <div className="glass rounded-2xl border border-white/5 shadow-2xl flex flex-col h-max lg:sticky lg:top-24">
              <div className="p-6 border-b border-white/5 bg-white/5">
                <h2 className="text-lg font-bold text-white flex items-center gap-3">
                  Mentor Assignment
                </h2>
              </div>
              
              <div className="p-6 space-y-6">
                {!selectedStudent ? (
                  <div className="text-center py-12 text-gray-500 flex flex-col items-center gap-4">
                    <div className="h-16 w-16 rounded-full bg-white/5 flex items-center justify-center text-gray-600 border border-white/5">
                      <Users size={24} />
                    </div>
                    <p className="text-sm px-4">Select a student from the list to assign or reassign a mentor.</p>
                  </div>
                ) : (
                  <>
                    <div className="p-4 bg-brand-600/10 rounded-xl border border-brand-500/20 shadow-inner">
                      <p className="text-xs text-brand-300 font-bold uppercase tracking-wider mb-1">Target Student</p>
                      <p className="font-semibold text-white text-lg">{selectedStudent.name}</p>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Select Mentor</label>
                        <select
                          className="w-full bg-dark-800/50 border border-white/10 text-white rounded-xl p-3 text-sm focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none transition-all cursor-pointer"
                          value={selectedMentor}
                          onChange={(e) => setSelectedMentor(e.target.value)}
                        >
                          <option value="" className="bg-dark-900">-- Choose a Mentor --</option>
                          {mentors.map(mentor => (
                            <option key={mentor._id} value={mentor._id} className="bg-dark-900 py-2">
                              {mentor.name} ({mentor.activeStudentCount} active students)
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          {selectedStudent.hasActiveMentor ? 'Reassignment Reason' : 'Assignment Note'}
                        </label>
                        <textarea
                          rows={3}
                          className="w-full bg-dark-800/50 border border-white/10 text-white rounded-xl p-3 text-sm focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none transition-all resize-none placeholder-gray-500"
                          placeholder="Optional details..."
                          value={assignmentNote}
                          onChange={(e) => setAssignmentNote(e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="pt-2">
                      <button
                        onClick={handleAssign}
                        disabled={isAssigning || !selectedMentor}
                        className="w-full flex justify-center items-center gap-2 rounded-xl bg-brand-600 px-4 py-3 text-sm font-medium text-white hover:bg-brand-500 hover:shadow-[0_0_20px_rgba(37,99,235,0.4)] transition-all duration-300 disabled:opacity-50 disabled:hover:shadow-none disabled:cursor-not-allowed"
                      >
                        {isAssigning ? (
                          <span className="flex items-center gap-2">
                            <span className="h-4 w-4 rounded-full border-2 border-white/20 border-t-white animate-spin"></span>
                            Processing...
                          </span>
                        ) : (
                          <>
                            {selectedStudent.hasActiveMentor ? 'Confirm Reassignment' : 'Assign Mentor'}
                            <ArrowRight size={16} />
                          </>
                        )}
                      </button>
                      
                      <button
                        onClick={() => setSelectedStudent(null)}
                        disabled={isAssigning}
                        className="w-full mt-3 py-2 text-sm text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors font-medium"
                      >
                        Cancel
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default AdminDashboard;
