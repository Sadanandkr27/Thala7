import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface MSPData {
  crop: string;
  price: number;
}

const MSP_DATA: Record<string, MSPData[]> = {
  Punjab: [
    { crop: "Wheat", price: 2100 },
    { crop: "Mustard", price: 4500 }
  ],
  Maharashtra: [
    { crop: "Sugarcane", price: 3200 },
    { crop: "Cotton", price: 5800 }
  ],
  "West Bengal": [
    { crop: "Rice", price: 2000 },
    { crop: "Potato", price: 1500 }
  ],
  "Tamil Nadu": [
    { crop: "Maize", price: 1800 },
    { crop: "Groundnut", price: 5000 }
  ]
};

interface MSPSectionProps {
  selectedRegion: string | null;
}

const MSPSection = ({ selectedRegion }: MSPSectionProps) => {
  if (!selectedRegion) return null;
  
  const mspData = MSP_DATA[selectedRegion] || [];

  return (
    <section className="py-16 px-6 bg-muted/30">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12">
          Minimum Support Price (MSP) - {selectedRegion}
        </h2>
        
        <Card className="animate-fade-in">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="text-2xl">💰</span>
              Current MSP Rates
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mspData.map((item, index) => (
                <div 
                  key={item.crop}
                  className="flex justify-between items-center p-4 bg-background rounded-lg border hover:shadow-md transition-all duration-300 hover:scale-[1.02] animate-slide-in-left"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                      <span className="text-xl">🌾</span>
                    </div>
                    <div>
                      <h3 className="font-semibold">{item.crop}</h3>
                      <p className="text-sm text-muted-foreground">Per Quintal</p>
                    </div>
                  </div>
                  <Badge 
                    variant="default" 
                    className="text-lg px-4 py-2 bg-green-600 hover:bg-green-700"
                  >
                    ₹{item.price.toLocaleString()}
                  </Badge>
                </div>
              ))}
            </div>
            
            <div className="mt-6 p-4 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-lg">
              <p className="text-sm text-amber-800 dark:text-amber-200">
                <strong>Note:</strong> MSP rates are government-declared minimum prices. 
                Market prices may vary based on quality, demand, and location.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default MSPSection;