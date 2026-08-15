import React from 'react';
import { KBArticle } from '../../lib/types';
import { BookOpen, ThumbsUp, Eye, ArrowUpRight } from 'lucide-react';

interface TopArticlesWidgetProps {
  articles: KBArticle[];
  onSelectArticle: (article: KBArticle) => void;
}

export const TopArticlesWidget: React.FC<TopArticlesWidgetProps> = ({ articles, onSelectArticle }) => {
  return (
    <div className="glass-panel rounded-2xl border border-slate-800 p-6 shadow-xl space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-indigo-400" />
            Artigos KB Mais Acessados / Úteis
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Procedimentos mais consultados pela equipe no turno
          </p>
        </div>
      </div>

      <div className="space-y-3 pt-2">
        {articles.slice(0, 4).map((art) => (
          <div
            key={art.id}
            onClick={() => onSelectArticle(art)}
            className="p-3.5 rounded-xl bg-slate-800/40 hover:bg-slate-800/80 border border-slate-700/50 transition-all cursor-pointer group flex items-start justify-between gap-3"
          >
            <div className="space-y-1">
              <span className="inline-block px-2 py-0.5 rounded text-[10px] font-semibold bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                {art.categoryName}
              </span>
              <h4 className="text-xs font-bold text-slate-200 group-hover:text-indigo-300 transition-colors">
                {art.title}
              </h4>
              <p className="text-[11px] text-slate-400 line-clamp-1">
                {art.summary}
              </p>
            </div>

            <div className="flex flex-col items-end shrink-0 space-y-1 text-[11px]">
              <span className="flex items-center gap-1 font-semibold text-emerald-400">
                <ThumbsUp className="w-3 h-3" />
                {art.helpfulCount}
              </span>
              <span className="flex items-center gap-1 text-slate-400 text-[10px]">
                <Eye className="w-3 h-3" />
                {art.viewsCount}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
