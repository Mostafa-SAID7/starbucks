# TanStack Query v5+ Modernization Requirements

**Feature Name:** tanstack-query-modernization  
**Project:** Starbucks Egypt React Application  
**Status:** Requirements Phase  
**Last Updated:** 2024

---

## 1. Overview & Goals

### Mission Statement

Modernize the Starbucks Egypt React application's data layer by migrating from static JSON file imports to a production-grade data fetching and caching solution using TanStack Query v5+. This modernization will establish a robust foundation for server state management, enabling seamless integration with backend APIs while maintaining zero breaking changes to the existing UI/UX, accessibility, and internationalization features.

### Key Objectives

- **Eliminate Static Data Coupling:** Replace direct JSON imports with a query-based architecture that supports dynamic data fetching
- **Implement Intelligent Caching:** Leverage TanStack Query's caching mechanisms to reduce unnecessary network requests and improve performance
- **Establish Query Key Factory:** Create a centralized, type-safe query key management system for consistency and maintainability
- **Enable Devtools Integration:** Integrate TanStack Query Devtools for enhanced debugging and development experience
- **Preserve Existing Functionality:** Maintain 100% UI/UX parity, RTL/LTR support, dark mode, animations, and accessibility
- **Improve Developer Experience:** Provide clear patterns and utilities for data fetching across the application
- **Support Progressive Migration:** Enable incremental adoption without requiring a complete rewrite

### Success Criteria

- All pages render with identical UI/UX to the current implementation
- RTL/LTR text direction and layout handling remains unchanged
- Dark mode theme switching works seamlessly
- All Framer Motion animations execute without degradation
- TypeScript strict mode compliance maintained throughout
- Zero console errors or warnings related to data fetching
- Query performance metrics show improvement in cache hit rates
- Devtools integration allows real-time query inspection
- All existing routes and navigation patterns work identically
- PWA functionality and offline capabilities preserved
- Docker build and deployment process unchanged
- --legacy-peer-deps resolution maintained

---

## 2. User Stories

### 2.1 Developer: Query Key Management

**As a developer**, I want a centralized Query Key Factory that provides type-safe, consistent query keys across the application, so that I can avoid key collisions, maintain consistency, and easily refactor queries without breaking references.

**Acceptance Criteria:**

- Query Key Factory exports a `queryKeys` object with nested namespaces (e.g., `queryKeys.menu.all()`, `queryKeys.menu.byCategory(id)`)
- All query keys are generated using a factory pattern with consistent naming conventions
- Query keys support parameters with type safety (TypeScript inference)
- Query keys can be easily invalidated using patterns (e.g., `queryClient.invalidateQueries({ queryKey: queryKeys.menu.all() })`)
- Documentation and examples provided for adding new query keys
- No hardcoded query key strings exist in component code

### 2.2 Developer: Data Fetching Hooks

**As a developer**, I want custom hooks that wrap TanStack Query's `useQuery` and `useMutation` hooks, so that I can fetch data with consistent error handling, loading states, and type safety across the application.

**Acceptance Criteria:**

- Custom hooks (e.g., `useMenuData`, `useMenuCategory`, `useLocations`) are created for each major data entity
- Hooks return `{ data, isLoading, error, isError }` with proper TypeScript types
- Hooks automatically use the Query Key Factory
- Hooks support optional parameters for filtering/pagination
- Error handling is consistent and provides meaningful error messages
- Loading states are properly managed for skeleton/placeholder rendering
- Hooks integrate with React Router's `useParams` and `useSearchParams` where applicable

### 2.3 Developer: Cache Configuration

**As a developer**, I want to configure cache behavior (stale time, cache time, retry logic) globally and per-query, so that I can optimize performance and user experience based on data freshness requirements.

**Acceptance Criteria:**

- Global cache configuration is defined in a centralized config file
- Default stale time is set to 5 minutes for most queries
- Default cache time is set to 10 minutes
- Retry logic is configured with exponential backoff (max 3 retries)
- Per-query overrides are supported for special cases (e.g., menu data cached for 1 hour)
- Configuration is documented with rationale for each setting
- Cache behavior can be tested and verified

### 2.4 Developer: Devtools Integration

