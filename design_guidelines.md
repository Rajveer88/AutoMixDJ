# WarpDrive Application - Design Guidelines

## Design Approach

**Selected Approach:** Cyberpunk/Futuristic Dark Mode (User-Specified)

Drawing inspiration from modern DJ software interfaces (Rekordbox, Serato, Traktor) combined with cyberpunk aesthetics. The design prioritizes functional clarity for audio professionals while maintaining a visually striking, futuristic appearance.

## Core Design Elements

### A. Typography

**Primary Font:** "Rajdhani" or "Orbitron" (Google Fonts) - angular, tech-forward
**Secondary Font:** "Inter" or "Roboto" (Google Fonts) - clean, readable

**Hierarchy:**
- App Title: 700 weight, 2.5rem (40px)
- Section Headers (Deck A/B, Mixer): 600 weight, 1.5rem (24px)
- BPM Values/Numbers: 700 weight, 1.75rem (28px) - monospaced style
- Labels: 500 weight, 0.875rem (14px), uppercase, letter-spacing 0.1em
- Button Text: 600 weight, 1rem (16px)

### B. Layout System

**Spacing Primitives:** Tailwind units of 2, 4, 6, and 8 (0.5rem, 1rem, 1.5rem, 2rem)

**Grid Structure:**
- Container: Full viewport width, max-w-7xl centered
- Three-column layout: Deck A (flex-1) | Mixer (w-80) | Deck B (flex-1)
- Padding: p-6 for deck containers, p-4 for control groups
- Gap between elements: gap-4 within sections, gap-6 between major sections

**Responsive Breakpoints:**
- Desktop (lg): Side-by-side three-column layout
- Tablet (md): Stack vertically - Deck A, Mixer, Deck B
- Mobile: Full stack with simplified controls

### C. Component Library

#### 1. Deck Components (A & B)

**Deck Container:**
- Rounded borders (rounded-xl)
- Subtle border treatment with neon glow effect
- Padding: p-6
- Background: Semi-transparent dark overlay

**File Input Section:**
- Custom-styled file input button with deck-specific accent
- Height: h-12
- Full width with icon (upload icon from Heroicons)
- Rounded: rounded-lg

**Waveform Canvas:**
- Height: h-32 on desktop, h-24 on mobile
- Width: Full container width
- Rounded: rounded-lg
- Border with subtle glow matching deck color
- Margin: my-4

**BPM Input:**
- Width: w-32
- Height: h-14
- Font size: text-2xl
- Text alignment: Center
- Rounded: rounded-lg
- Border with accent glow on focus

**Play/Pause Button:**
- Size: w-16 h-16 (large, tactile)
- Circular: rounded-full
- Icon-only (play/pause from Heroicons)
- Positioned prominently below waveform

**Deck Header:**
- Display "DECK A" or "DECK B" in uppercase
- Border-bottom with accent color
- Padding: pb-2, mb-4

#### 2. Mixer Section (Center)

**Mixer Container:**
- Fixed width: w-80
- Background: Darker than decks for visual separation
- Padding: p-6
- Rounded: rounded-xl
- Border with dual-tone glow (cyan + magenta blend)

**Master BPM Control:**
- Large numeric display: text-4xl, font-weight 700
- Label above: "MASTER BPM"
- Slider below: Full width, custom-styled track
- Height: h-2 for slider track
- Range display: Small text showing min-max (80-180 BPM typical)

**Crossfader:**
- Width: Full container
- Height: h-3 for track
- Custom gradient track (cyan to magenta)
- Large thumb/handle: w-6 h-12
- Labels: "A" (left) and "B" (right) in uppercase
- Margin: my-8

**SYNC Button:**
- Width: Full container width
- Height: h-14
- Text: "SYNC TRACKS" in uppercase
- Font size: text-lg
- Rounded: rounded-lg
- Prominent placement above crossfader
- Icon: sync/refresh icon from Heroicons

#### 3. Global Controls

**Audio Context Start Overlay:**
- Full viewport overlay on initial load
- Centered content with blur backdrop
- Large "START AUDIO ENGINE" button
- Size: w-64 h-16
- Font size: text-xl
- Pulsing animation on button (subtle)

**Header Bar:**
- Full width, fixed top
- Height: h-16
- App title: "WarpDrive" left-aligned
- Version/status indicator: right-aligned
- Border-bottom with gradient

#### 4. Visual Treatments

**Neon Glow System:**
- Deck A elements: Cyan glow (box-shadow with cyan values)
- Deck B elements: Magenta glow (box-shadow with magenta values)
- Mixer: Blended cyan-magenta glow
- Active states: Intensified glow
- Focus states: Double-intensity glow with offset

**Borders:**
- Default: 1px solid with 50% opacity
- Active/Playing: 2px solid with 100% opacity + glow
- Hover: 1px solid with 75% opacity + subtle glow

**Grid Pattern Background:**
- Subtle cyberpunk grid pattern on main background
- Low opacity (5-10%) to avoid distraction
- Optional scanline effect overlay at 2-3% opacity

### D. Interaction States

**Buttons:**
- Default: Base color with subtle glow
- Hover: Increased glow intensity, slight scale (transform: scale(1.02))
- Active/Playing: Full intensity glow, pulsing animation
- Disabled: 40% opacity, no glow

**Sliders:**
- Default: Standard track appearance
- Hover: Brightened track
- Dragging: Enhanced glow on thumb, temporary trail effect

**Input Fields:**
- Default: Border with minimal glow
- Focus: Intensified border glow, no outline ring
- Invalid: Red glow warning state

## Spacing & Rhythm

**Vertical Rhythm:**
- Section spacing: space-y-6 within decks
- Control group spacing: space-y-4
- Label-to-control gap: gap-2
- Major sections: mt-8 separation

**Horizontal Rhythm:**
- Deck padding: px-6
- Mixer padding: px-6
- Inter-column gap: gap-8 on desktop
- Button groups: gap-4

## Icons

**Icon Library:** Heroicons (CDN)

**Required Icons:**
- Play: play-solid
- Pause: pause-solid
- Upload: arrow-up-tray
- Sync: arrow-path
- Volume: speaker-wave

**Icon Sizing:**
- Large buttons: w-8 h-8
- Small controls: w-5 h-5
- Status indicators: w-4 h-4

## Accessibility

- All interactive elements minimum 44px touch target
- Focus indicators use deck-specific glow colors
- ARIA labels for all audio controls
- Keyboard shortcuts for play/pause (Space), sync (S), deck switching (Tab)
- High contrast between text and backgrounds
- Monospaced numerics for BPM values ensure readability

## No Images Required

This is a functional audio application - no hero images or decorative photography needed. Visual interest comes from the cyberpunk UI treatment, neon glows, waveform visualizations, and geometric patterns.