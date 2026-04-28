import { useEffect, useState } from 'react';
import { getProgress } from '../services/api';
import { TrendingUp, Target } from 'lucide-react';

const ProgressBar = () => {
  const [progress, setProgress] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProgress();
  }, []);

  const fetchProgress = async () => {
    try {
      const response = await getProgress();
      setProgress(response.data);
    } catch (error) {
      console.error('Failed to fetch progress:', error);
      // Use mock data for development
      setProgress({
        current_amount: 4500,
        goal_amount: 10000,
        percentage: 45,
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="card animate-pulse">
        <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
        <div className="h-8 bg-gray-200 rounded mb-2"></div>
      </div>
    );
  }

  return (
    <div className="card">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-800 flex items-center">
          <Target className="w-5 h-5 mr-2 text-green-600" />
          Support Progress
        </h3>
        <span className="text-green-600 font-bold">
          {progress.percentage}%
        </span>
      </div>

      {/* Progress Bar */}
      <div className="relative w-full h-4 bg-gray-200 rounded-full overflow-hidden">
        <div
          className="absolute top-0 left-0 h-full bg-gradient-to-r from-green-500 to-green-600 rounded-full transition-all duration-1000 ease-out"
          style={{ width: `${Math.min(progress.percentage, 100)}%` }}
        >
          {progress.percentage > 10 && (
            <div className="absolute inset-0 bg-white opacity-20 animate-pulse"></div>
          )}
        </div>
      </div>

      {/* Amount Display */}
      <div className="flex justify-between mt-3 text-sm">
        <div className="flex items-center text-gray-600">
          <TrendingUp className="w-4 h-4 mr-1 text-green-600" />
          <span>KES {progress.current_amount.toLocaleString()}</span>
        </div>
        <span className="text-gray-400">
          Goal: KES {progress.goal_amount.toLocaleString()}
        </span>
      </div>
    </div>
  );
};

export default ProgressBar;