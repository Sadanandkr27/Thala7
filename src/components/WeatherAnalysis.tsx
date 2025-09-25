import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, CloudRain, Sun, Cloud, Wind, Thermometer, Droplets } from "lucide-react";

// Weather data for different time periods (matching the forecast ranges)
const WEATHER_DATA = {
  "Punjab": {
    "past15-30": { temp: 28, humidity: 58, rainfall: 12, condition: "Partly Cloudy", windSpeed: 8 },
    "past30-45": { temp: 30, humidity: 55, rainfall: 25, condition: "Light Rain", windSpeed: 10 },
    "past45-60": { temp: 32, humidity: 50, rainfall: 45, condition: "Sunny", windSpeed: 7 },
    "past60-90": { temp: 35, humidity: 48, rainfall: 78, condition: "Heavy Rain", windSpeed: 15 },
    "future15-30": { temp: 26, humidity: 65, rainfall: 8, condition: "Cloudy", windSpeed: 12 },
    "future30-45": { temp: 24, humidity: 70, rainfall: 15, condition: "Light Rain", windSpeed: 9 },
    "future45-60": { temp: 22, humidity: 75, rainfall: 35, condition: "Moderate Rain", windSpeed: 11 },
    "future60-90": { temp: 20, humidity: 80, rainfall: 55, condition: "Heavy Rain", windSpeed: 18 }
  },
  "Maharashtra": {
    "past15-30": { temp: 32, humidity: 52, rainfall: 5, condition: "Sunny", windSpeed: 6 },
    "past30-45": { temp: 34, humidity: 48, rainfall: 2, condition: "Hot", windSpeed: 5 },
    "past45-60": { temp: 36, humidity: 45, rainfall: 8, condition: "Very Hot", windSpeed: 4 },
    "past60-90": { temp: 38, humidity: 42, rainfall: 15, condition: "Extreme Heat", windSpeed: 7 },
    "future15-30": { temp: 30, humidity: 58, rainfall: 12, condition: "Mild", windSpeed: 8 },
    "future30-45": { temp: 28, humidity: 62, rainfall: 25, condition: "Pleasant", windSpeed: 10 },
    "future45-60": { temp: 26, humidity: 68, rainfall: 40, condition: "Monsoon", windSpeed: 14 },
    "future60-90": { temp: 24, humidity: 75, rainfall: 65, condition: "Heavy Monsoon", windSpeed: 20 }
  },
  "West Bengal": {
    "past15-30": { temp: 30, humidity: 78, rainfall: 28, condition: "Humid", windSpeed: 8 },
    "past30-45": { temp: 32, humidity: 75, rainfall: 35, condition: "Monsoon", windSpeed: 12 },
    "past45-60": { temp: 34, humidity: 72, rainfall: 55, condition: "Heavy Rain", windSpeed: 15 },
    "past60-90": { temp: 36, humidity: 70, rainfall: 85, condition: "Flooding Risk", windSpeed: 18 },
    "future15-30": { temp: 28, humidity: 80, rainfall: 20, condition: "High Humidity", windSpeed: 10 },
    "future30-45": { temp: 26, humidity: 82, rainfall: 45, condition: "Monsoon", windSpeed: 14 },
    "future45-60": { temp: 24, humidity: 85, rainfall: 70, condition: "Heavy Monsoon", windSpeed: 16 },
    "future60-90": { temp: 22, humidity: 88, rainfall: 95, condition: "Extreme Monsoon", windSpeed: 22 }
  },
  "Tamil Nadu": {
    "past15-30": { temp: 35, humidity: 58, rainfall: 8, condition: "Hot & Dry", windSpeed: 7 },
    "past30-45": { temp: 37, humidity: 55, rainfall: 5, condition: "Very Hot", windSpeed: 6 },
    "past45-60": { temp: 39, humidity: 52, rainfall: 12, condition: "Extreme Heat", windSpeed: 5 },
    "past60-90": { temp: 41, humidity: 48, rainfall: 20, condition: "Heat Wave", windSpeed: 8 },
    "future15-30": { temp: 33, humidity: 65, rainfall: 15, condition: "Moderate", windSpeed: 9 },
    "future30-45": { temp: 31, humidity: 70, rainfall: 35, condition: "Pre-Monsoon", windSpeed: 12 },
    "future45-60": { temp: 29, humidity: 75, rainfall: 60, condition: "Monsoon Onset", windSpeed: 15 },
    "future60-90": { temp: 27, humidity: 80, rainfall: 85, condition: "Northeast Monsoon", windSpeed: 18 }
  }
};

interface WeatherAnalysisProps {
  selectedState: string;
}

