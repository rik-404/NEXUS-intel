import React from 'react';
import { Search, Filter, Plus } from 'lucide-react';
import { Category } from '../../lib/types';

interface KBSearchBarProps {
  searchTerm: string;
  onSearchChange: (val: string) => void;
  selectedCategory: string;
  onCategorySelect: (catId: string) => void;
  categories: Category[];
  onCreateArticle?: () => void;
  canCreate: boolean;
}

export const KBSearchBar: React.FC<KBSearchBarProps> = ({
  searchTerm,
  onSearchChange,
  selectedCategory,
  onCategorySelect,
  categories,
  onCreateArticle,
  canCreate
}) => {
  return (
    <div className="space-y-4">
      {/* Search Input & Action Button */}
      <div className="flex flex-col sm:flex-row items-center gap-4">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Buscar artigos por título, conteúdo, tag ou sintoma..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full bg-slate-900 border border-slate-700/80 rounded-2xl pl-11 pr-4 py-3 text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-inner"
          />
        </div>

        {canCreate && onCreateArticle && (
          <button
            onClick={onCreateArticle}
            className="w-full sm:w-auto px-5 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition-colors flex items-center justify-center space-x-2 shrink-0 shadow-lg shadow-indigo-500/20"
          >
            <Plus className="w-4 h-4" />
            <span>Novo Artigo</span>
          </button>
        )}
      </div>

      {/* Category Pills */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-2 scrollbar-none">
        <button
          onClick={() => onCategorySelect('ALL')}
          className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all shrink-0 ${
            selectedCategory === 'ALL'
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20 font-semibold'
              : 'bg-slate-800/80 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
          }`}
        >
          Todas as Categorias
        </button>

        {categories.map((cat) => {
          const isSelected = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => onCategorySelect(cat.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all shrink-0 ${
                isSelected
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20 font-semibold'
                  : 'bg-slate-800/80 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              {cat.name}
            </button>
          );
        })}
      </div>
    </div>
  );
};
