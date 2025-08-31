# UDISE Dashboard Frontend

A modern, responsive Next.js frontend for the UDISE Dashboard, featuring beautiful charts, hierarchical filtering, and a comprehensive school management interface.

## 🚀 Features

- **Modern UI/UX** - Beautiful, responsive design with Tailwind CSS
- **Authentication** - JWT-based login/signup with secure token management
- **Hierarchical Filtering** - State → District → Block → Village level filtering
- **Interactive Charts** - Recharts-powered visualizations for data distribution
- **Real-time Updates** - React Query for efficient data fetching and caching
- **Responsive Design** - Mobile-first approach with Tailwind CSS
- **Type Safety** - Full TypeScript support with comprehensive type definitions

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS + Custom Components
- **State Management**: React Query (TanStack Query)
- **Charts**: Recharts
- **Icons**: Lucide React
- **HTTP Client**: Axios
- **Language**: TypeScript
- **Authentication**: JWT with Context API

## 📋 Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Backend API running (see backend README)

## 🚀 Quick Start

### 1. Install Dependencies

```bash
cd frontend
npm install
```

### 2. Environment Setup

Create a `.env.local` file in the frontend directory:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```

### 3. Start Development Server

```bash
npm run dev
```

The frontend will be available at `http://localhost:3000`

### 4. Build for Production

```bash
npm run build
npm start
```

## 📁 Project Structure

```
frontend/
├── src/
│   ├── app/                 # Next.js App Router pages
│   │   ├── login/          # Authentication pages
│   │   ├── dashboard/      # Main dashboard
│   │   ├── globals.css     # Global styles
│   │   ├── layout.tsx      # Root layout
│   │   └── page.tsx        # Home page
│   ├── components/         # Reusable UI components
│   │   ├── Providers.tsx   # Context providers
│   │   ├── Header.tsx      # Navigation header
│   │   ├── Filters.tsx     # Hierarchical filters
│   │   ├── SchoolsTable.tsx # Schools data table
│   │   ├── Charts.tsx      # Data visualization
│   │   └── Modals.tsx      # School forms and details
│   ├── hooks/              # Custom React hooks
│   │   ├── useAuth.tsx     # Authentication hook
│   │   ├── useSchools.tsx  # Schools data hook
│   │   └── useFilters.tsx  # Filter management hook
│   ├── lib/                # Utility libraries
│   │   ├── api.ts          # API client configuration
│   │   └── utils.ts        # Helper functions
│   └── types/              # TypeScript type definitions
│       └── index.ts        # Main type definitions
├── public/                 # Static assets
├── package.json            # Dependencies and scripts
├── tailwind.config.js      # Tailwind CSS configuration
├── tsconfig.json           # TypeScript configuration
└── next.config.js          # Next.js configuration
```

## 🎨 UI Components

### Design System

The application uses a consistent design system built with Tailwind CSS:

- **Colors**: Primary (blue), Secondary (gray), Success, Warning, Danger
- **Typography**: Inter font family with consistent sizing
- **Spacing**: 4px grid system (Tailwind defaults)
- **Shadows**: Subtle shadows for depth and hierarchy
- **Animations**: Smooth transitions and micro-interactions

### Component Library

- **Buttons**: Primary, Secondary, Danger variants
- **Forms**: Input fields, selects, checkboxes with validation
- **Cards**: Content containers with consistent styling
- **Tables**: Data tables with sorting and pagination
- **Modals**: Overlay dialogs for forms and details
- **Charts**: Pie charts, bar charts, and data visualizations

## 🔐 Authentication

### Features

- JWT token-based authentication
- Secure token storage in localStorage
- Automatic token refresh handling
- Protected routes and API calls
- User role management (admin/user)

### Flow

1. User visits `/login`
2. Enters credentials (email/password)
3. Backend validates and returns JWT token
4. Frontend stores token and redirects to dashboard
5. Token automatically included in API requests
6. Automatic logout on token expiration

