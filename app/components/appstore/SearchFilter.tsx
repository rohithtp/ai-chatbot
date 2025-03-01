'use client';

import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Search } from 'lucide-react';

interface SearchFilterProps {
  onSearch: (query: string) => void;
  onCategoryChange: (category: string) => void;
  selectedCategory: string;
}

const categories = [
  { value: 'all', label: 'All Categories' },
  { value: 'chat', label: 'Chat' },
  { value: 'productivity', label: 'Productivity' },
  { value: 'ai', label: 'AI & ML' },
  { value: 'tools', label: 'Tools' },
];

export default function SearchFilter({
  onSearch,
  onCategoryChange,
  selectedCategory,
}: SearchFilterProps) {
  return (
    <div className="flex flex-wrap gap-4">
      <div className="flex-grow min-w-[200px] relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search servers"
          onChange={(e) => onSearch(e.target.value)}
          className="w-full pl-9"
        />
      </div>
      <Select value={selectedCategory} onValueChange={onCategoryChange}>
        <SelectTrigger className="min-w-[200px]">
          <SelectValue placeholder="Select category" />
        </SelectTrigger>
        <SelectContent>
          {categories.map((category) => (
            <SelectItem key={category.value} value={category.value}>
              {category.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
} 