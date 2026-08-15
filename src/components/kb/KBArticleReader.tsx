import React from 'react';
import { KBArticle } from '../../lib/types';
import { 
  ArrowLeft, 
  ThumbsUp, 
  ThumbsDown, 
  Star, 
  Clock, 
  User, 
  History, 
  Paperclip, 
  Share2,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';

interface KBArticleReaderProps {
  article: KBArticle | null;
  onBack: () => void;
  onVote: (articleId: string, isHelpful: boolean) => void;
  onToggleFavorite: (articleId: string) => void;
}

export const KBArticleReader: React.FC<KBArticleReaderProps> = ({
  article,
  onBack,
  onVote,
  onToggleFavorite
}) => {
  if (!article) return null;

  return (
    <div className="glass-panel rounded-2xl border border-slate-800 p-6 lg:p-8 shadow-xl space-y-6 animate-fade-in max-w-4xl mx-auto">
      {/* Top Header Navigation */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-800">
        <button
          onClick={onBack}
          className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors flex items-center space-x-2"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Voltar para a Base de Conhecimento</span>
        </button>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => onToggleFavorite(article.id)}
            className={`px-3 py-1.5 rounded-xl border text-xs font-medium transition-colors flex items-center space-x-1.5 ${
              article.isFavorite
                ? 'bg-amber-500/15 border-amber-500/30 text-amber-300'
                : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-slate-200'
            }`}
          >
            <Star className={`w-3.5 h-3.5 ${article.isFavorite ? 'fill-amber-400' : ''}`} />
            <span>{article.isFavorite ? 'Favoritado' : 'Favoritar'}</span>
          </button>
        </div>
      </div>

      {/* Article Title & Metadata */}
      <div className="space-y-4">
        <div className="flex items-center space-x-3 text-xs">
          <span className="px-2.5 py-1 rounded-lg bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 font-semibold uppercase">
            {article.categoryName}
          </span>
          <span className="flex items-center gap-1 text-slate-400 font-mono">
            <History className="w-3.5 h-3.5" /> Versão {article.currentVersion}.0
          </span>
        </div>

        <h1 className="text-2xl lg:text-3xl font-extrabold text-white leading-tight">
          {article.title}
        </h1>

        <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 pt-1 border-b border-slate-800 pb-4">
          <div className="flex items-center gap-1.5">
            <User className="w-3.5 h-3.5 text-indigo-400" />
            <span>Autor: <strong>{article.authorName}</strong></span>
          </div>
          {article.reviewerName && (
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>Revisado por: <strong>{article.reviewerName}</strong></span>
            </div>
          )}
          <div className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            <span>Atualizado em {new Date(article.updatedAt).toLocaleDateString('pt-BR')}</span>
          </div>
        </div>
      </div>

      {/* Summary Box */}
      {article.summary && (
        <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 text-xs text-slate-300 leading-relaxed font-medium">
          <strong className="text-indigo-300 block mb-1">Resumo Executivo:</strong>
          {article.summary}
        </div>
      )}

      {/* Main Body (Simulated Markdown Renderer) */}
      <div className="prose prose-invert max-w-none text-xs leading-relaxed text-slate-200 space-y-4 pt-2 font-sans">
        {article.content.split('\n\n').map((paragraph, index) => {
          if (paragraph.startsWith('## ')) {
            return (
              <h2 key={index} className="text-lg font-bold text-white border-b border-slate-800 pb-2 mt-6">
                {paragraph.replace('## ', '')}
              </h2>
            );
          }
          if (paragraph.startsWith('### ')) {
            return (
              <h3 key={index} className="text-sm font-bold text-indigo-300 mt-4">
                {paragraph.replace('### ', '')}
              </h3>
            );
          }
          if (paragraph.startsWith('> ')) {
            return (
              <div key={index} className="p-3.5 rounded-xl bg-amber-500/10 border-l-4 border-amber-400 text-amber-200 text-xs my-3">
                {paragraph.replace('> ', '')}
              </div>
            );
          }
          return <p key={index} className="text-slate-300">{paragraph}</p>;
        })}
      </div>

      {/* Attachments Section */}
      {article.attachments && article.attachments.length > 0 && (
        <div className="pt-6 border-t border-slate-800 space-y-3">
          <h4 className="text-xs font-bold text-slate-300 flex items-center gap-2">
            <Paperclip className="w-4 h-4 text-indigo-400" />
            Anexos e Documentos Vinculados
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {article.attachments.map((att) => (
              <a
                key={att.id}
                href={att.fileUrl}
                target="_blank"
                rel="noreferrer"
                className="p-3 rounded-xl bg-slate-900 border border-slate-800 hover:border-indigo-500/40 text-xs text-slate-300 flex items-center justify-between group transition-colors"
              >
                <div className="flex items-center space-x-2 truncate">
                  <Paperclip className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                  <span className="truncate group-hover:text-indigo-300">{att.fileName}</span>
                </div>
                <span className="text-[10px] text-slate-500 uppercase">{att.fileType}</span>
              </a>
            ))}
          </div>
        </div>
      )}

      {/* Helpful / Not Helpful Feedback Bar ("Fechar o loop") */}
      <div className="mt-8 p-6 rounded-2xl bg-gradient-to-r from-slate-900 to-indigo-950/40 border border-indigo-500/30 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h4 className="text-sm font-bold text-white">Este artigo resolveu o seu atendimento?</h4>
          <p className="text-xs text-slate-400 mt-0.5">
            Seu feedback treina os algoritmos de detecção de utilidade da KB.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => onVote(article.id, true)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all flex items-center space-x-2 border ${
              article.userVote === 'helpful'
                ? 'bg-emerald-600 text-white border-emerald-500 shadow-lg shadow-emerald-500/20'
                : 'bg-slate-800 text-slate-200 border-slate-700 hover:bg-slate-700'
            }`}
          >
            <ThumbsUp className="w-4 h-4" />
            <span>Útil ({article.helpfulCount})</span>
          </button>

          <button
            onClick={() => onVote(article.id, false)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all flex items-center space-x-2 border ${
              article.userVote === 'not_helpful'
                ? 'bg-rose-600 text-white border-rose-500 shadow-lg shadow-rose-500/20'
                : 'bg-slate-800 text-slate-200 border-slate-700 hover:bg-slate-700'
            }`}
          >
            <ThumbsDown className="w-4 h-4" />
            <span>Não resolveu ({article.notHelpfulCount})</span>
          </button>
        </div>
      </div>
    </div>
  );
};
