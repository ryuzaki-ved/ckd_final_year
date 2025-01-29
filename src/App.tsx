import React, { useState, useEffect } from 'react';
import { FileUpload } from './components/FileUpload';
import { AnalysisResult } from './components/AnalysisResult';
import { 
  Microscope, FileText, Loader2, Activity, Brain, FlaskRound, 
  Scan, Dna, Zap, Search, FileSearch, CircleDot, Quote,
  Network, Binary, Workflow, Cpu, Database, CheckCircle 
} from 'lucide-react';
import type { AnalysisResult as AnalysisResultType } from './types';

// ... (keep all the existing constants)

const generateParameters = (hash: number) => {
  const CKD_PARAMETERS = [
    { name: 'Blood Pressure (BP)', shortForm: 'bp', unit: 'mmHg' },
    { name: 'Specific Gravity (SG)', shortForm: 'sg', unit: '' },
    { name: 'Albumin (AL)', shortForm: 'al', unit: 'g/dL' },
    { name: 'Blood Glucose Random (BGR)', shortForm: 'bgr', unit: 'mg/dL' },
    { name: 'Blood Urea (BU)', shortForm: 'bu', unit: 'mg/dL' },
    { name: 'Serum Creatinine (SC)', shortForm: 'sc', unit: 'mg/dL' },
    { name: 'Sodium (SOD)', shortForm: 'sod', unit: 'mEq/L' },
    { name: 'Potassium (POT)', shortForm: 'pot', unit: 'mEq/L' },
    { name: 'Hemoglobin (HEMO)', shortForm: 'hemo', unit: 'g/dL' },
    { name: 'Packed Cell Volume (PCV)', shortForm: 'pcv', unit: '%' },
    { name: 'White Blood Cells (WC)', shortForm: 'wc', unit: '/cu.mm' },
    { name: 'Red Blood Cells Count (RC)', shortForm: 'rc', unit: 'millions/cu.mm' }
  ];

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

const generateConsistentResult = (file: File): AnalysisResultType => {
  const fileHash = file.name.length + file.size;
  const isImage = file.type.startsWith('image/');
  
  const DIETARY_RECOMMENDATIONS = [
    'Limit sodium intake to less than 2,300mg per day',
    'Reduce protein intake to 0.8g per kg of body weight',
    'Choose foods low in phosphorus',
    'Limit potassium-rich foods',
    'Increase intake of anti-inflammatory foods',
    'Stay hydrated with appropriate fluid intake',
    'Avoid processed and packaged foods',
    'Include omega-3 rich foods in diet',
    'Choose whole grains over refined grains',
    'Monitor calcium intake carefully'
  ];

  const LIFESTYLE_RECOMMENDATIONS = [
    'Maintain regular physical activity with doctor\'s approval',
    'Get adequate sleep (7-8 hours per night)',
    'Monitor blood pressure regularly',
    'Avoid smoking and limit alcohol consumption',
    'Practice stress management techniques',
    'Keep a food and symptom diary',
    'Attend all scheduled medical appointments',
    'Join a kidney disease support group',
    'Learn about kidney-friendly cooking methods',
    'Take prescribed medications consistently'
  ];
  
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

// ... (keep all the existing component code)

export default App;