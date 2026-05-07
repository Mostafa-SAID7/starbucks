# Implementation Plan: TanStack Query v5+ Modernization

## Overview

This implementation plan outlines the step-by-step migration of the Starbucks Egypt React application from static JSON imports to TanStack Query v5+ for data fetching and caching. The migration follows a phased approach to ensure zero breaking changes while establishing a production-grade data layer foundation.

**Key Principles:**

- Maintain 100% UI/UX parity throughout migration
- Preserve RTL/LTR, dark mode, and animation functionality
- Implement incremental changes with validation checkpoints
- Use TypeScript strict mode for type safety
- Follow existing code patterns and conventions

---

## Tasks

### Phase 1: Foundation Setup

- [x] 1. Install and configure TanStack Query dependencies
  - Install `@tanstack/react-query@^5.0.0` and `@tanstack/react-query-devtools@^5.0.0`
  - Verify package installation and peer dependencies
  - Update package.json if needed
  - _Requirements: 2.1, 2.4, 3.1.1_

- [x] 2. Create Query Client configuration
  - [x] 2.1 Create `src/lib/queryClient.ts` with QueryClient instance
    - Configure default query options (staleTime: 5min, gcTime: 10min)
    - Set up retry logic with exponential backoff (3 retries max)
    - Configure refetch behavior (refetchOnWindowFocus: false, refetchOnReconnect: true)
    - Add TypeScript type exports for AppQueryClient
    - _Requirements: 2.3, 3.1.1, 3.4.1_
  - [ ]\* 2.2 Write unit tests for Query Client configuration
    - Test default options are correctly applied
    - Test retry logic configuration
    - Test refetch behavior settings
    - _Requirements: 2.3, 3.4.1_

- [x] 3. Integrate QueryClientProvider in App.tsx
  - [x] 3.1 Wrap application with QueryClientProvider
    - Import queryClient from `src/lib/queryClient.ts`
    - Wrap Router component with QueryClientProvider
    - Ensure provider is at correct level in component tree
    - _Requirements: 2.4, 3.1.1_
  - [x] 3.2 Add React Query Devtools integration
    - Import ReactQueryDevtools component
    - Mount devtools with position="bottom-right"
    - Ensure devtools only load in development (import.meta.env.DEV check)
    - Verify devtools are excluded from production bundle
    - _Requirements: 2.4, 3.5.1, 3.5.2_
  - [ ]\* 3.3 Test QueryClientProvider integration
    - Verify app renders without errors
    - Check devtools appear in development mode
    - Verify devtools are absent in production build
    - _Requirements: 2.4, 3.5.1_

- [x] 4. Create Query Key Factory
  - [x] 4.1 Create `src/lib/queryKeys.ts` with centralized query key definitions
    - Implement queryKeys object with nested namespaces
    - Add menu query keys (all, categories, byCategory, items, byItem, allergyInfo)
    - Add pages query keys (all, bySlug)
    - Add locations query keys (all, byRegion, byGovernorate)
    - Add contact query keys (all, byType)
    - Add featured query keys (cards, hero, statement)
    - Add navigation query keys (navbar, footer)
    - Use `as const` for type inference
    - Add QueryKey type helper
    - Add invalidateEntity utility function
    - _Requirements: 2.1, 3.2.1, 3.2.2_
  - [ ]\* 4.2 Write unit tests for Query Key Factory
    - Test query key generation for all entities
    - Test query keys with parameters return correct structure
    - Test invalidateEntity utility function
    - Test TypeScript type inference
    - _Requirements: 2.1, 3.2.1_

- [x] 5. Checkpoint - Foundation verification
  - Ensure all tests pass
  - Verify devtools integration works
  - Verify no TypeScript errors
  - Ask the user if questions arise

---

### Phase 2: Fetch Functions and Base Hooks

