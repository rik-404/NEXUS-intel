import React from 'react';
import { KBArticle } from '../../lib/types';
import { BookOpen, ThumbsUp, Eye, Star, User, Tag, ShieldAlert } from 'lucide-react';

interface KBArticleCardProps {
  article: KBArticle;
  onReadArticle: (article: KBArticle) => void;
  onToggleFavorite: (articleId: string) => void;
}

export const KBArticleCard: React.FC<KBArticleCardProps> = ({
  article,
  onReadArticle,
  onToggleFavorite
}) => {
  const statusBadgeMap = {
    publicado: { label: 'Publicado', class: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' },
    em_revisao: { label: 'Em Revisão', class: 'bg-amber-500/10 text-amber-400 border-amber-500/20' },
    rascunho: { label: 'Rascunho', class: 'bg-slate-700/50 text-slate-300 border-slate-600' },
    arquivado: { label: 'Arquivado', class: 'bg-rose-500/10 text-rose-400 border-rose-500/20' },
  };

  return (
    <div
      onClick={() => onReadArticle(article)}
      className="glass-card rounded-2xl border border-slate-800 p-5 hover:border-indigo-500/40 transition-all duration-300 cursor-pointer flex flex-col justify-between group relative overflow-hidden"
    >
      <div className="space-y-3">
        {/* Category & Governance Status */}
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-semibold uppercase tracking-wider px-2.5 py-1 rounded-lg bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
            {article.categoryName}
          </span>

          <div className="flex items-center space-x-2">
            <span className={`text-[10px] font-medium px-2 py-0.5 rounded border ${statusBadgeMap[article.status].class}`}>
              {statusBadgeMap[article.status].label}
            </span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggleFavorite(article.id);
              }}
              className={`p-1 rounded-lg hover:bg-slate-800 transition-colors ${
                article.isFavorite ? 'text-amber-400' : 'text-slate-500 hover:text-slate-300'
              }`}
              title={article.isFavorite ? 'Remover dos favoritos' : 'Favoritar artigo'}
            >
              <Star className="w-4 h-4 fill-current" />
            </button>
          </div>
        </div>

        {/* Title & Summary */}
        <div>
          <h3 className="text-sm font-bold text-white group-hover:text-indigo-300 transition-colors leading-snug">
            {article.title}
          </h3>
          <p className="text-xs text-slate-400 mt-1.5 line-clamp-2 leading-relaxed">
            {article.summary}
          </p>
        </div>

        {/* Tags */}
        {article.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 pt-1">
            {article.tags.map((tag, idx) => (
              <span key={idx} className="text-[10px] text-slate-400 bg-slate-900/80 px-2 py-0.5 rounded-md border border-slate-800">
                #{tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Card Footer: Metadata & Metrics */}
      <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
        <div className="flex items-center space-x-1">
          <User className="w-3 h-3 text-slate-400" />
          <span>{article.authorName}</span>
        </div>

        <div className="flex items-center space-x-3">
          <span className="flex items-center gap-1 font-semibold text-emerald-400">
            <ThumbsUp className="w-3 h-3" />
            {article.helpfulCount}
          </span>
          <span className="flex items-center gap-1">
            <Eye className="w-3 h-3 text-slate-400" />
            {article.viewsCount}
          </span>
        </div>
      </div>
    </div>
  );
};
