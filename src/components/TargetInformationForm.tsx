
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { User, Calendar, MapPin, Users, Heart, MessageSquare, FileText, Building, Briefcase } from 'lucide-react';

interface TargetInformationFormProps {
  onSubmit: (data: TargetInformation) => void;
}

export interface TargetInformation {
  name: string;
  age: string;
  gender: string;
  department: string;
  city: string;
  dob: string;
  hobbies: string;
  familyInfo: string;
  socialInfo: string;
  employeeHistory: string; // Added new field
  additionalInfo: string;
}

const TargetInformationForm = ({ onSubmit }: TargetInformationFormProps) => {
  const [formData, setFormData] = useState<TargetInformation>({
    name: '',
    age: '',
    gender: '',
    department: '',
    city: '',
    dob: '',
    hobbies: '',
    familyInfo: '',
    socialInfo: '',
    employeeHistory: '', // Initialize new field
    additionalInfo: ''
  });

  const departments = [
    'Human Resources',
    'Information Technology', 
    'Finance',
    'Marketing',
    'Sales',
    'Operations',
    'Legal',
    'Administration',
    'Customer Service',
    'Research & Development',
    'Security',
    'Other'
  ];

  const handleInputChange = (field: keyof TargetInformation, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const isFormValid = formData.name && formData.age && formData.gender && 
                     formData.department && formData.city && formData.dob && 
                     formData.hobbies && formData.familyInfo && formData.socialInfo &&
                     formData.employeeHistory; // Added to validation

  return (
    <Card className="bg-white border-cream shadow-lg dark:bg-gray-800 dark:border-gray-700">
      <CardHeader>
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-teal to-navy rounded-lg flex items-center justify-center">
            <User className="w-5 h-5 text-white" />
          </div>
          <div>
            <CardTitle className="text-navy dark:text-white">Target Profile</CardTitle>
            <CardDescription className="dark:text-gray-400">
              Provide details about the target to create a personalized security awareness drill
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Primary Information Grid - 3 columns */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <Label htmlFor="name" className="text-dark-blue font-medium dark:text-white flex items-center mb-2">
                <User className="w-4 h-4 mr-2" />
                Name *
              </Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="Enter full name"
                className="border-2 border-cream focus:border-teal transition-colors dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                required
              />
            </div>

            <div>
              <Label htmlFor="age" className="text-dark-blue font-medium dark:text-white flex items-center mb-2">
                <Calendar className="w-4 h-4 mr-2" />
                Age *
              </Label>
              <Input
                id="age"
                type="number"
                value={formData.age}
                onChange={(e) => handleInputChange('age', e.target.value)}
                placeholder="Enter age"
                className="border-2 border-cream focus:border-teal transition-colors dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                required
              />
            </div>

            <div>
              <Label htmlFor="gender" className="text-dark-blue font-medium dark:text-white mb-2 block">
                Gender *
              </Label>
              <Select value={formData.gender} onValueChange={(value) => handleInputChange('gender', value)}>
                <SelectTrigger className="border-2 border-cream focus:border-teal dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent className="dark:bg-gray-700 dark:border-gray-600">
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                  <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Secondary Information Grid - 3 columns */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <Label htmlFor="city" className="text-dark-blue font-medium dark:text-white flex items-center mb-2">
                <MapPin className="w-4 h-4 mr-2" />
                City *
              </Label>
              <Input
                id="city"
                value={formData.city}
                onChange={(e) => handleInputChange('city', e.target.value)}
                placeholder="Enter city"
                className="border-2 border-cream focus:border-teal transition-colors dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                required
              />
            </div>

            <div>
              <Label htmlFor="dob" className="text-dark-blue font-medium dark:text-white flex items-center mb-2">
                <Calendar className="w-4 h-4 mr-2" />
                Date of Birth *
              </Label>
              <Input
                id="dob"
                type="date"
                value={formData.dob}
                onChange={(e) => handleInputChange('dob', e.target.value)}
                className="border-2 border-cream focus:border-teal transition-colors dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                required
              />
            </div>

            <div>
              <Label htmlFor="department" className="text-dark-blue font-medium dark:text-white flex items-center mb-2">
                <Building className="w-4 h-4 mr-2" />
                Department *
              </Label>
              <Select value={formData.department} onValueChange={(value) => handleInputChange('department', value)}>
                <SelectTrigger className="border-2 border-cream focus:border-teal dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                  <SelectValue placeholder="Select department" />
                </SelectTrigger>
                <SelectContent className="dark:bg-gray-700 dark:border-gray-600">
                  {departments.map((dept) => (
                    <SelectItem key={dept} value={dept.toLowerCase().replace(/\s+/g, '-')}>
                      {dept}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Hobbies - Full Width */}
          <div>
            <Label htmlFor="hobbies" className="text-dark-blue font-medium dark:text-white flex items-center mb-2">
              <Heart className="w-4 h-4 mr-2" />
              Hobbies/Interests *
            </Label>
            <Textarea
              id="hobbies"
              value={formData.hobbies}
              onChange={(e) => handleInputChange('hobbies', e.target.value)}
              placeholder="e.g., reading, sports, gaming, cooking, traveling"
              className="border-2 border-cream focus:border-teal transition-colors dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              rows={3}
              required
            />
          </div>

          {/* Employee History - New Field */}
          <div>
            <Label htmlFor="employeeHistory" className="text-dark-blue font-medium dark:text-white flex items-center mb-2">
              <Briefcase className="w-4 h-4 mr-2" />
              Employee History *
            </Label>
            <Textarea
              id="employeeHistory"
              value={formData.employeeHistory}
              onChange={(e) => handleInputChange('employeeHistory', e.target.value)}
              placeholder="e.g., previous roles, years of experience, skills, certifications, current responsibilities"
              className="border-2 border-cream focus:border-teal transition-colors dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              rows={4}
              required
            />
          </div>

          {/* Additional Information Grid - 2 columns */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="familyInfo" className="text-dark-blue font-medium dark:text-white flex items-center mb-2">
                <Users className="w-4 h-4 mr-2" />
                Family Information *
              </Label>
              <Textarea
                id="familyInfo"
                value={formData.familyInfo}
                onChange={(e) => handleInputChange('familyInfo', e.target.value)}
                placeholder="e.g., married, 2 children, spouse works in healthcare"
                className="border-2 border-cream focus:border-teal transition-colors dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                rows={4}
                required
              />
            </div>

            <div>
              <Label htmlFor="socialInfo" className="text-dark-blue font-medium dark:text-white flex items-center mb-2">
                <MessageSquare className="w-4 h-4 mr-2" />
                Social Information *
              </Label>
              <Textarea
                id="socialInfo"
                value={formData.socialInfo}
                onChange={(e) => handleInputChange('socialInfo', e.target.value)}
                placeholder="e.g., active on LinkedIn, Facebook, participates in community events"
                className="border-2 border-cream focus:border-teal transition-colors dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                rows={4}
                required
              />
            </div>
          </div>

          {/* Additional Information - Full Width */}
          <div>
            <Label htmlFor="additionalInfo" className="text-dark-blue font-medium dark:text-white flex items-center mb-2">
              <FileText className="w-4 h-4 mr-2" />
              Additional Information
            </Label>
            <Textarea
              id="additionalInfo"
              value={formData.additionalInfo}
              onChange={(e) => handleInputChange('additionalInfo', e.target.value)}
              placeholder="Any other relevant information that might help in creating a personalized security drill"
              className="border-2 border-cream focus:border-teal transition-colors dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              rows={3}
            />
          </div>

          <div className="flex justify-end">
            <Button
              type="submit"
              disabled={!isFormValid}
              className="bg-gradient-to-r from-teal to-navy hover:from-navy hover:to-teal text-white px-8 py-2"
            >
              Generate Security Drill
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default TargetInformationForm;