**As a developer**, I want TanStack Query Devtools integrated into the application, so that I can inspect queries, mutations, cache state, and debug data fetching issues in real-time.

**Acceptance Criteria:**

- TanStack Query Devtools component is mounted in the app (visible in development, hidden in production)
- Devtools show all active queries with their status, data, and cache state
- Devtools allow manual query invalidation and refetching
- Devtools display query history and timing information
- Devtools are only loaded in development environment
- No performance impact in production builds

### 2.5 User: Consistent Loading States

**As a user**, I want to see consistent, visually appealing loading states across all pages, so that I understand when data is being fetched and feel confident the application is responsive.

**Acceptance Criteria:**

- Loading states use existing skeleton components (HomeSkeleton, MenuSkeleton, etc.)
- Skeleton components match the layout of the actual content
- Loading states appear immediately when navigating to a new page
- Loading states are replaced smoothly with actual content
- No layout shift occurs when transitioning from skeleton to content
- Dark mode skeleton styling is consistent with the theme

### 2.6 User: Error Handling & Recovery

**As a user**, I want clear error messages when data fails to load, with options to retry, so that I can understand what went wrong and recover without losing my place in the application.

**Acceptance Criteria:**

- Error messages are displayed in a user-friendly format (not technical stack traces)
- Error messages are translated to both Arabic and English
- A "Retry" button is provided to attempt fetching data again
- Errors do not cause the entire page to crash (error boundaries in place)
- Error state is visually distinct from loading and success states
- Network errors, timeout errors, and server errors are handled appropriately

### 2.7 User: Offline Support & Caching

**As a user**, I want previously loaded data to remain available when I'm offline or experiencing network issues, so that I can continue browsing without interruption.

**Acceptance Criteria:**

- Cached data is displayed when network requests fail
- A subtle indicator shows when data is from cache vs. fresh from server
- Stale data is clearly marked as such
- Users can manually refresh to attempt fetching fresh data
- PWA offline functionality is preserved and enhanced
- Service worker integration works seamlessly with TanStack Query

### 2.8 Developer: Menu Data Migration

**As a developer**, I want to migrate the menu data from static JSON imports to TanStack Query, so that the application can support dynamic menu updates without code changes.

**Acceptance Criteria:**

- `useMenuData()` hook fetches all menu categories
- `useMenuCategory(categoryId)` hook fetches a specific category with items
- `useMenuItem(categoryId, itemId)` hook fetches a specific menu item
- Menu data structure remains identical to current JSON format
- All menu pages (MenuPage, MenuCategoryPage, MenuItemPage) use the new hooks
- Menu data is cached for 1 hour to reduce server load
- Pagination/filtering is supported for large menu datasets

### 2.9 Developer: Generic Page Data Migration

**As a developer**, I want to migrate generic page data (About Us, Sustainability, etc.) from static JSON imports to TanStack Query, so that content can be updated dynamically.

**Acceptance Criteria:**

- `useGenericPageData(pageSlug)` hook fetches page content by slug
- Generic pages (AboutUs, Sustainability, CommunityImpact, etc.) use the new hook
- Page data structure remains identical to current JSON format
- Data is cached for 24 hours (less frequently updated content)
- Accordion state is preserved during data refetching
- SEO metadata is properly handled

### 2.10 Developer: Locations & Contact Data Migration

**As a developer**, I want to migrate locations and contact data to TanStack Query, so that store locations and contact information can be updated in real-time.

**Acceptance Criteria:**

- `useLocations()` hook fetches all store locations
- `useContactInfo()` hook fetches contact information
- Locations data supports filtering by region/governorate
- Contact data includes multiple contact methods (phone, email, social)
- Data is cached for 30 minutes (frequently accessed but not real-time)
- Map integration (if present) works with the new data source

---

## 3. Functional Requirements

### 3.1 Data Layer Modernization with TanStack Query

#### 3.1.1 Query Client Setup

- Initialize `QueryClient` with production-grade configuration
- Configure default options for all queries (stale time, cache time, retry logic)
- Set up error handling and logging
- Integrate with React Router for route-based data fetching
- Provide `QueryClientProvider` wrapper at application root

#### 3.1.2 Data Fetching Strategy

