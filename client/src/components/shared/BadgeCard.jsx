import React from 'react';
import { motion } from 'framer-motion';
import { Lock } from 'lucide-react';

const BadgeCard = ({ badge, award, onClick }) => {
  const isEarned = !!award;

  return (
    <motion.div
      whileHover={{ y: -5 }}
      onClick={onClick}
      className={`relative overflow-hidden rounded-2xl border p-6 transition-all duration-300 cursor-pointer ${
        isEarned
          ? 'bg-gradient-to-br from-brand-900/40 to-dark-800/60 border-brand-500/30 shadow-[0_0_20px_rgba(59,130,246,0.1)]'
          : 'bg-dark-900/60 border-white/5 opacity-60 hover:opacity-80'
      }`}
    >
      {/* Background glow for earned badges */}
      {isEarned && (
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-brand-500/20 rounded-full blur-2xl" />
      )}

      <div className="flex flex-col items-center text-center gap-4 relative z-10">
        <div className={`flex h-16 w-16 items-center justify-center rounded-2xl text-3xl shadow-lg border ${
          isEarned 
            ? 'bg-brand-500/20 border-brand-400/30 text-white' 
            : 'bg-dark-800 border-white/10 text-gray-400'
        }`}>
          {isEarned ? (
            <span>{badge.icon}</span>
          ) : (
            <Lock size={24} className="opacity-50" />
          )}
        </div>

        <div>
          <h3 className={`font-bold tracking-tight ${isEarned ? 'text-white' : 'text-gray-400'}`}>
            {badge.name}
          </h3>
          <p className="text-xs text-brand-300 mt-1 uppercase tracking-wider font-semibold">
            {badge.triggerType} Trigger
          </p>
        </div>

        <p className="text-sm text-gray-400 line-clamp-2 min-h-[40px]">
          {badge.description}
        </p>

        {isEarned ? (
          <div className="mt-2 text-xs font-medium text-brand-200 bg-brand-500/20 px-3 py-1 rounded-full border border-brand-500/20">
            Earned on {new Date(award.awardedAt).toLocaleDateString()}
          </div>
        ) : (
          <div className="mt-2 text-xs font-medium text-gray-500 bg-dark-800 px-3 py-1 rounded-full border border-white/5">
            Locked
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default BadgeCard;
