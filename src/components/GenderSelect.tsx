
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface GenderSelectProps {
  value: string;
  onValueChange: (value: string) => void;
}

const GenderSelect = ({ value, onValueChange }: GenderSelectProps) => {
  return (
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger className="w-full">
        <SelectValue placeholder="Select gender" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="male">Male</SelectItem>
        <SelectItem value="female">Female</SelectItem>
      </SelectContent>
    </Select>
  );
};

export default GenderSelect;
