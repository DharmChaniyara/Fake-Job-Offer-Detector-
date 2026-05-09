import { motion } from 'framer-motion'
import { ShieldCheck, AlertTriangle, XOctagon } from 'lucide-react'

export default function ResultDisplay({ result }) {
  if (!result) return null

  const { score, reasons, verdict } = result

  let colorClass = 'text-emerald-400'
  let bgClass = 'bg-emerald-500'
  let gradientClass = 'from-emerald-500/20 to-emerald-500/0'
  let shadowClass = 'shadow-[0_0_30px_rgba(16,185,129,0.15)]'
  let Icon = ShieldCheck
  
  if (verdict === 'Suspicious') {
    colorClass = 'text-amber-400'
    bgClass = 'bg-amber-500'
    gradientClass = 'from-amber-500/20 to-amber-500/0'
    shadowClass = 'shadow-[0_0_30px_rgba(245,158,11,0.15)]'
    Icon = AlertTriangle
  } else if (verdict === 'Scam') {
    colorClass = 'text-red-400'
    bgClass = 'bg-red-500'
    gradientClass = 'from-red-500/20 to-red-500/0'
    shadowClass = 'shadow-[0_0_30px_rgba(239,68,68,0.15)]'
    Icon = XOctagon
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`glass-panel p-8 rounded-3xl relative overflow-hidden ${shadowClass}`}
    >
      {/* Decorative background glow */}
      <div className={`absolute top-0 left-0 w-full h-32 bg-gradient-to-b ${gradientClass} opacity-50 pointer-events-none`} />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-10 relative z-10 gap-6">
        <div className="flex items-center gap-4">
          <div className={`p-3.5 rounded-2xl bg-slate-900 border border-white/5 ${colorClass}`}>
            <Icon className="w-8 h-8" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white mb-1">Threat Assessment</h3>
            <div className="flex items-center gap-2">
              <span className="text-slate-400 text-sm">Status:</span>
              <span className={`text-sm font-bold uppercase tracking-wider ${colorClass} bg-slate-950/50 px-2 py-0.5 rounded border border-white/5`}>
                {verdict}
              </span>
            </div>
          </div>
        </div>
        <div className="text-left sm:text-right bg-slate-950/40 p-4 rounded-2xl border border-white/5 min-w-[140px]">
          <div className="text-xs text-slate-500 uppercase tracking-widest font-semibold mb-1">Risk Index</div>
          <div className="flex items-baseline gap-1 sm:justify-end">
            <span className="text-4xl font-black text-white tracking-tighter">{score}</span>
            <span className="text-lg font-medium text-slate-500">/100</span>
          </div>
        </div>
      </div>

      <div className="mb-10 relative z-10">
        <div className="flex justify-between text-xs font-bold text-slate-500 mb-3 uppercase tracking-wider">
          <span>Safe Zone</span>
          <span>Critical Danger</span>
        </div>
        <div className="h-4 w-full bg-slate-950/80 rounded-full overflow-hidden border border-white/5 shadow-inner relative">
          {/* Markers */}
          <div className="absolute top-0 bottom-0 left-1/3 w-px bg-white/10 z-20" />
          <div className="absolute top-0 bottom-0 left-2/3 w-px bg-white/10 z-20" />
          
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${score}%` }}
            transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
            className={`h-full ${bgClass} relative z-10 shadow-[0_0_15px_rgba(255,255,255,0.3)_inset]`}
          >
            {/* Shimmer effect */}
            <div className="absolute top-0 inset-x-0 h-1/2 bg-white/20" />
          </motion.div>
        </div>
      </div>

      {reasons && reasons.length > 0 && (
        <div className="relative z-10">
          <h4 className="text-sm font-bold text-white mb-4 uppercase tracking-widest flex items-center gap-2">
            <span className="w-4 h-px bg-slate-700" />
            Detected Vectors
            <span className="flex-grow h-px bg-slate-800" />
          </h4>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {reasons.map((reason, idx) => (
              <motion.li 
                key={idx}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + (idx * 0.1) }}
                className="flex items-start gap-3 p-4 bg-slate-900/60 rounded-xl border border-white/5 hover:border-white/10 transition-colors"
              >
                <div className={`mt-1.5 w-2 h-2 rounded-full flex-shrink-0 ${bgClass} shadow-[0_0_8px_currentColor]`} />
                <span className="text-sm text-slate-300 leading-relaxed font-medium">{reason}</span>
              </motion.li>
            ))}
          </ul>
        </div>
      )}
    </motion.div>
  )
}
