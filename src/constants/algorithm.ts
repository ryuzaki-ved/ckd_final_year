import { Network, Binary, Workflow, Cpu, Database } from 'lucide-react';

export const ANALYSIS_ALGORITHMS = [
  {
    name: "Deep Neural Network Analysis",
    description: "Processing tissue patterns through CNN",
    duration: 16000,
    icon: Network,
    color: "text-purple-500",
    baseAccuracy: 0.97
  },
  {
    name: "Random Forest Classification",
    description: "Analyzing cellular structures",
    duration: 13000,
    icon: Binary,
    color: "text-green-500",
    baseAccuracy: 0.93
  },
  {
    name: "Support Vector Machine",
    description: "Boundary detection and segmentation",
    duration: 14000,
    icon: Workflow,
    color: "text-blue-500",
    baseAccuracy: 0.91
  },
  {
    name: "Ensemble Learning Model",
    description: "Combining multiple predictions",
    duration: 15000,
    icon: Cpu,
    color: "text-red-500",
    baseAccuracy: 0.95
  },
  {
    name: "Feature Extraction Pipeline",
    description: "Extracting key biomarkers",
    duration: 12000,
    icon: Database,
    color: "text-yellow-500",
    baseAccuracy: 0.89
  }
];