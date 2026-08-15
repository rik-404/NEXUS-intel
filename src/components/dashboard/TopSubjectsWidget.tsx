import React from 'react';
import { AlertCircle, Flame } from 'lucide-react';

interface SubjectStat {
  subjectName: string;
  categoryName: string;
  count: number;
  percentage: number;
}

interface TopSubjectsWidgetProps {
  subjects: SubjectStat[];
}

export const TopSubjectsWidget: React.FC<TopSubjectsWidgetProps> = ({ subjects }) => {
  return (
    <div className="glass-panel rounded-2xl border border-slate-800 p-6 shadow-xl space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Flame className="w-5 h-5 text-amber-400" />
            Assuntos Mais Recorrentes Hoje
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Principais problemas relatados pelos clientes
          </p>
        </div>
      </div>

      <div className="space-y-4 pt-2">
        {subjects.slice(0, 5).map((item, index) => (
          <div key={index} className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center space-x-2">
                <span className="w-5 h-5 rounded-full bg-slate-800 text-slate-300 font-bold text-[10px] flex items-center justify-center shrink-0">
                  #{index + 1}
                </span>
                <span className="font-semibold text-slate-200 truncate max-w-[200px] sm:max-w-xs">
                  {item.subjectName}
                </span>
              </div>
              <div className="flex items-center space-x-2 shrink-0">
                <span className="text-[10px] text-slate-400">{item.categoryName}</span>
                <span className="font-mono font-bold text-amber-400">{item.count} ocorrências</span>
              </div>
            </div>

            {/* Progress bar */}
            <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-amber-500 to-rose-500 rounded-full transition-all duration-500"
                style={{ width: `${Math.max(item.percentage, 8)}%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
