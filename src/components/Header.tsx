import React from 'react';
import { Volume2, VolumeX, RotateCcw, ShieldCheck, Zap, Flame, Heart } from 'lucide-react';
import { GameStats } from '../types.ts';

interface HeaderProps {
  activeTab: 'stage' | 'lab' | 'code' | 'theory';
  setActiveTab: (tab: 'stage' | 'lab' | 'code' | 'theory') => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
  onReset: () => void;
  isRaceRunning: boolean;
  gameStats: GameStats;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  soundEnabled,
  onToggleSound,
  onReset,
  isRaceRunning,
  gameStats,
}) => {
  return (
    <header className="w-full bg-slate-950 text-white border-b border-slate-800 shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Zone 1: Brand title with arcade glow */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="flex items-center gap-2">
            <span className="text-2xl filter drop-shadow">🗑️</span>
            <div>
              <span className="text-base sm:text-lg font-black tracking-wider uppercase bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent flex items-center gap-1.5">
                SMART WASTE OS <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-1.5 py-0.5 rounded font-mono font-bold tracking-normal">ARCADE</span>
              </span>
            </div>
          </div>
        </div>

        {/* Gaming Stats HUD (Score, Combo, Health) */}
        <div className="hidden lg:flex items-center gap-5 bg-slate-900/90 border border-slate-800 px-4 py-1.5 rounded-xl text-xs font-mono">
          {/* Integrity Bar */}
          <div className="flex items-center gap-2">
            <Heart className={`w-3.5 h-3.5 ${gameStats.integrity <= 40 ? 'text-rose-500 animate-ping' : 'text-emerald-400'}`} />
            <span className="text-slate-400">INTEGRITY:</span>
            <div className="w-20 bg-slate-800 rounded-full h-2 overflow-hidden border border-slate-700">
              <div
                className={`h-full transition-all duration-300 rounded-full ${
                  gameStats.integrity > 60
                    ? 'bg-emerald-400'
                    : gameStats.integrity > 30
                    ? 'bg-amber-400'
                    : 'bg-rose-500 animate-pulse'
                }`}
                style={{ width: `${gameStats.integrity}%` }}
              />
            </div>
            <span className={`font-bold tabular-nums ${gameStats.integrity <= 40 ? 'text-rose-400' : 'text-slate-200'}`}>
              {gameStats.integrity}%
            </span>
          </div>

          <span className="text-slate-700">|</span>

          {/* Score Counter */}
          <div className="flex items-center gap-1.5">
            <span className="text-amber-400 font-bold">XP:</span>
            <span className="text-white font-extrabold text-sm tabular-nums tracking-wide">
              {gameStats.score.toLocaleString()}
            </span>
          </div>

          <span className="text-slate-700">|</span>

          {/* Combo Multiplier */}
          <div className="flex items-center gap-1.5">
            <Flame className={`w-3.5 h-3.5 ${gameStats.combo > 1 ? 'text-amber-400 animate-bounce' : 'text-slate-500'}`} />
            <span className="text-slate-400">COMBO:</span>
            <span className={`font-black ${gameStats.combo > 1 ? 'text-amber-300' : 'text-slate-400'}`}>
              x{gameStats.combo}
            </span>
          </div>
        </div>

        {/* Zone 2: Navigation tabs as clean functional buttons */}
        <nav className="flex items-center gap-1 sm:gap-2">
          <button
            onClick={() => setActiveTab('stage')}
            className={`px-3 py-1.5 text-xs sm:text-sm font-semibold rounded-lg transition-all whitespace-nowrap ${
              activeTab === 'stage'
                ? 'bg-emerald-500 text-slate-950 font-bold shadow-lg shadow-emerald-500/20'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            Arena Stage
          </button>
          <button
            onClick={() => setActiveTab('lab')}
            className={`px-3 py-1.5 text-xs sm:text-sm font-semibold rounded-lg transition-all whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'lab'
                ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/20'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <Zap className="w-3.5 h-3.5 text-rose-400" />
            Race Boss Lab
          </button>
          <button
            onClick={() => setActiveTab('code')}
            className={`px-3 py-1.5 text-xs sm:text-sm font-semibold rounded-lg transition-all whitespace-nowrap ${
              activeTab === 'code'
                ? 'bg-slate-800 text-cyan-300 font-mono border border-cyan-500/30 shadow-xs'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            Code HUD
          </button>
          <button
            onClick={() => setActiveTab('theory')}
            className={`px-3 py-1.5 text-xs sm:text-sm font-semibold rounded-lg transition-all whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'theory'
                ? 'bg-slate-800 text-purple-300 border border-purple-500/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            OS Rules
          </button>
        </nav>

        {/* Zone 3: Audio & Reset */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={onToggleSound}
            aria-label={soundEnabled ? 'Mute sound effects' : 'Enable sound effects'}
            className="p-2 text-slate-400 hover:text-amber-400 hover:bg-slate-900 rounded-lg transition-colors border border-transparent hover:border-slate-800"
            title={soundEnabled ? 'Mute audio' : 'Unmute audio'}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4 text-emerald-400" /> : <VolumeX className="w-4 h-4 text-slate-500" />}
          </button>

          <button
            onClick={onReset}
            disabled={isRaceRunning}
            className="px-3 py-1.5 text-xs font-bold text-slate-300 bg-slate-900 hover:bg-slate-800 hover:text-white border border-slate-800 disabled:opacity-40 disabled:cursor-not-allowed rounded-lg transition-all flex items-center gap-1.5 font-mono"
            title="Reset system state"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">RESET</span>
          </button>
        </div>
      </div>
    </header>
  );
};
