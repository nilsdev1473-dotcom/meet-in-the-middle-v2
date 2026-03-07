# Meet in the Middle v2 — iOS × Arc Aesthetic

**Project:** meet-in-the-middle-v2  
**Created:** 2026-03-07  
**Build time estimate:** 50 minutes  
**Design:** iOS native + Arc Browser (minimal, premium, playful gradients)

---

## Overview

A minimal, beautiful map app that auto-detects your location and helps find the perfect meetup spot. Designed to feel like a native iOS app with Arc Browser's playful gradient accents. One simple flow: load → your location detected → add friend → see center → venues appear.

---

## Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Animations:** Framer Motion (spring physics)
- **Icons:** Lucide React
- **Font:** SF Pro Display (via next/font/local) or Inter (fallback)
- **Map:** Mapbox GL JS (free tier, modern style)
- **Geocoding:** Mapbox Geocoding API (free tier)
- **Venues:** Mapbox Places API or Overpass API (free)
- **Deployment:** Vercel

---

## Design System

### Color Palette
```css
/* iOS Base */
--background: 0 0% 98% (#FAFAFA, off-white)
--card-bg: 0 0% 96% (#F5F5F7, light gray cards)
--foreground: 240 10% 11% (#1D1D1F, near-black text)
--muted: 0 0% 53% (#86868B, iOS gray)

/* iOS Accent */
--ios-blue: 210 100% 50% (#007AFF, iOS system blue)

/* Arc Gradients */
--arc-purple-pink: linear-gradient(135deg, #8B5CF6 0%, #EC4899 100%)
--arc-blue-cyan: linear-gradient(135deg, #3B82F6 0%, #06B6D4 100%)
--arc-gold: linear-gradient(135deg, #F59E0B 0%, #EF4444 100%)

/* Shadows */
--ios-shadow: 0 2px 8px rgba(0, 0, 0, 0.08)
--ios-shadow-lg: 0 4px 16px rgba(0, 0, 0, 0.12)
```

### Typography
- **Font:** SF Pro Display (weights: 400, 500, 600, 700)
- **Scale:** 16px base, 20px body, 32px headings, 48px hero
- **Line height:** 1.5 (body), 1.2 (headings)
- **Letter spacing:** -0.02em (tight, iOS style)

### Spacing
- **Grid:** 8px base unit (iOS standard)
- **Card padding:** 24px (3 units)
- **Section gaps:** 32px (4 units)
- **Generous whitespace:** 48px+ between major sections

### Shadows
- **Cards:** 0 2px 8px rgba(0,0,0,0.08)
- **Elevated:** 0 4px 16px rgba(0,0,0,0.12)
- **Active:** 0 1px 4px rgba(0,0,0,0.06)

### Animations
- **Spring:** { type: "spring", stiffness: 300, damping: 30 }
- **Duration:** 300ms (iOS standard)
- **Easing:** ease-out

---

## User Stories

### Story 1: Project Setup & iOS Design System
**As a developer, I need the iOS × Arc foundation**

**Acceptance Criteria:**
- [ ] Next.js 14 project initialized with TypeScript
- [ ] Tailwind CSS configured with iOS color system
- [ ] Framer Motion installed
- [ ] Lucide React installed
- [ ] SF Pro Display font loaded via next/font/local (or Inter fallback)
- [ ] globals.css with iOS design tokens + Arc gradients
- [ ] tailwind.config.ts with iOS spacing scale (8px grid)
- [ ] Light theme (white/light gray, minimal)

**Files:**
- `app/layout.tsx` — SF Pro font, metadata
- `app/globals.css` — iOS tokens, Arc gradients, spring animations
- `tailwind.config.ts` — 8px grid, iOS colors
- `package.json` — all dependencies

---

### Story 2: Mapbox GL JS Integration
**As a user, I want to see a beautiful modern map**

**Acceptance Criteria:**
- [ ] Mapbox GL JS installed (`npm install mapbox-gl react-map-gl`)
- [ ] Mapbox access token configured (use free tier)
- [ ] Map component with clean "Streets" style (not satellite)
- [ ] Default center: [40.7128, -74.006] (NYC)
- [ ] Default zoom: 12
- [ ] Smooth zoom/pan controls
- [ ] No OpenStreetMap (use Mapbox only)
- [ ] Dynamic import to avoid SSR issues
- [ ] Full viewport height

**Files:**
- `components/Map/MapboxMap.tsx`
- `.env.local` — NEXT_PUBLIC_MAPBOX_TOKEN

**Note:** If Mapbox token not available, fall back to free MapTiler or Maptiler GL JS with OSM data but styled cleanly.

---

### Story 3: Auto Location Detection
**As a user, I want my location detected automatically on load**

