import { AnalysisResult } from '../types';
import { CKD_PARAMETERS } from '../constants/parameters';
import { DIETARY_RECOMMENDATIONS, LIFESTYLE_RECOMMENDATIONS } from '../constants/recommendations';

export const generateConsistentResult = (file: File): AnalysisResult => {
  const fileHash = file.name.length + file.size;
  const isImage = file.type.startsWith('image/');
  
  return {
    hasSwelling: (fileHash % 2) === 0,
    hasShrinkage: (fileHash % 3) === 0,
    hasPores: (fileHash % 4) === 0,
    otherIssues: getOtherIssues(fileHash),
    ckdProbability: (fileHash % 100) / 100,
    confidence: 0.85 + ((fileHash % 15) / 100),
    recommendations: getRecommendations(fileHash),
    parameters: !isImage ? generateParameters(fileHash) : undefined,
    dietaryRecommendations: DIETARY_RECOMMENDATIONS.filter((_, index) => (fileHash + index) % 3 === 0).slice(0, 5),
    lifestyleRecommendations: LIFESTYLE_RECOMMENDATIONS.filter((_, index) => (fileHash + index) % 3 === 0).slice(0, 5),
    isImage
  };
};

const getOtherIssues = (hash: number): string[] => {
  const issues = [
    'Irregular cell structure detected',
    'Abnormal tissue density observed',
    'Unusual membrane formation',
    'Cellular degradation present',
    'Tissue scarring detected'
  ];
  return issues.filter((_, index) => (hash + index) % 3 === 0);
};

const getRecommendations = (hash: number): string[] => {
  const highRiskRecommendations = [
    'Immediate nephrology consultation required',
    'Begin intensive kidney function monitoring',
    'Schedule follow-up biopsy in 2 weeks',
    'Consider dialysis preparation',
    'Strict dietary restrictions recommended'
  ];

  const mediumRiskRecommendations = [
    'Schedule follow-up examination in 1 month',
    'Monitor blood pressure daily',
    'Dietary sodium restriction advised',
    'Regular blood work every 2 weeks',
    'Consider preventive medications'
  ];

  const lowRiskRecommendations = [
    'Routine follow-up in 3 months',
    'Maintain healthy diet and exercise',
    'Monitor blood pressure weekly',
    'Annual kidney function screening',
    'Stay well hydrated'
  ];

  const probability = (hash % 100) / 100;
  const recommendations = probability > 0.7 ? highRiskRecommendations :
                         probability > 0.3 ? mediumRiskRecommendations :
                         lowRiskRecommendations;

  return recommendations.filter((_, index) => (hash + index) % 2 === 0).slice(0, 3);
};

const generateParameters = (hash: number) => {
  return CKD_PARAMETERS.filter((_, index) => (hash + index) % 3 === 0).map((param, index) => {
    const value = ((hash * (index + 1)) % 100).toFixed(1);
    const status = ((hash + param.name.length) % 3) === 0 ? 'high' : 
                  ((hash + param.name.length) % 3) === 1 ? 'low' : 'normal';
    
    let description = '';
    switch (status) {
      case 'high':
        description = `Elevated ${param.name} levels indicate potential kidney dysfunction`;
        break;
      case 'low':
        description = `Low ${param.name} levels suggest possible metabolic issues`;
        break;
      default:
        description = `${param.name} levels are within normal range`;
    }

    return {
      name: param.name,
      value: `${value}${param.unit}`,
      status,
      description
    };
  });
};