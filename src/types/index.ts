// User and Authentication Types
export interface User {
  id: string;
  email: string;
  username?: string;
  firstName?: string;
  lastName?: string;
  role: UserRole;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  profile?: UserProfile;
}

export interface UserProfile {
  avatar?: string;
  phone?: string;
  address?: string;
  dateOfBirth?: string;
  bio?: string;
}

export type UserRole = "user" | "admin" | "manager" | "superadmin";

export interface AuthCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface AuthResponse {
  user: User;
  token: string;
  refreshToken?: string;
  expiresIn: number;
}

export interface RegisterData {
  email: string;
  password: string;
  confirmPassword: string;
  firstName?: string;
  lastName?: string;
  username?: string;
}

// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  errors?: Record<string, string[]>;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

// Investment and Transaction Types
export interface Investment {
  id: string;
  userId: string;
  planId: string;
  amount: number;
  status: InvestmentStatus;
  startDate: string;
  endDate?: string;
  expectedReturn: number;
  actualReturn?: number;
  createdAt: string;
  updatedAt: string;
  plan?: InvestmentPlan;
}

export type InvestmentStatus = "active" | "completed" | "cancelled" | "pending";

export interface InvestmentPlan {
  id: string;
  name: string;
  description: string;
  minAmount: number;
  maxAmount: number;
  interestRate: number;
  duration: number; // in days
  riskLevel: RiskLevel;
  isActive: boolean;
  features: string[];
  createdAt: string;
  updatedAt: string;
}

export type RiskLevel = "low" | "medium" | "high";

export interface Transaction {
  id: string;
  userId: string;
  type: TransactionType;
  amount: number;
  status: TransactionStatus;
  description?: string;
  reference?: string;
  metadata?: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

export type TransactionType = "deposit" | "withdrawal" | "investment" | "return" | "fee" | "bonus";
export type TransactionStatus = "pending" | "completed" | "failed" | "cancelled";

// Notification Types
export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: NotificationType;
  isRead: boolean;
  metadata?: Record<string, any>;
  createdAt: string;
}

export type NotificationType = "info" | "success" | "warning" | "error" | "investment" | "transaction";

// Dashboard Types
export interface DashboardStats {
  totalUsers?: number;
  totalInvestments?: number;
  totalTransactions?: number;
  totalRevenue?: number;
  activeInvestments?: number;
  pendingWithdrawals?: number;
  monthlyGrowth?: number;
  userGrowth?: number;
}

export interface UserDashboardStats {
  totalInvestments: number;
  activeInvestments: number;
  totalReturns: number;
  availableBalance: number;
  pendingWithdrawals: number;
  totalDeposits: number;
}

// Form and UI Types
export interface FormField {
  name: string;
  label: string;
  type: string;
  placeholder?: string;
  required?: boolean;
  validation?: Record<string, any>;
}

export interface TableColumn<T = any> {
  key: keyof T;
  label: string;
  sortable?: boolean;
  render?: (value: any, item: T) => React.ReactNode;
}

export interface FilterOption {
  label: string;
  value: string;
}

// Settings Types
export interface UserSettings {
  notifications: {
    email: boolean;
    sms: boolean;
    push: boolean;
    investment: boolean;
    transaction: boolean;
    marketing: boolean;
  };
  security: {
    twoFactorEnabled: boolean;
    loginNotifications: boolean;
    sessionTimeout: number;
  };
  preferences: {
    theme: "light" | "dark" | "auto";
    language: string;
    currency: string;
    timezone: string;
  };
}

// Admin Types
export interface AdminAction {
  id: string;
  adminId: string;
  action: string;
  targetId?: string;
  targetType?: string;
  description: string;
  metadata?: Record<string, any>;
  createdAt: string;
}

// Component Props Types
export interface BaseComponentProps {
  className?: string;
  children?: React.ReactNode;
}

export interface LoadingState {
  isLoading: boolean;
  error?: string | null;
}

export interface ModalProps extends BaseComponentProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  size?: "sm" | "md" | "lg" | "xl";
}

// Route and Navigation Types
export interface RouteConfig {
  path: string;
  component: React.ComponentType;
  roles: UserRole[];
  title: string;
  icon?: string;
  children?: RouteConfig[];
}

export interface NavigationItem {
  label: string;
  href: string;
  icon?: string;
  roles: UserRole[];
  children?: NavigationItem[];
}

// Error Types
export interface AppError {
  code: string;
  message: string;
  details?: any;
  timestamp: string;
}

// Utility Types
export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
export type RequiredBy<T, K extends keyof T> = T & Required<Pick<T, K>>;

// API Endpoint Types
export interface ApiEndpoint {
  method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  url: string;
  requiresAuth?: boolean;
  roles?: UserRole[];
}

// Environment Configuration
export interface AppConfig {
  apiUrl: string;
  appName: string;
  appVersion: string;
  environment: "development" | "staging" | "production";
  features: {
    enableRegistration: boolean;
    enableTwoFactor: boolean;
    enableNotifications: boolean;
  };
}