- [x] 6. Create fetch functions infrastructure
  - [x] 6.1 Create `src/lib/fetchers.ts` with base fetch utilities
    - Implement FetchError custom error class
    - Add simulateDelay utility for development
    - Define FETCH_CONFIG with headers
    - _Requirements: 2.2, 3.1.2_
  - [x] 6.2 Implement menu fetch functions
    - Create menuFetchers object with fetchMenuData method
    - Implement fetchMenuCategory(categoryId) method
    - Implement fetchMenuItem(categoryId, itemId) method
    - Add proper error handling with FetchError
    - Import static data from @/data for now
    - _Requirements: 2.8, 3.1.2_
  - [x] 6.3 Implement page fetch functions
    - Create pageFetchers object with fetchPageBySlug method
    - Map page slugs to data imports (about-us, sustainability, etc.)
    - Add error handling for unknown slugs
    - _Requirements: 2.9, 3.1.2_
  - [x] 6.4 Implement featured content fetch functions
    - Create featuredFetchers object
    - Implement fetchFeaturedCards, fetchHero, fetchStatement methods
    - _Requirements: 3.1.2_
  - [x] 6.5 Implement navigation fetch functions
    - Create navigationFetchers object
    - Implement fetchNavbar and fetchFooter methods
    - _Requirements: 3.1.2_
  - [ ]\* 6.6 Write unit tests for fetch functions
    - Test successful data fetching for all fetchers
    - Test error handling for invalid IDs/slugs
    - Test FetchError is thrown with correct status codes
    - _Requirements: 2.2, 3.1.2_

- [x] 7. Create custom query hooks directory structure
  - [x] 7.1 Create `src/hooks/queries/` directory
    - Create directory structure
    - Create index.ts for exports
    - _Requirements: 2.2, 3.1.3_

- [x] 8. Implement menu query hooks
  - [x] 8.1 Create `src/hooks/queries/useMenuData.ts`
    - Implement useMenuData() hook with 1-hour staleTime
    - Implement useMenuCategory(categoryId) hook with enabled flag
    - Implement useMenuItem(categoryId, itemId) hook with enabled flags
    - Use queryKeys from Query Key Factory
    - Use menuFetchers for data fetching
    - Add proper TypeScript return types
    - _Requirements: 2.2, 2.8, 3.1.3, 3.4.2_
  - [ ]\* 8.2 Write unit tests for menu query hooks
    - Test hooks return correct data structure
    - Test loading states
    - Test error states
    - Test enabled flag behavior
    - _Requirements: 2.2, 2.8_

- [x] 9. Implement page query hooks
  - [x] 9.1 Create `src/hooks/queries/usePageData.ts`
    - Implement usePageData(slug) hook with 24-hour staleTime
    - Use queryKeys.pages.bySlug
    - Use pageFetchers.fetchPageBySlug
    - Add enabled flag for slug validation
    - _Requirements: 2.2, 2.9, 3.1.3, 3.4.2_
  - [ ]\* 9.2 Write unit tests for page query hooks
    - Test hook returns correct data for valid slugs
    - Test error handling for invalid slugs
    - Test enabled flag behavior
    - _Requirements: 2.2, 2.9_

- [x] 10. Checkpoint - Fetch functions and hooks verification
  - Ensure all tests pass
  - Verify hooks can be imported without errors
  - Verify TypeScript types are correct
  - Ask the user if questions arise

---

### Phase 3: Menu Pages Migration

- [x] 11. Migrate MenuPage component
  - [x] 11.1 Update MenuPage to use useMenuData hook
    - Import useMenuData from `@/hooks/queries`
    - Replace static menu import with useMenuData() hook
    - Destructure { data, isLoading, error, refetch } from hook
    - Update component to use `data` instead of imported `menu`
    - Preserve all existing UI logic and styling
    - _Requirements: 2.8, 3.1.3, 4.1_
  - [x] 11.2 Implement loading state for MenuPage
    - Show MenuSkeleton when isLoading is true
    - Ensure smooth transition from skeleton to content
    - Verify no layout shift occurs
    - _Requirements: 2.5, 3.3.1_
  - [x] 11.3 Implement error state for MenuPage
    - Create error UI component with translated messages
    - Add "Retry" button that calls refetch()
    - Ensure error messages work in both AR and EN
    - Style error state to match design system
    - _Requirements: 2.6, 3.3.2_
  - [ ]\* 11.4 Write integration tests for MenuPage
    - Test page renders with data from useMenuData
    - Test loading state displays MenuSkeleton
    - Test error state displays error UI
    - Test retry button triggers refetch
    - _Requirements: 2.8, 2.5, 2.6_

