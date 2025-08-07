
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { authService } from '@/utils/auth';
import { Settings, Upload, User, Key, Save } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { storage } from '@/utils/storage';
import { geminiService } from '@/utils/gemini';
import { useToast } from '@/hooks/use-toast';
import MessageServiceSettings from '@/components/MessageServiceSettings';

const AccountSettingsPage = () => {
  const currentUser = authService.getCurrentUser();
  const [profileImage, setProfileImage] = useState('');
  const [geminiApiKey, setGeminiApiKey] = useState('');
  const [isValidatingKey, setIsValidatingKey] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const settings = storage.getSettings();
    setGeminiApiKey(settings.geminiApiKey || '');
  }, []);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfileImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveSettings = () => {
    try {
      // Validate Gemini API key if provided
      if (geminiApiKey && !geminiService.validateApiKey(geminiApiKey)) {
        toast({
          title: "Invalid API Key",
          description: "Please enter a valid Gemini API key starting with 'AIza'",
          variant: "destructive"
        });
        return;
      }

      // Save settings
      storage.saveSettings({
        geminiApiKey: geminiApiKey || undefined,
      });

      toast({
        title: "Settings Saved",
        description: "Your account settings have been updated successfully.",
        className: "bg-green-600 text-white"
      });
    } catch (error) {
      toast({
        title: "Save Failed",
        description: "Failed to save settings. Please try again.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Profile Settings Card */}
      <Card className="bg-white border-cream shadow-lg dark:bg-gray-800 dark:border-gray-700">
        <CardHeader>
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-navy to-dark-blue rounded-lg flex items-center justify-center">
              <Settings className="w-5 h-5 text-white" />
            </div>
            <div>
              <CardTitle className="text-navy dark:text-white">Account Settings</CardTitle>
              <CardDescription className="dark:text-gray-400">Manage your account information and preferences</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Profile Picture Section */}
          <div className="flex items-center space-x-6">
            <Avatar className="w-24 h-24">
              <AvatarImage src={profileImage} alt="Profile" />
              <AvatarFallback className="bg-teal text-white text-2xl">
                {currentUser?.fullName?.charAt(0) || <User className="w-8 h-8" />}
              </AvatarFallback>
            </Avatar>
            <div className="space-y-2">
              <Label htmlFor="profilePicture" className="text-dark-blue font-medium dark:text-white">
                Profile Picture
              </Label>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="relative overflow-hidden"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Upload Photo
                  <input
                    id="profilePicture"
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
                </Button>
                {profileImage && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setProfileImage('')}
                    className="text-red-600 hover:text-red-700"
                  >
                    Remove
                  </Button>
                )}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="fullName" className="text-dark-blue font-medium dark:text-white">Full Name</Label>
                <Input
                  id="fullName"
                  defaultValue={currentUser?.fullName}
                  className="border-2 border-cream focus:border-teal transition-colors dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
              </div>
              <div>
                <Label htmlFor="email" className="text-dark-blue font-medium dark:text-white">Email</Label>
                <Input
                  id="email"
                  type="email"
                  defaultValue={currentUser?.email}
                  className="border-2 border-cream focus:border-teal transition-colors dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
              </div>
              <div>
                <Label htmlFor="role" className="text-dark-blue font-medium dark:text-white">Role</Label>
                <Select defaultValue="admin">
                  <SelectTrigger className="border-2 border-cream focus:border-teal dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent className="dark:bg-gray-700 dark:border-gray-600">
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="manager">Manager</SelectItem>
                    <SelectItem value="analyst">Security Analyst</SelectItem>
                    <SelectItem value="trainer">Trainer</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <Label htmlFor="currentPassword" className="text-dark-blue font-medium dark:text-white">Current Password</Label>
                <Input
                  id="currentPassword"
                  type="password"
                  placeholder="Enter current password"
                  className="border-2 border-cream focus:border-teal transition-colors dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
              </div>
              <div>
                <Label htmlFor="newPassword" className="text-dark-blue font-medium dark:text-white">New Password</Label>
                <Input
                  id="newPassword"
                  type="password"
                  placeholder="Enter new password"
                  className="border-2 border-cream focus:border-teal transition-colors dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
              </div>
              <div>
                <Label htmlFor="confirmPassword" className="text-dark-blue font-medium dark:text-white">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="Confirm new password"
                  className="border-2 border-cream focus:border-teal transition-colors dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
              </div>
            </div>
          </div>
          
          {/* Gemini API Key Section */}
          <div className="space-y-4 border-t border-cream dark:border-gray-600 pt-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-purple-700 rounded-lg flex items-center justify-center">
                <Key className="w-4 h-4 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-navy dark:text-white">AI Configuration</h3>
                <p className="text-sm text-dark-blue/60 dark:text-gray-400">Configure your Gemini API key for AI email generation</p>
              </div>
            </div>
            
            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
              <Label htmlFor="geminiApiKey" className="text-blue-900 dark:text-blue-200 font-medium mb-2 block">
                Google Gemini API Key
              </Label>
              <Input
                id="geminiApiKey"
                type="password"
                placeholder="AIzaSy..."
                value={geminiApiKey}
                onChange={(e) => setGeminiApiKey(e.target.value)}
                className="mb-2"
              />
              <p className="text-sm text-blue-700 dark:text-blue-300">
                Get your free API key from{' '}
                <a 
                  href="https://aistudio.google.com/app/apikey" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="underline hover:text-blue-600"
                >
                  Google AI Studio
                </a>
              </p>
            </div>
          </div>

          <div className="flex justify-end space-x-4">
            <Button variant="outline" className="border-cream text-dark-blue hover:bg-cream/50 dark:border-gray-600 dark:text-white dark:hover:bg-gray-700">
              Cancel
            </Button>
            <Button 
              onClick={handleSaveSettings}
              className="bg-gradient-to-r from-navy to-dark-blue hover:from-dark-blue hover:to-navy text-white"
            >
              <Save className="w-4 h-4 mr-2" />
              Save Profile Settings
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Message Services Settings */}
      <MessageServiceSettings />
    </div>
  );
};

export default AccountSettingsPage;
