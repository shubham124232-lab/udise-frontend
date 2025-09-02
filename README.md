# UDISE Dashboard Frontend

A modern, responsive Next.js frontend for the UDISE Dashboard, featuring beautiful charts, hierarchical filtering, and a comprehensive school management interface.

## 🚀 Features

- **Modern UI/UX** - Beautiful, responsive design with Tailwind CSS and ShadCN components
- **Authentication** - JWT-based login/signup with secure token management
- **Hierarchical Filtering** - State → District → Block → Village level filtering
- **Interactive Charts** - Recharts-powered visualizations for data distribution
- **Real-time Updates** - React Query for efficient data fetching and caching
- **Responsive Design** - Mobile-first approach with Tailwind CSS
- **Type Safety** - Full TypeScript support with comprehensive type definitions
- **CRUD Operations** - Complete school record management with modals
- **Performance Optimized** - Lazy loading, memoization, and efficient rendering

## 🛠️ Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Styling**: Tailwind CSS + ShadCN UI Components
- **State Management**: React Query (TanStack Query)
- **Charts**: Recharts
- **Icons**: Lucide React
- **HTTP Client**: Axios
- **Language**: TypeScript
- **Authentication**: JWT with Context API
- **Forms**: React Hook Form + Zod validation
- **UI Components**: Radix UI primitives

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
│   │   ├── FilterBar.tsx   # Hierarchical filters
│   │   ├── SchoolsTable.tsx # Schools data table
│   │   ├── DistributionCharts.tsx # Data visualization
│   │   ├── SchoolFormModal.tsx # Add/Edit school modal
│   │   ├── SchoolDetailsModal.tsx # View school details
│   │   ├── DeleteConfirmModal.tsx # Delete confirmation
│   │   └── ui/             # ShadCN UI components
│   │       ├── Button.tsx
│   │       ├── Card.tsx
│   │       ├── Input.tsx
│   │       ├── Select.tsx
│   │       └── ...
│   ├── hooks/              # Custom React hooks
│   │   ├── useAuth.ts      # Authentication hook
│   │   ├── useSchools.ts   # Schools data hook
│   │   └── useDebounce.ts  # Debounce utility hook
│   ├── lib/                # Utility libraries
│   │   ├── api.ts          # API client configuration
│   │   └── utils.ts        # Helper functions
│   ├── types/              # TypeScript type definitions
│   │   └── index.ts        # Main type definitions
│   └── utils/              # Utility functions
│       └── performance.ts  # Performance utilities
├── public/                 # Static assets
├── package.json            # Dependencies and scripts
├── tailwind.config.js      # Tailwind CSS configuration
├── tsconfig.json           # TypeScript configuration
└── next.config.js          # Next.js configuration
```

## 🎨 UI Components

### Design System

The application uses a consistent design system built with Tailwind CSS and ShadCN components:

- **Colors**: Primary (blue), Secondary (gray), Success, Warning, Danger
- **Typography**: Inter font family with consistent sizing
- **Spacing**: 4px grid system (Tailwind defaults)
- **Shadows**: Subtle shadows for depth and hierarchy
- **Animations**: Smooth transitions and micro-interactions

### Component Library

- **Buttons**: Primary, Secondary, Danger variants with loading states
- **Forms**: Input fields, selects, checkboxes with validation
- **Cards**: Content containers with consistent styling
- **Tables**: Data tables with sorting and pagination
- **Modals**: Overlay dialogs for forms and details
- **Charts**: Pie charts, bar charts, and data visualizations
- **Loading States**: Skeleton loaders and spinners

## 🔐 Authentication

### Features

- JWT token-based authentication
- Secure token storage in localStorage
- Automatic token refresh handling
- Protected routes and API calls
- User session management

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
- **Loading States**: Built-in loading and error states

### API Integration

- **Axios Client**: Configured with interceptors for auth
- **Type Safety**: Full TypeScript support for API responses
- **Error Handling**: Centralized error handling and user feedback
- **Request/Response Logging**: Development debugging support

## 🎯 Key Features Implementation

### Hierarchical Filtering

```typescript
// Filter state management
const [filters, setFilters] = useState<Filters>({
  state: '',
  district: '',
  block: '',
  village: '',
  management: '',
  location: '',
  school_type: '',
  search: ''
})