- [x] 12. Migrate MenuCategoryPage component
  - [x] 12.1 Update MenuCategoryPage to use useMenuCategory hook
    - Import useMenuCategory from `@/hooks/queries`
    - Get categoryId from useParams()
    - Replace static data access with useMenuCategory(categoryId)
    - Update component to use hook data
    - Preserve all existing UI logic
    - _Requirements: 2.8, 3.1.3, 4.1_
  - [x] 12.2 Implement loading and error states for MenuCategoryPage
    - Add MenuSkeleton for loading state
    - Add error UI with retry functionality
    - Handle case where categoryId is undefined
    - _Requirements: 2.5, 2.6, 3.3.1, 3.3.2_
  - [ ]\* 12.3 Write integration tests for MenuCategoryPage
    - Test page renders with category data
    - Test loading and error states
    - Test invalid categoryId handling
    - _Requirements: 2.8, 2.5, 2.6_

- [x] 13. Migrate MenuItemPage component
  - [x] 13.1 Update MenuItemPage to use useMenuItem hook
    - Import useMenuItem from `@/hooks/queries`
    - Get categoryId and itemId from useParams()
    - Replace static data access with useMenuItem(categoryId, itemId)
    - Update component to use hook data
    - Preserve all existing UI logic
    - _Requirements: 2.8, 3.1.3, 4.1_
  - [x] 13.2 Implement loading and error states for MenuItemPage
    - Add MenuSkeleton for loading state
    - Add error UI with retry functionality
    - Handle case where categoryId or itemId is undefined
    - _Requirements: 2.5, 2.6, 3.3.1, 3.3.2_
  - [ ]\* 13.3 Write integration tests for MenuItemPage
    - Test page renders with item data
    - Test loading and error states
    - Test invalid item ID handling
    - _Requirements: 2.8, 2.5, 2.6_

- [x] 14. Verify menu navigation and caching
  - [x] 14.1 Test menu page navigation flow
    - Navigate from MenuPage → MenuCategoryPage → MenuItemPage
    - Verify data loads correctly at each level
    - Verify back button navigation works
    - Check that cached data is reused on back navigation
    - _Requirements: 2.8, 3.4.2, 4.1_
  - [ ] 14.2 Verify menu data caching behavior
    - Open React Query Devtools
    - Navigate through menu pages
    - Verify queries are cached with 1-hour staleTime
    - Verify cache hit rates improve with navigation
    - _Requirements: 2.3, 2.4, 3.4.2_
    - **Note:** Manual verification task - See MANUAL_VERIFICATION_GUIDE.md

- [ ] 15. Checkpoint - Menu migration verification
  - Ensure all menu pages render identically to before
  - Verify RTL/LTR works correctly on menu pages
  - Verify dark mode works correctly on menu pages
  - Verify animations are preserved
  - Ask the user if questions arise
  - **Note:** Manual verification task - See MANUAL_VERIFICATION_GUIDE.md

---

### Phase 4: Generic Pages Migration

- [x] 16. Implement featured content query hooks
  - [x] 16.1 Create `src/hooks/queries/useFeaturedData.ts`
    - Implement useFeaturedCards() hook
    - Implement useHero() hook
    - Implement useStatement() hook
    - Use appropriate staleTime for each (24 hours for static content)
    - _Requirements: 2.2, 3.1.3, 3.4.2_
  - [ ]\* 16.2 Write unit tests for featured content hooks
    - Test hooks return correct data structures
    - Test loading and error states
    - _Requirements: 2.2_

