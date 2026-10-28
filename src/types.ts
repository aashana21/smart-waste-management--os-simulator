export type WasteCategory = 'organic' | 'recyclable' | 'electronic' | 'glass' | 'metal';

export interface WasteItem {
  id: string;
  category: WasteCategory;
  name: string;
  icon: string;
  producedAt: number;
}

export type ActorStatus = 'idle' | 'requesting' | 'in_cs' | 'waiting' | 'blocked' | 'colliding';

export interface LogEntry {
  id: string;
  timestamp: string;
  type: 'produce' | 'consume' | 'race' | 'lock' | 'unlock' | 'wait' | 'signal' | 'solved' | 'error' | 'combo';
  title: string;
  description: string;
}

export type CodeLanguage = 'c' | 'python' | 'pseudo';

export type SimulationMode = 'manual' | 'auto';

export type RaceStage =
  | 'idle'
  | 'assault'
  | 'collision'
  | 'freeze_explain'
  | 'semaphore_engage'
  | 'producer_safe'
  | 'consumer_safe'
  | 'solved';

export interface FloatingText {
  id: string;
  text: string;
  x: number;
  y: number;
  color: string;
}

export interface GameStats {
  score: number;
  combo: number;
  maxCombo: number;
  integrity: number; // 0 - 100%
  safeOperations: number;
  racesPrevented: number;
  level: number;
}
