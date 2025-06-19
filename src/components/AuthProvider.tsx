
import React, { createContext, useContext, useState } from 'react';
import { verifyPassword, CONFIG } from '@/utils/auth';
import { GitHubService } from '@/utils/github';
import { useToast } from '@/hooks/use-toast';

interface AuthContextType {
  isAuthenticated: boolean;
  githubService: GitHubService | null;
  login: (password: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
  error: string;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [githubService, setGithubService] = useState<GitHubService | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const { toast } = useToast();

  const login = async (password: string): Promise<boolean> => {
    setIsLoading(true);
    setError('');
    
    try {
      console.log('AuthProvider: Attempting login with password:', password);
      const isValid = await verifyPassword(password, CONFIG.passwordHash);
      
      if (isValid) {
        console.log('AuthProvider: Password verified successfully');
        setIsAuthenticated(true);
        
        // Initialize GitHub service
        if (CONFIG.githubToken && CONFIG.githubRepo) {
          const service = new GitHubService(CONFIG.githubRepo, CONFIG.githubToken);
          setGithubService(service);
          console.log('AuthProvider: GitHub service initialized');
        }
        
        toast({
          title: "ACCESS GRANTED",
          description: "Welcome to TOOMANY TABS Vault",
        });
        
        return true;
      } else {
        console.log('AuthProvider: Invalid password');
        setError('Invalid access code. Use: 202069');
        return false;
      }
    } catch (error) {
      console.error('AuthProvider: Login error:', error);
      setError('Authentication failed');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    console.log('AuthProvider: Logging out');
    setIsAuthenticated(false);
    setGithubService(null);
    setError('');
    toast({
      title: "LOGGED OUT",
      description: "Vault secured. Access terminated.",
    });
  };

  const value = {
    isAuthenticated,
    githubService,
    login,
    logout,
    isLoading,
    error
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