## 📊 Data Management

### React Query Integration

The application uses React Query for efficient data management:

- **Automatic Caching**: Data cached with configurable stale times
- **Background Updates**: Data refreshed in background
- **Optimistic Updates**: UI updates immediately, rolls back on error
- **Error Handling**: Consistent error states and retry logic

### API Integration

- **Axios Client**: Configured with interceptors for auth
- **Type Safety**: Full TypeScript support for API responses
- **Error Handling**: Centralized error handling and user feedback

## 🎯 Key Features Implementation

### Hierarchical Filtering

```typescript
// Filter state management
const [filters, setFilters] = useState<Filters>({
  state: '',
  district: '',
  block: '',
  village: ''
})

// Cascading filter updates
const handleStateChange = (state: string) => {
  setFilters(prev => ({
    ...prev,
    state,
    district: '', // Reset dependent filters
    block: '',
    village: ''
  }))
}
```

### Real-time Charts

```typescript
// Chart data fetching with React Query
const { data: distributionData } = useQuery({
  queryKey: ['distribution', filters],
  queryFn: () => fetchDistributionData(filters),
  enabled: !!filters.state
})
```

### Responsive Design

```css
/* Mobile-first responsive utilities */
.mobile-hidden { display: none; }
.mobile-full { width: 100%; }

@media (min-width: 641px) {
  .desktop-hidden { display: none; }
}
```

## 🚀 Deployment

### Vercel Deployment

1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Environment Variables

```env
NEXT_PUBLIC_API_URL=https://your-backend-url.onrender.com
```

### Build Optimization

- **Code Splitting**: Automatic route-based code splitting
- **Image Optimization**: Next.js Image component optimization
- **Bundle Analysis**: Built-in bundle analyzer
- **Performance Monitoring**: Core Web Vitals tracking

## 🔧 Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

### Code Quality

- **ESLint**: Code linting and formatting
- **TypeScript**: Strict type checking
- **Prettier**: Code formatting (can be added)
- **Husky**: Git hooks for quality checks (can be added)

### Testing

- **Jest**: Unit testing framework (can be added)
- **React Testing Library**: Component testing (can be added)
- **Cypress**: E2E testing (can be added)

## 📱 Responsive Design

### Breakpoints

- **Mobile**: < 640px
- **Tablet**: 640px - 1024px
- **Desktop**: > 1024px

### Mobile Optimizations

- Touch-friendly interface elements
- Optimized table layouts for small screens
- Collapsible navigation and filters
- Swipe gestures for mobile interactions

## 🎨 Customization

### Theme Configuration

```javascript
// tailwind.config.js
theme: {
  extend: {
    colors: {
      primary: {
        50: '#eff6ff',
        // ... custom color palette
      }
    }
  }
}
```

### Component Styling

```css
/* Custom component classes */
.btn-primary {
  @apply bg-primary-600 hover:bg-primary-700 text-white font-medium py-2 px-4 rounded-lg;
}
```

## 🔒 Security Features

- **JWT Token Management**: Secure token storage and handling
- **Input Validation**: Client-side and server-side validation
- **XSS Protection**: React's built-in XSS protection
- **CSRF Protection**: Token-based CSRF protection
- **Secure Headers**: Next.js security headers

## 📊 Performance

### Optimization Techniques

- **Code Splitting**: Route-based code splitting
- **Image Optimization**: Next.js Image component
- **Lazy Loading**: Component and route lazy loading
- **Caching**: React Query caching strategies
- **Bundle Analysis**: Webpack bundle analyzer

### Monitoring

- **Core Web Vitals**: Performance metrics tracking
- **Error Tracking**: Error boundary and logging
- **Analytics**: User behavior and performance analytics

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For issues and questions:
1. Check the documentation
2. Review the code examples
3. Check browser console for errors
4. Verify API connectivity

---

**Built with ❤️ for the UDISE Dashboard Project** 