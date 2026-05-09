import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Upload, FileText, Link as LinkIcon, Loader2, LogOut, ShieldAlert, Zap } from 'lucide-react'
import axios from 'axios'
import ResultDisplay from './ResultDisplay'
import { supabase } from '../lib/supabase'

export default function Dashboard({ session }) {
  const [text, setText] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [linkResults, setLinkResults] = useState(null)
  const fileInputRef = useRef(null)

  const handleLogout = async () => {
    await supabase.auth.signOut()
  }

  const analyzeText = async (textToAnalyze) => {
    if (!textToAnalyze.trim()) return
    
    setLoading(true)
    setResult(null)
    setLinkResults(null)
    
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/analyze`, {
        text: textToAnalyze,
        userId: session?.user?.id
      })
      setResult(response.data)

      // Simple regex to find URLs
      const urlRegex = /(https?:\/\/[^\s]+)/g
      const urls = textToAnalyze.match(urlRegex)
      
      if (urls && urls.length > 0) {
        const linkResponse = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/check-links`, {
          urls
        })
        setLinkResults(linkResponse.data.results)
      }
    } catch (error) {
      console.error('Error analyzing:', error)
      alert('Failed to analyze the text. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleFileUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    setLoading(true)
    const formData = new FormData()
    formData.append('file', file)

    try {
      const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/upload-pdf`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      const extractedText = response.data.text
      setText(extractedText)
      await analyzeText(extractedText)
    } catch (error) {
      console.error('Error uploading PDF:', error)
      alert('Failed to extract text from PDF.')
      setLoading(false)
    }
    
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  return (
    <div className="min-h-screen text-slate-100 p-4 md:p-8 font-sans selection:bg-blue-500/30">
      <div className="max-w-6xl mx-auto">
        <header className="flex flex-col sm:flex-row justify-between items-center mb-8 md:mb-12 gap-6 sm:gap-0">
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-3"
          >
            <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-2 rounded-xl sm:p-2.5 shadow-lg shadow-blue-500/20">
              <ShieldAlert className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400 tracking-tight">JobGuard AI</h1>
              <p className="text-[10px] sm:text-xs text-slate-500 font-medium tracking-wider uppercase">Scam Detection Engine</p>
            </div>
          </motion.div>
          <motion.button 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white transition-all text-xs sm:text-sm font-medium w-full sm:w-auto justify-center"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </motion.button>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-5 flex flex-col"
          >
            <div className="glass-panel p-6 sm:p-8 rounded-3xl flex flex-col h-full relative overflow-hidden group">
              {/* Decorative gradient blob */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none transition-transform duration-1000 group-hover:scale-150" />
              
              <div className="flex items-center justify-between mb-6 relative z-10">
                <h2 className="text-xl font-semibold text-white flex items-center gap-3">
                  <div className="p-2 bg-blue-500/20 text-blue-400 rounded-lg">
                    <FileText className="w-5 h-5" />
                  </div>
                  Input Offer
                </h2>
                
                <div className="relative overflow-hidden rounded-full">
                  <input 
                    type="file" 
                    accept=".pdf"
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20" 
                    ref={fileInputRef}
                    onChange={handleFileUpload}
                  />
                  <button
                    disabled={loading}
                    className="flex items-center gap-2 px-4 py-2 bg-slate-800/80 hover:bg-slate-700/80 text-slate-300 text-sm font-medium rounded-full border border-white/5 transition-colors disabled:opacity-50"
                  >
                    <Upload className="w-4 h-4" />
                    Upload PDF
                  </button>
                </div>
              </div>
              
              <div className="relative flex-grow flex flex-col z-10">
                <textarea
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="Paste the job description, email body, or offer letter here..."
                  className="w-full flex-grow min-h-[200px] sm:min-h-[300px] bg-slate-950/50 border border-slate-800/80 rounded-2xl p-4 sm:p-5 text-slate-300 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 resize-none mb-6 transition-all shadow-inner custom-scrollbar"
                />

                <button
                  onClick={() => analyzeText(text)}
                  disabled={loading || !text.trim()}
                  className="w-full relative overflow-hidden group bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 disabled:from-slate-800 disabled:to-slate-800 disabled:text-slate-500 text-white font-semibold py-4 rounded-2xl transition-all shadow-lg hover:shadow-blue-500/25 flex justify-center items-center gap-2"
                >
                  <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
                  <span className="relative flex items-center gap-2">
                    {loading ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Scanning Matrix...
                      </>
                    ) : (
                      <>
                        <Zap className="w-5 h-5" />
                        Initiate Deep Scan
                      </>
                    )}
                  </span>
                </button>
              </div>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-7 flex flex-col gap-6"
          >
            <AnimatePresence mode="wait">
              {!result && !loading && (
                <motion.div 
                  key="empty"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="glass-panel p-12 rounded-3xl h-full flex flex-col items-center justify-center text-center border-dashed border-2 border-slate-700/50 min-h-[500px]"
                >
                  <div className="relative mb-8">
                    <div className="absolute inset-0 bg-blue-500/20 blur-xl rounded-full" />
                    <ShieldAlert className="w-20 h-20 text-slate-600 relative z-10" />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-200 mb-3 tracking-tight">System Ready</h3>
                  <p className="text-slate-500 max-w-sm leading-relaxed">
                    Paste text or upload a PDF document. Our AI engine will cross-reference language patterns and verify links against global threat databases.
                  </p>
                </motion.div>
              )}

              {loading && (
                <motion.div 
                  key="loading"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="glass-panel p-12 rounded-3xl h-full flex flex-col items-center justify-center text-center min-h-[500px]"
                >
                  <div className="relative mb-8">
                    <div className="absolute inset-0 bg-blue-500/30 blur-2xl rounded-full animate-pulse" />
                    <Loader2 className="w-16 h-16 text-blue-400 animate-spin relative z-10" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-200 mb-2">Analyzing Threat Vectors...</h3>
                  <p className="text-blue-400/80 text-sm animate-pulse">Running neural linguistic analysis</p>
                </motion.div>
              )}

              {result && !loading && (
                <motion.div key="results" className="space-y-6">
                  <ResultDisplay result={result} />
                  
                  {linkResults && linkResults.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                      className="glass-panel p-8 rounded-3xl"
                    >
                      <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-3">
                        <div className="p-2 bg-indigo-500/20 text-indigo-400 rounded-lg">
                          <LinkIcon className="w-5 h-5" />
                        </div>
                        URL Threat Analysis
                      </h3>
                      <ul className="space-y-3">
                        {linkResults.map((link, idx) => (
                          <motion.li 
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.4 + (idx * 0.1) }}
                            key={idx} 
                            className="flex flex-col sm:flex-row sm:items-center gap-4 p-4 bg-slate-950/40 rounded-xl border border-white/5 hover:bg-slate-900/60 transition-colors"
                          >
                            <div className="flex items-center gap-3 shrink-0">
                              <div className={`p-1.5 rounded-full ${link.safe ? 'bg-emerald-500/20' : 'bg-red-500/20'}`}>
                                <div className={`w-2.5 h-2.5 rounded-full ${link.safe ? 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]' : 'bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]'}`} />
                              </div>
                              <span className={`text-sm font-bold uppercase tracking-wider ${link.safe ? 'text-emerald-400' : 'text-red-400'}`}>
                                {link.safe ? 'Clean' : 'Malicious'}
                              </span>
                            </div>
                            <div className="h-px w-full sm:w-px sm:h-8 bg-white/10" />
                            <a href={link.url} target="_blank" rel="noopener noreferrer" className="text-sm text-slate-400 hover:text-indigo-400 truncate hover:underline transition-colors">
                              {link.url}
                            </a>
                            {link.error && <p className="text-xs text-amber-500/80 mt-1 sm:mt-0 sm:ml-auto">{link.error}</p>}
                          </motion.li>
                        ))}
                      </ul>
                    </motion.div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
