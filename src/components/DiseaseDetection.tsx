import { useState, useRef, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Upload, Camera, AlertTriangle, CheckCircle, Loader2, Scan } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Progress } from "@/components/ui/progress";

const DiseaseDetection = () => {
  const [cropImage, setCropImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [diseaseResult, setDiseaseResult] = useState<{
    disease: string;
    severity: string;
    confidence: number;
    treatment: string;
    prevention: string[];
  } | null>(null);
  
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const playInteractionSound = useCallback(() => {
    const audio = new Audio('/sounds/nature-click.mp3');
    audio.volume = 0.3;
    audio.play().catch(() => {});
  }, []);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setCropImage(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
      setDiseaseResult(null);
      playInteractionSound();
    }
  };

  const analyzeDisease = async () => {
    if (!cropImage) {
      toast({
        title: "No Image Selected",
        description: "Please upload a crop image first.",
        variant: "destructive"
      });
      return;
    }

    setIsAnalyzing(true);
    setAnalysisProgress(0);
    playInteractionSound();

    // Simulate AI analysis with progress
    const progressInterval = setInterval(() => {
      setAnalysisProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          // Mock disease detection results
          const diseases = [
            {
              disease: "Leaf Blight",
              severity: "Moderate",
              confidence: 89,
              treatment: "Apply copper-based fungicide every 7-10 days",
              prevention: ["Ensure proper air circulation", "Avoid overhead watering", "Remove infected leaves immediately"]
            },
            {
              disease: "Powdery Mildew",
              severity: "Mild",
              confidence: 76,
              treatment: "Spray with neem oil or sulfur-based fungicide",
              prevention: ["Maintain proper spacing between plants", "Water at soil level", "Apply preventive treatments weekly"]
            },
            {
              disease: "Bacterial Spot",
              severity: "Severe",
              confidence: 94,
              treatment: "Apply copper hydroxide spray immediately",
              prevention: ["Use disease-free seeds", "Practice crop rotation", "Disinfect tools regularly"]
            }
          ];

          setTimeout(() => {
            setIsAnalyzing(false);
            setDiseaseResult(diseases[Math.floor(Math.random() * diseases.length)]);
            toast({
              title: "Analysis Complete!",
              description: "Disease detection results are ready.",
            });
          }, 500);
          return 100;
        }
        return prev + Math.random() * 25;
      });
    }, 200);
  };

  const getSeverityColor = (severity: string) => {
    switch (severity.toLowerCase()) {
      case 'mild': return 'bg-green-100 text-green-800';
      case 'moderate': return 'bg-yellow-100 text-yellow-800';
      case 'severe': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Card className="nature-shadow animate-growth">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Camera className="w-6 h-6 text-primary" />
            🔬 AI Disease Detection
          </CardTitle>
          <p className="text-muted-foreground">
            Upload a photo of your crop leaves to detect diseases and get treatment recommendations
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Image Upload Section */}
          <div className="space-y-4">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Button 
                variant="outline" 
                onClick={() => fileInputRef.current?.click()}
                className="h-32 border-2 border-dashed border-primary/30 hover:border-primary/60 transition-all hover:scale-105"
                disabled={isAnalyzing}
              >
                <div className="text-center">
                  <Upload className="w-8 h-8 mx-auto mb-2 text-primary" />
                  <span className="text-sm font-medium">Upload Crop Image</span>
                  <p className="text-xs text-muted-foreground mt-1">JPG, PNG up to 10MB</p>
                </div>
              </Button>

              {imagePreview && (
                <div className="relative">
                  <img 
                    src={imagePreview} 
                    alt="Crop preview"
                    className="w-full h-32 object-cover rounded-lg border-2 border-accent/50"
                  />
                  <Badge className="absolute top-2 right-2 bg-white/90 text-primary">
                    ✓ Ready for Analysis
                  </Badge>
                </div>
              )}
            </div>

            {cropImage && !isAnalyzing && !diseaseResult && (
              <Button 
                onClick={analyzeDisease}
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-3 text-lg font-semibold hover:scale-[1.02] transition-transform"
              >
                <Scan className="w-5 h-5 mr-2" />
                🔍 Analyze for Diseases
              </Button>
            )}
          </div>

          {/* Analysis Progress */}
          {isAnalyzing && (
            <Card className="bg-muted/30 animate-pulse-glow">
              <CardContent className="p-4">
                <div className="text-center space-y-3">
                  <div className="flex justify-center">
                    <Loader2 className="w-8 h-8 animate-spin text-primary" />
                  </div>
                  <p className="font-medium">AI Disease Detection in Progress...</p>
                  <p className="text-sm text-muted-foreground">Analyzing leaf patterns, spots, and discoloration</p>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Analysis Progress</span>
                      <span>{Math.round(analysisProgress)}%</span>
                    </div>
                    <Progress value={analysisProgress} className="h-2" />
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Disease Results */}
          {diseaseResult && (
            <Card className="border-2 border-primary/20 animate-growth">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="w-6 h-6 text-orange-600" />
                  Disease Detection Results
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-muted/20 rounded-lg">
                    <p className="text-sm text-muted-foreground mb-1">Disease Identified</p>
                    <p className="font-bold text-lg text-primary">{diseaseResult.disease}</p>
                  </div>
                  <div className="text-center p-4 bg-muted/20 rounded-lg">
                    <p className="text-sm text-muted-foreground mb-1">Severity Level</p>
                    <Badge className={getSeverityColor(diseaseResult.severity)}>
                      {diseaseResult.severity}
                    </Badge>
                  </div>
                  <div className="text-center p-4 bg-muted/20 rounded-lg">
                    <p className="text-sm text-muted-foreground mb-1">AI Confidence</p>
                    <p className="font-bold text-lg text-green-600">{diseaseResult.confidence}%</p>
                  </div>
                </div>

                {/* Treatment Recommendation */}
                <Card className="bg-blue-50/50 border border-blue-200/50">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <CheckCircle className="w-5 h-5 text-blue-600" />
                      💊 Treatment Recommendation
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-blue-800">{diseaseResult.treatment}</p>
                  </CardContent>
                </Card>

                {/* Prevention Tips */}
                <Card className="bg-green-50/50 border border-green-200/50">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      🛡️ Prevention Tips
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {diseaseResult.prevention.map((tip, index) => (
                        <li key={index} className="flex items-start gap-2 text-green-800">
                          <span className="text-green-500 mt-1">•</span>
                          {tip}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default DiseaseDetection;