
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Construction, Target, History } from 'lucide-react';

const AnalyticsPage = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
        <CardHeader>
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
              <BarChart className="w-5 h-5 text-white" />
            </div>
            <div>
              <CardTitle className="text-2xl">Analytics Dashboard</CardTitle>
              <CardDescription className="text-purple-100">
                Monitor drill performance and security awareness metrics
              </CardDescription>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-white dark:bg-gray-800 border-cream dark:border-gray-700">
          <CardHeader>
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-teal to-navy rounded-lg flex items-center justify-center">
                <Target className="w-5 h-5 text-white" />
              </div>
              <div>
                <CardTitle className="text-navy dark:text-white">Total Drills</CardTitle>
                <CardDescription className="dark:text-gray-400">
                  All time drill count
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-teal">24</div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
              Drills conducted across all departments
            </p>
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-gray-800 border-cream dark:border-gray-700">
          <CardHeader>
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                <History className="w-5 h-5 text-white" />
              </div>
              <div>
                <CardTitle className="text-navy dark:text-white">Mock Drill History</CardTitle>
                <CardDescription className="dark:text-gray-400">
                  Recent activity log
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-600">
                <span className="text-sm text-gray-600 dark:text-gray-400">IT Department Drill</span>
                <span className="text-xs text-gray-500">2 hours ago</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-600">
                <span className="text-sm text-gray-600 dark:text-gray-400">Finance Team Drill</span>
                <span className="text-xs text-gray-500">1 day ago</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-600">
                <span className="text-sm text-gray-600 dark:text-gray-400">HR Department Drill</span>
                <span className="text-xs text-gray-500">3 days ago</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Under Construction Notice */}
      <Card className="bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800">
        <CardHeader>
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-yellow-500 rounded-lg flex items-center justify-center">
              <Construction className="w-5 h-5 text-white" />
            </div>
            <div>
              <CardTitle className="text-yellow-800 dark:text-yellow-200">Page Under Construction</CardTitle>
              <CardDescription className="text-yellow-700 dark:text-yellow-300">
                Advanced analytics features are being developed
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-yellow-800 dark:text-yellow-200">
            We're working on bringing you detailed analytics including success rates, 
            user engagement metrics, threat detection statistics, and comprehensive reporting tools. 
            Stay tuned for these exciting features!
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default AnalyticsPage;