const WeatherAnalysis = ({ selectedState }: WeatherAnalysisProps) => {
  const [selectedPeriod, setSelectedPeriod] = useState<string>("past15-30");
  
  const weatherData = WEATHER_DATA[selectedState as keyof typeof WEATHER_DATA];
  
  if (!weatherData) return null;

  const getWeatherIcon = (condition: string) => {
    if (condition.toLowerCase().includes('rain')) return <CloudRain className="w-6 h-6 text-blue-500" />;
    if (condition.toLowerCase().includes('cloud')) return <Cloud className="w-6 h-6 text-gray-500" />;
    if (condition.toLowerCase().includes('sun') || condition.toLowerCase().includes('hot')) return <Sun className="w-6 h-6 text-yellow-500" />;
    return <Wind className="w-6 h-6 text-gray-400" />;
  };

  const getConditionColor = (condition: string) => {
    if (condition.toLowerCase().includes('rain') || condition.toLowerCase().includes('flood')) return 'bg-blue-100 text-blue-800';
    if (condition.toLowerCase().includes('hot') || condition.toLowerCase().includes('heat')) return 'bg-red-100 text-red-800';
    if (condition.toLowerCase().includes('pleasant') || condition.toLowerCase().includes('mild')) return 'bg-green-100 text-green-800';
    return 'bg-gray-100 text-gray-800';
  };

  return (
    <Card className="nature-shadow animate-growth">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="w-6 h-6 text-primary" />
          Weather Analysis - {selectedState}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="historical" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="historical">Historical Data</TabsTrigger>
            <TabsTrigger value="forecast">Future Forecast</TabsTrigger>
          </TabsList>
          
          <TabsContent value="historical" className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {['past15-30', 'past30-45', 'past45-60', 'past60-90'].map((period) => {
                const data = weatherData[period as keyof typeof weatherData];
                const label = period.replace('past', '') + (period === 'past60-90' ? ' days (2-3 months)' : ' days');
                
                return (
                  <Card 
                    key={period}
                    className={`cursor-pointer transition-all hover:scale-105 hover:shadow-glow ${
                      selectedPeriod === period ? 'ring-2 ring-primary' : ''
                    }`}
                    onClick={() => setSelectedPeriod(period)}
                  >
                    <CardContent className="p-4">
                      <div className="text-center space-y-2">
                        <div className="text-sm font-medium text-muted-foreground">Past {label}</div>
                        {getWeatherIcon(data.condition)}
                        <div className="text-2xl font-bold">{data.temp}°C</div>
                        <Badge className={getConditionColor(data.condition)}>
                          {data.condition}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>
          
          <TabsContent value="forecast" className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {['future15-30', 'future30-45', 'future45-60', 'future60-90'].map((period) => {
                const data = weatherData[period as keyof typeof weatherData];
                const label = period.replace('future', '') + (period === 'future60-90' ? ' days (2-3 months)' : ' days');
                
                return (
                  <Card 
                    key={period}
                    className={`cursor-pointer transition-all hover:scale-105 hover:shadow-glow ${
                      selectedPeriod === period ? 'ring-2 ring-primary' : ''
                    }`}
                    onClick={() => setSelectedPeriod(period)}
                  >
                    <CardContent className="p-4">
                      <div className="text-center space-y-2">
                        <div className="text-sm font-medium text-muted-foreground">Next {label}</div>
                        {getWeatherIcon(data.condition)}
                        <div className="text-2xl font-bold">{data.temp}°C</div>
                        <Badge className={getConditionColor(data.condition)}>
                          {data.condition}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>
        </Tabs>

        {/* Detailed view of selected period */}
        {selectedPeriod && (
          <Card className="mt-6 animate-growth">
            <CardHeader>
              <CardTitle className="text-lg">
                Detailed Weather - {selectedPeriod.includes('past') ? 'Past' : 'Next'} {selectedPeriod.replace(/past|future/, '')} {selectedPeriod.includes('60-90') ? 'days (2-3 months)' : 'days'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {(() => {
                  const data = weatherData[selectedPeriod as keyof typeof weatherData];
                  return [
                    { icon: <Thermometer className="w-5 h-5 text-red-500" />, label: "Temperature", value: `${data.temp}°C`, color: "text-red-600" },
                    { icon: <Droplets className="w-5 h-5 text-blue-500" />, label: "Humidity", value: `${data.humidity}%`, color: "text-blue-600" },
                    { icon: <CloudRain className="w-5 h-5 text-indigo-500" />, label: "Rainfall", value: `${data.rainfall}mm`, color: "text-indigo-600" },
                    { icon: <Wind className="w-5 h-5 text-gray-500" />, label: "Wind Speed", value: `${data.windSpeed} km/h`, color: "text-gray-600" }
                  ].map((item, index) => (
                    <div key={index} className="text-center p-4 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors">
                      <div className="flex justify-center mb-2">{item.icon}</div>
                      <div className="text-sm text-muted-foreground mb-1">{item.label}</div>
                      <div className={`text-xl font-bold ${item.color}`}>{item.value}</div>
                    </div>
                  ));
                })()}
              </div>
            </CardContent>
          </Card>
        )}
      </CardContent>
    </Card>
  );
};

export default WeatherAnalysis;