import React from 'react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, Award } from 'lucide-react';

interface ImprovementChartsProps {
  beforeScore: number;
  afterScore: number;
  soilType: string;
}

const ImprovementCharts: React.FC<ImprovementChartsProps> = ({ beforeScore, afterScore, soilType }) => {
  const pieData = [
    { name: 'Optimized', value: afterScore, color: '#22c55e' },
    { name: 'Remaining', value: 100 - afterScore, color: '#e5e7eb' }
  ];

  const comparisonData = [
    {
      category: 'Crop Yield',
      before: beforeScore - 15,
      after: afterScore + 5,
    },
    {
      category: 'Soil Health',
      before: beforeScore - 10,
      after: afterScore + 8,
    },
    {
      category: 'Water Efficiency', 
      before: beforeScore - 20,
      after: afterScore + 12,
    },
    {
      category: 'Cost Savings',
      before: beforeScore - 25,
      after: afterScore + 15,
    }
  ];

  const COLORS = ['#22c55e', '#e5e7eb'];

  return (
    <div className="grid md:grid-cols-2 gap-6">
      {/* Overall Improvement Pie Chart */}
      <Card className="nature-shadow bg-card/90 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-green-600" />
            Farm Optimization Score
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  data={pieData}
                  animationBegin={0}
                  animationDuration={1500}
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="text-center mt-4">
            <div className="text-3xl font-bold text-green-600">{afterScore}%</div>
            <p className="text-sm text-muted-foreground">Current Optimization Level</p>
          </div>
        </CardContent>
      </Card>

      {/* Before vs After Comparison */}
      <Card className="nature-shadow bg-card/90 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="h-5 w-5 text-blue-600" />
            Before vs After AI Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={comparisonData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="category" 
                  angle={-45}
                  textAnchor="end"
                  height={80}
                  fontSize={12}
                />
                <YAxis />
                <Tooltip 
                  formatter={(value: number, name: string) => [
                    `${value}%`, 
                    name === 'before' ? 'Before AI' : 'After AI'
                  ]}
                />
                <Bar dataKey="before" fill="#ef4444" name="before" />
                <Bar dataKey="after" fill="#22c55e" name="after" />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-between mt-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-red-500 rounded"></div>
              <span>Before AI Analysis</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded"></div>
              <span>After AI Analysis</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Impact Metrics */}
      <Card className="md:col-span-2 nature-shadow bg-card/90 backdrop-blur-sm">
        <CardHeader>
          <CardTitle>AI Impact Metrics for {soilType} Soil</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">+{afterScore - beforeScore}%</div>
              <div className="text-sm text-green-700">Yield Increase</div>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">-30%</div>
              <div className="text-sm text-blue-700">Water Usage</div>
            </div>
            <div className="text-center p-4 bg-orange-50 rounded-lg">
              <div className="text-2xl font-bold text-orange-600">-25%</div>
              <div className="text-sm text-orange-700">Fertilizer Cost</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">+40%</div>
              <div className="text-sm text-purple-700">Profit Margin</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ImprovementCharts;