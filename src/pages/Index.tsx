
import React from 'react';
import { AuthProvider, useAuth } from '@/components/AuthProvider';
import UnlockScreen from '@/components/UnlockScreen';
import BookmarkManager from '@/components/BookmarkManager';

const AppContent: React.FC = () => {
  const { isAuthenticated, login, isLoading, error } = useAuth();

  console.log('AppContent: Authentication state:', isAuthenticated);

  if (!isAuthenticated) {
    return (
      <UnlockScreen
        onUnlock={login}
        isLoading={isLoading}
        error={error}
      />
    );
  }

  return <BookmarkManager />;
};

const Index: React.FC = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

export default Index;
