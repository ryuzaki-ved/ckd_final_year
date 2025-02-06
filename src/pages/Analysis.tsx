import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { AlgorithmProcessing } from '../components/AlgorithmProcessing';
import { AnalysisResult } from '../components/AnalysisResult';
import type { AnalysisResult as AnalysisResultType } from '../types';

interface AnalysisPageProps {
  isAnalyzing: boolean;
  result: AnalysisResultType | null;
  selectedImage: string | null;
  processingImage: string | null;
  currentFileName: string;
  onReset: () => void;
  algorithmProgress: { [key: string]: number };
  algorithmAccuracy: { [key: string]: number };
  completedAlgorithms: string[];
}

const Analysis: React.FC<AnalysisPageProps> = ({
  isAnalyzing,
  result,
  selectedImage,
  processingImage,
  currentFileName,
  onReset,
  algorithmProgress,
  algorithmAccuracy,
  completedAlgorithms,
}) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <header className="glass-effect sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center space-x-4">
            <button
              onClick={onReset}
              className="flex items-center text-gray-700 hover:text-blue-600 transition-colors"
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              Back to Upload
            </button>
            <h1 className="text-2xl font-bold text-gray-900">Analysis Results</h1>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {isAnalyzing && (
          <AlgorithmProcessing
            processingImage={processingImage}
            currentFileName={currentFileName}
            algorithmProgress={algorithmProgress}
            algorithmAccuracy={algorithmAccuracy}
            completedAlgorithms={completedAlgorithms}
          />
        )}

        {result && !isAnalyzing && (
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8">
            {selectedImage && (
              <div className="glass-effect rounded-xl p-6 hover-scale transition-all animate-glow">
                <h3 className="text-lg font-semibold mb-4">Analyzed Image</h3>
                <div className="max-w-md mx-auto">
                  <img
                    src={selectedImage}
                    alt="Analyzed tissue"
                    className="w-full h-64 object-cover rounded-lg shadow-lg transition-transform hover:scale-105"
                  />
                </div>
              </div>
            )}
            <div className={selectedImage ? 'md:col-span-1' : 'md:col-span-2'}>
              <AnalysisResult result={result} />
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Analysis;