// Cascading filter updates
const handleFilterChange = useCallback((key: keyof Filters, value: string | undefined) => {
  setFilters(prev => {
    const newFilters = { ...prev, [key]: value, page: 1 }
    // Clear dependent filters
    if (key === 'state') {
      newFilters.district = undefined
      newFilters.block = undefined
      newFilters.village = undefined
    }
    return newFilters
  })
}, [])
```

### Real-time Charts

```typescript
// Chart data fetching with React Query
const { data: distributionData, isLoading } = useQuery({
  queryKey: ['distribution', filters],
  queryFn: () => fetchDistributionData(filters),
  enabled: !!filters.state,
  staleTime: 2 * 60 * 1000 // 2 minutes
})
```

### Performance Optimizations

```typescript
// Memoized calculations
const chartData = useMemo(() => {
  if (!distributionData) return null
  return calculateChartData(distributionData)
}, [distributionData])

// Debounced search
const debouncedSearchTerm = useDebounce(searchTerm, 300)
```

## 🚀 Deployment

### Vercel Deployment

1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard:
   ```
   NEXT_PUBLIC_API_URL=https://your-backend-url.onrender.com
   ```
3. Deploy automatically on push to main branch

### Build Optimization

- **Code Splitting**: Automatic route-based code splitting
- **Image Optimization**: Next.js Image component optimization
- **Bundle Analysis**: Built-in bundle analyzer
- **Performance Monitoring**: Core Web Vitals tracking
- **Static Generation**: Pre-rendered pages where possible

## 🔧 Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

### Code Quality

- **ESLint**: Code linting and formatting
- **TypeScript**: Strict type checking
- **Prettier**: Code formatting (recommended)
- **Husky**: Git hooks for quality checks (recommended)

### Testing

- **Jest**: Unit testing framework (recommended)
- **React Testing Library**: Component testing (recommended)
- **Cypress**: E2E testing (recommended)

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
- Responsive charts and data visualization

## 🎨 Customization

### Theme Configuration

```javascript
// tailwind.config.js
theme: {
  extend: {
    colors: {
      primary: {
        50: '#eff6ff',
        500: '#3b82f6',
        600: '#2563eb',
        700: '#1d4ed8'
      }
    }
  }
}
```

### Component Styling

```css
/* Custom component classes */
.btn-primary {
  @apply bg-primary-600 hover:bg-primary-700 text-white font-medium py-2 px-4 rounded-lg transition-colors;
}
```

## 🔒 Security Features

- **JWT Token Management**: Secure token storage and handling
- **Input Validation**: Client-side and server-side validation
- **XSS Protection**: React's built-in XSS protection
- **CSRF Protection**: Token-based CSRF protection
- **Secure Headers**: Next.js security headers
- **Environment Variables**: Secure configuration management

## 📊 Performance

### Optimization Techniques

- **Code Splitting**: Route-based code splitting
- **Image Optimization**: Next.js Image component
- **Lazy Loading**: Component and route lazy loading
- **Caching**: React Query caching strategies
- **Memoization**: useMemo and useCallback for expensive operations
- **Bundle Analysis**: Webpack bundle analyzer

### Performance Metrics

- **First Contentful Paint**: < 1.5s
- **Largest Contentful Paint**: < 2.5s
- **Cumulative Layout Shift**: < 0.1
- **First Input Delay**: < 100ms

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes
4. Test thoroughly
5. Commit your changes: `git commit -m 'Add amazing feature'`
6. Push to the branch: `git push origin feature/amazing-feature`
7. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For issues and questions:

1. Check the documentation
2. Review the code examples
3. Check browser console for errors
4. Verify API connectivity
5. Check network requests in DevTools
6. Review environment variables

### Common Issues

- **Build Errors**: Clear `.next` folder and reinstall dependencies
- **API Connection**: Verify `NEXT_PUBLIC_API_URL` environment variable
- **Authentication Issues**: Check JWT token validity and storage
- **Performance Issues**: Use React DevTools Profiler to identify bottlenecks

---

**Built with ❤️ for the UDISE Dashboard Project**