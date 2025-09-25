import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle, TrendingDown, Bug, DollarSign, Thermometer } from "lucide-react";

const LIMITATIONS = [
  {
    icon: Thermometer,
    title: "Weather Variations",
    description: "Sudden weather changes may reduce yield by 10-30%",
    severity: "high"
  },
  {
    icon: Bug,
    title: "Pest Infestations", 
    description: "Pest infestations not detected in time can cause 15-40% losses",
    severity: "high"
  },
  {
    icon: DollarSign,
    title: "Market Fluctuations",
    description: "Market price fluctuations may differ from forecasts by ±20%",
    severity: "medium"
  },
  {
    icon: TrendingDown,
    title: "Soil Fertility Changes",
    description: "Soil fertility changes may affect outcomes and reduce productivity",
    severity: "medium"
  }
];

const LimitationsSection = () => {
  return (
    <section className="py-16 px-6 bg-background">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-2 mb-4">
            <AlertTriangle className="w-8 h-8 text-amber-500 animate-pulse" />
            <h2 className="text-3xl font-bold">AI Limitations & Risk Factors</h2>
          </div>
          <p className="text-muted-foreground">
            Understanding potential risks helps in better decision making
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {LIMITATIONS.map((limitation, index) => {
            const IconComponent = limitation.icon;
            return (
              <Card 
                key={limitation.title}
                className="group hover:shadow-lg transition-all duration-300 animate-fade-in"
                style={{ animationDelay: `${index * 150}ms` }}
              >
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-3 text-lg">
                    <div className={`p-2 rounded-full ${
                      limitation.severity === 'high' 
                        ? 'bg-red-100 dark:bg-red-950/30' 
                        : 'bg-amber-100 dark:bg-amber-950/30'
                    }`}>
                      <IconComponent className={`w-5 h-5 ${
                        limitation.severity === 'high' 
                          ? 'text-red-600 dark:text-red-400' 
                          : 'text-amber-600 dark:text-amber-400'
                      }`} />
                    </div>
                    {limitation.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">
                    {limitation.description}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>
        
        <Alert className="border-amber-200 dark:border-amber-800">
          <AlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-400" />
          <AlertDescription className="text-amber-800 dark:text-amber-200">
            <strong>Disclaimer:</strong> AI predictions are based on historical data and current conditions. 
            Actual results may vary due to unforeseen circumstances. Always consult with local agricultural 
            experts and consider multiple factors before making farming decisions.
          </AlertDescription>
        </Alert>
      </div>
    </section>
  );
};

export default LimitationsSection;