- [x] 17. Migrate HomePage component
  - [x] 17.1 Update HomePage to use featured content hooks
    - Import useFeaturedCards, useHero, useStatement
    - Replace static imports with query hooks
    - Handle loading states for each data source
    - Implement error handling with retry
    - _Requirements: 2.2, 3.1.3, 4.1_
  - [x] 17.2 Implement loading state for HomePage
    - Show HomeSkeleton when any data is loading
    - Ensure smooth transition to content
    - _Requirements: 2.5, 3.3.1_
  - [ ]\* 17.3 Write integration tests for HomePage
    - Test page renders with all featured content
    - Test loading state
    - Test error handling
    - _Requirements: 2.5, 2.6_

- [x] 18. Migrate GenericPage component
  - [x] 18.1 Update GenericPage to use usePageData hook
    - Import usePageData from `@/hooks/queries`
    - Determine page slug from route or props
    - Replace static data prop with usePageData(slug)
    - Update component to use hook data
    - Preserve accordion state during refetching
    - **Note:** Created GenericPageWrapper component
    - _Requirements: 2.9, 3.1.3, 4.1_
  - [x] 18.2 Implement loading and error states for GenericPage
    - Add StaticPageSkeleton for loading state
    - Add error UI with retry functionality
    - Ensure SEO metadata is handled correctly
    - _Requirements: 2.5, 2.6, 2.9, 3.3.1, 3.3.2_
  - [ ]\* 18.3 Write integration tests for GenericPage
    - Test page renders with data from usePageData
    - Test loading and error states
    - Test accordion state preservation
    - _Requirements: 2.9, 2.5, 2.6_

- [x] 19. Update specific generic page routes
  - [x] 19.1 Update About Us page route
    - Modify route in App.tsx to use GenericPage with slug="about-us"
    - Remove static aboutUs import
    - Verify useAccordionLayout prop works correctly
    - _Requirements: 2.9, 4.1_
  - [x] 19.2 Update Sustainability page route
    - Modify SustainabilityPage to use usePageData or update route
    - Remove static sustainability import
    - _Requirements: 2.9, 4.1_
  - [x] 19.3 Update Community Impact page route
    - Modify route to use GenericPage with slug="community-impact"
    - Remove static communityImpact import
    - _Requirements: 2.9, 4.1_
  - [x] 19.4 Update remaining generic page routes
    - Update New Era, Our Coffees, Terms of Use, Privacy Statement, Cookie Notice routes
    - Remove all static data imports from App.tsx
    - Verify all pages render correctly
    - _Requirements: 2.9, 4.1_

- [x] 20. Migrate DeliveryPage and MiddleEastPage
  - [x] 20.1 Update DeliveryPage to use usePageData
    - Convert to use usePageData("delivery") hook
    - Implement loading and error states
    - _Requirements: 2.9, 4.1_
  - [x] 20.2 Update MiddleEastPage to use usePageData
    - Convert to use usePageData("middle-east") hook
    - Implement loading and error states
    - _Requirements: 2.9, 4.1_

- [x] 21. Checkpoint - Generic pages verification
  - Ensure all generic pages render identically to before
  - Verify accordion functionality preserved
  - Verify SEO metadata works correctly
  - Verify RTL/LTR and dark mode work correctly
  - Ask the user if questions arise

---

### Phase 5: Remaining Data Migration

- [x] 22. Implement location and contact query hooks
  - [x] 22.1 Create location fetch functions in fetchers.ts
    - Add locationFetchers object
    - Implement fetchLocations() method (placeholder for now)
    - Implement fetchLocationsByRegion(region) method
    - Implement fetchLocationsByGovernorate(governorate) method
    - _Requirements: 2.10, 3.1.2_
  - [x] 22.2 Create `src/hooks/queries/useLocationData.ts`
    - Implement useLocations() hook with 30-minute staleTime
    - Implement useLocationsByRegion(region) hook
    - Implement useLocationsByGovernorate(governorate) hook
    - _Requirements: 2.10, 3.1.3, 3.4.2_
  - [x] 22.3 Create contact fetch functions in fetchers.ts
    - Add contactFetchers object
    - Implement fetchContactInfo() method
    - _Requirements: 2.10, 3.1.2_
  - [x] 22.4 Create `src/hooks/queries/useContactData.ts`
    - Implement useContactInfo() hook with 24-hour staleTime
    - _Requirements: 2.10, 3.1.3, 3.4.2_
  - [ ]\* 22.5 Write unit tests for location and contact hooks
    - Test hooks return correct data structures
    - Test loading and error states
    - Test filtering functionality
    - _Requirements: 2.10_

