import React, { useState } from 'react';
import { Phase, PlayerState } from './types';
import { SCENARIOS } from './data/scenarios';
import WelcomeScreen from './components/WelcomeScreen';
import Game from './components/Game';
import Dashboard from './components/Dashboard';

const App: React.FC = () => {
  const [phase, setPhase] = useState<Phase>(Phase.WELCOME);
  const [playerState, setPlayerState] = useState<PlayerState>({
    currentScenarioIndex: 0,
    totalScore: 0,
    history: []
  });

  const handleStartGame = () => {
    setPlayerState({
      currentScenarioIndex: 0,
      totalScore: 0,
      history: []
    });
    setPhase(Phase.GAME);
  };

  const handleGameComplete = (history: PlayerState['history']) => {
    const totalScore = history.reduce((acc, curr) => acc + curr.score, 0);
    setPlayerState(prev => ({
      ...prev,
      totalScore,
      history
    }));
    setPhase(Phase.SUMMARY);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans">
      <header className="bg-white border-b border-blue-100 py-3 sticky top-0 z-10 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="text-2xl">⛵</span>
            <span className="font-bold text-blue-900 tracking-tight hidden sm:block">REF’IA à bord</span>
          </div>
          {phase !== Phase.WELCOME && (
            <div className="text-sm font-medium text-slate-500">
               Score actuel: <span className="text-blue-600 font-bold">{playerState.history.reduce((a,b) => a + b.score, 0)}</span>
            </div>
          )}
        </div>
      </header>

      <main>
        {phase === Phase.WELCOME && <WelcomeScreen onStart={handleStartGame} />}
        {phase === Phase.GAME && (
          <Game 
            scenarios={SCENARIOS} 
            onComplete={handleGameComplete} 
          />
        )}
        {phase === Phase.SUMMARY && (
          <Dashboard 
            state={playerState} 
            scenarios={SCENARIOS} 
            onRestart={handleStartGame} 
          />
        )}
      </main>

      <footer className="py-6 text-center text-slate-400 text-xs mt-12">
        <p>© Voies navigables de France - Serious Game IA</p>
      </footer>
    </div>
  );
};

export default App;
