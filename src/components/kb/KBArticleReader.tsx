import React, { useState } from 'react';
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
  AlertTriangle,
  BookOpen,
  Copy,
  Check,
  Sparkles,
  Tag,
  ShieldCheck,
  ExternalLink,
  MessageSquareText
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
  const [copied, setCopied] = useState(false);

  if (!article) return null;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  // Estimate reading time in minutes based on word count
  const wordCount = article.content.split(/\s+/).length;
  const readTimeMin = Math.max(1, Math.ceil(wordCount / 200));

  return (
    <div className="space-y-6 max-w-4xl mx-auto animate-fade-in pb-12 select-text">
      {/* Navigation & Header Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800/80 pb-4">
        <button
          onClick={onBack}
          className="px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white text-xs font-semibold transition-all flex items-center space-x-2 shadow-sm"
        >
          <ArrowLeft className="w-4 h-4 text-indigo-400" />
          <span>Voltar para a Base de Conhecimento</span>
        </button>

        <div className="flex items-center space-x-2">
          <button
            onClick={handleCopyLink}
            className="px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white text-xs font-medium transition-all flex items-center space-x-1.5"
            title="Copiar link do procedimento"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400 font-semibold">Copiado!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-slate-400" />
                <span>Copiar Link</span>
              </>
            )}
          </button>

          <button
            onClick={() => onToggleFavorite(article.id)}
            className={`px-4 py-2 rounded-xl border text-xs font-semibold transition-all flex items-center space-x-1.5 ${
              article.isFavorite
                ? 'bg-amber-500/15 border-amber-500/30 text-amber-300 shadow-lg shadow-amber-500/10'
                : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            <Star className={`w-4 h-4 ${article.isFavorite ? 'fill-amber-400 text-amber-400' : ''}`} />
            <span>{article.isFavorite ? 'Favorito' : 'Favoritar'}</span>
          </button>
        </div>
      </div>

      {/* Main Article Hero Card */}
      <div className="glass-panel rounded-3xl border border-slate-800 p-8 shadow-2xl space-y-6 relative overflow-hidden bg-slate-900/90 backdrop-blur-xl">
        {/* Decorative background glow */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-600/10 rounded-full blur-[100px] pointer-events-none"></div>

        {/* Category & Status Badges */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800/80 pb-4">
          <div className="flex items-center space-x-2">
            <span className="px-3 py-1 rounded-lg bg-indigo-500/15 text-indigo-300 border border-indigo-500/30 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5 text-indigo-400" />
              {article.categoryName}
            </span>

            <span className="px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[11px] font-semibold flex items-center gap-1">
              <ShieldCheck className="w-3 h-3" />
              Verificado & Atualizado
            </span>
          </div>

          <div className="flex items-center space-x-3 text-xs text-slate-400 font-mono">
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-slate-500" /> ~{readTimeMin} min de leitura
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <History className="w-3.5 h-3.5 text-slate-500" /> Versão {article.currentVersion}.0
            </span>
          </div>
        </div>

        {/* Title */}
        <div className="space-y-3">
          <h1 className="text-2xl lg:text-3xl font-extrabold text-white leading-tight tracking-tight">
            {article.title}
          </h1>

          {/* Author & Timestamp */}
          <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 pt-1">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center font-bold text-indigo-300 text-[10px]">
                {article.authorName.split(' ').map(n => n[0]).slice(0, 2).join('')}
              </div>
              <span>Autor: <strong className="text-slate-200 font-semibold">{article.authorName}</strong></span>
            </div>

            {article.reviewerName && (
              <div className="flex items-center gap-1.5 text-emerald-400">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Revisado por: <strong>{article.reviewerName}</strong></span>
              </div>
            )}

            <div className="flex items-center gap-1.5 text-slate-400">
              <Clock className="w-3.5 h-3.5" />
              <span>Última atualização: {new Date(article.updatedAt).toLocaleDateString('pt-BR')}</span>
            </div>
          </div>
        </div>

        {/* Executive Summary Callout Box */}
        {article.summary && (
          <div className="p-4 rounded-2xl bg-gradient-to-r from-indigo-950/50 to-slate-900 border border-indigo-500/30 text-xs text-slate-200 leading-relaxed font-medium space-y-1">
            <div className="flex items-center gap-2 text-indigo-300 font-bold uppercase tracking-wider text-[11px]">
              <Sparkles className="w-4 h-4 text-indigo-400" />
              <span>Resumo Executivo / Solução Rápida</span>
            </div>
            <p className="text-slate-300">{article.summary}</p>
          </div>
        )}

        {/* Main Article Content Renderer */}
        <div className="prose prose-invert max-w-none text-xs leading-relaxed text-slate-200 space-y-4 pt-4 border-t border-slate-800/80 font-sans">
          {article.content.split('\n\n').map((paragraph, index) => {
            // H2 Header
            if (paragraph.startsWith('## ')) {
              return (
                <div key={index} className="pt-4 border-b border-slate-800 pb-2 mb-3">
                  <h2 className="text-base font-bold text-white flex items-center gap-2">
                    <span className="w-1.5 h-4 bg-indigo-500 rounded-full"></span>
                    {paragraph.replace('## ', '')}
                  </h2>
                </div>
              );
            }

            // H3 Header
            if (paragraph.startsWith('### ')) {
              return (
                <h3 key={index} className="text-xs font-bold text-indigo-300 mt-4 mb-2 flex items-center gap-1.5">
                  <span className="w-1 h-3 bg-violet-400 rounded-full"></span>
                  {paragraph.replace('### ', '')}
                </h3>
              );
            }

            // Warning Callout Box (> WARNING / ALERT)
            if (paragraph.startsWith('> ')) {
              return (
                <div key={index} className="p-4 rounded-2xl bg-amber-500/10 border-l-4 border-amber-400 text-amber-200 text-xs my-4 space-y-1 shadow-sm">
                  <div className="flex items-center gap-2 font-bold text-amber-300 uppercase tracking-wider text-[10px]">
                    <AlertTriangle className="w-4 h-4 shrink-0 text-amber-400" />
                    <span>Atenção Importante / Regra de Negócio</span>
                  </div>
                  <p className="leading-relaxed">{paragraph.replace('> ', '')}</p>
                </div>
              );
            }

            // Code Block
            if (paragraph.startsWith('```')) {
              const codeLines = paragraph.split('\n').filter(l => !l.startsWith('```'));
              return (
                <div key={index} className="p-4 rounded-2xl bg-slate-950 border border-slate-800 font-mono text-[11px] text-indigo-300 overflow-x-auto my-3">
                  {codeLines.map((line, lIdx) => (
                    <div key={lIdx}>{line}</div>
                  ))}
                </div>
              );
            }

            // Standard Paragraph
            return (
              <p key={index} className="text-slate-300 leading-relaxed font-normal">
                {paragraph}
              </p>
            );
          })}
        </div>

        {/* Tags Cloud */}
        {article.tags && article.tags.length > 0 && (
          <div className="pt-4 border-t border-slate-800/80 flex items-center gap-2 flex-wrap">
            <Tag className="w-3.5 h-3.5 text-slate-500 shrink-0" />
            <span className="text-xs font-semibold text-slate-400">Palavras-chave:</span>
            {article.tags.map((tag, idx) => (
              <span 
                key={idx}
                className="px-2.5 py-1 rounded-lg bg-slate-800/80 text-slate-300 border border-slate-700/60 text-[11px] font-medium"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* Attachments Section */}
        {article.attachments && article.attachments.length > 0 && (
          <div className="pt-6 border-t border-slate-800 space-y-3">
            <h4 className="text-xs font-bold text-slate-200 flex items-center gap-2">
              <Paperclip className="w-4 h-4 text-indigo-400" />
              Anexos e Documentos de Apoio ({article.attachments.length})
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {article.attachments.map((att) => (
                <a
                  key={att.id}
                  href={att.fileUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="p-3 rounded-xl bg-slate-950 border border-slate-800 hover:border-indigo-500/40 text-xs text-slate-300 flex items-center justify-between group transition-all shadow-sm"
                >
                  <div className="flex items-center space-x-2.5 truncate">
                    <Paperclip className="w-4 h-4 text-indigo-400 shrink-0" />
                    <span className="truncate font-medium group-hover:text-indigo-300">{att.fileName}</span>
                  </div>
                  <ExternalLink className="w-3.5 h-3.5 text-slate-500 group-hover:text-indigo-400 shrink-0 ml-2" />
                </a>
              ))}
            </div>
          </div>
        )}

        {/* Useful / Not Useful Feedback Bar ("Fechar o loop") */}
        <div className="mt-8 p-6 rounded-2xl bg-gradient-to-r from-slate-950 via-slate-900 to-indigo-950/60 border border-indigo-500/30 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl">
          <div>
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              <MessageSquareText className="w-4 h-4 text-indigo-400" />
              Este artigo resolveu o seu atendimento?
            </h4>
            <p className="text-xs text-slate-400 mt-0.5">
              Seu feedback aprimora a assertividade da Base de Conhecimento em tempo real.
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={() => onVote(article.id, true)}
              className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center space-x-2 border cursor-pointer active:scale-95 ${
                article.userVote === 'helpful'
                  ? 'bg-emerald-600 text-white border-emerald-500 shadow-lg shadow-emerald-500/25'
                  : 'bg-slate-900 text-slate-200 border-slate-700 hover:bg-slate-800'
              }`}
            >
              <ThumbsUp className="w-4 h-4 text-emerald-400" />
              <span>Sim, Útil ({article.helpfulCount})</span>
            </button>

            <button
              onClick={() => onVote(article.id, false)}
              className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center space-x-2 border cursor-pointer active:scale-95 ${
                article.userVote === 'not_helpful'
                  ? 'bg-rose-600 text-white border-rose-500 shadow-lg shadow-rose-500/25'
                  : 'bg-slate-900 text-slate-200 border-slate-700 hover:bg-slate-800'
              }`}
            >
              <ThumbsDown className="w-4 h-4 text-rose-400" />
              <span>Não Resolveu ({article.notHelpfulCount})</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
