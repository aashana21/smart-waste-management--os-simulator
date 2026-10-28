import React from 'react';
import { Shield, ShieldAlert, Cpu, Sparkles, Inbox, Boxes } from 'lucide-react';

interface SemaphoreDashboardProps {
  empty: number;
  full: number;
  mutex: number;
  maxSlots: number;
  lockHolder: 'none' | 'producer' | 'consumer' | 'contested';
}

export const SemaphoreDashboard: React.FC<SemaphoreDashboardProps> = ({
  empty,
  full,
  mutex,
  maxSlots,
  lockHolder,
}) => {
  return (
    <div className="w-full max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-4">
      {/* Empty Counting Semaphore Gauge */}
      <div className="bg-slate-900/90 rounded-2xl p-4 sm:p-5 border border-emerald-500/30 shadow-lg relative overflow-hidden backdrop-blur-xs">
        <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-full blur-xl pointer-events-none" />
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-1.5 text-[11px] font-mono font-bold text-emerald-400 uppercase tracking-wider">
              <Inbox className="w-3.5 h-3.5" />
              <span>Counting Semaphore</span>
            </div>
            <h3 className="text-lg font-black text-white mt-0.5 tracking-wide">
              empty
            </h3>
          </div>
          <span className="text-[11px] font-mono bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded font-bold">
            FREE SLOTS
          </span>
        </div>

        <div className="mt-3 flex items-baseline justify-between font-mono">
          <div className="text-4xl font-black tabular-nums text-emerald-400 drop-shadow-[0_0_12px_rgba(52,211,153,0.5)]">
            {empty}
          </div>
          <div className="text-xs text-slate-400 font-semibold">
            CAPACITY: {maxSlots}
          </div>
        </div>

        {/* Energy meter */}
        <div className="mt-3 w-full bg-slate-950 rounded-full h-2.5 p-0.5 border border-slate-800 overflow-hidden">
          <div
            className="bg-gradient-to-r from-emerald-600 to-emerald-400 h-full transition-all duration-300 rounded-full shadow-[0_0_10px_rgba(52,211,153,0.8)]"
            style={{ width: `${(empty / maxSlots) * 100}%` }}
          />
        </div>
        <div className="mt-2 flex items-center justify-between text-[11px] text-slate-400 font-mono">
          <span>Producer calls: <code className="text-emerald-300 font-bold">wait(empty)</code></span>
          <span className="text-slate-500">P(empty)</span>
        </div>
      </div>

      {/* Full Counting Semaphore Gauge */}
      <div className="bg-slate-900/90 rounded-2xl p-4 sm:p-5 border border-cyan-500/30 shadow-lg relative overflow-hidden backdrop-blur-xs">
        <div className="absolute top-0 right-0 w-24 h-24 bg-cyan-500/5 rounded-full blur-xl pointer-events-none" />
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-1.5 text-[11px] font-mono font-bold text-cyan-400 uppercase tracking-wider">
              <Boxes className="w-3.5 h-3.5" />
              <span>Counting Semaphore</span>
            </div>
            <h3 className="text-lg font-black text-white mt-0.5 tracking-wide">
              full
            </h3>
          </div>
          <span className="text-[11px] font-mono bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 px-2 py-0.5 rounded font-bold">
            READY ITEMS
          </span>
        </div>

        <div className="mt-3 flex items-baseline justify-between font-mono">
          <div className="text-4xl font-black tabular-nums text-cyan-400 drop-shadow-[0_0_12px_rgba(34,211,238,0.5)]">
            {full}
          </div>
          <div className="text-xs text-slate-400 font-semibold">
            QUEUED: {full}/{maxSlots}
          </div>
        </div>

        {/* Energy meter */}
        <div className="mt-3 w-full bg-slate-950 rounded-full h-2.5 p-0.5 border border-slate-800 overflow-hidden">
          <div
            className="bg-gradient-to-r from-cyan-600 to-cyan-400 h-full transition-all duration-300 rounded-full shadow-[0_0_10px_rgba(34,211,238,0.8)]"
            style={{ width: `${(full / maxSlots) * 100}%` }}
          />
        </div>
        <div className="mt-2 flex items-center justify-between text-[11px] text-slate-400 font-mono">
          <span>Consumer calls: <code className="text-cyan-300 font-bold">wait(full)</code></span>
          <span className="text-slate-500">P(full)</span>
        </div>
      </div>

      {/* Binary Semaphore Mutex Shield */}
      <div className={`rounded-2xl p-4 sm:p-5 border transition-all duration-300 shadow-lg relative overflow-hidden backdrop-blur-xs ${
        mutex === 0
          ? lockHolder === 'contested'
            ? 'bg-rose-950/80 border-rose-500 shadow-rose-500/30 animate-pulse'
            : 'bg-slate-900 border-amber-500/60 shadow-amber-500/20'
          : 'bg-slate-900/90 border-emerald-500/30'
      }`}>
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-1.5 text-[11px] font-mono font-bold uppercase tracking-wider">
              {mutex === 1 ? (
                <Shield className="w-3.5 h-3.5 text-emerald-400" />
              ) : (
                <ShieldAlert className="w-3.5 h-3.5 text-rose-400 animate-spin" />
              )}
              <span className={mutex === 1 ? 'text-emerald-400' : 'text-amber-400'}>
                Binary Mutex Shield
              </span>
            </div>
            <h3 className="text-lg font-black text-white mt-0.5 tracking-wide">
              mutex
            </h3>
          </div>
          <span className={`text-[11px] font-mono px-2 py-0.5 rounded font-bold border ${
            mutex === 1
              ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30'
              : 'bg-rose-500/20 text-rose-300 border-rose-500/40'
          }`}>
            {mutex === 1 ? 'UNLOCKED' : 'FORCEFIELD ACTIVE'}
          </span>
        </div>

        <div className="mt-3 flex items-baseline justify-between font-mono">
          <div className="flex items-center gap-2">
            <span className={`text-4xl font-black tabular-nums ${
              mutex === 1
                ? 'text-emerald-400 drop-shadow-[0_0_12px_rgba(52,211,153,0.5)]'
                : 'text-rose-400 drop-shadow-[0_0_12px_rgba(244,63,94,0.6)]'
            }`}>
              {mutex}
            </span>
            <span className="text-xs text-slate-300 font-sans font-medium">
              {mutex === 1 ? 'Gate Open' : 'Critical Section Locked'}
            </span>
          </div>

          <div className="text-xs font-mono font-bold">
            {lockHolder === 'producer' ? (
              <span className="text-emerald-400">HOLD: TRUCK 🚛</span>
            ) : lockHolder === 'consumer' ? (
              <span className="text-cyan-400">HOLD: RECYCLEBOT ♻️</span>
            ) : lockHolder === 'contested' ? (
              <span className="text-rose-400 animate-bounce">⚡ CONTESTED!</span>
            ) : (
              <span className="text-slate-500">FREE</span>
            )}
          </div>
        </div>

        {/* Shield Bar */}
        <div className="mt-3 w-full bg-slate-950 rounded-full h-2.5 p-0.5 border border-slate-800 overflow-hidden">
          <div
            className={`h-full transition-all duration-300 rounded-full ${
              mutex === 1
                ? 'bg-gradient-to-r from-emerald-600 to-emerald-400 w-full shadow-[0_0_10px_rgba(52,211,153,0.8)]'
                : 'bg-gradient-to-r from-rose-600 to-rose-400 w-full shadow-[0_0_10px_rgba(244,63,94,0.9)] animate-pulse'
            }`}
          />
        </div>
        <div className="mt-2 flex items-center justify-between text-[11px] text-slate-400 font-mono">
          <span>Mutual Exclusion Invariant</span>
          <span className="text-slate-300 font-bold">{mutex === 1 ? 'Shield Ready' : 'Active Lock'}</span>
        </div>
      </div>
    </div>
  );
};
