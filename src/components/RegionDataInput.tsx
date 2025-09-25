import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";

interface RegionData {
  soil: {
    pH: number;
    moisture: number;
    nitrogen: number;
    phosphorus: number;
    potassium: number;
  };
  weather: {
    temperature: number;
    humidity: number;
    rainfall: number;
  };
  cropRotation: string[];
}

const REGION_DATA: Record<string, RegionData> = {
  Punjab: {
    soil: { pH: 6.8, moisture: 45, nitrogen: 40, phosphorus: 25, potassium: 30 },
    weather: { temperature: 30, humidity: 55, rainfall: 20 },
    cropRotation: ["Wheat", "Mustard", "Rice"]
  },
  Maharashtra: {
    soil: { pH: 7.2, moisture: 38, nitrogen: 35, phosphorus: 20, potassium: 28 },
    weather: { temperature: 32, humidity: 50, rainfall: 5 },
    cropRotation: ["Sugarcane", "Cotton", "Maize"]
  },
  "West Bengal": {
    soil: { pH: 6.5, moisture: 50, nitrogen: 42, phosphorus: 22, potassium: 33 },
    weather: { temperature: 28, humidity: 70, rainfall: 35 },
    cropRotation: ["Rice", "Potato", "Maize"]
  },
  "Tamil Nadu": {
    soil: { pH: 7.0, moisture: 40, nitrogen: 38, phosphorus: 24, potassium: 31 },
    weather: { temperature: 34, humidity: 60, rainfall: 10 },
    cropRotation: ["Maize", "Groundnut", "Millets"]
  }
};

const SOIL_TYPES = ["Sandy", "Loamy", "Clay", "Red Soil"];

interface RegionDataInputProps {
  selectedRegion: string | null;
  selectedSoilType: string | null;
  onRegionChange: (region: string) => void;
  onSoilTypeChange: (soilType: string) => void;
}

const RegionDataInput = ({ 
  selectedRegion, 
  selectedSoilType, 
  onRegionChange, 
  onSoilTypeChange 
}: RegionDataInputProps) => {
  const regionData = selectedRegion ? REGION_DATA[selectedRegion] : null;

  return (
    <section className="py-16 px-6 bg-muted/30">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12">Regional Analysis</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Input Controls */}
          <Card className="animate-fade-in">
            <CardHeader>
              <CardTitle>Select Your Region</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <label className="text-sm font-medium mb-2 block">Region</label>
                <Select onValueChange={onRegionChange} value={selectedRegion || ""}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select region" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.keys(REGION_DATA).map((region) => (
                      <SelectItem key={region} value={region}>{region}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="text-sm font-medium mb-2 block">Soil Type</label>
                <Select onValueChange={onSoilTypeChange} value={selectedSoilType || ""}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select soil type" />
                  </SelectTrigger>
                  <SelectContent>
                    {SOIL_TYPES.map((soilType) => (
                      <SelectItem key={soilType} value={soilType}>{soilType}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="text-sm font-medium mb-2 block">Crop Image Upload</label>
                <Button variant="outline" className="w-full">
                  <Upload className="w-4 h-4 mr-2" />
                  Upload for Disease Detection
                </Button>
              </div>
            </CardContent>
          </Card>
          
          {/* Regional Data Display */}
          {regionData && (
            <div className="space-y-6 animate-fade-in">
              {/* Soil Data */}
              <Card>
                <CardHeader>
                  <CardTitle>Soil Data - {selectedRegion}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>pH: <span className="font-semibold">{regionData.soil.pH}</span></div>
                    <div>Moisture: <span className="font-semibold">{regionData.soil.moisture}%</span></div>
                    <div>Nitrogen: <span className="font-semibold">{regionData.soil.nitrogen} ppm</span></div>
                    <div>Phosphorus: <span className="font-semibold">{regionData.soil.phosphorus} ppm</span></div>
                    <div>Potassium: <span className="font-semibold">{regionData.soil.potassium} ppm</span></div>
                  </div>
                </CardContent>
              </Card>
              
              {/* Weather Data */}
              <Card>
                <CardHeader>
                  <CardTitle>Weather Data - {selectedRegion}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>Temperature: <span className="font-semibold">{regionData.weather.temperature}°C</span></div>
                    <div>Humidity: <span className="font-semibold">{regionData.weather.humidity}%</span></div>
                    <div>Rainfall: <span className="font-semibold">{regionData.weather.rainfall}mm</span></div>
                  </div>
                </CardContent>
              </Card>
              
              {/* Crop Rotation */}
              <Card>
                <CardHeader>
                  <CardTitle>Past Crop Rotation</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2 text-sm">
                    {regionData.cropRotation.map((crop, index) => (
                      <div key={crop} className="flex items-center">
                        <span className="font-semibold">{crop}</span>
                        {index < regionData.cropRotation.length - 1 && (
                          <span className="mx-2 text-muted-foreground">→</span>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default RegionDataInput;