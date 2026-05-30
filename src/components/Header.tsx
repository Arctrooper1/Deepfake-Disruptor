import React from "react";
import { ShieldCheck, ShieldAlert, Cpu } from "lucide-react";

export default function Header() {
  return (
    <header className="border-b border-slate-800 bg-slate-950/60 backdrop-blur-md sticky top-0 z-30 px-6 py-4" id="lab-header">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-tr from-cyan-500 to-indigo-600 p-2 rounded-xl border border-cyan-400/30 shadow-[0_0_15px_rgba(6,182,212,0.15)]">
            <Cpu className="w-8 h-8 text-cyan-300 animate-pulse" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
              DeepFake <span className="text-cyan-400 bg-cyan-950/40 px-2 py-0.5 rounded border border-cyan-500/20 text-lg uppercase font-mono tracking-widest">Disruptor</span>
            </h1>
            <p className="text-xs text-slate-400 font-mono">
              Forensic Intelligence Laboratory // SECURE-MEDIA WORKSPACE
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4 text-xs font-mono">
          <div className="flex items-center h-8 gap-2 px-3 rounded-lg border border-indigo-500/20 bg-indigo-950/30 text-indigo-400">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping"></span>
            <span>Category: Discover, Disrupt, Display</span>
          </div>
          <div className="hidden lg:flex items-center h-8 gap-1.5 px-3 rounded-lg border border-emerald-500/20 bg-emerald-950/30 text-emerald-400/90">
            <ShieldCheck className="w-4 h-4" />
            <span>Forensics: ONLINE</span>
          </div>
        </div>
      </div>
    </header>
  );
}
