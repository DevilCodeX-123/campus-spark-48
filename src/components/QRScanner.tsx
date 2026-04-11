import React, { useState, useEffect } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import api from '@/utils/api';
import { toast } from 'sonner';
import { 
  Scan, X, CheckCircle, AlertCircle, 
  Keyboard, Loader2, User, Zap, 
  ShieldCheck, History, Volume2
} from 'lucide-react';

interface QRScannerProps {
  onEventSelect?: (eventId: string) => void;
}

const QRScanner: React.FC<QRScannerProps> = () => {
  const [scanResult, setScanResult] = useState<any>(null);
  const [isManual, setIsManual] = useState(false);
  const [manualCode, setManualCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [scanHistory, setScanHistory] = useState<any[]>([]);
  const [isMuted, setIsMuted] = useState(false);

  useEffect(() => {
    if (!isManual) {
      const scanner = new Html5QrcodeScanner("reader", { 
        fps: 10, 
        qrbox: { width: 250, height: 250 },
        rememberLastUsedCamera: true,
      }, false);

      scanner.render(onScanSuccess, onScanFailure);

      return () => {
        scanner.clear().catch(error => console.error("Failed to clear scanner", error));
      };
    }
  }, [isManual]);

  const playSound = (type: 'success' | 'error') => {
    if (isMuted) return;
    const audio = new Audio(type === 'success' ? '/success-beep.mp3' : '/error-beep.mp3');
    audio.play().catch(() => {});
  };

  async function onScanSuccess(decodedText: string) {
    handleCheckIn(decodedText);
  }

  function onScanFailure(error: any) {
    // console.warn(`QR error = ${error}`);
  }

  const handleCheckIn = async (code: string) => {
    setLoading(true);
    try {
      const resp = await api.post('/register/checkin', { qrCode: code });
      setScanResult({ success: true, ...resp.data });
      setScanHistory(prev => [{ ...resp.data, time: new Date().toLocaleTimeString() }, ...prev].slice(0, 10));
      playSound('success');
      toast.success('Access Granted');
    } catch (err: any) {
      setScanResult({ success: false, error: err.response?.data?.message || 'Verification Failed' });
      playSound('error');
      toast.error('Access Denied');
    } finally {
      setLoading(false);
      // Auto-clear result after 3 seconds for continuous scanning
      setTimeout(() => setScanResult(null), 3000);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 max-w-2xl mx-auto">
      <div className="bg-white dark:bg-[#0a0c12] rounded-[48px] border border-slate-100 dark:border-white/5 overflow-hidden shadow-2xl relative">
        <div className="absolute top-6 right-8 z-10">
           <button onClick={() => setIsMuted(!isMuted)} className="p-3 text-slate-400 bg-white/10 backdrop-blur-md rounded-2xl hover:text-white transition-all">
              {isMuted ? <Volume2 className="h-5 w-5 opacity-30" /> : <Volume2 className="h-5 w-5" />}
           </button>
        </div>

        {/* Scanner Viewport */}
        <div className="relative aspect-square sm:aspect-video bg-black flex items-center justify-center">
           {!isManual ? (
              <div id="reader" className="w-full h-full border-0"></div>
           ) : (
              <div className="p-12 w-full text-center space-y-8">
                 <div className="h-24 w-24 bg-white/5 rounded-[40px] flex items-center justify-center mx-auto text-blue-500 animate-pulse">
                    <Keyboard className="h-10 w-10" />
                 </div>
                 <h3 className="text-xl font-black text-white uppercase tracking-tight italic">Manual Registry Entry</h3>
                 <div className="relative max-w-sm mx-auto">
                    <input 
                      value={manualCode} 
                      onChange={e => setManualCode(e.target.value)}
                      placeholder="ENTER PROTOCOL CODE..." 
                      className="w-full py-5 px-8 rounded-3xl bg-white/5 border border-white/10 text-white font-black text-xs uppercase tracking-[0.3em] outline-none focus:border-blue-500 transition-all text-center"
                    />
                 </div>
                 <button 
                  onClick={() => handleCheckIn(manualCode)}
                  disabled={loading}
                  className="px-12 py-5 bg-blue-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-xl shadow-blue-600/20"
                 >
                    {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'EXECUTE VERIFICATION'}
                 </button>
              </div>
           )}

           {/* Feedback Overlay */}
           {scanResult && (
             <div className={`absolute inset-0 z-20 flex flex-col items-center justify-center backdrop-blur-3xl animate-in zoom-in-95 duration-300 ${scanResult.success ? 'bg-emerald-500/90' : 'bg-rose-500/90'}`}>
                {scanResult.success ? (
                  <>
                    <div className="h-32 w-32 bg-white rounded-[48px] flex items-center justify-center text-emerald-500 shadow-2xl mb-8">
                       <CheckCircle className="h-16 w-16" />
                    </div>
                    <p className="text-white font-black text-2xl uppercase tracking-tighter mb-2 italic">Entity Recognized</p>
                    <p className="text-white/80 font-bold text-xs uppercase tracking-widest mb-10">{scanResult.userName || 'ADITYA VARMA'}</p>
                    <div className="px-6 py-2 bg-white/20 rounded-full text-white text-[9px] font-black uppercase tracking-widest">{scanResult.eventName || 'TECH-SUMMIT 2026'}</div>
                  </>
                ) : (
                  <>
                    <div className="h-32 w-32 bg-white rounded-[48px] flex items-center justify-center text-rose-500 shadow-2xl mb-8 animate-bounce">
                       <AlertCircle className="h-16 w-16" />
                    </div>
                    <p className="text-white font-black text-2xl uppercase tracking-tighter mb-2 italic">Invalid Protocol</p>
                    <p className="text-white/80 font-bold text-xs uppercase tracking-widest">{scanResult.error}</p>
                  </>
                )}
             </div>
           )}
        </div>

        {/* Control Footer */}
        <div className="p-10 border-t border-slate-100 dark:border-white/5 flex items-center justify-between">
           <div className="flex items-center gap-4">
              <div className="h-10 w-10 flex items-center justify-center bg-slate-50 dark:bg-white/5 rounded-2xl text-slate-400">
                 <ShieldCheck className="h-5 w-5" />
              </div>
              <div>
                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Gateway Mode</p>
                 <p className="text-xs font-black text-slate-900 dark:text-white uppercase">Helper Instance</p>
              </div>
           </div>
           <button onClick={() => setIsManual(!isManual)} className="rounded-2xl bg-slate-950 text-white px-8 py-4 text-[10px] font-black uppercase tracking-widest hover:bg-slate-800 transition-all flex items-center gap-2 shadow-xl shadow-slate-950/20">
              {isManual ? <Scan className="h-4 w-4" /> : <Keyboard className="h-4 w-4" />} {isManual ? 'Switch Scanner' : 'Keyboard Entry'}
           </button>
        </div>
      </div>

      {/* Mini History Sidebar */}
      <div className="rounded-[40px] bg-white dark:bg-[#0a0c12] border border-slate-100 dark:border-white/5 p-10 shadow-sm">
         <div className="flex items-center justify-between mb-8">
            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2"><History className="h-4 w-4 shadow-sm shadow-blue-500/10" /> Recent Registries</h4>
            <span className="text-[9px] font-black bg-blue-50 dark:bg-blue-500/10 text-blue-600 px-3 py-1 rounded-full">{scanHistory.length} ENTITIES</span>
         </div>
         <div className="space-y-4">
            {scanHistory.map((item, i) => (
               <div key={i} className="flex items-center justify-between py-2 group">
                  <div className="flex items-center gap-4">
                     <div className="h-10 w-10 bg-slate-50 dark:bg-white/5 rounded-xl flex items-center justify-center text-slate-400 group-hover:text-blue-500 transition-all"><User className="h-5 w-5" /></div>
                     <div>
                        <p className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-tight">{item.userName || 'Anonymous Student'}</p>
                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{item.eventName || 'Verified Arrival'}</p>
                     </div>
                  </div>
                  <div className="text-right">
                     <p className="text-[10px] font-black text-emerald-500 uppercase">ACCESS GRANTED</p>
                     <p className="text-[9px] font-bold text-slate-400 uppercase mt-1 italic">{item.time}</p>
                  </div>
               </div>
            ))}
            {scanHistory.length === 0 && (
               <div className="py-12 text-center">
                  <Scan className="h-12 w-12 text-slate-200 dark:text-white/5 mx-auto mb-4" />
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest italic">Gateway Idle. Scan to begin synchronization.</p>
               </div>
            )}
         </div>
      </div>
    </div>
  );
};

export default QRScanner;
