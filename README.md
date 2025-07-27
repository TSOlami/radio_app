# Freeman Firms Unified Platform

A comprehensive investment platform with role-based access control for administrators, managers, and users.

## 🏗️ Project Structure

This is a unified Next.js application that combines both the administrative interface and user interface into a single codebase with role-based routing and rendering.

### Roles
- **Super Admin (admin)**: Full system access and management
- **Manager (manager)**: Administrative functions and user management  
- **User (user)**: Standard user interface and investment features

### Directory Structure

```
src/
├── app/
│   ├── (auth)/           # Authentication pages (login, register, etc.)
│   ├── (pages)/
│   │   ├── admin/        # Manager role pages
│   │   ├── superadmin/   # Super admin role pages
│   │   └── user/         # User role pages
│   └── (root)/           # Public pages
├── components/
│   ├── admin/           # Manager-specific components
│   ├── super-admin/     # Super admin components
│   ├── user/            # User-specific components
│   └── ui/              # Shared UI components
├── api/                 # Backend API routes
├── types/               # TypeScript type definitions
└── styles/              # Global styles and constants
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. Build for production:
```bash
npm run build
```

## 🔐 Authentication & Authorization

The application uses role-based access control with three distinct user roles:

- **Super Admin**: Access to `/superadmin/*` routes
- **Manager**: Access to `/admin/*` routes  
- **User**: Access to `/user/*` routes

Authentication is handled via API routes in `/api/auth/` and protected by `AuthGuard` components.

## 🌐 Backend API

The frontend connects to a separate Express.js backend deployed at:
`https://freeman-assets.onrender.com`

API documentation is available in the `swagger.json` file.

## 🎨 UI Framework

- **Next.js 15**: React framework
- **Tailwind CSS**: Utility-first CSS framework
- **DaisyUI**: Component library
- **React Icons**: Icon library
- **Framer Motion**: Animation library

## 📱 Features

### Super Admin Features
- User management
- Investment plan management
- Transaction monitoring
- System settings

### Manager Features  
- User oversight
- Transaction processing
- Investment management
- Account settings

### User Features
- Investment plans
- Transactions
- Referrals
- Account management
- Tasks and tiers

## 🔧 Development

### Code Quality
- TypeScript for type safety
- ESLint for code linting
- Prettier for code formatting

### File Organization
- Modular component structure
- Reusable UI components
- Clean separation of concerns
- Role-based component organization

## 📄 License

This project is proprietary software for Freeman Firms.

## 🤝 Contributing

Please ensure all code follows the established patterns and includes proper TypeScript types and error handling.
