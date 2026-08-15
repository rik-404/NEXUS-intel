import React from 'react';
import { LucideIcon, TrendingUp, TrendingDown } from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  trend?: {
    value: string;
    isPositive: boolean;
  };
  icon: LucideIcon;
  color: 'indigo' | 'emerald' | 'amber' | 'sky' | 'rose' | 'violet';
}

export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  subtitle,
  trend,
  icon: Icon,
  color
}) => {
  const colorMap = {
    indigo: 'from-indigo-500/20 to-indigo-600/5 text-indigo-400 border-indigo-500/30',
    emerald: 'from-emerald-500/20 to-emerald-600/5 text-emerald-400 border-emerald-500/30',
    amber: 'from-amber-500/20 to-amber-600/5 text-amber-400 border-amber-500/30',
    sky: 'from-sky-500/20 to-sky-600/5 text-sky-400 border-sky-500/30',
    rose: 'from-rose-500/20 to-rose-600/5 text-rose-400 border-rose-500/30',
    violet: 'from-violet-500/20 to-violet-600/5 text-violet-400 border-violet-500/30',
  };

  const iconBgMap = {
    indigo: 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30',
    emerald: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
    amber: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
    sky: 'bg-sky-500/20 text-sky-400 border-sky-500/30',
    rose: 'bg-rose-500/20 text-rose-400 border-rose-500/30',
    violet: 'bg-violet-500/20 text-violet-400 border-violet-500/30',
  };

  return (
    <div className={`glass-card rounded-2xl p-5 border bg-gradient-to-b ${colorMap[color]} transition-all duration-300 relative overflow-hidden group`}>
      <div className="flex items-start justify-between">
        <div>
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
            {title}
          </span>
          <p className="text-2xl font-extrabold text-white mt-1 tracking-tight">
            {value}
          </p>
        </div>
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center border ${iconBgMap[color]} shadow-md`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between text-xs pt-3 border-t border-slate-800/80">
        {trend && (
          <div className={`flex items-center space-x-1 font-semibold text-[11px] ${
            trend.isPositive ? 'text-emerald-400' : 'text-rose-400'
          }`}>
            {trend.isPositive ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
            <span>{trend.value} vs. ontem</span>
          </div>
        )}
        {subtitle && (
          <span className="text-[11px] text-slate-400 font-medium">{subtitle}</span>
        )}
      </div>
    </div>
  );
};
