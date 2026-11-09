const API_BASE_URL = import.meta.env.VITE_API_URL || '/api/v1';

export interface ProcessResponse {
  job_id: string;
  tool_name: string;
  status: string;
  input_file_size: number;
  output_file_size: number;
  processing_time: number;
  download_url: string;
  output_filename: string;
  expires_at: string;
  extra_data?: any;
}

export interface UserProfile {
  id: string;
  google_sub: string;
  name: string;
  email: string;
  profile_picture?: string;
  created_at: string;
  last_login: string;
}

export interface DashboardData {
  profile: {
    name: string;
    email: string;
    profile_picture?: string;
    joined_date: string;
    last_login: string;
  };
  stats: {
    total_documents_processed: number;
    total_megabytes_processed: number;
    privacy_mode: string;
    cleanup_schedule: string;
    active_plan: string;
  };
  top_tools: { tool: string; count: number }[];
  recent_history: {
    id: string;
    tool_name: string;
    status: string;
    input_file_size: number;
    processing_time: number;
    created_at: string;
    is_expired: boolean;
  }[];
}

class ApiService {
  private token: string | null = null;

  constructor() {
    this.token = localStorage.getItem('crazypdf_token');
  }

  setToken(token: string | null) {
    this.token = token;
    if (token) {
      localStorage.setItem('crazypdf_token', token);
    } else {
      localStorage.removeItem('crazypdf_token');
    }
  }

  getToken(): string | null {
    return this.token;
  }

  private getHeaders(): Record<string, string> {
    const headers: Record<string, string> = {};
    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }
    return headers;
  }

  async googleLogin(credential: string): Promise<{ access_token: string; user: UserProfile }> {
    const res = await fetch(`${API_BASE_URL}/auth/google`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ credential }),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({ detail: 'Login failed' }));
      throw new Error(err.detail || 'Authentication failed');
    }

    const data = await res.json();
    this.setToken(data.access_token);
    return data;
  }

  async getCurrentUser(): Promise<UserProfile> {
    const res = await fetch(`${API_BASE_URL}/auth/me`, {
      headers: this.getHeaders(),
    });

    if (!res.ok) {
      throw new Error('Not authenticated');
    }

    return res.json();
  }

  async getDashboard(): Promise<DashboardData> {
    const res = await fetch(`${API_BASE_URL}/user/dashboard`, {
      headers: this.getHeaders(),
    });

    if (!res.ok) {
      throw new Error('Failed to load dashboard');
    }

    return res.json();
  }

  async processTool(
    toolSlug: string,
    files: File[],
    options: Record<string, any> = {}
  ): Promise<ProcessResponse> {
    const formData = new FormData();
    files.forEach((file) => {
      formData.append('files', file);
    });
    formData.append('options', JSON.stringify(options));

    const res = await fetch(`${API_BASE_URL}/tools/process/${toolSlug}`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: formData,
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({ detail: 'Processing error' }));
      throw new Error(err.detail || `Processing failed with code ${res.status}`);
    }

    return res.json();
  }

  getDownloadUrl(urlPath: string): string {
    if (urlPath.startsWith('http')) return urlPath;
    return urlPath;
  }
}

export const api = new ApiService();
