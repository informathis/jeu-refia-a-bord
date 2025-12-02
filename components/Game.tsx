import React, { useState, useMemo } from 'react';
import { PlayerState, Scenario, CasePhase, DecisionType, RiskLevel, Stakeholder } from '../types';
import { ChevronRight, HelpCircle, Check, TriangleAlert, BookOpen, Anchor } from 'lucide-react';

interface Props {
  scenarios: Scenario[];
  onComplete: (history: PlayerState['history']) => void;
}

const Game: React.FC<Props> = ({ scenarios, onComplete }) => {
  const [currentScenarioIdx, setCurrentScenarioIdx] = useState(0);
  const [phase, setPhase] = useState<CasePhase>(CasePhase.DISCOVERY);
  const [history, setHistory] = useState<PlayerState['history']>([]);
  
  // Local state for current turn
  const [askedQuestions, setAskedQuestions] = useState<string[]>([]);
  const [selectedDecision, setSelectedDecision] = useState<DecisionType | null>(null);
  const [selectedRisk, setSelectedRisk] = useState<RiskLevel | null>(null);
  const [selectedStakeholders, setSelectedStakeholders] = useState<string[]>([]);
  const [selectedBenefits, setSelectedBenefits] = useState<string[]>([]);
  const [selectedVigilance, setSelectedVigilance] = useState<string[]>([]);

  const currentScenario = scenarios[currentScenarioIdx];

  const handleNextPhase = () => {
    window.scrollTo(0, 0);
    if (phase === CasePhase.DISCOVERY) {
      setPhase(CasePhase.DIAGNOSTIC);
    } else if (phase === CasePhase.DIAGNOSTIC) {
      if (selectedDecision && selectedRisk) {
        setPhase(CasePhase.LOGBOOK);
      }
    } else if (phase === CasePhase.LOGBOOK) {
      // Calculate Score for this scenario
      let scenarioScore = 0;
      
      // Question Relevance (Max 30pts)
      const questionScore = currentScenario.questions
        .filter(q => askedQuestions.includes(q.id))
        .reduce((acc, q) => acc + q.relevance, 0);
      scenarioScore += Math.min(30, questionScore); // Cap at 30

      // Decision Accuracy (Max 40pts)
      if (selectedDecision === currentScenario.correctDecision) scenarioScore += 40;
      else if (
        (currentScenario.correctDecision === DecisionType.C && selectedDecision === DecisionType.B) ||
        (currentScenario.correctDecision === DecisionType.A && selectedDecision === DecisionType.D)
      ) scenarioScore += 15; // Partial credit

      // Risk Assessment (Max 10pts)
      if (selectedRisk === currentScenario.correctRisk) scenarioScore += 10;

      // Synthesis Quality (Stakeholders + Logbook) (Max 20pts)
      const requiredStakeholders = currentScenario.stakeholders.filter(s => s.required).map(s => s.id);
      const caughtStakeholders = selectedStakeholders.filter(id => requiredStakeholders.includes(id)).length;
      scenarioScore += (caughtStakeholders / Math.max(requiredStakeholders.length, 1)) * 10;
      
      if (selectedBenefits.length > 0 && selectedVigilance.length > 0) scenarioScore += 10;

      // Save History
      const newHistory = [...history, {
        scenarioId: currentScenario.id,
        score: Math.round(scenarioScore),
        decision: selectedDecision!,
        risk: selectedRisk!,
        questionsAsked: askedQuestions,
        logbookBenefits: selectedBenefits,
        logbookVigilance: selectedVigilance
      }];
      setHistory(newHistory);

      // Next Scenario or Finish
      if (currentScenarioIdx < scenarios.length - 1) {
        setCurrentScenarioIdx(curr => curr + 1);
        // Reset Local State
        setPhase(CasePhase.DISCOVERY);
        setAskedQuestions([]);
        setSelectedDecision(null);
        setSelectedRisk(null);
        setSelectedStakeholders([]);
        setSelectedBenefits([]);
        setSelectedVigilance([]);
      } else {
        onComplete(newHistory);
      }
    }
  };

  // Render Helpers
  const renderProgressBar = () => (
    <div className="w-full bg-blue-100 h-4 rounded-full mb-6 relative overflow-hidden">
      <div 
        className="bg-amber-500 h-full transition-all duration-500 ease-in-out"
        style={{ width: `${((currentScenarioIdx) / scenarios.length) * 100}%` }}
      />
      {/* Buoys */}
      {scenarios.map((_, idx) => (
        <div 
          key={idx} 
          className={`absolute top-0 w-1 h-full bg-white/50 border-r border-white/20`}
          style={{ left: `${((idx + 1) / scenarios.length) * 100}%` }}
        />
      ))}
    </div>
  );

  // --- PHASE 1: DISCOVERY ---
  if (phase === CasePhase.DISCOVERY) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-8">
        {renderProgressBar()}
        
        <div className="bg-white rounded-xl shadow-lg border border-blue-100 overflow-hidden">
          <div className="bg-blue-600 p-6 text-white flex justify-between items-center">
            <div>
              <h3 className="text-blue-100 uppercase text-sm font-bold tracking-wider mb-1">Cas {currentScenarioIdx + 1}/{scenarios.length}</h3>
              <h2 className="text-2xl font-bold">{currentScenario.title}</h2>
            </div>
            <Anchor className="opacity-50" size={40} />
          </div>

          <div className="p-8 space-y-8">
            <div className="bg-blue-50 p-6 rounded-lg border-l-4 border-blue-400">
              <h4 className="flex items-center gap-2 font-bold text-blue-900 mb-2">
                <span className="text-2xl">🌤</span> Météo & Contexte
              </h4>
              <p className="text-blue-800">{currentScenario.context}</p>
            </div>

            <div className="space-y-4">
              <div>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wide">Équipe demandeuse</span>
                <p className="text-lg font-medium text-slate-800">{currentScenario.team}</p>
              </div>
              
              <div>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wide">La demande</span>
                <p className="text-lg text-slate-700 leading-relaxed italic">"{currentScenario.demand}"</p>
              </div>
            </div>

            <div className="flex justify-end pt-4">
              <button
                onClick={handleNextPhase}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 flex items-center gap-2"
              >
                Prendre la barre (Diagnostic)
                <ChevronRight size={20} />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // --- PHASE 2: DIAGNOSTIC ---
  if (phase === CasePhase.DIAGNOSTIC) {
    const questionsLeft = 5 - askedQuestions.length;

    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
         <div className="flex items-center justify-between mb-6">
           <h2 className="text-2xl font-bold text-blue-900">Diagnostic & Cap</h2>
           <span className="text-sm bg-blue-100 text-blue-800 px-3 py-1 rounded-full font-medium">Cas {currentScenarioIdx + 1}</span>
         </div>

         <div className="grid md:grid-cols-2 gap-8">
           {/* LEFT: Questions */}
           <div className="space-y-6">
             <div className="flex justify-between items-center">
               <h3 className="font-bold text-slate-700 flex items-center gap-2">
                 <HelpCircle size={18} /> Poser des questions
               </h3>
               <span className="text-xs font-mono bg-slate-200 px-2 py-1 rounded">Reste : {questionsLeft}</span>
             </div>

             <div className="space-y-3">
               {currentScenario.questions.map(q => {
                 const isAsked = askedQuestions.includes(q.id);
                 return (
                   <div key={q.id} className="w-full">
                     {!isAsked ? (
                       <button
                         onClick={() => questionsLeft > 0 && setAskedQuestions([...askedQuestions, q.id])}
                         disabled={questionsLeft === 0}
                         className="w-full text-left p-3 rounded border border-slate-200 hover:border-blue-400 hover:bg-blue-50 transition-colors bg-white text-slate-700 text-sm disabled:opacity-50"
                       >
                         <span className="font-bold text-blue-600 text-xs uppercase mr-2">[{q.category}]</span>
                         {q.text}
                       </button>
                     ) : (
                       <div className="p-3 bg-slate-50 border border-slate-200 rounded text-sm animate-fade-in">
                         <div className="font-medium text-slate-500 mb-1 line-through text-xs">{q.text}</div>
                         <div className="text-blue-800 font-medium">↪ {q.answer}</div>
                       </div>
                     )}
                   </div>
                 );
               })}
             </div>
           </div>

           {/* RIGHT: Decision Form */}
           <div className="bg-white p-6 rounded-xl shadow-md border border-slate-200 h-fit">
             <h3 className="font-bold text-slate-800 mb-6 flex items-center gap-2">
               <Anchor size={18} className="text-amber-600" /> 
               Décision du Capitaine
             </h3>

             <div className="space-y-6">
               {/* 1. Risk Level */}
               <div>
                 <label className="block text-sm font-medium text-slate-700 mb-2">Niveau de Risque estimé</label>
                 <div className="flex gap-2">
                   {Object.values(RiskLevel).map((r) => (
                     <button
                       key={r}
                       onClick={() => setSelectedRisk(r)}
                       className={`flex-1 py-2 text-sm rounded border ${selectedRisk === r ? 'bg-amber-100 border-amber-500 text-amber-900 font-bold' : 'border-slate-300 text-slate-600 hover:bg-slate-50'}`}
                     >
                       {r}
                     </button>
                   ))}
                 </div>
               </div>

               {/* 2. Stakeholders */}
               <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Qui embarquer ? (Parties Prenantes)</label>
                <div className="flex flex-wrap gap-2">
                  {currentScenario.stakeholders.map(s => (
                    <button
                      key={s.id}
                      onClick={() => {
                        if (selectedStakeholders.includes(s.id)) setSelectedStakeholders(selectedStakeholders.filter(id => id !== s.id));
                        else setSelectedStakeholders([...selectedStakeholders, s.id]);
                      }}
                      className={`px-3 py-1 text-xs rounded-full border transition-colors ${selectedStakeholders.includes(s.id) ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-slate-600 border-slate-300'}`}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
               </div>

               {/* 3. Main Decision */}
               <div>
                 <label className="block text-sm font-medium text-slate-700 mb-2">Cap à suivre</label>
                 <div className="space-y-2">
                   {[
                     { val: DecisionType.A, label: "A. Pas d'IA (Numérique simple)" },
                     { val: DecisionType.B, label: "B. Outil IA Standard (Faible risque)" },
                     { val: DecisionType.C, label: "C. Projet IA Structuré (National)" },
                     { val: DecisionType.D, label: "D. Refus / Report" }
                   ].map((opt) => (
                     <button
                       key={opt.val}
                       onClick={() => setSelectedDecision(opt.val)}
                       className={`w-full text-left p-3 text-sm rounded border transition-all ${selectedDecision === opt.val ? 'bg-blue-600 text-white border-blue-600 shadow-md ring-2 ring-blue-200' : 'bg-white text-slate-700 border-slate-300 hover:border-blue-300'}`}
                     >
                       {opt.label}
                     </button>
                   ))}
                 </div>
               </div>

               <button
                 onClick={handleNextPhase}
                 disabled={!selectedDecision || !selectedRisk}
                 className="w-full mt-4 py-3 bg-amber-600 disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-bold rounded shadow-lg hover:bg-amber-700 transition-colors"
               >
                 Valider le Cap
               </button>
             </div>
           </div>
         </div>
      </div>
    );
  }

  // --- PHASE 3: LOGBOOK ---
  if (phase === CasePhase.LOGBOOK) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="bg-amber-50 rounded-t-xl border-t-4 border-amber-600 p-6 shadow-lg mb-6">
          <h2 className="text-2xl font-serif font-bold text-amber-900 flex items-center gap-3">
            <BookOpen className="text-amber-700" />
            Journal de Bord
          </h2>
          <p className="text-amber-800 opacity-80 mt-1">Écrivez la conclusion de ce segment de navigation.</p>
        </div>

        <div className="bg-white p-6 md:p-8 shadow-md rounded-b-xl border border-t-0 border-amber-100 space-y-8">
          
          <div className="grid md:grid-cols-2 gap-6">
             <div>
               <h4 className="font-bold text-slate-700 mb-3 flex items-center gap-2">
                 <Check size={18} className="text-green-600" /> Bénéfices attendus (Max 2)
               </h4>
               <div className="space-y-2">
                 {currentScenario.benefits.map((b, idx) => (
                   <label key={idx} className="flex items-start gap-2 p-3 border rounded cursor-pointer hover:bg-green-50">
                     <input 
                       type="checkbox" 
                       className="mt-1"
                       checked={selectedBenefits.includes(b)}
                       onChange={(e) => {
                         if (e.target.checked && selectedBenefits.length < 2) setSelectedBenefits([...selectedBenefits, b]);
                         else if (!e.target.checked) setSelectedBenefits(selectedBenefits.filter(x => x !== b));
                       }}
                     />
                     <span className="text-sm text-slate-700">{b}</span>
                   </label>
                 ))}
               </div>
             </div>

             <div>
               <h4 className="font-bold text-slate-700 mb-3 flex items-center gap-2">
                 <TriangleAlert size={18} className="text-amber-600" /> Points de vigilance (Max 2)
               </h4>
               <div className="space-y-2">
                 {currentScenario.vigilancePoints.map((b, idx) => (
                   <label key={idx} className="flex items-start gap-2 p-3 border rounded cursor-pointer hover:bg-amber-50">
                     <input 
                       type="checkbox" 
                       className="mt-1"
                       checked={selectedVigilance.includes(b)}
                       onChange={(e) => {
                         if (e.target.checked && selectedVigilance.length < 2) setSelectedVigilance([...selectedVigilance, b]);
                         else if (!e.target.checked) setSelectedVigilance(selectedVigilance.filter(x => x !== b));
                       }}
                     />
                     <span className="text-sm text-slate-700">{b}</span>
                   </label>
                 ))}
               </div>
             </div>
          </div>

          <div className="pt-6 border-t border-slate-100 flex justify-end">
            <button
              onClick={handleNextPhase}
              disabled={selectedBenefits.length === 0 || selectedVigilance.length === 0}
              className="px-8 py-3 bg-blue-600 disabled:opacity-50 text-white font-bold rounded-lg shadow-md hover:bg-blue-700 flex items-center gap-2"
            >
              Signer et Poursuivre
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default Game;
