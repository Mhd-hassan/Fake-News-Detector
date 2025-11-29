import React from 'react';
import { AnalysisResult, CLASSIFICATION_COLORS, ClassificationType } from '../types';
import { RadialBarChart, RadialBar, PolarAngleAxis, ResponsiveContainer } from 'recharts';

interface ResultsSectionProps {
  result: AnalysisResult;
}

const ResultsSection: React.FC<ResultsSectionProps> = ({ result }) => {
  const color = CLASSIFICATION_COLORS[result.classification];
  
  const chartData = [
    {
      name: 'Confidence',
      value: result.confidenceScore,
      fill: color,
    }
  ];

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Top Banner Status */}
      <div 
        className="rounded-xl p-6 border-2 flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl"
        style={{ borderColor: color, backgroundColor: `${color}10` }}
      >
        <div className="text-center md:text-left">
          <h3 className="text-sm uppercase tracking-widest text-gray-400 font-bold mb-1">Classification</h3>
          <h2 className="text-4xl md:text-5xl font-black tracking-tighter" style={{ color }}>
            {result.classification}
          </h2>
          <p className="text-gray-300 mt-2 font-mono text-sm">
            Tone: <span className="font-bold text-white">{result.sentiment}</span>
          </p>
        </div>

        {/* Gauge Chart */}
        <div className="w-32 h-32 md:w-40 md:h-40 relative">
          <ResponsiveContainer width="100%" height="100%">
            <RadialBarChart 
              cx="50%" 
              cy="50%" 
              innerRadius="70%" 
              outerRadius="100%" 
              barSize={10} 
              data={chartData} 
              startAngle={90} 
              endAngle={-270}
            >
              <PolarAngleAxis type="number" domain={[0, 100]} angleAxisId={0} tick={false} />
              <RadialBar
                background
                dataKey="value"
                cornerRadius={30 / 2}
              />
            </RadialBarChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="text-2xl font-bold text-white">{result.confidenceScore}%</span>
            <span className="text-[10px] text-gray-400 uppercase">Confidence</span>
          </div>
        </div>
      </div>

      {/* Analysis Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Reasoning */}
        <div className="bg-brand-card rounded-xl p-6 border border-gray-700">
          <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-brand-warning"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
            Analysis Summary
          </h3>
          <p className="text-gray-300 leading-relaxed mb-4">
            {result.summary}
          </p>
          <div>
            <h4 className="text-sm font-semibold text-gray-400 mb-2 uppercase tracking-wider">Risk Factors</h4>
            <ul className="space-y-2">
              {result.keyRiskFactors.map((factor, idx) => (
                <li key={idx} className="flex items-start gap-2 text-sm text-gray-300">
                  <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-red-500 shrink-0"></span>
                  {factor}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Evidence & Sources */}
        <div className="bg-brand-card rounded-xl p-6 border border-gray-700">
          <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-brand-accent"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>
            Verification Sources
          </h3>
          {result.verificationSources && result.verificationSources.length > 0 ? (
            <ul className="space-y-3">
              {result.verificationSources.map((source, idx) => (
                <li key={idx} className="group">
                  <a 
                    href={source.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="block p-3 rounded-lg bg-slate-800 hover:bg-slate-700 transition-colors border border-transparent hover:border-brand-accent group-hover:shadow-lg"
                  >
                    <div className="font-semibold text-brand-accent text-sm truncate">{source.title}</div>
                    <div className="text-xs text-gray-500 truncate mt-1">{source.url}</div>
                  </a>
                </li>
              ))}
            </ul>
          ) : (
            <div className="text-center py-8 text-gray-500 italic">
              No direct verification sources found in public records.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResultsSection;