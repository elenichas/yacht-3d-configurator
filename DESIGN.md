# Design System

## Direction

A bright architectural model room translated into a precise product interface. The yacht remains the dominant visual object; controls are calm, familiar, and progressively disclosed. The identity is original and must not reference or imitate any architecture studio.

## Color

Use flat OKLCH colors. The product follows a restrained strategy: accent colors indicate action, selection, focus, or information rather than decoration.

- Background: `oklch(1 0 0)`
- Surface: `oklch(0.96 0.006 48)`
- Ink: `oklch(0.19 0.012 48)`
- Primary: `oklch(0.607 0.163 47.7)`
- Primary dark: `oklch(0.50 0.15 47.7)`
- Accent: `oklch(0.42 0.105 195)`
- Muted: `oklch(0.47 0.014 48)`
- Hairline: `oklch(0.88 0.006 48)`
- Error: `oklch(0.56 0.18 25)`

White text is used on saturated primary and accent fills.

## Typography

Use Geist Sans throughout the interface and Geist Mono for measurements and technical values. Product type uses a fixed rem scale, tabular numerals, and no decorative display face.

## Layout

Desktop uses a dominant 3D canvas with a 22–25rem right inspector. A compact top bar establishes product context; a bottom rail contains camera actions and status. On narrow screens, the canvas remains first and the inspector becomes a normal document-flow panel below it.

## Components

- Controls use 10–14px radii; full pills are reserved for compact statuses.
- Group related settings with spacing and dividers rather than nested cards.
- Every control includes hover, focus-visible, active, and disabled states.
- Touch targets are at least 44px.
- Range values use Geist Mono and remain visible while adjusting.

## Motion

Use 150–250ms state transitions with ease-out-quart or ease-out-quint. Model changes may interpolate subtly, but controls respond immediately. Reduced-motion mode removes camera travel and shortens transitions to near-instant changes.
