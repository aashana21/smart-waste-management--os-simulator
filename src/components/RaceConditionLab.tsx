import React from 'react';
import { AlertOctagon, ShieldCheck, Zap, ArrowRight, Play, CheckCircle2, XCircle, Trophy, Sparkles } from 'lucide-react';

interface RaceConditionLabProps {
  onTriggerDramaticRace: () => void;
  isRaceRunning: boolean;
}

export const RaceConditionLab: React.FC<RaceConditionLabProps> = ({
  onTriggerDramaticRace,
  isRaceRunning,
}) => {
  return (
    <div className="w-full max-w-5xl mx-auto space-y-6 font-sans">
      {/* Boss Challenge Banner */}
      <div className="bg-slate-900 rounded-3xl p-6 sm:p-8 border-2 border-rose-500/50 shadow-[0_0_35px_rgba(244,63,94,0.25)] flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden cyber-grid">
        <div className="max-w-2xl">
          <div className="flex items-center gap-2 text-rose-400 font-mono font-bold text-xs tracking-wider uppercase">
            <Zap className="w-4 h-4 animate-bounce text-amber-400" />
            <span>Interactive Boss Event</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white mt-1 tracking-tight">
            The Critical Section Collision & Synchronization Fix
          </h2>
          <p className="mt-2 text-slate-300 text-sm leading-relaxed">
            Witness how an unshielded race condition tears through shared memory invariants, and how Dijkstra&apos;s <strong className="text-emerald-400 font-mono">Binary Semaphore (Mutex)</strong> forcefully intervenes to restore complete synchronization and guarantee zero data corruption.
          </p>
        </div>

        <button
          onClick={onTriggerDramaticRace}
          disabled={isRaceRunning}
          className="px-6 py-4 bg-gradient-to-r from-rose-600 via-rose-500 to-amber-500 hover:brightness-110 active:scale-95 disabled:opacity-40 text-white rounded-2xl font-black text-sm shadow-[0_0_25px_rgba(244,63,94,0.6)] transition-all flex items-center gap-3 shrink-0 cursor-pointer border border-rose-300/40"
        >
          <Play className="w-5 h-5 fill-white" />
          <div className="text-left font-mono">
            <div className="text-xs font-black uppercase">LAUNCH BOSS SHOWDOWN</div>
            <div className="text-[10px] text-amber-200">Clash &amp; Solve by Mutex</div>
          </div>
        </button>
      </div>

      {/* Anatomy of the Race Condition & How Synchronization Solves It */}
      <div className="bg-slate-900/90 rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-xl">
        <h3 className="text-lg font-black text-white mb-4 flex items-center gap-2 font-mono">
          <Sparkles className="w-5 h-5 text-amber-400" />
          <span>Interactive Showdown: Unsynchronized Hazard vs. Mutex Shield Solution</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Unsynchronized Buggy Side */}
          <div className="border border-rose-500/40 bg-rose-950/20 rounded-2xl p-5 shadow-inner">
            <div className="flex items-center justify-between mb-3 font-mono">
              <span className="font-bold text-sm text-rose-300 flex items-center gap-1.5">
                <XCircle className="w-4 h-4 text-rose-400" />
                WITHOUT SYNCHRONIZATION
              </span>
              <span className="text-[11px] text-rose-400 font-black bg-rose-500/20 px-2 py-0.5 rounded border border-rose-500/30">
                BUGGY RACE HAZARD
              </span>
            </div>

            <div className="bg-slate-950 text-slate-200 p-4 rounded-xl font-mono text-xs space-y-1.5 border border-rose-500/30">
              <p className="text-slate-500">// Buffer count = 2</p>
              <p className="text-emerald-400">P1: reg1 = counter (reads 2)</p>
              <p className="text-emerald-400">P1: reg1 = reg1 + 1 (evaluates 3)</p>
              <div className="text-rose-300 font-black bg-rose-900/80 px-2 py-1 rounded border border-rose-500 text-[11px] animate-pulse">
                ⚡ PREEMPTION / CONTEXT SWITCH!
              </div>
              <p className="text-cyan-400">C1: reg2 = counter (still reads 2!)</p>
              <p className="text-cyan-400">C1: reg2 = reg2 - 1 (evaluates 1)</p>
              <p className="text-cyan-400">C1: counter = reg2 (writes 1)</p>
              <div className="text-rose-300 font-black bg-rose-900/80 px-2 py-1 rounded border border-rose-500 text-[11px] animate-pulse">
                ⚡ SWITCH BACK TO PRODUCER!
              </div>
              <p className="text-emerald-400">P1: counter = reg1 (overwrites 3!)</p>
            </div>

            <div className="mt-3 text-xs text-rose-300 bg-rose-950/60 p-3 rounded-xl border border-rose-500/30 font-sans">
              <strong className="text-rose-200">The Fatal Bug:</strong> One item was added and one was removed, so count should still be <strong>2</strong>. Instead it corrupted to <strong>3</strong>! An item in memory was permanently lost.
            </div>
          </div>

          {/* Synchronized Solved Side */}
          <div className="border border-emerald-500/40 bg-emerald-950/20 rounded-2xl p-5 shadow-inner">
            <div className="flex items-center justify-between mb-3 font-mono">
              <span className="font-bold text-sm text-emerald-300 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                SOLVED BY MUTEX SYNCHRONIZATION
              </span>
              <span className="text-[11px] text-emerald-400 font-black bg-emerald-500/20 px-2 py-0.5 rounded border border-emerald-500/30">
                100% ATOMIC &amp; SAFE
              </span>
            </div>

            <div className="bg-slate-950 text-slate-200 p-4 rounded-xl font-mono text-xs space-y-1.5 border border-emerald-500/30">
              <p className="text-slate-500">// Mutex = 1, count = 2</p>
              <p className="text-emerald-400 font-bold">P1: wait(mutex); // Acquired (mutex=0)</p>
              <p className="text-emerald-300 bg-emerald-950/60 px-1 py-0.5 rounded">[CRITICAL SECTION SHIELD ON]</p>
              <p className="text-emerald-400">P1: counter = counter + 1 (3)</p>
              <div className="text-amber-300 font-bold bg-amber-950/60 px-2 py-1 rounded border border-amber-500/40 text-[11px]">
                🛡️ C1: wait(mutex) BLOCKED! Consumer queued in stasis
              </div>
              <p className="text-emerald-400 font-bold">P1: signal(mutex); // Released (mutex=1)</p>
              <p className="text-cyan-400">C1: Wakes up, acquires lock (mutex=0)</p>
              <p className="text-cyan-400">C1: counter = counter - 1 (2)</p>
              <p className="text-cyan-400 font-bold">C1: signal(mutex); // Correct count = 2!</p>
            </div>

            <div className="mt-3 text-xs text-emerald-300 bg-emerald-950/60 p-3 rounded-xl border border-emerald-500/30 font-sans">
              <strong className="text-emerald-200">The Synchronization Proof:</strong> Mutual Exclusion ensures only <strong>1 process</strong> enters the critical section. No interleaved memory corruption can ever occur.
            </div>
          </div>
        </div>
      </div>

      {/* The 3 Core Pillars */}
      <div className="bg-slate-900/90 rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-xl">
        <h3 className="text-lg font-black text-white mb-4 font-mono">
          Dijkstra&apos;s 3 Invariant Guarantees for Critical Sections
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800">
            <div className="flex items-center gap-2 text-white font-mono font-bold text-sm">
              <span className="w-6 h-6 rounded-full bg-emerald-500 text-slate-950 text-xs flex items-center justify-center font-black">1</span>
              <span>Mutual Exclusion</span>
            </div>
            <p className="mt-2 text-xs text-slate-300 leading-relaxed">
              If a process is active inside the critical section, all other contending threads are strictly barred from entry by the binary semaphore lock.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800">
            <div className="flex items-center gap-2 text-white font-mono font-bold text-sm">
              <span className="w-6 h-6 rounded-full bg-cyan-500 text-slate-950 text-xs flex items-center justify-center font-black">2</span>
              <span>Progress</span>
            </div>
            <p className="mt-2 text-xs text-slate-300 leading-relaxed">
              When the critical section is vacant, candidates requesting admission are granted access without indefinite postponement or livelock.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800">
            <div className="flex items-center gap-2 text-white font-mono font-bold text-sm">
              <span className="w-6 h-6 rounded-full bg-purple-500 text-slate-950 text-xs flex items-center justify-center font-black">3</span>
              <span>Bounded Waiting</span>
            </div>
            <p className="mt-2 text-xs text-slate-300 leading-relaxed">
              A finite bound exists on how many times peer threads can enter before a waiting process is admitted, preventing thread starvation.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
