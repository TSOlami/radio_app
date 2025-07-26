import { apiClient } from "@/api/config";
import type {
  User,
  UserProfile,
  UserSettings,
  PaginatedResponse,
  UserDashboardStats,
  Investment,
  Transaction,
  Notification,
} from "@/types";

export class UserService {
  private static instance: UserService;

  public static getInstance(): UserService {
    if (!UserService.instance) {
      UserService.instance = new UserService();
    }
    return UserService.instance;
  }

  /**
   * Get user dashboard statistics
   */
  async getDashboardStats(): Promise<UserDashboardStats> {
    try {
      const response = await apiClient.get<UserDashboardStats>("/user/dashboard/stats");
      
      if (response.success && response.data) {
        return response.data;
      }
      
      throw new Error(response.message || "Failed to fetch dashboard stats");
    } catch (error: any) {
      throw new Error(error.message || "Failed to fetch dashboard stats");
    }
  }

  /**
   * Get user profile
   */
  async getProfile(): Promise<User> {
    try {
      const response = await apiClient.get<User>("/user/profile");
      
      if (response.success && response.data) {
        return response.data;
      }
      
      throw new Error(response.message || "Failed to fetch profile");
    } catch (error: any) {
      throw new Error(error.message || "Failed to fetch profile");
    }
  }

  /**
   * Update user profile
   */
  async updateProfile(profileData: Partial<UserProfile>): Promise<User> {
    try {
      const response = await apiClient.put<User>("/user/profile", profileData);
      
      if (response.success && response.data) {
        return response.data;
      }
      
      throw new Error(response.message || "Failed to update profile");
    } catch (error: any) {
      throw new Error(error.message || "Failed to update profile");
    }
  }

  /**
   * Get user investments
   */
  async getInvestments(page = 1, limit = 10): Promise<PaginatedResponse<Investment>> {
    try {
      const response = await apiClient.get<PaginatedResponse<Investment>>(
        `/user/investments?page=${page}&limit=${limit}`
      );
      
      if (response.success && response.data) {
        return response.data;
      }
      
      throw new Error(response.message || "Failed to fetch investments");
    } catch (error: any) {
      throw new Error(error.message || "Failed to fetch investments");
    }
  }

