import React, { useState } from 'react';
import { Anchor, Map, LifeBuoy, Info, Ship } from 'lucide-react';

interface Props {
  onStart: () => void;
}

const WelcomeScreen: React.FC<Props> = ({ onStart }) => {
  const [showRules, setShowRules] = useState(false);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 text-center max-w-4xl mx-auto">
      <div className="mb-8 p-6 bg-blue-50 rounded-full border-4 border-blue-200 animate-wave">
        <Ship size={80} className="text-blue-900" />
      </div>
      
      <h1 className="text-4xl md:text-5xl font-bold text-blue-900 mb-4 tracking-tight">
        REF’IA à bord
      </h1>
      <h2 className="text-xl md:text-2xl text-amber-700 font-medium mb-8">
        Voilier des cas d’usage IA VNF
      </h2>

      <p className="text-lg text-slate-600 mb-8 max-w-2xl leading-relaxed">
        Bienvenue à bord, Référent IA. Vous êtes le skipper de la transformation numérique.
        Votre mission : naviguer de projet en projet, éviter les écueils technologiques et mener votre équipage à bon port en prenant les décisions justes.
      </p>

      <div className="flex flex-col sm:flex-row gap-4">
        <button
          onClick={onStart}
          className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg shadow-lg transition-transform transform hover:scale-105 flex items-center justify-center gap-2"
        >
          <Anchor size={24} />
          Embarquer
        </button>
        
        <button
          onClick={() => setShowRules(true)}
          className="px-8 py-4 bg-white hover:bg-slate-50 text-blue-900 border-2 border-blue-200 font-semibold rounded-lg shadow-sm transition-colors flex items-center justify-center gap-2"
        >
          <Info size={24} />
          Comment jouer ?
        </button>
      </div>

      {showRules && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full p-6 md:p-8 relative">
            <button 
              onClick={() => setShowRules(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"
            >
              ✕
            </button>
            
            <h3 className="text-2xl font-bold text-blue-900 mb-6 flex items-center gap-2">
              <Map className="text-amber-600" />
              Journal de bord
            </h3>
            
            <div className="space-y-6 text-left text-slate-700">
              <div>
                <h4 className="font-bold text-blue-700 mb-2">1. Découverte (Météo)</h4>
                <p>Analysez le contexte, l'équipe demandeuse et le besoin exprimé.</p>
              </div>
              
              <div>
                <h4 className="font-bold text-blue-700 mb-2">2. Diagnostic (Navigation)</h4>
                <p>Posez jusqu'à 5 questions clés pour évaluer les risques et la pertinence. Choisissez ensuite votre cap :</p>
                <ul className="list-disc ml-5 mt-2 space-y-1 text-sm bg-slate-50 p-3 rounded">
                  <li><strong>A. Pas d'IA :</strong> Solution numérique simple.</li>
                  <li><strong>B. Outil Standard :</strong> Solution sur étagère, faible risque.</li>
                  <li><strong>C. Projet Structuré :</strong> Projet complexe nécessitant la DSI/Direction.</li>
                  <li><strong>D. Refus/Report :</strong> Trop risqué ou non pertinent.</li>
                </ul>
              </div>

              <div>
                <h4 className="font-bold text-blue-700 mb-2">3. Journal (Synthèse)</h4>
                <p>Qualifiez les bénéfices, les risques et les parties prenantes pour valider votre étape.</p>
              </div>
            </div>

            <div className="mt-8 text-center">
              <button
                onClick={() => setShowRules(false)}
                className="px-6 py-2 bg-blue-100 text-blue-800 font-semibold rounded hover:bg-blue-200"
              >
                Compris, larguez les amarres !
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WelcomeScreen;
