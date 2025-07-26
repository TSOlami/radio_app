import { apiClient } from "@/api/config";
import type {
  User,
  DashboardStats,
  PaginatedResponse,
  Investment,
  Transaction,
  InvestmentPlan,
  AdminAction,
} from "@/types";

export class AdminService {
  private static instance: AdminService;

  public static getInstance(): AdminService {
    if (!AdminService.instance) {
      AdminService.instance = new AdminService();
    }
    return AdminService.instance;
  }

  /**
   * Get admin dashboard statistics
   */
  async getDashboardStats(): Promise<DashboardStats> {
    try {
      const response = await apiClient.get<DashboardStats>("/admin/dashboard/stats");
      
      if (response.success && response.data) {
        return response.data;
      }
      
      throw new Error(response.message || "Failed to fetch dashboard stats");
    } catch (error: any) {
      throw new Error(error.message || "Failed to fetch dashboard stats");
    }
  }

  /**
   * Get all users with pagination
   */
  async getUsers(page = 1, limit = 10, search?: string, role?: string): Promise<PaginatedResponse<User>> {
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
      });
      
      if (search) params.append("search", search);
      if (role) params.append("role", role);
      
      const response = await apiClient.get<PaginatedResponse<User>>(
        `/admin/users?${params.toString()}`
      );
      
      if (response.success && response.data) {
        return response.data;
      }
      
      throw new Error(response.message || "Failed to fetch users");
    } catch (error: any) {
      throw new Error(error.message || "Failed to fetch users");
    }
  }

  /**
   * Get user details by ID
   */
  async getUserDetails(userId: string): Promise<User> {
    try {
      const response = await apiClient.get<User>(`/admin/users/${userId}`);
      
      if (response.success && response.data) {
        return response.data;
      }
      
      throw new Error(response.message || "Failed to fetch user details");
    } catch (error: any) {
      throw new Error(error.message || "Failed to fetch user details");
    }
  }

  /**
   * Update user details
   */
  async updateUser(userId: string, userData: Partial<User>): Promise<User> {
    try {
      const response = await apiClient.put<User>(`/admin/users/${userId}`, userData);
      
      if (response.success && response.data) {
        return response.data;
      }
      
      throw new Error(response.message || "Failed to update user");
    } catch (error: any) {
      throw new Error(error.message || "Failed to update user");
    }
  }

  /**
   * Activate/Deactivate user
   */
  async toggleUserStatus(userId: string, isActive: boolean): Promise<void> {
    try {
      const response = await apiClient.patch(`/admin/users/${userId}/status`, { isActive });
      
      if (!response.success) {
        throw new Error(response.message || "Failed to update user status");
      }
    } catch (error: any) {
      throw new Error(error.message || "Failed to update user status");
    }
  }

  /**
   * Delete user
   */
  async deleteUser(userId: string): Promise<void> {
    try {
      const response = await apiClient.delete(`/admin/users/${userId}`);
      
      if (!response.success) {
        throw new Error(response.message || "Failed to delete user");
      }
    } catch (error: any) {
      throw new Error(error.message || "Failed to delete user");
    }
  }

  /**
   * Get all investments with pagination
   */
  async getInvestments(page = 1, limit = 10, status?: string, userId?: string): Promise<PaginatedResponse<Investment>> {
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
      });
      
      if (status) params.append("status", status);
      if (userId) params.append("userId", userId);
      
      const response = await apiClient.get<PaginatedResponse<Investment>>(
        `/admin/investments?${params.toString()}`
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
   * Update investment status
   */
  async updateInvestmentStatus(investmentId: string, status: string): Promise<Investment> {
    try {
      const response = await apiClient.patch<Investment>(`/admin/investments/${investmentId}/status`, { status });
      
      if (response.success && response.data) {
        return response.data;
      }
      
      throw new Error(response.message || "Failed to update investment status");
    } catch (error: any) {
      throw new Error(error.message || "Failed to update investment status");
    }
  }

  /**
   * Get all transactions with pagination
   */
  async getTransactions(page = 1, limit = 10, type?: string, status?: string): Promise<PaginatedResponse<Transaction>> {
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
      });
      
      if (type) params.append("type", type);
      if (status) params.append("status", status);
      
      const response = await apiClient.get<PaginatedResponse<Transaction>>(
        `/admin/transactions?${params.toString()}`
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
   * Update transaction status
   */
  async updateTransactionStatus(transactionId: string, status: string): Promise<Transaction> {
    try {
      const response = await apiClient.patch<Transaction>(`/admin/transactions/${transactionId}/status`, { status });
      
      if (response.success && response.data) {
        return response.data;
      }
      
      throw new Error(response.message || "Failed to update transaction status");
    } catch (error: any) {
      throw new Error(error.message || "Failed to update transaction status");
    }
  }

  /**
   * Get investment plans
   */
  async getInvestmentPlans(): Promise<InvestmentPlan[]> {
    try {
      const response = await apiClient.get<InvestmentPlan[]>("/admin/investment-plans");
      
      if (response.success && response.data) {
        return response.data;
      }
      
      throw new Error(response.message || "Failed to fetch investment plans");
    } catch (error: any) {
      throw new Error(error.message || "Failed to fetch investment plans");
    }
  }

  /**
   * Create investment plan
   */
  async createInvestmentPlan(planData: Omit<InvestmentPlan, "id" | "createdAt" | "updatedAt">): Promise<InvestmentPlan> {
    try {
      const response = await apiClient.post<InvestmentPlan>("/admin/investment-plans", planData);
      
      if (response.success && response.data) {
        return response.data;
      }
      
      throw new Error(response.message || "Failed to create investment plan");
    } catch (error: any) {
      throw new Error(error.message || "Failed to create investment plan");
    }
  }

  /**
   * Update investment plan
   */
  async updateInvestmentPlan(planId: string, planData: Partial<InvestmentPlan>): Promise<InvestmentPlan> {
    try {
      const response = await apiClient.put<InvestmentPlan>(`/admin/investment-plans/${planId}`, planData);
      
      if (response.success && response.data) {
        return response.data;
      }
      
      throw new Error(response.message || "Failed to update investment plan");
    } catch (error: any) {
      throw new Error(error.message || "Failed to update investment plan");
    }
  }

  /**
   * Delete investment plan
   */
  async deleteInvestmentPlan(planId: string): Promise<void> {
    try {
      const response = await apiClient.delete(`/admin/investment-plans/${planId}`);
      
      if (!response.success) {
        throw new Error(response.message || "Failed to delete investment plan");
      }
    } catch (error: any) {
      throw new Error(error.message || "Failed to delete investment plan");
    }
  }

  /**
   * Get admin actions/audit log
   */
  async getAdminActions(page = 1, limit = 10): Promise<PaginatedResponse<AdminAction>> {
    try {
      const response = await apiClient.get<PaginatedResponse<AdminAction>>(
        `/admin/actions?page=${page}&limit=${limit}`
      );
      
      if (response.success && response.data) {
        return response.data;
      }
      
      throw new Error(response.message || "Failed to fetch admin actions");
    } catch (error: any) {
      throw new Error(error.message || "Failed to fetch admin actions");
    }
  }

  /**
   * Send notification to user
   */
  async sendNotification(userId: string, title: string, message: string, type: string): Promise<void> {
    try {
      const response = await apiClient.post("/admin/notifications", {
        userId,
        title,
        message,
        type,
      });
      
      if (!response.success) {
        throw new Error(response.message || "Failed to send notification");
      }
    } catch (error: any) {
      throw new Error(error.message || "Failed to send notification");
    }
  }

  /**
   * Send bulk notification
   */
  async sendBulkNotification(userIds: string[], title: string, message: string, type: string): Promise<void> {
    try {
      const response = await apiClient.post("/admin/notifications/bulk", {
        userIds,
        title,
        message,
        type,
      });
      
      if (!response.success) {
        throw new Error(response.message || "Failed to send bulk notification");
      }
    } catch (error: any) {
      throw new Error(error.message || "Failed to send bulk notification");
    }
  }

  /**
   * Export users data
   */
  async exportUsers(format: "csv" | "xlsx" = "csv"): Promise<Blob> {
    try {
      const response = await apiClient.get(`/admin/users/export?format=${format}`, {
        responseType: "blob",
      });
      
      return response.data;
    } catch (error: any) {
      throw new Error(error.message || "Failed to export users");
    }
  }

  /**
   * Export transactions data
   */
  async exportTransactions(format: "csv" | "xlsx" = "csv"): Promise<Blob> {
    try {
      const response = await apiClient.get(`/admin/transactions/export?format=${format}`, {
        responseType: "blob",
      });
      
      return response.data;
    } catch (error: any) {
      throw new Error(error.message || "Failed to export transactions");
    }
  }

  /**
   * Get system settings
   */
  async getSystemSettings(): Promise<Record<string, any>> {
    try {
      const response = await apiClient.get<Record<string, any>>("/admin/settings");
      
      if (response.success && response.data) {
        return response.data;
      }
      
      throw new Error(response.message || "Failed to fetch system settings");
    } catch (error: any) {
      throw new Error(error.message || "Failed to fetch system settings");
    }
  }

  /**
   * Update system settings
   */
  async updateSystemSettings(settings: Record<string, any>): Promise<Record<string, any>> {
    try {
      const response = await apiClient.put<Record<string, any>>("/admin/settings", settings);
      
      if (response.success && response.data) {
        return response.data;
      }
      
      throw new Error(response.message || "Failed to update system settings");
    } catch (error: any) {
      throw new Error(error.message || "Failed to update system settings");
    }
  }
}

// Export singleton instance
export const adminService = AdminService.getInstance();