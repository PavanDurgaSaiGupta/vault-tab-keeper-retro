
interface GitHubFile {
  content: string;
  sha?: string;
}

interface Bookmark {
  title: string;
  url: string;
  summary: string;
  tags: string[];
}

export class GitHubService {
  private baseUrl = 'https://api.github.com';
  private repo: string;
  private token: string;

  constructor(repo: string, token: string) {
    this.repo = repo;
    this.token = token;
    console.log('GitHub service initialized for repo:', repo);
  }

  private async request(endpoint: string, options: RequestInit = {}) {
    console.log(`Making GitHub API request to: ${endpoint}`);
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      ...options,
      headers: {
        'Authorization': `token ${this.token}`,
        'Accept': 'application/vnd.github.v3+json',
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`GitHub API error: ${response.status} ${response.statusText}`, errorText);
      throw new Error(`GitHub API error: ${response.status} ${response.statusText}`);
    }

    const result = await response.json();
    console.log('GitHub API response received successfully');
    return result;
  }

  async getFile(path: string): Promise<GitHubFile> {
    try {
      console.log(`Fetching file: ${path}`);
      const response = await this.request(`/repos/${this.repo}/contents/${path}`);
      const content = atob(response.content.replace(/\s/g, ''));
      console.log(`Successfully fetched ${path}, size: ${content.length} characters`);
      return {
        content,
        sha: response.sha,
      };
    } catch (error) {
      console.error(`Error fetching file ${path}:`, error);
      if (path === 'bookmarks.json') {
        console.log('Returning empty bookmarks array for missing file');
        return { content: '[]' };
      }
      throw error;
    }
  }

  async updateFile(path: string, content: string, sha?: string): Promise<void> {
    const timestamp = new Date().toISOString();
    const body = {
      message: `Update ${path} via TooManyTabs - ${timestamp}`,
      content: btoa(unescape(encodeURIComponent(content))),
      ...(sha && { sha }),
    };

    console.log(`Updating file: ${path} with SHA: ${sha || 'new file'}`);
    console.log('Content preview:', content.substring(0, 100) + '...');
    
    const result = await this.request(`/repos/${this.repo}/contents/${path}`, {
      method: 'PUT',
      body: JSON.stringify(body),
    });
    
    console.log(`Successfully updated ${path}`, result);
  }

  async getBookmarks(): Promise<Bookmark[]> {
    try {
      console.log('Loading bookmarks from GitHub...');
      const file = await this.getFile('bookmarks.json');
      
      if (!file.content || file.content.trim() === '') {
        console.log('Empty bookmarks file found');
        return [];
      }
      
      const bookmarks = JSON.parse(file.content);
      console.log(`Loaded ${bookmarks.length} bookmarks from GitHub`);
      return Array.isArray(bookmarks) ? bookmarks : [];
    } catch (error) {
      console.error('Error loading bookmarks:', error);
      return [];
    }
  }

  async saveBookmarks(bookmarks: Bookmark[]): Promise<void> {
    try {
      console.log(`Saving ${bookmarks.length} bookmarks to GitHub...`);
      
      // Get current file info (including SHA for updates)
      let sha: string | undefined;
      try {
        const currentFile = await this.getFile('bookmarks.json');
        sha = currentFile.sha;
        console.log('Found existing bookmarks.json with SHA:', sha);
      } catch (error) {
        console.log('bookmarks.json not found, will create new file');
      }
      
      const content = JSON.stringify(bookmarks, null, 2);
      await this.updateFile('bookmarks.json', content, sha);
      console.log('Successfully saved bookmarks to GitHub');
    } catch (error) {
      console.error('Error saving bookmarks:', error);
      throw error;
    }
  }

  async testConnection(): Promise<boolean> {
    try {
      console.log('Testing GitHub connection...');
      const result = await this.request(`/repos/${this.repo}`);
      console.log('GitHub connection test successful:', result.name);
      return true;
    } catch (error) {
      console.error('GitHub connection test failed:', error);
      return false;
    }
  }
}
