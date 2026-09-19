import { User, Skill, Booking, ChatMessage, VaultInspectionData } from '../types';

const TOKEN_KEY = 'skillswap_jwt_token';

export const apiClient = {
  getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  },

  setToken(token: string) {
    localStorage.setItem(TOKEN_KEY, token);
  },

  removeToken() {
    localStorage.removeItem(TOKEN_KEY);
  },

  async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const headers = new Headers(options.headers || {});
    headers.set('Content-Type', 'application/json');

    const token = this.getToken();
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }

    const res = await fetch(endpoint, {
      ...options,
      headers,
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || `HTTP error ${res.status}`);
    }

    return data as T;
  },

  // Auth
  async login(identifier: string, password: string): Promise<{ token: string; user: User; message: string }> {
    const data = await this.request<{ token: string; user: User; message: string }>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ identifier, password }),
    });
    this.setToken(data.token);
    return data;
  },

  async register(params: {
    name: string;
    email: string;
    password: string;
    college: string;
    year: string;
  }): Promise<{ token: string; user: User; message: string }> {
    const data = await this.request<{ token: string; user: User; message: string }>('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(params),
    });
    this.setToken(data.token);
    return data;
  },

  async getMe(): Promise<{ user: User }> {
    return this.request<{ user: User }>('/api/auth/me');
  },

  async updateProfile(updates: Partial<User>): Promise<{ user: User; message: string }> {
    return this.request<{ user: User; message: string }>('/api/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  },

  // Skills
  async getSkills(params?: { category?: string; type?: string; search?: string }): Promise<{ skills: Skill[] }> {
    const query = new URLSearchParams();
    if (params?.category) query.append('category', params.category);
    if (params?.type) query.append('type', params.type);
    if (params?.search) query.append('search', params.search);

    const qs = query.toString();
    return this.request<{ skills: Skill[] }>(`/api/skills${qs ? '?' + qs : ''}`);
  },

  async getSkillById(id: string): Promise<{ skill: Skill }> {
    return this.request<{ skill: Skill }>(`/api/skills/${id}`);
  },

  async createSkill(data: {
    title: string;
    category: string;
    description: string;
    type: 'Teach' | 'Learn';
  }): Promise<{ skill: Skill; message: string }> {
    return this.request<{ skill: Skill; message: string }>('/api/skills', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  // Bookings
  async getBookings(): Promise<{ bookings: Booking[] }> {
    return this.request<{ bookings: Booking[] }>('/api/bookings');
  },

  async createBooking(data: {
    teacherId: string;
    skillId: string;
    dateTime: string;
    notes?: string;
  }): Promise<{ booking: Booking; message: string }> {
    return this.request<{ booking: Booking; message: string }>('/api/bookings', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async updateBookingStatus(id: string, status: string): Promise<{ message: string }> {
    return this.request<{ message: string }>(`/api/bookings/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
  },

  // Chats
  async getMessages(peerId: string): Promise<{ messages: ChatMessage[] }> {
    return this.request<{ messages: ChatMessage[] }>(`/api/chats/${peerId}`);
  },

  async sendMessage(peerId: string, message: string): Promise<{ chat: ChatMessage; message: string }> {
    return this.request<{ chat: ChatMessage; message: string }>(`/api/chats/${peerId}`, {
      method: 'POST',
      body: JSON.stringify({ message }),
    });
  },

  // Security Vault
  async getVaultData(): Promise<{ vault: VaultInspectionData; serverTime: string }> {
    return this.request<{ vault: VaultInspectionData; serverTime: string }>('/api/security/vault');
  },

  async testCrypto(text: string): Promise<any> {
    return this.request<any>('/api/security/test-crypto', {
      method: 'POST',
      body: JSON.stringify({ text }),
    });
  },

  async inspectJwt(token: string): Promise<any> {
    return this.request<any>('/api/security/inspect-jwt', {
      method: 'POST',
      body: JSON.stringify({ token }),
    });
  },
};
