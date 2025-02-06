import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Analysis from './pages/Analysis';
import VizAlgos from './pages/VizAlgos';
import { generateConsistentResult } from './utils/analysis';
import { ANALYSIS_ALGORITHMS } from './constants/algorithms';

function App() {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [processingImage, setProcessingImage] = useState(null);
  const [currentFileName, setCurrentFileName] = useState('');
  const [algorithmProgress, setAlgorithmProgress] = useState({});
  const [algorithmAccuracy, setAlgorithmAccuracy] = useState({});
  const [completedAlgorithms, setCompletedAlgorithms] = useState([]);
  const [showAnalysisPage, setShowAnalysisPage] = useState(false);

  const resetAnalysis = () => {
    setShowAnalysisPage(false);
    setResult(null);
    setSelectedImage(null);
    setProcessingImage(null);
    setIsAnalyzing(false);
    setCurrentFileName('');
    setAlgorithmProgress({});
    setAlgorithmAccuracy({});
    setCompletedAlgorithms([]);
  };

  const analyzeFile = async (file) => {
    setShowAnalysisPage(true);
    setIsAnalyzing(true);
    setResult(null);
    setCompletedAlgorithms([]);
    setCurrentFileName(file.name);
    
    if (file.type.startsWith('image/')) {
      const imageUrl = URL.createObjectURL(file);
      setProcessingImage(imageUrl);
      setSelectedImage(imageUrl);
    } else {
      setProcessingImage(null);
      setSelectedImage(null);
    }
  };

  return (
    <Router>
      <Routes>
        <Route path="/viz-algos" element={<VizAlgos />} />
        <Route
          path="/"
          element={
            showAnalysisPage ? (
              <Analysis
                isAnalyzing={isAnalyzing}
                result={result}
                selectedImage={selectedImage}
                processingImage={processingImage}
                currentFileName={currentFileName}
                onReset={resetAnalysis}
                algorithmProgress={algorithmProgress}
                algorithmAccuracy={algorithmAccuracy}
                completedAlgorithms={completedAlgorithms}
              />
            ) : (
              <Home onFileUpload={analyzeFile} />
            )
          }
        />
      </Routes>
    </Router>
  );
}

export default App;