**Acceptance Criteria:**
- [ ] Request geolocation permission on mount
- [ ] Friendly prompt: "Allow location to find your meetup spot"
- [ ] If granted: blue pin drops at user location (animated)
- [ ] If denied: show manual address input as fallback
- [ ] Loading state while detecting
- [ ] Error state with retry button
- [ ] iOS-style permission modal feel

**Files:**
- `hooks/useGeolocation.ts`
- `components/LocationDetector.tsx`

---

### Story 4: iOS-Style UI Components
**As a developer, I need minimal, premium components**

**Acceptance Criteria:**
- [ ] Card component: light gray bg, subtle shadow, rounded-2xl
- [ ] Button component: iOS blue, rounded-xl, spring animation on press
- [ ] Input component: minimal border, iOS focus ring
- [ ] Toast component: iOS-style banner (top, spring slide down)
- [ ] No glassmorphism effects (too heavy)
- [ ] All components use SF Pro font
- [ ] 44px minimum touch targets

**Files:**
- `components/ui/Card.tsx`
- `components/ui/Button.tsx`
- `components/ui/Input.tsx`
- `components/ui/Toast.tsx`

---

### Story 5: Floating Friend Input Card
**As a user, I want to add my friend's location easily**

**Acceptance Criteria:**
- [ ] Floating card at bottom of screen (Arc style)
- [ ] Gradient border (purple → pink, 1px)
- [ ] Large heading: "Where is your friend?"
- [ ] Single input field for address
- [ ] Auto-complete suggestions (Mapbox Geocoding)
- [ ] Enter key submits
- [ ] Loading state while geocoding
- [ ] Success: card slides up, friend pin drops
- [ ] Pin color: Arc gradient (purple → pink)

**Files:**
- `components/FriendInput.tsx`
- `lib/mapbox-geocoding.ts`

---

### Story 6: Custom Gradient Map Markers
**As a user, I want beautiful pins on the map**

**Acceptance Criteria:**
- [ ] User pin: Solid iOS blue circle with white ring
- [ ] Friend pin: Gradient circle (purple → pink) with white ring
- [ ] Center pin: Gold gradient (gold → red) with pulsing animation
- [ ] All pins: 40px diameter, drop shadow
- [ ] Smooth drop animation on add
- [ ] Tap pin → show address popup (minimal, iOS style)

**Files:**
- `components/Map/UserMarker.tsx`
- `components/Map/FriendMarker.tsx`
- `components/Map/CenterMarker.tsx`

---

### Story 7: Center Calculation & Animation
**As a developer, I need to calculate the midpoint**

**Acceptance Criteria:**
- [ ] Calculate geographic center from 2+ locations
- [ ] Center pin drops with spring animation
- [ ] Map auto-pans to show all pins
- [ ] Smooth zoom to fit bounds
- [ ] Center updates when locations change

**Files:**
- `lib/geo-utils.ts` — calculateCenter, fitBounds

---

### Story 8: Nearby Venues (iOS Cards)
**As a user, I want to see bars/cafes near the center**

**Acceptance Criteria:**
- [ ] Fetch venues within 500m of center (Mapbox Places or Overpass)
- [ ] Display as iOS-style cards below map
- [ ] Each card: venue name, type icon, distance, "Directions" button
- [ ] Cards appear automatically (no tabs)
- [ ] Scroll horizontally on mobile
- [ ] Vertical list on tablet/desktop
- [ ] Loading skeleton while fetching
- [ ] Empty state if no venues found

**Files:**
- `components/VenueList.tsx`
- `components/VenueCard.tsx`
- `lib/venues.ts` — fetchNearbyVenues

---

### Story 9: Share Functionality
**As a user, I want to share the meetup location**

**Acceptance Criteria:**
- [ ] Share button in top-right (iOS share icon)
- [ ] Generates URL with center coordinates
- [ ] Copy to clipboard with iOS-style toast
- [ ] URL format: ?lat=40.7128&lng=-74.006
- [ ] On open: auto-loads center point on map

**Files:**
- `components/ShareButton.tsx`

---

### Story 10: Mobile Layout & Responsive
**As a user, I want a beautiful mobile experience**

**Acceptance Criteria:**
- [ ] Mobile (<768px): Full-screen map, floating input card, horizontal venue scroll
- [ ] Tablet (768px-1024px): Same as mobile
- [ ] Desktop (1024px+): Map + side panel with input/venues
- [ ] All touch targets: 44px minimum
- [ ] Smooth spring animations on all interactions
- [ ] Safe area support (iPhone notch)

**Files:**
- `app/page.tsx` — main layout
- `components/HomeContent.tsx` — responsive container

---

### Story 11: Loading & Error States
**As a user, I want clear feedback on what's happening**

