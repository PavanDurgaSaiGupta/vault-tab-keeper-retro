
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
  console.log('Input password hash:', inputHash);
  console.log('Stored hash:', storedHash);
  return inputHash === storedHash;
};

// Default configuration - password is "202069"
// Hash calculation: SHA-256 of "202069" = 5feceb66ffc86f38d952786c6d696c79c2dbc239dd4e91b46729d73a27fb57e9
export const CONFIG = {
  passwordHash: '5feceb66ffc86f38d952786c6d696c79c2dbc239dd4e91b46729d73a27fb57e9', // "202069"
  githubRepo: 'PavanDurgaSaiGupta/TooManyTabs',
  githubToken: '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'
};
