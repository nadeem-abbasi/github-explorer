# GitHub User Explorer

A modern, responsive React application for searching GitHub users and exploring their repositories. Built with React 19, TypeScript, and TanStack Query.

🔗 **Live Demo:** [https://github-explorer-sage.vercel.app/](https://github-explorer-sage.vercel.app/)

## 🏗️ Architecture

The application follows a **layered architecture** with clear separation of concerns:

### **1. Presentation Layer** (`/components`)
- **UI Components**: Reusable, atomic components (Button, Input, Loader, etc.)
- **Feature Components**: Complex, domain-specific components (SearchResults, UserAccordion)
- **CSS Modules**: Scoped styling preventing conflicts
- **Accessibility**: WCAG-compliant with proper ARIA attributes

### **2. Data Layer** (`/api`)
- **GitHub API Client**: Centralized API functions (`searchUsers`, `getUserRepositories`)
- **Type Definitions**: Strict TypeScript interfaces
- **Error Handling**: Consistent error responses

### **3. State Management** (`/hooks`)
- **TanStack Query**: Server state management with caching
- **Custom Hooks**: Business logic abstraction (`useSearchUsers`, `useUserRepositories`)
- **Debouncing**: Optimized search input handling

### **4. Infrastructure**
- **Vite**: Fast bundling and HMR
- **React 19**: Latest concurrent features
- **Jest + RTL**: Comprehensive testing suite

### Design Principles

✅ **Single Responsibility**: Each component has one clear purpose  
✅ **Open/Closed**: Components are extensible without modification  
✅ **Dependency Inversion**: Hooks abstract external dependencies  
✅ **DRY**: Reusable components and utilities  
✅ **Mobile-First**: Responsive design from 320px up

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18.x or higher
- **npm** 9.x or higher

### Installation

```bash
# Clone the repository
git clone https://github.com/nadeem-abbasi/github-explorer.git
cd github-explorer

# Install dependencies
npm install

# Start development server
npm run dev
```

The application will be available at `http://localhost:5173`

### Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm test             # Run tests
npm run test:watch   # Run tests in watch mode
npm run test:coverage # Generate coverage report
npm run storybook    # Start Storybook on port 6006
npm run lint         # Lint code
npm run format       # Format code with Prettier
```

## 📦 Tech Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| React | 19.2.0 | UI framework with concurrent features |
| TypeScript | ~5.9.3 | Static type checking |
| Vite | 7.2.4 | Build tool and dev server |
| TanStack Query | 5.x | Data fetching and caching |
| Jest | 30.2.0 | Testing framework |
| React Testing Library | 16.3.0 | Component testing |
| Storybook | 10.1.2 | Component documentation |
| CSS Modules | - | Scoped styling |

## 🧪 Testing

The project maintains **80%+ code coverage** with unit, integration, and accessibility tests.

```bash
# Run all tests
npm test

# Watch mode for TDD
npm run test:watch

# Coverage report
npm run test:coverage
```

**Test Coverage Includes:**
- Component rendering and interactions
- API layer with mocked responses
- Custom hooks behavior
- Accessibility compliance
- Error handling scenarios

## 💡 Usage

1. **Search**: Type at least 3 characters in the search box
2. **Browse Results**: Click on any user to expand their accordion
3. **View Repositories**: Repositories are loaded and displayed with star counts
4. **Load More**: Use "Load More" buttons for pagination

## 🌐 Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)

## 📝 License

MIT

---

**Note:** This application uses the unauthenticated GitHub API with a rate limit of 60 requests/hour. For production use, implement authentication for higher limits.
