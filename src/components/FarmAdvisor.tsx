import { useState, useEffect, useCallback, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Upload, Brain, Loader2, CheckCircle, AlertTriangle, Droplets, Sun, Cloud } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import ImprovementCharts from './ImprovementCharts';
import AmbientSounds from './AmbientSounds';
import WeatherAnalysis from './WeatherAnalysis';

// Indian States and Districts Data
const LOCATION_DATA = {
  "Punjab": ["Ludhiana", "Amritsar", "Jalandhar", "Patiala", "Bathinda", "Mohali", "Firozpur"],
  "Maharashtra": ["Mumbai", "Pune", "Nagpur", "Nashik", "Aurangabad", "Solapur", "Kolhapur"],
  "West Bengal": ["Kolkata", "Howrah", "Durgapur", "Asansol", "Siliguri", "Bardhaman", "Malda"],
  "Tamil Nadu": ["Chennai", "Coimbatore", "Madurai", "Tiruchirappalli", "Salem", "Tirunelveli", "Vellore"],
  "Karnataka": ["Bangalore", "Mysore", "Hubli", "Mangalore", "Belgaum", "Gulbarga", "Davangere"],
  "Gujarat": ["Ahmedabad", "Surat", "Vadodara", "Rajkot", "Bhavnagar", "Jamnagar", "Anand"],
  "Rajasthan": ["Jaipur", "Jodhpur", "Kota", "Bikaner", "Udaipur", "Ajmer", "Bhilwara"],
  "Haryana": ["Gurgaon", "Faridabad", "Hisar", "Panipat", "Karnal", "Ambala", "Yamunanagar"],
  "Uttar Pradesh": ["Lucknow", "Kanpur", "Agra", "Varanasi", "Meerut", "Allahabad", "Bareilly"],
  "Madhya Pradesh": ["Bhopal", "Indore", "Gwalior", "Jabalpur", "Ujjain", "Sagar", "Dewas"]
};

// Soil Types based on regions
const SOIL_TYPES = {
  "Punjab": "Loamy",
  "Maharashtra": "Black Cotton",
  "West Bengal": "Alluvial",
  "Tamil Nadu": "Red Laterite",
  "Karnataka": "Red Soil",
  "Gujarat": "Sandy Loam",
  "Rajasthan": "Sandy",
  "Haryana": "Loamy",
  "Uttar Pradesh": "Alluvial",
  "Madhya Pradesh": "Black Cotton"
};

// Weather ranges
const WEATHER_RANGES = [
  { value: "15-30", label: "15-30 Days", icon: "🌤️" },
  { value: "30-45", label: "30-45 Days", icon: "☀️" },
  { value: "45-60", label: "45-60 Days", icon: "⛅" },
  { value: "60-90", label: "60-90 Days", icon: "🌧️" }
];

// Crop recommendations
const CROP_RECOMMENDATIONS = [
  {
    name: "Wheat",
    image: "/src/assets/crop-wheat.jpg",
    suitability: 92,
    yield: "3.5 tons/acre",
    profit: "₹35,000/acre",
    sustainability: 8,
    issues: ["Monitor for rust disease", "Ensure proper drainage"]
  },
  {
    name: "Rice", 
    image: "/src/assets/crop-rice.jpg",
    suitability: 88,
    yield: "3.8 tons/acre", 
    profit: "₹38,000/acre",
    sustainability: 8,
    issues: ["Water management critical", "Watch for blast disease"]
  },
  {
    name: "Corn",
    image: "/src/assets/crop-corn.jpg", 
    suitability: 85,
    yield: "3.2 tons/acre",
    profit: "₹32,000/acre", 
    sustainability: 7,
    issues: ["Pest control needed", "Nitrogen management"]
  }
];

// Soil data per state
const SOIL_DATA = {
  "Punjab": { pH: 6.8, moisture: 45, nitrogen: 40, phosphorus: 25, potassium: 30, organic: 2.8 },
  "Maharashtra": { pH: 7.2, moisture: 38, nitrogen: 35, phosphorus: 20, potassium: 28, organic: 2.1 },
  "West Bengal": { pH: 6.5, moisture: 50, nitrogen: 42, phosphorus: 22, potassium: 33, organic: 3.2 },
  "Tamil Nadu": { pH: 7.0, moisture: 40, nitrogen: 38, phosphorus: 24, potassium: 31, organic: 2.5 },
  "Karnataka": { pH: 6.9, moisture: 42, nitrogen: 36, phosphorus: 23, potassium: 29, organic: 2.3 },
  "Gujarat": { pH: 7.8, moisture: 35, nitrogen: 32, phosphorus: 18, potassium: 25, organic: 1.9 },
  "Rajasthan": { pH: 8.1, moisture: 25, nitrogen: 28, phosphorus: 15, potassium: 22, organic: 1.5 },
  "Haryana": { pH: 7.0, moisture: 40, nitrogen: 38, phosphorus: 24, potassium: 30, organic: 2.6 },
  "Uttar Pradesh": { pH: 6.7, moisture: 48, nitrogen: 41, phosphorus: 26, potassium: 32, organic: 3.0 },
  "Madhya Pradesh": { pH: 7.1, moisture: 39, nitrogen: 34, phosphorus: 21, potassium: 27, organic: 2.2 }
};