**Acceptance Criteria:**
- [ ] Initial load: Spinner with "Finding your location..."
- [ ] Geocoding: Input shows loading spinner
- [ ] Venues: Skeleton cards while fetching
- [ ] Errors: iOS-style banner at top with retry button
- [ ] No broken states

**Files:**
- `components/ui/LoadingSpinner.tsx`
- `components/ui/ErrorBanner.tsx`

---

### Story 12: Spring Animations & Polish
**As a user, I want smooth, delightful interactions**

**Acceptance Criteria:**
- [ ] All cards slide up with spring physics
- [ ] Pins drop with bounce
- [ ] Buttons scale on press (0.95)
- [ ] Venue cards lift on hover
- [ ] Map pans smoothly to new bounds
- [ ] Respects prefers-reduced-motion
- [ ] 60fps animations

**Files:**
- All component files (Framer Motion integration)

---

## Dependencies

```json
{
  "dependencies": {
    "next": "^14.2.0",
    "react": "^18.3.0",
    "react-dom": "^18.3.0",
    "framer-motion": "^11.0.0",
    "lucide-react": "^0.344.0",
    "mapbox-gl": "^3.1.0",
    "react-map-gl": "^7.1.0"
  },
  "devDependencies": {
    "@types/node": "^20",
    "@types/react": "^18",
    "@types/react-dom": "^18",
    "@types/mapbox-gl": "^3.1.0",
    "typescript": "^5",
    "tailwindcss": "^3.4.0",
    "postcss": "^8",
    "autoprefixer": "^10"
  }
}
```

---

## File Structure

```
meet-in-the-middle-v2/
├── app/
│   ├── layout.tsx          # SF Pro font, metadata
│   ├── page.tsx            # Main page
│   ├── globals.css         # iOS tokens + Arc gradients
│   └── favicon.ico
├── components/
│   ├── Map/
│   │   ├── MapboxMap.tsx       # Main map
│   │   ├── UserMarker.tsx      # Blue pin
│   │   ├── FriendMarker.tsx    # Gradient pin
│   │   └── CenterMarker.tsx    # Gold pulsing pin
│   ├── ui/
│   │   ├── Card.tsx            # iOS card
│   │   ├── Button.tsx          # iOS button
│   │   ├── Input.tsx           # iOS input
│   │   ├── Toast.tsx           # iOS toast
│   │   ├── LoadingSpinner.tsx
│   │   └── ErrorBanner.tsx
│   ├── FriendInput.tsx     # Floating input card
│   ├── VenueList.tsx       # Horizontal scroll
│   ├── VenueCard.tsx       # iOS venue card
│   ├── ShareButton.tsx     # Share functionality
│   └── HomeContent.tsx     # Main container
├── lib/
│   ├── mapbox-geocoding.ts # Mapbox Geocoding API
│   ├── venues.ts           # Venue search
│   ├── geo-utils.ts        # Center calculation
│   └── types.ts            # TypeScript types
├── hooks/
│   └── useGeolocation.ts   # Auto location detection
├── .env.local              # NEXT_PUBLIC_MAPBOX_TOKEN
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

---

## Quality Gates

### Before Story Completion:
- [ ] TypeScript: `npx tsc --noEmit` → zero errors
- [ ] No `any` types
- [ ] All animations use spring physics
- [ ] All cards have iOS shadows
- [ ] All touch targets ≥ 44px

### Before Deploy:
- [ ] `npm run build` → zero errors
- [ ] Test on iPhone (Safari)
- [ ] Test on Android (Chrome)
- [ ] Mapbox loads correctly
- [ ] Geolocation prompts work
- [ ] Share link works
- [ ] Venues fetch successfully

---

## Expected Deliverables

1. **GitHub Repository:** https://github.com/nilsdev1473-dotcom/meet-in-the-middle-v2
2. **Live Vercel URL:** https://meet-in-the-middle-v2-[hash].vercel.app
3. **Build time:** ~50 minutes
4. **12 stories completed**

---

## Design Philosophy

**iOS Native:**
- SF Pro font throughout
- 8px spacing grid
- Subtle shadows
- iOS blue accent
- Spring animations
- Clean, minimal

**Arc Browser:**
- Playful gradients on accents
- Floating cards
- Smooth everything
- Purposeful color

**Result:** Feels like an iOS app with a touch of Arc's personality.

---

## Mapbox Setup

**Free Tier Limits:**
- 50,000 map loads/month
- 100,000 geocoding requests/month
- 100,000 directions requests/month

**Token:** Create at https://account.mapbox.com/access-tokens/
**Scopes needed:** `styles:tiles`, `geocoding`, `directions`

If Mapbox token not available during build, use MapTiler (also free) as fallback.

---

**This is the rebuild. Premium, minimal, iOS × Arc.**
