import React, { useState } from "react";
import { 
  Search, 
  Sparkles, 
  Globe, 
  FileText, 
  CheckCircle2, 
  AlertTriangle, 
  TrendingUp, 
  Info, 
  Layers, 
  Activity, 
  RefreshCw,
  EyeOff
} from "lucide-react";
import { NeutralGroundResult } from "../types";

const SUGGESTED_TOPICS = [
  "Prompt Injection",
  "LLM Jailbreak exploits",
  "Deepfake biometric theft",
  "Model weights exfiltration",
  "Data Poisoning attacks",
  "AI Safety laws & copyright"
];

export default function NeutralGround() {
  const [query, setQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<NeutralGroundResult | null>(null);
  const [scanLogs, setScanLogs] = useState<string[]>([]);

  const addLog = (message: string) => {
    const timestamp = new Date().toISOString().substring(11, 19);
    setScanLogs((prev) => [...prev, `[${timestamp}] ${message}`]);
  };

  const handleSearch = async (searchTerm: string) => {
    if (!searchTerm.trim()) return;
    
    setIsLoading(true);
    setError("");
    setResult(null);
    setScanLogs([]);
    addLog(`INITIATING COGNITIVE BIAS DISRUPTION SCANS FOR: "${searchTerm.toUpperCase()}"...`);
    addLog("POLLING SECURE WEB HEADLINES & ARCHIVES...");

    try {
      const response = await fetch("/api/neutral-ground", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: searchTerm })
      });

      if (!response.ok) {
        throw new Error("Integrated Purge engine reported an analytical error.");
      }

      addLog("RETRIEVING LINGUISTIC PATTERNS & COMPARING LEXICAL INTENSITY...");
      addLog("DE-SPINNING AGENDAS & DECOUPLING EMOTIONAL BIAS...");

      const data: NeutralGroundResult = await response.json();
      setResult(data);
      addLog(`STANDARDIZED CORE SYNTHESIS READY. RESOLVED FROM ${data.sourceCount || 10} INTEGRATED SOURCES.`);
      if (data.isHeuristicFallback) {
        addLog("WARN: APPLIED LOCAL HEURISTIC PARADIGM DUE TO LIVE FEED THROTTLING.");
      }
    } catch (err: any) {
      setError(err.message || "Failed to process target query.");
      addLog("FATAL: PURGE ENGINE INTERRUPT.");
    } finally {
      setIsLoading(false);
    }
  };

  const getBiasTheme = (score: number) => {
    if (score < 30) {
      return { 
        border: "border-emerald-500/20", 
        bg: "bg-emerald-950/10", 
        text: "text-emerald-400", 
        badge: "bg-emerald-950/60 text-emerald-400 border border-emerald-500/20",
        label: "Low Spin / Analytical"
      };
    }
    if (score < 65) {
      return { 
        border: "border-amber-500/20", 
        bg: "bg-amber-950/10", 
        text: "text-amber-400", 
        badge: "bg-amber-950/60 text-amber-400 border border-amber-500/20",
        label: "Moderate Spin"
      };
    }
    return { 
      border: "border-red-500/20", 
      bg: "bg-red-950/10", 
      text: "text-red-400", 
      badge: "bg-red-950/60 text-red-500 border border-red-500/20",
      label: "Dangerous Spin / Sensational"
    };
  };

  return (
    <div className="space-y-6" id="neutral-ground-panel">
      {/* Tab Banner */}
      <div className="bg-gradient-to-br from-slate-900/40 to-slate-950/80 border border-white/10 rounded-2xl p-6 md:p-8 relative overflow-hidden" id="neutral-ground-hero">
        <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none"></div>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          <div className="lg:col-span-8 space-y-4">
            <span className="px-3 py-1 text-[10px] font-mono tracking-widest uppercase bg-indigo-950 text-indigo-400 border border-indigo-800/30 rounded-full inline-block">
              Neutral Ground // AI Security Hub
            </span>
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white leading-tight">
              AI Security Intelligence & De-Spin Hub
            </h1>
            <p className="text-slate-400 text-sm md:text-base leading-relaxed">
              Purge sensationalist sci-fi dread and corporate PR deflection from AI safety, prompt injections, and cybersecurity events. Search any AI incident or vulnerability to extract the <strong className="text-cyan-400">verifiable technical reality</strong>.
            </p>
          </div>
          <div className="lg:col-span-4 bg-slate-950/60 p-4 rounded-xl border border-white/10 text-xs font-mono space-y-2">
            <div className="text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-800 pb-1.5 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse"></span>
              Sec-Ops Decoder Vector
            </div>
            <p className="text-[11px] text-slate-500 leading-relaxed border-l-2 border-indigo-500/50 pl-2">
              We analyze publications through an engineering lens, translating doom-mongering existential tropes or corporate legalities into precise, actionable technical exploit and mitigation summaries.
            </p>
          </div>
        </div>
      </div>

      {/* Main Control Input Bar */}
      <div className="bg-slate-950/60 border border-white/10 rounded-xl p-5" id="search-control-card">
        <div className="flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-500" />
            <input
              type="text"
              placeholder="Search AI security incident, exploit, or model vulnerability (e.g. prompt injection, GPT jailbreaks, deepfakes)..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSearch(query);
              }}
              className="w-full bg-slate-900 border border-white/10 rounded-lg pl-11 pr-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors"
              id="news-controversy-search-input"
            />
          </div>
          <button
            onClick={() => handleSearch(query)}
            disabled={isLoading || !query.trim()}
            className="px-6 py-2.5 bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white font-semibold rounded-lg text-sm transition-all shadow-[0_4px_12px_rgba(6,182,212,0.15)] flex items-center justify-center gap-2 disabled:opacity-40 disabled:pointer-events-none shrink-0"
            id="neutralize-spin-btn"
          >
            {isLoading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                Purging Bias...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                De-Spin Topic
              </>
            )}
          </button>
        </div>

        {/* Suggestion tags */}
        <div className="flex flex-wrap items-center gap-2 mt-4">
          <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest mr-1">Trending Vectors:</span>
          {SUGGESTED_TOPICS.map((topic, i) => (
            <button
              key={i}
              onClick={() => {
                setQuery(topic);
                handleSearch(topic);
              }}
              className="px-2.5 py-1 text-[11px] font-mono bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white border border-white/5 rounded transition-colors cursor-pointer"
            >
              {topic}
            </button>
          ))}
        </div>
      </div>

      {/* Loading Terminal Logs */}
      {isLoading && (
        <div className="bg-slate-950/60 border border-white/10 rounded-xl p-5 flex flex-col space-y-3 h-56">
          <div className="flex items-center justify-between border-b border-white/5 pb-2">
            <span className="text-xs font-mono font-semibold text-slate-400 flex items-center gap-2">
              <Activity className="w-4 h-4 text-cyan-400 animate-pulse" />
              INTEGRITY ENGINE LOG STREAM
            </span>
            <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950/30 px-1.5 py-0.5 rounded">CONNECTED</span>
          </div>
          <div className="flex-1 bg-black/40 border border-slate-900 rounded-lg p-3 font-mono text-[10px] text-cyan-500/80 overflow-y-auto space-y-1">
            {scanLogs.map((log, idx) => (
              <div key={idx} className="break-all">{log}</div>
            ))}
            <div className="animate-pulse inline-block w-1.5 h-3 bg-cyan-400 ml-1"></div>
          </div>
        </div>
      )}

      {/* Error state */}
      {error && (
        <div className="bg-red-950/10 border border-red-500/20 p-4 rounded-xl flex gap-3 text-red-400" id="error-card">
          <AlertTriangle className="w-5 h-5 shrink-0" />
          <div className="text-xs">
            <p className="font-bold">Linguistic Purge Collision</p>
            <p className="mt-1 text-slate-400">{error}</p>
          </div>
        </div>
      )}

      {/* Results View */}
      {result && (
        <div className="space-y-6" id="neutral-ground-results">
          
          {/* Top Info Strip */}
          <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-slate-950/40 border border-white/10 rounded-xl">
            <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
              <Globe className="w-4 h-4 text-cyan-400" />
              <span>CORE DISRUPTION REPORT // TOPIC:</span>
              <span className="text-white font-bold">{result.topic}</span>
            </div>
            <div className="flex items-center gap-4 text-[10px] font-mono">
              <span className="text-slate-500">Scanned: {result.timestamp ? new Date(result.timestamp).toLocaleTimeString() : "Recent"}</span>
              <span className="px-2 py-0.5 bg-indigo-950 text-indigo-400 rounded-md border border-indigo-900/30">
                {result.isHeuristicFallback ? "Heuristic Local Scans" : "Live News Grounded API"}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Box: Truth Synthesis and Physical facts */}
            <div className="lg:col-span-7 space-y-6">
              
              {/* Objective Truth Core Card */}
              <div className="bg-slate-950/40 border border-cyan-500/20 rounded-2xl relative overflow-hidden shadow-[0_0_20px_rgba(6,182,212,0.05)]" id="objective-summary-card">
                {/* Decorative scanner line */}
                <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-cyan-500 to-transparent shadow-[0_0_10px_#06b6d4]"></div>
                
                <div className="p-5 md:p-6 space-y-4">
                  <div className="flex items-center gap-2.5">
                    <div className="bg-cyan-950/60 p-2 rounded-lg border border-cyan-800/30">
                      <FileText className="w-5 h-5 text-cyan-400" />
                    </div>
                    <div>
                      <h3 className="text-xs font-mono font-bold tracking-wider text-cyan-400 uppercase">
                        PURGED CORE TRUTH SUMMARY
                      </h3>
                      <p className="text-[10px] font-mono text-slate-500 uppercase">FULLY DE-AFFILIATED CONGRUENCY LENS</p>
                    </div>
                  </div>

                  <p className="text-white text-sm md:text-base leading-relaxed tracking-normal bg-slate-900/40 p-4 rounded-xl border border-white/5">
                    {result.neutral_summary}
                  </p>
                </div>
              </div>

              {/* Undisputed Incontestable Facts Box */}
              <div className="bg-slate-950/40 border border-white/10 rounded-2xl p-5 space-y-4" id="factual-bedrock-card">
                <div className="flex items-center gap-2 border-b border-slate-800 pb-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <h4 className="text-xs font-mono font-bold tracking-wider text-slate-400 uppercase">
                    INCONTESTABLE HISTORICAL BEDROCK
                  </h4>
                </div>
                
                <ul className="space-y-3">
                  {result.key_facts.map((fact, index) => (
                    <li key={index} className="flex gap-2.5 text-xs text-slate-300 leading-relaxed bg-slate-900/20 p-2.5 rounded-lg border border-white/5">
                      <span className="text-cyan-500 font-mono font-bold">{String(index + 1).padStart(2, "0")}.</span>
                      <p>{fact}</p>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Spin Deconstruction Instruction Card */}
              <div className="bg-gradient-to-r from-indigo-950/30 to-purple-950/30 border border-indigo-500/20 rounded-xl p-4 flex gap-4" id="spin-deconstruction-card">
                <div className="p-2.5 bg-indigo-950/60 rounded-xl border border-indigo-500/30 text-indigo-400 h-fit">
                  <Info className="w-5 h-5" />
                </div>
                <div className="space-y-1">
                  <h5 className="text-xs font-mono font-bold text-slate-200 uppercase tracking-wide">
                    COGNITIVE SPIN DEFENSE TIP
                  </h5>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    {result.spin_deconstruction_tip}
                  </p>
                </div>
              </div>

            </div>

            {/* Right Box: Side-By-Side Editorial Spin Dissections */}
            <div className="lg:col-span-5 space-y-6">
              
              <div className="bg-slate-950/40 border border-white/10 rounded-2xl p-5 space-y-4" id="spin-analysis-column">
                <div className="flex items-center gap-2 border-b border-slate-800 pb-2.5 justify-between">
                  <div className="flex items-center gap-2">
                    <EyeOff className="w-4 h-4 text-indigo-400" />
                    <h4 className="text-xs font-mono font-bold tracking-wider text-slate-400 uppercase">
                      LINGUISTIC BIAS DISSECTION
                    </h4>
                  </div>
                  <span className="text-[10px] font-mono text-indigo-400 bg-indigo-950/30 px-2 py-0.5 rounded border border-indigo-800/30">
                    Spectrum Analysis
                  </span>
                </div>

                <div className="space-y-4">
                  {result.linguistic_breakdown.map((item, index) => {
                    const theme = getBiasTheme(item.bias_level_score);
                    return (
                      <div 
                        key={index} 
                        className={`border rounded-xl p-4 space-y-3 bg-slate-900/40 transition-all ${theme.border}`}
                      >
                        {/* Header of analysis card */}
                        <div className="flex items-start justify-between gap-2">
                          <div className="max-w-[150px] md:max-w-[200px]">
                            <span className={`text-xs font-sans font-bold block ${theme.text}`}>
                              {item.viewpoint_type}
                            </span>
                          </div>
                          <div className="text-right shrink-0">
                            <span className={`text-[10px] font-mono px-2 py-0.5 rounded border block mb-1 ${theme.badge}`}>
                              {theme.label}
                            </span>
                            <span className="text-[9px] font-mono text-slate-500 block">
                              BIAS RATING: {item.bias_level_score}/100
                            </span>
                          </div>
                        </div>

                        {/* Progress meter for bias rating */}
                        <div className="w-full bg-slate-950/80 h-1.5 rounded-full overflow-hidden border border-white/5">
                          <div 
                            className="h-full rounded-full transition-all duration-1000" 
                            style={{ 
                              width: `${item.bias_level_score}%`,
                              backgroundColor: item.bias_level_score < 30 ? "#10b981" : item.bias_level_score < 65 ? "#f15922" : "#ef4444"
                            }}
                          ></div>
                        </div>

                        {/* Illustrative Spun Headlines */}
                        <div className="space-y-1">
                          <span className="text-[9px] font-mono text-slate-500 uppercase tracking-widest block">Illustrative Headline Frame:</span>
                          {item.typical_headlines.map((headline, hi) => (
                            <p key={hi} className="text-xs text-white bg-black/30 px-3 py-2 rounded-lg italic border border-white/5 leading-snug">
                              "{headline}"
                            </p>
                          ))}
                        </div>

                        {/* Narrative analysis */}
                        <div className="space-y-1 text-xs">
                          <span className="text-[9px] font-mono text-slate-500 uppercase tracking-widest block">Framing Technique:</span>
                          <p className="text-slate-350 leading-relaxed bg-slate-950/20 p-2 rounded-lg border border-white/5">
                            {item.spin_focus}
                          </p>
                        </div>

                        {/* Emotionally Charged keywords index */}
                        <div className="space-y-1">
                          <span className="text-[9px] font-mono text-slate-500 uppercase tracking-widest block">High-Arousal Charged Keywords:</span>
                          <div className="flex flex-wrap gap-1.5 pt-1">
                            {item.charged_keywords.map((kw, ki) => (
                              <span 
                                key={ki} 
                                className="px-2 py-0.5 bg-red-950/20 border border-red-500/20 text-red-400 text-[10px] font-mono rounded"
                              >
                                {kw}
                              </span>
                            ))}
                          </div>
                        </div>

                      </div>
                    );
                  })}
                </div>

              </div>

            </div>
          </div>

        </div>
      )}
    </div>
  );
}
