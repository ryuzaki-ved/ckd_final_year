import React from 'react';
import { Link } from 'react-router-dom';
import { Microscope, FileText, Activity, Brain, FlaskRound } from 'lucide-react';
import { FileUpload } from '../components/FileUpload';
import { QuoteDisplay } from '../components/QuoteDisplay';

const Home: React.FC<{
  onFileUpload: (file: File) => void;
}> = ({ onFileUpload }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 animate-gradient-x">
      <header className="glass-effect sticky top-0 z-40 shadow-sm animate-glow">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Microscope className="h-8 w-8 text-blue-600 animate-float" />
              <h1 className="text-2xl font-bold text-gray-900">KidneyAI Analysis System</h1>
            </div>
            <div className="flex items-center space-x-6">
              <div className="relative group">
                <Link to="/viz-algos" className="text-gray-700 hover:text-blue-600 transition-colors">
                  Viz Algos
                </Link>
                <div className="absolute left-1/2 transform -translate-x-1/2 -bottom-12 hidden group-hover:block bg-black text-white text-sm py-1 px-2 rounded whitespace-nowrap">
                  Visualization of Algorithms
                </div>
              </div>
              <div className="flex space-x-4">
                <Activity className="h-6 w-6 text-green-500 animate-pulse" />
                <Brain className="h-6 w-6 text-blue-500 animate-pulse" />
                <FlaskRound className="h-6 w-6 text-purple-500 animate-pulse" />
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="hover-scale transition-all">
            <div className="glass-effect rounded-xl p-6 h-full animate-glow">
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <Microscope className="h-6 w-6 text-blue-600 mr-2" />
                Tissue Image Analysis
              </h2>
              <FileUpload
                onFileUpload={onFileUpload}
                acceptedTypes={['image/*']}
                title="Upload Tissue Image"
                description="Drop a tissue image or click to browse"
              />
            </div>
          </div>

          <div className="hover-scale transition-all">
            <div className="glass-effect rounded-xl p-6 h-full animate-glow">
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <FileText className="h-6 w-6 text-blue-600 mr-2" />
                Medical Report Analysis
              </h2>
              <FileUpload
                onFileUpload={onFileUpload}
                acceptedTypes={['.csv', '.xlsx', '.pdf']}
                title="Upload Medical Report"
                description="Drop a report file (CSV, XLSX, or PDF) or click to browse"
              />
            </div>
          </div>
        </div>

        <QuoteDisplay />
      </main>
    </div>
  );
};

export default Home;