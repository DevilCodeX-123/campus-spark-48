import React from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '@/utils/api';
import { 
  Award, Trophy, Star, Medal, 
  TrendingUp, Download, Loader2, 
  Flame, Zap, Target, Crown
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';

const GamificationPanel: React.FC = () => {
  const { user } = useAuth();
  const { data: achievements = [], isLoading: loadingAch } = useQuery({
    queryKey: ['user_achievements', user?.id],
    queryFn: () => api.get(`/winners/user/${user?.id}`).then(r => r.data).catch(() => []),
    enabled: !!user?.id
  });

  const { data: leaderboard = [], isLoading: loadingLead } = useQuery({
    queryKey: ['global_leaderboard'],
    queryFn: () => api.get('/winners/leaderboard').then(r => r.data).catch(() => []),
  });

  const getRankIcon = (pos: string) => {
    if (pos === '1st') return <Trophy className="h-6 w-6 text-amber-500" />;
    if (pos === '2nd') return <Medal className="h-6 w-6 text-slate-400" />;
    if (pos === '3rd') return <Medal className="h-6 w-6 text-amber-700" />;
    return <Award className="h-6 w-6 text-blue-500" />;
  };

  const mockLeaderboard = [
    { name: 'Arjun Mehra', points: 4200, college: 'IIT Delhi', rank: 1 },
    { name: 'Sanya Gupta', points: 3850, college: 'DTU', rank: 2 },
    { name: 'Rohan Shah', points: 3600, college: 'IIT Bombay', rank: 3 },
    { name: 'Priya Verma', points: 2900, college: 'NSUT', rank: 4 },
    { name: 'Kabir Singh', points: 2750, college: 'MAIT', rank: 5 },
  ];

  return (
    <div className="grid gap-10 lg:grid-cols-3 animate-in fade-in duration-700">
      
      {/* Achievements Canvas */}
      <div className="lg:col-span-2 space-y-10">
         <div className="flex items-center justify-between">
            <div>
               <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Gallant Achievements</h3>
               <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Found {achievements.length} verified victories in your history</p>
            </div>
            <div className="h-12 w-12 rounded-2xl bg-amber-500 shadow-xl shadow-amber-500/20 flex items-center justify-center text-white">
               <Crown className="h-6 w-6" />
            </div>
         </div>

         <div className="grid gap-6 md:grid-cols-2">
            {loadingAch ? (
               <div className="col-span-full py-20 text-center"><Loader2 className="h-8 w-8 animate-spin text-amber-500 mx-auto" /></div>
            ) : achievements.length === 0 ? (
               <div className="col-span-full h-80 flex flex-col items-center justify-center rounded-[48px] border-2 border-dashed border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-transparent">
                  <Target className="h-16 w-16 text-slate-200 dark:text-white/5 mb-4" />
                  <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">No trophies collected. Start competing.</p>
               </div>
            ) : achievements.map((a: any, i: number) => (
               <motion.div 
                 key={i} 
                 initial={{ opacity: 0, y: 20 }}
                 animate={{ opacity: 1, y: 0 }}
                 transition={{ delay: i * 0.1 }}
                 className="group relative overflow-hidden rounded-[36px] bg-white dark:bg-[#0a0c12] border border-slate-100 dark:border-white/5 p-8 shadow-sm hover:shadow-2xl transition-all"
               >
                  <div className="absolute top-0 right-0 h-32 w-32 bg-amber-500/5 rounded-full blur-[60px] translate-x-10 -translate-y-10" />
                  <div className="flex justify-between items-start mb-8 relative z-10">
                     <div className="h-14 w-14 rounded-2xl bg-slate-50 dark:bg-white/5 flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform duration-500">
                        {getRankIcon(a.position)}
                     </div>
                     <span className="text-[10px] font-black text-amber-600 bg-amber-50 dark:bg-amber-500/10 px-4 py-1.5 rounded-full uppercase tracking-widest">+{a.rewardPoints} LP</span>
                  </div>
                  <h4 className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-tighter mb-2 line-clamp-1">{a.eventTitle || 'Strategic Hackathon'}</h4>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-10">Secured {a.position} Place · 2026</p>
                  
                  <div className="flex gap-3 relative z-10">
                     <button className="flex-1 py-4 bg-slate-900 text-white rounded-2xl text-[9px] font-black uppercase tracking-widest shadow-xl shadow-slate-950/20 hover:bg-slate-800 transition-all flex items-center justify-center gap-2">
                        <Download className="h-3.5 w-3.5" /> Certificate
                     </button>
                     <button className="h-14 w-14 bg-white dark:bg-white/5 border border-slate-100 dark:border-white/10 rounded-2xl flex items-center justify-center text-slate-400 hover:text-amber-500 transition-colors">
                        <Star className="h-5 w-5" />
                     </button>
                  </div>
               </motion.div>
            ))}
         </div>
      </div>

      {/* Global Leaderboard Wall */}
      <div className="space-y-10">
         <div className="flex items-center justify-between">
            <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight italic">Elite Wall</h3>
            <div className="flex items-center gap-2 text-emerald-500 bg-emerald-50 dark:bg-emerald-500/10 px-3 py-1 rounded-full text-[9px] font-black uppercase">
               <TrendingUp className="h-3 w-3" /> Live Sync
            </div>
         </div>

         <div className="rounded-[40px] bg-slate-950 p-10 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 h-40 w-40 bg-blue-600 opacity-20 blur-[100px]" />
            <div className="relative z-10 space-y-8">
               {(leaderboard.length > 0 ? leaderboard : mockLeaderboard).map((entry, i) => (
                  <div key={i} className="flex items-center gap-5 group transition-all hover:translate-x-1">
                     <div className="relative">
                        <div className={`h-12 w-12 rounded-2xl flex items-center justify-center text-white font-black italic shadow-2xl ${entry.rank === 1 ? 'bg-gradient-to-br from-amber-400 to-amber-600 scale-110 rotate-3' : 'bg-white/5 border border-white/10'}`}>
                           {entry.rank}
                        </div>
                        {entry.rank === 1 && <Crown className="absolute -top-3 -right-3 h-6 w-6 text-amber-400 drop-shadow-lg" />}
                     </div>
                     <div className="flex-1">
                        <p className="text-xs font-black text-white uppercase tracking-tight flex items-center gap-2">
                           {entry.name}
                           {entry.rank <= 3 && <Zap className="h-3 w-3 text-amber-400 animate-pulse" />}
                        </p>
                        <p className="text-[9px] font-bold text-white/40 uppercase tracking-widest mt-1 italic">{entry.college}</p>
                     </div>
                     <div className="text-right">
                        <p className="text-sm font-black text-blue-400 tabular-nums">{entry.points.toLocaleString()}</p>
                        <p className="text-[8px] font-bold text-white/20 uppercase">POINTS</p>
                     </div>
                  </div>
               ))}

               <div className="pt-10 mt-10 border-t border-white/5">
                  <div className="flex items-center justify-between p-6 bg-white/5 rounded-[32px] border border-white/10 shadow-inner">
                     <div className="flex items-center gap-4">
                        <div className="h-10 w-10 bg-blue-600 rounded-xl flex items-center justify-center text-white font-black italic">142</div>
                        <div>
                           <p className="text-[10px] font-black text-white uppercase tracking-widest">Global Ranking</p>
                           <p className="text-xs font-bold text-white/60">YOU · TOP 14%</p>
                        </div>
                     </div>
                     <Flame className="h-5 w-5 text-rose-500 animate-bounce" />
                  </div>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
};

export default GamificationPanel;
