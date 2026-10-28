import React from 'react';
import { LogEntry } from '../types.ts';
import { ListFilter, Trash2, Terminal } from 'lucide-react';

interface AuditLogProps {
  logs: LogEntry[];
  onClearLogs: () => void;
}

export const AuditLog: React.FC<AuditLogProps> = ({ logs, onClearLogs }) => {
  return (
    <div className="w-full max-w-5xl mx-auto bg-slate-900/90 rounded-2xl border border-slate-800 shadow-xl p-4 sm:p-5 backdrop-blur-xs font-mono">
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <Terminal className="w-4 h-4 text-emerald-400" />
          <h4 className="text-xs sm:text-sm font-bold text-slate-200 uppercase tracking-wider">
            Kernel Event &amp; Semaphore Telemetry Feed
          </h4>
          <span className="text-[11px] text-slate-500">[{logs.length} EVENTS]</span>
        </div>

        <button
          onClick={onClearLogs}
          disabled={logs.length === 0}
          className="text-xs text-slate-400 hover:text-rose-400 disabled:opacity-30 disabled:cursor-not-allowed flex items-center gap-1.5 transition-colors cursor-pointer"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>Clear Feed</span>
        </button>
      </div>

      <div className="mt-3 max-h-60 overflow-y-auto space-y-2 pr-1 text-xs">
        {logs.length === 0 ? (
          <div className="text-center py-6 text-slate-500 font-sans">
            Feed is quiet. Initiate produce or consume commands to capture kernel traces.
          </div>
        ) : (
          logs.map((log) => {
            let badgeStyle = 'bg-slate-800 text-slate-300 border-slate-700';
            if (log.type === 'produce') badgeStyle = 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 shadow-[0_0_8px_rgba(52,211,153,0.3)]';
            else if (log.type === 'consume') badgeStyle = 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40 shadow-[0_0_8px_rgba(34,211,238,0.3)]';
            else if (log.type === 'race') badgeStyle = 'bg-rose-500/30 text-rose-300 border-rose-500/50 shadow-[0_0_10px_rgba(244,63,94,0.5)] font-black animate-pulse';
            else if (log.type === 'solved') badgeStyle = 'bg-emerald-500/30 text-emerald-300 border-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.6)] font-black';
            else if (log.type === 'lock') badgeStyle = 'bg-amber-500/20 text-amber-300 border-amber-500/40';
            else if (log.type === 'error') badgeStyle = 'bg-rose-500/20 text-rose-300 border-rose-500/40 font-bold';

            return (
              <div
                key={log.id}
                className="flex items-start gap-2.5 p-2 rounded-xl bg-slate-950/70 border border-slate-800/80 hover:border-slate-700 transition-colors"
              >
                <span className="text-slate-500 select-none shrink-0 text-[11px] pt-0.5">
                  {log.timestamp}
                </span>
                <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold border shrink-0 ${badgeStyle}`}>
                  {log.type.toUpperCase()}
                </span>
                <div className="flex-1">
                  <span className="font-bold text-slate-200">{log.title}: </span>
                  <span className="text-slate-400 font-sans text-xs">{log.description}</span>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