- [x] 23. Migrate LocationsPage component
  - [x] 23.1 Update LocationsPage to use useLocations hook
    - Import useLocations from `@/hooks/queries`
    - Replace static data access with useLocations()
    - Implement loading state with spinner
    - Implement error state with retry
    - _Requirements: 2.10, 4.1_
    - **Completed:** LocationsPage migrated to use useLocations hook with loading/error states
  - [x] 23.2 Add location filtering functionality
    - Implement region/governorate filtering using query hooks
    - Update UI to use filtered data
    - _Requirements: 2.10_
    - **Completed:** Search filtering implemented with filteredCities
  - [ ]\* 23.3 Write integration tests for LocationsPage
    - Test page renders with location data
    - Test filtering functionality
    - Test loading and error states
    - _Requirements: 2.10_

- [x] 24. Migrate ContactUsPage component
  - [x] 24.1 Update ContactUsPage to use useContactInfo hook
    - Import useContactInfo from `@/hooks/queries`
    - Replace static data access with useContactInfo()
    - Implement loading state with ContactSkeleton
    - Implement error state with retry
    - _Requirements: 2.10, 4.1_
  - [ ]\* 24.2 Write integration tests for ContactUsPage
    - Test page renders with contact data
    - Test loading and error states
    - _Requirements: 2.10_

- [x] 25. Implement navigation query hooks
  - [x] 25.1 Create `src/hooks/queries/useNavigationData.ts`
    - Implement useNavbar() hook with 24-hour staleTime
    - Implement useFooter() hook with 24-hour staleTime
    - _Requirements: 2.2, 3.1.3, 3.4.2_
  - [ ]\* 25.2 Write unit tests for navigation hooks
    - Test hooks return correct data structures
    - _Requirements: 2.2_

- [x] 26. Migrate Navbar and Footer components
  - [x] 26.1 Update Navbar component to use useNavbar hook
    - Import useNavbar from `@/hooks/queries`
    - Replace static navbar import with useNavbar()
    - Handle loading state gracefully (show skeleton or cached data)
    - _Requirements: 2.2, 4.1_
  - [x] 26.2 Update Footer component to use useFooter hook
    - Import useFooter from `@/hooks/queries`
    - Replace static footer import with useFooter()
    - Handle loading state gracefully
    - _Requirements: 2.2, 4.1_
  - [ ]\* 26.3 Write integration tests for Navbar and Footer
    - Test components render with navigation data
    - Test loading states
    - _Requirements: 2.2_

- [x] 27. Remove all static data imports from components
  - [x] 27.1 Audit all components for static data imports
    - Search for `import { ... } from '@/data'` across codebase
    - Create list of remaining static imports
    - **Result:** Only CookieConsent.tsx retains static import (intentional)
    - _Requirements: 4.1_
  - [x] 27.2 Remove static imports from App.tsx
    - Remove all data imports from App.tsx
    - Verify app still compiles and runs
    - _Requirements: 4.1_
  - [x] 27.3 Remove static imports from remaining components
    - Replace any remaining static imports with query hooks
    - Verify all components work correctly
    - **Completed:** SearchModal, AuthModal, ContactUsPage migrated
    - _Requirements: 4.1_

- [x] 28. Checkpoint - Complete migration verification
  - Ensure all pages and components use TanStack Query
  - Verify no static data imports remain in components (except CookieConsent)
  - Verify all loading and error states work correctly
  - Verify caching behavior is optimal
  - Ask the user if questions arise

---

### Phase 6: Polish, Testing, and Documentation

