import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface CropRecommendation {
  name: string;
  yield: number;
  profit: number;
  sustainability: number;
  icon: string;
}

const CROP_RECOMMENDATIONS: Record<string, CropRecommendation[]> = {
  Punjab: [
    { name: "Wheat", yield: 3.5, profit: 35000, sustainability: 8, icon: "🌾" },
    { name: "Mustard", yield: 2.0, profit: 22000, sustainability: 7, icon: "🌻" }
  ],
  Maharashtra: [
    { name: "Sugarcane", yield: 4.2, profit: 45000, sustainability: 6, icon: "🎋" },
    { name: "Cotton", yield: 1.8, profit: 28000, sustainability: 7, icon: "🌿" }
  ],
  "West Bengal": [
    { name: "Rice", yield: 3.8, profit: 38000, sustainability: 8, icon: "🌾" },
    { name: "Potato", yield: 2.5, profit: 25000, sustainability: 6, icon: "🥔" }
  ],
  "Tamil Nadu": [
    { name: "Maize", yield: 3.0, profit: 30000, sustainability: 7, icon: "🌽" },
    { name: "Groundnut", yield: 2.2, profit: 24000, sustainability: 7, icon: "🥜" }
  ]
};

interface AIRecommendationsProps {
  selectedRegion: string | null;
}

const AIRecommendations = ({ selectedRegion }: AIRecommendationsProps) => {
  if (!selectedRegion) return null;
  
  const recommendations = CROP_RECOMMENDATIONS[selectedRegion] || [];

  return (
    <section className="py-16 px-6 bg-background">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12">AI Crop Recommendations</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {recommendations.map((crop, index) => (
            <Card 
              key={crop.name} 
              className="hover:shadow-lg transition-all duration-300 hover:scale-105 animate-fade-in group"
              style={{ animationDelay: `${index * 150}ms` }}
            >
              <CardHeader className="text-center pb-4">
                <div className="text-4xl mb-2 group-hover:scale-110 transition-transform">
                  {crop.icon}
                </div>
                <CardTitle className="text-xl">{crop.name}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 gap-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Yield</span>
                    <Badge variant="secondary">{crop.yield} tons/acre</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Profit</span>
                    <Badge variant="default" className="bg-green-600 hover:bg-green-700">
                      ₹{crop.profit.toLocaleString()}/acre
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Sustainability</span>
                    <div className="flex items-center gap-2">
                      <div className="flex">
                        {[...Array(10)].map((_, i) => (
                          <span
                            key={i}
                            className={`text-xs ${
                              i < crop.sustainability 
                                ? 'text-primary' 
                                : 'text-muted-foreground'
                            }`}
                          >
                            ★
                          </span>
                        ))}
                      </div>
                      <Badge variant="outline">{crop.sustainability}/10</Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        
        {recommendations.length === 0 && (
          <div className="text-center text-muted-foreground">
            Select a region to see AI recommendations
          </div>
        )}
      </div>
    </section>
  );
};

export default AIRecommendations;