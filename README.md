# CodeTop FSRS Frontend

A modern Next.js frontend application for the CodeTop FSRS algorithm problem management system. This application provides an intelligent learning interface with spaced repetition scheduling and personalized recommendations.

## 🚀 Features

- **Next.js 15** with App Router and Turbopack
- **React 19** with TypeScript support
- **Radix UI** components for accessibility
- **Tailwind CSS 4** for styling
- **Dark/Light Mode** with next-themes
- **FSRS Algorithm Integration** for spaced repetition learning
- **AI-Powered Recommendations** with LLM integration
- **Comprehensive Testing** with Vitest and Playwright
- **Analytics Dashboard** with progress tracking

## 📦 Tech Stack

### Core
- **Framework**: Next.js 15
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS 4
- **UI Components**: Radix UI
- **Icons**: Lucide React, React Icons

### Data & State
- **Data Fetching**: TanStack React Query
- **Charts**: Recharts
- **Markdown**: React Markdown with Syntax Highlighting

### Testing
- **Unit Tests**: Vitest with Testing Library
- **E2E Tests**: Playwright
- **Coverage**: Vitest Coverage

## 🛠️ Development

### Prerequisites
- Node.js ^18.17 || ^20
- npm or yarn package manager

### Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd codetop-frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

### Available Scripts

```bash
# Development
npm run dev          # Start development server with Turbopack

# Building
npm run build        # Build for production
npm run start        # Start production server

# Testing
npm run test         # Run unit tests with Vitest
npm run test:ui      # Run tests with UI
npm run test:coverage # Generate coverage report
npm run test:e2e     # Run E2E tests with Playwright

# Linting
npm run lint         # Run ESLint
```

### Environment Variables

Create a `.env.local` file in the root directory:

```env
# API Configuration
NEXT_PUBLIC_API_BASE_URL=http://localhost:8080/api/v1
NEXT_PUBLIC_APP_ENV=development

# Optional: Analytics
NEXT_PUBLIC_ANALYTICS_ID=your_analytics_id
```

## 🏗️ Project Structure

```
├── app/                    # Next.js App Router pages
│   ├── dashboard/         # User dashboard
│   ├── codetop/          # Problem practice
│   ├── review/           # FSRS review system
│   ├── analysis/         # Learning analytics
│   └── ...
├── components/            # Reusable components
│   ├── ui/               # Base UI components (Radix)
│   ├── dashboard/        # Dashboard-specific components
│   ├── auth/             # Authentication components
│   └── ...
├── lib/                  # Utility libraries
│   ├── api.ts           # API client configuration
│   ├── auth-context.tsx # Authentication context
│   └── ...
├── hooks/               # Custom React hooks
├── types/               # TypeScript type definitions
└── tests/               # Test files
    ├── e2e/            # Playwright E2E tests
    └── __tests__/      # Unit tests
```

## 🔧 Configuration

### API Configuration
Update the API base URL in your environment variables to point to your backend server.

### Tailwind CSS
The project uses Tailwind CSS 4 with custom configuration in `tailwind.config.js`.

### TypeScript
TypeScript configuration in `tsconfig.json` with strict mode enabled.

### ESLint
ESLint configuration in `eslint.config.mjs` with Next.js recommended rules.

## 🚀 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Configure environment variables in Vercel dashboard:
   - `NEXT_PUBLIC_API_BASE_URL`: Your backend API URL
4. Deploy automatically on push to main branch

### Manual Deployment

```bash
# Build the application
npm run build

# Start production server
npm run start
```

## 🧪 Testing

### Unit Testing
```bash
# Run all unit tests
npm run test

# Run tests with coverage
npm run test:coverage

# Run tests in watch mode
npm run test:ui
```

### E2E Testing
```bash
# Run all E2E tests
npm run test:e2e

# Run E2E tests with UI
npm run test:e2e:ui

# View test reports
npm run test:e2e:report
```

## 📊 Features Overview

### Dashboard
- Learning progress visualization
- FSRS review queue management
- AI-powered problem recommendations
- Performance analytics

### Problem Practice
- CodeTop problem database
- Difficulty-based filtering
- Company-specific problem sets
- Progress tracking

### Spaced Repetition
- FSRS v4.5+ algorithm integration
- Personalized review scheduling
- Learning curve optimization
- Retention rate tracking

### Analytics
- Learning insights and trends
- Performance metrics
- Study pattern analysis
- Progress visualization

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new features
5. Run the test suite
6. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🔗 Related Projects

- [CodeTop FSRS Backend](https://github.com/your-username/codetop-backend) - Java Spring Boot API server