- Implement fetch functions that will eventually call backend APIs
- Currently, fetch functions can return static data (for backward compatibility)
- Fetch functions must be async and return typed data
- Error handling must distinguish between network errors, timeouts, and server errors
- Support for request cancellation to prevent memory leaks

#### 3.1.3 Query Hooks Architecture

- Create custom hooks for each major data entity (menu, locations, pages, etc.)
- Hooks must return consistent shape: `{ data, isLoading, error, isError, refetch }`
- Hooks must support optional parameters for filtering/pagination
- Hooks must integrate with React Router params/search params
- Hooks must provide TypeScript inference for data types

### 3.2 Query Key Factory Implementation

#### 3.2.1 Query Key Structure

```typescript
queryKeys = {
  menu: {
    all: () => ["menu"],
    categories: () => ["menu", "categories"],
    byCategory: (id: string) => ["menu", "categories", id],
    items: (categoryId: string) => ["menu", "items", categoryId],
    byItem: (categoryId: string, itemId: string) => [
      "menu",
      "items",
      categoryId,
      itemId,
    ],
  },
  locations: {
    all: () => ["locations"],
    byRegion: (region: string) => ["locations", region],
  },
  pages: {
    all: () => ["pages"],
    bySlug: (slug: string) => ["pages", slug],
  },
  // ... additional entities
};
```

#### 3.2.2 Query Key Factory Features

- Centralized definition of all query keys
- Type-safe parameter passing
- Support for hierarchical invalidation patterns
- Documentation for each query key
- Consistent naming conventions

### 3.3 Loading/Error/Empty States

#### 3.3.1 Loading States

- Use existing skeleton components for each page type
- Skeleton components must match the layout of actual content
- Loading state must be shown immediately on navigation
- Smooth transition from skeleton to content (no layout shift)
- Support for partial loading (e.g., header loaded, content loading)

#### 3.3.2 Error States

- Display user-friendly error messages (not technical details)
- Provide "Retry" button for manual refetch
- Support error boundaries to prevent full page crashes
- Translate error messages to AR/EN
- Distinguish between different error types (network, timeout, server)

#### 3.3.3 Empty States

- Handle cases where data exists but is empty (e.g., no menu items)
- Display appropriate messaging for empty states
- Provide actions to navigate or retry if applicable

### 3.4 Cache Configuration

#### 3.4.1 Global Cache Settings

- **Stale Time:** 5 minutes (default for most queries)
- **Cache Time:** 10 minutes (default for most queries)
- **Retry:** 3 attempts with exponential backoff
- **Retry Delay:** 1000ms base, multiplied by attempt number

#### 3.4.2 Per-Query Overrides

- Menu data: 1 hour stale time (less frequently updated)
- Generic pages: 24 hours stale time (static content)
- Locations: 30 minutes stale time (semi-static)
- Contact info: 24 hours stale time (rarely changes)

#### 3.4.3 Cache Invalidation Strategy

- Automatic invalidation on route changes (if applicable)
- Manual invalidation via refetch buttons
- Batch invalidation for related queries
- Time-based invalidation (stale time)

### 3.5 Devtools Integration

#### 3.5.1 Devtools Setup

- Install `@tanstack/react-query-devtools`
- Mount devtools component in App.tsx (development only)
- Configure devtools to show in bottom-right corner
- Ensure devtools are not included in production bundle

#### 3.5.2 Devtools Features

- Real-time query inspection
- Cache state visualization
- Query history and timing
- Manual query invalidation
- Mutation tracking
- Network request logging

---

## 4. Non-Functional Requirements

### 4.1 Zero Breaking Changes to UI/UX

- All pages must render identically to the current implementation
- No visual changes to components, layouts, or styling
- Navigation flow remains unchanged
- User interactions (clicks, scrolls, etc.) behave identically
- Page transitions and animations are preserved
- Responsive design breakpoints unchanged

### 4.2 RTL/LTR Preservation

- Arabic (RTL) and English (LTR) text direction handling unchanged
- Layout mirroring for RTL maintained
- Flex direction and margin/padding adjustments preserved
- All text alignment and positioning logic intact
- No regression in RTL/LTR functionality

### 4.3 Dark Mode Preservation

