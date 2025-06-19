
import React, { useState, useEffect } from 'react';
import UnlockScreen from '@/components/UnlockScreen';
import Dashboard from '@/components/Dashboard';
import { verifyPassword, CONFIG, hashPassword } from '@/utils/auth';
import { GitHubService } from '@/utils/github';
import { useToast } from '@/hooks/use-toast';

interface Bookmark {
  title: string;
  url: string;
  summary: string;
  tags: string[];
}

const Index = () => {
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [githubService, setGitHubService] = useState<GitHubService | null>(null);
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

  // Debug: Show correct password hash on component mount
  useEffect(() => {
    const generateHash = async () => {
      const hash = await hashPassword('202069');
      console.log('Expected hash for password "202069":', hash);
      console.log('Stored hash in config:', CONFIG.passwordHash);
    };
    generateHash();
  }, []);

  useEffect(() => {
    if (isUnlocked) {
      loadBookmarks();
      testGitHubConnection();
    }
  }, [isUnlocked]);

  const testGitHubConnection = async () => {
    if (githubService) {
      try {
        console.log('Testing GitHub connection...');
        const isConnected = await githubService.testConnection();
        if (isConnected) {
          toast({
            title: "GITHUB CONNECTED",
            description: "Repository access confirmed",
          });
          console.log('GitHub connection successful');
        }
      } catch (error) {
        console.error('GitHub connection test failed:', error);
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
      console.log('Loading bookmarks...');
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
      console.error('Error loading bookmarks:', error);
      setBookmarks(mockBookmarks);
      toast({
        title: "CONNECTION FAILED",
        description: "Using demo data. Check GitHub configuration.",
        variant: "destructive",
      });
    }
  };

  const handleUnlock = async (password: string) => {
    setIsLoading(true);
    setError('');

    try {
      console.log('Attempting to unlock with password:', password);
      console.log('Expected password: 202069');
      
      const isValid = await verifyPassword(password, CONFIG.passwordHash);
      
      if (isValid) {
        console.log('Password verified successfully');
        setIsUnlocked(true);
        
        // Initialize GitHub service
        if (CONFIG.githubToken && CONFIG.githubRepo) {
          const service = new GitHubService(CONFIG.githubRepo, CONFIG.githubToken);
          setGitHubService(service);
          console.log('GitHub service initialized:', CONFIG.githubRepo);
        }
        
        toast({
          title: "ACCESS GRANTED",
          description: "Welcome to TooManyTabs Digital Vault",
        });
      } else {
        console.log('Invalid password provided');
        setError('Invalid access code. Use: 202069');
      }
    } catch (error) {
      console.error('Auth error:', error);
      setError('Authentication failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddBookmark = async (bookmark: Bookmark) => {
    try {
      console.log('Adding new bookmark:', bookmark);
      const updatedBookmarks = [...bookmarks, bookmark];
      setBookmarks(updatedBookmarks);
      
      if (githubService) {
        console.log('Syncing new bookmark to GitHub...');
        await githubService.saveBookmarks(updatedBookmarks);
        toast({
          title: "BOOKMARK SAVED",
          description: "Successfully synchronized with GitHub repository",
        });
        console.log('Bookmark successfully saved to GitHub');
      } else {
        toast({
          title: "BOOKMARK ADDED",
          description: "Saved locally (GitHub sync unavailable)",
        });
      }
    } catch (error) {
      console.error('Error saving bookmark:', error);
      toast({
        title: "SYNC FAILED",
        description: "Could not save to GitHub repository",
        variant: "destructive",
      });
    }
  };

  const handleLogout = () => {
    console.log('Logging out...');
    setIsUnlocked(false);
    setBookmarks([]);
    setGitHubService(null);
    setError('');
    toast({
      title: "LOGGED OUT",
      description: "Vault secured. Access terminated.",
    });
  };

  if (!isUnlocked) {
    return (
      <UnlockScreen
        onUnlock={handleUnlock}
        isLoading={isLoading}
        error={error}
      />
    );
  }

  return (
    <Dashboard
      bookmarks={bookmarks}
      onAddBookmark={handleAddBookmark}
      onLogout={handleLogout}
    />
  );
};

export default Index;