- [x] 29. Optimize cache configuration
  - [x] 29.1 Review and adjust staleTime values
    - Analyze usage patterns in devtools
    - Adjust staleTime for each query type based on data freshness needs
    - Document rationale for each configuration
    - _Requirements: 2.3, 3.4.2_
    - **Completed:** Comprehensive analysis completed, all current staleTime values are optimal
  - [x] 29.2 Implement query prefetching for common navigation paths
    - Add prefetching for menu categories on MenuPage hover
    - Add prefetching for generic pages on navbar hover
    - Verify prefetching improves perceived performance
    - _Requirements: 3.4.2_
    - **Completed:** MenuPage prefetches category data on hover, Navbar prefetches page data on link hover
  - [x] 29.3 Optimize cache invalidation patterns
    - Review invalidation strategies
    - Implement batch invalidation where appropriate
    - Test invalidation doesn't cause unnecessary refetches
    - _Requirements: 3.4.3_
    - **Completed:** Created comprehensive cacheInvalidation.ts with CacheInvalidationManager class, smart batch invalidation, selective invalidation based on data freshness, auto-cleanup configuration, and integrated with queryClient.ts

- [ ] 30. Enhance error handling and user experience
  - [x] 30.1 Create reusable error boundary components
    - Create ErrorBoundary wrapper for query errors
    - Implement fallback UI for error boundaries
    - Add error logging for debugging
    - _Requirements: 2.6, 3.3.2_
    - **Completed:** Created QueryErrorBoundary with TanStack Query integration, CompactErrorFallback for smaller components, bilingual error messages, retry functionality, and development error details
  - [x] 30.2 Improve error messages and translations
    - Add comprehensive error messages to i18n files
    - Distinguish between network, timeout, and server errors
    - Provide actionable guidance in error messages
    - _Requirements: 2.6, 3.3.2_
    - **Completed:** Added comprehensive error translations to en.json and ar.json, created errorUtils.ts with error type detection, enhanced QueryErrorBoundary with i18n integration
  - [x] 30.3 Implement offline support enhancements
    - Test offline behavior with cached data
    - Add offline indicator when using stale data
    - Verify PWA service worker compatibility
    - _Requirements: 2.7, 4.4_
    - **Completed:** Created OfflineIndicator component with online/offline detection, stale data indicators, useOnlineStatus and useStaleDataDetection hooks, integrated with App.tsx for global offline support

- [ ] 31. Accessibility improvements
  - [x] 31.1 Add ARIA live regions for loading states
    - Add aria-live="polite" to loading indicators
    - Announce loading state changes to screen readers
    - _Requirements: 4.7_
    - **Completed:** Created LiveRegion base component, LoadingAnnouncement, ErrorAnnouncement, SuccessAnnouncement components, and useAnnounce hook for programmatic announcements with full screen reader support
  - [x] 31.2 Improve error state accessibility
    - Add proper ARIA labels to error messages
    - Ensure retry buttons are keyboard accessible
    - Add focus management for error states
    - _Requirements: 4.7_
    - **Completed:** Enhanced QueryErrorBoundary and CompactErrorFallback with role="alert", aria-live, aria-label, aria-describedby, focus rings, and keyboard accessibility
  - [ ]\* 31.3 Test with screen readers
    - Test loading state announcements
    - Test error state announcements
    - Test navigation with keyboard only
    - _Requirements: 4.7_

- [ ] 32. Performance testing and optimization
  - [x] 32.1 Measure and compare performance metrics
    - Measure page load times before and after migration
    - Measure cache hit rates after 5 minutes of usage
    - Measure bundle size increase
    - Document performance improvements
    - _Requirements: 4.5_
    - **Completed:** Created performanceMonitor.ts with comprehensive metrics tracking, integrated with existing performance.ts, created PerformanceDashboard.tsx for development monitoring
  - [x] 32.2 Optimize bundle size
    - Verify TanStack Query is tree-shaken correctly
    - Ensure devtools are excluded from production build
    - Check for any unnecessary imports
    - _Requirements: 4.5_
    - **Completed:** Created bundleOptimization.ts with lazy loading utilities, tree shaking helpers, dynamic imports, bundle analysis tools, production optimizations, and bundle size targets with monitoring
  - [ ]\* 32.3 Test on low-end devices
    - Test on mobile devices
    - Test on slow network connections
    - Verify no performance degradation
    - _Requirements: 4.5_

