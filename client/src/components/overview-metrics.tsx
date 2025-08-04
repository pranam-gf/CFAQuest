import { useQuery } from "@tanstack/react-query";
import { Statistics } from "@/types/models";
import { motion } from 'framer-motion';

export function OverviewMetrics() {
  const { data: stats, isLoading } = useQuery<Statistics>({
    queryKey: ["/api/statistics"],
  });

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="h-24 bg-gray-200 dark:bg-gray-700 rounded-xl"></div>
          </div>
        ))}
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="text-center py-8 text-slate-500">
        Failed to load statistics
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
    >
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.1 }}
        className="text-center"
      >
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">Total Models</h3>
          <p className="text-xs text-gray-600 dark:text-gray-400">Active in evaluation</p>
        </div>
        <div>
          <div className="text-4xl font-bold text-emerald-600 dark:text-emerald-400 mb-2">
            {stats.totalModels}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Models benchmarked
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2 }}
        className="text-center"
      >
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">Best MCQ Accuracy</h3>
          <p className="text-xs text-gray-600 dark:text-gray-400">Highest scoring model</p>
        </div>
        <div>
          <div className="text-4xl font-bold text-emerald-600 dark:text-emerald-400 mb-2">
            {(stats.bestMcqAccuracy * 100).toFixed(1)}%
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400 truncate">
            {stats.bestMcqModel}
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, x: 10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.3 }}
        className="text-center"
      >
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">Best Essay Score</h3>
          <p className="text-xs text-gray-600 dark:text-gray-400">Top essay evaluation</p>
        </div>
        <div>
          <div className="text-4xl font-bold text-emerald-600 dark:text-emerald-400 mb-2">
            {stats.bestEssayScore.toFixed(2)}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400 truncate">
            {stats.bestEssayModel}
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.4 }}
        className="text-center"
      >
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">Most Cost Efficient</h3>
          <p className="text-xs text-gray-600 dark:text-gray-400">Best value performance</p>
        </div>
        <div>
          <div className="text-4xl font-bold text-emerald-600 dark:text-emerald-400 mb-2">
            {stats.mostCostEfficient.toFixed(0)}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400 truncate">
            {stats.mostCostEfficientModel}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
