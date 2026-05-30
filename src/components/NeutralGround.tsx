import React, { useState } from "react";
import { 
  ShieldCheck, 
  CheckCircle2, 
  AlertTriangle, 
  Info, 
  Lock, 
  Smartphone, 
  Eye, 
  VolumeX, 
  Volume2, 
  PhoneCall, 
  HelpCircle, 
  ArrowRight, 
  RotateCcw, 
  Key, 
  UserCheck, 
  Camera, 
  ShieldAlert,
  Sliders,
  Check,
  AlertOctagon,
  Award
} from "lucide-react";

// Types for the simulators
interface ChecklistItem {
  id: string;
  label: string;
  description: string;
  category: "face" | "eyes" | "audio" | "environment";
  checked: boolean;
}

export default function NeutralGround() {
  const [activeGuideTab, setActiveGuideTab] = useState<"audio" | "visual" | "actors">("audio");
  
  // 1. Safe Word Evaluator States
  const [safeWord, setSafeWord] = useState("");
  const [evalResult, setEvalResult] = useState<{
    score: number; // 0 to 100
    grade: "WEAK" | "FAIR" | "ROBUST" | "TACTICAL GRADE";
    color: string;
    bgColor: string;
    border: string;
    feedback: string[];
  } | null>(null);

  // 2. Video Artifact Checklist States
  const [checklist, setChecklist] = useState<ChecklistItem[]>([
    { id: "blink", label: "Absorbed or Weird Blinking", description: "Does the subject fail to blink naturally, blink at an extremely high rate, or have asymmetric eyelid movements?", category: "eyes", checked: false },
    { id: "eyelash", label: "Double Eyelashes or Pupils", description: "Look closely at the iris. Are the pupils perfectly circular or chaotic? Are eyelashes blurry or pointing in different directions?", category: "eyes", checked: false },
    { id: "teeth", label: "Blurred Dental Array", description: "As they speak, do the teeth fuse into a solid white block, look jagged, or fail to sync with the phonetic 'f' and 'v' dental boundaries?", category: "face", checked: false },
    { id: "ears", label: "Ear Profile Morphing", description: "Watch closely as the person rotates their head. Do the ears morph size, lose their lobe structure, or look inconsistent with the face?", category: "face", checked: false },
    { id: "glasses", label: "Asymmetrical Glasses/Accessories", description: "Do earrings or glasses frames look different on the left vs. right side, or do template lines warp near the cheeks?", category: "face", checked: false },
    { id: "audio_lag", label: "Syllabic Phase Mismatch", description: "Does the phonetic sound arrive ahead of, or delayed behind, the actual physical lip shape boundaries?", category: "audio", checked: false },
    { id: "bg_warp", label: "Background Geometry Warping", description: "Does the area immediately surrounding the head or hair warp, flicker, or show visual static when they move rapidly?", category: "environment", checked: false },
  ]);

  // 3. Clone Voice Crisis Simulation States
  const [simStep, setSimStep] = useState<"intro" | "call" | "challenge" | "outbound" | "result">("intro");
  const [simScore, setSimScore] = useState<number>(100);
  const [simLogs, setSimLogs] = useState<string[]>([]);
  const [userChoiceHistory, setUserChoiceHistory] = useState<string[]>([]);

  // Function to evaluate proposed safe phrase
  const evaluateSafeWord = (word: string) => {
    if (!word.trim()) {
      setEvalResult(null);
      return;
    }

    const trimmed = word.trim();
    let score = 0;
    const tips: string[] = [];

    // Length criteria
    if (trimmed.length < 4) {
      score += 10;
      tips.push("Too short. Short words are easily guessed by automated dictionary matrices.");
    } else if (trimmed.length < 8) {
      score += 40;
      tips.push("Moderate length. Try extending this to a short memorable sentence or phrase.");
    } else {
      score += 60;
    }

    // Complexity & Common Word Check
    const lower = trimmed.toLowerCase();
    const commonWords = ["secret", "password", "safe", "family", "help", "sos", "danger", "passcode", "security", "1234", "qwerty", "shield", "protect"];
    const hasCommonWord = commonWords.some(common => lower.includes(common));
    
    if (hasCommonWord) {
      score -= 20;
      tips.push("Avoid high-frequency terms like 'secret', 'password', or 'help' which malicious social engineers try first.");
    } else {
      score += 20;
    }

    // Number of words (phrases are harder to guess but easy to remember)
    const wordsCount = trimmed.split(/\s+/).length;
    if (wordsCount >= 3) {
      score += 20;
      tips.push("Excellent choice of a multi-word phrase! Natural spacing makes it near-impossible to brute force and simple to speak naturally.");
    } else if (wordsCount === 2) {
      score += 10;
      tips.push("Good dual-word pairing. Adding a third unrelated word or action would make it bulletproof.");
    } else {
      tips.push("A single word is easier to forget in a stressful crisis call. Use a short 3-word visual action sequence instead.");
    }

    // Uniqueness/Personal Check
    if (trimmed.match(/(birthday|birth|birthdate|pet|dog|cat|mom|dad|son|daughter)/i)) {
      score -= 30;
      tips.push("Insecure reference detected. Never base a safety word on children names, pet names, or anniversaries which appear on public registries.");
    }

    // Bound score
    const finalScore = Math.max(10, Math.min(100, score));
    
    let grade: "WEAK" | "FAIR" | "ROBUST" | "TACTICAL GRADE" = "WEAK";
    let color = "text-red-400";
    let bgColor = "bg-red-950/20";
    let border = "border-red-500/20";

    if (finalScore >= 90) {
      grade = "TACTICAL GRADE";
      color = "text-cyan-400";
      bgColor = "bg-cyan-950/20";
      border = "border-cyan-500/30";
    } else if (finalScore >= 70) {
      grade = "ROBUST";
      color = "text-emerald-400";
      bgColor = "bg-emerald-900/10";
      border = "border-emerald-500/20";
    } else if (finalScore >= 40) {
      grade = "FAIR";
      color = "text-amber-400";
      bgColor = "bg-amber-950/10";
      border = "border-amber-500/20";
    }

    setEvalResult({
      score: finalScore,
      grade,
      color,
      bgColor,
      border,
      feedback: tips
    });
  };

  const handleCheckboxChange = (id: string) => {
    setChecklist(prev => prev.map(item => item.id === id ? { ...item, checked: !item.checked } : item));
  };

  const activeCheckCount = checklist.filter(item => item.checked).length;
  const checklistPercent = Math.round((activeCheckCount / checklist.length) * 100);

  // Crisis Simulator helper to reset
  const startSimulation = () => {
    setSimStep("call");
    setSimScore(100);
    setSimLogs([
      "Incoming unknown VoIP transmission detected.",
      "Decrypting biometric audio stream layers..."
    ]);
    setUserChoiceHistory([]);
  };

  const resetSimulation = () => {
    setSimStep("intro");
    setSimScore(100);
    setSimLogs([]);
    setUserChoiceHistory([]);
  };

  const chooseSimulationPath = (choice: "panic" | "challenge_pass" | "out_of_band" | "personal_quiz" | "comply") => {
    const timestamp = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" });
    
    if (choice === "panic") {
      setSimScore(prev => Math.max(10, prev - 45));
      setSimLogs(prev => [
        ...prev,
        `[${timestamp}] CRITICAL: Panic state triggered. Adrenaline spike detected.`,
        `[${timestamp}] WARNING: Attempting money transfer plays directly into time-urgency schemas.`
      ]);
      setUserChoiceHistory(prev => [...prev, "cloned_panic"]);
      setSimStep("challenge");
    } 
    else if (choice === "challenge_pass") {
      setSimLogs(prev => [
        ...prev,
        `[${timestamp}] SUCCESS: Defensive safe-phrase challenged to caller.`,
        `[${timestamp}] ANALYSIS: Cloned deepfake generator fails to provide correct custom family passkey.`
      ]);
      setUserChoiceHistory(prev => [...prev, "security_key_deployed"]);
      setSimStep("outbound");
    }
    else if (choice === "out_of_band") {
      setSimScore(prev => prev); // perfect play
      setSimLogs(prev => [
        ...prev,
        `[${timestamp}] SECURE ROUTE: Deploying secondary out-of-band communication channel.`,
        `[${timestamp}] CRITICAL: Hanging up immediately. Bypassing spoofed caller-ID.`
      ]);
      setUserChoiceHistory(prev => [...prev, "hang_up_and_callback"]);
      setSimStep("result");
    }
    else if (choice === "personal_quiz") {
      setSimScore(prev => Math.max(20, prev - 15));
      setSimLogs(prev => [
        ...prev,
        `[${timestamp}] BEHAVIORAL BLOCK: Challenging caller with non-public personal memory question.`,
        `[${timestamp}] RESPONSE: Spoofed voice stammering, deflecting with high emotional distress metrics.`
      ]);
      setUserChoiceHistory(prev => [...prev, "memory_challenge"]);
      setSimStep("outbound");
    }
    else if (choice === "comply") {
      setSimScore(prev => Math.max(5, prev - 75));
      setSimLogs(prev => [
        ...prev,
        `[${timestamp}] HIGH DANGER: Financial exposure complete. $4,000 sent via proxy agent.`,
        `[${timestamp}] SYSTEM ALERT: Identity compromised. Malicious entity successfully leveraged voice clone.`
      ]);
      setUserChoiceHistory(prev => [...prev, "fraud_compliance"]);
      setSimStep("result");
    }
  };

  return (
    <div className="space-y-6 animate-fade-in" id="defense-playbook-panel">
      {/* Header Premium Card */}
      <div className="bg-gradient-to-br from-slate-900/60 to-indigo-950/40 border border-indigo-500/20 rounded-2xl p-6 md:p-8 relative overflow-hidden" id="playbook-hero">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none"></div>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          <div className="lg:col-span-8 space-y-4">
            <span className="px-3 py-1 text-[10px] font-mono tracking-widest uppercase bg-indigo-950 text-indigo-400 border border-indigo-800/30 rounded-full inline-block">
              Shield Protocols // Active Anti-Deepfake Suite
            </span>
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white leading-tight">
              Anti-Deepfake Playbook & Safety Hub
            </h1>
            <p className="text-slate-400 text-sm md:text-base leading-relaxed">
              Equip yourself with the tools, checklists, and simulated crisis scenarios needed to survive synthetic voice cloning, simulated visual manipulators, and high-urgency digital impostors.
            </p>
          </div>
          <div className="lg:col-span-4 bg-slate-950/80 p-4 rounded-xl border border-white/5 text-xs font-mono space-y-2">
            <div className="text-indigo-400 uppercase tracking-wider font-semibold border-b border-indigo-900/30 pb-1.5 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              Sec-Ops Threat Intelligence
            </div>
            <p className="text-[11px] text-slate-500 leading-relaxed border-l-2 border-indigo-500/50 pl-2">
              In an age where 3 seconds of leaked audio allows real-time neural clone synthesis, behavioral processes and out-of-band authentications are the only absolute proof of human validity.
            </p>
          </div>
        </div>
      </div>

      {/* Main Structural Twin Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Extensive Guides (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Guide Selector Tabs */}
          <div className="bg-slate-950/60 border border-white/10 rounded-xl p-2 flex gap-1.5">
            <button
              onClick={() => setActiveGuideTab("audio")}
              className={`flex-1 py-2 px-3 text-xs font-mono rounded-lg transition-all flex items-center justify-center gap-2 ${
                activeGuideTab === "audio"
                  ? "bg-indigo-950 text-indigo-400 border border-indigo-800/40 font-bold"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <Volume2 className="w-4 h-4" />
              Voice Clones
            </button>
            <button
              onClick={() => setActiveGuideTab("visual")}
              className={`flex-1 py-2 px-3 text-xs font-mono rounded-lg transition-all flex items-center justify-center gap-2 ${
                activeGuideTab === "visual"
                  ? "bg-indigo-950 text-indigo-400 border border-indigo-800/40 font-bold"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <Eye className="w-4 h-4" />
              Visual Deepfakes
            </button>
            <button
              onClick={() => setActiveGuideTab("actors")}
              className={`flex-1 py-2 px-3 text-xs font-mono rounded-lg transition-all flex items-center justify-center gap-2 ${
                activeGuideTab === "actors"
                  ? "bg-indigo-950 text-indigo-400 border border-indigo-800/40 font-bold"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <Lock className="w-4 h-4" />
              Malicious Impostors
            </button>
          </div>

          {/* Guide Dynamic Panels */}
          {activeGuideTab === "audio" && (
            <div className="bg-slate-950/40 border border-white/10 rounded-2xl p-5 md:p-6 space-y-5" id="voice-clones-guide">
              <div className="flex items-center gap-3 border-b border-slate-800 pb-3">
                <div className="bg-indigo-950/80 p-2.5 rounded-xl border border-indigo-500/30 text-indigo-400">
                  <VolumeX className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white font-sans">Voice Cloning Threat & Attack Prevention</h3>
                  <p className="text-[11px] text-slate-500 font-mono uppercase">Vulnerability Target: Biometric Audio Spoofing</p>
                </div>
              </div>

              <div className="space-y-4 text-xs text-slate-350 leading-relaxed">
                <p>
                  Generative speech models can now synthesize a natural human voice clone with as little as <strong className="text-red-400 font-mono">3 to 5 seconds of clean source audio</strong>. These snippets are typically harvested from public video posts, voicemail recordings, or promotional media.
                </p>

                <div className="p-4 bg-slate-900/60 rounded-xl border border-white/5 space-y-2">
                  <span className="text-[10px] font-mono text-amber-400 font-bold uppercase tracking-widest block flex items-center gap-1.5">
                    <AlertTriangle className="w-4 h-4" /> The Urgency Playbook
                  </span>
                  <p className="text-slate-400">
                    Attackers pair voice clones with spoofed caller IDs and simulated phone static to call immediate family members (often seniors) claiming a severe crisis: a car wreck, sudden jail arrest, or kidnapping. They demand immediate, untraceable wire transfers, cryptocurrency, or gift cards to bypass normal institutional barriers.
                  </p>
                </div>

                <div className="space-y-3">
                  <h4 className="text-xs font-mono font-bold text-white uppercase tracking-wider">Defensive Countermeasures</h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                    <div className="p-3 bg-slate-900/30 rounded-xl border border-indigo-500/10 space-y-1">
                      <span className="text-cyan-400 font-mono font-bold text-xs block">01. Family safe Word</span>
                      <p className="text-[11px] text-slate-400">
                        Establish a unique, unguessable verbal passcode. In any crisis call, strictly ask for the passphrase before discussing any financial details.
                      </p>
                    </div>
                    <div className="p-3 bg-slate-900/30 rounded-xl border border-indigo-500/10 space-y-1">
                      <span className="text-cyan-400 font-mono font-bold text-xs block">02. Out-Of-Band (OOB) Relay</span>
                      <p className="text-[11px] text-slate-400">
                        Immediately hang up and place a direct call back to the person's stored contact card. Do not trust incoming caller numbers, as they are easily spoofed.
                      </p>
                    </div>
                    <div className="p-3 bg-slate-900/30 rounded-xl border border-indigo-500/10 space-y-1">
                      <span className="text-cyan-400 font-mono font-bold text-xs block">03. Behavioral Memory Quiz</span>
                      <p className="text-[11px] text-slate-400">
                        If caught without a code, request the caller recall a specific personal memory (e.g. \"Who sat next to you at last year's Thanksgiving dinner?\") that is not documented online.
                      </p>
                    </div>
                    <div className="p-3 bg-slate-900/30 rounded-xl border border-indigo-500/10 space-y-1">
                      <span className="text-cyan-400 font-mono font-bold text-xs block">04. Clean Outboard Voicemails</span>
                      <p className="text-[11px] text-slate-400">
                        Do not speak your own name in your personal phone voicemail greeting. Instead use default voice options, preventing robotic audio crawling bots from scraping clips.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeGuideTab === "visual" && (
            <div className="bg-slate-950/40 border border-white/10 rounded-2xl p-5 md:p-6 space-y-5" id="visual-deepfakes-guide">
              <div className="flex items-center gap-3 border-b border-slate-800 pb-3">
                <div className="bg-indigo-950/80 p-2.5 rounded-xl border border-indigo-500/30 text-indigo-400">
                  <Camera className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white font-sans">Visual and Video Forensic Eye-Test Indicators</h3>
                  <p className="text-[11px] text-slate-500 font-mono uppercase">Vulnerability Target: Synthetic Facial Synthesis & Morphing</p>
                </div>
              </div>

              <div className="space-y-4 text-xs text-slate-350 leading-relaxed">
                <p>
                  While advanced generators produce hyper-realistic static images, real-time interactive or high-framerate synthetic video models regularly output detectable rendering anomalies due to facial boundary morphing and temporal incoherence.
                </p>

                <div className="p-4 bg-slate-900/60 rounded-xl border border-white/5">
                  <p className="text-slate-400 italic">
                    "When observing disputed video, concentrate not on the general performance, but on isolated physical zones where AI templates routinely struggle to blend frame layers."
                  </p>
                </div>

                <div className="space-y-3">
                  <h4 className="text-xs font-mono font-bold text-white uppercase tracking-wider">Crucial Visual Anomaly Vectors</h4>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2 bg-slate-900/20 p-2.5 rounded-lg border border-white/5">
                      <span className="text-emerald-400 font-mono font-bold">1. Pupil Irregularities</span>
                      <p className="text-slate-450 ml-1">AI models struggle to generate true light reflection matrices. Look for asymmetrical light glints in the eyes or pupils that are oddly shaped or display concentric ringing.</p>
                    </li>
                    <li className="flex items-start gap-2 bg-slate-900/20 p-2.5 rounded-lg border border-white/5">
                      <span className="text-emerald-400 font-mono font-bold">2. Dental Blur & Lip Fusion</span>
                      <p className="text-slate-450 ml-1">Observe pronunciation boundaries. Deepfake algorithms struggle to render realistic individual teeth and dynamic wetness; teeth often appear as untextured solid white arrays or warp erratically.</p>
                    </li>
                    <li className="flex items-start gap-2 bg-slate-900/20 p-2.5 rounded-lg border border-white/5">
                      <span className="text-emerald-400 font-mono font-bold">3. Boundary Dissolving during Rotations</span>
                      <p className="text-slate-450 ml-1">Watch for side-to-side profiles. When a subject turns their head, look at the jawline, ears, or glasses frames. They often flicker, melt temporarily, or duplicate themselves during frame transition sweeps.</p>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {activeGuideTab === "actors" && (
            <div className="bg-slate-950/40 border border-white/10 rounded-2xl p-5 md:p-6 space-y-5" id="malicious-actors-guide">
              <div className="flex items-center gap-3 border-b border-slate-850 pb-3">
                <div className="bg-indigo-950/80 p-2.5 rounded-xl border border-indigo-500/30 text-indigo-400">
                  <Lock className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white font-sans">Guarding Against Malicious Multi-Factor Impostors</h3>
                  <p className="text-[11px] text-slate-500 font-mono uppercase">Vulnerability Target: Social Engineering & Infrastructure Hijacking</p>
                </div>
              </div>

              <div className="space-y-4 text-xs text-slate-350 leading-relaxed">
                <p>
                  Modern threat actors don't just rely on technical exploits; they orchestrate blended campaigns. An attacker will harvest personal context from LinkedIn, spoof an executive's profile, and send an urgent slack message or voice note to direct team members to bypass standard compliance controls.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-slate-900/40 rounded-xl border border-white/5 space-y-2">
                    <span className="text-red-400 font-mono font-bold text-xs uppercase block">The 'Executive Urgent' Pitch</span>
                    <p className="text-[11px] text-slate-400 leading-relaxed">
                      "I'm in a closed boardroom meeting, cannot take calls. Send the code directly to this vendor via wire transfer so we can close this acquisition deal."
                    </p>
                  </div>
                  <div className="p-4 bg-slate-900/40 rounded-xl border border-white/5 space-y-2">
                    <span className="text-red-400 font-mono font-bold text-xs uppercase block">The Credential Harvesting Swap</span>
                    <p className="text-[11px] text-slate-400 leading-relaxed">
                      "A temporary security leak was detected in your region. Authenticate through this emergency SSO web portal or lose access within 10 minutes."
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="text-xs font-mono font-bold text-white uppercase tracking-wider">Absolute Quarantine Checklist</h4>
                  <ul className="space-y-2">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
                      <span><strong>Always Confirm Out-Of-Band:</strong> Never verify identity via the same thread the request originated. Call them directly on a registered company number.</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
                      <span><strong>Enforce Hardware-bound MFAs:</strong> Traditional SMS OTP keys are easily intercepted by sim-swapping. Transition all critical systems to security keys (FIDO2 or YubiKeys).</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
                      <span><strong>Block Unregistered Screen Shares:</strong> Malicious Zoom or Google Meet invitation payloads inspect display buffers to scan active personal credentials or session keys.</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* Practical Checklist Interactive Element */}
          <div className="bg-slate-950/60 border border-white/10 rounded-2xl p-5 space-y-4" id="interactive-spotter-checklist">
            <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-slate-800 pb-3 gap-2">
              <div className="flex items-center gap-2">
                <Sliders className="w-4 h-4 text-cyan-400" />
                <h4 className="text-xs font-mono font-bold text-slate-200 uppercase tracking-widest">
                  Live Visual Forensic Investigation Checklist
                </h4>
              </div>
              <div className="text-right">
                <span className="text-[10px] font-mono text-cyan-400 font-bold bg-cyan-950/40 px-2 py-0.5 rounded border border-cyan-800/30">
                  Confidence Score: {checklistPercent}% Checked
                </span>
              </div>
            </div>

            <p className="text-slate-400 text-xs leading-relaxed">
              Facing a highly suspicious audio clip or video recording? Walk through this forensic inspection suite and toggle checkboxes as you hunt for deepfake rendering flaws.
            </p>

            <div className="space-y-2">
              {checklist.map((item) => (
                <div 
                  key={item.id}
                  onClick={() => handleCheckboxChange(item.id)}
                  className={`p-3 rounded-xl border flex items-start gap-3 transition-colors cursor-pointer ${
                    item.checked 
                      ? "bg-indigo-950/30 border-indigo-500/30 text-indigo-300" 
                      : "bg-slate-900/30 border-white/5 hover:border-slate-700 hover:bg-slate-900/50"
                  }`}
                >
                  <div className={`mt-0.5 w-4 h-4 rounded flex items-center justify-center shrink-0 border ${
                    item.checked 
                      ? "bg-indigo-500 border-indigo-400 text-white" 
                      : "border-slate-700 bg-slate-950"
                  }`}>
                    {item.checked && <Check className="w-3 h-3 stroke-[3]" />}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-white">{item.label}</span>
                      <span className="px-1.5 py-0.2 text-[8px] font-mono rounded bg-slate-800 text-slate-400 uppercase tracking-wider">
                        {item.category}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden border border-white/5 mt-2">
              <div 
                className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-cyan-500 transition-all duration-500"
                style={{ width: `${checklistPercent}%` }}
              ></div>
            </div>
            
            {checklistPercent === 100 && (
              <div className="flex gap-2.5 text-xs text-cyan-400 bg-cyan-950/30 border border-cyan-800/30 p-3 rounded-xl">
                <CheckCircle2 className="w-5 h-5 shrink-0" />
                <div>
                  <p className="font-bold uppercase tracking-wider text-[10px] font-mono">Forensic Loop Completed</p>
                  <p className="text-slate-400 mt-0.5">You have thoroughly evaluated all baseline synthetic rendering vulnerabilities. Proceed with defensive verification.</p>
                </div>
              </div>
            )}
          </div>

        </div>

        {/* Right Column: Interactive Widgets & Tools (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* SECURE CODE GENERATOR & EVALUATOR */}
          <div className="bg-slate-950/60 border border-white/10 rounded-2xl p-5 space-y-4" id="safeword-generator-widget">
            <div className="flex items-center gap-2 border-b border-slate-805 pb-3">
              <Key className="w-4.5 h-4.5 text-cyan-400" />
              <div>
                <h4 className="text-xs font-mono font-bold text-slate-200 uppercase tracking-wider">
                  Verpleco // Family Safe Word Architect
                </h4>
                <p className="text-[10px] font-mono text-slate-500 uppercase">PASSKEY STRENGTH & DICTIONARY MATRIX</p>
              </div>
            </div>

            <p className="text-slate-400 text-xs leading-relaxed">
              Design a hard-to-guess, easy-to-remember verbal phrase that family members must state in an emergency before any trust is granted. Test your idea below:
            </p>

            <div className="space-y-3">
              <input
                type="text"
                placeholder="e.g., Purple Elephant Trampoline"
                value={safeWord}
                onChange={(e) => {
                  setSafeWord(e.target.value);
                  evaluateSafeWord(e.target.value);
                }}
                className="w-full bg-slate-900 border border-white/10 rounded-lg px-3.5 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500 font-mono transition-colors"
                maxLength={45}
                id="safe-word-input"
              />

              <div className="flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => {
                    const presets = [
                      "Crimson Bicycle Rain",
                      "Dancing Forest Blanket",
                      "Subzero Volcano Peanut",
                      "Bouncing Yellow Submarine",
                      "Double Sided Coffee Table"
                    ];
                    const random = presets[Math.floor(Math.random() * presets.length)];
                    setSafeWord(random);
                    evaluateSafeWord(random);
                  }}
                  className="text-[10px] bg-slate-900 hover:bg-slate-800 text-cyan-400 font-semibold px-2.5 py-1 rounded border border-cyan-800/20 font-mono transition-colors cursor-pointer"
                >
                  Generate Ideal Preset Pattern
                </button>
                {safeWord && (
                  <button
                    onClick={() => {
                      setSafeWord("");
                      setEvalResult(null);
                    }}
                    className="text-[10px] text-slate-500 hover:text-white font-mono"
                  >
                    Clear
                  </button>
                )}
              </div>

              {evalResult && (
                <div className={`p-4 rounded-xl border transition-all ${evalResult.bgColor} ${evalResult.border}`} id="safe-word-eval-output">
                  <div className="flex items-center justify-between border-b border-white/5 pb-2 mb-2">
                    <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider font-semibold">Resilience Level</span>
                    <span className={`text-[10px] font-mono font-bold tracking-wider uppercase ${evalResult.color}`}>
                      {evalResult.grade}
                    </span>
                  </div>

                  {/* Progress Score Bar */}
                  <div className="space-y-1 mb-3">
                    <div className="flex justify-between text-[9px] font-mono text-slate-500">
                      <span>Entropy Strength</span>
                      <span>{evalResult.score} / 100</span>
                    </div>
                    <div className="w-full bg-black/40 h-1.5 rounded-full overflow-hidden border border-white/5">
                      <div 
                        className="h-full rounded-full transition-all duration-300"
                        style={{ 
                          width: `${evalResult.score}%`,
                          backgroundColor: evalResult.score < 40 ? "#f87171" : evalResult.score < 70 ? "#fbbf24" : "#10b981"
                        }}
                      ></div>
                    </div>
                  </div>

                  {/* Recommendations */}
                  <div className="space-y-1.5 text-[11px] leading-relaxed text-slate-300">
                    <span className="text-[9px] font-mono text-slate-500 uppercase tracking-widest block">Structural Audit:</span>
                    {evalResult.feedback.map((item, idx) => (
                      <div key={idx} className="flex gap-1.5">
                        <span className="text-cyan-500 shrink-0 select-none">▪</span>
                        <p className="text-slate-400">{item}</p>
                      </div>
                    ))}
                  </div>

                </div>
              )}

              <p className="text-[10px] text-slate-500 leading-relaxed font-mono italic">
                Tip: Instruct parents or grandparents to immediately memorize this exact combination of words, and tell them to NEVER reveal it to unknown callers or document it in texts.
              </p>
            </div>
          </div>

          {/* ACTIVE CRISIS SCENARIO SIMULATOR */}
          <div className="bg-slate-950/60 border border-white/10 rounded-2xl p-5 space-y-4" id="cloned-voice-crisis-simulator">
            <div className="flex items-center gap-2 border-b border-slate-805 pb-3 justify-between">
              <div className="flex items-center gap-2">
                <PhoneCall className="w-4.5 h-4.5 text-indigo-400" />
                <div>
                  <h4 className="text-xs font-mono font-bold text-slate-200 uppercase tracking-wider">
                    Interactive Tactical Scam Simulator
                  </h4>
                  <p className="text-[10px] font-mono text-indigo-400 uppercase">Emergency Reaction Trainer</p>
                </div>
              </div>
              <span className="px-1.5 py-0.5 rounded bg-red-950/40 border border-red-500/20 text-red-400 font-mono text-[9px]">LIVE EXERCISE</span>
            </div>

            {simStep === "intro" && (
              <div className="space-y-4 text-xs" id="sim-intro">
                <p className="text-slate-300 leading-relaxed">
                  Test your real-time resilience under pressure. Play this interactive scenario to learn the exact sequential procedures for handling a high-urgency AI voice cloning scam call.
                </p>

                <div className="p-4 bg-slate-900/40 rounded-xl border border-white/5 text-slate-400 leading-relaxed space-y-2">
                  <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest block font-bold">Scenario Setup:</span>
                  <p>
                    It is 9:15 PM. Your telephone rings from an unknown VoIP number. You answer. A voice that sounds exactly like your child or sibling cries frantically in terror...
                  </p>
                </div>

                <button
                  onClick={startSimulation}
                  className="w-full py-2.5 bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white font-bold rounded-lg text-xs transition-all tracking-wider uppercase flex items-center justify-center gap-2 cursor-pointer"
                  id="start-sim-btn"
                >
                  Answer Incoming Call
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}

            {simStep === "call" && (
              <div className="space-y-4" id="sim-call">
                {/* Simulated Audio Wave */}
                <div className="bg-black/80 rounded-xl p-4 border border-red-500/10 flex flex-col items-center justify-center space-y-3 relative overflow-hidden">
                  <div className="absolute top-1 right-2 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping"></span>
                    <span className="text-[8px] font-mono text-red-400">DUPED VOIP INCOMING</span>
                  </div>
                  
                  {/* Fake wave bars */}
                  <div className="flex gap-1 items-center justify-center h-10 w-full">
                    <div className="bg-red-500 w-1 rounded-full animate-pulse h-6"></div>
                    <div className="bg-red-500 w-1 rounded-full animate-pulse h-8 delay-75"></div>
                    <div className="bg-red-500 w-1 rounded-full animate-pulse h-4 delay-150"></div>
                    <div className="bg-red-500 w-1 rounded-full animate-pulse h-9 delay-100"></div>
                    <div className="bg-red-500 w-1 rounded-full animate-pulse h-2"></div>
                    <div className="bg-red-500 w-1 rounded-full animate-pulse h-7 delay-200"></div>
                  </div>

                  <span className="text-[10px] font-mono text-slate-500">VOICE MATCH COEFFICIENT: 98.4% (CLONED)</span>
                </div>

                <div className="text-xs bg-slate-900 border border-white/5 p-4 rounded-xl leading-relaxed space-y-2">
                  <span className="text-[10px] font-mono text-red-400 tracking-wider uppercase block font-bold">Franctically crying relative:</span>
                  <p className="italic text-slate-200">
                    "Dad/Mom, I messed up bad! I was driving and looked down at my phone... I hit someone's bumper. The police are arrested me, my shoulder is hurt, they have me in standard county custody. They said they won't let me leave unless I wire $4,000 for immediate bail or medical collateral. They won't let me use my direct phone! Please don't call anyone else, I promise I'm so sorry, send it now!"
                  </p>
                </div>

                <div className="space-y-2 text-xs">
                  <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest block font-bold">Select Your Immediate Defensive Action:</span>
                  <button
                    onClick={() => chooseSimulationPath("panic")}
                    className="w-full text-left p-3 rounded-lg border border-red-500/20 bg-red-950/10 text-red-300 hover:bg-red-950/20 transition-all font-sans cursor-pointer block"
                  >
                    💡 <strong className="text-white">Option A: Panic.</strong> Immediately promise you will log into your bank app, download the wire guidelines, and transfer the money to secure their safety.
                  </button>
                  <button
                    onClick={() => chooseSimulationPath("challenge_pass")}
                    className="w-full text-left p-3 rounded-lg border border-indigo-500/20 bg-indigo-950/10 text-indigo-300 hover:bg-indigo-950/20 transition-all font-sans cursor-pointer block"
                  >
                    🛡️ <strong className="text-white">Option B: Challenge with Code.</strong> Reply calmly: "Take a deep breath. Stop and tell me what our family emergency security word is."
                  </button>
                  <button
                    onClick={() => chooseSimulationPath("out_of_band")}
                    className="w-full text-left p-3 rounded-lg border border-cyan-500/20 bg-cyan-950/10 text-cyan-300 hover:bg-cyan-950/20 transition-all font-sans cursor-pointer block"
                  >
                    📡 <strong className="text-white">Option C: Out-Of-Band Check.</strong> Say nothing. Hang up immediately, find your relative's regular contact list card, and call call/text them directly.
                  </button>
                </div>
              </div>
            )}

            {simStep === "challenge" && (
              <div className="space-y-4" id="sim-challenge">
                <div className="bg-black/60 rounded-xl p-3 border border-indigo-500/5 text-xs text-slate-400">
                  <p className="font-mono text-[10px] text-amber-500 uppercase tracking-wider font-bold mb-1">Defense Evaluation Impact:</p>
                  <p>Urgency overload has slightly impacted your analytical composure. Standard hackers leverage this artificial delay to exfiltrate cash before logic sets in.</p>
                </div>

                <div className="text-xs bg-slate-900 border border-white/5 p-4 rounded-xl leading-relaxed space-y-2">
                  <span className="text-[10px] font-mono text-red-400 tracking-wider uppercase block font-bold">Panicking Cloned Caller:</span>
                  <p className="italic text-slate-200">
                    "Why are you asking about a code?! I'm in pain, they're taking me into a cell, some other guy is yelling at me! They're saying if I don't wire the credit collateral within five minutes they're locking me up for the night. Please just send the money onto my supervisor's card..."
                  </p>
                </div>

                <div className="space-y-2 text-xs">
                  <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest block font-bold">Select Counter-Action:</span>
                  <button
                    onClick={() => chooseSimulationPath("challenge_pass")}
                    className="w-full text-left p-3 rounded-lg border border-indigo-500/20 bg-indigo-950/10 text-indigo-300 hover:bg-indigo-950/20 transition-all font-sans cursor-pointer block"
                  >
                    🛡️ <strong className="text-white">Deploy Safe Word Trap:</strong> "No code, no money. If you're really who you say you are, tell me the family secret word or I am hanging up."
                  </button>
                  <button
                    onClick={() => chooseSimulationPath("personal_quiz")}
                    className="w-full text-left p-3 rounded-lg border border-amber-500/20 bg-amber-950/10 text-amber-300 hover:bg-amber-950/20 transition-all font-sans cursor-pointer block"
                  >
                    🧠 <strong className="text-white">Behavioral Quiz:</strong> "If you can't remember the code, tell me: What is the exact name of the street we lived on when you were in fourth grade?"
                  </button>
                  <button
                    onClick={() => chooseSimulationPath("comply")}
                    className="w-full text-left p-3 rounded-lg border border-red-500/20 bg-red-950/10 text-red-300 hover:bg-red-950/20 transition-all font-sans cursor-pointer block"
                  >
                    ❗ <strong className="text-white">Lapse & Comply:</strong> Fine, I cannot risk your safety. Tell me the wire bank codes and account details.
                  </button>
                </div>
              </div>
            )}

            {simStep === "outbound" && (
              <div className="space-y-4" id="sim-outbound">
                <div className="text-xs bg-slate-900 border border-white/5 p-4 rounded-xl leading-relaxed space-y-2">
                  <span className="text-[10px] font-mono text-slate-400 tracking-wider uppercase block font-bold">Simulation Play-By-Play:</span>
                  <p className="text-slate-300">
                    The caller begins to stutter. Then, they hang up the call because you refused to panic. In the background, you immediately dial your relative's registered personal cellphone.
                  </p>
                  <p className="text-emerald-400 font-semibold bg-emerald-950/30 p-2.5 rounded border border-emerald-900/30">
                    Your relative answers immediately! They are completely fine, sitting comfortably at their desk studying or sipping coffee. They confirm they never called you and have not been in any accident.
                  </p>
                </div>

                <div className="space-y-2">
                  <button
                    onClick={() => chooseSimulationPath("out_of_band")}
                    className="w-full py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-lg text-xs tracking-wider uppercase cursor-pointer"
                  >
                    Proceed to Security Assessment
                  </button>
                </div>
              </div>
            )}

            {simStep === "result" && (
              <div className="space-y-4 text-xs" id="sim-result">
                <div className="bg-slate-950/90 rounded-xl p-4 border border-white/10 space-y-3 relative overflow-hidden">
                  <div className="flex items-center justify-between border-b border-indigo-900 pb-2">
                    <span className="text-[10px] font-mono text-slate-400 uppercase font-bold flex items-center gap-1.5">
                      <Award className="w-4 h-4 text-emerald-400" /> Assessment Blueprint
                    </span>
                    <span className="text-[10px] font-mono text-indigo-400">{simScore >= 95 ? "FLAWLESS INTEL" : simScore >= 70 ? "SECURE PLAY" : "EXPOSED"}</span>
                  </div>

                  <div className="text-center py-2 space-y-1">
                    <span className="text-[9px] font-mono text-slate-500 uppercase block">Reaction Score</span>
                    <h5 className="text-3xl font-extrabold tracking-tight text-white font-sans">{simScore} / 100</h5>
                  </div>

                  <div className="space-y-2 leading-relaxed text-slate-400">
                    <span className="text-[9px] font-mono text-slate-500 uppercase tracking-widest block">Defense Analysis:</span>
                    {userChoiceHistory.includes("hang_up_and_callback") && (
                      <p className="border-l-2 border-emerald-500 pl-2 text-[11px]">
                        <strong className="text-white font-sans text-xs block">Perfect Deflection Protocol</strong>
                        You immediately recognized caller-ID spoofing. By initiating an independent out-of-band call to the actual stored phone number, you completely rendered their tech stack useless!
                      </p>
                    )}
                    {userChoiceHistory.includes("security_key_deployed") && (
                      <p className="border-l-2 border-cyan-500 pl-2 text-[11px]">
                        <strong className="text-white font-sans text-xs block">Robust Passkey Deployment</strong>
                        You challenged the imposter directly with a unique family guard word. Since generative voice engines cannot synthesize a response that they do not know, the attacker was instantly thwarted.
                      </p>
                    )}
                    {userChoiceHistory.includes("memory_challenge") && (
                      <p className="border-l-2 border-amber-500 pl-2 text-[11px]">
                        <strong className="text-white font-sans text-xs block">Behavioral Memory Block</strong>
                        You successfully leveraged customized personal context that isn't searchable via automated search bots or social crawls. Perfect backup strategy!
                      </p>
                    )}
                    {userChoiceHistory.includes("fraud_compliance") && (
                      <p className="border-l-2 border-red-500 pl-2 text-[11px] bg-red-950/10 p-2.5 rounded border border-red-900/20">
                        <strong className="text-red-400 font-sans text-xs block">Compromised Scenario Outcome</strong>
                        You surrendered to the artificial urgency matrix. Attackers leverage panic factors to prevent rational verification. Use this lesson to ALWAYS establish out-of-band checkmarks.
                      </p>
                    )}
                  </div>
                </div>

                {/* Simulated Logs Terminal */}
                <div className="bg-black border border-slate-900 rounded-lg p-3 font-mono text-[9px] text-cyan-500 leading-snug space-y-1">
                  {simLogs.map((log, idx) => (
                    <div key={idx}>{log}</div>
                  ))}
                </div>

                <button
                  onClick={resetSimulation}
                  className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-slate-300 font-mono text-xs rounded-lg transition-colors border border-white/5 font-semibold flex items-center justify-center gap-2 cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  Restart Exercise
                </button>
              </div>
            )}

          </div>

        </div>

      </div>

    </div>
  );
}
