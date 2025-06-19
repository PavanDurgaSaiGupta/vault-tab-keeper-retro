
import React from 'react';
import { Search, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface SearchBarProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  selectedTag: string;
  onTagClear: () => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ 
  searchTerm, 
  onSearchChange, 
  selectedTag, 
  onTagClear 
}) => {
  return (
    <div className="sticky top-0 z-10 bg-dark-bg/90 backdrop-blur-sm border-b border-dark-border p-4">
      <div className="max-w-6xl mx-auto">
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-neon-green" />
          <Input
            type="text"
            placeholder="SEARCH BOOKMARKS..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-12 bg-dark-surface border-0 neon-border text-neon-green placeholder:text-neon-green/50 font-mono uppercase tracking-wider"
          />
        </div>
        
        {selectedTag && (
          <div className="flex items-center gap-2">
            <span className="text-sm font-mono text-neon-cyan">FILTER:</span>
            <div className="inline-flex items-center px-3 py-1 bg-neon-cyan/20 border border-neon-cyan rounded-sm">
              <span className="text-sm font-mono text-neon-cyan">#{selectedTag}</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={onTagClear}
                className="ml-2 p-0 h-auto text-neon-cyan hover:text-red-400"
              >
                <X className="w-3 h-3" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchBar;
