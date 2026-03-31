import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import axiosInstance from '../api/axiosInstance';
import { useAuth } from '../hooks/useAuth';
import toast from 'react-hot-toast';
import { LogIn, Mail, Lock } from 'lucide-react';
import BackgroundBlobs from '../components/shared/BackgroundBlobs';

const Login = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      const response = await axiosInstance.post('/auth/login', data);
      const { token, user } = response.data;
      login(token, user);
      toast.success('Logged in successfully!');
      
      if (user.role === 'admin') navigate('/admin');
      else if (user.role === 'faculty') navigate('/faculty');
      else if (user.role === 'student') navigate('/student');
      else if (user.role === 'mentor') navigate('/mentor');
      
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: { duration: 0.5, ease: 'easeOut', staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } }
  };

  return (
    <div className="relative flex h-screen w-full items-center justify-center overflow-hidden">
      <BackgroundBlobs />
      
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="glass z-10 w-full max-w-md space-y-8 rounded-2xl p-8 shadow-2xl"
      >
        <motion.div variants={itemVariants} className="text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-brand-600/20 ring-1 ring-brand-500/50 shadow-[0_0_15px_rgba(59,130,246,0.5)]">
            <LogIn className="h-8 w-8 text-brand-400" />
          </div>
          <h2 className="mt-6 text-3xl font-extrabold tracking-tight text-white">Welcome to RBACS</h2>
          <p className="mt-2 text-sm text-gray-400">
            Sign in to access your secure dashboard
          </p>
        </motion.div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-5">
            <motion.div variants={itemVariants}>
              <label className="text-sm font-medium text-gray-300">Email Address</label>
              <div className="relative mt-1 border border-white/10 rounded-lg overflow-hidden bg-dark-800/50 focus-within:border-brand-500 focus-within:ring-1 focus-within:ring-brand-500 transition-all duration-300">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <Mail className="h-5 w-5 text-gray-500" />
                </div>
                <input
                  type="email"
                  className="block w-full outline-none py-3 pl-10 pr-3 sm:text-sm bg-transparent text-white placeholder-gray-500"
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
                  className="block w-full outline-none py-3 pl-10 pr-3 sm:text-sm bg-transparent text-white placeholder-gray-500"
                  placeholder="••••••••"
                  {...register('password', { required: 'Password is required' })}
                />
              </div>
              {errors.password && <span className="mt-1 text-xs text-red-400">{errors.password.message}</span>}
            </motion.div>
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
                Signing in...
              </span>
            ) : 'Sign In'}
          </motion.button>
        </form>

        <motion.p variants={itemVariants} className="mt-6 text-center text-sm text-gray-400">
          Don't have an account?{' '}
          <Link to="/register" className="font-medium text-brand-400 hover:text-brand-300 transition-colors">
            Register here
          </Link>
        </motion.p>
      </motion.div>
    </div>
  );
};

export default Login;
