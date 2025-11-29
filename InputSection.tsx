import React, { useCallback } from 'react';
import { InputState } from '../types';

interface InputSectionProps {
  inputState: InputState;
  setInputState: React.Dispatch<React.SetStateAction<InputState>>;
  onAnalyze: () => void;
  isLoading: boolean;
}

const InputSection: React.FC<InputSectionProps> = ({ inputState, setInputState, onAnalyze, isLoading }) => {
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setInputState(prev => ({ ...prev, files: Array.from(e.target.files || []) }));
    }
  };

  const removeFile = (index: number) => {
    setInputState(prev => ({
      ...prev,
      files: prev.files.filter((_, i) => i !== index)
    }));
  };

  const hasContent = inputState.text.trim().length > 0 || inputState.url.trim().length > 0 || inputState.files.length > 0;

  return (
    <div className="bg-brand-card p-6 rounded-xl border border-gray-700 shadow-xl">
      <h2 className="text-xl font-semibold mb-4 text-gray-100 flex items-center gap-2">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-brand-accent"><polyline points="4 7 4 4 20 4 20 7"></polyline><line x1="9" y1="20" x2="15" y2="20"></line><line x1="12" y1="4" x2="12" y2="20"></line></svg>
        Analyze Content
      </h2>

      <div className="space-y-4">
        {/* Text Input */}
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-1">Text or Article Snippet</label>
          <textarea
            className="w-full bg-slate-800 border border-slate-600 rounded-lg p-3 text-white focus:ring-2 focus:ring-brand-accent focus:border-transparent transition-all placeholder-slate-500"
            rows={4}
            placeholder="Paste the news text, tweet, or claim here..."
            value={inputState.text}
            onChange={(e) => setInputState(prev => ({ ...prev, text: e.target.value }))}
          />
        </div>

        {/* URL Input */}
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-1">Source URL (Optional)</label>
          <div className="relative">
            <span className="absolute left-3 top-3 text-gray-500">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>
            </span>
            <input
              type="text"
              className="w-full bg-slate-800 border border-slate-600 rounded-lg pl-10 p-2.5 text-white focus:ring-2 focus:ring-brand-accent focus:border-transparent transition-all placeholder-slate-500"
              placeholder="https://news-site.com/article..."
              value={inputState.url}
              onChange={(e) => setInputState(prev => ({ ...prev, url: e.target.value }))}
            />
          </div>
        </div>

        {/* File Upload */}
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-1">Evidence (Images/Screenshots)</label>
          <div className="flex items-center justify-center w-full">
            <label htmlFor="dropzone-file" className="flex flex-col items-center justify-center w-full h-32 border-2 border-slate-600 border-dashed rounded-lg cursor-pointer bg-slate-800 hover:bg-slate-700 transition-colors">
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <svg className="w-8 h-8 mb-4 text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                  <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"/>
                </svg>
                <p className="text-sm text-gray-400"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                <p className="text-xs text-gray-500">PNG, JPG or WebP</p>
              </div>
              <input id="dropzone-file" type="file" className="hidden" accept="image/*" multiple onChange={handleFileChange} />
            </label>
          </div>
          
          {/* File List */}
          {inputState.files.length > 0 && (
            <div className="mt-4 grid grid-cols-2 gap-2">
              {inputState.files.map((file, idx) => (
                <div key={idx} className="flex items-center justify-between p-2 bg-slate-700 rounded text-xs text-white">
                  <span className="truncate max-w-[80%]">{file.name}</span>
                  <button onClick={() => removeFile(idx)} className="text-red-400 hover:text-red-300">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Action Button */}
        <button
          onClick={onAnalyze}
          disabled={!hasContent || isLoading}
          className={`w-full py-3 px-4 rounded-lg font-bold text-lg flex items-center justify-center gap-2 transition-all ${
            hasContent && !isLoading
              ? 'bg-brand-accent hover:bg-sky-400 text-slate-900 shadow-[0_0_20px_rgba(56,189,248,0.3)]'
              : 'bg-slate-700 text-slate-500 cursor-not-allowed'
          }`}
        >
          {isLoading ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Verifying Truth...
            </>
          ) : (
            <>
              Detect Fake News
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline></svg>
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default InputSection;