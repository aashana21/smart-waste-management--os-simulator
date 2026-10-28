import React from 'react';
import { BookOpen, AlertCircle, ShieldAlert, Cpu, Sparkles } from 'lucide-react';

interface OSTheoryProps {
  onTriggerDeadlockDemo: () => void;
  isRaceRunning: boolean;
}

export const OSTheory: React.FC<OSTheoryProps> = ({ onTriggerDeadlockDemo, isRaceRunning }) => {
  return (
    <div className="w-full max-w-5xl mx-auto space-y-6 font-sans">
      {/* Overview Card */}
      <div className="bg-slate-900/90 rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-xl backdrop-blur-xs">
        <div className="flex items-center gap-2 text-emerald-400 font-mono font-bold text-xs tracking-wider uppercase mb-1">
          <BookOpen className="w-4 h-4" />
          <span>Operating Systems Foundations</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-black text-white">
          The Producer–Consumer (Bounded Buffer) Paradigm
        </h2>
        <p className="mt-3 text-slate-300 text-sm leading-relaxed">
          First formalized by <strong>Edsger W. Dijkstra</strong> in 1965, the Bounded-Buffer problem is a canonical paradigm for multi-process synchronization. A producer process deposits units into a fixed-capacity shared buffer, while a consumer process extracts items concurrently.
        </p>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4 font-mono text-xs">
          <div className="p-4 rounded-2xl bg-slate-950 border border-emerald-500/30">
            <h4 className="font-bold text-emerald-300 text-sm flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
              Counting Semaphore: empty
            </h4>
            <p className="mt-2 text-slate-300 font-sans text-xs leading-relaxed">
              Initialized to buffer capacity $N$. Keeps count of free slots. If zero, any producer attempting to write must sleep until a consumer frees space.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950 border border-cyan-500/30">
            <h4 className="font-bold text-cyan-300 text-sm flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-400" />
              Counting Semaphore: full
            </h4>
            <p className="mt-2 text-slate-300 font-sans text-xs leading-relaxed">
              Initialized to $0$. Keeps count of filled slots. If zero, any consumer attempting to read must sleep until a producer deposits an item.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950 border border-amber-500/30">
            <h4 className="font-bold text-amber-300 text-sm flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
              Binary Semaphore: mutex
            </h4>
            <p className="mt-2 text-slate-300 font-sans text-xs leading-relaxed">
              Initialized to $1$. Enforces strict mutual exclusion over the Critical Section buffer memory addresses and pointer updates.
            </p>
          </div>
        </div>
      </div>

      {/* The Famous Deadlock Trap Card */}
      <div className="bg-slate-900/90 rounded-3xl p-6 sm:p-8 border border-amber-500/40 bg-amber-950/10 shadow-xl">
        <div className="flex items-start justify-between gap-4 flex-col sm:flex-row">
          <div>
            <span className="text-amber-400 font-mono font-bold text-xs uppercase tracking-wider flex items-center gap-1.5">
              <AlertCircle className="w-4 h-4 text-amber-400" />
              The Classical Synchronization Trap
            </span>
            <h3 className="text-xl font-black text-white mt-1">
              Deadlock by Inverted Wait Ordering
            </h3>
            <p className="mt-2 text-slate-300 text-sm leading-relaxed max-w-2xl">
              What happens if a developer swaps the order of <code className="bg-slate-950 text-amber-300 px-1.5 py-0.5 rounded border border-slate-800 font-mono text-xs">wait()</code> calls? E.g., placing <code className="bg-slate-950 text-amber-300 px-1.5 py-0.5 rounded border border-slate-800 font-mono text-xs">wait(mutex)</code> <em>before</em> <code className="bg-slate-950 text-amber-300 px-1.5 py-0.5 rounded border border-slate-800 font-mono text-xs">wait(empty)</code>?
            </p>
          </div>

          <button
            onClick={onTriggerDeadlockDemo}
            disabled={isRaceRunning}
            className="px-5 py-3 bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 active:scale-95 disabled:opacity-40 text-slate-950 rounded-xl text-xs font-black transition-all shadow-[0_0_15px_rgba(245,158,11,0.4)] flex items-center gap-2 shrink-0 font-mono cursor-pointer"
          >
            <ShieldAlert className="w-4 h-4" />
            <span>TRIGGER DEADLOCK TRAP</span>
          </button>
        </div>

        <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-slate-950 rounded-2xl border border-rose-500/30 text-xs">
            <h5 className="font-bold text-rose-300 mb-2 font-mono flex items-center gap-1.5">
              <span>Fatal Sequence when Buffer is Full:</span>
            </h5>
            <ol className="list-decimal list-inside space-y-1.5 text-slate-300">
              <li>Buffer is completely full ($empty = 0$).</li>
              <li>Producer runs <code className="font-mono text-amber-400 font-bold">wait(mutex)</code>; acquires lock ($mutex = 0$).</li>
              <li>Producer runs <code className="font-mono text-amber-400 font-bold">wait(empty)</code>; since $empty=0$, Producer blocks!</li>
              <li>Consumer tries to run <code className="font-mono text-amber-400 font-bold">wait(mutex)</code> to consume and free space, but Producer holds the mutex!</li>
              <li><strong>Deadlock:</strong> Both threads sleep forever waiting for each other. System freezes!</li>
            </ol>
          </div>

          <div className="p-4 bg-slate-950 rounded-2xl border border-emerald-500/30 text-xs">
            <h5 className="font-bold text-emerald-300 mb-2 font-mono flex items-center gap-1.5">
              <span>Golden Rule of Semaphore Ordering:</span>
            </h5>
            <p className="text-slate-300 leading-relaxed font-sans">
              Always acquire resource counting semaphores (<code className="font-mono text-emerald-300 font-bold">empty</code> or <code className="font-mono text-cyan-300 font-bold">full</code>) <strong>first</strong>, and acquire the binary mutual exclusion semaphore (<code className="font-mono text-amber-300 font-bold">mutex</code>) <strong>immediately before entering the Critical Section</strong>.
            </p>
            <div className="mt-3 p-2.5 bg-slate-900 rounded-xl border border-emerald-500/30 font-mono text-[11px] text-emerald-300 space-y-1">
              <div>wait(empty); // 1. Wait for resource availability</div>
              <div>wait(mutex); // 2. Then acquire critical section shield</div>
            </div>
          </div>
        </div>
      </div>

      {/* Dijkstra's Invariants */}
      <div className="bg-slate-900/90 rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-xl">
        <h3 className="text-lg font-black text-white mb-3 flex items-center gap-2 font-mono">
          <Cpu className="w-5 h-5 text-emerald-400" />
          <span>Mathematical System Invariants</span>
        </h3>
        <p className="text-sm text-slate-300 mb-4">
          At any point during valid synchronized execution, the following invariants strictly hold true:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-mono text-xs">
          <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl">
            <span className="text-slate-500 font-bold">INVARIANT 1:</span>
            <p className="font-black text-emerald-400 text-sm mt-1">empty + full = MAX_BUFFER</p>
            <p className="text-slate-400 font-sans text-xs mt-1">Free capacity plus occupied items strictly equals the total buffer bounds.</p>
          </div>

          <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl">
            <span className="text-slate-500 font-bold">INVARIANT 2:</span>
            <p className="font-black text-cyan-400 text-sm mt-1">mutex ∈ &#123;0, 1&#125; &amp;&amp; in_CS ≤ 1</p>
            <p className="text-slate-400 font-sans text-xs mt-1">At most one thread is granted execution privilege inside the critical section at any clock tick.</p>
          </div>
        </div>
      </div>
    </div>
  );
};
