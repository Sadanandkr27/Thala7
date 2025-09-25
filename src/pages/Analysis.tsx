import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from "@/components/ui/button";
import FarmAdvisor from '@/components/FarmAdvisor';
import DiseaseDetection from '@/components/DiseaseDetection';
import AgriBuddyFooter from '@/components/AgriBuddyFooter';

const Analysis = () => {
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);
  const [showExtraContent, setShowExtraContent] = useState(false);

  useEffect(() => {
    // Trigger animation after component mounts
    setTimeout(() => setIsVisible(true), 100);
  }, []);

  const handleAnalysisComplete = () => {
    setShowExtraContent(true);
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated farm background */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 field-gradient opacity-30" />
        <div className="absolute top-0 left-0 w-full h-full">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute animate-wind-sway"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 4}s`,
                fontSize: `${0.8 + Math.random() * 1.5}rem`
              }}
            >
              {['🌾', '🌿', '🌱', '🍃'][Math.floor(Math.random() * 4)]}
            </div>
          ))}
        </div>
        {/* Flowing water effect */}
        <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-r from-blue-200/20 via-blue-300/40 to-blue-200/20 animate-pulse opacity-50" />
        {/* Cloud shadows */}
        <div className="absolute top-0 left-0 w-full h-full">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="absolute bg-gray-200/10 rounded-full animate-wind-sway"
              style={{
                left: `${Math.random() * 80}%`,
                top: `${Math.random() * 60}%`,
                width: `${100 + Math.random() * 200}px`,
                height: `${50 + Math.random() * 100}px`,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: '8s'
              }}
            />
          ))}
        </div>
      </div>
      
      {/* Header with back navigation */}
      <div className="relative z-10 p-4">
        <div className="container mx-auto">
          <Button 
            variant="outline" 
            onClick={() => navigate('/')}
            className="mb-4 bg-white/80 backdrop-blur-sm hover:bg-white/90 transition-all hover:scale-105"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
        </div>
      </div>
      
      {/* Main content */}
      <div className={`relative z-10 transition-all duration-1000 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
      }`}>
        <FarmAdvisor onAnalysisComplete={handleAnalysisComplete} />
        
        {/* Disease Detection Section - Only show after analysis is complete */}
        {showExtraContent && (
          <div className="container mx-auto px-4 py-8 animate-slide-up">
            <DiseaseDetection />
          </div>
        )}
        
        {/* Footer - Only show after analysis is complete */}
        {showExtraContent && (
          <div className="animate-fade-in">
            <AgriBuddyFooter />
          </div>
        )}
      </div>
    </div>
  );
};

export default Analysis;