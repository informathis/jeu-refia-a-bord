import React from 'react';
import { PlayerState, Scenario, DecisionType } from '../types';
import { RotateCcw, Award, AlertTriangle, FileText, CheckCircle } from 'lucide-react';

interface Props {
  state: PlayerState;
  scenarios: Scenario[];
  onRestart: () => void;
}

const Dashboard: React.FC<Props> = ({ state, scenarios, onRestart }) => {
  const maxScore = scenarios.length * 100;
  const percentage = Math.round((state.totalScore / maxScore) * 100);

  const getRank = (p: number) => {
    if (p >= 80) return "Amiral de l'IA";
    if (p >= 60) return "Skipper Confirmé";
    if (p >= 40) return "Matelot IA";
    return "Moussaillon";
  };

  return (
    <div className="max-w-4xl mx-auto p-6 animate-fade-in">
      <div className="bg-white rounded-xl shadow-xl overflow-hidden mb-8">
        <div className="bg-blue-900 p-8 text-white text-center">
          <h2 className="text-3xl font-bold mb-2">Fin de la Traversée</h2>
          <p className="opacity-90">Vos décisions ont façonné l'avenir numérique de VNF.</p>
        </div>

        <div className="p-8 grid md:grid-cols-2 gap-8 items-center">
          <div className="text-center md:text-left">
            <div className="text-sm uppercase tracking-wide text-slate-500 font-bold mb-1">Score Final</div>
            <div className="text-5xl font-bold text-blue-600 mb-2">{state.totalScore} <span className="text-2xl text-slate-400">/ {maxScore}</span></div>
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-100 text-amber-800 rounded-full font-bold">
              <Award size={20} />
              {getRank(percentage)}
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center text-sm font-medium text-slate-600">
              <span>Pertinence Décisionnelle</span>
              <span>{percentage}%</span>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-3">
              <div 
                className="bg-blue-600 h-3 rounded-full transition-all duration-1000" 
                style={{ width: `${percentage}%` }}
              ></div>
            </div>
            <p className="text-sm text-slate-500 italic">
              Basé sur la qualité de vos diagnostics et la sécurité de vos approches.
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 mb-8">
        {state.history.map((entry, idx) => {
          const scenario = scenarios.find(s => s.id === entry.scenarioId);
          if (!scenario) return null;
          const isSuccess = entry.decision === scenario.correctDecision;

          return (
            <div key={idx} className={`bg-white p-5 rounded-lg border-l-4 shadow-sm ${isSuccess ? 'border-green-500' : 'border-red-400'}`}>
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-bold text-slate-800">{scenario.title}</h3>
                {isSuccess ? <CheckCircle size={18} className="text-green-500" /> : <AlertTriangle size={18} className="text-red-400" />}
              </div>
              <div className="text-sm text-slate-600 mb-2">
                Votre choix : <span className="font-medium">{entry.decision}</span> (Attendu : {scenario.correctDecision})
              </div>
              <p className="text-xs text-slate-500 italic border-t pt-2 mt-2">
                 "{isSuccess ? scenario.feedbackSuccess : scenario.feedbackFail.slice(0, 80) + '...'}"
              </p>
            </div>
          );
        })}
      </div>

      <div className="flex justify-center">
        <button
          onClick={onRestart}
          className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg shadow-md flex items-center gap-2 transition-colors"
        >
          <RotateCcw size={20} />
          Nouvelle Traversée
        </button>
      </div>
    </div>
  );
};

export default Dashboard;