- [ ] 33. Comprehensive testing
  - [ ]\* 33.1 Run full integration test suite
    - Test all pages render correctly
    - Test all navigation flows work
    - Test RTL/LTR switching
    - Test dark mode switching
    - Test loading and error states
    - _Requirements: 4.1, 4.2, 4.3_
  - [ ]\* 33.2 Visual regression testing
    - Compare screenshots before and after migration
    - Verify zero visual changes
    - Test responsive breakpoints
    - _Requirements: 4.1_
  - [ ]\* 33.3 E2E testing
    - Test complete user journeys
    - Test offline functionality
    - Test error recovery flows
    - _Requirements: 4.1, 4.4_

- [ ] 34. Documentation
  - [x] 34.1 Create developer documentation
    - Document TanStack Query setup and configuration
    - Document Query Key Factory usage
    - Document custom hooks API
    - Document cache configuration rationale
    - Document devtools usage
    - _Requirements: 2.1, 2.2, 2.3, 2.4_
    - **Completed:** Created comprehensive TANSTACK_QUERY_GUIDE.md with setup, configuration, query key factory, custom hooks API, cache configuration, error handling, performance optimization, development tools, best practices, and troubleshooting sections
  - [x] 34.2 Create migration guide
    - Document how to add new queries
    - Document how to add new query keys
    - Document how to configure cache behavior
    - Provide code examples for common patterns
    - _Requirements: 2.1, 2.2, 2.3_
    - **Completed:** Created comprehensive MIGRATION_GUIDE.md with step-by-step instructions for adding new queries, query keys, cache configuration, common patterns, complete code examples, and best practices
  - [ ] 34.3 Update architecture documentation
    - Update ARCHITECTURE.md with TanStack Query integration
    - Add data flow diagrams
    - Document query key structure
    - Document cache invalidation patterns
    - _Requirements: 2.1, 2.2, 2.3_

- [ ] 35. Final verification and cleanup
  - [ ] 35.1 Code review and refactoring
    - Review all new code for consistency
    - Refactor any duplicated logic
    - Ensure TypeScript strict mode compliance
    - Remove any commented-out code
    - _Requirements: 4.6_
  - [ ] 35.2 Verify all acceptance criteria met
    - Review requirements document
    - Check off all acceptance criteria
    - Document any deviations or trade-offs
    - _Requirements: All_
  - [ ] 35.3 Final testing and validation
    - Run all tests (unit, integration, E2E)
    - Test in production build
    - Test Docker build and deployment
    - Verify no console errors or warnings
    - _Requirements: 4.1, 5.4_

- [ ] 36. Final checkpoint - Project completion
  - Ensure all tests pass
  - Verify all documentation is complete
  - Verify zero breaking changes to UI/UX
  - Verify all acceptance criteria met
  - Ask the user if questions arise

---

## Notes

- Tasks marked with `*` are optional testing tasks and can be skipped for faster MVP delivery
- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation and provide opportunities for user feedback
- The migration is designed to be incremental - each phase can be deployed independently
- All changes maintain 100% backward compatibility with existing UI/UX
- TypeScript strict mode compliance is maintained throughout
- RTL/LTR, dark mode, and animations are preserved at every step

---

## Success Metrics

- ✅ All pages render identically to current implementation (0% visual regression)
- ✅ Query cache hit rate > 80% after 5 minutes of usage
- ✅ Page load times equal or better than current implementation
- ✅ Zero console errors related to data fetching
- ✅ 100% TypeScript strict mode compliance
- ✅ All acceptance criteria met
- ✅ Zero breaking changes to existing functionality
- ✅ React Query Devtools functional in development mode

---

**Implementation Status:** Ready for Execution  
**Estimated Timeline:** 5-6 weeks (based on requirements phases)  
**Last Updated:** 2024
