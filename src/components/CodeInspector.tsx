import React, { useState } from 'react';
import { CodeLanguage } from '../types.ts';
import { CODE_SNIPPETS } from '../utils/constants.ts';
import { Terminal, Copy, Check } from 'lucide-react';

interface CodeInspectorProps {
  activeHighlight: string | null;
}

export const CodeInspector: React.FC<CodeInspectorProps> = ({ activeHighlight }) => {
  const [language, setLanguage] = useState<CodeLanguage>('c');
  const [copied, setCopied] = useState(false);

  const currentSnippet = CODE_SNIPPETS[language];

  const handleCopy = () => {
    const fullText = `// Producer:\n${currentSnippet.producer.map(l => l.text).join('\n')}\n\n// Consumer:\n${currentSnippet.consumer.map(l => l.text).join('\n')}`;
    navigator.clipboard.writeText(fullText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6">
      {/* Code Viewer Container */}
      <div className="bg-slate-900 rounded-2xl border border-slate-800 shadow-xl overflow-hidden text-slate-100">
        {/* Top bar of the code terminal */}
        <div className="bg-slate-950 px-5 py-3 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-rose-500/80 inline-block" />
              <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block" />
              <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block" />
            </div>
            <span className="text-xs font-mono text-slate-400 flex items-center gap-1.5">
              <Terminal className="w-3.5 h-3.5" />
              producer_consumer_sync.{language === 'c' ? 'c' : language === 'python' ? 'py' : 'txt'}
            </span>
          </div>

          <div className="flex items-center gap-3">
            {/* Language Selector */}
            <div className="flex items-center bg-slate-900 p-0.5 rounded-lg border border-slate-800">
              <button
                onClick={() => setLanguage('c')}
                className={`px-2.5 py-1 text-xs font-mono rounded-md transition-colors ${
                  language === 'c' ? 'bg-slate-800 text-white font-semibold' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                C (POSIX)
              </button>
              <button
                onClick={() => setLanguage('python')}
                className={`px-2.5 py-1 text-xs font-mono rounded-md transition-colors ${
                  language === 'python' ? 'bg-slate-800 text-white font-semibold' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Python
              </button>
              <button
                onClick={() => setLanguage('pseudo')}
                className={`px-2.5 py-1 text-xs font-mono rounded-md transition-colors ${
                  language === 'pseudo' ? 'bg-slate-800 text-white font-semibold' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Pseudocode
              </button>
            </div>

            <button
              onClick={handleCopy}
              className="p-1.5 text-slate-400 hover:text-white rounded hover:bg-slate-800 transition-colors"
              title="Copy code"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Dual Code Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-slate-800 p-4 sm:p-6 gap-6 font-mono text-xs sm:text-[13px] leading-relaxed">
          {/* Producer Routine */}
          <div>
            <div className="flex items-center justify-between pb-2 mb-3 border-b border-slate-800 text-slate-400 text-xs">
              <span className="font-bold text-emerald-400">PRODUCER THREAD</span>
              <span>🚛 Writes into Shared Buffer</span>
            </div>
            <div className="space-y-1">
              {currentSnippet.producer.map((lineObj) => {
                const isActive = lineObj.highlightKey && activeHighlight === lineObj.highlightKey;
                return (
                  <div
                    key={lineObj.line}
                    className={`flex items-start gap-3 px-2 py-0.5 rounded transition-all ${
                      isActive
                        ? 'bg-emerald-950/80 text-emerald-300 font-bold border-l-2 border-emerald-400'
                        : 'text-slate-300 hover:bg-slate-800/40'
                    }`}
                  >
                    <span className="text-slate-600 select-none w-5 text-right font-mono text-[11px]">
                      {lineObj.line}
                    </span>
                    <span className="flex-1 whitespace-pre">{lineObj.text}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Consumer Routine */}
          <div>
            <div className="flex items-center justify-between pb-2 mb-3 border-b border-slate-800 text-slate-400 text-xs">
              <span className="font-bold text-sky-400">CONSUMER THREAD</span>
              <span>♻️ Reads from Shared Buffer</span>
            </div>
            <div className="space-y-1">
              {currentSnippet.consumer.map((lineObj) => {
                const isActive = lineObj.highlightKey && activeHighlight === lineObj.highlightKey;
                return (
                  <div
                    key={lineObj.line}
                    className={`flex items-start gap-3 px-2 py-0.5 rounded transition-all ${
                      isActive
                        ? 'bg-sky-950/80 text-sky-300 font-bold border-l-2 border-sky-400'
                        : 'text-slate-300 hover:bg-slate-800/40'
                    }`}
                  >
                    <span className="text-slate-600 select-none w-5 text-right font-mono text-[11px]">
                      {lineObj.line}
                    </span>
                    <span className="flex-1 whitespace-pre">{lineObj.text}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Live Instruction Banner */}
        <div className="bg-slate-950/90 px-6 py-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400 font-mono">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Active CPU Pipeline:</span>
            <span className="text-emerald-400 font-bold">
              {activeHighlight ? activeHighlight.toUpperCase() : 'IDLE / WAITING'}
            </span>
          </div>
          <span className="text-slate-500">Atomic Semaphore Operations</span>
        </div>
      </div>
    </div>
  );
};
