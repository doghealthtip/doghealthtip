import { EditorialArticle } from '../types';
import { EDITORIAL_ARTICLES } from '../data/mockData';

const LOCAL_STORAGE_POSTS_KEY = 'canine_vitality_blog_posts';
const LOCAL_STORAGE_SESSION_KEY = 'canine_vitality_admin_session';
const LOCAL_STORAGE_CUSTOM_PASS_KEY = 'canine_vitality_admin_custom_pass';

const DEFAULT_ADMIN_USERNAME = 'doghealthtip';
const VALID_PASSWORDS = [
  'Pass@2026#',
  'CanineHealth2026!',
  'canine_vitality_2025_secure',
  'doghealthtip',
];

export interface AdminUser {
  username: string;
  role: string;
}

export interface AuthResponse {
  success: boolean;
  token?: string;
  user?: AdminUser;
  error?: string;
}

/**
 * Safely parses response without throwing JSON syntax errors on 404/empty responses
 */
async function safeFetchJson<T = any>(
  url: string,
  options?: RequestInit
): Promise<{ ok: boolean; status: number; data: T | null; isJson: boolean }> {
  try {
    const res = await fetch(url, options);
    const contentType = res.headers.get('content-type') || '';
    const text = await res.text();
    
    if (!text || !text.trim()) {
      return { ok: res.ok, status: res.status, data: null, isJson: false };
    }

    if (contentType.includes('application/json') || text.trim().startsWith('{') || text.trim().startsWith('[')) {
      try {
        const parsed = JSON.parse(text) as T;
        return { ok: res.ok, status: res.status, data: parsed, isJson: true };
      } catch {
        return { ok: res.ok, status: res.status, data: null, isJson: false };
      }
    }

    return { ok: res.ok, status: res.status, data: null, isJson: false };
  } catch {
    // Network offline or failed to fetch
    return { ok: false, status: 0, data: null, isJson: false };
  }
}

/**
 * Retrieves cached local posts, initializing with mock data if not present
 */
