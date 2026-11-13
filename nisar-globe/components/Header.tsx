import Link from 'next/link';
import { Satellite, ShieldCheck, User } from 'lucide-react';

export default function Header() {
  return (
    <header className="fixed top-0 w-full z-50 hud-backdrop border-b border-cyan-500/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-16">
          <div className="flex items-center space-x-3 sm:space-x-4">
            <div className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-tr from-cyan-accent to-blue-600 flex items-center justify-center p-[2px]">
                <div className="h-full w-full bg-space-900 rounded-[6px] flex items-center justify-center">
                  <Satellite className="w-4 h-4 text-cyan-accent" />
                </div>
              </div>
              <span className="font-mono font-bold text-lg tracking-wider text-white">Space Visualizer</span>
            </div>
          </div>
          
          <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
            <Link href="/" className="text-slate-300 hover:text-cyan-accent transition-colors">Mission Control</Link>
            <Link href="/public" className="text-slate-300 hover:text-cyan-accent transition-colors">Public Stories</Link>
            <Link href="/research" className="text-slate-300 hover:text-cyan-accent transition-colors">Research Lab</Link>
          </nav>

          <div className="flex items-center space-x-3">
            <button className="hidden sm:flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-space-800 hover:bg-space-700 text-xs font-mono text-slate-300 border border-slate-700/80 transition-all">
              <ShieldCheck className="w-3.5 h-3.5 text-cyan-accent" />
              <span>PASADENA / ISRO SAC</span>
            </button>
            <button className="h-8 w-8 rounded-full bg-space-800 border border-slate-700 flex items-center justify-center text-slate-300 hover:text-white">
              <User className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}