import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import axiosInstance from '../api/axiosInstance';
import toast from 'react-hot-toast';
import { UserPlus, Mail, Lock, User, Briefcase, GraduationCap } from 'lucide-react';
import BackgroundBlobs from '../components/shared/BackgroundBlobs';

const Register = () => {
  const { register, handleSubmit, watch, formState: { errors } } = useForm();
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const role = watch('role', 'student');

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      await axiosInstance.post('/auth/register', data);
      toast.success('Registration successful. Please login.');
      navigate('/login');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: { duration: 0.5, ease: 'easeOut', staggerChildren: 0.08 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } }
  };

  return (
    <div className="relative flex min-h-screen w-full items-center justify-center overflow-hidden py-8 px-4">
      <BackgroundBlobs />
      
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="glass z-10 w-full max-w-lg space-y-8 rounded-2xl p-8 shadow-2xl"
      >
        <motion.div variants={itemVariants} className="text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-brand-600/20 ring-1 ring-brand-500/50 shadow-[0_0_15px_rgba(59,130,246,0.5)]">
            <UserPlus className="h-8 w-8 text-brand-400" />
          </div>
          <h2 className="mt-6 text-3xl font-extrabold tracking-tight text-white">Create an Account</h2>
          <p className="mt-2 text-sm text-gray-400">
            Join the RBACS platform
          </p>
        </motion.div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-5">
            <motion.div variants={itemVariants}>
              <label className="text-sm font-medium text-gray-300">Full Name</label>
              <div className="relative mt-1 border border-white/10 rounded-lg overflow-hidden bg-dark-800/50 focus-within:border-brand-500 focus-within:ring-1 focus-within:ring-brand-500 transition-all duration-300">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <User className="h-5 w-5 text-gray-500" />
                </div>
                <input
                  type="text"
                  className="block w-full outline-none py-2.5 pl-10 pr-3 sm:text-sm bg-transparent text-white placeholder-gray-500"
                  placeholder="John Doe"
                  {...register('name', { required: 'Name is required' })}
                />
              </div>
              {errors.name && <span className="mt-1 text-xs text-red-400">{errors.name.message}</span>}
            </motion.div>

            <motion.div variants={itemVariants}>
              <label className="text-sm font-medium text-gray-300">Email Address</label>
              <div className="relative mt-1 border border-white/10 rounded-lg overflow-hidden bg-dark-800/50 focus-within:border-brand-500 focus-within:ring-1 focus-within:ring-brand-500 transition-all duration-300">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <Mail className="h-5 w-5 text-gray-500" />
                </div>
                <input
                  type="email"
                  className="block w-full outline-none py-2.5 pl-10 pr-3 sm:text-sm bg-transparent text-white placeholder-gray-500"
                  placeholder="you@example.com"
                  {...register('email', { required: 'Email is required' })}
                />
              </div>
              {errors.email && <span className="mt-1 text-xs text-red-400">{errors.email.message}</span>}
            </motion.div>

            <motion.div variants={itemVariants}>
              <label className="text-sm font-medium text-gray-300">Password</label>
              <div className="relative mt-1 border border-white/10 rounded-lg overflow-hidden bg-dark-800/50 focus-within:border-brand-500 focus-within:ring-1 focus-within:ring-brand-500 transition-all duration-300">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <Lock className="h-5 w-5 text-gray-500" />
                </div>
                <input
                  type="password"
                  className="block w-full outline-none py-2.5 pl-10 pr-3 sm:text-sm bg-transparent text-white placeholder-gray-500"
                  placeholder="••••••••"
                  {...register('password', { 
                    required: 'Password is required',
                    minLength: { value: 6, message: 'Password must be at least 6 characters' }
                  })}
                />
              </div>
              {errors.password && <span className="mt-1 text-xs text-red-400">{errors.password.message}</span>}
            </motion.div>

            <motion.div variants={itemVariants} className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-300">Role</label>
                <div className="relative mt-1 border border-white/10 rounded-lg overflow-hidden bg-dark-800/50 focus-within:border-brand-500 focus-within:ring-1 focus-within:ring-brand-500 transition-all duration-300">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <Briefcase className="h-5 w-5 text-gray-500" />
                  </div>
                  <select
                    className="block w-full outline-none py-2.5 pl-10 pr-3 sm:text-sm bg-transparent text-white appearance-none cursor-pointer"
                    {...register('role', { required: 'Role is required' })}
                  >
                    <option value="student" className="bg-dark-900">Student</option>
                    <option value="mentor" className="bg-dark-900">Mentor</option>
                    <option value="faculty" className="bg-dark-900">Faculty</option>
                    <option value="admin" className="bg-dark-900">Admin</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-300">Department</label>
                <div className="relative mt-1 border border-white/10 rounded-lg overflow-hidden bg-dark-800/50 focus-within:border-brand-500 focus-within:ring-1 focus-within:ring-brand-500 transition-all duration-300">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <GraduationCap className="h-5 w-5 text-gray-500" />
                  </div>
                  <input
                    type="text"
                    className="block w-full outline-none py-2.5 pl-10 pr-3 sm:text-sm bg-transparent text-white placeholder-gray-500"
                    placeholder="e.g. CSE"
                    {...register('department')}
                  />
                </div>
              </div>
            </motion.div>

            {role === 'student' && (
              <motion.div variants={itemVariants}>
                <label className="text-sm font-medium text-gray-300">Batch</label>
                <div className="mt-1">
                  <input
                    type="text"
                    className="block w-full rounded-lg border border-white/10 bg-dark-800/50 outline-none py-2.5 px-3 sm:text-sm text-white focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-all duration-300 placeholder-gray-500"
                    placeholder="e.g. CSE-2024"
                    {...register('batch', { required: 'Batch is required for students' })}
                  />
                </div>
                {errors.batch && <span className="mt-1 text-xs text-red-400">{errors.batch.message}</span>}
              </motion.div>
            )}

            {role === 'mentor' && (
              <motion.div variants={itemVariants}>
                <label className="text-sm font-medium text-gray-300">Mentor Type</label>
                <div className="mt-1">
                  <select
                    className="block w-full rounded-lg border border-white/10 bg-dark-800/50 outline-none py-2.5 px-3 sm:text-sm text-white focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-all duration-300"
                    {...register('mentorType', { required: 'Mentor type is required' })}
                  >
                    <option value="" className="bg-dark-900">Select type...</option>
                    <option value="senior" className="bg-dark-900">Senior Student</option>
                    <option value="alumni" className="bg-dark-900">Alumni</option>
                    <option value="faculty" className="bg-dark-900">Faculty</option>
                  </select>
                </div>
                {errors.mentorType && <span className="mt-1 text-xs text-red-400">{errors.mentorType.message}</span>}
              </motion.div>
            )}
          </div>

          <motion.button
            variants={itemVariants}
            type="submit"
            disabled={isLoading}
            className="group relative flex w-full justify-center rounded-lg border border-transparent bg-brand-600 py-3 px-4 text-sm font-medium text-white transition-all duration-300 hover:bg-brand-500 hover:shadow-[0_0_20px_rgba(37,99,235,0.4)] focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 focus:ring-offset-dark-900 disabled:opacity-70 disabled:hover:shadow-none"
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <span className="h-4 w-4 rounded-full border-2 border-white/20 border-t-white animate-spin"></span>
                Registering...
              </span>
            ) : 'Create Account'}
          </motion.button>
        </form>

        <motion.p variants={itemVariants} className="mt-6 text-center text-sm text-gray-400">
          Already have an account?{' '}
          <Link to="/login" className="font-medium text-brand-400 hover:text-brand-300 transition-colors">
            Sign in
          </Link>
        </motion.p>
      </motion.div>
    </div>
  );
};

export default Register;
