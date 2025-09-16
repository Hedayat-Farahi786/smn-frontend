// NOTE: Backend auth is temporarily disabled for local development.
// TODO: Re-enable backend integration when backend is ready. Replace the
// mocked implementations below with real API calls to `API_BASE_URL`.

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

  // NOTE: The request method is intentionally not used while mocking auth.
  // When backend is re-enabled, restore the request() implementation and
  // use it for all API calls.
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

    // Preserve the original behavior for non-auth calls in the future.
    const response = await fetch(url, config);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new ApiError(
        errorData.message || `HTTP error! status: ${response.status}`,
        response.status
      );
    }

    return await response.json();
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
    // Mocked login for local development. Accept any non-empty email/password.
    // TODO: Replace with real backend call when backend is available.
    if (!credentials.email || !credentials.password) {
      throw new ApiError("Invalid credentials", 400);
    }

    const mockUser: User = {
      id: "local-user",
      username: credentials.email.split("@")[0],
      email: credentials.email,
      role: "user",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    } as User;

    const mockToken = "local-dev-token";
    this.token = mockToken;
    localStorage.setItem("token", mockToken);
    this.setTokenExpiry();

    return { token: mockToken, user: mockUser };
  }

  async register(userData: RegisterRequest): Promise<AuthResponse> {
    // Mocked register for local development. Create a local user and token.
    // TODO: Replace with real backend call when backend is available.
    if (!userData.email || !userData.password || !userData.username) {
      throw new ApiError("Missing registration fields", 400);
    }

    const mockUser: User = {
      id: "local-user",
      username: userData.username,
      email: userData.email,
      firstName: userData.firstName,
      lastName: userData.lastName,
      role: "user",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    } as User;

    const mockToken = "local-dev-token";
    this.token = mockToken;
    localStorage.setItem("token", mockToken);
    this.setTokenExpiry();

    return { token: mockToken, user: mockUser };
  }

  async logout(): Promise<void> {
    // Clear local mock token
    this.token = null;
    this.tokenExpiry = null;
    localStorage.removeItem("token");
    localStorage.removeItem("tokenExpiry");
  }

  async getCurrentUser(): Promise<User> {
    // Return a mocked user when running without backend.
    // If token is missing or expired, throw an error to simulate unauthenticated.
    if (!this.token || this.isTokenExpired()) {
      throw new ApiError("Not authenticated", 401);
    }

    // Build a simple user from token (for local dev).
    const email = "local@dev";
    const mockUser: User = {
      id: "local-user",
      username: "local",
      email,
      role: "user",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    } as User;

    return mockUser;
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