- Dark mode theme switching works seamlessly
- All color schemes and contrast ratios maintained
- Dark mode skeleton components match current styling
- Theme context integration unchanged
- No visual regressions in dark mode

### 4.4 PWA Functionality

- Service worker continues to function
- Offline capabilities preserved and enhanced
- App manifest unchanged
- Installation prompts work as before
- Cache strategies compatible with TanStack Query

### 4.5 Performance

- Page load times equal or better than current implementation
- Cache hit rates improve over time
- Memory usage does not increase significantly
- Bundle size increase minimized (TanStack Query is ~40KB gzipped)
- No performance degradation on low-end devices

### 4.6 Type Safety (Strict TypeScript)

- All data types are properly defined and exported
- No `any` types used (except where absolutely necessary)
- Query hooks return properly typed data
- Error types are specific and handled appropriately
- TypeScript strict mode compliance maintained

### 4.7 Accessibility Improvements

- Loading states are announced to screen readers
- Error messages are properly associated with form fields
- Retry buttons are keyboard accessible
- Focus management during state transitions
- ARIA labels for loading/error states
- No regression in existing accessibility features

---

## 5. Technical Constraints

### 5.1 Technology Stack Requirements

- **React:** 19.x (strict mode enabled)
- **Vite:** 8.x (build tool)
- **TypeScript:** ~6.0.2 (strict mode)
- **React Router:** 7.x (routing)
- **TanStack Query:** 5.x (data fetching)
- **i18next:** 26.x (internationalization)
- **Framer Motion:** 12.x (animations)
- **shadcn/ui:** Latest (UI components)

### 5.2 React Router v7 Integration

- Query hooks must work with `useParams()` and `useSearchParams()`
- Route-based data fetching patterns supported
- Loader functions compatible with TanStack Query (if used)
- Navigation state preserved during data fetching
- Back button behavior unchanged

### 5.3 Animation Preservation

- All Framer Motion animations continue to work
- No conflicts between TanStack Query state updates and animations
- Transition animations during loading/error states smooth
- Page transition animations unchanged
- Skeleton animations (if present) preserved

### 5.4 Docker/CI Setup

- Docker build process unchanged
- CI/CD pipeline compatibility maintained
- Build output structure identical
- Environment variables handling unchanged
- Deployment process unaffected

### 5.5 Legacy Peer Dependencies Resolution

- `--legacy-peer-deps` flag continues to work
- No new peer dependency conflicts introduced
- Package.json overrides maintained
- Lock file compatibility preserved

---

## 6. Out of Scope

### 6.1 Backend API Implementation

- This modernization assumes static data sources initially
- Backend API endpoints are not part of this scope
- API contract definition is deferred to a future phase
- Authentication/authorization implementation is out of scope

### 6.2 UI Redesign

- No visual changes to components or layouts
- No new UI patterns or components introduced
- Styling remains identical
- Design system unchanged

### 6.3 New Features Beyond Data Layer Modernization

- Real-time data updates (WebSocket) not included
- Advanced filtering/search features not included
- Pagination UI enhancements not included
- New page types or routes not included
- Analytics integration not included

### 6.4 Performance Optimization Beyond Caching

- Code splitting optimization deferred
- Image optimization deferred
- Bundle size reduction (beyond TanStack Query) deferred
- SEO optimization deferred

---

## 7. Implementation Phases

### Phase 1: Foundation (Week 1-2)

- Set up TanStack Query and QueryClient
- Create Query Key Factory
- Implement Devtools integration
- Create base custom hooks structure

### Phase 2: Menu Data Migration (Week 2-3)

- Migrate menu data to TanStack Query
- Update MenuPage, MenuCategoryPage, MenuItemPage
- Implement loading/error states for menu pages
- Test and verify menu functionality

### Phase 3: Generic Pages Migration (Week 3-4)

- Migrate generic page data (About Us, Sustainability, etc.)
- Update GenericPage component
- Implement loading/error states for generic pages
- Test and verify generic page functionality

### Phase 4: Remaining Data Migration (Week 4-5)

- Migrate locations, contact, and other data
- Update remaining pages
- Implement loading/error states across all pages
- Comprehensive testing

### Phase 5: Polish & Documentation (Week 5-6)

