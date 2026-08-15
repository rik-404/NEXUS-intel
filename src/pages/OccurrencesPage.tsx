import React, { useState } from 'react';
import { OccurrenceForm } from '../components/occurrences/OccurrenceForm';
import { OccurrenceList } from '../components/occurrences/OccurrenceList';
import { DataService } from '../lib/supabase';
import { Occurrence } from '../lib/types';
import { Plus, ListFilter, Headphones } from 'lucide-react';

export const OccurrencesPage: React.FC = () => {
  const [occurrences, setOccurrences] = useState<Occurrence[]>(() => DataService.getOccurrences());
  const [activeSubTab, setActiveSubTab] = useState<'form' | 'list'>('form');

  const handleOccurrenceCreated = (newOcc: Occurrence) => {
    setOccurrences(DataService.getOccurrences());
    setActiveSubTab('list');
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Tab Selector */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div>
          <h1 className="text-xl font-extrabold text-white flex items-center gap-2">
            <Headphones className="w-5 h-5 text-indigo-400" />
            Módulo de Atendimentos & Ocorrências
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Registro instantâneo de ocorrencias e consulta ao histórico de atendimentos do turno.
          </p>
        </div>

        <div className="flex items-center space-x-2 bg-slate-900 border border-slate-800 p-1 rounded-xl">
          <button
            onClick={() => setActiveSubTab('form')}
            className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center space-x-2 ${
              activeSubTab === 'form'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Nova Ocorrência</span>
          </button>

          <button
            onClick={() => setActiveSubTab('list')}
            className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center space-x-2 ${
              activeSubTab === 'list'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <ListFilter className="w-3.5 h-3.5" />
            <span>Histórico ({occurrences.length})</span>
          </button>
        </div>
      </div>

      {/* Tab Contents */}
      {activeSubTab === 'form' ? (
        <OccurrenceForm onSuccess={handleOccurrenceCreated} />
      ) : (
        <OccurrenceList occurrences={occurrences} />
      )}
    </div>
  );
};
