
import React, { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from './AuthProvider';
import Dashboard from './Dashboard';

interface Bookmark {
  title: string;
  url: string;
  summary: string;
  tags: string[];
}

const BookmarkManager: React.FC = () => {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const { githubService, logout } = useAuth();
  const { toast } = useToast();

  // Mock bookmarks for demo
  const mockBookmarks: Bookmark[] = [
    {
      title: "ChatGPT",
      url: "https://chat.openai.com",
      summary: "Advanced AI assistant for coding, writing, and problem-solving",
      tags: ["#ai", "#productivity", "#coding"]
    },
    {
      title: "GitHub",
      url: "https://github.com",
      summary: "Code repository hosting and version control platform",
      tags: ["#development", "#git", "#collaboration"]
    },
    {
      title: "Tailwind CSS",
      url: "https://tailwindcss.com",
      summary: "Utility-first CSS framework for rapid UI development",
      tags: ["#css", "#design", "#frontend"]
    }
  ];

  useEffect(() => {
    loadBookmarks();
    testGitHubConnection();
  }, [githubService]);

  const testGitHubConnection = async () => {
    if (githubService) {
      try {
        console.log('BookmarkManager: Testing GitHub connection...');
        const isConnected = await githubService.testConnection();
        if (isConnected) {
          toast({
            title: "GITHUB CONNECTED",
            description: "Repository access confirmed",
          });
        }
      } catch (error) {
        console.error('BookmarkManager: GitHub connection test failed:', error);
        toast({
          title: "GITHUB WARNING",
          description: "Repository access may be limited",
          variant: "destructive",
        });
      }
    }
  };

  const loadBookmarks = async () => {
    try {
      console.log('BookmarkManager: Loading bookmarks...');
      if (githubService) {
        const githubBookmarks = await githubService.getBookmarks();
        if (githubBookmarks.length > 0) {
          setBookmarks(githubBookmarks);
          toast({
            title: "BOOKMARKS SYNCED",
            description: `Loaded ${githubBookmarks.length} bookmarks from GitHub`,
          });
        } else {
          setBookmarks(mockBookmarks);
          toast({
            title: "DEMO MODE",
            description: "Using sample bookmarks - GitHub repo is empty",
          });
        }
      } else {
        setBookmarks(mockBookmarks);
        toast({
          title: "DEMO MODE",
          description: "Using sample bookmarks",
        });
      }
    } catch (error) {
      console.error('BookmarkManager: Error loading bookmarks:', error);
      setBookmarks(mockBookmarks);
      toast({
        title: "CONNECTION FAILED",
        description: "Using demo data. Check GitHub configuration.",
        variant: "destructive",
      });
    }
  };

  const handleAddBookmark = async (bookmark: Bookmark) => {
    try {
      console.log('BookmarkManager: Adding new bookmark:', bookmark);
      const updatedBookmarks = [...bookmarks, bookmark];
      setBookmarks(updatedBookmarks);
      
      if (githubService) {
        console.log('BookmarkManager: Syncing to GitHub...');
        await githubService.saveBookmarks(updatedBookmarks);
        toast({
          title: "BOOKMARK SAVED",
          description: "Successfully synchronized with GitHub repository",
        });
      } else {
        toast({
          title: "BOOKMARK ADDED", 
          description: "Saved locally (GitHub sync unavailable)",
        });
      }
    } catch (error) {
      console.error('BookmarkManager: Error saving bookmark:', error);
      toast({
        title: "SYNC FAILED",
        description: "Could not save to GitHub repository",
        variant: "destructive",
      });
    }
  };

  return (
    <Dashboard
      bookmarks={bookmarks}
      onAddBookmark={handleAddBookmark}
      onLogout={logout}
    />
  );
};

export default BookmarkManager;
