export interface AnalysisResult {
  hasSwelling: boolean;
  hasShrinkage: boolean;
  hasPores: boolean;
  otherIssues: string[];
  ckdProbability: number;
  confidence: number;
  recommendations: string[];
  parameters?: {
    name: string;
    value: string;
    status: 'high' | 'low' | 'normal';
    description: string;
  }[];
  dietaryRecommendations?: string[];
  lifestyleRecommendations?: string[];
  isImage?: boolean;
}

export interface Patient {
  id: string;
  name: string;
  age: number;
  gender: string;
  testDate: string;
}

export interface Report {
  patient: Patient;
  analysis: AnalysisResult;
  imageUrl?: string;
  reportType: 'image' | 'document';
  timestamp: string;
}