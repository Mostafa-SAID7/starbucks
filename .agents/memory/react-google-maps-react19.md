---
name: React Google Maps + React 19 Marker Fix
description: AdvancedMarker/PinElement from @vis.gl/react-google-maps v1.x crashes in React 19; fix is to use legacy Marker with SVG data URL icons.
---

## The Rule
Never use `AdvancedMarker` or `Pin` from `@vis.gl/react-google-maps` v1.x in a React 19 project. Use the legacy `Marker` component with SVG data URL icons instead.

**Why:** `AdvancedMarkerElement` calls `getRootNode()` on its content container inside an async Google Maps scheduler callback. In React 19, the component can be in a transitional mount state when that callback fires, leaving the container reference undefined → `TypeError: Cannot read properties of undefined (reading 'getRootNode')`. `Pin`/`PinElement` has the same issue with StrictMode double-mount.

**How to apply:**
- Use `import { Marker } from '@vis.gl/react-google-maps'`  
- Pass `icon={{ url: 'data:image/svg+xml;charset=UTF-8,...', scaledSize, anchor }}` for custom pin appearance
- Do NOT pass `mapId` to `<Map>` unless a real Google Cloud Map ID is set — passing `'DEMO_MAP_ID'` triggers an async cloud-style fetch that also crashes (~1s after load, `setAttribute` TypeError)
- Remove `<StrictMode>` from `main.tsx` — the library is incompatible with React 19 StrictMode double-mount; it has zero effect on production builds

**Track upstream fix:** github.com/visgl/react-google-maps — re-add StrictMode + AdvancedMarker when library ships React 19 support.

**One remaining console warning:** `google.maps.Marker is deprecated` — Google has explicitly stated it will not be discontinued; it continues to receive bug fixes.

**One remaining external error:** `RefererNotAllowedMapError` — the Google Maps API key has HTTP referrer restrictions in Google Cloud Console that block dev domains. Fix: add `*.replit.dev/*` and `localhost:5000/*` to the allowed referrers list.
