
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
  }

  private async request(endpoint: string, options: RequestInit = {}) {
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
      throw new Error(`GitHub API error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  async getFile(path: string): Promise<GitHubFile> {
    try {
      const response = await this.request(`/repos/${this.repo}/contents/${path}`);
      const content = atob(response.content.replace(/\s/g, ''));
      return {
        content,
        sha: response.sha,
      };
    } catch (error) {
      console.error(`Error fetching file ${path}:`, error);
      return { content: '[]' }; // Return empty array for bookmarks
    }
  }

  async updateFile(path: string, content: string, sha?: string): Promise<void> {
    const body = {
      message: `Update ${path}`,
      content: btoa(content),
      ...(sha && { sha }),
    };

    await this.request(`/repos/${this.repo}/contents/${path}`, {
      method: 'PUT',
      body: JSON.stringify(body),
    });
  }

  async getBookmarks(): Promise<Bookmark[]> {
    try {
      const file = await this.getFile('bookmarks.json');
      return JSON.parse(file.content);
    } catch (error) {
      console.error('Error loading bookmarks:', error);
      return [];
    }
  }

  async saveBookmarks(bookmarks: Bookmark[]): Promise<void> {
    try {
      const file = await this.getFile('bookmarks.json');
      const content = JSON.stringify(bookmarks, null, 2);
      await this.updateFile('bookmarks.json', content, file.sha);
    } catch (error) {
      console.error('Error saving bookmarks:', error);
      throw error;
    }
  }
}
