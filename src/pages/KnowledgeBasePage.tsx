import React, { useState } from 'react';
import { DataService } from '../lib/supabase';
import { KBArticle } from '../lib/types';
import { KBSearchBar } from '../components/kb/KBSearchBar';
import { KBArticleCard } from '../components/kb/KBArticleCard';
import { KBArticleReader } from '../components/kb/KBArticleReader';
import { BookOpen, Star, Plus, ShieldCheck } from 'lucide-react';

interface KnowledgeBasePageProps {
  selectedArticleForReading?: KBArticle | null;
  onClearSelectedArticle?: () => void;
}

export const KnowledgeBasePage: React.FC<KnowledgeBasePageProps> = ({
  selectedArticleForReading,
  onClearSelectedArticle
}) => {
  const [articles, setArticles] = useState<KBArticle[]>(() => DataService.getArticles());
  const categories = DataService.getCategories();
  const currentUser = DataService.getCurrentUser();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [activeArticle, setActiveArticle] = useState<KBArticle | null>(selectedArticleForReading || null);
  const [showOnlyFavorites, setShowOnlyFavorites] = useState(false);
  const [showNewModal, setShowNewModal] = useState(false);

  // New Article Form state
  const [newTitle, setNewTitle] = useState('');
  const [newCategoryId, setNewCategoryId] = useState(categories[0]?.id || '');
  const [newSummary, setNewSummary] = useState('');
  const [newContent, setNewContent] = useState('');
  const [newTags, setNewTags] = useState('');

  const canCreateOrManage = ['lider', 'supervisor', 'administrador'].includes(currentUser.role);

  const handleReadArticle = (article: KBArticle) => {
    setActiveArticle(article);
  };

  const handleBackToList = () => {
    setActiveArticle(null);
    if (onClearSelectedArticle) onClearSelectedArticle();
  };

  const handleVote = (articleId: string, isHelpful: boolean) => {
    const updated = DataService.voteArticleHelpful(articleId, isHelpful);
    setArticles(DataService.getArticles());
    if (activeArticle && activeArticle.id === articleId) {
      setActiveArticle(updated);
    }
  };

  const handleToggleFavorite = (articleId: string) => {
    const updated = DataService.toggleFavoriteArticle(articleId);
    setArticles(DataService.getArticles());
    if (activeArticle && activeArticle.id === articleId) {
      setActiveArticle(updated);
    }
  };

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) return;

    const catObj = categories.find(c => c.id === newCategoryId);

    const created = DataService.createArticle({
      title: newTitle,
      categoryId: newCategoryId,
      categoryName: catObj?.name || 'Geral',
      summary: newSummary,
      content: newContent,
      authorId: currentUser.id,
      authorName: currentUser.fullName,
      status: canCreateOrManage ? 'publicado' : 'rascunho',
      tags: newTags.split(',').map(t => t.trim()).filter(Boolean)
    });

    setArticles(DataService.getArticles());
    setShowNewModal(false);
    setNewTitle('');
    setNewSummary('');
    setNewContent('');
    setNewTags('');
    setActiveArticle(created);
  };

  // Filter logic
  const filteredArticles = articles.filter((art) => {
    // Non-supervisors only see 'publicado' unless they are author
    if (!canCreateOrManage && art.status !== 'publicado' && art.authorId !== currentUser.id) {
      return false;
    }

    const matchesCategory = selectedCategory === 'ALL' || art.categoryId === selectedCategory;
    const matchesFavorites = !showOnlyFavorites || art.isFavorite;

    const term = searchTerm.toLowerCase();
    const matchesSearch = 
      art.title.toLowerCase().includes(term) ||
      art.summary.toLowerCase().includes(term) ||
      art.content.toLowerCase().includes(term) ||
      art.tags.some(t => t.toLowerCase().includes(term));

    return matchesCategory && matchesFavorites && matchesSearch;
  });

  if (activeArticle) {
    return (
      <KBArticleReader
        article={activeArticle}
        onBack={handleBackToList}
        onVote={handleVote}
        onToggleFavorite={handleToggleFavorite}
      />
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h1 className="text-xl font-extrabold text-white flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-indigo-400" />
            Base de Conhecimento Viva
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Artigos categorizados, procedimentos operacionais padronizados e FAQ com histórico de versões.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => setShowOnlyFavorites(!showOnlyFavorites)}
            className={`px-3 py-1.5 rounded-xl border text-xs font-semibold transition-colors flex items-center space-x-1.5 ${
              showOnlyFavorites
                ? 'bg-amber-500/15 border-amber-500/30 text-amber-300'
                : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            <Star className={`w-3.5 h-3.5 ${showOnlyFavorites ? 'fill-amber-400' : ''}`} />
            <span>Meus Favoritos</span>
          </button>
        </div>
      </div>

      {/* Search Bar & Categories */}
      <KBSearchBar
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        selectedCategory={selectedCategory}
        onCategorySelect={setSelectedCategory}
        categories={categories}
        onCreateArticle={() => setShowNewModal(true)}
        canCreate={canCreateOrManage}
      />

      {/* Articles Grid */}
      {filteredArticles.length === 0 ? (
        <div className="text-center py-16 glass-panel rounded-2xl border border-slate-800">
          <p className="text-sm font-semibold text-slate-300">Nenhum artigo encontrado.</p>
          <p className="text-xs text-slate-500 mt-1">Tente ajustar a busca ou os filtros de categoria.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredArticles.map((art) => (
            <KBArticleCard
              key={art.id}
              article={art}
              onReadArticle={handleReadArticle}
              onToggleFavorite={handleToggleFavorite}
            />
          ))}
        </div>
      )}

      {/* Modal for Creating New Article */}
      {showNewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="glass-panel w-full max-w-2xl rounded-2xl border border-slate-700 bg-slate-900 p-6 shadow-2xl space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Plus className="w-5 h-5 text-indigo-400" />
              Criar Novo Artigo da Base de Conhecimento
            </h3>

            <form onSubmit={handleCreateSubmit} className="space-y-4 text-xs text-slate-300">
              <div>
                <label className="block font-semibold mb-1">Título do Artigo *</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Procedimento para Ajuste de Cobrança Indevida..."
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Categoria *</label>
                <select
                  value={newCategoryId}
                  onChange={(e) => setNewCategoryId(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100"
                >
                  {categories.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold mb-1">Resumo Executivo</label>
                <input
                  type="text"
                  placeholder="Resumo curto de 1 frase para aparecer nos cards..."
                  value={newSummary}
                  onChange={(e) => setNewSummary(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Conteúdo do Artigo (Markdown) *</label>
                <textarea
                  rows={6}
                  required
                  placeholder="## Visão Geral&#10;Passos para solução..."
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-xs text-slate-100 font-mono"
                ></textarea>
              </div>

              <div>
                <label className="block font-semibold mb-1">Tags (separadas por vírgula)</label>
                <input
                  type="text"
                  placeholder="pix, cartao, erro, cadastro"
                  value={newTags}
                  onChange={(e) => setNewTags(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100"
                />
              </div>

              <div className="flex justify-end space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowNewModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-semibold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-indigo-600 text-white font-semibold shadow-lg shadow-indigo-500/25"
                >
                  Salvar Artigo
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
