"use client";

import { useState } from 'react';
import InteractiveGlobe from '@/components/InteractiveGlobe';
import { Activity, Crosshair, Radar, ArrowRight, Database, Cpu, Waves, Trees } from 'lucide-react';
import Link from 'next/link';

export default function HomePage() {
  const [scanData, setScanData] = useState<any>(null);
  const [isScanning, setIsScanning] = useState(false);

  const handleGlobeClick = (coords: number[]) => {
    setIsScanning(true);
    setScanData(null);
    
    setTimeout(() => {
      const lon = coords[0];
      const lat = coords[1];
      let status = "";
      let clusters = "";
      let rvi = 0;
      let roughness = 0;

      // Geospatial ML Logic Simulator
      if (lat > 60 || lat < -60) {
        status = "Glacial Ice Melt / Crevasse Formation";
        clusters = "Ice, Firn, Open Water";
        rvi = Math.random() * 0.1;
        roughness = -(Math.random() * 5 + 20);
      } else if (lat < 15 && lat > -15) {
        status = "High Biomass / Selective Logging Risk";
        clusters = "Dense Canopy, Cleared, Riverine";
        rvi = Math.random() * 0.3 + 0.6;
        roughness = -(Math.random() * 5 + 8);
      } else if (lon > 60 && lon < 100 && lat > 10 && lat < 30) {
        status = "High Flood Inundation Risk (Monsoon)";
        clusters = "Water, Flooded Veg, Soil";
        rvi = Math.random() * 0.4 + 0.2;
        roughness = -(Math.random() * 10 + 10);
      } else {
        status = "Stable Surface / Agricultural Cycle";
        clusters = "Crops, Urban, Bare Earth";
        rvi = Math.random() * 0.5 + 0.1;
        roughness = -(Math.random() * 8 + 12);
      }

      setScanData({
        lat: lat.toFixed(4),
        lon: lon.toFixed(4),
        rvi: rvi.toFixed(3),
        roughness: roughness.toFixed(1),
        clusters: clusters,
        status: status
      });
      setIsScanning(false);
    }, 2500);
  };

  return (
    <div className="w-full min-h-screen bg-space-950 font-sans">
      
      {/* HERO SECTION: 3D Earth */}
      <div className="relative w-full h-screen border-b border-slate-800 flex flex-col justify-between">
        <InteractiveGlobe onScanTarget={handleGlobeClick} />
        
        {/* Gradient Overlay (Allows clicks through to globe) */}
        <div className="absolute inset-0 bg-gradient-to-t from-space-950 via-transparent to-space-950/40 pointer-events-none z-0" />
        
        {/* UI Overlay Container (Pointer events disabled on container) */}
        <div className="relative z-10 w-full h-full max-w-7xl mx-auto px-4 sm:px-6 pt-10 pb-8 flex flex-col justify-between pointer-events-none">
          
          <div className="max-w-2xl p-6 rounded-2xl pointer-events-none mt-4">
            <div className="flex items-center gap-2 mb-2">
              <Radar className="w-5 h-5 text-cyan-accent animate-pulse" />
              <span className="text-xs font-mono text-cyan-accent tracking-widest uppercase shadow-black drop-shadow-md">Global Observatory</span>
            </div>
            <h1 className="text-4xl sm:text-6xl font-bold text-white mb-4 tracking-tight drop-shadow-lg shadow-black">The Living Pulse of Earth</h1>
            <p className="text-sm sm:text-base text-slate-100 leading-relaxed drop-shadow-md shadow-black font-medium">
              Click anywhere on the globe to drop a targeted Area of Interest (AOI). 
              Our engine simulates NISAR L-Band and S-Band data extraction to classify surface features instantly.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end pointer-events-none">
            
            {/* Interactive ML Scanner Panel (Pointer events restored for this specific box) */}
            <div className="md:col-span-5 lg:col-span-4 hud-backdrop rounded-xl p-5 shadow-2xl pointer-events-auto">
              <div className="flex items-center gap-2 border-b border-slate-700/50 pb-3 mb-4">
                <Cpu className="w-4 h-4 text-cyan-accent" />
                <span className="font-bold tracking-wider text-slate-200 text-xs font-mono">AOI MACHINE LEARNING ENGINE</span>
              </div>
              
              {!isScanning && !scanData && (
                <div className="text-center py-6 text-slate-500 text-xs font-mono border border-dashed border-slate-700 rounded-lg">
                  Awaiting Target Coordinates.<br/>Click the globe to initiate scan.
                </div>
              )}

              {isScanning && (
                <div className="text-center py-6 flex flex-col items-center gap-3">
                  <div className="w-6 h-6 border-2 border-cyan-accent border-t-transparent rounded-full animate-spin"></div>
                  <span className="text-cyan-accent text-xs font-mono animate-pulse">Extracting PolSAR Data...</span>
                </div>
              )}

              {scanData && (
                <div className="space-y-3 font-mono">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-400">Target (Lat/Lon):</span>
                    <span className="text-white">{scanData.lat}°, {scanData.lon}°</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-400">Mean RVI:</span>
                    <span className="text-cyan-accent font-bold">{scanData.rvi}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-400">Roughness:</span>
                    <span className="text-amber-400 font-bold">{scanData.roughness} dB</span>
                  </div>
                  <div className="flex justify-between text-xs border-t border-slate-700/50 pt-2">
                    <span className="text-slate-400">Detected Classes:</span>
                    <span className="text-white text-right">{scanData.clusters}</span>
                  </div>
                  <div className="bg-cyan-950/40 p-2 rounded border border-cyan-900 mt-2 text-[10px] text-cyan-300">
                    HYPOTHESIS: {scanData.status}
                  </div>
                </div>
              )}
            </div>

            <div className="hidden md:block md:col-span-2 lg:col-span-4" />

            {/* Navigation Modes (Pointer events restored for clickable links) */}
            <div className="md:col-span-5 lg:col-span-4 hud-backdrop rounded-xl p-5 pointer-events-auto">
              <div className="flex items-center gap-2 border-b border-slate-700/50 pb-3 mb-4">
                <Crosshair className="w-4 h-4 text-cyan-accent" />
                <span className="font-bold tracking-wider text-slate-200 text-xs font-mono">MISSION PERSPECTIVES</span>
              </div>
              <div className="space-y-3">
                <Link href="/public" className="group flex items-center justify-between p-3 rounded-lg bg-space-900/80 hover:bg-cyan-900/30 border border-slate-700 hover:border-cyan-accent transition-all text-slate-200">
                  <div className="flex flex-col">
                    <span className="text-sm font-bold text-white group-hover:text-cyan-accent transition-colors">Public Story Map</span>
                    <span className="text-[10px] text-slate-400 font-mono">Discover human & environmental impacts</span>
                  </div>
                  <ArrowRight className="w-4 h-4 text-cyan-accent opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
                <Link href="/research" className="group flex items-center justify-between p-3 rounded-lg bg-space-900/80 hover:bg-cyan-900/30 border border-slate-700 hover:border-cyan-accent transition-all text-slate-200">
                  <div className="flex flex-col">
                    <span className="text-sm font-bold text-white group-hover:text-cyan-accent transition-colors">Scientific Research Lab</span>
                    <span className="text-[10px] text-slate-400 font-mono">Access raw COGs & Time-Series Data</span>
                  </div>
                  <ArrowRight className="w-4 h-4 text-cyan-accent opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* SCROLLING CONTENT SECTION */}
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-20 flex flex-col gap-20">
        
        {/* The NISAR Advantage */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <span className="text-cyan-accent font-mono text-xs tracking-widest uppercase block mb-3">Dual-Band Architecture</span>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">Why L-Band and S-Band?</h2>
            <p className="text-slate-400 leading-relaxed mb-6">
              Unlike optical satellites that are blinded by clouds, Synthetic Aperture Radar (SAR) provides pristine data regardless of weather. 
              NISAR is revolutionary because it carries two distinct radar frequencies simultaneously.
            </p>
            <ul className="space-y-4 font-mono text-sm">
              <li className="flex gap-4 items-start p-4 bg-space-900 rounded-xl border border-slate-800">
                <div className="text-cyan-accent mt-1">L-BAND</div>
                <div className="text-slate-300">NASA's 24cm wavelength penetrates deep into dense forest canopies, bouncing off thick trunks and the ground below to measure total biomass and hidden floodwaters.</div>
              </li>
              <li className="flex gap-4 items-start p-4 bg-space-900 rounded-xl border border-slate-800">
                <div className="text-amber-400 mt-1">S-BAND</div>
                <div className="text-slate-300">ISRO's 9cm wavelength scatters off the tops of leaves and crop canopies, making it incredibly sensitive to agricultural health and lightweight vegetation.</div>
              </li>
            </ul>
          </div>
          
          {/* Responsive SVG Signal Penetration Diagram */}
          <div className="bg-space-900 rounded-2xl border border-slate-800 p-6 flex flex-col justify-center shadow-xl w-full h-full min-h-[400px]">
            <h3 className="text-center font-mono text-sm text-slate-400 mb-6 uppercase tracking-widest">Radar Penetration Profile</h3>
            <div className="w-full h-full flex-1 flex items-center justify-center">
              <svg viewBox="0 0 500 350" className="w-full h-full max-w-md mx-auto" xmlns="http://www.w3.org/2000/svg">
                {/* Background & Ground */}
                <rect x="0" y="280" width="500" height="70" fill="#1e1e24" />
                <path d="M0,280 L500,280" stroke="#b45309" strokeWidth="2" strokeDasharray="5,5" />
                
                {/* Tree */}
                <path d="M240,280 L240,150 L260,150 L260,280 Z" fill="#451a03" />
                <circle cx="250" cy="130" r="70" fill="#064e3b" opacity="0.8" />
                <circle cx="210" cy="160" r="50" fill="#064e3b" opacity="0.9" />
                <circle cx="290" cy="160" r="50" fill="#064e3b" opacity="0.9" />

                {/* S-Band (9cm) - Hits Leaves */}
                <path d="M120,40 Q150,80 180,120" fill="none" stroke="#fbbf24" strokeWidth="3" strokeDasharray="8,4" />
                <circle cx="180" cy="120" r="4" fill="#fbbf24" />
                <path d="M180,120 Q160,80 130,30" fill="none" stroke="#fbbf24" strokeWidth="2" opacity="0.5" />
                <text x="70" y="30" fill="#fbbf24" fontFamily="monospace" fontSize="12" fontWeight="bold">S-BAND (9cm)</text>
                
                {/* L-Band (24cm) - Hits Trunk/Ground */}
                <path d="M380,40 Q350,150 255,230" fill="none" stroke="#00f2fe" strokeWidth="3" strokeDasharray="12,6" />
                <circle cx="255" cy="230" r="4" fill="#00f2fe" />
                <path d="M255,230 Q330,160 390,30" fill="none" stroke="#00f2fe" strokeWidth="2" opacity="0.5" />
                <text x="360" y="30" fill="#00f2fe" fontFamily="monospace" fontSize="12" fontWeight="bold">L-BAND (24cm)</text>

                {/* Labels */}
                <text x="250" y="310" fill="#94a3b8" fontFamily="sans-serif" fontSize="12" textAnchor="middle">EARTH SURFACE</text>
                <text x="130" y="160" fill="#fbbf24" fontFamily="sans-serif" fontSize="10" textAnchor="middle">Canopy Scatter</text>
                <text x="350" y="250" fill="#00f2fe" fontFamily="sans-serif" fontSize="10" textAnchor="middle">Volume/Ground Scatter</text>
              </svg>
            </div>
          </div>
        </section>

        {/* Global Impact Grid */}
        <section>
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">Mission Applications</h2>
            <p className="text-slate-400 max-w-2xl mx-auto">Tracking the complex rhythms of our planet's ecosystems and geology.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-space-900 p-6 rounded-xl border border-slate-800 hover:border-cyan-500/50 transition-colors">
              <Waves className="text-cyan-accent w-8 h-8 mb-4" />
              <h3 className="text-lg font-bold text-white mb-2">Hydrosphere</h3>
              <p className="text-sm text-slate-400">Mapping floodplain inundation and tracking groundwater extraction through surface subsidence.</p>
            </div>
            <div className="bg-space-900 p-6 rounded-xl border border-slate-800 hover:border-emerald-500/50 transition-colors">
              <Trees className="text-emerald-400 w-8 h-8 mb-4" />
              <h3 className="text-lg font-bold text-white mb-2">Biosphere</h3>
              <p className="text-sm text-slate-400">Calculating Above-Ground Biomass (AGB) and detecting rapid deforestation under cloud cover.</p>
            </div>
            <div className="bg-space-900 p-6 rounded-xl border border-slate-800 hover:border-sky-500/50 transition-colors">
              <Activity className="text-sky-400 w-8 h-8 mb-4" />
              <h3 className="text-lg font-bold text-white mb-2">Cryosphere</h3>
              <p className="text-sm text-slate-400">Tracking glacier velocity vectors and polar ice shelf structural calving precursors.</p>
            </div>
            <div className="bg-space-900 p-6 rounded-xl border border-slate-800 hover:border-rose-500/50 transition-colors">
              <Database className="text-rose-400 w-8 h-8 mb-4" />
              <h3 className="text-lg font-bold text-white mb-2">Solid Earth</h3>
              <p className="text-sm text-slate-400">Measuring millimeter-level tectonic strain and post-earthquake fault displacements.</p>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}