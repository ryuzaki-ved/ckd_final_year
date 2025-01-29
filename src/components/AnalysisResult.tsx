import React from 'react';
import { AlertTriangle, CheckCircle, XCircle, ArrowRight, Utensils, Activity } from 'lucide-react';
import type { AnalysisResult as AnalysisResultType } from '../types';

interface AnalysisResultProps {
  result: AnalysisResultType;
}

export function AnalysisResult({ result }: AnalysisResultProps) {
  const riskLevel = result.ckdProbability < 0.3 ? 'low' : result.ckdProbability < 0.7 ? 'medium' : 'high';
  
  const getRiskColor = (level: string) => {
    switch (level) {
      case 'low':
        return {
          bg: 'bg-green-100',
          text: 'text-green-800',
          hover: 'hover:bg-green-200',
          progress: 'bg-green-500'
        };
      case 'medium':
        return {
          bg: 'bg-yellow-100',
          text: 'text-yellow-800',
          hover: 'hover:bg-yellow-200',
          progress: 'bg-yellow-500'
        };
      case 'high':
        return {
          bg: 'bg-red-100',
          text: 'text-red-800',
          hover: 'hover:bg-red-200',
          progress: 'bg-red-500'
        };
      default:
        return {
          bg: 'bg-blue-100',
          text: 'text-blue-800',
          hover: 'hover:bg-blue-200',
          progress: 'bg-blue-500'
        };
    }
  };

  const riskColors = getRiskColor(riskLevel);

  return (
    <div className="space-y-6">
      <div className="glass-effect rounded-xl p-6 hover-scale transition-all">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
            Analysis Results
          </h2>
          <div className={`px-4 py-2 rounded-full transition-all duration-300 transform hover:scale-105 ${riskColors.bg} ${riskColors.text} ${riskColors.hover}`}>
            {riskLevel === 'low' && <CheckCircle className="inline-block mr-2 h-5 w-5 animate-pulse" />}
            {riskLevel === 'medium' && <AlertTriangle className="inline-block mr-2 h-5 w-5 animate-pulse" />}
            {riskLevel === 'high' && <XCircle className="inline-block mr-2 h-5 w-5 animate-pulse" />}
            {riskLevel.charAt(0).toUpperCase() + riskLevel.slice(1)} Risk
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Tissue Analysis</h3>
            <ul className="space-y-3">
              {[
                { label: 'Swelling', value: result.hasSwelling },
                { label: 'Shrinkage', value: result.hasShrinkage },
                { label: 'Pores', value: result.hasPores }
              ].map((item, index) => (
                <li key={index} className="transform transition-all duration-300 hover:translate-x-2">
                  <div className="flex items-center justify-between p-3 rounded-lg bg-white shadow-sm">
                    <span className="font-medium">{item.label}</span>
                    <div className={`flex items-center ${item.value ? 'text-red-500' : 'text-green-500'}`}>
                      <span className={`w-3 h-3 rounded-full mr-2 ${item.value ? 'bg-red-500' : 'bg-green-500'} animate-pulse`}></span>
                      {item.value ? 'Detected' : 'Not Detected'}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-4">CKD Assessment</h3>
            <div className="space-y-4">
              {[
                { label: 'Probability', value: result.ckdProbability, color: riskColors.progress },
                { label: 'Confidence', value: result.confidence, color: 'bg-blue-500' }
              ].map((item, index) => (
                <div key={index} className="bg-white rounded-lg p-4 shadow-sm transition-all duration-300 hover:shadow-md">
                  <div className="flex justify-between mb-2">
                    <span className="font-medium">{item.label}</span>
                    <span className="font-bold">{(item.value * 100).toFixed(1)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
                    <div
                      className={`h-2.5 rounded-full ${item.color} transition-all duration-1000 ease-out`}
                      style={{ 
                        width: `${item.value * 100}%`,
                        animation: 'progressAnimation 1.5s ease-out'
                      }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {result.parameters && (
          <div className="mt-6">
            <h3 className="font-semibold text-lg mb-3">Blood Test Parameters</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {result.parameters.map((param, index) => (
                <div key={index} className="bg-white rounded-lg p-4 shadow-sm transition-all duration-300 hover:shadow-md">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium">{param.name}</h4>
                      <p className="text-sm text-gray-600">{param.description}</p>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-sm ${
                      param.status === 'high' ? 'bg-red-100 text-red-800' :
                      param.status === 'low' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {param.value}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="mt-6">
          <h3 className="font-semibold text-lg mb-3">Medical Recommendations</h3>
          <ul className="space-y-3">
            {result.recommendations.map((rec, index) => (
              <li key={index} className="flex items-center p-3 bg-white rounded-lg shadow-sm transform transition-all duration-300 hover:translate-x-2">
                <ArrowRight className="h-5 w-5 text-blue-500 mr-2 flex-shrink-0" />
                <span className="text-gray-700">{rec}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {(result.dietaryRecommendations || result.lifestyleRecommendations) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {result.dietaryRecommendations && (
            <div className="glass-effect rounded-xl p-6">
              <h3 className="font-semibold text-lg mb-4 flex items-center">
                <Utensils className="h-5 w-5 mr-2 text-green-500" />
                Dietary Recommendations
              </h3>
              <ul className="space-y-3">
                {result.dietaryRecommendations.map((rec, index) => (
                  <li key={index} className="flex items-center p-3 bg-white rounded-lg shadow-sm transform transition-all duration-300 hover:translate-x-2">
                    <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                    <span className="text-gray-700">{rec}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {result.lifestyleRecommendations && (
            <div className="glass-effect rounded-xl p-6">
              <h3 className="font-semibold text-lg mb-4 flex items-center">
                <Activity className="h-5 w-5 mr-2 text-blue-500" />
                Lifestyle Recommendations
              </h3>
              <ul className="space-y-3">
                {result.lifestyleRecommendations.map((rec, index) => (
                  <li key={index} className="flex items-center p-3 bg-white rounded-lg shadow-sm transform transition-all duration-300 hover:translate-x-2">
                    <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                    <span className="text-gray-700">{rec}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}