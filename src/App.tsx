import React, { useState, useEffect, useRef, useCallback } from 'react';
import confetti from 'canvas-confetti';
import { Header } from './components/Header.tsx';
import { SemaphoreDashboard } from './components/SemaphoreDashboard.tsx';
import { SimulationStage } from './components/SimulationStage.tsx';
import { ControlDeck } from './components/ControlDeck.tsx';
import { RaceConditionLab } from './components/RaceConditionLab.tsx';
import { CodeInspector } from './components/CodeInspector.tsx';
import { OSTheory } from './components/OSTheory.tsx';
import { AuditLog } from './components/AuditLog.tsx';
import { WasteItem, ActorStatus, RaceStage, LogEntry, FloatingText, GameStats } from './types.ts';
import { WASTE_SAMPLES } from './utils/constants.ts';
import { sound } from './utils/audio.ts';

export default function App() {
  const [maxSlots, setMaxSlots] = useState<number>(5);
  const [buffer, setBuffer] = useState<WasteItem[]>([
    {
      id: 'init-1',
      category: 'recyclable',
      name: 'Plastic Bottles',
      icon: '🧴',
      producedAt: Date.now() - 3000,
    },
  ]);
  const [empty, setEmpty] = useState<number>(4);
  const [full, setFull] = useState<number>(1);
  const [mutex, setMutex] = useState<number>(1);
  const [lockHolder, setLockHolder] = useState<'none' | 'producer' | 'consumer' | 'contested'>('none');

  const [producerStatus, setProducerStatus] = useState<ActorStatus>('idle');
  const [consumerStatus, setConsumerStatus] = useState<ActorStatus>('idle');
  const [producerMessage, setProducerMessage] = useState<string>('Ready');
  const [consumerMessage, setConsumerMessage] = useState<string>('Ready');

  const [inPointer, setInPointer] = useState<number>(1);
  const [outPointer, setOutPointer] = useState<number>(0);

  const [currentPayload, setCurrentPayload] = useState<WasteItem | null>(null);
  const [lastRecycled, setLastRecycled] = useState<WasteItem | null>(null);

  const [raceStage, setRaceStage] = useState<RaceStage>('idle');
  const [activeHighlight, setActiveHighlight] = useState<string | null>(null);
  const [statusBarText, setStatusBarText] = useState<string>(
    'System Initialized. Awaiting producer or consumer command.'
  );

  const [isBusy, setIsBusy] = useState<boolean>(false);
  const [autoPlay, setAutoPlay] = useState<boolean>(false);
  const [speed, setSpeed] = useState<number>(1);
  const [bypassMutex, setBypassMutex] = useState<boolean>(false);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<'stage' | 'lab' | 'code' | 'theory'>('stage');

  // Gaming Stats & Floating Scores
  const [gameStats, setGameStats] = useState<GameStats>({
    score: 1200,
    combo: 1,
    maxCombo: 1,
    integrity: 100,
    safeOperations: 12,
    racesPrevented: 1,
    level: 2,
  });

  const [floatingTexts, setFloatingTexts] = useState<FloatingText[]>([]);

  const [logs, setLogs] = useState<LogEntry[]>([
    {
      id: 'log-0',
      timestamp: new Date().toLocaleTimeString(),
      type: 'signal',
      title: 'Kernel Init',
      description: 'Bounded buffer allocated with 5 slots. Mutex = 1, Empty = 4, Full = 1.',
    },
  ]);

  const autoPlayTimerRef = useRef<NodeJS.Timeout | null>(null);

  const spawnFloatingText = (text: string, x: number, y: number, color: string) => {
    const id = `ft-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`;
    setFloatingTexts((prev) => [...prev, { id, text, x, y, color }]);
    setTimeout(() => {
      setFloatingTexts((prev) => prev.filter((item) => item.id !== id));
    }, 1200);
  };

  const addLog = useCallback(
    (type: LogEntry['type'], title: string, description: string) => {
      const entry: LogEntry = {
        id: `log-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        timestamp: new Date().toLocaleTimeString(),
        type,
        title,
        description,
      };
      setLogs((prev) => [entry, ...prev.slice(0, 49)]);
    },
    []
  );

  const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms / speed));

  const toggleSound = () => {
    sound.enabled = !soundEnabled;
    setSoundEnabled(!soundEnabled);
  };

  const handleReset = () => {
    setAutoPlay(false);
    if (autoPlayTimerRef.current) clearInterval(autoPlayTimerRef.current);

    setBuffer([]);
    setEmpty(maxSlots);
    setFull(0);
    setMutex(1);
    setLockHolder('none');
    setProducerStatus('idle');
    setConsumerStatus('idle');
    setProducerMessage('Ready');
    setConsumerMessage('Ready');
    setInPointer(0);
    setOutPointer(0);
    setCurrentPayload(null);
    setLastRecycled(null);
    setRaceStage('idle');
    setActiveHighlight(null);
    setIsBusy(false);
    setStatusBarText('System reset. Awaiting action.');
    setGameStats((prev) => ({ ...prev, integrity: 100, combo: 1 }));
    addLog('unlock', 'System Reset', `Buffer cleared. Mutex restored to 1, empty = ${maxSlots}, full = 0.`);
  };

  // Safe or Bypass Produce execution
  const produce = useCallback(async () => {
    if (isBusy || raceStage !== 'idle') return;
    setIsBusy(true);

    if (empty === 0) {
      setStatusBarText('🔴 BUFFER FULL — EcoTruck blocked on wait(empty).');
      setProducerStatus('waiting');
      setProducerMessage('⏸ Blocked (empty == 0)');
      addLog('wait', 'Producer Blocked', 'wait(empty) failed: hopper is at maximum capacity.');
      setIsBusy(false);
      return;
    }

    setProducerStatus('requesting');
    setProducerMessage('wait(empty)');
    setActiveHighlight('wait_empty');
    sound.playLock();
    await sleep(350);

    // Decrement empty
    setEmpty((prev) => prev - 1);

    if (!bypassMutex) {
      setProducerMessage('wait(mutex)');
      setActiveHighlight('wait_mutex');
      setMutex(0);
      setLockHolder('producer');
      sound.playLock();
      addLog('lock', 'Mutex Acquired', 'EcoTruck locked the Critical Section vault (mutex=0).');
      await sleep(350);
    } else {
      addLog('lock', 'Mutex Bypassed', 'EcoTruck breached Critical Section without Mutex shield!');
    }

    // Critical Section: Insert Waste
    const sample = WASTE_SAMPLES[Math.floor(Math.random() * WASTE_SAMPLES.length)];
    const newItem: WasteItem = {
      id: `waste-${Date.now()}`,
      category: sample.category,
      name: sample.name,
      icon: sample.icon,
      producedAt: Date.now(),
    };

    setCurrentPayload(newItem);
    setProducerStatus('in_cs');
    setProducerMessage('Injecting Payload...');
    setActiveHighlight('cs_produce');
    setStatusBarText(`🚛 EcoTruck inserting ${newItem.name} into vault slot.`);
    sound.playProduce();
    await sleep(650);

    setBuffer((prev) => [...prev, newItem]);
    setInPointer((prev) => prev + 1);

    // Release Mutex & Signal Full
    if (!bypassMutex) {
      setMutex(1);
      setLockHolder('none');
      setActiveHighlight('signal_mutex');
      sound.playLock();
      addLog('unlock', 'Mutex Released', 'EcoTruck released Critical Section shield (mutex=1).');
      await sleep(300);
    }

    setActiveHighlight('signal_full');
    setFull((prev) => prev + 1);
    setProducerStatus('idle');
    setProducerMessage('✓ Success');
    setStatusBarText(`🟢 Payload ${newItem.name} safely deposited.`);
    addLog('produce', 'Waste Produced', `Added ${newItem.name} (${newItem.icon}) to buffer.`);
    sound.playScore();

    // Reward XP & update stats
    setGameStats((prev) => ({
      ...prev,
      score: prev.score + 100 * prev.combo,
      combo: prev.combo + 1,
      maxCombo: Math.max(prev.maxCombo, prev.combo + 1),
      safeOperations: prev.safeOperations + 1,
    }));
    spawnFloatingText(`+${100 * gameStats.combo} XP`, 24, 38, '#34d399');

    await sleep(250);
    setActiveHighlight(null);
    setIsBusy(false);
  }, [empty, isBusy, raceStage, bypassMutex, speed, maxSlots, gameStats.combo, addLog]);

  // Safe or Bypass Consume execution
  const consume = useCallback(async () => {
    if (isBusy || raceStage !== 'idle') return;
    setIsBusy(true);

    if (full === 0) {
      setStatusBarText('🔵 BUFFER EMPTY — RecycleBot waiting on wait(full).');
      setConsumerStatus('waiting');
      setConsumerMessage('⏸ Blocked (full == 0)');
      addLog('wait', 'Consumer Blocked', 'wait(full) failed: buffer has no items.');
      setIsBusy(false);
      return;
    }

    setConsumerStatus('requesting');
    setConsumerMessage('wait(full)');
    setActiveHighlight('wait_full');
    sound.playLock();
    await sleep(350);

    // Decrement full
    setFull((prev) => prev - 1);

    if (!bypassMutex) {
      setConsumerMessage('wait(mutex)');
      setActiveHighlight('wait_mutex');
      setMutex(0);
      setLockHolder('consumer');
      sound.playLock();
      addLog('lock', 'Mutex Acquired', 'RecycleBot locked the Critical Section vault (mutex=0).');
      await sleep(350);
    } else {
      addLog('lock', 'Mutex Bypassed', 'RecycleBot breached Critical Section without Mutex shield!');
    }

    // Critical Section: Extract Waste
    setConsumerStatus('in_cs');
    setConsumerMessage('Harvesting Item...');
    setActiveHighlight('cs_consume');
    setStatusBarText('♻️ RecycleBot harvesting item from vault slot...');
    sound.playConsume();
    await sleep(650);

    let extracted: WasteItem | null = null;
    setBuffer((prev) => {
      if (prev.length === 0) return prev;
      extracted = prev[0];
      return prev.slice(1);
    });
    setOutPointer((prev) => prev + 1);

    if (extracted) {
      setLastRecycled(extracted);
    }

    // Release Mutex & Signal Empty
    if (!bypassMutex) {
      setMutex(1);
      setLockHolder('none');
      setActiveHighlight('signal_mutex');
      sound.playLock();
      addLog('unlock', 'Mutex Released', 'RecycleBot released Critical Section shield (mutex=1).');
      await sleep(300);
    }

    setActiveHighlight('signal_empty');
    setEmpty((prev) => prev + 1);
    setConsumerStatus('idle');
    setConsumerMessage('✓ Success');
    setStatusBarText('🟢 RecycleBot extracted and refined resource.');
    addLog('consume', 'Waste Recycled', 'Processed 1 waste item from buffer.');
    sound.playScore();

    // Reward XP & update stats
    setGameStats((prev) => ({
      ...prev,
      score: prev.score + 150 * prev.combo,
      combo: prev.combo + 1,
      maxCombo: Math.max(prev.maxCombo, prev.combo + 1),
      safeOperations: prev.safeOperations + 1,
    }));
    spawnFloatingText(`+${150 * gameStats.combo} XP`, 72, 38, '#22d3ee');

    await sleep(250);
    setActiveHighlight(null);
    setIsBusy(false);
  }, [full, isBusy, raceStage, bypassMutex, speed, gameStats.combo, addLog]);

  // Dramatic Race Condition & Solution Protocol
  const simulateDramaticRace = useCallback(async () => {
    if (raceStage !== 'idle' || isBusy) return;
    setIsBusy(true);
    setAutoPlay(false);

    // Setup initial state: 2 items in buffer
    const itemA: WasteItem = {
      id: 'race-item-1',
      category: 'recyclable',
      name: 'Plastic Bottle',
      icon: '🧴',
      producedAt: Date.now(),
    };
    const itemB: WasteItem = {
      id: 'race-item-2',
      category: 'metal',
      name: 'Aluminum Can',
      icon: '🥫',
      producedAt: Date.now(),
    };

    setBuffer([itemA, itemB]);
    setEmpty(maxSlots - 2);
    setFull(2);
    setMutex(1);
    setLockHolder('none');
    setProducerStatus('idle');
    setConsumerStatus('idle');
    setProducerMessage('Ready');
    setConsumerMessage('Ready');
    addLog('race', 'Hazard Initiated', 'Unshielded state initialized. Both threads will clash concurrently!');

    await sleep(500);

    // 1. Stage: Assault (Concurrent unsynchronized approach)
    setRaceStage('assault');
    setStatusBarText('🚨 CRITICAL ALERT: Both threads charging into Critical Section without Mutex!');
    setProducerMessage('⚠️ CHARGING...');
    setConsumerMessage('⚠️ CHARGING...');
    setProducerStatus('requesting');
    setConsumerStatus('requesting');
    sound.playAlarm();
    addLog('race', 'Simultaneous Invasion', 'Threads entered Critical Section simultaneously without lock!');

    await sleep(900);

    // 2. Stage: Collision Detected!
    setRaceStage('collision');
    setLockHolder('contested');
    setProducerStatus('colliding');
    setConsumerStatus('colliding');
    setProducerMessage('💥 COLLISION!');
    setConsumerMessage('💥 COLLISION!');
    sound.playExplosion();
    // Plunge system integrity to 35%!
    setGameStats((prev) => ({ ...prev, integrity: 35, combo: 1 }));
    spawnFloatingText('CRITICAL CLASH! -65% HP', 50, 32, '#f43f5e');
    addLog('race', 'Race Hazard Clash', 'Interleaved memory corruption! Lost update hazard active.');

    await sleep(2500);

    // 3. Stage: Semaphore Forcefield Intervention
    setRaceStage('semaphore_engage');
    setStatusBarText('🛡️ SYNCHRONIZING: Mutex Forcefield Barrier deployed! Preempting Consumer to Stasis Queue.');
    sound.playShieldUp();
    addLog('lock', 'Semaphore Forcefield', 'Binary Mutex engaged! Consumer repelled into Stasis Queue.');

    // Repel consumer back into wait queue
    setConsumerStatus('waiting');
    setConsumerMessage('⏸ Preempted by Mutex');
    setLockHolder('producer');
    setMutex(0);
    spawnFloatingText('SHIELD DEPLOYED!', 50, 25, '#fbbf24');

    await sleep(1300);

    // 4. Safe sequential execution: Producer finishes
    setRaceStage('producer_safe');
    setProducerStatus('in_cs');
    setProducerMessage('Writing with Mutex Shield...');
    setActiveHighlight('cs_produce');
    const extraItem: WasteItem = {
      id: `safe-item-${Date.now()}`,
      category: 'electronic',
      name: 'E-Waste PCB',
      icon: '💻',
      producedAt: Date.now(),
    };
    setBuffer((prev) => [...prev, extraItem]);
    setEmpty((prev) => prev - 1);
    setFull((prev) => prev + 1);
    sound.playProduce();

    await sleep(900);

    // Producer exits, releases lock
    setProducerStatus('idle');
    setProducerMessage('✓ Safe Exit');
    setMutex(1);
    setLockHolder('none');
    sound.playLock();

    await sleep(600);

    // 5. Stage: Solved Celebration
    setRaceStage('solved');
    sound.playTriumph();
    confetti({
      particleCount: 120,
      spread: 80,
      origin: { y: 0.55 },
      colors: ['#10b981', '#06b6d4', '#f59e0b', '#ec4899', '#6366f1'],
    });
    setStatusBarText('🎉 SYNCHRONIZATION VICTORY: Race condition solved! 100% Data Integrity Restored.');
    // Restore integrity & award +1,000 XP!
    setGameStats((prev) => ({
      ...prev,
      integrity: 100,
      score: prev.score + 1000,
      racesPrevented: prev.racesPrevented + 1,
    }));
    spawnFloatingText('SOLVED! +1,000 XP', 50, 22, '#34d399');
    addLog('solved', 'Solved by Synchronization', 'Mutual exclusion invariant enforced. Zero data corruption.');

    await sleep(3500);

    // Clean finish
    setRaceStage('idle');
    setConsumerStatus('idle');
    setConsumerMessage('Ready');
    setProducerMessage('Ready');
    setActiveHighlight(null);
    setIsBusy(false);
  }, [raceStage, isBusy, maxSlots, speed, addLog]);

  // Deadlock Demo Trigger from Theory Tab
  const handleDeadlockDemo = () => {
    setActiveTab('stage');
    setBuffer([
      { id: 'd1', category: 'recyclable', name: 'Waste 1', icon: '🗑️', producedAt: 1 },
      { id: 'd2', category: 'recyclable', name: 'Waste 2', icon: '🗑️', producedAt: 2 },
      { id: 'd3', category: 'recyclable', name: 'Waste 3', icon: '🗑️', producedAt: 3 },
      { id: 'd4', category: 'recyclable', name: 'Waste 4', icon: '🗑️', producedAt: 4 },
      { id: 'd5', category: 'recyclable', name: 'Waste 5', icon: '🗑️', producedAt: 5 },
    ]);
    setEmpty(0);
    setFull(maxSlots);
    setMutex(0);
    setLockHolder('producer');
    setProducerStatus('blocked');
    setConsumerStatus('blocked');
    setProducerMessage('🛑 Deadlocked on empty');
    setConsumerMessage('🛑 Deadlocked on mutex');
    setStatusBarText('⚠️ CLASSICAL DEADLOCK: Inverted wait order locked both threads forever!');
    sound.playAlarm();
    addLog(
      'error',
      'Deadlock Trap Triggered',
      'Producer ran wait(mutex) before wait(empty) when buffer is full. Mutual deadlock!'
    );
  };

  // Auto-play loop
  useEffect(() => {
    if (autoPlay && !isBusy && raceStage === 'idle') {
      const interval = 2000 / speed;
      autoPlayTimerRef.current = setInterval(() => {
        if (buffer.length === 0) {
          produce();
        } else if (buffer.length >= maxSlots) {
          consume();
        } else {
          if (Math.random() > 0.5) {
            produce();
          } else {
            consume();
          }
        }
      }, interval);

      return () => {
        if (autoPlayTimerRef.current) clearInterval(autoPlayTimerRef.current);
      };
    }
  }, [autoPlay, isBusy, raceStage, buffer.length, maxSlots, speed, produce, consume]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans cyber-grid-dark selection:bg-emerald-500 selection:text-slate-950">
      {/* Arcade Header with Health & Score HUD */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        soundEnabled={soundEnabled}
        onToggleSound={toggleSound}
        onReset={handleReset}
        isRaceRunning={raceStage !== 'idle'}
        gameStats={gameStats}
      />

      {/* Main Game Arena */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {activeTab === 'stage' && (
          <div className="space-y-6">
            {/* Visual Arena Stage */}
            <SimulationStage
              buffer={buffer}
              maxSlots={maxSlots}
              producerStatus={producerStatus}
              consumerStatus={consumerStatus}
              producerMessage={producerMessage}
              consumerMessage={consumerMessage}
              mutex={mutex}
              lockHolder={lockHolder}
              raceStage={raceStage}
              currentPayload={currentPayload}
              lastRecycled={lastRecycled}
              inPointer={inPointer}
              outPointer={outPointer}
              floatingTexts={floatingTexts}
            />

            {/* Semaphore Cyber HUD */}
            <SemaphoreDashboard
              empty={empty}
              full={full}
              mutex={mutex}
              maxSlots={maxSlots}
              lockHolder={lockHolder}
            />

            {/* Arcade Controls */}
            <ControlDeck
              onProduce={produce}
              onConsume={consume}
              onSimulateRace={simulateDramaticRace}
              onReset={handleReset}
              isRaceRunning={raceStage !== 'idle'}
              autoPlay={autoPlay}
              onToggleAutoPlay={() => setAutoPlay(!autoPlay)}
              speed={speed}
              onChangeSpeed={setSpeed}
              bypassMutex= {bypassMutex}
              onToggleBypassMutex={() => setBypassMutex(!bypassMutex)}
              maxSlots={maxSlots}
              onChangeMaxSlots={(newMax) => {
                setMaxSlots(newMax);
                setEmpty(newMax - buffer.length);
              }}
              statusBarText={statusBarText}
              isBusy={isBusy}
            />

            {/* Live Kernel Audit Timeline */}
            <AuditLog logs={logs} onClearLogs={() => setLogs([])} />
          </div>
        )}

        {activeTab === 'lab' && (
          <RaceConditionLab
            onTriggerDramaticRace={() => {
              setActiveTab('stage');
              setTimeout(() => {
                simulateDramaticRace();
              }, 300);
            }}
            isRaceRunning={raceStage !== 'idle'}
          />
        )}

        {activeTab === 'code' && <CodeInspector activeHighlight={activeHighlight} />}

        {activeTab === 'theory' && (
          <OSTheory
            onTriggerDeadlockDemo={handleDeadlockDemo}
            isRaceRunning={raceStage !== 'idle'}
          />
        )}
      </main>

      {/* Arcade Footer */}
      <footer className="w-full border-t border-slate-900 bg-slate-950 py-4 text-center text-xs text-slate-500 font-mono">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>SMART WASTE OS · PRODUCER-CONSUMER ARCADE ARENA</span>
          <span className="text-slate-600">Dijkstra Semaphores · Mutual Exclusion Guarantees</span>
        </div>
      </footer>
    </div>
  );
}
