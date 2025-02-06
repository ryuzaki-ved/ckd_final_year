import React, { useState, useEffect } from 'react';
import { Quote } from 'lucide-react';
import { INSPIRATIONAL_QUOTES } from '../constants/quotes';

export const QuoteDisplay: React.FC = () => {
  const [currentQuote, setCurrentQuote] = useState(0);

  useEffect(() => {
    const quoteInterval = setInterval(() => {
      setCurrentQuote(prev => (prev + 1) % INSPIRATIONAL_QUOTES.length);
    }, 5000);

    return () => clearInterval(quoteInterval);
  }, []);

  return (
    <div className="mt-12">
      <div className="glass-effect rounded-xl p-6 text-center max-w-2xl mx-auto">
        <Quote className="h-6 w-6 text-blue-500 mx-auto mb-4" />
        <div key={currentQuote} className="quotes-transition">
          <p className="text-lg text-gray-700 italic mb-2">
            "{INSPIRATIONAL_QUOTES[currentQuote].text}"
          </p>
          <p className="text-sm text-gray-500">
            - {INSPIRATIONAL_QUOTES[currentQuote].author}
          </p>
        </div>
      </div>
    </div>
  );
};