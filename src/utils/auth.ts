
// SHA-256 password hashing utility
export const hashPassword = async (password: string): Promise<string> => {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
};

// Verify password against stored hash
export const verifyPassword = async (password: string, storedHash: string): Promise<boolean> => {
  const inputHash = await hashPassword(password);
  return inputHash === storedHash;
};

// Default configuration - replace with your own hash
export const CONFIG = {
  passwordHash: 'a665a45920422f9d417e4867efdc4fb8a04a1f3fff1fa07e998e86f7f7a27ae3', // "hello"
  githubRepo: 'your-username/your-repo',
  githubToken: '' // Will be set by user
};
