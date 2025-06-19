
import React, { useState } from 'react';
import { Save, X, Hash } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

interface Bookmark {
  title: string;
  url: string;
  summary: string;
  tags: string[];
}

interface AddBookmarkFormProps {
  onSubmit: (bookmark: Bookmark) => void;
  onCancel: () => void;
}

const AddBookmarkForm: React.FC<AddBookmarkFormProps> = ({ onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    title: '',
    url: '',
    summary: '',
    tags: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const tags = formData.tags
      .split(',')
      .map(tag => tag.trim())
      .filter(tag => tag.length > 0)
      .map(tag => tag.startsWith('#') ? tag : `#${tag}`);

    const bookmark: Bookmark = {
      title: formData.title,
      url: formData.url,
      summary: formData.summary,
      tags
    };

    onSubmit(bookmark);
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const isValid = formData.title && formData.url && formData.summary;

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-mono text-neon-green">ADD NEW BOOKMARK</h2>
        <Button
          onClick={onCancel}
          variant="ghost"
          size="sm"
          className="text-red-400 hover:text-red-300"
        >
          <X className="w-4 h-4" />
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="title" className="text-sm font-mono text-neon-cyan uppercase">
            Title *
          </Label>
          <Input
            id="title"
            type="text"
            value={formData.title}
            onChange={(e) => handleChange('title', e.target.value)}
            placeholder="Enter bookmark title..."
            className="bg-dark-bg border-neon-green/30 text-foreground font-mono"
            required
          />
        </div>

        <div>
          <Label htmlFor="url" className="text-sm font-mono text-neon-cyan uppercase">
            URL *
          </Label>
          <Input
            id="url"
            type="url"
            value={formData.url}
            onChange={(e) => handleChange('url', e.target.value)}
            placeholder="https://example.com"
            className="bg-dark-bg border-neon-green/30 text-foreground font-mono"
            required
          />
        </div>

        <div>
          <Label htmlFor="summary" className="text-sm font-mono text-neon-cyan uppercase">
            Summary *
          </Label>
          <Textarea
            id="summary"
            value={formData.summary}
            onChange={(e) => handleChange('summary', e.target.value)}
            placeholder="Brief description of the bookmark..."
            className="bg-dark-bg border-neon-green/30 text-foreground font-mono resize-none"
            rows={3}
            required
          />
        </div>

        <div>
          <Label htmlFor="tags" className="text-sm font-mono text-neon-cyan uppercase flex items-center">
            <Hash className="w-4 h-4 mr-1" />
            Tags
          </Label>
          <Input
            id="tags"
            type="text"
            value={formData.tags}
            onChange={(e) => handleChange('tags', e.target.value)}
            placeholder="ai, tools, productivity (comma separated)"
            className="bg-dark-bg border-neon-green/30 text-foreground font-mono"
          />
          <p className="text-xs text-muted-foreground font-mono mt-1">
            Separate tags with commas. # will be added automatically.
          </p>
        </div>

        <div className="flex gap-3 pt-4">
          <Button
            type="submit"
            disabled={!isValid}
            className="flex-1 bg-transparent border-2 border-neon-green text-neon-green hover:bg-neon-green hover:text-black font-mono transition-all duration-300"
          >
            <Save className="w-4 h-4 mr-2" />
            SAVE BOOKMARK
          </Button>
          <Button
            type="button"
            onClick={onCancel}
            variant="outline"
            className="flex-1 border-red-400 text-red-400 hover:bg-red-400 hover:text-black font-mono"
          >
            CANCEL
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AddBookmarkForm;
