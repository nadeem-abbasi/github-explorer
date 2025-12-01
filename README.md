# GitHub User Explorer

A modern, responsive React application for searching GitHub users and exploring their repositories. Built with React 19, TypeScript, and following SOLID principles with a component-based architecture.

## Features

- 🔍 **Real-time Search**: Search GitHub users with debounced input
- 📱 **Mobile-First Design**: Fully responsive UI optimized for all devices
- ♿ **Accessible**: WCAG compliant with keyboard navigation and screen reader support
- 🎨 **Modern UI**: Clean design with smooth animations and transitions
- 📦 **Infinite Scrolling**: Load more users and repositories on demand
- 🎯 **Type-Safe**: Built with TypeScript in strict mode
- ✅ **Well-Tested**: Comprehensive unit tests with 80%+ coverage
- 📚 **Storybook**: Interactive component documentation

## Tech Stack

- **React 19.2.0**: Latest React with concurrent features
- **TypeScript ~5.9.3**: Static type checking
- **Vite 7.2.4**: Fast build tool and dev server
- **TanStack Query 5.x**: Powerful data fetching and caching
- **Jest 30.2.0**: Unit testing framework
- **React Testing Library 16.3.0**: Testing utilities
- **Storybook 10.1.2**: Component documentation and testing
- **CSS Modules**: Scoped styling
- **ESLint + Prettier**: Code quality and formatting

## Architecture

The application follows a clean, component-based architecture adhering to SOLID principles:

```
src/
├── api/                    # API layer
│   ├── githubApi.ts       # GitHub API functions
│   └── types.ts           # TypeScript interfaces
├── components/             # Reusable UI components
│   ├── Accordion/         # User accordion with repositories
│   ├── Button/            # Reusable button component
│   ├── EmptyState/        # Empty state display
│   ├── Error/             # Error message component
│   ├── Input/             # Text input component
│   ├── Loader/            # Loading spinner
│   └── SearchBar/         # Search input composition
├── hooks/                 # Custom React hooks
│   ├── useDebounce.ts    # Debounce hook
│   ├── useSearchUsers.ts # User search with pagination
│   └── useUserRepositories.ts # Repository fetching
├── styles/               # Global styles
│   └── variables.module.css # CSS custom properties
└── utils/                # Utility functions
    └── debounce.ts       # Debounce utility

```

### Key Design Decisions

- **Component-Based**: Each component is self-contained with its own styles, tests, and stories
- **CSS Modules**: Scoped styles to prevent conflicts and improve maintainability
- **Mobile-First**: Responsive design starting from 320px with breakpoints at 768px and 1024px
- **Accessibility**: All interactive elements meet WCAG standards (44px min-height, proper ARIA attributes)
- **API Layer**: Centralized GitHub API calls with proper error handling
- **React Query**: Efficient data fetching with caching and infinite scrolling
- **Type Safety**: Strict TypeScript configuration with no `any` types

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd github-explorer

# Install dependencies
npm install
```

### Development

```bash
# Start development server
npm run dev

# Run tests
npm run test

# Run tests with coverage
npm run test:coverage

# Start Storybook
npm run storybook

# Lint code
npm run lint

# Format code
npm run format
```

### Build

```bash
# Build for production
npm run build

# Preview production build
npm run preview
```

## Usage

1. **Search for Users**: Enter at least 3 characters in the search box
2. **View Results**: Users matching your search will appear in an accordion list
3. **Explore Repositories**: Click on a username to view their repositories
4. **Load More**: Click "Load More" buttons to fetch additional results

## Testing

The project maintains 80%+ code coverage with comprehensive tests:

```bash
# Run all tests
npm run test

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm run test:coverage
```

Tests include:
- Unit tests for all components
- Integration tests for the main App
- API layer tests with mocked fetch
- Hook tests with React Testing Library
- Accessibility tests

## Storybook

Interactive component documentation is available via Storybook:

```bash
npm run storybook
```

Visit http://localhost:6006 to explore all components with various states and props.

## API Rate Limiting

The application uses the GitHub REST API without authentication, which has a rate limit of 60 requests per hour. If you exceed this limit:

- The app will display an error message
- Wait an hour or use authenticated requests (not implemented) for higher limits

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Performance

- Debounced search input (500ms delay)
- Infinite scrolling for efficient data loading
- React Query caching (5-minute stale time)
- Code splitting ready

## Accessibility Features

- Semantic HTML elements
- ARIA labels and roles
- Keyboard navigation support
- Screen reader friendly
- High contrast text
- 44px minimum touch targets
- Focus indicators

## Future Enhancements

- GitHub authentication for higher rate limits
- Repository details modal
- User profile information
- Dark mode toggle
- Advanced search filters
- Local storage caching
- Error boundary implementation
- Service worker for offline support

## License

MIT

## Author

Built with ❤️ as part of a coding challenge
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
