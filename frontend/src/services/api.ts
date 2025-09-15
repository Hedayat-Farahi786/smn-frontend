const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:3000";

export interface User {
  id: string;
  _id?: string;
  username: string;
  email: string;
  firstName?: string;
  lastName?: string;
  title?: string;
  address?: string;
  address2?: string;
  city?: string;
  country?: string;
  zipcode?: string;
  phone?: string;
  isCompany?: boolean;
  company?: string;
  vatNumber?: string;
  role: string;
  profilePicture?: string;
  isActive?: boolean;
  lastLogin?: string;
  loginCount?: number;
  createdAt: string;
  updatedAt: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  title?: string;
  address?: string;
  address2?: string;
  city?: string;
  country?: string;
  zipcode?: string;
  phone?: string;
  isCompany?: boolean;
  company?: string;
  vatNumber?: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export class ApiError extends Error {
  status?: number;

  constructor(message: string, status?: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

class ApiService {
  private readonly baseURL: string;
  private token: string | null = null;
  private tokenExpiry: number | null = null;

  constructor() {
    this.baseURL = API_BASE_URL;
    this.token = localStorage.getItem("token");
    this.tokenExpiry = this.getStoredTokenExpiry();
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;

    const config: RequestInit = {
      headers: {
        "Content-Type": "application/json",
        ...(this.token && { Authorization: `Bearer ${this.token}` }),
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new ApiError(
          errorData.message || `HTTP error! status: ${response.status}`,
          response.status
        );
      }

      return await response.json();
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError(
        error instanceof Error ? error.message : "An unknown error occurred"
      );
    }
  }

  // Token expiry methods
  private setTokenExpiry(): void {
    const expiryTime = Date.now() + 24 * 60 * 60 * 1000; // 24 hours from now
    this.tokenExpiry = expiryTime;
    localStorage.setItem("tokenExpiry", expiryTime.toString());
  }

  private getStoredTokenExpiry(): number | null {
    const stored = localStorage.getItem("tokenExpiry");
    return stored ? parseInt(stored, 10) : null;
  }

  private isTokenExpired(): boolean {
    if (!this.tokenExpiry) return true;
    return Date.now() >= this.tokenExpiry;
  }

  // Auth methods
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    const response = await this.request<AuthResponse>("/api/auth/login", {
      method: "POST",
      body: JSON.stringify(credentials),
    });

    this.token = response.token;
    localStorage.setItem("token", response.token);
    this.setTokenExpiry();
    return response;
  }

  async register(userData: RegisterRequest): Promise<AuthResponse> {
    const response = await this.request<AuthResponse>("/api/auth/register", {
      method: "POST",
      body: JSON.stringify(userData),
    });

    this.token = response.token;
    localStorage.setItem("token", response.token);
    this.setTokenExpiry();
    return response;
  }

  async logout(): Promise<void> {
    this.token = null;
    this.tokenExpiry = null;
    localStorage.removeItem("token");
    localStorage.removeItem("tokenExpiry");
  }

  async getCurrentUser(): Promise<User> {
    return this.request<User>("/api/auth/me");
  }

  async updateProfile(profileData: {
    firstName?: string;
    lastName?: string;
    username?: string;
    title?: string;
    address?: string;
    address2?: string;
    city?: string;
    country?: string;
    zipcode?: string;
    phone?: string;
    isCompany?: boolean;
    company?: string;
    vatNumber?: string;
  }): Promise<{ user: User; message: string }> {
    return this.request<{ user: User; message: string }>("/api/auth/profile", {
      method: "PUT",
      body: JSON.stringify(profileData),
    });
  }

  // User management methods
  async getUsers(): Promise<User[]> {
    const response = await this.request<{
      users: User[];
      count: number;
      message: string;
    }>("/api/users");
    return response.users || [];
  }

  async getUserById(id: string): Promise<User> {
    return this.request<User>(`/api/users/${id}`);
  }

  async createUser(userData: Partial<User>): Promise<User> {
    return this.request<User>("/api/users", {
      method: "POST",
      body: JSON.stringify(userData),
    });
  }

  async updateUser(id: string, userData: Partial<User>): Promise<User> {
    return this.request<User>(`/api/users/${id}`, {
      method: "PUT",
      body: JSON.stringify(userData),
    });
  }

  async deleteUser(id: string): Promise<void> {
    return this.request<void>(`/api/users/${id}`, {
      method: "DELETE",
    });
  }

  // Check if user is authenticated
  isAuthenticated(): boolean {
    return !!this.token && !this.isTokenExpired();
  }

  // Get stored token
  getToken(): string | null {
    return this.token;
  }

  // Get token expiry time
  getTokenExpiry(): number | null {
    return this.tokenExpiry;
  }

  // Get time remaining until token expires (in milliseconds)
  getTimeUntilExpiry(): number {
    if (!this.tokenExpiry) return 0;
    return Math.max(0, this.tokenExpiry - Date.now());
  }

  // Check if token is about to expire (within 5 minutes)
  isTokenAboutToExpire(): boolean {
    return this.getTimeUntilExpiry() <= 5 * 60 * 1000; // 5 minutes
  }
}

export const apiService = new ApiService();
