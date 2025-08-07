
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Menu } from 'lucide-react';

const AppearancePage = () => {
  return (
    <div className="space-y-6">
      <Card className="bg-white border-cream shadow-lg">
        <CardHeader>
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-teal to-navy rounded-lg flex items-center justify-center">
              <Menu className="w-5 h-5 text-white" />
            </div>
            <div>
              <CardTitle className="text-navy">Appearance</CardTitle>
              <CardDescription>Customize your dashboard appearance</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-navy">Theme</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-4 border-2 border-teal rounded-lg bg-teal/10 cursor-pointer hover:bg-teal/20 transition-colors">
                <div className="w-full h-16 bg-gradient-to-br from-cream via-teal/10 to-navy/5 rounded mb-2"></div>
                <p className="text-sm font-medium text-navy">Current Theme</p>
              </div>
              <div className="p-4 border-2 border-cream rounded-lg cursor-pointer hover:bg-cream/50 transition-colors">
                <div className="w-full h-16 bg-gradient-to-br from-slate-100 to-slate-300 rounded mb-2"></div>
                <p className="text-sm font-medium text-dark-blue">Light Theme</p>
              </div>
              <div className="p-4 border-2 border-cream rounded-lg cursor-pointer hover:bg-cream/50 transition-colors">
                <div className="w-full h-16 bg-gradient-to-br from-slate-800 to-slate-900 rounded mb-2"></div>
                <p className="text-sm font-medium text-dark-blue">Dark Theme</p>
              </div>
              <div className="p-4 border-2 border-cream rounded-lg cursor-pointer hover:bg-cream/50 transition-colors">
                <div className="w-full h-16 bg-gradient-to-br from-blue-100 to-blue-300 rounded mb-2"></div>
                <p className="text-sm font-medium text-dark-blue">Blue Theme</p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-navy">Color Palette</h3>
            <div className="flex space-x-4">
              <div className="flex flex-col items-center space-y-2">
                <div className="w-12 h-12 bg-cream rounded-lg border-2 border-cream"></div>
                <span className="text-xs text-dark-blue/70">Cream</span>
              </div>
              <div className="flex flex-col items-center space-y-2">
                <div className="w-12 h-12 bg-navy rounded-lg"></div>
                <span className="text-xs text-dark-blue/70">Navy</span>
              </div>
              <div className="flex flex-col items-center space-y-2">
                <div className="w-12 h-12 bg-dark-blue rounded-lg"></div>
                <span className="text-xs text-dark-blue/70">Dark Blue</span>
              </div>
              <div className="flex flex-col items-center space-y-2">
                <div className="w-12 h-12 bg-teal rounded-lg"></div>
                <span className="text-xs text-dark-blue/70">Teal</span>
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <Button className="bg-gradient-to-r from-navy to-dark-blue hover:from-dark-blue hover:to-navy text-white">
              Apply Changes
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AppearancePage;
