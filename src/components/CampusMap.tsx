import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '@/utils/api';
import { 
  MapPin, Search, Navigation, 
  Layers, Info, ZoomIn, ZoomOut, 
  Map as MapIcon, HelpCircle, Coffee,
  ChevronRight, Circle, Compass,
  WifiOff, Share2
} from 'lucide-react';

interface MapMarker {
  id: string;
  type: 'event' | 'gate' | 'food' | 'help';
  label: string;
  x: number; // percentage
  y: number; // percentage
  description?: string;
}

const CampusMap: React.FC<{ collegeId?: string }> = ({ collegeId }) => {
  const [zoom, setZoom] = useState(1);
  const [search, setSearch] = useState('');
  const [selectedMarker, setSelectedMarker] = useState<MapMarker | null>(null);
  const [isOffline, setIsOffline] = useState(!navigator.onLine);

  useEffect(() => {
    window.addEventListener('online', () => setIsOffline(false));
    window.addEventListener('offline', () => setIsOffline(true));
  }, []);

  const { data: mapData } = useQuery({
    queryKey: ['campus_map', collegeId],
    queryFn: () => api.get(`/maps?collegeId=${collegeId}`).then(r => r.data).catch(() => null),
  });

  const markers: MapMarker[] = [
    { id: '1', type: 'event', label: 'Main Auditorium', x: 25, y: 30, description: 'Hosting: Tech Summit 2026' },
    { id: '2', type: 'gate', label: 'North Entrance', x: 50, y: 5, description: 'Primary Access Point' },
    { id: '3', type: 'food', label: 'Student Cafeteria', x: 75, y: 60, description: 'Zone: Food & Beverages' },
    { id: '4', type: 'help', label: 'Desk B', x: 40, y: 80, description: 'Help & Registration Hub' },
    { id: '5', type: 'event', label: 'Sports Complex', x: 80, y: 20, description: 'Hosting: Inter-College Cricket' },
  ];

  const filteredMarkers = markers.filter(m => m.label.toLowerCase().includes(search.toLowerCase()));

  const getTypeStyle = (type: string) => {
    switch(type) {
      case 'event': return 'bg-blue-600 text-white ring-blue-500/30';
      case 'gate':  return 'bg-emerald-600 text-white ring-emerald-500/30';
      case 'food':  return 'bg-amber-600 text-white ring-amber-500/30';
      case 'help':  return 'bg-rose-600 text-white ring-rose-500/30';
      default:      return 'bg-slate-600 text-white';
    }
  };

  const getIcon = (type: string) => {
    switch(type) {
      case 'event': return <MapIcon className="h-4 w-4" />;
      case 'gate':  return <Navigation className="h-4 w-4 rotate-45" />;
      case 'food':  return <Coffee className="h-4 w-4" />;
      case 'help':  return <HelpCircle className="h-4 w-4" />;
      default:      return <MapPin className="h-4 w-4" />;
    }
  };

  return (
    <div className="flex flex-col lg:flex-row h-[750px] bg-white dark:bg-[#0a0c12] rounded-[48px] border border-slate-100 dark:border-white/5 overflow-hidden shadow-2xl">
      
      {/* Search Sidebar */}
      <div className="w-full lg:w-[380px] border-r border-slate-50 dark:border-white/5 flex flex-col bg-slate-50/30 dark:bg-transparent backdrop-blur-3xl">
         <div className="p-8 border-b border-slate-50 dark:border-white/5">
            <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight italic flex items-center gap-3">
               <Compass className="h-6 w-6 text-blue-600 animate-spin-slow" /> Campus Nav
            </h3>
            <div className="mt-8 relative">
               <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
               <input 
                 value={search} 
                 onChange={e => setSearch(e.target.value)}
                 placeholder="SEARCH PLACES..." 
                 className="w-full py-4.5 pl-11 pr-5 rounded-2xl bg-white dark:bg-white/5 border border-slate-100 dark:border-white/10 text-[10px] font-black uppercase tracking-widest outline-none focus:ring-1 focus:ring-blue-500 transition-all placeholder:text-slate-400" 
               />
            </div>
         </div>

         <div className="flex-1 overflow-y-auto no-scrollbar p-6 space-y-3">
            {filteredMarkers.map(m => (
               <button 
                 key={m.id} 
                 onClick={() => { setSelectedMarker(m); setZoom(1.5); }}
                 className={`w-full flex items-center justify-between p-5 rounded-[28px] border transition-all group ${selectedMarker?.id === m.id ? 'bg-blue-600 border-blue-600 text-white shadow-xl shadow-blue-500/30' : 'bg-white dark:bg-white/[0.02] border-slate-100 dark:border-white/10 text-slate-600 dark:text-slate-400 hover:bg-slate-50'}`}
               >
                  <div className="flex items-center gap-4 text-left">
                     <div className={`h-11 w-11 rounded-2xl flex items-center justify-center shadow-lg transition-transform group-hover:scale-110 ${selectedMarker?.id === m.id ? 'bg-white/20' : getTypeStyle(m.type)}`}>
                        {getIcon(m.type)}
                     </div>
                     <div>
                        <p className="text-[11px] font-black uppercase tracking-tight leading-none mb-1">{m.label}</p>
                        <p className={`text-[8.5px] font-bold uppercase tracking-widest ${selectedMarker?.id === m.id ? 'text-white/60' : 'text-slate-400'}`}>Zone: Sector 4</p>
                     </div>
                  </div>
                  <ChevronRight className={`h-4 w-4 transition-transform ${selectedMarker?.id === m.id ? 'translate-x-1' : 'opacity-20'}`} />
               </button>
            ))}
         </div>

         <div className="p-8 border-t border-slate-50 dark:border-white/5">
            {isOffline && (
               <div className="flex items-center gap-3 px-6 py-4 bg-amber-50 dark:bg-amber-500/10 border border-amber-100 dark:border-amber-500/20 rounded-2xl text-[10px] font-black text-amber-600 uppercase tracking-widest">
                  <WifiOff className="h-4 w-4" /> Offline Cache Active
               </div>
            )}
            {!isOffline && (
               <button className="w-full py-4 rounded-2xl border border-dashed border-slate-200 dark:border-white/20 text-[9px] font-black uppercase text-slate-400 hover:bg-slate-50 transition-all">Download Map for Offline</button>
            )}
         </div>
      </div>

      {/* Interactive Map Viewport */}
      <div className="flex-1 relative bg-[#f1f5f9] dark:bg-[#05060a] overflow-hidden group">
         
         {/* Map Image Canvas */}
         <div 
           className="absolute inset-0 transition-transform duration-700 ease-out flex items-center justify-center pointer-events-none"
           style={{ transform: `scale(${zoom})`, cursor: zoom > 1 ? 'grab' : 'default' }}
         >
            {/* Base Image Overlay */}
            <div className="relative w-[90%] h-[90%] rounded-[48px] shadow-[0_0_100px_rgba(37,99,235,0.05)] overflow-hidden">
               <img 
                 src={mapData?.mapImageUrl || 'https://images.unsplash.com/photo-1541339907198-e08756ebafe3?q=80&w=2070&auto=format&fit=crop'} 
                 alt="Campus Map" 
                 className="w-full h-full object-cover opacity-80 dark:opacity-40 grayscale-[0.2]"
               />
               
               {/* Zone Overlays (SVG) */}
               <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-20">
                  <path d="M 20,20 L 40,20 L 40,40 L 20,40 Z" fill="#2563eb" />
                  <path d="M 60,60 L 90,60 L 90,90 L 60,90 Z" fill="#10b981" />
               </svg>

               {/* Marker Rendering */}
               <div className="absolute inset-0 pointer-events-auto">
                  {markers.map(m => (
                    <button 
                       key={m.id}
                       onClick={(e) => { e.stopPropagation(); setSelectedMarker(m); }}
                       className={`absolute transition-all duration-500 ${selectedMarker?.id === m.id ? 'z-50' : 'z-10'}`}
                       style={{ left: `${m.x}%`, top: `${m.y}%` }}
                    >
                       <div className="relative -translate-x-1/2 -translate-y-1/2 group/marker">
                          <div className={`h-10 w-10 flex items-center justify-center rounded-2xl shadow-xl ring-4 ${getTypeStyle(m.type)} transition-transform group-hover/marker:scale-125 ${selectedMarker?.id === m.id ? 'scale-125' : ''}`}>
                             {getIcon(m.type)}
                          </div>
                          {selectedMarker?.id === m.id && <div className="absolute -inset-4 rounded-3xl bg-blue-500/20 animate-ping" />}
                       </div>
                    </button>
                  ))}
               </div>
            </div>
         </div>

         {/* Floating Map Controls */}
         <div className="absolute top-8 right-8 flex flex-col gap-3">
            <button onClick={() => setZoom(prev => Math.min(prev + 0.5, 3))} className="h-12 w-12 bg-white dark:bg-[#0a0c14] border border-slate-100 dark:border-white/10 rounded-2xl flex items-center justify-center text-slate-500 hover:text-blue-500 shadow-xl transition-all"><ZoomIn className="h-5 w-5" /></button>
            <button onClick={() => setZoom(prev => Math.max(prev - 0.5, 1))} className="h-12 w-12 bg-white dark:bg-[#0a0c14] border border-slate-100 dark:border-white/10 rounded-2xl flex items-center justify-center text-slate-500 hover:text-blue-500 shadow-xl transition-all"><ZoomOut className="h-5 w-5" /></button>
            <div className="h-0.5 w-6 bg-slate-200 dark:bg-white/10 mx-auto" />
            <button className="h-12 w-12 bg-white dark:bg-[#0a0c14] border border-slate-100 dark:border-white/10 rounded-2xl flex items-center justify-center text-slate-500 hover:text-blue-500 shadow-xl transition-all"><Layers className="h-5 w-5" /></button>
         </div>

         {/* Selection Detail Card */}
         {selectedMarker && (
            <div className="absolute bottom-10 left-10 right-10 lg:left-10 lg:right-auto lg:w-96 p-8 bg-white/70 dark:bg-[#0a0c14]/70 backdrop-blur-3xl rounded-[40px] border border-white/20 dark:border-white/5 shadow-[0_32px_128px_rgba(0,0,0,0.1)] animate-in slide-in-from-bottom-5 duration-500">
               <div className="flex justify-between items-start mb-6">
                  <div className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest ${getTypeStyle(selectedMarker.type)} bg-opacity-10 ring-0`}>
                     {selectedMarker.type} POINT
                  </div>
                  <div className="flex gap-2">
                     <button className="p-2 text-slate-400 hover:text-blue-600 transition-colors"><Info className="h-4 w-4" /></button>
                     <button className="p-2 text-slate-400 hover:text-rose-500 transition-colors" onClick={() => setSelectedMarker(null)}><X className="h-4 w-4" /></button>
                  </div>
               </div>
               <h4 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tighter mb-2 italic">{selectedMarker.label}</h4>
               <p className="text-xs font-medium text-slate-500 dark:text-slate-400 leading-relaxed mb-10">{selectedMarker.description}</p>
               
               <div className="flex gap-3">
                  <button className="flex-1 py-4 bg-blue-600 text-white rounded-[20px] text-[10px] font-black uppercase tracking-widest shadow-2xl shadow-blue-500/30 hover:bg-blue-500 transition-all flex items-center justify-center gap-2">
                     <Navigation className="h-4 w-4" /> Start Route
                  </button>
                  <button className="h-14 w-14 bg-slate-100 dark:bg-white/5 rounded-[20px] flex items-center justify-center text-slate-500 hover:text-blue-500 transition-colors">
                     <Share2 className="h-5 w-5" />
                  </button>
               </div>
            </div>
         )}

         {/* Status Indicators */}
         <div className="absolute bottom-10 right-10 flex items-center gap-3">
            <div className="flex items-center gap-2 px-5 py-2.5 bg-black/80 backdrop-blur-md rounded-2xl text-[9px] font-black text-white uppercase tracking-widest">
               <Circle className="h-1.5 w-1.5 fill-emerald-500 text-emerald-500 animate-pulse" /> Simulated Position Active
            </div>
         </div>
      </div>
    </div>
  );
};

export default CampusMap;
