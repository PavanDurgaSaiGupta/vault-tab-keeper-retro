
import React, { useState } from 'react';
import { Lock, Terminal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface UnlockScreenProps {
  onUnlock: (password: string) => void;
  isLoading: boolean;
  error: string;
}

const UnlockScreen: React.FC<UnlockScreenProps> = ({ onUnlock, isLoading, error }) => {
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUnlock(password);
  };

  return (
    <div className="min-h-screen bg-dark-bg matrix-bg flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-dark-surface neon-border mb-6">
            <Terminal className="w-10 h-10 text-neon-green" />
          </div>
          
          <h1 className="text-4xl font-retro text-neon-green mb-2 glitch neon-text" data-text="TOOMANY">
            TOOMANY
          </h1>
          <h2 className="text-2xl font-retro text-neon-cyan mb-4">TABS</h2>
          <p className="text-sm text-muted-foreground font-mono">
            DIGITAL VAULT • UNAUTHORIZED ACCESS PROHIBITED
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-neon-green" />
            <Input
              type="password"
              placeholder="ENTER ACCESS CODE"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="pl-12 bg-dark-surface border-0 neon-border text-neon-green placeholder:text-neon-green/50 font-mono text-center uppercase tracking-wider"
              disabled={isLoading}
              autoFocus
            />
          </div>

          {error && (
            <div className="text-red-400 text-sm font-mono text-center bg-red-900/20 border border-red-900/30 rounded p-2">
              ERROR: {error.toUpperCase()}
            </div>
          )}

          <Button
            type="submit"
            disabled={isLoading || !password}
            className="w-full bg-transparent border-2 border-neon-green text-neon-green hover:bg-neon-green hover:text-black font-mono text-lg py-3 transition-all duration-300 hover:shadow-glow"
          >
            {isLoading ? (
              <span className="flex items-center justify-center">
                <span className="animate-spin mr-2">⚡</span>
                ACCESSING...
              </span>
            ) : (
              'UNLOCK VAULT'
            )}
          </Button>
        </form>

        <div className="mt-8 text-center">
          <div className="text-xs text-muted-foreground font-mono space-y-1">
            <p>SYSTEM STATUS: SECURE</p>
            <p>ENCRYPTION: SHA-256</p>
            <p className="terminal-cursor">READY</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UnlockScreen;
