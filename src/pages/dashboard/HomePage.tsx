
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Drill, BarChart, Shield, Users, Target, AlertTriangle } from 'lucide-react';
import WallpaperCarousel from '@/components/WallpaperCarousel';

interface HomePageProps {
  onNavigate: (page: string) => void;
}

const HomePage = ({ onNavigate }: HomePageProps) => {
  const stats = [
    { title: 'Total Drills', value: '24', icon: Target, color: 'text-blue-600' },
    { title: 'Active Users', value: '156', icon: Users, color: 'text-green-600' },
    { title: 'Success Rate', value: '78%', icon: Shield, color: 'text-purple-600' },
    { title: 'Threats Blocked', value: '342', icon: AlertTriangle, color: 'text-red-600' }
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <Card className="bg-gradient-to-r from-teal to-navy text-white">
        <CardHeader>
          <CardTitle className="text-2xl">Welcome to HackAware</CardTitle>
          <CardDescription className="text-teal-100">
            Your comprehensive cybersecurity training platform
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Wallpaper Carousel */}
      <WallpaperCarousel />

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={index} className="bg-white dark:bg-gray-800 border-cream dark:border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{stat.title}</p>
                  <p className="text-2xl font-bold text-navy dark:text-white">{stat.value}</p>
                </div>
                <stat.icon className={`w-8 h-8 ${stat.color}`} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-white dark:bg-gray-800 border-cream dark:border-gray-700">
          <CardHeader>
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-teal to-navy rounded-lg flex items-center justify-center">
                <Drill className="w-5 h-5 text-white" />
              </div>
              <div>
                <CardTitle className="text-navy dark:text-white">Create Mock Drill</CardTitle>
                <CardDescription className="dark:text-gray-400">
                  Launch a new phishing simulation
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Button 
              onClick={() => onNavigate('create-drill')}
              className="w-full bg-gradient-to-r from-teal to-navy hover:from-teal/90 hover:to-navy/90 text-white"
            >
              Start New Drill
            </Button>
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-gray-800 border-cream dark:border-gray-700">
          <CardHeader>
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                <BarChart className="w-5 h-5 text-white" />
              </div>
              <div>
                <CardTitle className="text-navy dark:text-white">Analytics</CardTitle>
                <CardDescription className="dark:text-gray-400">
                  View training effectiveness
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Button 
              onClick={() => onNavigate('analytics')}
              className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
            >
              View Analytics
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default HomePage;