interface FarmAdvisorProps {
  onAnalysisComplete?: () => void;
}

const FarmAdvisor = ({ onAnalysisComplete }: FarmAdvisorProps) => {
  const [selectedState, setSelectedState] = useState<string>("");
  const [selectedDistrict, setSelectedDistrict] = useState<string>("");
  const [weatherRange, setWeatherRange] = useState<string>("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [soilDetected, setSoilDetected] = useState(false);
  const [cropImage, setCropImage] = useState<File | null>(null);
  const [diseaseDetection, setDiseaseDetection] = useState<string>("");
  const [soundVariant, setSoundVariant] = useState<'nature' | 'rain' | 'wind'>('nature');
  const [backgroundVariant, setBackgroundVariant] = useState<'default' | 'rainy' | 'sunny'>('default');
  
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Auto-detect soil when district is selected
  useEffect(() => {
    if (selectedState && selectedDistrict) {
      setTimeout(() => {
        setSoilDetected(true);
        setSoundVariant('nature');
        setBackgroundVariant('default');
        playInteractionSound();
      }, 1500);
    }
  }, [selectedState, selectedDistrict]);

  const playInteractionSound = useCallback(() => {
    // This would trigger the AmbientSounds component to play a sound
    const audio = new Audio('/sounds/nature-click.mp3');
    audio.volume = 0.3;
    audio.play().catch(() => {});
  }, []);

  const handleStateChange = (state: string) => {
    setSelectedState(state);
    setSelectedDistrict("");
    setSoilDetected(false);
    playInteractionSound();
  };

  const handleDistrictChange = (district: string) => {
    setSelectedDistrict(district);
    playInteractionSound();
  };

  const handleWeatherRangeChange = (range: string) => {
    setWeatherRange(range);
    playInteractionSound();
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setCropImage(file);
      // Simulate disease detection
      setTimeout(() => {
        setDiseaseDetection("Leaf Blight - Moderate Severity - Treatment Recommended");
        playInteractionSound();
        toast({
          title: "Disease Detected",
          description: "AI analysis complete! Treatment recommendations available.",
        });
      }, 2000);
    }
  };

  const handleAnalysis = async () => {
    if (!selectedState || !selectedDistrict || !weatherRange) {
      toast({
        title: "Missing Information", 
        description: "Please select state, district, and weather range.",
        variant: "destructive"
      });
      return;
    }

    setIsAnalyzing(true);
    setAnalysisProgress(0);
    setBackgroundVariant('rainy');
    setSoundVariant('rain');

    // Simulate AI analysis with progress
    const progressInterval = setInterval(() => {
      setAnalysisProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          setTimeout(() => {
            setIsAnalyzing(false);
            setShowResults(true);
            setBackgroundVariant('sunny');
            setSoundVariant('wind');
            onAnalysisComplete?.();
            toast({
              title: "Analysis Complete!",
              description: "AI recommendations are ready for your farm.",
            });
          }, 500);
          return 100;
        }
        return prev + Math.random() * 20;
      });
    }, 300);
  };

  const detectedSoilType = selectedState ? SOIL_TYPES[selectedState as keyof typeof SOIL_TYPES] : "";
  const soilData = selectedState ? SOIL_DATA[selectedState as keyof typeof SOIL_DATA] : null;

  return (
    <div className={`min-h-screen transition-all duration-1000 ${
      backgroundVariant === 'rainy' ? 'bg-gradient-to-br from-slate-600 via-slate-500 to-slate-700' :
      backgroundVariant === 'sunny' ? 'bg-gradient-to-br from-yellow-200 via-green-200 to-blue-200' :
      'field-gradient'
    }`}>
      {/* Weather overlay effects */}
      {backgroundVariant === 'rainy' && (
        <div className="fixed inset-0 pointer-events-none">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-8 bg-blue-300/60 animate-rainfall"
              style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`
              }}
            />
          ))}
        </div>
      )}

      <AmbientSounds variant={soundVariant} />
      
      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12 animate-fade-in">
          <h1 className="text-5xl font-bold mb-4 text-primary animate-wind-sway">
            🌾 AI Farm Advisor
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Get personalized crop recommendations based on your location, soil, and weather predictions
          </p>
        </div>

        {/* Input Card */}
        <Card className="max-w-4xl mx-auto mb-8 nature-shadow animate-growth">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="w-6 h-6 text-primary" />
              Regional Analysis Setup
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* State Selection */}
              <div className="space-y-2">
                <label className="text-sm font-medium">State</label>
                <Select onValueChange={handleStateChange} value={selectedState}>
                  <SelectTrigger className="hover:border-primary/50 transition-colors">
                    <SelectValue placeholder="Select state" />
                  </SelectTrigger>
                  <SelectContent className="bg-popover border border-border shadow-lg">
                    {Object.keys(LOCATION_DATA).map((state) => (
                      <SelectItem key={state} value={state} className="hover:bg-accent">
                        {state}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* District Selection */}
              <div className="space-y-2">
                <label className="text-sm font-medium">District</label>
                <Select 
                  onValueChange={handleDistrictChange} 
                  value={selectedDistrict}
                  disabled={!selectedState}
                >
                  <SelectTrigger className="hover:border-primary/50 transition-colors">
                    <SelectValue placeholder="Select district" />
                  </SelectTrigger>
                  <SelectContent className="bg-popover border border-border shadow-lg">
                    {selectedState && LOCATION_DATA[selectedState as keyof typeof LOCATION_DATA]?.map((district) => (
                      <SelectItem key={district} value={district} className="hover:bg-accent">
                        {district}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Weather Range Selection */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Weather Forecast Range</label>
                <Select onValueChange={handleWeatherRangeChange} value={weatherRange}>
                  <SelectTrigger className="hover:border-primary/50 transition-colors">
                    <SelectValue placeholder="Select range" />
                  </SelectTrigger>
                  <SelectContent className="bg-popover border border-border shadow-lg">
                    {WEATHER_RANGES.map((range) => (
                      <SelectItem key={range.value} value={range.value} className="hover:bg-accent">
                        <span className="flex items-center gap-2">
                          <span>{range.icon}</span>
                          {range.label}
                        </span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Auto-detected Soil Type */}
            {soilDetected && detectedSoilType && (
              <div className="p-4 bg-accent/20 rounded-lg border border-accent/30 animate-growth">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span className="font-medium">Soil Type Auto-Detected</span>
                </div>
                <Badge variant="secondary" className="text-sm">
                  {detectedSoilType} Soil
                </Badge>
              </div>
            )}

            {/* Analysis Button */}
            <Button 
              onClick={handleAnalysis}
              disabled={!selectedState || !selectedDistrict || !weatherRange}
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-3 text-lg font-semibold hover:scale-[1.02] transition-transform"
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Running AI Analysis...
                </>
              ) : (
                <>
                  <Brain className="w-5 h-5 mr-2" />
                  Start AI Analysis
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* AI Analysis Loading Dialog */}
        <Dialog open={isAnalyzing} onOpenChange={() => {}}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Brain className="w-6 h-6 animate-ai-process text-primary" />
                AI Analysis in Progress
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="text-center">
                <div className="text-4xl mb-2 animate-pulse-glow">🤖</div>
                <p className="text-sm text-muted-foreground">
                  Analyzing soil conditions, weather patterns, and crop compatibility...
                </p>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Progress</span>
                  <span>{Math.round(analysisProgress)}%</span>
                </div>
                <Progress value={analysisProgress} className="h-2" />
              </div>
              <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
                <Droplets className="w-4 h-4" />
                <Sun className="w-4 h-4" />
                <Cloud className="w-4 h-4" />
                Processing environmental data...
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Results Section */}
        {showResults && soilData && (
          <div className="max-w-6xl mx-auto space-y-8 animate-fade-in">
            {/* Charts */}
            <ImprovementCharts beforeScore={65} afterScore={85} soilType={detectedSoilType} />
            
            {/* Weather Analysis */}
            <WeatherAnalysis selectedState={selectedState} />
            
            {/* Soil Analysis */}
            <Card className="nature-shadow animate-growth">
              <CardHeader>
                <CardTitle>Soil Analysis - {selectedState}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                  {Object.entries(soilData).map(([key, value]) => (
                    <div key={key} className="text-center p-3 bg-muted/30 rounded-lg hover:bg-muted/50 transition-all hover:scale-105">
                      <div className="text-2xl font-bold text-primary">
                        {value}{key === 'pH' ? '' : key === 'moisture' ? '%' : key === 'organic' ? '%' : ' ppm'}
                      </div>
                      <div className="text-xs text-muted-foreground capitalize">{key}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Crop Recommendations */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {CROP_RECOMMENDATIONS.map((crop, index) => (
                <Card key={crop.name} className="overflow-hidden nature-shadow hover:shadow-glow transition-all duration-500 animate-growth hover:scale-105 group" style={{ animationDelay: `${index * 0.2}s` }}>
                  <div className="aspect-video relative overflow-hidden">
                    <img 
                      src={crop.image} 
                      alt={crop.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent group-hover:from-black/20 transition-all duration-300" />
                    <div className="absolute top-2 right-2">
                      <Badge variant="secondary" className="bg-white/90 animate-pulse-glow">
                        {crop.suitability}% Match
                      </Badge>
                    </div>
                    <div className="absolute bottom-2 left-2 text-white font-bold text-lg drop-shadow-lg transform group-hover:translate-y-[-4px] transition-transform">
                      {crop.name}
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <div className="grid grid-cols-2 gap-3 text-sm mb-3">
                      <div className="p-2 bg-accent/20 rounded-lg hover:bg-accent/30 transition-colors">
                        <span className="text-muted-foreground">Yield:</span>
                        <div className="font-bold text-primary">{crop.yield}</div>
                      </div>
                      <div className="p-2 bg-green-50 rounded-lg hover:bg-green-100 transition-colors">
                        <span className="text-muted-foreground">Profit:</span>
                        <div className="font-bold text-green-600">{crop.profit}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 mb-3 p-2 bg-muted/20 rounded-lg">
                      <span className="text-sm text-muted-foreground">Sustainability:</span>
                      <div className="flex">
                        {[...Array(10)].map((_, i) => (
                          <div
                            key={i}
                            className={`w-2 h-2 rounded-full mx-0.5 transition-all duration-300 hover:scale-125 ${
                              i < crop.sustainability ? 'bg-green-500 animate-pulse' : 'bg-gray-200'
                            }`}
                            style={{animationDelay: `${i * 0.1}s`}}
                          />
                        ))}
                      </div>
                      <span className="text-sm font-semibold">{crop.sustainability}/10</span>
                    </div>
                    <div className="space-y-2 p-3 bg-orange-50/70 rounded-lg border border-orange-200/50 hover:bg-orange-100/70 transition-colors">
                      <div className="flex items-center gap-1">
                        <AlertTriangle className="w-4 h-4 text-orange-600" />
                        <span className="text-sm font-medium text-orange-800">Key Considerations:</span>
                      </div>
                      <ul className="text-xs space-y-1">
                        {crop.issues.map((issue, idx) => (
                          <li key={idx} className="flex items-start gap-2 hover:bg-orange-100/50 p-1 rounded transition-colors">
                            <span className="text-orange-500 mt-0.5 font-bold">•</span>
                            <span className="text-orange-700">{issue}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Farming Recommendations */}
            <Card className="nature-shadow animate-growth hover:shadow-glow transition-all duration-300">
              <CardHeader>
                <CardTitle className="animate-wind-sway">🌱 AI Farming Recommendations</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center p-6 bg-blue-50 rounded-lg hover:bg-blue-100 transition-all duration-300 hover:scale-105 group">
                  <Droplets className="w-10 h-10 text-blue-600 mx-auto mb-3 group-hover:animate-bounce" />
                  <h4 className="font-semibold text-lg mb-2">Irrigation</h4>
                  <p className="text-sm text-muted-foreground">Water twice weekly, 2-3 inches deep</p>
                  <div className="mt-2 w-full bg-blue-200 h-1 rounded-full">
                    <div className="bg-blue-600 h-1 rounded-full w-3/4 animate-pulse"></div>
                  </div>
                </div>
                <div className="text-center p-6 bg-green-50 rounded-lg hover:bg-green-100 transition-all duration-300 hover:scale-105 group">
                  <div className="text-4xl mb-3 group-hover:animate-bounce">🧪</div>
                  <h4 className="font-semibold text-lg mb-2">Fertilizer</h4>
                  <p className="text-sm text-muted-foreground">NPK 10:10:10, 50kg per acre</p>
                  <div className="mt-2 w-full bg-green-200 h-1 rounded-full">
                    <div className="bg-green-600 h-1 rounded-full w-4/5 animate-pulse"></div>
                  </div>
                </div>
                <div className="text-center p-6 bg-yellow-50 rounded-lg hover:bg-yellow-100 transition-all duration-300 hover:scale-105 group">
                  <Sun className="w-10 h-10 text-yellow-600 mx-auto mb-3 group-hover:animate-bounce" />
                  <h4 className="font-semibold text-lg mb-2">Best Planting</h4>
                  <p className="text-sm text-muted-foreground">Next 15 days optimal</p>
                  <div className="mt-2 w-full bg-yellow-200 h-1 rounded-full">
                    <div className="bg-yellow-600 h-1 rounded-full w-full animate-pulse"></div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default FarmAdvisor;