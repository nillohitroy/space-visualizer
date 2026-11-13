import { Satellite } from 'lucide-react';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="w-full bg-space-950 border-t border-slate-800/60 py-8 px-4 sm:px-6 lg:px-8 mt-auto z-50">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        
        <div className="flex items-center gap-3 text-center md:text-left">
          <Satellite className="w-5 h-5 text-cyan-accent" />
          <span className="font-mono text-xs text-slate-400">
            <strong className="text-slate-200">Space Visualizer</strong> • NASA JPL & ISRO SAC Joint Mission Data
          </span>
        </div>
        
        <div className="flex flex-wrap items-center justify-center gap-4 font-mono text-[10px] text-slate-500">
          <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 bg-cyan-accent rounded-full"></span> L-BAND 1.25GHz</span>
          <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 bg-amber-400 rounded-full"></span> S-BAND 3.20GHz</span>
          <span>SWATH 242KM</span>
          <span>12-DAY CYCLE</span>
        </div>
        
        <div className="text-center md:text-right font-mono text-[10px] text-slate-500">
          <Link href="/research" className="hover:text-cyan-accent transition-colors">Access Open Data API</Link>
        </div>
        
      </div>
    </footer>
  );
}