import React from 'react';
import { Lock, Unlock, AlertTriangle, ShieldCheck, Zap, Sparkles, CheckCircle2 } from 'lucide-react';
import { WasteItem, ActorStatus, RaceStage, FloatingText } from '../types.ts';

interface SimulationStageProps {
  buffer: WasteItem[];
  maxSlots: number;
  producerStatus: ActorStatus;
  consumerStatus: ActorStatus;
  producerMessage: string;
  consumerMessage: string;
  mutex: number;
  lockHolder: 'none' | 'producer' | 'consumer' | 'contested';
  raceStage: RaceStage;
  currentPayload: WasteItem | null;
  lastRecycled: WasteItem | null;
  inPointer: number;
  outPointer: number;
  floatingTexts: FloatingText[];
}

export const SimulationStage: React.FC<SimulationStageProps> = ({
  buffer,
  maxSlots,
  producerStatus,
  consumerStatus,
  producerMessage,
  consumerMessage,
  mutex,
  lockHolder,
  raceStage,
  currentPayload,
  lastRecycled,
  inPointer,
  outPointer,
  floatingTexts,
}) => {
  const isColliding = raceStage === 'collision' || raceStage === 'freeze_explain';
  const isAssaulting = raceStage === 'assault';
  const isShieldEngaged = raceStage === 'semaphore_engage' || raceStage === 'producer_safe';
  const isSolved = raceStage === 'solved';

  // Producer position translation
  let producerTranslateX = '0px';
  if (isAssaulting || isColliding) {
    producerTranslateX = 'clamp(40px, 12vw, 130px)';
  } else if (producerStatus === 'in_cs') {
    producerTranslateX = 'clamp(20px, 6vw, 65px)';
  }

  // Consumer position translation
  let consumerTranslateX = '0px';
  if (isAssaulting || isColliding) {
    consumerTranslateX = 'clamp(-130px, -12vw, -40px)';
  } else if (consumerStatus === 'in_cs') {
    consumerTranslateX = 'clamp(-65px, -6vw, -20px)';
  } else if (isShieldEngaged && consumerStatus === 'waiting') {
    // Repelled back by forcefield!
    consumerTranslateX = 'clamp(-160px, -15vw, -60px)';
  }

  return (
    <div className="w-full max-w-5xl mx-auto relative select-none">
      {/* Floating XP / Score Popups */}
      {floatingTexts.map((ft) => (
        <div
          key={ft.id}
          className="absolute z-50 pointer-events-none font-mono font-black text-sm sm:text-base animate-float-score drop-shadow-md"
          style={{ left: `${ft.x}%`, top: `${ft.y}%`, color: ft.color }}
        >
          {ft.text}
        </div>
      ))}

      {/* Main Arena Box */}
      <div
        className={`w-full bg-slate-950/95 rounded-3xl border-2 p-6 sm:p-10 transition-all duration-300 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl cyber-grid ${
          isColliding
            ? 'border-rose-500 shadow-[0_0_50px_rgba(244,63,94,0.6)] animate-severe-shake'
            : isShieldEngaged
            ? 'border-amber-400 shadow-[0_0_40px_rgba(251,191,36,0.3)]'
            : mutex === 0
            ? 'border-cyan-500/80 shadow-[0_0_30px_rgba(6,182,212,0.25)]'
            : 'border-slate-800'
        }`}
      >
        {/* Arena Atmosphere Glows */}
        <div className="absolute -top-32 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-32 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* --- RACE CONDITION COLLISION OVERLAY --- */}
        <div
          className={`absolute inset-0 z-40 bg-slate-950/90 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center transition-all duration-500 ${
            isColliding
              ? 'opacity-100 pointer-events-auto scale-100'
              : 'opacity-0 pointer-events-none scale-95'
          }`}
        >
          {/* Pulsing Alarm Beacon */}
          <div className="bg-rose-600 text-white px-7 py-3.5 rounded-full font-black text-base sm:text-xl shadow-[0_0_35px_rgba(244,63,94,0.9)] flex items-center gap-3 animate-glitch border-2 border-rose-300">
            <AlertTriangle className="w-6 h-6 animate-bounce text-amber-300" />
            <span>CRITICAL HAZARD: RACE CONDITION DETECTED!</span>
          </div>

          <div className="mt-5 max-w-xl bg-slate-900/95 border-2 border-rose-500/80 rounded-2xl p-5 text-white text-xs sm:text-sm text-left shadow-2xl relative overflow-hidden">
            <div className="flex items-center justify-between pb-2 mb-2 border-b border-rose-500/30">
              <span className="font-mono font-bold text-rose-400 uppercase tracking-wider flex items-center gap-1.5">
                <Zap className="w-4 h-4 text-amber-400" />
                Unsynchronized Memory Clash
              </span>
              <span className="text-[11px] font-mono text-rose-300 bg-rose-500/20 px-2 py-0.5 rounded border border-rose-500/40 font-bold">
                MUTEX BYPASSED
              </span>
            </div>

            <p className="text-slate-200 leading-relaxed font-sans">
              Both <strong className="text-emerald-400">EcoTruck-01 🚛</strong> and{' '}
              <strong className="text-cyan-400">RecycleBot-02 ♻️</strong> simultaneously breached the{' '}
              <strong className="text-white">Critical Section</strong> without holding the Mutual Exclusion Semaphore.
            </p>

            <div className="mt-3 bg-slate-950/80 p-3 rounded-xl border border-slate-800 font-mono text-xs space-y-1">
              <div className="text-rose-400 font-bold">⚡ Thread Collision:</div>
              <div className="text-slate-300 text-[11px]">
                • Producer reading/writing Buffer Index [{inPointer % maxSlots}]<br/>
                • Consumer reading/writing Buffer Index [{outPointer % maxSlots}]<br/>
                • Consequence: <span className="text-rose-300 font-bold">Lost Update / Data Corruption!</span>
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between text-xs font-mono pt-2 border-t border-slate-800">
              <span className="text-slate-400">STATUS: INTERLEAVING CONFLICT</span>
              <span className="text-amber-400 font-bold animate-pulse">DEPLOYING SEMAPHORE SHIELD...</span>
            </div>
          </div>
        </div>

        {/* --- CELEBRATORY SOLVED OVERLAY (GAMING VICTORY) --- */}
        <div
          className={`absolute inset-0 z-40 bg-slate-950/92 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center transition-all duration-500 ${
            isSolved
              ? 'opacity-100 pointer-events-auto scale-100'
              : 'opacity-0 pointer-events-none scale-95'
          }`}
        >
          {/* Glowing Solved Shield Badge */}
          <div className="bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-500 text-slate-950 px-8 py-3.5 rounded-full font-black text-xl sm:text-2xl shadow-[0_0_50px_rgba(52,211,153,0.9)] flex items-center gap-3 border-2 border-white animate-bounce">
            <ShieldCheck className="w-8 h-8 text-slate-950" />
            <span>SOLVED BY SYNCHRONIZATION!</span>
          </div>

          {/* Victory Mission Report Card */}
          <div className="mt-6 max-w-lg bg-slate-900/95 border-2 border-emerald-400/80 rounded-2xl p-6 text-white text-xs sm:text-sm text-left shadow-2xl relative">
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800 font-mono">
              <span className="text-emerald-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-400" />
                Mission Complete: Data Integrity Restored
              </span>
              <span className="text-amber-400 font-black text-sm bg-amber-500/20 px-2.5 py-0.5 rounded border border-amber-500/40">
                +1,000 XP
              </span>
            </div>

            <p className="text-slate-200 leading-relaxed font-sans text-sm">
              The <strong className="text-emerald-400 font-mono">Binary Semaphore (mutex)</strong> successfully enforced mutual exclusion. The Consumer was queued in stasis, allowing the Producer to finish safely before granting access.
            </p>

            <div className="mt-4 grid grid-cols-2 gap-2 text-xs font-mono">
              <div className="bg-slate-950 p-2.5 rounded-xl border border-emerald-500/30 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="text-slate-300">Mutual Exclusion: <strong className="text-emerald-400">100%</strong></span>
              </div>
              <div className="bg-slate-950 p-2.5 rounded-xl border border-emerald-500/30 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="text-slate-300">Lost Updates: <strong className="text-emerald-400">0</strong></span>
              </div>
              <div className="bg-slate-950 p-2.5 rounded-xl border border-emerald-500/30 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="text-slate-300">Bounded Wait: <strong className="text-emerald-400">Safe</strong></span>
              </div>
              <div className="bg-slate-950 p-2.5 rounded-xl border border-emerald-500/30 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="text-slate-300">Integrity Health: <strong className="text-emerald-400">100%</strong></span>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-800 text-[11px] font-mono text-slate-400 text-center">
              ✓ Race condition eliminated through Dijkstra Semaphore synchronization protocol.
            </div>
          </div>
        </div>

        {/* --- PRODUCER UNIT (ECOTRUCK-01) --- */}
        <div
          className={`actor flex flex-col items-center text-center w-full md:w-56 transition-all duration-500 z-10 ${
            producerStatus === 'waiting' || producerStatus === 'blocked' ? 'opacity-40 grayscale-50' : 'opacity-100'
          }`}
          style={{ transform: `translateX(${producerTranslateX})` }}
        >
          <div className="relative group">
            {/* Thruster energy halo */}
            <div className="absolute -inset-2 bg-emerald-500/20 rounded-full blur-md opacity-75 group-hover:opacity-100 transition-opacity" />
            <div className={`relative text-6xl sm:text-7xl transition-transform duration-300 filter drop-shadow-[0_0_15px_rgba(52,211,153,0.4)] ${
              producerStatus === 'in_cs' ? 'scale-115' : ''
            }`}>
              🚛
            </div>
            {currentPayload && (
              <span className="absolute -top-2 -right-3 bg-emerald-950 border border-emerald-400 text-white rounded-xl text-lg p-1.5 shadow-[0_0_10px_rgba(52,211,153,0.6)] animate-bounce" title={currentPayload.name}>
                {currentPayload.icon}
              </span>
            )}
          </div>

          <div className="mt-3">
            <div className="flex items-center justify-center gap-1.5 text-xs font-mono font-black text-emerald-400 tracking-wider">
              <span>ECOTRUCK-01</span>
              <span className="text-[10px] text-slate-400">PID: 101</span>
            </div>
            <div className={`mt-1.5 text-xs font-mono font-bold px-3 py-1 rounded-lg border inline-block transition-colors ${
              producerStatus === 'in_cs'
                ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300 shadow-[0_0_12px_rgba(52,211,153,0.4)]'
                : producerStatus === 'waiting'
                ? 'bg-amber-500/20 border-amber-400 text-amber-300'
                : producerStatus === 'colliding'
                ? 'bg-rose-500/30 border-rose-400 text-rose-300 font-black animate-pulse'
                : 'text-slate-400 bg-slate-900 border-slate-800'
            }`}>
              {producerMessage}
            </div>
          </div>
          <div className="mt-2 text-[10px] text-slate-400 font-mono">
            TARGET SLOT: <span className="font-bold text-emerald-400">[{inPointer % maxSlots}]</span>
          </div>
        </div>

        {/* --- SHARED CRITICAL SECTION ARENA & BOUNDED BUFFER --- */}
        <div className="buffer-area flex-1 w-full my-2 md:my-0 flex flex-col items-center z-20">
          {/* Critical Section Energy Header */}
          <div className="flex items-center gap-2 mb-2 font-mono">
            <span className="text-[11px] font-black tracking-wider uppercase flex items-center gap-1.5 text-slate-300">
              {mutex === 0 ? (
                <Lock className="w-3.5 h-3.5 text-rose-400 animate-pulse" />
              ) : (
                <Unlock className="w-3.5 h-3.5 text-emerald-400" />
              )}
              CRITICAL SECTION VAULT
            </span>
            <span className="text-xs font-bold text-cyan-300 bg-cyan-950/80 border border-cyan-500/40 px-2 py-0.5 rounded-md font-mono shadow-[0_0_10px_rgba(34,211,238,0.3)]">
              {buffer.length}/{maxSlots} SLOTS
            </span>
          </div>

          {/* Buffer Slots Enclosure with Forcefield Glow */}
          <div
            className={`w-full max-w-lg p-3 sm:p-5 rounded-2xl border-2 transition-all duration-300 relative ${
              isColliding
                ? 'border-rose-500 bg-rose-950/40 shadow-[0_0_40px_rgba(244,63,94,0.5)]'
                : isShieldEngaged
                ? 'border-amber-400 bg-amber-950/20 animate-energy-shield'
                : mutex === 0
                ? 'border-rose-500/80 bg-slate-900/90 shadow-[0_0_30px_rgba(244,63,94,0.4)]'
                : 'border-slate-800 bg-slate-900/70 shadow-inner'
            }`}
          >
            {/* Forcefield Laser Barrier Visual when Mutex is Locked */}
            {mutex === 0 && (
              <div className="absolute inset-x-0 -top-3 z-30 flex items-center justify-center pointer-events-none">
                <span className="bg-rose-600 text-white font-mono font-black text-[10px] px-3 py-0.5 rounded-full uppercase tracking-wider shadow-[0_0_15px_rgba(244,63,94,0.9)] border border-rose-300 flex items-center gap-1">
                  <Lock className="w-3 h-3" />
                  FORCEFIELD SHIELD ACTIVE
                </span>
              </div>
            )}

            <div className="flex items-center justify-center gap-2 sm:gap-3 flex-wrap">
              {Array.from({ length: maxSlots }).map((_, index) => {
                const item = buffer[index];
                const isNextIn = inPointer % maxSlots === index;
                const isNextOut = outPointer % maxSlots === index && buffer.length > 0;

                return (
                  <div key={index} className="flex flex-col items-center">
                    <div
                      className={`w-12 h-12 sm:w-14 sm:h-14 rounded-xl flex items-center justify-center text-2xl transition-all duration-300 relative border-2 ${
                        item
                          ? 'bg-slate-800/90 border-emerald-400 shadow-[0_0_15px_rgba(52,211,153,0.4)] scale-105'
                          : 'bg-slate-950/80 border-dashed border-slate-700 text-slate-600'
                      }`}
                    >
                      {item ? (
                        <span className="filter drop-shadow transition-transform hover:scale-125" title={item.name}>
                          {item.icon}
                        </span>
                      ) : (
                        <span className="text-[10px] font-mono text-slate-600">EMPTY</span>
                      )}

                      {/* IN Pointer Laser Tag */}
                      {isNextIn && (
                        <div
                          className="absolute -top-3.5 left-1/2 -translate-x-1/2 text-[9px] font-mono font-black text-emerald-300 bg-emerald-950 border border-emerald-400 px-1.5 py-0.2 rounded shadow-[0_0_8px_rgba(52,211,153,0.6)]"
                          title="Producer IN pointer"
                        >
                          IN
                        </div>
                      )}
                      {/* OUT Pointer Laser Tag */}
                      {isNextOut && !isNextIn && (
                        <div
                          className="absolute -bottom-3.5 left-1/2 -translate-x-1/2 text-[9px] font-mono font-black text-cyan-300 bg-cyan-950 border border-cyan-400 px-1.5 py-0.2 rounded shadow-[0_0_8px_rgba(34,211,238,0.6)]"
                          title="Consumer OUT pointer"
                        >
                          OUT
                        </div>
                      )}
                    </div>
                    <span className="mt-1.5 text-[10px] font-mono font-bold text-slate-500">
                      [{index}]
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Mutex State Telemetry */}
            <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-xs font-mono">
              <span className="flex items-center gap-1.5">
                <span className={`w-2 h-2 rounded-full ${mutex === 1 ? 'bg-emerald-400' : 'bg-rose-500 animate-ping'}`} />
                <span className={mutex === 1 ? 'text-emerald-400' : 'text-rose-400 font-bold'}>
                  {mutex === 1 ? 'VAULT OPEN (MUTEX=1)' : 'VAULT SHIELDED (MUTEX=0)'}
                </span>
              </span>
              <span className="text-slate-400 text-[11px]">
                {lockHolder === 'producer'
                  ? 'Key: EcoTruck 🚛'
                  : lockHolder === 'consumer'
                  ? 'Key: RecycleBot ♻️'
                  : lockHolder === 'contested'
                  ? '⚠️ CONFLICT!'
                  : 'Key: Available'}
              </span>
            </div>
          </div>
        </div>

        {/* --- CONSUMER UNIT (RECYCLEBOT-02) --- */}
        <div
          className={`actor flex flex-col items-center text-center w-full md:w-56 transition-all duration-500 z-10 ${
            consumerStatus === 'waiting' || consumerStatus === 'blocked' ? 'opacity-40 grayscale-50' : 'opacity-100'
          }`}
          style={{ transform: `translateX(${consumerTranslateX})` }}
        >
          <div className="relative group">
            {/* Plasma energy halo */}
            <div className="absolute -inset-2 bg-cyan-500/20 rounded-full blur-md opacity-75 group-hover:opacity-100 transition-opacity" />
            <div className={`relative text-6xl sm:text-7xl transition-transform duration-300 filter drop-shadow-[0_0_15px_rgba(34,211,238,0.4)] ${
              consumerStatus === 'in_cs' ? 'scale-115' : ''
            }`}>
              ♻️
            </div>
            {lastRecycled && (
              <span className="absolute -top-2 -left-3 bg-cyan-950 border border-cyan-400 text-white rounded-xl text-lg p-1.5 shadow-[0_0_10px_rgba(34,211,238,0.6)] animate-pulse" title={`Refined: ${lastRecycled.name}`}>
                {lastRecycled.icon}
              </span>
            )}
          </div>

          <div className="mt-3">
            <div className="flex items-center justify-center gap-1.5 text-xs font-mono font-black text-cyan-400 tracking-wider">
              <span>RECYCLEBOT-02</span>
              <span className="text-[10px] text-slate-400">PID: 202</span>
            </div>
            <div className={`mt-1.5 text-xs font-mono font-bold px-3 py-1 rounded-lg border inline-block transition-colors ${
              consumerStatus === 'in_cs'
                ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300 shadow-[0_0_12px_rgba(34,211,238,0.4)]'
                : consumerStatus === 'waiting'
                ? 'bg-amber-500/20 border-amber-400 text-amber-300'
                : consumerStatus === 'colliding'
                ? 'bg-rose-500/30 border-rose-400 text-rose-300 font-black animate-pulse'
                : 'text-slate-400 bg-slate-900 border-slate-800'
            }`}>
              {consumerMessage}
            </div>
          </div>
          <div className="mt-2 text-[10px] text-slate-400 font-mono">
            TARGET SLOT: <span className="font-bold text-cyan-400">[{outPointer % maxSlots}]</span>
          </div>
        </div>
      </div>
    </div>
  );
};
