
// Password verification utility
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
  console.log('Auth: Verifying password...');
  console.log('Auth: Input hash:', inputHash);
  console.log('Auth: Stored hash:', storedHash);
  const isValid = inputHash === storedHash;
  console.log('Auth: Password valid:', isValid);
  return isValid;
};

// Configuration with correct password hash for "202069"
export const CONFIG = {
  passwordHash: '2cbd2f44b21adb2249f4a94a98ae9867fc6cc9bf76c9ca1c88d7ece475ba9051', // "202069"
  githubRepo: 'PavanDurgaSaiGupta/TooManyTabs',
  githubToken: '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'
};
