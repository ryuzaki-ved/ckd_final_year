import React, { useState, useEffect, useRef } from 'react';
import { Network, Binary, Workflow, Cpu, Database, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

interface Point {
  x: number;
  y: number;
  label?: string;
  value?: number;
  class?: number;
  velocity?: { x: number; y: number };
  size?: number;
}

const VizAlgos = () => {
  const [selectedAlgorithm, setSelectedAlgorithm] = useState<string>('dnn');
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const animationFrameRef = useRef<number>();

  const algorithms = [
    {
      id: 'dnn',
      name: 'Deep Neural Network',
      icon: Network,
      color: 'text-purple-500',
      description: 'Visualizes how a deep neural network processes tissue patterns through multiple layers of neurons.',
    },
    {
      id: 'rf',
      name: 'Random Forest',
      icon: Binary,
      color: 'text-green-500',
      description: 'Shows how multiple decision trees work together to analyze cellular structures.',
    },
    {
      id: 'svm',
      name: 'Support Vector Machine',
      icon: Workflow,
      color: 'text-blue-500',
      description: 'Demonstrates boundary detection between healthy and affected tissue regions.',
    },
    {
      id: 'ensemble',
      name: 'Ensemble Learning',
      icon: Cpu,
      color: 'text-red-500',
      description: 'Illustrates how multiple models combine their predictions for better accuracy.',
    },
    {
      id: 'feature',
      name: 'Feature Extraction',
      icon: Database,
      color: 'text-yellow-500',
      description: 'Shows the process of identifying and extracting key biomarkers from medical data.',
    },
  ];

  useEffect(() => {
    if (!canvasRef.current || !selectedAlgorithm) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const animate = () => {
      setIsAnimating(true);
      
      switch (selectedAlgorithm) {
        case 'dnn':
          animateNeuralNetwork(ctx, canvas.width, canvas.height);
          break;
        case 'rf':
          animateRandomForest(ctx, canvas.width, canvas.height);
          break;
        case 'svm':
          animateSVM(ctx, canvas.width, canvas.height);
          break;
        case 'ensemble':
          animateEnsemble(ctx, canvas.width, canvas.height);
          break;
        case 'feature':
          animateFeatureExtraction(ctx, canvas.width, canvas.height);
          break;
      }
    };

    animate();

    return () => {
      setIsAnimating(false);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [selectedAlgorithm]);

  const animateNeuralNetwork = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    let frame = 0;
    const layers = [4, 6, 6, 2];
    const neurons: Point[][] = [];
    const particleSpeed = 2;
    const particles: Point[] = [];
    
    const updateParticles = () => {
      while (particles.length < 10) {
        const startLayer = Math.floor(Math.random() * (layers.length - 1));
        const startNeuron = Math.floor(Math.random() * layers[startLayer]);
        const endLayer = startLayer + 1;
        const endNeuron = Math.floor(Math.random() * layers[endLayer]);
        
        particles.push({
          x: neurons[startLayer][startNeuron].x,
          y: neurons[startLayer][startNeuron].y,
          velocity: {
            x: (neurons[endLayer][endNeuron].x - neurons[startLayer][startNeuron].x) / 50,
            y: (neurons[endLayer][endNeuron].y - neurons[startLayer][startNeuron].y) / 50
          },
          size: Math.random() * 3 + 2
        });
      }

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.velocity!.x * particleSpeed;
        p.y += p.velocity!.y * particleSpeed;

        if (p.x > width || p.y < 0 || p.y > height) {
          particles.splice(i, 1);
        }
      }
    };
    
    const animate = () => {
      if (!isAnimating) return;
      
      ctx.clearRect(0, 0, width, height);
      
      // Create neurons
      layers.forEach((count, layerIndex) => {
        neurons[layerIndex] = [];
        const layerX = (width / (layers.length + 1)) * (layerIndex + 1);
        
        for (let i = 0; i < count; i++) {
          const neuronY = (height / (count + 1)) * (i + 1);
          neurons[layerIndex].push({ 
            x: layerX,
            y: neuronY + Math.sin(frame * 0.02 + i) * 5
          });
        }
      });

      // Draw connections with gradient
      neurons.forEach((layer, layerIndex) => {
        if (layerIndex < neurons.length - 1) {
          layer.forEach(neuron => {
            neurons[layerIndex + 1].forEach(nextNeuron => {
              const gradient = ctx.createLinearGradient(
                neuron.x, neuron.y,
                nextNeuron.x, nextNeuron.y
              );
              gradient.addColorStop(0, `hsla(${(frame + layerIndex * 30) % 360}, 70%, 60%, 0.2)`);
              gradient.addColorStop(1, `hsla(${(frame + (layerIndex + 1) * 30) % 360}, 70%, 60%, 0.2)`);
              
              ctx.beginPath();
              ctx.strokeStyle = gradient;
              ctx.moveTo(neuron.x, neuron.y);
              ctx.lineTo(nextNeuron.x, nextNeuron.y);
              ctx.stroke();
            });
          });
        }
      });

      // Update and draw particles
      updateParticles();
      particles.forEach(p => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size!, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${(frame * 2) % 360}, 70%, 60%, 0.6)`;
        ctx.fill();
      });

      // Draw neurons with glow effect
      neurons.forEach((layer, layerIndex) => {
        layer.forEach((neuron, neuronIndex) => {
          ctx.beginPath();
          ctx.arc(neuron.x, neuron.y, 10, 0, Math.PI * 2);
          const gradient = ctx.createRadialGradient(
            neuron.x, neuron.y, 0,
            neuron.x, neuron.y, 15
          );
          const hue = (frame + layerIndex * 30) % 360;
          gradient.addColorStop(0, `hsla(${hue}, 70%, 60%, 1)`);
          gradient.addColorStop(1, `hsla(${hue}, 70%, 60%, 0)`);
          ctx.fillStyle = gradient;
          ctx.fill();
        });
      });

      frame += 1;
      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animate();
  };

  const animateRandomForest = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    let frame = 0;
    const treeCount = 3;
    const trees: Point[][] = [];
    const particles: Point[] = [];
    
    const updateParticles = () => {
      while (particles.length < 15) {
        const treeIndex = Math.floor(Math.random() * treeCount);
        const tree = trees[treeIndex];
        const startNode = tree[Math.floor(Math.random() * tree.length)];
        const endNode = tree[Math.min(Math.floor(Math.random() * tree.length) + 1, tree.length - 1)];
        
        particles.push({
          x: startNode.x,
          y: startNode.y,
          velocity: {
            x: (endNode.x - startNode.x) / 30,
            y: (endNode.y - startNode.y) / 30
          },
          size: Math.random() * 3 + 1
        });
      }

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.velocity!.x;
        p.y += p.velocity!.y;

        if (p.y > height) {
          particles.splice(i, 1);
        }
      }
    };
    
    const animate = () => {
      if (!isAnimating) return;
      
      ctx.clearRect(0, 0, width, height);
      
      // Create trees
      for (let t = 0; t < treeCount; t++) {
        trees[t] = [];
        const treeX = (width / (treeCount + 1)) * (t + 1);
        let currentY = 50;
        
        const createNode = (x: number, y: number, depth: number) => {
          if (depth > 3) return;
          
          const nodeX = x + Math.sin(frame * 0.02 + depth) * (5 / (depth + 1));
          trees[t].push({ x: nodeX, y });
          
          const offset = 80 / (depth + 1);
          createNode(x - offset, y + 60, depth + 1);
          createNode(x + offset, y + 60, depth + 1);
        };
        
        createNode(treeX, currentY, 0);
      }

      // Draw connections with animated gradient
      trees.forEach(tree => {
        tree.forEach((node, index) => {
          if (index > 0) {
            const parentIndex = Math.floor((index - 1) / 2);
            const gradient = ctx.createLinearGradient(
              tree[parentIndex].x, tree[parentIndex].y,
              node.x, node.y
            );
            gradient.addColorStop(0, `hsla(120, 70%, 50%, ${0.3 + Math.sin(frame * 0.05) * 0.2})`);
            gradient.addColorStop(1, `hsla(120, 70%, 50%, ${0.1 + Math.sin(frame * 0.05 + 1) * 0.1})`);
            
            ctx.beginPath();
            ctx.strokeStyle = gradient;
            ctx.lineWidth = 2;
            ctx.moveTo(tree[parentIndex].x, tree[parentIndex].y);
            ctx.lineTo(node.x, node.y);
            ctx.stroke();
          }
        });
      });

      // Update and draw particles
      updateParticles();
      particles.forEach(p => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size!, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(120, 70%, 50%, ${0.6 + Math.sin(frame * 0.1) * 0.2})`;
        ctx.fill();
      });

      // Draw nodes with glow effect
      trees.forEach(tree => {
        tree.forEach((node, index) => {
          const gradient = ctx.createRadialGradient(
            node.x, node.y, 0,
            node.x, node.y, 12
          );
          gradient.addColorStop(0, `hsla(120, 70%, 50%, ${0.8 + Math.sin(frame * 0.05 + index) * 0.2})`);
          gradient.addColorStop(1, 'hsla(120, 70%, 50%, 0)');
          
          ctx.beginPath();
          ctx.arc(node.x, node.y, 8, 0, Math.PI * 2);
          ctx.fillStyle = gradient;
          ctx.fill();
        });
      });

      frame += 1;
      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animate();
  };

  const animateSVM = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    let frame = 0;
    const points: Point[] = [];
    const particles: Point[] = [];
    
    // Generate random points if empty
    if (points.length === 0) {
      for (let i = 0; i < 30; i++) {
        points.push({
          x: Math.random() * (width - 100) + 50,
          y: Math.random() * (height - 100) + 50,
          class: Math.random() > 0.5 ? 1 : -1,
          size: Math.random() * 2 + 4
        });
      }
    }
    
    const updateParticles = () => {
      while (particles.length < 20) {
        const angle = (frame % 360) * Math.PI / 180;
        const centerX = width / 2;
        const centerY = height / 2;
        const startX = centerX - Math.cos(angle) * 200;
        const startY = centerY - Math.sin(angle) * 200;
        
        particles.push({
          x: startX,
          y: startY,
          velocity: {
            x: Math.cos(angle + Math.PI / 2) * 2,
            y: Math.sin(angle + Math.PI / 2) * 2
          },
          size: Math.random() * 2 + 1
        });
      }

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.velocity!.x;
        p.y += p.velocity!.y;

        if (p.x < 0 || p.x > width || p.y < 0 || p.y > height) {
          particles.splice(i, 1);
        }
      }
    };
    
    const animate = () => {
      if (!isAnimating) return;
      
      ctx.clearRect(0, 0, width, height);
      
      // Draw decision boundary with gradient
      const angle = (frame % 360) * Math.PI / 180;
      const centerX = width / 2;
      const centerY = height / 2;
      
      const gradient = ctx.createLinearGradient(
        centerX - Math.cos(angle) * 200, centerY - Math.sin(angle) * 200,
        centerX + Math.cos(angle) * 200, centerY + Math.sin(angle) * 200
      );
      gradient.addColorStop(0, `hsla(210, 70%, 50%, ${0.5 + Math.sin(frame * 0.05) * 0.2})`);
      gradient.addColorStop(1, `hsla(210, 70%, 50%, ${0.3 + Math.sin(frame * 0.05) * 0.1})`);
      
      ctx.beginPath();
      ctx.moveTo(centerX - Math.cos(angle) * 200, centerY - Math.sin(angle) * 200);
      ctx.lineTo(centerX + Math.cos(angle) * 200, centerY + Math.sin(angle) * 200);
      ctx.strokeStyle = gradient;
      ctx.lineWidth = 3;
      ctx.stroke();
      
      // Draw margin lines
      ctx.beginPath();
      ctx.moveTo(centerX - Math.cos(angle) * 220, centerY - Math.sin(angle) * 220);
      ctx.lineTo(centerX + Math.cos(angle) * 220, centerY + Math.sin(angle) * 220);
      ctx.strokeStyle = 'rgba(59, 130, 246, 0.2)';
      ctx.lineWidth = 1;
      ctx.stroke();
      
      ctx.beginPath();
      ctx.moveTo(centerX - Math.cos(angle) * 180, centerY - Math.sin(angle) * 180);
      ctx.lineTo(centerX + Math.cos(angle) * 180, centerY + Math.sin(angle) * 180);
      ctx.stroke();

      // Update and draw particles
      updateParticles();
      particles.forEach(p => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size!, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(210, 70%, 50%, ${0.6 + Math.sin(frame * 0.1) * 0.2})`;
        ctx.fill();
      });
      
      // Draw points with glow effect
      points.forEach(point => {
        const gradient = ctx.createRadialGradient(
          point.x, point.y, 0,
          point.x, point.y, point.size! * 2
        );
        const hue = point.class === 1 ? 120 : 0;
        gradient.addColorStop(0, `hsla(${hue}, 70%, 50%, ${0.8 + Math.sin(frame * 0.05) * 0.2})`);
        gradient.addColorStop(1, `hsla(${hue}, 70%, 50%, 0)`);
        
        ctx.beginPath();
        ctx.arc(point.x, point.y, point.size!, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();
      });

      frame += 1;
      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animate();
  };

  const animateEnsemble = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    let frame = 0;
    const modelCount = 4;
    const predictions: Point[][] = [];
    const particles: Point[] = [];
    
    const updateParticles = () => {
      while (particles.length < 25) {
        const modelIndex = Math.floor(Math.random() * modelCount);
        const predIndex = Math.floor(Math.random() * 5);
        const startX = (width / (modelCount + 1)) * (modelIndex + 1);
        const startY = 50 + predIndex * 60;
        
        particles.push({
          x: startX,
          y: startY,
          velocity: {
            x: (width - 50 - startX) / 50,
            y: (height / 2 - startY) / 50
          },
          size: Math.random() * 2 + 1
        });
      }

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.velocity!.x;
        p.y += p.velocity!.y;

        if (p.x > width - 40) {
          particles.splice(i, 1);
        }
      }
    };
    
    const animate = () => {
      if (!isAnimating) return;
      
      ctx.clearRect(0, 0, width, height);
      
      // Generate predictions for each model
      for (let m = 0; m < modelCount; m++) {
        predictions[m] = [];
        const centerX = (width / (modelCount + 1)) * (m + 1);
        
        for (let i = 0; i < 5; i++) {
          predictions[m].push({
            x: centerX,
            y: 50 + i * 60,
            value: Math.sin((frame + m * 30) * 0.02 + i) * 0.5 + 0.5
          });
        }
      }

      // Draw connections with gradient
      ctx.lineWidth = 1;
      predictions.forEach((modelPreds, modelIndex) => {
        modelPreds.forEach((pred, predIndex) => {
          const gradient = ctx.createLinearGradient(
            pred.x, pred.y,
            width - 50, height / 2
          );
          gradient.addColorStop(0, `hsla(${modelIndex * 90}, 70%, 50%, ${0.3 + Math.sin(frame * 0.05) * 0.2})`);
          gradient.addColorStop(1, `hsla(${modelIndex * 90}, 70%, 50%, 0.1)`);
          
          ctx.beginPath();
          ctx.strokeStyle = gradient;
          ctx.moveTo(pred.x, pred.y);
          ctx.lineTo(width - 50, height / 2);
          ctx.stroke();
        });
      });

      // Update and draw particles
      updateParticles();
      particles.forEach(p => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size!, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${(frame * 2) % 360}, 70%, 50%, ${0.6 + Math.sin(frame * 0.1) * 0.2})`;
        ctx.fill();
      });

      // Draw prediction nodes with glow effect
      predictions.forEach((modelPreds, modelIndex) => {
        modelPreds.forEach((pred) => {
          const gradient = ctx.createRadialGradient(
            pred.x, pred.y, 0,
            pred.x, pred.y, 15
          );
          gradient.addColorStop(0, `hsla(${modelIndex * 90}, 70%, 50%, ${0.8 + Math.sin(frame * 0.05) * 0.2})`);
          gradient.addColorStop(1, `hsla(${modelIndex * 90}, 70%, 50%, 0)`);
          
          ctx.beginPath();
          ctx.arc(pred.x, pred.y, 10, 0, Math.PI * 2);
          ctx.fillStyle = gradient;
          ctx.fill();
        });
      });

      // Draw final prediction with special effect
      const finalGradient = ctx.createRadialGradient(
        width - 50, height / 2, 0,
        width - 50, height / 2, 25
      );
      finalGradient.addColorStop(0, `hsla(${frame % 360}, 70%, 50%, 0.8)`);
      finalGradient.addColorStop(1, `hsla(${frame % 360}, 70%, 50%, 0)`);
      
      ctx.beginPath();
      ctx.arc(width - 50, height / 2, 15, 0, Math.PI * 2);
      ctx.fillStyle = finalGradient;
      ctx.fill();

      frame += 1;
      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animate();
  };

  const animateFeatureExtraction = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    let frame = 0;
    const features = ['Texture', 'Shape', 'Size', 'Density', 'Pattern'];
    const particles: Point[] = [];
    
    const updateParticles = () => {
      while (particles.length < 20) {
        const featureIndex = Math.floor(Math.random() * features.length);
        const startX = 150;
        const startY = 100;
        const endX = 180;
        const endY = 50 + featureIndex * 40 + 15;
        
        particles.push({
          x: startX,
          y: startY,
          velocity: {
            x: (endX - startX) / 30,
            y: (endY - startY) / 30
          },
          size: Math.random() * 2 + 1
        });
      }

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.velocity!.x;
        p.y += p.velocity!.y;

        if (p.x > 300) {
          particles.splice(i, 1);
        }
      }
    };
    
    const animate = () => {
      if (!isAnimating) return;
      
      ctx.clearRect(0, 0, width, height);
      
      // Draw input image representation with pulsing effect
      const alpha = 0.1 + Math.sin(frame * 0.05) * 0.05;
      ctx.fillStyle = `rgba(59, 130, 246, ${alpha})`;
      ctx.fillRect(50, 50, 100, 100);
      
      // Draw scanning line
      const scanY = 50 + (Math.sin(frame * 0.05) * 50 + 50);
      ctx.beginPath();
      ctx.moveTo(50, scanY);
      ctx.lineTo(150, scanY);
      ctx.strokeStyle = 'rgba(59, 130, 246, 0.8)';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Update and draw particles
      updateParticles();
      particles.forEach(p => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size!, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(210, 70%, 50%, ${0.6 + Math.sin(frame * 0.1) * 0.2})`;
        ctx.fill();
      });
      
      // Draw features and their extraction
      features.forEach((feature, index) => {
        const y = 50 + index * 40;
        const phase = (frame * 0.02 + index) % (Math.PI * 2);
        
        // Draw feature name with glowing effect
        ctx.fillStyle = `rgba(0, 0, 0, ${0.7 + Math.sin(phase) * 0.3})`;
        ctx.font = '14px Arial';
        ctx.fillText(feature, 200, y + 20);
        
        // Draw extraction process
        const gradient = ctx.createLinearGradient(150, 100, 180, y + 15);
        gradient.addColorStop(0, `hsla(210, 70%, 50%, ${0.4 + Math.sin(phase) * 0.2})`);
        gradient.addColorStop(1, `hsla(210, 70%, 50%, ${0.2 + Math.sin(phase) * 0.1})`);
        
        ctx.beginPath();
        ctx.strokeStyle = gradient;
        ctx.moveTo(150, 100);
        ctx.lineTo(180, y + 15);
        ctx.stroke();
        
        // Draw feature value with animated bar
        const value = Math.sin(phase) * 0.5 + 0.5;
        const barWidth = value * 100;
        
        const barGradient = ctx.createLinearGradient(300, y + 10, 300 + barWidth, y + 10);
        barGradient.addColorStop(0, `hsla(${(value * 360)}, 70%, 50%, 0.8)`);
        barGradient.addColorStop(1, `hsla(${(value * 360)}, 70%, 50%, 0.4)`);
        
        ctx.fillStyle = barGradient;
        ctx.fillRect(300, y + 10, barWidth, 10);
      });

      frame += 1;
      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animate();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <header className="glass-effect sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center space-x-4">
            <Link to="/" className="flex items-center text-gray-700 hover:text-blue-600 transition-colors">
              <ArrowLeft className="h-5 w-5 mr-2" />
              Back to Analysis
            </Link>
            <h1 className="text-2xl font-bold text-gray-900">Algorithm Visualizations</h1>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
          {algorithms.map((algo) => (
            <button
              key={algo.id}
              onClick={() => setSelectedAlgorithm(algo.id)}
              className={`p-4 rounded-lg transition-all duration-300 ${
                selectedAlgorithm === algo.id
                  ? 'bg-white shadow-lg scale-105'
                  : 'bg-white/50 hover:bg-white hover:shadow-md'
              }`}
            >
              <div className="flex flex-col items-center text-center">
                {React.createElement(algo.icon, {
                  className ```
                  className: `h-8 w-8 ${algo.color} mb-2`,
                })}
                <h3 className="font-medium text-sm">{algo.name}</h3>
              </div>
            </button>
          ))}
        </div>

        <div className="glass-effect rounded-xl p-6">
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-2">
              {algorithms.find(a => a.id === selectedAlgorithm)?.name}
            </h2>
            <p className="text-gray-600">
              {algorithms.find(a => a.id === selectedAlgorithm)?.description}
            </p>
          </div>
          
          <div className="bg-white rounded-lg shadow-inner p-4">
            <canvas
              ref={canvasRef}
              width={800}
              height={400}
              className="w-full h-[400px] rounded-lg"
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default VizAlgos;