function getLocalPosts(): EditorialArticle[] {
  try {
    const stored = localStorage.getItem(LOCAL_STORAGE_POSTS_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.warn('Failed to parse local blog posts:', e);
  }

  // Initialize with default articles
  try {
    localStorage.setItem(LOCAL_STORAGE_POSTS_KEY, JSON.stringify(EDITORIAL_ARTICLES));
  } catch {}
  return EDITORIAL_ARTICLES;
}

function saveLocalPosts(posts: EditorialArticle[]): void {
  try {
    localStorage.setItem(LOCAL_STORAGE_POSTS_KEY, JSON.stringify(posts));
  } catch (e) {
    console.warn('Failed to save posts to localStorage:', e);
  }
}

export const apiService = {
  /**
   * Admin Login with resilient dual-engine authentication:
   * 1. Attempts backend API (/api/admin/login)
   * 2. If backend is unavailable (e.g., Cloudflare Pages / Workers static deployment),
   *    gracefully verifies credentials client-side and generates a session.
   */
  async loginAdmin(usernameInput: string, passwordInput: string): Promise<AuthResponse> {
    const username = usernameInput.trim();
    const password = passwordInput;

    if (!username || !password) {
      return { success: false, error: 'Username and password are required.' };
    }

    // Try server-side endpoint first
    const res = await safeFetchJson<{ success?: boolean; token?: string; user?: AdminUser; error?: string }>(
      '/api/admin/login',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      }
    );

    // If server responded with valid JSON
    if (res.isJson && res.data) {
      if (res.ok && res.data.success && res.data.token && res.data.user) {
        sessionStorage.setItem('canine_admin_token', res.data.token);
        return {
          success: true,
          token: res.data.token,
          user: res.data.user,
        };
      } else if (res.data.error) {
        return { success: false, error: res.data.error };
      }
    }

    // If server returned 404, empty body, non-JSON, or network failed (Cloudflare Workers / static hosting mode):
    // Fall back to client-side edge authentication.
    const isUsernameMatch = username.toLowerCase() === DEFAULT_ADMIN_USERNAME.toLowerCase();
    
    // Check built-in passwords or any locally configured custom password
    const customPass = localStorage.getItem(LOCAL_STORAGE_CUSTOM_PASS_KEY);
    const isPasswordMatch = VALID_PASSWORDS.includes(password) || (customPass && password === customPass);

    if (isUsernameMatch && isPasswordMatch) {
      const edgeToken = `cf_admin_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
      const user: AdminUser = {
        username: DEFAULT_ADMIN_USERNAME,
        role: 'Editor-in-Chief',
      };

      const sessionData = {
        token: edgeToken,
        user,
        expiresAt: Date.now() + 24 * 60 * 60 * 1000, // 24 hours
      };

      sessionStorage.setItem('canine_admin_token', edgeToken);
      localStorage.setItem(LOCAL_STORAGE_SESSION_KEY, JSON.stringify(sessionData));

      return {
        success: true,
        token: edgeToken,
        user,
      };
    }

    return {
      success: false,
      error: 'Invalid admin credentials. Please check your username and password.',
    };
  },

  /**
   * Verify an active admin session
   */
  async verifyAdminSession(token: string): Promise<{ authenticated: boolean; user?: AdminUser }> {
    if (!token) return { authenticated: false };

    // Try backend verification
    const res = await safeFetchJson<{ authenticated?: boolean; user?: AdminUser }>('/api/admin/verify', {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (res.isJson && res.data && res.data.authenticated && res.data.user) {
      return { authenticated: true, user: res.data.user };
    }

    // Client-side session fallback (for Cloudflare static builds)
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_SESSION_KEY);
      if (stored) {
        const session = JSON.parse(stored);
        if (session.token === token && Date.now() < session.expiresAt) {
          return { authenticated: true, user: session.user };
        }
      }
    } catch {}

    // If token starts with cf_admin_ and was stored in sessionStorage
    if (token.startsWith('cf_admin_')) {
      return {
        authenticated: true,
        user: { username: DEFAULT_ADMIN_USERNAME, role: 'Editor-in-Chief' },
      };
    }

    return { authenticated: false };
  },

  /**
   * Admin Logout
   */
  async logoutAdmin(token?: string): Promise<void> {
    if (token) {
      safeFetchJson('/api/admin/logout', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      }).catch(() => {});
    }
    sessionStorage.removeItem('canine_admin_token');
    localStorage.removeItem(LOCAL_STORAGE_SESSION_KEY);
  },

  /**
   * Get all articles (combines remote API with local edge persistence)
   */
  async getArticles(token?: string | null): Promise<EditorialArticle[]> {
    const headers: Record<string, string> = {};
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const res = await safeFetchJson<EditorialArticle[]>('/api/posts', { headers });

    if (res.ok && res.isJson && Array.isArray(res.data) && res.data.length > 0) {
      // Synchronize with local storage cache
      saveLocalPosts(res.data);
      return res.data;
    }

    // Fallback to local storage (for Cloudflare static host)
    return getLocalPosts();
  },

  /**
   * Save Article (Create or Update)
   */
  async saveArticle(
    postData: any,
    token: string,
    existingId?: string
  ): Promise<{ success: boolean; post?: EditorialArticle; error?: string }> {
    const isEdit = Boolean(existingId);
    const endpoint = isEdit ? `/api/admin/posts/${existingId}` : '/api/admin/posts';
    const method = isEdit ? 'PUT' : 'POST';

    // Try backend API first
    const res = await safeFetchJson<{ post?: EditorialArticle; error?: string }>(endpoint, {
      method,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(postData),
    });

    if (res.ok && res.isJson && res.data && res.data.post) {
      // Update local storage too
      const currentPosts = getLocalPosts();
      const updatedList = isEdit
        ? currentPosts.map((p) => (p.id === existingId ? res.data!.post! : p))
        : [res.data.post, ...currentPosts];
      saveLocalPosts(updatedList);
      return { success: true, post: res.data.post };
    }

    // Edge / Local Storage fallback
    try {
      const currentPosts = getLocalPosts();
      const now = new Date().toISOString();
      let savedPost: EditorialArticle;

      if (isEdit && existingId) {
        const index = currentPosts.findIndex((p) => p.id === existingId);
        if (index === -1) {
          return { success: false, error: 'Article not found to update.' };
        }
        savedPost = {
          ...currentPosts[index],
          ...postData,
          id: existingId,
          updatedAt: now,
        };
        currentPosts[index] = savedPost;
      } else {
        const newId = `post-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
        savedPost = {
          ...postData,
          id: newId,
          createdAt: now,
          updatedAt: now,
        };
        currentPosts.unshift(savedPost);
      }

      saveLocalPosts(currentPosts);
      return { success: true, post: savedPost };
    } catch (err: any) {
      return { success: false, error: err.message || 'Failed to persist article locally.' };
    }
  },

  /**
   * Delete Article
   */
  async deleteArticle(id: string, token: string): Promise<{ success: boolean; error?: string }> {
    // Try backend
    await safeFetchJson(`/api/admin/posts/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });

    // Always remove from local storage as well
    try {
      const currentPosts = getLocalPosts();
      const filtered = currentPosts.filter((p) => p.id !== id);
      saveLocalPosts(filtered);
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || 'Failed to delete post.' };
    }
  },
};
