import React, { useState, useEffect } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../api/axiosInstance';
import toast from 'react-hot-toast';
import { Plus, X, Upload, Save, Send } from 'lucide-react';
import DashboardLayout from '../../components/shared/DashboardLayout';

const SubmitLog = () => {
  const { register, handleSubmit, control, watch, formState: { errors } } = useForm({
    defaultValues: { evidenceLinks: [{ url: '' }] }
  });
  const { fields, append, remove } = useFieldArray({ control, name: 'evidenceLinks' });
  const [skills, setSkills] = useState([]);
  const [skillInput, setSkillInput] = useState('');
  const [projects, setProjects] = useState([]);
  const [files, setFiles] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  // Mock project fetching (to be replaced with actual project fetch if implemented)
  useEffect(() => {
    setProjects([{ _id: '60d21b4667d0d8992e610c85', title: 'RBACS Final Year Project' }]);
  }, []);

  const handleAddSkill = (e) => {
    if (e.key === 'Enter' && skillInput.trim()) {
      e.preventDefault();
      if (!skills.includes(skillInput.trim())) {
        setSkills([...skills, skillInput.trim()]);
      }
      setSkillInput('');
    }
  };

  const currentProjectId = watch('projectId') || (projects.length > 0 ? projects[0]._id : '');

  const onSubmit = async (data, status) => {
    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('title', data.title);
      formData.append('weekNumber', data.weekNumber);
      formData.append('projectId', currentProjectId);
      formData.append('workDone', data.workDone);
      formData.append('challenges', data.challenges || '');
      formData.append('plannedNext', data.plannedNext || '');
      formData.append('status', status);
      
      formData.append('skillsLearned', JSON.stringify(skills));
      
      const validLinks = data.evidenceLinks.map(l => l.url).filter(l => l.trim() !== '');
      formData.append('evidenceLinks', JSON.stringify(validLinks));
      
      Array.from(files).forEach(file => {
        formData.append('attachments', file);
      });

      await axiosInstance.post('/logs', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      toast.success(`Log ${status === 'submitted' ? 'submitted' : 'saved as draft'} successfully!`);
      navigate('/student');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to submit log');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <DashboardLayout title="Submit Progress Log">
      <div className="mx-auto max-w-4xl space-y-8">
        <div className="glass p-6 md:p-10 rounded-2xl shadow-2xl border border-white/5">
          <form className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Log Title</label>
                <input 
                  type="text" 
                  className="w-full bg-dark-800/50 border border-white/10 text-white rounded-xl p-3 focus:ring-2 focus:ring-brand-500 outline-none transition-all placeholder-gray-500"
                  placeholder="e.g., Auth Module Completion"
                  {...register('title', { required: 'Title is required' })}
                />
                {errors.title && <p className="text-red-400 text-xs mt-2">{errors.title.message}</p>}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Week Number</label>
                <input 
                  type="number" min="1"
                  className="w-full bg-dark-800/50 border border-white/10 text-white rounded-xl p-3 focus:ring-2 focus:ring-brand-500 outline-none transition-all"
                  {...register('weekNumber', { required: 'Week number is required' })}
                />
                {errors.weekNumber && <p className="text-red-400 text-xs mt-2">{errors.weekNumber.message}</p>}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Work Done</label>
              <textarea 
                rows={5}
                className="w-full bg-dark-800/50 border border-white/10 text-white rounded-xl p-3 focus:ring-2 focus:ring-brand-500 outline-none transition-all resize-none placeholder-gray-500"
                placeholder="Describe what you worked on this week (markdown supported)..."
                {...register('workDone', { required: 'Work done description is required' })}
              />
              {errors.workDone && <p className="text-red-400 text-xs mt-2">{errors.workDone.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Skills Learned (Press Enter to add)</label>
              <div className="flex flex-wrap gap-2 mb-3">
                {skills.map(skill => (
                  <span key={skill} className="inline-flex items-center px-3 py-1 rounded-lg text-sm font-medium bg-brand-500/20 text-brand-300 border border-brand-500/30">
                    {skill}
                    <button type="button" onClick={() => setSkills(skills.filter(s => s !== skill))} className="ml-2 text-brand-400 hover:text-white transition-colors">
                      <X size={14} />
                    </button>
                  </span>
                ))}
              </div>
              <input 
                type="text" 
                className="w-full bg-dark-800/50 border border-white/10 text-white rounded-xl p-3 focus:ring-2 focus:ring-brand-500 outline-none transition-all placeholder-gray-500"
                placeholder="e.g., React, MongoDB..."
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                onKeyDown={handleAddSkill}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Challenges Faced</label>
                <textarea 
                  rows={4}
                  className="w-full bg-dark-800/50 border border-white/10 text-white rounded-xl p-3 focus:ring-2 focus:ring-brand-500 outline-none transition-all resize-none placeholder-gray-500"
                  placeholder="Any blockers or difficulties?"
                  {...register('challenges')}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Planned for Next Week</label>
                <textarea 
                  rows={4}
                  className="w-full bg-dark-800/50 border border-white/10 text-white rounded-xl p-3 focus:ring-2 focus:ring-brand-500 outline-none transition-all resize-none placeholder-gray-500"
                  placeholder="What's next on your agenda?"
                  {...register('plannedNext')}
                />
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-white/5 border border-white/10">
              <label className="block text-sm font-medium text-white mb-4">Evidence Links</label>
              {fields.map((item, index) => (
                <div key={item.id} className="flex gap-3 mb-3">
                  <input
                    className="flex-1 bg-dark-800/80 border border-white/10 text-white rounded-xl p-3 focus:ring-2 focus:ring-brand-500 outline-none transition-all placeholder-gray-600"
                    placeholder="https://github.com/..."
                    {...register(`evidenceLinks.${index}.url`)}
                  />
                  <button type="button" onClick={() => remove(index)} className="px-3 text-red-400 bg-red-500/10 hover:bg-red-500/20 hover:text-red-300 border border-red-500/20 rounded-xl transition-colors">
                    <X size={20} />
                  </button>
                </div>
              ))}
              <button type="button" onClick={() => append({ url: '' })} className="mt-2 flex items-center text-sm text-brand-400 font-medium hover:text-brand-300 transition-colors">
                <Plus size={16} className="mr-1" /> Add Link
              </button>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-3">Attachments (max 5)</label>
              <div className="flex justify-center px-6 pt-8 pb-10 border-2 border-white/10 border-dashed rounded-2xl hover:border-brand-500/50 transition-colors bg-white/[0.02]">
                <div className="space-y-2 text-center">
                  <Upload className="mx-auto h-12 w-12 text-gray-500 mb-4" />
                  <div className="flex text-sm text-gray-400 justify-center">
                    <label htmlFor="file-upload" className="relative cursor-pointer rounded-lg font-medium text-brand-400 hover:text-brand-300 focus-within:outline-none focus-within:ring-2 focus-within:ring-brand-500 focus-within:ring-offset-2 focus-within:ring-offset-dark-900 transition-colors">
                      <span className="bg-brand-500/10 px-4 py-2 rounded-xl border border-brand-500/20">Browse Files</span>
                      <input id="file-upload" type="file" multiple className="sr-only" onChange={(e) => setFiles(e.target.files)} />
                    </label>
                  </div>
                  <p className="text-xs text-gray-500 mt-4">PDF, PNG, JPG up to 10MB</p>
                  {files.length > 0 && (
                    <div className="mt-4 p-3 bg-brand-500/10 rounded-xl border border-brand-500/20 inline-block text-brand-300 text-sm">
                      {files.length} file(s) selected
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-end gap-4 pt-6 mt-8 border-t border-white/10">
              <button
                type="button"
                disabled={isSubmitting}
                onClick={handleSubmit((data) => onSubmit(data, 'draft'))}
                className="w-full sm:w-auto px-6 py-3 border border-white/20 rounded-xl text-sm font-medium text-gray-300 hover:bg-white/10 hover:text-white transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              >
                <Save size={16} />
                Save as Draft
              </button>
              <button
                type="button"
                disabled={isSubmitting}
                onClick={handleSubmit((data) => onSubmit(data, 'submitted'))}
                className="w-full sm:w-auto px-8 py-3 bg-brand-600 rounded-xl text-sm font-medium text-white hover:bg-brand-500 hover:shadow-[0_0_20px_rgba(37,99,235,0.4)] transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <span className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin"></span>
                ) : (
                  <Send size={16} />
                )}
                {isSubmitting ? 'Submitting...' : 'Submit Log'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default SubmitLog;
