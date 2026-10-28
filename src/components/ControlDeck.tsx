import React from 'react';
import { Play, Pause, Zap, RotateCcw, Shield, ShieldAlert, Sparkles, FastForward } from 'lucide-react';

interface ControlDeckProps {
  onProduce: () => void;
  onConsume: () => void;
  onSimulateRace: () => void;
  onReset: () => void;
  isRaceRunning: boolean;
  autoPlay: boolean;
  onToggleAutoPlay: () => void;
  speed: number;
  onChangeSpeed: (newSpeed: number) => void;
  bypassMutex: boolean;
  onToggleBypassMutex: () => void;
  maxSlots: number;
  onChangeMaxSlots: (newMax: number) => void;
  statusBarText: string;
  isBusy: boolean;
}

export const ControlDeck: React.FC<ControlDeckProps> = ({
  onProduce,
  onConsume,
  onSimulateRace,
  onReset,
  isRaceRunning,
  autoPlay,
  onToggleAutoPlay,
  speed,
  onChangeSpeed,
  bypassMutex,
  onToggleBypassMutex,
  maxSlots,
  onChangeMaxSlots,
  statusBarText,
  isBusy,
}) => {
  return (
    <div className="w-full max-w-5xl mx-auto flex flex-col gap-4 font-sans select-none">
      {/* Live System Status HUD */}
      <div className="w-full bg-slate-950 text-slate-100 rounded-2xl px-5 py-3.5 border border-slate-800 shadow-lg flex flex-col sm:flex-row items-center justify-between gap-3 text-xs sm:text-sm font-mono">
        <div className="flex items-center gap-3 text-center sm:text-left">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 shrink-0 shadow-[0_0_8px_rgba(52,211,153,0.8)] animate-pulse" />
          <span className="font-bold text-slate-200 tracking-wide">{statusBarText}</span>
        </div>
        <div className="flex items-center gap-2 text-xs font-bold shrink-0">
          <span className={`px-2.5 py-1 rounded-md border ${
            bypassMutex
              ? 'bg-rose-500/20 text-rose-300 border-rose-500/40 animate-pulse'
              : 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30'
          }`}>
            {bypassMutex ? '⚠️ UNGUARDED (MUTEX OFF)' : '🛡️ SYNCHRONIZED (MUTEX ON)'}
          </span>
        </div>
      </div>

      {/* Main Gaming Action Buttons */}
      <div className="bg-slate-900/90 rounded-2xl p-4 sm:p-5 border border-slate-800 shadow-xl flex flex-col gap-4 backdrop-blur-xs">
        <div className="flex flex-wrap items-center justify-center gap-3">
          {/* Produce Button */}
          <button
            onClick={onProduce}
            disabled={isBusy || isRaceRunning}
            className="px-6 py-3.5 rounded-xl font-black text-sm bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed text-slate-950 shadow-[0_0_20px_rgba(16,185,129,0.35)] transition-all flex items-center gap-2.5 cursor-pointer"
          >
            <span className="text-xl">🚛</span>
            <div className="text-left font-mono">
              <div className="text-xs text-emerald-950 font-extrabold uppercase">PRODUCE PAYLOAD</div>
              <div className="text-[10px] text-emerald-900">+100 XP · wait(empty)</div>
            </div>
          </button>

          {/* Consume Button */}
          <button
            onClick={onConsume}
            disabled={isBusy || isRaceRunning}
            className="px-6 py-3.5 rounded-xl font-black text-sm bg-gradient-to-r from-cyan-600 to-cyan-500 hover:from-cyan-500 hover:to-cyan-400 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed text-slate-950 shadow-[0_0_20px_rgba(6,182,212,0.35)] transition-all flex items-center gap-2.5 cursor-pointer"
          >
            <span className="text-xl">♻️</span>
            <div className="text-left font-mono">
              <div className="text-xs text-cyan-950 font-extrabold uppercase">HARVEST RECYCLE</div>
              <div className="text-[10px] text-cyan-900">+150 XP · wait(full)</div>
            </div>
          </button>

          {/* Simulate Race Condition & Solve It (Boss Battle Button) */}
          <button
            onClick={onSimulateRace}
            disabled={isRaceRunning}
            className="px-7 py-3.5 rounded-xl font-black text-sm bg-gradient-to-r from-rose-600 via-rose-500 to-amber-500 hover:brightness-110 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed text-white shadow-[0_0_25px_rgba(244,63,94,0.5)] transition-all flex items-center gap-2.5 cursor-pointer border border-rose-300/40 relative overflow-hidden group"
          >
            <Zap className="w-5 h-5 text-amber-300 animate-bounce" />
            <div className="text-left font-mono">
              <div className="text-xs font-black uppercase tracking-wide text-white drop-shadow">
                SIMULATE RACE & SOLVE IT!
              </div>
              <div className="text-[10px] text-amber-200 font-bold">
                Clash Boss Event · +1,000 XP
              </div>
            </div>
          </button>

          {/* Reset System */}
          <button
            onClick={onReset}
            disabled={isRaceRunning}
            className="px-4 py-3.5 rounded-xl font-bold text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all flex items-center gap-1.5 font-mono cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            <span>RESET</span>
          </button>
        </div>

        {/* Secondary Toggles & Arcade Speed Bar */}
        <div className="pt-4 border-t border-slate-800 flex flex-wrap items-center justify-between gap-4 text-xs font-mono text-slate-400">
          {/* Auto-Play Bot */}
          <div className="flex items-center gap-3">
            <button
              onClick={onToggleAutoPlay}
              disabled={isRaceRunning}
              className={`px-3 py-1.5 rounded-lg font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                autoPlay
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.3)]'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700'
              }`}
            >
              {autoPlay ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              <span>{autoPlay ? 'AUTO-PILOT ACTIVE' : 'START AUTO-PILOT'}</span>
            </button>

            {/* Speed Multipliers */}
            <div className="flex items-center gap-1 bg-slate-950 p-0.5 rounded-lg border border-slate-800">
              <span className="text-[10px] text-slate-500 px-1.5">SPEED:</span>
              <button
                onClick={() => onChangeSpeed(0.5)}
                className={`px-2 py-0.5 rounded text-[11px] font-bold ${speed === 0.5 ? 'bg-emerald-500 text-slate-950' : 'text-slate-400 hover:text-white'}`}
              >
                0.5x
              </button>
              <button
                onClick={() => onChangeSpeed(1)}
                className={`px-2 py-0.5 rounded text-[11px] font-bold ${speed === 1 ? 'bg-emerald-500 text-slate-950' : 'text-slate-400 hover:text-white'}`}
              >
                1.0x
              </button>
              <button
                onClick={() => onChangeSpeed(2)}
                className={`px-2 py-0.5 rounded text-[11px] font-bold ${speed === 2 ? 'bg-emerald-500 text-slate-950' : 'text-slate-400 hover:text-white'}`}
              >
                2.0x
              </button>
            </div>
          </div>

          {/* Buffer Capacity & Mutex Bypass Toggle */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <label htmlFor="buffer-size" className="text-slate-400 text-xs font-semibold">BUFFER SIZE:</label>
              <select
                id="buffer-size"
                value={maxSlots}
                disabled={isRaceRunning || isBusy}
                onChange={(e) => onChangeMaxSlots(Number(e.target.value))}
                className="bg-slate-950 border border-slate-700 rounded px-2 py-1 text-slate-200 font-mono text-xs font-bold focus:outline-hidden"
              >
                <option value={3}>3 SLOTS</option>
                <option value={4}>4 SLOTS</option>
                <option value={5}>5 SLOTS (DEFAULT)</option>
                <option value={6}>6 SLOTS</option>
                <option value={7}>7 SLOTS</option>
              </select>
            </div>

            {/* Bypass Mutex Checkbox */}
            <label className="flex items-center gap-2 cursor-pointer select-none bg-slate-950 px-3 py-1 rounded-lg border border-slate-800 hover:border-slate-700 transition-colors">
              <input
                type="checkbox"
                checked={bypassMutex}
                onChange={onToggleBypassMutex}
                disabled={isRaceRunning}
                className="rounded border-slate-700 text-rose-500 focus:ring-rose-500"
              />
              <span className={`text-[11px] font-bold ${bypassMutex ? 'text-rose-400 animate-pulse' : 'text-slate-400'}`}>
                BYPASS MUTEX (UNSAFE MODE)
              </span>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};
