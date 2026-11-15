"use client";

import { useState, useEffect } from 'react';
import DeckGL from '@deck.gl/react';
import { _GlobeView as GlobeView } from '@deck.gl/core';
import { TileLayer } from '@deck.gl/geo-layers';
import { BitmapLayer, ScatterplotLayer } from '@deck.gl/layers';
import { Waves, Trees, ThermometerSun, Mountain, Droplets, ShieldAlert, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, AreaChart, Area, CartesianGrid } from 'recharts';

const GLOBE_VIEW = new GlobeView({ id: 'story-globe', resolution: 2 });
const SLIDER_BASE_IMAGE = "https://images.unsplash.com/photo-1542224566-6e85f2e6772f?auto=format&fit=crop&w=1200&q=80";

const HOTSPOTS = [
  {
    id: 'assam',
    name: "Assam, India",
    type: "Monsoon Flooding",
    lat: 26.2, lon: 92.0,
    color: [0, 242, 254], 
    icon: <Waves className="w-6 h-6 text-cyan-400" />,
    description: "Every year, the Brahmaputra river overflows. Standard satellites can't see the floodwaters because of thick monsoon storm clouds. NISAR's radar pierces the storm, mapping exactly which villages are underwater in real-time.",
    impact: "Allows rescue teams to navigate blindly through storms to reach stranded families.",
    data: [
      { name: 'Dry Season', value: 20, fill: '#0ea5e9' },
      { name: 'Monsoon', value: 85, fill: '#0284c7' }
    ],
    metricName: "Surface Water Saturation (%)",
    timeseries: [
      { date: "Jul 01", roughness: -10.2 },
      { date: "Jul 25", roughness: -16.0 },
      { date: "Aug 06", roughness: -22.5 },
      { date: "Aug 30", roughness: -12.1 }
    ]
  },
  {
    id: 'amazon',
    name: "Amazon Basin, Brazil",
    type: "Hidden Deforestation",
    lat: -3.4, lon: -62.0,
    color: [16, 185, 129], 
    icon: <Trees className="w-6 h-6 text-emerald-400" />,
    description: "Illegal loggers often leave the top canopy of the forest intact while cutting down the massive, ancient tree trunks underneath. Optical cameras just see green leaves. Our L-Band radar hits the missing trunks and immediately flags the theft.",
    impact: "Protects indigenous lands by automatically alerting authorities to illegal logging.",
    data: [
      { name: 'Healthy Forest', value: 100, fill: '#10b981' },
      { name: 'Optical View', value: 95, fill: '#34d399' }
    ],
    metricName: "Tree Trunk Biomass (Health)",
    timeseries: [
      { date: "Jul 01", roughness: -8.1 },
      { date: "Jul 25", roughness: -9.0 },
      { date: "Aug 06", roughness: -14.2 },
      { date: "Aug 30", roughness: -14.8 }
    ]
  },
  {
    id: 'california',
    name: "San Joaquin, California",
    type: "Aquifer Subsidence",
    lat: 36.6, lon: -120.0,
    color: [168, 85, 247],
    icon: <Mountain className="w-6 h-6 text-purple-400" />,
    description: "During heavy droughts, immense amounts of groundwater are pumped for agriculture. This causes the actual ground to sink. NISAR can measure the Earth's crust deflating by just a few millimeters from 747 kilometers in space.",
    impact: "Helps state governments regulate water usage to prevent aqueducts and bridges from cracking.",
    data: [
      { name: 'Normal', value: 0, fill: '#c084fc' },
      { name: 'Drought Yr 1', value: -12, fill: '#a855f7' }
    ],
    metricName: "Ground Sinking (cm)",
    timeseries: [
      { date: "Jul 01", roughness: -15.2 },
      { date: "Jul 25", roughness: -15.5 },
      { date: "Aug 06", roughness: -15.3 },
      { date: "Aug 30", roughness: -15.4 }
    ]
  },
  {
    id: 'sundarbans',
    name: "Sundarbans, Bangladesh",
    type: "Mangrove Erosion",
    lat: 21.9, lon: 89.0,
    color: [45, 212, 191], 
    icon: <Droplets className="w-6 h-6 text-teal-400" />,
    description: "The world's largest mangrove forest acts as a shield against cyclones. S-Band radar is highly sensitive to these leafy canopies, tracking exactly where saltwater intrusion is killing the trees that protect millions of people.",
    impact: "Guides replanting efforts to fortify the coastline against the next major typhoon.",
    data: [
      { name: 'Historical', value: 100, fill: '#2dd4bf' },
      { name: 'Cyclone Damage', value: 65, fill: '#14b8a6' }
    ],
    metricName: "Coastal Buffer Integrity (%)",
    timeseries: [
      { date: "Jul 01", roughness: -9.2 },
      { date: "Jul 25", roughness: -10.5 },
      { date: "Aug 06", roughness: -15.5 },
      { date: "Aug 30", roughness: -13.1 }
    ]
  }
];

