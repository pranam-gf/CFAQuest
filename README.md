# CFA Level 3 AI Leaderboard

## Overview

This is a full-stack web application that displays and analyzes AI model performance on CFA Level 3 exam evaluations. The application presents leaderboards for both MCQ (Multiple Choice Questions) and Essay evaluations, with comprehensive filtering, sorting, and visualization capabilities.

## User Preferences

```
Preferred communication style: Simple, everyday language.
```

## System Architecture

The application follows a modern full-stack architecture with clear separation between frontend and backend concerns:

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite for fast development and optimized production builds
- **UI Library**: Shadcn/ui components built on Radix UI primitives
- **Styling**: Tailwind CSS with CSS custom properties for theming
- **State Management**: TanStack Query for server state management
- **Routing**: Wouter for lightweight client-side routing

### Backend Architecture
- **Runtime**: Node.js with Express.js
- **Language**: TypeScript with ES modules
- **Data Storage**: In-memory storage with CSV data loading
- **API Design**: RESTful API endpoints for data retrieval

## Key Components

### Data Layer
- **Schema Definition**: Shared TypeScript interfaces and Drizzle ORM schemas
- **Storage Interface**: Abstract storage interface (`IStorage`) with in-memory implementation
- **Data Source**: CSV files loaded at application startup

### API Endpoints
- `GET /api/mcq-evaluations` - Retrieve MCQ evaluation data
- `GET /api/essay-evaluations` - Retrieve essay evaluation data  
- `GET /api/statistics` - Get aggregated performance statistics

### Frontend Components
- **Dashboard**: Main application view with tabbed interface
- **Leaderboards**: Separate components for MCQ and Essay evaluations
- **Charts**: Performance visualization using Recharts
- **Filtering/Sorting**: Interactive data manipulation controls
- **Model Comparison**: Side-by-side comparison functionality

## Data Flow

1. **Application Startup**: CSV data is loaded into memory storage
2. **Client Request**: React components fetch data via TanStack Query
3. **API Processing**: Express routes retrieve data from storage layer
4. **Data Transformation**: Client-side processing for charts and filtering
5. **UI Updates**: React components re-render with processed data

## External Dependencies

### Core Dependencies
- **Database**: PostgreSQL support configured (via Drizzle + Neon)
- **UI Components**: Extensive Radix UI component library
- **Charts**: Recharts for data visualization
- **Form Handling**: React Hook Form with Zod validation
- **Date Handling**: date-fns library

### Development Tools
- **TypeScript**: Full type safety across the stack
- **ESBuild**: Fast bundling for production
- **PostCSS**: CSS processing with Tailwind

## Deployment Strategy

### Development
- **Local Development**: Vite dev server with HMR
- **Environment**: NODE_ENV=development with tsx for TypeScript execution
- **Hot Reload**: Vite middleware integrated with Express

### Production  
- **Build Process**: 
  1. Vite builds frontend assets to `dist/public`
  2. ESBuild bundles server code to `dist/index.js`
- **Static Serving**: Express serves built assets in production
- **Process**: Single Node.js process serving both API and static files

### Database Configuration
- **Development**: Uses in-memory storage with CSV data
- **Production Ready**: Drizzle ORM configured for PostgreSQL
- **Migrations**: Drizzle migrations stored in `./migrations`

### Key Architectural Decisions

1. **Monorepo Structure**: Single repository with shared types and clear boundaries
2. **Type Safety**: End-to-end TypeScript with shared schema definitions
3. **Component Library**: Shadcn/ui for consistent, accessible UI components
4. **Data Storage**: Memory-based storage for demo purposes, easily switchable to PostgreSQL
5. **State Management**: Server state via TanStack Query, minimal client state
6. **Styling Strategy**: Utility-first CSS with design system variables
