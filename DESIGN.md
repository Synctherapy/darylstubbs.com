# Design System

This document captures the visual tokens, component behaviors, and layout guidelines for the website.

## Color Palette
The colors are mapped to OKLCH values to ensure accurate contrast checking and consistent hues.

| Color | CSS Variable | Hex | OKLCH Value | Purpose |
| --- | --- | --- | --- | --- |
| **Background** | `--color-background` | `#faf6f1` | `oklch(0.97 0.007 72)` | Warm off-white page background |
| **Paper** | `--color-paper` | `#ffffff` | `oklch(1.00 0.000 0)` | Primary surface element |
| **Paper Deep** | `--color-paper-deep` | `#f3ece2` | `oklch(0.94 0.013 75)` | Tinted section/container background |
| **Paper Tint** | `--color-paper-tint` | `#efe6da` | `oklch(0.92 0.018 78)` | Darker neutral surface accents |
| **Ink** | `--color-ink` | `#16110d` | `oklch(0.14 0.007 65)` | Primary copy and headers |
| **Ink Muted** | `--color-ink-muted` | `#6b5d52` | `oklch(0.45 0.020 65)` | Body description copy (AA Contrast verified) |
| **Ink Soft** | `--color-ink-soft` | `#9c8d80` | `oklch(0.63 0.015 65)` | Secondary borders and inline indicators |
| **Accent** | `--color-accent` | `#ff6442` | `oklch(0.64 0.220 35)` | Primary active/action state (orange) |
| **Accent Deep** | `--color-accent-deep` | `#d94a26` | `oklch(0.56 0.200 35)` | Accent text & hover targets (contrast optimized) |
| **Trust** | `--color-trust` | `#1f5963` | `oklch(0.43 0.070 205)` | Clinical/trust active state (teal) |
| **Trust Deep** | `--color-trust-deep` | `#0e3e47` | `oklch(0.28 0.050 205)` | High-contrast trust headers and links |

## Typography
We use **Hanken Grotesk** as the display and body typeface to project clean, geometric clinical authority.

- **Scale Ratio**: $\ge 1.25$
- **Body copy line length**: Capped at `65–75ch`.
- **Headings**:
  - `editorial-display`: Heavy sans-serif, `font-weight: 900`, `letter-spacing: -0.035em`, `line-height: 0.95`.
  - `editorial-head`: Bold sans-serif, `font-weight: 800`, `letter-spacing: -0.02em`, `line-height: 1.1`.
- **Text wrap**:
  - Heading tags (`h1`, `h2`, `h3`) must use `text-wrap: balance`.
  - Body paragraphs must use `text-wrap: pretty`.

## Layout & Spacing
- **Grids**: Use flexible columns rather than identical card grids. Prefer asymmetrical grid templates for sections to break standard design structures.
- **Rules**: Thin 1px lines (`.editorial-rule`) acts as structural vertebrae to separate content modules.
- **Border Radius**: Cards top out at `12px–16px` (`--radius-card: 0.75rem`). Full pill (`9999px`) is reserved for buttons and tags.

## Interactions & Motion
- **Press Feedback**: Pressable items (buttons, chips, link cards) must scale down to `scale(0.97)` on `:active` to give instant tactile responsiveness.
- **Custom Easing**:
  - `cubic-bezier(0.23, 1, 0.32, 1)` (strong ease-out) for dropdowns and popovers.
  - `cubic-bezier(0.77, 0, 0.175, 1)` (strong ease-in-out) for larger entry or slide animations.
- **Duration**: Button presses and small popovers must settle within `160ms` for snappiness.
- **Reduced Motion**: All animations must disable translation and position shifts if `@media (prefers-reduced-motion: reduce)` is active.
