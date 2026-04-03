import React, { useState, useEffect } from 'react';
import api from '../../api/axiosInstance';
import BadgeCard from '../../components/shared/BadgeCard';
import { Award, Target, Flame } from 'lucide-react';

const MyBadges = () => {
  const [tab, setTab] = useState('all'); // all, earned, locked, history
  const [badgesData, setBadgesData] = useState([]);
  const [history, setHistory] = useState([]);
  const [stats, setStats] = useState({ streak: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [badgesRes, historyRes, statsRes] = await Promise.all([
          api.get('/badges/my'),
          api.get('/badges/history'),
          api.get('/logs/stats')
        ]);
        setBadgesData(badgesRes.data);
        setHistory(historyRes.data);
        setStats(statsRes.data);
      } catch (error) {
        console.error('Failed to fetch badge data', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const filteredBadges = badgesData.filter(item => {
    if (tab === 'earned') return item.earned;
    if (tab === 'locked') return !item.earned;
    return true; // all
  });

  const earnedCount = badgesData.filter(b => b.earned).length;
  const recentBadge = history.length > 0 ? history[0] : null;

  return (
    <div className="space-y-6">
      {/* Header Stats */}
      <div className="grid gap-6 md:grid-cols-3">
        <div className="glass rounded-2xl p-6 border border-brand-500/20 bg-gradient-to-br from-brand-900/30 to-dark-800">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-brand-300 text-sm font-medium mb-1">Badges Earned</p>
              {loading ? (
                <div className="h-8 w-12 bg-white/5 animate-pulse rounded mt-1"></div>
              ) : (
                <h3 className="text-3xl font-bold text-white">{earnedCount}</h3>
              )}
            </div>
            <div className="p-3 bg-brand-500/20 rounded-xl text-brand-400">
              <Award size={24} />
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-brand-500/20 text-sm text-gray-400">
            {loading ? (
              <div className="h-4 w-32 bg-white/5 animate-pulse rounded"></div>
            ) : (
              <span>Out of {badgesData.length} total available badges</span>
            )}
          </div>
        </div>

        <div className="glass rounded-2xl p-6 border border-amber-500/20 bg-gradient-to-br from-amber-900/30 to-dark-800">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-amber-300 text-sm font-medium mb-1">Current Streak</p>
              {loading ? (
                <div className="h-8 w-24 bg-white/5 animate-pulse rounded mt-1"></div>
              ) : (
                <h3 className="text-3xl font-bold text-white">{stats.streak} {stats.streak === 1 ? 'Week' : 'Weeks'}</h3>
              )}
            </div>
            <div className="p-3 bg-amber-500/20 rounded-xl text-amber-400">
              <Flame size={24} />
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-amber-500/20 text-sm text-gray-400 flex items-center justify-between">
            {loading ? (
              <div className="h-4 w-24 bg-white/5 animate-pulse rounded"></div>
            ) : (
              <span>{stats.streak > 0 ? "Keep it up! 🔥" : "Submit your first log to start"}</span>
            )}
          </div>
        </div>

        <div className="glass rounded-2xl p-6 border border-emerald-500/20 bg-gradient-to-br from-emerald-900/30 to-dark-800">
          <div className="flex justify-between items-start">
             <div>
              <p className="text-emerald-300 text-sm font-medium mb-1">Recent Reward</p>
              {loading ? (
                <div className="h-7 w-32 bg-white/5 animate-pulse rounded mt-2"></div>
              ) : (
                <h3 className="text-lg font-bold text-white tracking-tight mt-1 truncate">
                  {recentBadge ? `${recentBadge.badgeId?.icon} ${recentBadge.badgeId?.name}` : 'None yet'}
                </h3>
              )}
            </div>
            <div className="p-3 bg-emerald-500/20 rounded-xl text-emerald-400">
              <Target size={24} />
            </div>
          </div>
           <div className="mt-4 pt-4 border-t border-emerald-500/20 text-sm text-gray-400">
            {loading ? (
              <div className="h-4 w-28 bg-white/5 animate-pulse rounded"></div>
            ) : (
              <span>{recentBadge ? `Earned ${new Date(recentBadge.awardedAt).toLocaleDateString()}` : "Keep securing goals!"}</span>
            )}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-dark-800/50 p-1 rounded-xl inline-flex space-x-1 glass border border-white/5">
        <button
          className={`px-6 py-2.5 rounded-lg text-sm font-medium transition-all duration-300 ${tab === 'all' ? 'bg-brand-500/20 text-brand-300 shadow-md border border-brand-500/30' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
          onClick={() => setTab('all')}
        >
          All Badges
        </button>
        <button
          className={`px-6 py-2.5 rounded-lg text-sm font-medium transition-all duration-300 ${tab === 'earned' ? 'bg-brand-500/20 text-brand-300 shadow-md border border-brand-500/30' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
          onClick={() => setTab('earned')}
        >
          Earned
        </button>
        <button
          className={`px-6 py-2.5 rounded-lg text-sm font-medium transition-all duration-300 ${tab === 'locked' ? 'bg-brand-500/20 text-brand-300 shadow-md border border-brand-500/30' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
          onClick={() => setTab('locked')}
        >
          Locked
        </button>
        <button
          className={`px-6 py-2.5 rounded-lg text-sm font-medium transition-all duration-300 ${tab === 'history' ? 'bg-brand-500/20 text-brand-300 shadow-md border border-brand-500/30' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
          onClick={() => setTab('history')}
        >
          History Log
        </button>
      </div>

      {loading ? (
        <div className="h-40 flex items-center justify-center">
          <div className="w-8 h-8 border-4 border-brand-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : tab === 'history' ? (
        <div className="glass rounded-2xl border border-white/5 overflow-hidden">
          {history.length === 0 ? (
            <div className="p-8 text-center text-gray-500">No badge history to display.</div>
          ) : (
            <div className="divide-y divide-white/5">
              {history.map(item => (
                <div key={item._id} className="p-4 sm:px-6 flex items-center justify-between hover:bg-white/5 transition-colors">
                  <div className="flex items-center gap-4">
                     <div className="h-12 w-12 flex items-center justify-center rounded-xl bg-dark-800 text-2xl border border-white/10 shadow-inner">
                        {item.badgeId?.icon}
                     </div>
                     <div>
                       <p className="text-white font-medium">{item.badgeId?.name}</p>
                       <p className="text-gray-400 text-sm mt-0.5">{item.awardedBy ? `Awarded by ${item.awardedBy.name}` : 'System Awarded'}</p>
                     </div>
                  </div>
                  <div className="text-right flex flex-col items-end">
                     <p className="text-brand-300 text-sm font-medium">{new Date(item.awardedAt).toLocaleDateString()}</p>
                     <p className="text-gray-500 text-xs mt-1">{new Date(item.awardedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredBadges.map(({ badge, award }) => (
            <BadgeCard 
              key={badge._id} 
              badge={badge} 
              award={award} 
              onClick={() => {}} 
            />
          ))}
          {filteredBadges.length === 0 && (
             <div className="col-span-full p-10 text-center text-gray-500 glass rounded-2xl border border-white/5">
                No badges matching this filter.
             </div>
          )}
        </div>
      )}
    </div>
  );
};

export default MyBadges;
