import React, { useState, useEffect, useRef } from "react";
import Header from "./components/Header";
import DropZone from "./components/DropZone";
import { performErrorLevelAnalysis } from "./utils/ela";
import { ForensicResult, AnomalyItem } from "./types";
import NeutralGround from "./components/NeutralGround";
import {
  ShieldAlert,
  ShieldCheck,
  Cpu,
  RefreshCw,
  Sliders,
  AlertTriangle,
  FileImage,
  Layers,
  Award,
  BookOpen,
  Gauge,
  Hourglass,
  Scan,
  Compass,
  ArrowRight,
  HelpCircle,
  Clock,
  Binary,
  Globe
} from "lucide-react";

export default function App() {
  const [activeTab, setActiveTab] = useState<"disruptor" | "neutral-ground">("disruptor");

  // Image states
  const [selectedImage, setSelectedImage] = useState<string>("");
  const [fileName, setFileName] = useState<string>("");
  
  // Local ELA configuration
  const [elaQuality, setElaQuality] = useState<number>(0.85);
  const [elaAmplification, setElaAmplification] = useState<number>(20);
  const [elaResult, setElaResult] = useState<{ elaDataUrl: string; width: number; height: number } | null>(null);
  const [elaError, setElaError] = useState<string>("");
  const [isElaAnalyzing, setIsElaAnalyzing] = useState<boolean>(false);

  // Gemini API states
  const [apiResult, setApiResult] = useState<ForensicResult | null>(null);
  const [isApiLoading, setIsApiLoading] = useState<boolean>(false);
  const [apiError, setApiError] = useState<string>("");

  // UI Interactive States
  const [comparisonSliderValue, setComparisonSliderValue] = useState<number>(50); // 0 to 100 for side by side slice
  const [forensicLogs, setForensicLogs] = useState<string[]>([]);
  const logsEndRef = useRef<HTMLDivElement>(null);

  // Add system logs
  const addLog = (message: string) => {
    const timestamp = new Date().toISOString().substring(11, 19);
    setForensicLogs((prev) => [...prev, `[${timestamp}] ${message}`]);
  };

  useEffect(() => {
    if (logsEndRef.current) {
      logsEndRef.current.scrollTop = logsEndRef.current.scrollHeight;
    }
  }, [forensicLogs]);

  // Initial greeting logs
  useEffect(() => {
    setForensicLogs([]);
    addLog("DEEPFAKE DETECTOR CORE SUBSYSTEM INITIALIZED.");
    addLog("READY - UPLOAD IMAGE TO INSTANTIATE COMPRESSION COMPASS.");
    addLog("FORENSIC INTELLIGENCE LENS // DISCOVER • DISRUPT • DISPLAY ACTIVE.");
  }, []);

  // Handle image ingestion
  const handleImageSelected = async (imageSrc: string, name: string) => {
    setSelectedImage(imageSrc);
    setFileName(name);
    setApiResult(null);
    setApiError("");
    setElaResult(null);
    setElaError("");
    
    addLog(`INGESTED DATA STREAM: ${name.substring(0, 24)}${name.length > 24 ? "..." : ""}`);
    
    let targetSrc = imageSrc;
    if (imageSrc.startsWith("http://") || imageSrc.startsWith("https://")) {
      addLog(`DOWNLOADING EXTERNAL DIGITAL NEGATIVE VIA SYSTEM PROXY...`);
      setIsApiLoading(true);
      setIsElaAnalyzing(true);
      try {
        const res = await fetch("/api/proxy", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ url: imageSrc })
        });
        if (!res.ok) {
          throw new Error("Proxy failed to fetch target URL.");
        }
        const data = await res.json();
        targetSrc = data.base64;
        setSelectedImage(targetSrc);
        addLog(`IMAGE RETRIEVED SECURELY. COMPRESSION AUDIT RESUMED.`);
      } catch (err: any) {
        console.error(err);
        addLog(`WARN: PROXY CONNECTION INTERRUPTED. RETRYING WITH DEGRADE DIRECT LOAD.`);
      } finally {
        setIsApiLoading(false);
        setIsElaAnalyzing(false);
      }
    }

    addLog(`COMPUTING BUFFER CHARACTERISTICS...`);

    // Fire client-side ELA and API backend processing in parallel
    triggerClientEla(targetSrc);
    triggerServerForensics(targetSrc, name);
  };

  // Perform client-side ELA
  const triggerClientEla = async (imageSrc: string, quality: number = elaQuality, amp: number = elaAmplification) => {
    setIsElaAnalyzing(true);
    setElaError("");
    addLog(`SUBMITTING BUFFER TO RASTER RE-COMPRESSION CELL...`);
    addLog(`ELA ENCODING AT QUALITY LEVEL [${Math.round(quality * 100)}%]`);

    try {
      const result = await performErrorLevelAnalysis(imageSrc, quality, amp);
      setElaResult(result);
      addLog(`RE-COMPRESSION DELTA ANALYSIS COMPLETED SUCCESSFULLY.`);
      addLog(`ELA PEAK AMPLIFICATION APPLIED: ${amp}X`);
    } catch (err: any) {
      console.error(err);
      setElaError(err || "Failed to complete local canvas recompression.");
      addLog(`WARN: RASTER RE-COMPRESSION COLLIDED OR CROSS-ORIGIN RESTRICTION MET.`);
    } finally {
      setIsElaAnalyzing(false);
    }
  };

  // Trigger Backend Analysis
  const triggerServerForensics = async (imageSrc: string, name?: string) => {
    setIsApiLoading(true);
    setApiError("");
    addLog("LAUNCHING SERVER-SIDE MULTIMODAL AUDIT...");
    addLog("MODEL: GEMINI 3.5 FLASH SEED ANALYSIS INTRODUCED...");

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          imageBase64: imageSrc,
          mimeType: imageSrc.startsWith("data:") ? imageSrc.substring(5, imageSrc.indexOf(";")) : "image/jpeg",
          fileName: name || fileName,
        }),
      });

      if (!response.ok) {
        const errJson = await response.json();
        throw new Error(errJson.error || "Forensic backend rejected analytical package.");
      }

      const data: ForensicResult = await response.json();
      setApiResult(data);
      addLog(`AUDIT COMPLETE. VERDICT EXTRAPOLATED: ${data.classification.toUpperCase()}`);
      addLog(`CONFIDENCE: ${data.aiConfidence}% | SCORE: ${data.trustScore}%`);
    } catch (err: any) {
      console.error(err);
      setApiError(err.message || "Auditing node failed validation.");
      addLog(`FATAL: FORENSIC VECTOR MATRIX DISRUPTED.`);
    } finally {
      setIsApiLoading(false);
    }
  };

  // Handle re-tweaking details
  const handleElaRefresh = () => {
    if (selectedImage) {
      triggerClientEla(selectedImage, elaQuality, elaAmplification);
    }
  };

  // Get color configurations for score level
  const getScoreTheme = (score: number) => {
    if (score >= 80) return { text: "text-emerald-400", border: "border-emerald-500/30", bg: "bg-emerald-950/20", color: "#10b981", badge: "bg-emerald-950 text-emerald-400 border border-emerald-800/40" };
    if (score >= 45) return { text: "text-yellow-400", border: "border-yellow-500/30", bg: "bg-yellow-950/20", color: "#f59e0b", badge: "bg-yellow-950 text-yellow-400 border border-yellow-800/40" };
    return { text: "text-red-400", border: "border-red-500/30", bg: "bg-red-950/20", color: "#ef4444", badge: "bg-red-950 text-red-400 border border-red-800/40" };
  };

  // Pre-fill fields for a quick resetting to demo
  const resetWorkspace = () => {
    setSelectedImage("");
    setFileName("");
    setElaResult(null);
    setApiResult(null);
    setApiError("");
    setElaError("");
    setForensicLogs([]);
    addLog("DEEPFAKE DETECTOR CORE WORKSPACE CLEARED.");
    addLog("READY FOR NEW CANDIDATE INPUT VECTOR.");
  };

  return (
    <div className="min-h-screen bg-[#05070a] text-slate-300 font-sans selection:bg-cyan-500 selection:text-black flex flex-col" id="app-root-layout">
      {/* Platform Header */}
      <Header />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-6 space-y-6">
        
        {/* Tab Navbar Switcher */}
        <div className="flex border-b border-slate-800/60 pb-2.5 gap-6 mb-4" id="tab-navigation-bar">
          <button
            onClick={() => setActiveTab("disruptor")}
            className={`pb-2 text-sm font-mono tracking-wider transition-all relative flex items-center gap-2 uppercase cursor-pointer ${
              activeTab === "disruptor" 
                ? "text-cyan-400 font-bold border-b-2 border-cyan-400" 
                : "text-slate-400 hover:text-white"
            }`}
          >
            <Cpu className="w-4 h-4" />
            Media Forensic Suite
          </button>
          <button
            onClick={() => setActiveTab("neutral-ground")}
            className={`pb-2 text-sm font-mono tracking-wider transition-all relative flex items-center gap-2 uppercase cursor-pointer ${
              activeTab === "neutral-ground" 
                ? "text-indigo-400 font-bold border-b-2 border-indigo-400" 
                : "text-slate-400 hover:text-white"
            }`}
            id="neutral-ground-tab-btn"
          >
            <ShieldCheck className="w-4 h-4" />
            Prevention Guides
          </button>
        </div>

        {/* Step 1: Discover Interactive Portal */}
        {activeTab === "neutral-ground" ? (
          <NeutralGround />
        ) : !selectedImage ? (
          <div className="space-y-6">
            {/* Hero Interactive Area */}
            <div className="bg-gradient-to-br from-slate-900/40 to-slate-950/80 border border-white/10 rounded-2xl p-6 md:p-8 relative overflow-hidden" id="hero-banner">
              <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none"></div>
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
                <div className="lg:col-span-7 space-y-4">
                  <span className="px-3 py-1 text-[10px] font-mono tracking-widest uppercase bg-cyan-950 text-cyan-400 border border-cyan-800/30 rounded-full inline-block">
                    Hackathon Innovation Suite
                  </span>
                  <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white leading-tight">
                    Reveal the Invisible In Real-Time
                  </h1>
                  <p className="text-slate-400 text-sm md:text-base leading-relaxed">
                    By combining localized <strong className="text-cyan-400 font-mono">Error Level Analysis (ELA)</strong> and state-of-the-art vision LLM auditing, Deepfake detector empowers everyday citizens to detect AI generation, neural face-swaps, and professional digital manipulations in seconds.
                  </p>
                  <div className="flex flex-wrap gap-4 text-xs font-mono text-slate-500 pt-2">
                    <span className="flex items-center gap-1"><Binary className="w-4 h-4 text-cyan-500" /> HTML5 Compression audit</span>
                    <span className="flex items-center gap-1"><Cpu className="w-4 h-4 text-cyan-500" /> Gemini forensic network</span>
                    <span className="flex items-center gap-1"><ShieldCheck className="w-4 h-4 text-cyan-500" /> Local storage offline sandbox</span>
                  </div>
                </div>
                <div className="lg:col-span-5 bg-slate-950/60 p-4 rounded-xl border border-white/10 text-xs font-mono space-y-2">
                  <div className="text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-800 pb-1.5 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
                    Quick Project Abstract
                  </div>
                  <p className="text-[11px] text-slate-500 leading-relaxed">
                    Designed as a secure web utility, this workstation is structured to prove how open-source client-side image forensics can scale and support modern high-speed media and newsroom checks.
                  </p>
                </div>
              </div>
            </div>

            {/* Ingestion Console */}
            <DropZone onImageSelected={handleImageSelected} isLoading={isApiLoading || isElaAnalyzing} />
          </div>
        ) : (
          /* WORKSPACE ACTIVE PORTAL */
          <div className="space-y-6" id="workspace-active-view">
            
            {/* Quick Action Control Bar */}
            <div className="bg-slate-950/60 border border-white/10 rounded-xl p-4 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-slate-900 border border-white/10 rounded-lg">
                  <FileImage className="w-5 h-5 text-cyan-400 animate-pulse" />
                </div>
                <div className="min-w-0">
                  <span className="text-[10px] font-mono text-slate-500 uppercase block">ACTIVE ARCHIVE</span>
                  <p className="text-sm font-bold font-mono text-white truncate max-w-sm">
                    {fileName || "Visual-Stream-Data"}
                  </p>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={resetWorkspace}
                  className="px-4 py-2 text-xs font-mono bg-slate-900 border border-white/10 hover:border-slate-600 hover:text-white rounded-lg transition"
                  id="reset-workspace-btn"
                >
                  ← New Image
                </button>
                <button
                  onClick={() => handleImageSelected(selectedImage, fileName)}
                  disabled={isApiLoading || isElaAnalyzing}
                  className="px-4 py-2 text-xs font-mono bg-cyan-950/40 text-cyan-400 hover:bg-cyan-900/40 border border-cyan-800/40 rounded-lg transition disabled:opacity-40"
                  id="reanalyze-btn"
                >
                  Re-Audit Vector
                </button>
              </div>
            </div>

            {/* Stage Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Left Column: Visual Screen Comparative Slider & Local ELA parameters */}
              <div className="lg:col-span-8 space-y-6">
                
                {/* Visual Comparative Frame */}
                <div className="bg-slate-950/40 border border-white/10 rounded-2xl overflow-hidden flex flex-col" id="comparative-canvas-panel">
                  <div className="px-4 py-3 bg-slate-950/80 border-b border-white/10 flex items-center justify-between">
                    <span className="text-xs uppercase font-mono tracking-widest font-semibold flex items-center gap-2">
                      <Scan className="w-4 h-4 text-cyan-400 animate-spin" />
                      02. DISRUPT / Comparative Lens
                    </span>
                    <span className="text-[10px] font-mono text-cyan-500 bg-cyan-950/30 px-2 py-0.5 rounded border border-cyan-800/30">
                      Drag Slider to Peel Levels
                    </span>
                  </div>

                  <div className="relative aspect-video max-h-[460px] bg-slate-950 flex items-center justify-center overflow-hidden p-2">
                    
                    {/* Background Static Indicator when loading */}
                    {(isElaAnalyzing || isApiLoading) && (
                      <div className="absolute inset-0 bg-slate-950/95 z-10 flex flex-col items-center justify-center gap-3">
                        <div className="w-10 h-10 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
                        <p className="text-xs font-mono text-slate-400 uppercase tracking-widest">Processing Layer Subtraction Deltas...</p>
                        <p className="text-[10px] font-mono text-slate-600">Disrupting visual illusion via pixel evaluation</p>
                      </div>
                    )}

                    {/* Standard Comparative View Engine */}
                    {selectedImage ? (
                      <div className="relative w-full h-full max-h-[400px] flex items-center justify-center rounded-lg overflow-hidden group select-none">
                        
                        {/* ELA Image (Right Side Backdrop) */}
                        {elaResult ? (
                          <div className="absolute inset-0 w-full h-full">
                            <img
                              src={elaResult.elaDataUrl}
                              alt="Error Level Analysis"
                              className="w-full h-full object-contain pointer-events-none"
                              style={{ imageRendering: "pixelated" }}
                            />
                            <div className="absolute bottom-2 right-2 px-2 py-1 bg-black/80 backdrop-blur border border-red-500/20 rounded text-[9px] font-mono text-red-400">
                              FORENSIC ELA HEATMAP (Amplified)
                            </div>
                          </div>
                        ) : (
                          <div className="absolute inset-0 flex flex-col items-center justify-center text-xs font-mono text-slate-500 p-4">
                            <p>ELA recompression output restricted by cross-origin security context.</p>
                            <p className="text-[10px] text-slate-600">Please upload a file offline or use a pre-set laboratory sample for optimal local ELA slider renders.</p>
                          </div>
                        )}

                        {/* Raw Image (Left Side Sliding Crop Overlay) */}
                        <div 
                          className="absolute inset-0 h-full pointer-events-none"
                          style={{ clipPath: `polygon(0 0, ${comparisonSliderValue}% 0, ${comparisonSliderValue}% 100%, 0 100%)` }}
                        >
                          <img
                            src={selectedImage}
                            alt="Candidate Input Source"
                            className="w-full h-full object-contain"
                            referrerPolicy="no-referrer"
                          />
                          <div className="absolute bottom-2 left-2 px-2 py-1 bg-black/80 backdrop-blur border border-white/10 rounded text-[9px] font-mono text-slate-300">
                            RAW SOURCE FILE
                          </div>
                        </div>

                        {/* Interactive Anomaly Locator Targets (Slider Co-dependency & Highlights) */}
                        {!isApiLoading && apiResult?.anomalies?.map((anno, index) => {
                          const x = anno.xPercent ?? 50;
                          const y = anno.yPercent ?? 50;
                          
                          // Determine distance from current slider position to dynamically reveal coordinates
                          const distance = Math.abs(comparisonSliderValue - x);
                          const isNearSlider = distance <= 15;

                          return (
                            <div 
                              key={index}
                              className="absolute z-22 transition-all duration-300 pointer-events-none"
                              style={{ 
                                left: `${x}%`, 
                                top: `${y}%`, 
                                transform: 'translate(-50%, -50%)',
                              }}
                            >
                              {/* Pulsing visual scope locator */}
                              <div className="relative flex items-center justify-center">
                                {/* Outer radar circular scope */}
                                <div className={`absolute rounded-full border-2 transition-all duration-300 ${
                                  isNearSlider 
                                    ? "w-14 h-14 border-red-500 bg-red-950/20 shadow-[0_0_20px_rgba(239,68,68,0.7)] animate-pulse scale-110" 
                                    : "w-8 h-8 border-cyan-500/40 bg-cyan-950/10 shadow-[0_0_8px_rgba(6,182,212,0.2)]"
                                }`} />
                                
                                {/* Crosshairs precision points */}
                                <div className={`absolute w-5 h-[1.5px] ${isNearSlider ? "bg-red-400" : "bg-cyan-400/50"}`} />
                                <div className={`absolute h-5 w-[1.5px] ${isNearSlider ? "bg-red-400" : "bg-cyan-400/50"}`} />

                                {/* Glowing central danger nucleus */}
                                <div className={`w-2.5 h-2.5 rounded-full ${
                                  isNearSlider 
                                    ? "bg-red-500 shadow-[0_0_10px_#ef4444]" 
                                    : "bg-cyan-400"
                                }`} />

                                {/* Floating Micro Anomaly Tag (Slider Proximity Triggered) */}
                                <div className={`absolute bottom-full mb-3 left-1/2 -translate-x-1/2 w-44 p-2 bg-slate-950/95 border rounded-lg text-[9px] font-sans shadow-[0_10px_25px_rgba(0,0,0,0.8)] transition-all duration-300 ${
                                  isNearSlider 
                                    ? "opacity-100 translate-y-0 scale-100 border-red-500/60" 
                                    : "opacity-0 translate-y-2 scale-90 border-slate-800"
                                }`}>
                                  <div className="flex items-center gap-1 border-b border-white/5 pb-1 mb-1">
                                    <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping" />
                                    <span className="font-mono text-slate-400 font-bold uppercase tracking-wider text-[8px]">
                                      ANOMALY DETECTED
                                    </span>
                                  </div>
                                  <p className="font-bold text-white text-[10px] leading-tight mb-0.5 truncate">{anno.title}</p>
                                  <p className="text-slate-400 leading-snug">{anno.description}</p>
                                  <div className="flex justify-between items-center mt-1 text-[8px] font-mono text-slate-500">
                                    <span>X: {x}% Y: {y}%</span>
                                    <span className="text-red-400 font-bold uppercase">{anno.severity} risk</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          );
                        })}

                        {/* Slider bar overlay line */}
                        <div 
                          className="absolute top-0 bottom-0 w-0.5 bg-cyan-400 shadow-[0_0_10px_#22d3ee] z-20 pointer-events-none"
                          style={{ left: `${comparisonSliderValue}%` }}
                        >
                          <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-6 h-6 rounded-full bg-slate-900 border-2 border-cyan-400 flex items-center justify-center shadow-[0_0_15px_rgba(34,211,238,0.5)]">
                            <Sliders className="w-3.5 h-3.5 text-cyan-300 vertical" />
                          </div>
                        </div>

                        {/* Invisible interactive overlay to trigger horizontal move cleanly */}
                        <input
                          type="range"
                          min="0"
                          max="100"
                          value={comparisonSliderValue}
                          onChange={(e) => setComparisonSliderValue(Number(e.target.value))}
                          className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize z-25"
                          id="lens-comparator-slider"
                        />
                      </div>
                    ) : null}
                  </div>

                  {/* Manual Horizontal Slider Controller */}
                  <div className="px-5 py-3 border-t border-white/10 bg-slate-950/80 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-2">
                      <Sliders className="w-4 h-4 text-cyan-400" />
                      <span className="text-[11px] font-mono text-slate-400">Horizontal Visual Slice Slider:</span>
                    </div>
                    <div className="flex-1 max-w-xs flex gap-2 items-center">
                      <span className="text-[10px] font-mono text-slate-500">RAW</span>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={comparisonSliderValue}
                        onChange={(e) => setComparisonSliderValue(Number(e.target.value))}
                        className="w-full h-1.5 rounded-lg bg-slate-800 accent-cyan-400 cursor-pointer"
                        id="footer-range-lens"
                      />
                      <span className="text-[10px] font-mono text-red-400 font-bold">ELA</span>
                    </div>
                  </div>
                </div>





              </div>

              {/* Right Column: Master Forensic Display Dashboard (03. DISPLAY) */}
              <div className="lg:col-span-4 space-y-6">
                
                {/* Score Dial Block */}
                <div className="bg-slate-950/40 border border-white/10 rounded-2xl p-5 flex flex-col items-center justify-center relative overflow-hidden" id="trust-gauge-panel">
                  <div className="absolute top-4 left-4 text-[10px] font-mono tracking-wider font-bold text-slate-500 uppercase flex items-center gap-1.5">
                    <Gauge className="w-4 h-4 text-cyan-400" />
                    MEDIA TRUST GAUGE
                  </div>

                  {isApiLoading ? (
                    <div className="h-44 flex flex-col items-center justify-center gap-2">
                      <Hourglass className="w-8 h-8 text-cyan-400 animate-spin" />
                      <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest mt-2 animate-pulse">Running Neural Audits...</span>
                    </div>
                  ) : apiResult ? (
                    (() => {
                      const theme = getScoreTheme(apiResult.trustScore);
                      const radius = 58;
                      const circumference = 2 * Math.PI * radius;
                      const strokeDashoffset = circumference - (apiResult.trustScore / 100) * circumference;

                      return (
                        <div className="py-2 text-center flex flex-col items-center">
                          <div className="relative flex items-center justify-center w-36 h-36 mt-4">
                            <svg className="w-full h-full transform -rotate-90">
                              <circle cx="72" cy="72" r={radius} stroke="currentColor" strokeWidth="8" fill="transparent" className="text-slate-800/40" />
                              <circle 
                                cx="72" 
                                cy="72" 
                                r={radius} 
                                stroke={theme.color} 
                                strokeWidth="8" 
                                fill="transparent" 
                                strokeDasharray={circumference} 
                                strokeDashoffset={strokeDashoffset} 
                                strokeLinecap="round"
                                className="transition-all duration-1000 ease-out"
                              />
                            </svg>
                            <div className="absolute text-center">
                              <span className="text-4xl font-extrabold text-white tracking-tighter block">{apiResult.trustScore}%</span>
                              <span className="text-[11px] font-mono uppercase tracking-widest font-bold block mt-0.5" style={{ color: theme.color }}>
                                {apiResult.classification}
                              </span>
                            </div>
                          </div>

                          <div className="mt-4 px-4 py-2 rounded-xl border border-white/5 bg-slate-900/60 max-w-xs space-y-1 text-center">
                            <span className="text-[10px] font-mono text-slate-500 uppercase block">Verdict Breakdown</span>
                            <span className="text-xs font-sans text-slate-200 block leading-tight">{apiResult.verdictSummary}</span>
                          </div>
                        </div>
                      );
                    })()
                  ) : (
                    <div className="h-44 flex flex-col items-center justify-center text-center p-4">
                      <AlertTriangle className="w-7 h-7 text-amber-500 mb-1" />
                      <p className="text-xs text-slate-400 leading-snug">Await audit submission package completion.</p>
                      <p className="text-[10px] text-slate-600 mt-1 font-mono">Gemini vision is analyzing anomalies.</p>
                    </div>
                  )}
                </div>

                {/* Sub-Score Parameters Breakdowns */}
                <div className="bg-slate-950/40 border border-white/10 rounded-2xl p-5 space-y-4">
                  <h3 className="text-xs font-mono font-bold tracking-wider text-slate-400 uppercase border-b border-slate-800 pb-2">
                    FORENSIC PARAMETER CHANNELS
                  </h3>

                  {isApiLoading ? (
                    <div className="py-6 space-y-4">
                      {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="animate-pulse space-y-1.5">
                          <div className="h-2 w-24 bg-slate-800 rounded"></div>
                          <div className="h-2 w-full bg-slate-900 rounded"></div>
                        </div>
                      ))}
                    </div>
                  ) : apiResult ? (
                    <div className="space-y-3 font-mono text-[11px]">
                      {/* Anatomy */}
                      <div className="space-y-1">
                        <div className="flex justify-between text-slate-400">
                          <span>Anatomic consistency</span>
                          <span className={`${getScoreTheme(apiResult.facialsScore).text}`}>{apiResult.facialsScore}%</span>
                        </div>
                        <div className="w-full bg-slate-950 h-1.5 rounded-full overflow-hidden border border-white/5">
                          <div 
                            className="bg-cyan-500 h-full transition-all duration-1000" 
                            style={{ 
                              width: `${apiResult.facialsScore}%`,
                              backgroundColor: getScoreTheme(apiResult.facialsScore).color 
                            }}
                          ></div>
                        </div>
                      </div>

                      {/* Lighting */}
                      <div className="space-y-1">
                        <div className="flex justify-between text-slate-400">
                          <span>ambient illumination vector</span>
                          <span className={`${getScoreTheme(apiResult.lightingScore).text}`}>{apiResult.lightingScore}%</span>
                        </div>
                        <div className="w-full bg-slate-950 h-1.5 rounded-full overflow-hidden border border-white/5">
                          <div 
                            className="bg-cyan-500 h-full transition-all duration-1000" 
                            style={{ 
                              width: `${apiResult.lightingScore}%`,
                              backgroundColor: getScoreTheme(apiResult.lightingScore).color 
                            }}
                          ></div>
                        </div>
                      </div>

                      {/* Texture */}
                      <div className="space-y-1">
                        <div className="flex justify-between text-slate-400">
                          <span>texture coherence density</span>
                          <span className={`${getScoreTheme(apiResult.texturesScore).text}`}>{apiResult.texturesScore}%</span>
                        </div>
                        <div className="w-full bg-slate-950 h-1.5 rounded-full overflow-hidden border border-white/5">
                          <div 
                            className="bg-cyan-500 h-full transition-all duration-1000" 
                            style={{ 
                              width: `${apiResult.texturesScore}%`,
                              backgroundColor: getScoreTheme(apiResult.texturesScore).color 
                            }}
                          ></div>
                        </div>
                      </div>

                      {/* Compression */}
                      <div className="space-y-1">
                        <div className="flex justify-between text-slate-400">
                          <span>digital artifacts ratio</span>
                          <span className={`${getScoreTheme(apiResult.metadataScore).text}`}>{apiResult.metadataScore}%</span>
                        </div>
                        <div className="w-full bg-slate-950 h-1.5 rounded-full overflow-hidden border border-white/5">
                          <div 
                            className="bg-cyan-500 h-full transition-all duration-1000" 
                            style={{ 
                              width: `${apiResult.metadataScore}%`,
                              backgroundColor: getScoreTheme(apiResult.metadataScore).color 
                            }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="py-6 text-center text-xs text-slate-500 font-mono">
                      No parameters extracted yet.
                    </div>
                  )}
                </div>

                {/* Localized Anomalies Bento */}
                <div className="bg-slate-950/40 border border-white/10 rounded-2xl p-5 space-y-4">
                  <h3 className="text-xs font-mono font-bold tracking-wider text-slate-400 uppercase border-b border-slate-800 pb-2">
                    ANOMALY CLUSTER INDEX
                  </h3>

                  {isApiLoading ? (
                    <div className="space-y-3 py-2">
                      <div className="h-10 bg-slate-900 border border-white/5 rounded-xl animate-pulse"></div>
                      <div className="h-10 bg-slate-900 border border-white/5 rounded-xl animate-pulse"></div>
                    </div>
                  ) : apiResult ? (
                    apiResult.anomalies && apiResult.anomalies.length > 0 ? (
                      <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
                        {apiResult.anomalies.map((anno, index) => (
                          <div 
                            key={index} 
                            className="p-3 bg-slate-900/50 border border-slate-800/80 rounded-xl space-y-1.5"
                          >
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-sans font-bold text-slate-200">
                                {anno.title}
                              </span>
                              <span className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded border ${
                                anno.severity === "high" 
                                  ? "bg-red-950/40 text-red-400 border-red-900/30" 
                                  : anno.severity === "medium"
                                  ? "bg-yellow-950/40 text-yellow-400 border-yellow-900/30"
                                  : "bg-cyan-950/40 text-cyan-400 border-cyan-900/30"
                              }`}>
                                {anno.severity} Severity
                              </span>
                            </div>
                            <p className="text-[11px] text-slate-400 leading-normal">
                              {anno.description}
                            </p>
                            <div className="flex flex-wrap gap-2 text-[10px] font-mono text-slate-400 pt-1 border-t border-slate-900">
                              <span className="text-cyan-400"># {anno.category}</span>
                              {anno.coordinates && (
                                <span className="text-slate-500">📍 Loc: {anno.coordinates}</span>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="p-3 bg-emerald-950/10 border border-emerald-900/20 rounded-xl flex gap-2.5 items-start">
                        <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                        <div>
                          <p className="text-xs font-bold text-slate-200">No anomalous spikes located</p>
                          <p className="text-[10px] text-slate-400 leading-normal">Prismatic evaluation confirms coherent biological geometry and stable edge pixel values.</p>
                        </div>
                      </div>
                    )
                  ) : (
                    <div className="text-center py-6 text-xs text-slate-500 font-mono">
                      Await candidate matrix submission.
                    </div>
                  )}
                </div>

                {/* Subsystem Audit Loop Log Terminal */}
                <div className="bg-slate-950/40 border border-white/10 rounded-2xl p-5 flex flex-col space-y-3 h-64">
                  <h3 className="text-xs font-mono font-bold tracking-wider text-slate-400 uppercase flex items-center justify-between">
                    <span>FORENSIC SUBSYSTEM LOG</span>
                    <span className="text-[10px] text-cyan-400 bg-cyan-950/30 px-1.5 py-0.5 rounded">Active stream</span>
                  </h3>
                  <div 
                    ref={logsEndRef}
                    className="flex-1 bg-black/40 border border-slate-900 rounded-lg p-3 font-mono text-[10px] text-cyan-500/80 overflow-y-auto space-y-1.5 scrollbar-thin leading-normal"
                    style={{ fontFamily: "'JetBrains Mono', 'Courier New', monospace" }}
                  >
                    {forensicLogs.map((log, idx) => (
                      <div key={idx} className="break-all">{log}</div>
                    ))}
                    <div className="animate-pulse inline-block w-2 h-3.5 bg-cyan-400 ml-0.5 align-middle"></div>
                  </div>
                </div>

              </div>

            </div>

          </div>
        )}

      </main>

      {/* Platform Footer */}
      <footer className="mt-auto border-t border-slate-800/80 bg-slate-950/30 px-6 py-4 flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-mono">
        <p className="text-slate-500 text-center md:text-left">
          &copy; 2026 Deepfake detector // Secure Forensics Suite
        </p>
        <div className="flex gap-3">
          <span className="text-[10px] text-slate-400">Theme: Discover, Disrupt, Display</span>
          <span className="text-slate-600">|</span>
          <span className="text-cyan-400">Strivings towards secure verification</span>
        </div>
      </footer>
    </div>
  );
}
