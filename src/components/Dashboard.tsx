
import React, { useState, useMemo } from 'react';
import { Plus, Github, Terminal, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import BookmarkCard from './BookmarkCard';
import SearchBar from './SearchBar';
import AddBookmarkForm from './AddBookmarkForm';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';

interface Bookmark {
  title: string;
  url: string;
  summary: string;
  tags: string[];
}

interface DashboardProps {
  bookmarks: Bookmark[];
  onAddBookmark: (bookmark: Bookmark) => void;
  onLogout: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ bookmarks, onAddBookmark, onLogout }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTag, setSelectedTag] = useState('');
  const [isAddFormOpen, setIsAddFormOpen] = useState(false);

  const filteredBookmarks = useMemo(() => {
    return bookmarks.filter(bookmark => {
      const matchesSearch = !searchTerm || 
        bookmark.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        bookmark.summary.toLowerCase().includes(searchTerm.toLowerCase()) ||
        bookmark.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesTag = !selectedTag || 
        bookmark.tags.some(tag => tag.toLowerCase().includes(selectedTag.toLowerCase()));
      
      return matchesSearch && matchesTag;
    });
  }, [bookmarks, searchTerm, selectedTag]);

  const allTags = useMemo(() => {
    const tags = new Set<string>();
    bookmarks.forEach(bookmark => {
      bookmark.tags.forEach(tag => {
        tags.add(tag.replace('#', '').toLowerCase());
      });
    });
    return Array.from(tags).sort();
  }, [bookmarks]);

  const handleTagClick = (tag: string) => {
    const cleanTag = tag.replace('#', '').toLowerCase();
    setSelectedTag(cleanTag === selectedTag ? '' : cleanTag);
  };

  const handleAddBookmark = (bookmark: Bookmark) => {
    onAddBookmark(bookmark);
    setIsAddFormOpen(false);
  };

  return (
    <div className="min-h-screen bg-dark-bg matrix-bg">
      {/* Header */}
      <header className="border-b border-dark-border bg-dark-surface/50 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Terminal className="w-8 h-8 text-neon-green" />
            <div>
              <h1 className="text-2xl font-retro text-neon-green neon-text">TOOMANY</h1>
              <h2 className="text-lg font-retro text-neon-cyan">TABS</h2>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Dialog open={isAddFormOpen} onOpenChange={setIsAddFormOpen}>
              <DialogTrigger asChild>
                <Button className="bg-transparent border border-neon-green text-neon-green hover:bg-neon-green hover:text-black font-mono transition-all duration-300">
                  <Plus className="w-4 h-4 mr-2" />
                  ADD
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-dark-surface border-neon-green/30 text-foreground max-w-2xl">
                <AddBookmarkForm onSubmit={handleAddBookmark} onCancel={() => setIsAddFormOpen(false)} />
              </DialogContent>
            </Dialog>
            
            <Button 
              onClick={onLogout}
              variant="ghost" 
              size="sm"
              className="text-red-400 hover:text-red-300 font-mono"
            >
              LOGOUT
            </Button>
          </div>
        </div>
      </header>

      <SearchBar
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        selectedTag={selectedTag}
        onTagClear={() => setSelectedTag('')}
      />

      {/* Stats */}
      <div className="max-w-6xl mx-auto px-4 py-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-dark-surface neon-border p-4 text-center">
            <div className="text-2xl font-mono text-neon-green">{bookmarks.length}</div>
            <div className="text-sm font-mono text-muted-foreground">TOTAL BOOKMARKS</div>
          </div>
          <div className="bg-dark-surface neon-border p-4 text-center">
            <div className="text-2xl font-mono text-neon-cyan">{allTags.length}</div>
            <div className="text-sm font-mono text-muted-foreground">UNIQUE TAGS</div>
          </div>
          <div className="bg-dark-surface neon-border p-4 text-center">
            <div className="text-2xl font-mono text-terminal-green">{filteredBookmarks.length}</div>
            <div className="text-sm font-mono text-muted-foreground">FILTERED RESULTS</div>
          </div>
        </div>

        {/* Tag Cloud */}
        {allTags.length > 0 && (
          <div className="mb-6 p-4 bg-dark-surface neon-border">
            <h3 className="text-lg font-mono text-neon-green mb-3">TAG CLOUD</h3>
            <div className="flex flex-wrap gap-2">
              {allTags.map(tag => (
                <button
                  key={tag}
                  onClick={() => handleTagClick(tag)}
                  className={`px-3 py-1 text-sm font-mono border rounded-sm transition-all duration-200 ${
                    selectedTag === tag
                      ? 'border-neon-cyan text-neon-cyan bg-neon-cyan/20 shadow-glow-cyan'
                      : 'border-neon-green/30 text-neon-green hover:border-neon-green hover:shadow-glow'
                  }`}
                >
                  #{tag}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Bookmarks Grid */}
        {filteredBookmarks.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredBookmarks.map((bookmark, index) => (
              <BookmarkCard
                key={index}
                bookmark={bookmark}
                onTagClick={handleTagClick}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Zap className="w-16 h-16 text-neon-green/30 mx-auto mb-4" />
            <p className="text-lg font-mono text-muted-foreground">
              {searchTerm || selectedTag ? 'NO MATCHES FOUND' : 'NO BOOKMARKS YET'}
            </p>
            <p className="text-sm font-mono text-muted-foreground mt-2">
              {searchTerm || selectedTag ? 'TRY DIFFERENT SEARCH TERMS' : 'ADD YOUR FIRST BOOKMARK TO GET STARTED'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
