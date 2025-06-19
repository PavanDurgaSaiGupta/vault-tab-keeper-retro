
import React from 'react';
import { ExternalLink, Hash } from 'lucide-react';
import { Card } from '@/components/ui/card';

interface Bookmark {
  title: string;
  url: string;
  summary: string;
  tags: string[];
}

interface BookmarkCardProps {
  bookmark: Bookmark;
  onTagClick: (tag: string) => void;
}

const BookmarkCard: React.FC<BookmarkCardProps> = ({ bookmark, onTagClick }) => {
  const handleCardClick = () => {
    window.open(bookmark.url, '_blank', 'noopener,noreferrer');
  };

  return (
    <Card className="bg-dark-surface neon-border hover:shadow-glow transition-all duration-300 cursor-pointer group">
      <div className="p-4" onClick={handleCardClick}>
        <div className="flex items-start justify-between mb-3">
          <h3 className="text-lg font-mono text-neon-green group-hover:text-terminal-green transition-colors duration-200 line-clamp-2">
            {bookmark.title}
          </h3>
          <ExternalLink className="w-4 h-4 text-neon-cyan opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex-shrink-0 ml-2" />
        </div>
        
        <p className="text-sm text-muted-foreground font-mono mb-4 line-clamp-3">
          {bookmark.summary}
        </p>
        
        <div className="flex flex-wrap gap-2">
          {bookmark.tags.map((tag, index) => (
            <button
              key={index}
              onClick={(e) => {
                e.stopPropagation();
                onTagClick(tag);
              }}
              className="inline-flex items-center px-2 py-1 text-xs font-mono bg-transparent border border-neon-cyan/30 text-neon-cyan hover:border-neon-cyan hover:shadow-glow-cyan transition-all duration-200 rounded-sm"
            >
              <Hash className="w-3 h-3 mr-1" />
              {tag.replace('#', '')}
            </button>
          ))}
        </div>
      </div>
    </Card>
  );
};

export default BookmarkCard;
