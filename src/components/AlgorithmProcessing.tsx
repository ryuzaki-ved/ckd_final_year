import React from 'react';
import { Loader2, CheckCircle } from 'lucide-react';
import { ANALYSIS_ALGORITHMS } from '../constants/algorithms';

interface AlgorithmProcessingProps {
  processingImage: string | null;
  currentFileName: string;
  algorithmProgress: { [key: string]: number };
  algorithmAccuracy: { [key: string]: number };
  completedAlgorithms: string[];
}

export const AlgorithmProcessing: React.FC<AlgorithmProcessingProps> = ({
  processingImage,
  algorithmProgress,
  algorithmAccuracy,
  completedAlgorithms,
}) => {
  return (
    <div className="mt-8 glass-effect rounded-xl p-8 relative overflow-hidden animate-processing">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-100/20 to-transparent animate-scanning" />
      
      <div className="relative z-10">
        {processingImage && (
          <div className="mb-8 processing-container">
            <div className="processing-image relative rounded-lg overflow-hidden max-w-md mx-auto">
              <img
                src={processingImage}
                alt="Processing"
                className="w-full h-64 object-cover rounded-lg shadow-lg"
              />
              <div className="scanline"></div>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-400/20 to-transparent animate-scanning"></div>
            </div>
          </div>
        )}

        <h3 className="text-xl font-semibold text-gray-800 mb-6 text-center">AI Analysis in Progress</h3>
        
        <div className="max-w-2xl mx-auto space-y-6">
          {ANALYSIS_ALGORITHMS.map((algorithm) => (
            <div key={algorithm.name} className="bg-white rounded-lg p-4 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-3">
                  {React.createElement(algorithm.icon, {
                    className: `h-5 w-5 ${algorithm.color} ${
                      completedAlgorithms.includes(algorithm.name) ? '' : 'animate-pulse'
                    }`
                  })}
                  <div>
                    <h4 className="font-medium text-gray-900">{algorithm.name}</h4>
                    <p className="text-sm text-gray-500">{algorithm.description}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <span className="text-sm font-medium">
                    Accuracy: {(algorithmAccuracy[algorithm.name] * 100).toFixed(1)}%
                  </span>
                  {completedAlgorithms.includes(algorithm.name) ? (
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  ) : (
                    <Loader2 className="h-5 w-5 animate-spin text-blue-500" />
                  )}
                </div>
              </div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div 
                  className={`h-full rounded-full transition-all duration-300 ease-out ${
                    completedAlgorithms.includes(algorithm.name) ? 'bg-green-500' : 'bg-blue-500'
                  }`}
                  style={{ width: `${algorithmProgress[algorithm.name] || 0}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};