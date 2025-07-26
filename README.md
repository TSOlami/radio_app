# Freeman Firms - Unified Investment Platform

A professional, role-based investment platform built with Next.js, TypeScript, and Tailwind CSS. This unified application combines user and administrative interfaces with comprehensive role-based access control.

## 🚀 Features

### Core Features
- **Role-Based Authentication** - Support for User, Admin, Manager, and Super Admin roles
- **Professional Dashboard** - Tailored interfaces for each user role
- **Investment Management** - Complete investment lifecycle management
- **Transaction Processing** - Deposits, withdrawals, and investment tracking
- **Real-time Analytics** - Advanced reporting and analytics
- **Notification System** - In-app and email notifications
- **Responsive Design** - Mobile-first, responsive UI

### User Features
- Personal investment portfolio management
- Transaction history and tracking
- Investment plan selection
- Profile and settings management
- Real-time dashboard analytics

### Admin Features
- User management and oversight
- Investment plan creation and management
- Transaction monitoring and approval
- System analytics and reporting
- Bulk notification system

### Super Admin Features
- System-wide configuration
- Admin user management
- Advanced analytics and reporting
- System maintenance tools

## 🛠 Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS, DaisyUI
- **Animations**: Framer Motion
- **Icons**: Heroicons, React Icons
- **State Management**: React Context, SWR
- **HTTP Client**: Axios
- **Authentication**: JWT with HTTP-only cookies
- **Form Validation**: Custom validation with TypeScript

## 📁 Project Structure

```
freeman-firms-unified/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── auth/              # Authentication pages
│   │   ├── user/              # User dashboard pages
│   │   ├── admin/             # Admin dashboard pages
│   │   ├── superadmin/        # Super admin pages
│   │   ├── api/               # API routes
│   │   ├── globals.css        # Global styles
│   │   ├── layout.tsx         # Root layout
│   │   └── page.tsx           # Landing page
│   ├── components/            # React components
│   │   ├── ui/                # Reusable UI components
│   │   ├── auth/              # Authentication components
│   │   ├── user/              # User-specific components
│   │   ├── admin/             # Admin-specific components
│   │   ├── common/            # Shared components
│   │   └── landing/           # Landing page components
│   ├── hooks/                 # Custom React hooks
│   ├── services/              # API service classes
│   ├── types/                 # TypeScript type definitions
│   ├── lib/                   # Utility functions
│   ├── api/                   # API configuration
│   └── middleware.ts          # Next.js middleware for auth
├── public/                    # Static assets
├── package.json
├── tailwind.config.ts
├── tsconfig.json
└── next.config.ts
```

## 🚦 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Backend API running (Freeman Assets API)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd freeman-firms-unified
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   Create a `.env.local` file in the root directory:
   ```env
   NEXT_PUBLIC_API_URL=https://freeman-assets.onrender.com
   NEXT_PUBLIC_APP_NAME=Freeman Firms
   NEXT_PUBLIC_APP_VERSION=1.0.0
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🔐 Authentication & Authorization

### Role Hierarchy
- **Super Admin**: Full system access
- **Admin**: User management, investment oversight
- **Manager**: Limited admin functions
- **User**: Personal dashboard only

### Route Protection
The application uses Next.js middleware to protect routes based on user roles:

```typescript
// Protected routes configuration
const protectedRoutes = {
  user: ["/user", "/user/(.*)"],
  admin: ["/admin", "/admin/(.*)"],
  superadmin: ["/superadmin", "/superadmin/(.*)"],
};
```

### Authentication Flow
1. User logs in with credentials
2. JWT token stored in HTTP-only cookie
3. Middleware validates token and role on each request
4. User redirected to appropriate dashboard

## 🎨 UI/UX Design

### Design System
- **Colors**: Professional blue and gray palette
- **Typography**: Montserrat font family
- **Components**: Consistent, reusable component library
- **Animations**: Smooth transitions with Framer Motion
- **Responsive**: Mobile-first approach

### Component Library
```typescript
// Example button variants
<button className="btn-primary">Primary Action</button>
<button className="btn-secondary">Secondary Action</button>
<button className="btn-outline">Outline Button</button>
```

## 📊 API Integration

### Service Architecture
The application uses a service-oriented architecture for API calls:

```typescript
// Example service usage
import { userService } from '@/services/user.service';

const dashboard = await userService.getDashboardStats();
const investments = await userService.getInvestments();
```

### Available Services
- **AuthService**: Authentication operations
- **UserService**: User-related operations
- **AdminService**: Administrative operations

## 🧪 Development

### Scripts
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run type-check   # TypeScript type checking
```

### Code Quality
- **TypeScript**: Strict type checking
- **ESLint**: Code linting and formatting
- **Prettier**: Code formatting (recommended)

### Testing
```bash
# Add testing framework (recommended)
npm install --save-dev jest @testing-library/react @testing-library/jest-dom
```

## 🚀 Deployment

### Build Process
```bash
npm run build
npm run start
```

### Environment Variables
Ensure all environment variables are set in production:
- `NEXT_PUBLIC_API_URL`
- `NEXT_PUBLIC_APP_NAME`
- `NEXT_PUBLIC_APP_VERSION`

### Deployment Platforms
- **Vercel**: Recommended for Next.js applications
- **Netlify**: Alternative deployment platform
- **Docker**: Container deployment option

## 🔧 Configuration

### Tailwind CSS
Custom configuration with DaisyUI components:
```javascript
// tailwind.config.ts
module.exports = {
  plugins: [require("daisyui")],
  daisyui: {
    themes: ["light", "dark"],
  },
};
```

### Next.js
```javascript
// next.config.ts
const nextConfig = {
  experimental: {
    typedRoutes: true,
  },
};
```

## 🤝 Contributing

### Development Workflow
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests (when available)
5. Submit a pull request

### Code Standards
- Follow TypeScript best practices
- Use consistent naming conventions
- Write self-documenting code
- Add JSDoc comments for complex functions

## 📝 License

This project is proprietary software owned by Freeman Firms. All rights reserved.

## 🆘 Support

For support and questions:
- **Email**: support@freeman-firms.com
- **Documentation**: [Internal Wiki]
- **Issues**: Use GitHub Issues for bug reports

## 🗺 Roadmap

### Upcoming Features
- [ ] Two-factor authentication
- [ ] Advanced analytics dashboard
- [ ] Mobile application
- [ ] API rate limiting
- [ ] Advanced reporting system
- [ ] Integration with external payment providers

### Version History
- **v1.0.0**: Initial unified platform release
- **v0.9.0**: Beta release with core features
- **v0.8.0**: Alpha release for internal testing

---

**Freeman Firms Investment Platform** - Built with ❤️ by the Freeman Firms Development Team