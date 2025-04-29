import { FactorAnalysisResults, FactorImpact } from "../types";
import { TrendingUp, TrendingDown, Cloud, CloudRain, Sun, CalendarDays, Tag } from 'lucide-react';

interface FactorAnalysisDisplayProps {
  results: FactorAnalysisResults | null;
}

// Helper to get an icon based on factor type
const getFactorIcon = (factorName: string) => {
    if (factorName.startsWith('Weather:')) {
        if (factorName.includes('Sunny')) return <Sun className="w-4 h-4 text-accent-500 mr-2" />;
        if (factorName.includes('Rainy')) return <CloudRain className="w-4 h-4 text-blue-500 mr-2" />;
        if (factorName.includes('Cloudy')) return <Cloud className="w-4 h-4 text-gray-500 mr-2" />;
    }
    if (factorName.startsWith('Promo:')) {
        return <Tag className="w-4 h-4 text-primary-500 mr-2" />;
    }
    if (factorName.startsWith('Day:')) {
        return <CalendarDays className="w-4 h-4 text-secondary-500 mr-2" />;
    }
    return null;
}

// Helper to format factor name for display
const formatFactorName = (factorName: string): string => {
    return factorName.replace(/^(Weather:|Promo:|Day:)\s*/, '');
}

const FactorItem: React.FC<{ factor: FactorImpact }> = ({ factor }) => (
    <li className="flex items-center justify-between py-2">
        <div className="flex items-center">
            {getFactorIcon(factor.factorName)}
            <span className="text-sm text-gray-700">{formatFactorName(factor.factorName)}</span>
        </div>
        <span className={`text-sm font-medium ${factor.averageVariance > 0 ? 'text-success-600' : 'text-error-600'}`}>
            {factor.averageVariance > 0 ? '+' : ''}{factor.averageVariance.toFixed(1)}%
        </span>
    </li>
);

export default function FactorAnalysisDisplay({ results }: FactorAnalysisDisplayProps) {
  if (!results) {
    return <p className="text-gray-500">Calculating factor analysis...</p>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Positive Factors */}
      <div>
        <h4 className="text-md font-semibold text-success-700 mb-2">Top Positive Influences</h4>
        {results.topPositiveFactors.length > 0 ? (
            <ul className="divide-y divide-gray-200">
                {results.topPositiveFactors.map(factor => 
                    <FactorItem key={factor.factorName} factor={factor} />
                )}
            </ul>
        ) : (
            <p className="text-sm text-gray-500">No significant positive factors identified.</p>
        )}
      </div>

      {/* Negative Factors */}
      <div>
        <h4 className="text-md font-semibold text-error-700 mb-2">Top Negative Influences</h4>
         {results.topNegativeFactors.length > 0 ? (
            <ul className="divide-y divide-gray-200">
                {results.topNegativeFactors.map(factor => 
                   <FactorItem key={factor.factorName} factor={factor} />
                )}
            </ul>
        ) : (
            <p className="text-sm text-gray-500">No significant negative factors identified.</p>
        )}
      </div>
    </div>
  );
} 