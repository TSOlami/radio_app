import { apiClient, tokenManager } from "@/api/config";
import type {
  AuthCredentials,
  AuthResponse,
  RegisterData,
  User,
  ApiResponse,
} from "@/types";

export class AuthService {
  private static instance: AuthService;

  public static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  /**
   * Login user with credentials
   */
  async login(credentials: AuthCredentials): Promise<AuthResponse> {
    try {
      const response = await apiClient.post<AuthResponse>("/auth/login", credentials);
      
      if (response.success && response.data) {
        const { token, user } = response.data;
        
        // Store authentication data
        tokenManager.setToken(token);
        tokenManager.setRole(user.role);
        
        return response.data;
      }
      
      throw new Error(response.message || "Login failed");
    } catch (error: any) {
      throw new Error(error.message || "Login failed");
    }
  }

  /**
   * Register new user
   */
  async register(data: RegisterData): Promise<AuthResponse> {
    try {
      const response = await apiClient.post<AuthResponse>("/auth/register", data);
      
      if (response.success && response.data) {
        const { token, user } = response.data;
        
        // Store authentication data
        tokenManager.setToken(token);
        tokenManager.setRole(user.role);
        
        return response.data;
      }
      
      throw new Error(response.message || "Registration failed");
    } catch (error: any) {
      throw new Error(error.message || "Registration failed");
    }
  }

  /**
   * Logout user
   */
  async logout(): Promise<void> {
    try {
      // Call logout endpoint if available
      await apiClient.post("/auth/logout");
    } catch (error) {
      // Continue with local logout even if API call fails
      console.warn("Logout API call failed:", error);
    } finally {
      // Always clear local storage
      tokenManager.removeToken();
      
      // Redirect to login page
      if (typeof window !== "undefined") {
        window.location.href = "/login";
      }
    }
  }

  /**
   * Get current user profile
   */
  async getCurrentUser(): Promise<User> {
    try {
      const response = await apiClient.get<User>("/auth/me");
      
      if (response.success && response.data) {
        return response.data;
      }
      
      throw new Error(response.message || "Failed to get user profile");
    } catch (error: any) {
      throw new Error(error.message || "Failed to get user profile");
    }
  }

  /**
   * Refresh authentication token
   */
  async refreshToken(): Promise<string> {
    try {
      const response = await apiClient.post<{ token: string }>("/auth/refresh");
      
      if (response.success && response.data) {
        const { token } = response.data;
        tokenManager.setToken(token);
        return token;
      }
      
      throw new Error(response.message || "Token refresh failed");
    } catch (error: any) {
      // If refresh fails, logout user
      this.logout();
      throw new Error(error.message || "Token refresh failed");
    }
  }

  /**
   * Request password reset
   */
  async requestPasswordReset(email: string): Promise<void> {
    try {
      const response = await apiClient.post("/auth/forgot-password", { email });
      
      if (!response.success) {
        throw new Error(response.message || "Password reset request failed");
      }
    } catch (error: any) {
      throw new Error(error.message || "Password reset request failed");
    }
  }

  /**
   * Reset password with token
   */
  async resetPassword(token: string, newPassword: string): Promise<void> {
    try {
      const response = await apiClient.post("/auth/reset-password", {
        token,
        password: newPassword,
      });
      
      if (!response.success) {
        throw new Error(response.message || "Password reset failed");
      }
    } catch (error: any) {
      throw new Error(error.message || "Password reset failed");
    }
  }

  /**
   * Change user password
   */
  async changePassword(currentPassword: string, newPassword: string): Promise<void> {
    try {
      const response = await apiClient.post("/auth/change-password", {
        currentPassword,
        newPassword,
      });
      
      if (!response.success) {
        throw new Error(response.message || "Password change failed");
      }
    } catch (error: any) {
      throw new Error(error.message || "Password change failed");
    }
  }

  /**
   * Verify email address
   */
  async verifyEmail(token: string): Promise<void> {
    try {
      const response = await apiClient.post("/auth/verify-email", { token });
      
      if (!response.success) {
        throw new Error(response.message || "Email verification failed");
      }
    } catch (error: any) {
      throw new Error(error.message || "Email verification failed");
    }
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    const token = tokenManager.getToken();
    const role = tokenManager.getRole();
    return !!(token && role);
  }

  /**
   * Get current user role
   */
  getCurrentRole(): string | null {
    return tokenManager.getRole();
  }

  /**
   * Check if user has specific role
   */
  hasRole(role: string): boolean {
    const userRole = this.getCurrentRole();
    if (!userRole) return false;

    const roleHierarchy = {
      superadmin: ["superadmin", "admin", "manager", "user"],
      admin: ["admin", "manager", "user"],
      manager: ["manager", "user"],
      user: ["user"],
    };

    return roleHierarchy[userRole as keyof typeof roleHierarchy]?.includes(role) || false;
  }

  /**
   * Check if user can access specific route
   */
  canAccessRoute(requiredRoles: string[]): boolean {
    const userRole = this.getCurrentRole();
    if (!userRole) return false;

    return requiredRoles.some(role => this.hasRole(role));
  }
}

// Export singleton instance
export const authService = AuthService.getInstance();