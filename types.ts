export enum AnalysisStatus {
  IDLE = 'IDLE',
  ANALYZING = 'ANALYZING',
  COMPLETED = 'COMPLETED',
  ERROR = 'ERROR'
}

export enum ClassificationType {
  REAL = 'REAL',
  FAKE = 'FAKE',
  SATIRE = 'SATIRE',
  MISLEADING = 'MISLEADING',
  UNVERIFIABLE = 'UNVERIFIABLE'
}

export interface FactCheckSource {
  title: string;
  url: string;
}

export interface AnalysisResult {
  classification: ClassificationType;
  confidenceScore: number; // 0-100
  summary: string;
  keyRiskFactors: string[];
  verificationSources: FactCheckSource[];
  sentiment: 'Neutral' | 'Alarmist' | 'Biased' | 'Objective';
}

export interface InputState {
  text: string;
  url: string;
  files: File[];
}

export const CLASSIFICATION_COLORS = {
  [ClassificationType.REAL]: '#22c55e', // Green
  [ClassificationType.FAKE]: '#ef4444', // Red
  [ClassificationType.SATIRE]: '#a855f7', // Purple
  [ClassificationType.MISLEADING]: '#f59e0b', // Orange
  [ClassificationType.UNVERIFIABLE]: '#64748b', // Slate
};