- Devtools integration verification
- Performance testing and optimization
- Documentation and examples
- Code review and refinement

---

## 8. Acceptance Criteria Summary

### Must Have

- [ ] TanStack Query v5+ integrated and configured
- [ ] Query Key Factory implemented and used throughout
- [ ] All pages render identically to current implementation
- [ ] RTL/LTR functionality preserved
- [ ] Dark mode functionality preserved
- [ ] Loading states implemented for all pages
- [ ] Error states implemented with retry capability
- [ ] TypeScript strict mode compliance maintained
- [ ] Devtools integration working in development
- [ ] Zero breaking changes to UI/UX

### Should Have

- [ ] Custom hooks for all major data entities
- [ ] Cache configuration optimized for performance
- [ ] Offline support enhanced with TanStack Query
- [ ] Comprehensive error handling
- [ ] Performance metrics improved

### Nice to Have

- [ ] Advanced cache invalidation patterns
- [ ] Query prefetching for anticipated navigation
- [ ] Mutation support for future API integration
- [ ] Advanced Devtools usage documentation
- [ ] Performance monitoring integration

---

## 9. Testing Strategy

### Unit Tests

- Query Key Factory generates correct keys
- Custom hooks return expected data shapes
- Error handling works correctly
- Cache configuration applied properly

### Integration Tests

- Pages render with data from TanStack Query
- Loading/error states display correctly
- Navigation between pages works seamlessly
- RTL/LTR switching works correctly
- Dark mode switching works correctly

### E2E Tests

- Full user journeys work as before
- Data fetching doesn't break existing flows
- Performance is acceptable
- No console errors or warnings

### Manual Testing

- Visual regression testing (compare with current implementation)
- Accessibility testing with screen readers
- Mobile device testing
- Offline functionality testing
- Dark mode testing

---

## 10. Documentation Requirements

### Developer Documentation

- TanStack Query setup and configuration guide
- Query Key Factory usage examples
- Custom hooks API documentation
- Cache configuration rationale
- Devtools usage guide
- Migration guide for adding new queries

### Code Examples

- Basic query hook usage
- Error handling patterns
- Loading state patterns
- Cache invalidation patterns
- Devtools inspection examples

### Architecture Diagrams

- Data flow diagram (components → hooks → queries → cache)
- Query Key Factory structure
- Cache invalidation patterns
- Error handling flow

---

## 11. Success Metrics

- All pages render identically to current implementation (visual regression: 0%)
- Query cache hit rate > 80% after 5 minutes of usage
- Page load time equal or better than current implementation
- Zero console errors related to data fetching
- 100% TypeScript strict mode compliance
- All acceptance criteria met
- Zero breaking changes to existing functionality
- Developer satisfaction with new data layer (survey feedback)

---

## 12. Risks & Mitigation

### Risk: Breaking Changes to UI/UX

**Mitigation:** Comprehensive visual regression testing, side-by-side comparison with current implementation, incremental rollout

### Risk: Performance Degradation

**Mitigation:** Performance benchmarking before and after, cache configuration optimization, bundle size monitoring

### Risk: Complexity in Migration

**Mitigation:** Clear documentation, code examples, phased approach, code review process

### Risk: Compatibility Issues with React Router

**Mitigation:** Early testing with React Router v7, integration tests, documentation of patterns

### Risk: TypeScript Strict Mode Violations

**Mitigation:** Strict linting rules, pre-commit hooks, code review process

---

## 13. Glossary

- **Query:** A request for data from a source (currently static JSON, eventually APIs)
- **Query Key:** A unique identifier for a query used for caching and invalidation
- **Stale Time:** How long data is considered fresh before being marked as stale
- **Cache Time:** How long data remains in memory after it's no longer being used
- **Invalidation:** Marking cached data as stale to trigger a refetch
- **Devtools:** Developer tools for inspecting and debugging queries
- **RTL/LTR:** Right-to-Left (Arabic) and Left-to-Right (English) text direction
- **PWA:** Progressive Web App
- **Skeleton:** Loading placeholder that matches the shape of actual content

---

**Document Version:** 1.0  
**Last Updated:** 2024  
**Status:** Ready for Design Phase
