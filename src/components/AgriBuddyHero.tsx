import { Button } from "@/components/ui/button";
import { useNavigate } from 'react-router-dom';

interface AgriBuddyHeroProps {
  onGetRecommendations?: () => void;
}

const AgriBuddyHero = ({ onGetRecommendations }: AgriBuddyHeroProps) => {
  const navigate = useNavigate();

  const handleGetRecommendations = () => {
    if (onGetRecommendations) {
      onGetRecommendations();
    } else {
      navigate('/analysis');
    }
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Video */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover z-0"
      >
        <source src="/assets/hero-video.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/40 z-10" />
      
      {/* Content */}
      <div className="relative z-20 text-center max-w-4xl mx-auto px-6">
        <h1 className="text-6xl md:text-8xl font-bold text-white mb-6 animate-fade-in">
          AgriBuddy
        </h1>
        <p className="text-xl md:text-2xl text-white/90 mb-8 animate-fade-in animation-delay-300">
          Get real-time guidance for soil, weather, and market trends.
        </p>
        <Button 
          onClick={handleGetRecommendations}
          size="lg" 
          className="bg-white/20 text-white border border-white/30 hover:bg-white/30 backdrop-blur-sm transition-all duration-300 animate-pulse-glow hover:scale-105 active:scale-95"
        >
          🌾 Get AI Recommendations
        </Button>
      </div>
    </section>
  );
};

export default AgriBuddyHero;