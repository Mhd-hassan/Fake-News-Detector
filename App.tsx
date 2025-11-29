import React, { useState } from 'react';
import { AnalysisResult, AnalysisStatus, InputState } from './types';
import { analyzeContent } from './services/geminiService';
import InputSection from './components/InputSection';
import ResultsSection from './components/ResultsSection';

const App: React.FC = () => {
  const [inputState, setInputState] = useState<InputState>({
    text: '',
    url: '',
    files: []
  });

  const [status, setStatus] = useState<AnalysisStatus>(AnalysisStatus.IDLE);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async () => {
    setStatus(AnalysisStatus.ANALYZING);
    setError(null);
    setResult(null);

    try {
      const data = await analyzeContent(inputState.text, inputState.url, inputState.files);
      setResult(data);
      setStatus(AnalysisStatus.COMPLETED);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "An unexpected error occurred during analysis.");
      setStatus(AnalysisStatus.ERROR);
    }
  };

  return (
    <div className="min-h-screen bg-brand-dark text-slate-200 font-sans selection:bg-brand-accent selection:text-brand-dark">
      {/* Header */}
      <header className="border-b border-gray-800 bg-brand-dark/95 backdrop-blur sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-brand-accent to-blue-600 rounded-lg flex items-center justify-center shadow-lg shadow-blue-500/20">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-white"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
            </div>
            <div>
              <h1 className="text-xl font-bold text-white tracking-tight">Veritas <span className="text-brand-accent">AI</span></h1>
              <p className="text-xs text-gray-500 font-mono">NEURAL FAKE NEWS DETECTOR</p>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-4 text-sm font-medium text-gray-400">
            <span>Text</span>
            <span>Image</span>
            <span>Fact Check</span>
            <div className="h-4 w-px bg-gray-700"></div>
            <span className="text-brand-accent">v1.0.0</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-4 py-8 md:py-12 space-y-8">
        
        {/* Intro */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-4">
            Is it <span className="text-brand-success">Real</span> or is it <span className="text-brand-danger">Fake?</span>
          </h2>
          <p className="text-gray-400 text-lg">
            Use our advanced multi-modal AI to cross-reference articles, detect image manipulation, and analyze sentiment in real-time.
          </p>
        </div>

        {/* Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Input Column */}
          <div className="lg:col-span-5 space-y-6">
            <InputSection 
              inputState={inputState}
              setInputState={setInputState}
              onAnalyze={handleAnalyze}
              isLoading={status === AnalysisStatus.ANALYZING}
            />
            
            {/* Disclaimer */}
            <div className="p-4 bg-slate-900/50 border border-slate-800 rounded-lg text-xs text-gray-500">
              <p className="font-semibold mb-1 text-gray-400">Privacy Notice:</p>
              Files are processed in-memory for immediate analysis. We verify facts using public Google Search data. No data is stored permanently.
            </div>
          </div>

          {/* Result Column */}
          <div className="lg:col-span-7">
            {status === AnalysisStatus.ERROR && (
              <div className="p-8 bg-brand-card border border-red-500/30 rounded-xl shadow-2xl relative overflow-hidden animate-fadeIn">
                 <div className="absolute top-0 right-0 p-4 opacity-10">
                    <svg xmlns="http://www.w3.org/2000/svg" width="120" height="120" viewBox="0 0 24 24" fill="currentColor" className="text-red-500"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/></svg>
                 </div>
                 <div className="relative z-10 flex flex-col items-center text-center space-y-4">
                    <div className="w-16 h-16 rounded-full bg-red-900/50 flex items-center justify-center border border-red-500/50">
                      <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-red-400"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-red-400">Analysis Failed</h3>
                      <p className="text-gray-300 mt-2 max-w-sm mx-auto">{error}</p>
                    </div>
                    <button 
                      onClick={handleAnalyze} 
                      className="mt-4 px-6 py-2 bg-red-600/20 hover:bg-red-600/30 text-red-300 border border-red-500/30 rounded-lg transition-colors text-sm font-semibold"
                    >
                      Retry Analysis
                    </button>
                 </div>
              </div>
            )}

            {status === AnalysisStatus.COMPLETED && result && (
              <ResultsSection result={result} />
            )}

            {status === AnalysisStatus.IDLE && (
              <div className="h-full min-h-[400px] flex flex-col items-center justify-center text-gray-600 border-2 border-dashed border-gray-800 rounded-xl p-8 text-center bg-brand-card/30">
                <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mb-4 opacity-50">
                  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline></svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-500">Ready to Analyze</h3>
                <p className="max-w-xs mt-2 text-sm">
                  Enter a URL, paste text, or upload a screenshot to begin the forensic analysis.
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;