  /**
   * Get user transactions
   */
  async getTransactions(page = 1, limit = 10, type?: string): Promise<PaginatedResponse<Transaction>> {
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
      });
      
      if (type) {
        params.append("type", type);
      }
      
      const response = await apiClient.get<PaginatedResponse<Transaction>>(
        `/user/transactions?${params.toString()}`
      );
      
      if (response.success && response.data) {
        return response.data;
      }
      
      throw new Error(response.message || "Failed to fetch transactions");
    } catch (error: any) {
      throw new Error(error.message || "Failed to fetch transactions");
    }
  }

  /**
   * Get user notifications
   */
  async getNotifications(page = 1, limit = 10): Promise<PaginatedResponse<Notification>> {
    try {
      const response = await apiClient.get<PaginatedResponse<Notification>>(
        `/user/notifications?page=${page}&limit=${limit}`
      );
      
      if (response.success && response.data) {
        return response.data;
      }
      
      throw new Error(response.message || "Failed to fetch notifications");
    } catch (error: any) {
      throw new Error(error.message || "Failed to fetch notifications");
    }
  }

  /**
   * Mark notification as read
   */
  async markNotificationAsRead(notificationId: string): Promise<void> {
    try {
      const response = await apiClient.patch(`/user/notifications/${notificationId}/read`);
      
      if (!response.success) {
        throw new Error(response.message || "Failed to mark notification as read");
      }
    } catch (error: any) {
      throw new Error(error.message || "Failed to mark notification as read");
    }
  }

  /**
   * Mark all notifications as read
   */
  async markAllNotificationsAsRead(): Promise<void> {
    try {
      const response = await apiClient.patch("/user/notifications/mark-all-read");
      
      if (!response.success) {
        throw new Error(response.message || "Failed to mark all notifications as read");
      }
    } catch (error: any) {
      throw new Error(error.message || "Failed to mark all notifications as read");
    }
  }

  /**
   * Get user settings
   */
  async getSettings(): Promise<UserSettings> {
    try {
      const response = await apiClient.get<UserSettings>("/user/settings");
      
      if (response.success && response.data) {
        return response.data;
      }
      
      throw new Error(response.message || "Failed to fetch settings");
    } catch (error: any) {
      throw new Error(error.message || "Failed to fetch settings");
    }
  }

  /**
   * Update user settings
   */
  async updateSettings(settings: Partial<UserSettings>): Promise<UserSettings> {
    try {
      const response = await apiClient.put<UserSettings>("/user/settings", settings);
      
      if (response.success && response.data) {
        return response.data;
      }
      
      throw new Error(response.message || "Failed to update settings");
    } catch (error: any) {
      throw new Error(error.message || "Failed to update settings");
    }
  }

  /**
   * Request withdrawal
   */
  async requestWithdrawal(amount: number, method: string, details: any): Promise<Transaction> {
    try {
      const response = await apiClient.post<Transaction>("/user/withdrawals", {
        amount,
        method,
        details,
      });
      
      if (response.success && response.data) {
        return response.data;
      }
      
      throw new Error(response.message || "Failed to request withdrawal");
    } catch (error: any) {
      throw new Error(error.message || "Failed to request withdrawal");
    }
  }

  /**
   * Make deposit
   */
  async makeDeposit(amount: number, method: string, details: any): Promise<Transaction> {
    try {
      const response = await apiClient.post<Transaction>("/user/deposits", {
        amount,
        method,
        details,
      });
      
      if (response.success && response.data) {
        return response.data;
      }
      
      throw new Error(response.message || "Failed to make deposit");
    } catch (error: any) {
      throw new Error(error.message || "Failed to make deposit");
    }
  }

  /**
   * Create investment
   */
  async createInvestment(planId: string, amount: number): Promise<Investment> {
    try {
      const response = await apiClient.post<Investment>("/user/investments", {
        planId,
        amount,
      });
      
      if (response.success && response.data) {
        return response.data;
      }
      
      throw new Error(response.message || "Failed to create investment");
    } catch (error: any) {
      throw new Error(error.message || "Failed to create investment");
    }
  }

  /**
   * Get investment details
   */
  async getInvestmentDetails(investmentId: string): Promise<Investment> {
    try {
      const response = await apiClient.get<Investment>(`/user/investments/${investmentId}`);
      
      if (response.success && response.data) {
        return response.data;
      }
      
      throw new Error(response.message || "Failed to fetch investment details");
    } catch (error: any) {
      throw new Error(error.message || "Failed to fetch investment details");
    }
  }

  /**
   * Cancel investment
   */
  async cancelInvestment(investmentId: string): Promise<void> {
    try {
      const response = await apiClient.patch(`/user/investments/${investmentId}/cancel`);
      
      if (!response.success) {
        throw new Error(response.message || "Failed to cancel investment");
      }
    } catch (error: any) {
      throw new Error(error.message || "Failed to cancel investment");
    }
  }

  /**
   * Upload profile avatar
   */
  async uploadAvatar(file: File): Promise<string> {
    try {
      const formData = new FormData();
      formData.append("avatar", file);
      
      const response = await apiClient.post<{ url: string }>("/user/profile/avatar", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      
      if (response.success && response.data) {
        return response.data.url;
      }
      
      throw new Error(response.message || "Failed to upload avatar");
    } catch (error: any) {
      throw new Error(error.message || "Failed to upload avatar");
    }
  }

  /**
   * Delete user account
   */
  async deleteAccount(password: string): Promise<void> {
    try {
      const response = await apiClient.delete("/user/account", {
        data: { password },
      });
      
      if (!response.success) {
        throw new Error(response.message || "Failed to delete account");
      }
    } catch (error: any) {
      throw new Error(error.message || "Failed to delete account");
    }
  }
}

// Export singleton instance
export const userService = UserService.getInstance();