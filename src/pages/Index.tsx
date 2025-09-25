import AgriBuddyHero from '@/components/AgriBuddyHero';

const Index = () => {
  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated crop background */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 field-gradient opacity-20" />
        <div className="absolute top-0 left-0 w-full h-full">
          {[...Array(15)].map((_, i) => (
            <div
              key={i}
              className="absolute animate-wind-sway"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                fontSize: `${1 + Math.random() * 2}rem`
              }}
            >
              🌾
            </div>
          ))}
        </div>
        {/* Flowing water effect */}
        <div className="absolute bottom-0 left-0 w-full h-20 bg-gradient-to-r from-blue-200/20 via-blue-300/30 to-blue-200/20 animate-pulse" />
      </div>
      
      <div className="relative z-10">
        <AgriBuddyHero />
      </div>
    </div>
  );
};

export default Index;