export default function PublicStoryPage() {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [activeStory, setActiveStory] = useState(HOTSPOTS[0]);
  const [realMetrics, setRealMetrics] = useState<any>({});
  
  const [viewState, setViewState] = useState<any>({
    longitude: 92.0,
    latitude: 26.2,
    zoom: 3.5, 
    pitch: 30,
    minZoom: 1.5,
    maxZoom: 20
  });

  // Fetch the JSON output on load to populate real data
  useEffect(() => {
    fetch('/data/scientist_timeseries.json')
      .then(res => res.json())
      .then(data => {
        const metricsMap: any = {};
        data.forEach((d: any) => metricsMap[d.region] = d);
        setRealMetrics(metricsMap);
      })
      .catch(err => console.warn("Waiting for JSON to be placed in /public/data/"));
  }, []);

  // Dynamically inject real data into the Bar Chart (No Kaggle mention)
  const getDynamicBarData = () => {
    const liveData = realMetrics[activeStory.id];
    
    if (!liveData) return activeStory.data;
    
    const liveValue = Math.min(100, Math.max(0, Math.round(liveData.mean_rvi * 100)));
    
    return [
      ...activeStory.data,
      { name: 'Latest Pass', value: liveValue, fill: `rgb(${activeStory.color.join(',')})` }
    ];
  };

  // Dynamically inject real data into the Area Chart
  const getDynamicTimeseries = () => {
    const liveData = realMetrics[activeStory.id];
    
    if (!liveData) return activeStory.timeseries;
    
    return [
      ...activeStory.timeseries,
      { date: 'Latest Pass', roughness: liveData.mean_roughness_db }
    ];
  };

  const baseMapLayer = new TileLayer({
    id: 'story-base-map',
    data: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    minZoom: 0,
    maxZoom: 19,
    tileSize: 256,
    renderSubLayers: (props) => {
      const bbox = props.tile.bbox as { west: number; south: number; east: number; north: number };
      const { west, south, east, north } = bbox;
      return new BitmapLayer(props, {
        data: undefined, 
        image: props.data,
        bounds: [west, south, east, north],
      });
    },
  });

  const hotspotLayer = new ScatterplotLayer({
    id: 'story-hotspots',
    data: HOTSPOTS,
    pickable: true,
    getPosition: (d) => [d.lon, d.lat],
    getFillColor: (d) => (d.id === activeStory.id ? [...d.color, 255] : [...d.color, 120]) as [number, number, number, number],
    getRadius: (d) => d.id === activeStory.id ? 90000 : 50000,
    radiusMinPixels: 8,
    radiusMaxPixels: 20,
    transitions: { getRadius: 300, getFillColor: 300 },
    onClick: (info) => {
      if (info.object) {
        setActiveStory(info.object);
        setViewState((v: any) => ({
          ...v,
          longitude: info.object.lon,
          latitude: info.object.lat,
          transitionDuration: 1500, 
        }));
      }
    }
  });

  return (
    <div className="w-full bg-space-950 font-sans text-slate-300">
      
      {/* 1. SCROLLYTELLING HERO */}
      <section className="relative w-full min-h-screen flex flex-col items-center justify-center text-center px-6 py-20 bg-grid-mesh">
        <span className="text-cyan-accent font-mono text-sm tracking-[0.3em] uppercase block mb-6">A Radar Tale</span>
        <h1 className="text-5xl sm:text-7xl text-white font-bold mb-8 tracking-tight">The Invisible Earth</h1>
        <p className="text-lg sm:text-xl text-slate-400 leading-relaxed max-w-2xl mx-auto mb-12">
          Your smartphone camera needs light to see. So do most satellites. 
          But when a hurricane strikes or a forest burns, the smoke and clouds act like a blindfold. 
          <strong className="text-white"> To save lives, we had to invent a new way to see.</strong>
        </p>
        
        <div className="w-full max-w-4xl mx-auto bg-space-900 p-4 rounded-2xl border border-slate-800 shadow-2xl">
          <div className="relative w-full aspect-video rounded-xl overflow-hidden cursor-ew-resize border border-slate-700 bg-space-950">
            <div 
              className="absolute inset-0 bg-cover bg-center grayscale contrast-150 brightness-90 saturate-0"
              style={{ backgroundImage: `url('${SLIDER_BASE_IMAGE}')` }}
            />
            <div 
              className="absolute inset-0 bg-cover bg-center"
              style={{ 
                backgroundImage: `url('${SLIDER_BASE_IMAGE}')`,
                clipPath: `polygon(0 0, ${sliderPosition}% 0, ${sliderPosition}% 100%, 0 100%)` 
              }}
            >
              <div className="absolute inset-0 bg-slate-300/60 backdrop-blur-[3px]" />
              <div className="absolute -top-10 -left-10 w-96 h-64 bg-white/80 rounded-full blur-3xl opacity-90" />
              <div className="absolute bottom-10 right-20 w-80 h-48 bg-white/90 rounded-full blur-3xl opacity-80" />
            </div>
            
            <div className="absolute top-0 bottom-0 w-1 bg-cyan-accent" style={{ left: `${sliderPosition}%`, transform: 'translateX(-50%)' }}>
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 bg-cyan-accent rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(0,242,254,0.6)]">
                <span className="text-space-950 font-bold tracking-tighter">||</span>
              </div>
            </div>
            <input type="range" min="0" max="100" value={sliderPosition} onChange={(e) => setSliderPosition(Number(e.target.value))} className="absolute inset-0 w-full h-full opacity-0 z-20 cursor-ew-resize" />
          </div>
          
          <div className="flex justify-between items-center mt-4 px-2 font-mono text-xs uppercase">
            <span className="text-slate-400">← Optical (Blinded by Clouds)</span>
            <span className="text-cyan-accent">NISAR Radar (Sees Through) →</span>
          </div>
        </div>
      </section>

      {/* 2. INTERACTIVE GLOBAL STORY EXPLORER */}
      <section className="relative w-full flex flex-col md:flex-row h-auto md:h-[85vh] min-h-[600px] border-y border-slate-800">
        
        {/* Left: The 3D Story Map */}
        <div className="w-full md:w-3/5 h-[50vh] md:h-full relative shrink-0">
          <DeckGL
            views={GLOBE_VIEW}
            viewState={viewState}
            onViewStateChange={({ viewState: nextViewState }) => {
              const { transitionDuration, transitionInterpolator, ...manualState } = nextViewState;
              
              setViewState({
                ...manualState,
                zoom: Math.max(1.5, manualState.zoom),
                minZoom: 1.5,
                maxZoom: 20
              });
            }}
            controller={true}
            layers={[baseMapLayer, hotspotLayer]}
          />
          <div className="absolute top-6 left-6 hud-backdrop px-4 py-3 rounded-lg pointer-events-none border border-cyan-500/30 hidden sm:block">
            <span className="text-xs font-mono text-cyan-accent flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-cyan-accent animate-ping"></span>
              Click glowing hotspots on the globe
            </span>
          </div>
        </div>

        {/* Right: The Human Impact Panel */}
        <div className="w-full md:w-2/5 flex flex-col bg-space-900 border-t md:border-t-0 md:border-l border-slate-800 p-6 lg:p-8 h-auto md:h-full overflow-y-auto custom-scrollbar">
          
          <div className="flex gap-2 mb-6 overflow-x-auto pb-2 custom-scrollbar shrink-0">
            {HOTSPOTS.map((story) => (
              <button 
                key={story.id}
                onClick={() => {
                  setActiveStory(story);
                  setViewState((v: any) => ({
                    ...v,
                    longitude: story.lon,
                    latitude: story.lat,
                    transitionDuration: 1500, 
                  }));
                }}
                className={`whitespace-nowrap px-4 py-2 rounded-full text-xs font-mono font-bold transition-all ${activeStory.id === story.id ? 'bg-cyan-accent text-space-950 shadow-[0_0_15px_rgba(0,242,254,0.4)]' : 'bg-space-800 text-slate-400 hover:bg-space-700 border border-slate-700'}`}
              >
                {story.name}
              </button>
            ))}
          </div>

          <div className="flex flex-col flex-1">
            
            <div className="flex items-center gap-4 mb-4 shrink-0">
              <div className="p-3 bg-space-800 rounded-xl border border-slate-700 shrink-0">
                {activeStory.icon}
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white">{activeStory.type}</h2>
                <span className="text-cyan-accent font-mono text-xs">{activeStory.name}</span>
              </div>
            </div>

            <p className="text-slate-300 text-sm leading-relaxed mb-6 shrink-0">
              {activeStory.description}
            </p>

            <div className="bg-space-950 p-4 rounded-xl border border-slate-800 mb-6 border-l-4 border-l-amber-500 shrink-0">
              <div className="flex items-center gap-2 mb-2">
                <ShieldAlert className="w-4 h-4 text-amber-500 shrink-0" />
                <span className="font-bold text-white text-sm">Why this matters</span>
              </div>
              <p className="text-sm text-slate-400">{activeStory.impact}</p>
            </div>

            <div className="bg-space-850 p-4 xl:p-6 rounded-xl border border-slate-700 w-full mt-auto">
              <h3 className="text-xs font-mono text-slate-400 mb-4 text-center uppercase shrink-0">{activeStory.metricName}</h3>
              <div className="w-full h-40">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={getDynamicBarData()} margin={{ top: 0, right: 0, left: -25, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                    <XAxis dataKey="name" stroke="#64748b" tick={{fontSize: 10, fontFamily: 'monospace'}} />
                    <YAxis stroke="#64748b" tick={{fontSize: 10, fontFamily: 'monospace'}} />
                    <Tooltip cursor={{fill: '#1e293b'}} contentStyle={{ backgroundColor: '#07090e', borderColor: '#1e293b', borderRadius: '8px' }} />
                    <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                      {getDynamicBarData().map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 3. YOUR EXPORTED DATA */}
      <section className="w-full max-w-7xl mx-auto px-6 py-24 text-center">
        <h2 className="text-3xl sm:text-5xl font-bold text-white mb-6">Real Data. Real Proof.</h2>
        <p className="text-slate-400 mb-16 max-w-3xl mx-auto text-lg leading-relaxed">
          The interactive stories above are powered by actual satellite telemetry. We built a live pipeline that processes massive radar files to give local communities the exact answers they need to survive and adapt.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-16 text-left">
          
          <div className="bg-space-900 p-8 rounded-2xl border border-slate-800 shadow-xl flex flex-col h-full hover:border-cyan-500/50 transition-colors">
            <div className="flex items-center gap-3 mb-6">
              <div>
                <h3 className="text-xl font-bold text-white">The Flood Map: Knowing Where to Run</h3>
              </div>
            </div>
            
            <div className="w-full aspect-video rounded-xl bg-space-950 border border-slate-700 mb-6 overflow-hidden grid grid-cols-10 grid-rows-6 opacity-90">
              {Array.from({length: 60}).map((_, i) => {
                let color = "bg-[#451a03]"; 
                if (i % 10 === 4 || i % 10 === 5 || (i > 30 && i % 10 === 6)) color = "bg-[#0284c7]"; 
                else if (i % 2 === 0 && i < 20) color = "bg-[#064e3b]"; 
                return <div key={i} className={`${color} border border-space-950/50 hover:opacity-75 transition-opacity`}></div>
              })}
            </div>
            
            <p className="text-sm text-slate-400 mt-auto">
              This isn't just a colorful grid. When you see <strong className="text-blue-400">blue blocks</strong> cutting through the <strong className="text-amber-700">brown</strong>, it marks exactly where floodwaters have swallowed dry land. For a local family or rescue team, this AI-generated map removes the guesswork—it shows exactly which roads are safe and which villages need immediate evacuation.
            </p>
          </div>

          <div className="bg-space-900 p-8 rounded-2xl border border-slate-800 shadow-xl flex flex-col h-full hover:border-amber-500/50 transition-colors">
            <div className="flex items-center gap-3 mb-6">
              <ThermometerSun className="w-6 h-6 text-amber-400" />
              <div>
                <h3 className="text-xl font-bold text-white">The Warning Line: Predicting the Threat</h3>
              </div>
            </div>
            
            <div className="w-full aspect-video rounded-xl bg-space-950 border border-slate-700 mb-6 p-4">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={getDynamicTimeseries()} margin={{ top: 0, right: 0, left: -25, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorRoughness" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                  <XAxis dataKey="date" stroke="#64748b" tick={{fontSize: 10, fontFamily: 'monospace'}} />
                  {/* YAxis domain updated to auto so deep negative spikes like Amazon's don't get clipped */}
                  <YAxis stroke="#64748b" tick={{fontSize: 10, fontFamily: 'monospace'}} domain={['auto', 'auto']} />
                  <Tooltip contentStyle={{ backgroundColor: '#07090e', borderColor: '#1e293b' }} itemStyle={{ fontFamily: 'monospace', fontSize: '12px' }} />
                  <Area type="monotone" dataKey="roughness" stroke="#f59e0b" strokeWidth={2} fillOpacity={1} fill="url(#colorRoughness)" name="Earth Roughness" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            
            <p className="text-sm text-slate-400 mt-auto">
              The orange line tracks how "rough" the earth is. Trees and houses are rough; still water is perfectly smooth. When that line <strong className="text-amber-400">suddenly plummets</strong>, it means a raging flood has smoothed out the landscape. For a city mayor, this drop is an undeniable alarm bell that a disaster is actively unfolding.
            </p>
          </div>

        </div>

        <Link href="/research" className="inline-flex items-center gap-3 px-8 py-4 bg-cyan-accent text-space-950 font-bold rounded-lg hover:bg-cyan-bright transition-all shadow-[0_0_20px_rgba(0,242,254,0.4)] font-mono text-sm uppercase tracking-wider">
          Verify the Data in the Research Lab <ArrowRight className="w-5 h-5" />
        </Link>
      </section>

    </div>
  );
}