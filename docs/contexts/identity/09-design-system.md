---
id: IDN-DS-001
title: Enterprise Design System — Identity Domain
version: 1.0
status: IN_REVIEW
date: 2026-08-07
stage: 5
gate: G5
context_scope: [identity]
authors: [Enterprise Design System Council]
derives_from:
  [PRG-VIS-001, IDN-SCR-001, IDN-UIC-001, EPOS-CORE-DOC-001, EPOS-CORE-GLOSS-001]
satisfied_by: [IDN-UIC-001, Implementation Code]
adrs: [ADR-0001, ADR-0002, ADR-0003]
north_star_impact: "Defines the visual language, component tokens, accessibility standards, and responsive strategy that ensure every screen is accessible, consistent, and optimized for player protection."
---

# IDN-DS-001 — Enterprise Design System, Identity Domain

> **Scope guard.** This artefact defines tokens, strategies, and standards; it
> contains no React code, CSS, Tailwind classes, HTML, or visual mockups. Visual
> design (Figma, Penpot, imagery) is a downstream artefact. Component
> implementations are IDN-UIC-001 concerns.

---

## PART 1 — Executive Summary

**Purpose.** The Design System is the single authoritative source for the visual
language, component tokens, and responsive strategies used across all 50 screens
in IDN-SCR-001. It exists to ensure consistency without copying, accessibility
without compromise, and child protection without special cases.

**Scope.** Visual identity (colors, typography, spacing, radius, shadow, motion);
responsive breakpoints and mobile-first strategy; dark and light mode; component
token standards; accessibility compliance (WCAG 2.1 AA); motion and animation
principles; state indicators (loading, error, empty, success, offline); and
audit trail of all changes to the design language.

**Out of scope.** Actual colors in RGB/hex (token values), Figma JSON, imagery
libraries, font files, custom icon sets, micro-interaction video, or animation
code.

**Bounded context.** Identity. All screens in IDN-SCR-001 use this system; no
deviations are permitted without a Governance Council decision.

**Position in the artefact chain.**

```text
PRG-VIS-001 (why we exist)    ─┐
IDN-PRD-001 (what we build)   ─┤
IDN-DMN-001 (domain model)    ─┤
IDN-SCR-001 (screens)         ─┼─► IDN-DS-001 (visual language)
IDN-JRN-001 (journeys)        ─┤        │
IDN-API-001 (API contract)    ─┤        └─► Implementation (Tailwind, shadcn)
EPOS-CORE-DOC-001 (standards) ─┘
```

---

## PART 2 — Design Philosophy

### Core Principles

1. **Minimal.** Remove decoration; every pixel serves the user's goal.
2. **Professional.** Trust-building; this is infrastructure, not entertainment.
3. **Modern.** Contemporary conventions (no skeuomorphism; no outdated patterns).
4. **Clean.** Generous whitespace; clear hierarchy; no cognitive overload.
5. **High Information Density.** Show the facts without clutter; every element has a purpose.
6. **Child Safe.** No dark patterns, dark overlays, surprise modals, or addictive micro-animations.
7. **Accessible.** WCAG 2.1 AA as the minimum; exceeds where beneficial.
8. **Mobile First.** Designs for the smallest screen; scales up, never down.

### Design Constraints

- **No decoration.** No gradients, no blurs, no drop shadows for aesthetics.
- **No dark patterns.** No hidden opt-outs, no confirm-after-confirm, no aggressive CTAs.
- **No gamification.** No badges, no progress bars, no streak counters—this is not a game.
- **No addictive motion.** Animation is functional (feedback, state change); never reward-driven.
- **No gendered imagery.** No photos of children; no sports stereotypes.
- **No assumptions.** Player may be any gender, ability, device, language, or connection.

---

## PART 3 — Visual Identity

### 3.1 Color Palette

**Primary Color: Navy Blue**
- Foundation of trust and institutional authority
- Used for primary navigation, primary CTA, and identity elements
- Dark enough for WCAG AAA contrast on white; light enough for text
- Never used as a background for body text (readability harm)

**Secondary Color: Football Green**
- Represents activity, verification, and forward motion
- Used for success states, active states, affirmative actions
- Never used for destructive actions

**Accent Color: Red**
- Used for high-risk, destructive, and attention-critical actions
- Revoke consent, delete, reject, escalate
- Very limited use; high cognitive weight

**Semantic Colors**
- **Success:** Green (activity recorded, verification complete, consent granted)
- **Warning:** Amber (expiring verification, new evidence needed, pending review)
- **Danger:** Red (revocation, rejection, access denied, high-risk condition)
- **Neutral:** Gray scale (disabled, read-only, inactive, historical)
- **Information:** Blue (neutral alert, clarification, policy statement)

**Gray Scale**
- **Background:** Lightest gray (page background, card surfaces)
- **Surface:** Light gray (panels, containers, subtle separation)
- **Border:** Medium gray (dividers, subtle edges, table rules)
- **Text Secondary:** Darker gray (metadata, labels, captions)
- **Text Primary:** Darkest gray / black (body text, headings, primary information)
- **Disabled:** Light gray with reduced opacity (non-interactive elements)

**Dark Mode**
- Invert: White background ↔ Darkest gray background
- Text inverts accordingly (darkest gray text ↔ white text)
- Primary and semantic colors remain the same in hue; adjusted for contrast
- Borders and dividers use light gray on dark backgrounds
- No pure black or pure white in dark mode (eye strain risk)

**Color Contrast Rules**
- All text must meet WCAG AA minimum (4.5:1 for normal text, 3:1 for large text)
- Dark mode must meet the same standard
- Test with WebAIM or Contrast Ratio tool before use
- Color must never be the only way to convey information (Rule 1 of WCAG Color)

---

### 3.2 Typography

**Heading Font: Oswald**
- High authority; used for page titles, section headings, identity display
- Weights: Regular (400), Bold (700)
- Never used for body text (readability harm)
- Size scale: H1 (2.5rem), H2 (2rem), H3 (1.5rem), H4 (1.25rem), H5 (1.125rem), H6 (1rem)

**Body Font: Inter**
- High legibility; used for all body text, descriptions, and form labels
- Weights: Regular (400), Medium (500), SemiBold (600), Bold (700)
- Designed for screen reading; exceptional at small sizes
- Size scale: Large (1.125rem), Regular (1rem), Small (0.875rem), Tiny (0.75rem)
- Line height: 1.5 for body (30% leading), 1.2 for headings (20% leading)
- Letter spacing: None (default); +0.02em for uppercase labels (case legibility)

**Monospace Font: Roboto Mono**
- Used for: Football ID display code, tokens, technical identifiers, audit trails
- Weights: Regular (400), Bold (700)
- Never used for prose
- Size: Same as body text, matched to context
- Always rendered with generous surrounding whitespace (visual segregation)

**Accessible Typography**
- Minimum font size: 14px (0.875rem) for body text
- Maximum line length: 75 characters (optimal for reading)
- Line height: 1.5 minimum (150% of font size)
- Heading contrast: All headings meet 4.5:1 minimum
- Font smoothing: System default (no -webkit-font-smoothing: antialiased on light text)

---

### 3.3 Spacing

**8-Point Grid**
- All spacing uses 8px increments: 0, 8, 16, 24, 32, 40, 48, 56, 64, 72, 80+
- Padding: 8px, 16px, 24px (most common)
- Margin: 16px, 24px, 32px (most common)
- Gap (flex/grid): 8px, 16px, 24px, 32px
- Never use 7px, 9px, 15px, 17px spacing (breaks the grid)

**Touch Targets**
- Minimum size: 44x44px (iOS) / 48x48px (Android) — enforced for all interactive elements
- Spacing between targets: Minimum 8px
- Buttons, links, checkboxes, radio buttons, form inputs: all 44+ px minimum height
- Smaller interactive elements (icon buttons, small toggles) may be 40px only if surrounded by 8px padding

**Whitespace Principles**
- Generous whitespace around identity elements (Football ID, player name, critical data)
- Whitespace between sections: 24–32px
- Whitespace within sections: 16–24px
- Card padding: 24px (or 16px on mobile)
- Form field spacing: 16px vertical between fields

---

### 3.4 Border Radius

**Consistent Radius: Medium (8px)**
- All rounded elements use 8px: buttons, cards, inputs, badges, dialogs
- Corner radius is not size-dependent (e.g., buttons use 8px whether 40px or 400px tall)
- Modern, clean look without playfulness
- Never use 0px (hard edges are uninviting) or 16px+ (looks bubble-like)

**Radius Application**
- Buttons: 8px
- Cards: 8px
- Input fields: 8px
- Badges: 8px
- Dialogs: 8px
- Images (if used): 8px
- Exception: Avatars and profile images may use 50% (circle) for identity

---

### 3.5 Shadows & Elevation

**Philosophy: Soft Shadows Only**
- Shadows are functional (indicate elevation and clickability), not decorative
- No drop shadows for aesthetic effect
- Used sparingly (buttons, cards, modals) to indicate interaction potential

**Shadow Levels**
- **Level 1 (Cards, subtle):** `0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)`
- **Level 2 (Lifted cards, hover):** `0 3px 6px rgba(0,0,0,0.15), 0 2px 4px rgba(0,0,0,0.12)`
- **Level 3 (Modals, dropdowns):** `0 10px 25px rgba(0,0,0,0.15), 0 6px 12px rgba(0,0,0,0.1)`
- **Focus shadow (accessibility):** 2px 2px 0 var(--primary-color) (visible keyboard focus indicator)

**Shadow Avoidance**
- No shadows on text (unreadable)
- No shadows on form inputs (confuses data entry)
- No shadows on backgrounds (noise)
- No colored shadows (use neutral gray only)

---

### 3.6 Animation & Motion

**Core Principle: Subtle, Purposeful Motion Only**
- Animation duration: 150ms–300ms (quick feedback; no waiting)
- Easing: `ease-out` for entrances, `ease-in-out` for interactions
- No animation longer than 600ms (impatience sets in)

**Approved Animation Uses**
- **Feedback:** Button press (50ms), checkbox toggle, form field focus
- **State change:** Success checkmark (150ms), loading spinner (1s loop)
- **Entrance:** Modal or drawer slide (200ms), fade (150ms)
- **Hover:** Button background shift (100ms), icon scale (100ms)

**Prohibited Animation**
- No parallax scrolling
- No auto-playing video or sound
- No background animations that distract from content
- No bouncing, wiggling, or "fun" motion (inappropriate for child data)
- No animations on page load (slow perception of performance)
- No animations that repeat indefinitely (loop spinners only during load)

**Accessibility Motion**
- Respect `prefers-reduced-motion` media query
- Provide CSS to disable animations when motion sensitivity is detected
- Always offer a static alternative (no content hidden behind animation)

---

## PART 4 — Responsive Strategy

### 4.1 Mobile First

**Design starts at 375px (small phone).** Then scales up. Never compress for mobile.

**Breakpoints**
- **Mobile:** 375px–767px (small phone to tablet-vertical)
- **Tablet:** 768px–1023px (tablet-horizontal start)
- **Desktop:** 1024px+ (laptop, desktop)
- **Extra Large:** 1440px+ (large monitors, optional refinements)

**Mobile Strategy**
- Single column layout
- Full-width buttons (44px minimum height, 100% width minus padding)
- Stack cards vertically
- Collapse navigation into hamburger or bottom sheet
- Sticky header and footer for primary actions
- Swipe gestures optional; never required
- Touch targets: 48px minimum

**Tablet Strategy**
- Two-column grid where beneficial (list + detail)
- Sidebar navigation revealed (if <400px wide, remain hidden)
- Wider cards and forms
- Touch targets: 44px minimum
- Spacing increased slightly (more room)

**Desktop Strategy**
- Three-column layout possible (navigation + list + detail)
- Sidebar always visible
- Full use of horizontal space without overwhelming
- Mouse-friendly (smaller touch targets, hover effects)
- Form fields: 400–600px wide (comfortable entry)

### 4.2 Responsive Components

**Forms**
- **Mobile:** Full width, single column
- **Tablet:** Two-column grid if field count allows
- **Desktop:** Two-column grid for related fields (e.g., first name + last name)
- Input field width: 100% on mobile; max-width 400px on desktop

**Tables**
- **Mobile:** Card layout (vertical stacking); each row becomes a card
- **Tablet:** Horizontal table; allow horizontal scroll if needed
- **Desktop:** Full table with fixed header

**Navigation**
- **Mobile:** Bottom navigation bar or hamburger menu (avoid top hamburger if bottom tab bar exists)
- **Tablet:** Collapsible sidebar or top navigation
- **Desktop:** Persistent sidebar or top navigation

**Modals & Dialogs**
- **Mobile:** Full screen; appear from bottom (sheet) or center (modal)
- **Tablet:** Centered on screen, max-width 600px
- **Desktop:** Centered on screen, max-width 600px

---

## PART 5 — Component Token Standards

### 5.1 Button Tokens

```
Button (Primary):
  - Background: --primary-color (Navy Blue)
  - Text: White
  - Padding: 12px 24px (44px min-height)
  - Border Radius: 8px
  - Font: Inter, 1rem, SemiBold (600)
  - Min Width: 44px (touch target)
  - Hover: Darker primary (opacity 90%)
  - Focus: 2px solid primary outline, offset 2px
  - Disabled: Gray background, gray text, no hover
  - State on mobile: No hover effect (show on press only)

Button (Secondary):
  - Background: Transparent
  - Border: 2px solid --primary-color
  - Text: --primary-color
  - Padding: 10px 24px (44px min-height with border)
  - All other properties same as Primary

Button (Destructive):
  - Background: --danger-color (Red)
  - Text: White
  - All other properties same as Primary
  - Label must include "Delete", "Revoke", "Reject" (no ambiguity)

Button (Success):
  - Background: --success-color (Green)
  - Text: White
  - All other properties same as Primary

Button (Small):
  - Padding: 8px 16px (32px min-height)
  - Font: 0.875rem
  - Use sparingly (e.g., secondary actions, within tables)

Button (Icon):
  - Size: 40px × 40px (minimum for touch)
  - Background: Transparent on default; light background on hover
  - Icon: Lucide (24px)
  - Focus: 2px outline offset 2px
```

### 5.2 Input Field Tokens

```
Text Input:
  - Background: White (light mode) / Dark gray (dark mode)
  - Border: 1px solid medium gray
  - Border Radius: 8px
  - Padding: 12px 16px (44px min-height)
  - Font: Inter, 1rem, Regular (400)
  - Focus: 2px solid --primary-color outline
  - Error: Border color change to Red, error message below field
  - Disabled: Gray background, gray text, no focus allowed
  - Placeholder: Light gray text, no placeholder in labels (use label element)

Label:
  - Font: Inter, 1rem, SemiBold (600)
  - Margin Bottom: 8px
  - Required indicator: Red asterisk (*) after label text
  - Never hide label (always visible even with placeholder)

Error Message:
  - Font: Inter, 0.875rem, Regular (400)
  - Color: --danger-color (Red)
  - Icon: Lucide alert-circle (16px)
  - Margin Top: 4px
  - Association: aria-describedby references error element
```

### 5.3 Card Tokens

```
Card:
  - Background: White (light) / Darker gray (dark)
  - Border: None (rely on shadow and whitespace)
  - Border Radius: 8px
  - Padding: 24px
  - Shadow: Level 1
  - Margin/Gap: 16–24px
  - On mobile: 16px padding
  - Hover: Shadow increases to Level 2 (indicate clickability)

Card Header:
  - Font: Inter, 1.25rem, SemiBold (600)
  - Margin Bottom: 16px
  - Color: Text Primary

Card Body:
  - Font: Inter, 1rem, Regular (400)
  - Line Height: 1.5
  - Color: Text Primary

Card Footer:
  - Font: Inter, 0.875rem, Regular (400)
  - Margin Top: 16px
  - Color: Text Secondary
```

### 5.4 Badge Tokens

```
Badge (Base):
  - Padding: 4px 8px
  - Border Radius: 8px
  - Font: Inter, 0.75rem, SemiBold (600)
  - Min Height: 24px
  - Min Width: 24px

Badge (Status):
  - Background: Semantic color (green for active, amber for warning, red for error)
  - Text: White
  - Icon: Lucide (12px), leading

Badge (Neutral):
  - Background: Light gray
  - Text: Dark gray
  - Use for: Tags, categories, non-semantic labels

Badge (Outline):
  - Background: Transparent
  - Border: 1px solid semantic color
  - Text: Semantic color
  - Use for: Secondary labels, filters
```

### 5.5 Chip Tokens (Consent, Verification, Membership)

```
Chip:
  - Base: Badge styling + 16px horizontal padding + optional left icon
  - Height: 32px
  - Border Radius: 8px
  - Font: Inter, 0.875rem, SemiBold (600)
  - Removable: X icon on right (clickable, 24px button)
  - Interactive: Background changes on hover; cursor pointer
  - Icon: Lucide (16px), 8px margin-right
```

---

## PART 6 — State Indicators

### 6.1 Loading State

```
Spinner:
  - Animated circular progress indicator (no percentage shown)
  - Color: --primary-color
  - Size: 24px (small sections), 40px (full page), 64px (large areas)
  - Duration: 1s per rotation
  - Easing: Linear
  - Accessible name: "Loading content..."
  - Never block the entire page (show skeleton or dim)

Skeleton:
  - Placeholder shape matching the real component
  - Color: Light gray, pulsing opacity (fade in/out, 1s–2s cycle)
  - Never use: Blinking or striped animation (too distracting)
  - Use: Form fields, cards, tables, avatars
  - Remove as soon as real content loads (no fade transition)
```

### 6.2 Empty State

```
Empty State:
  - Large icon (Lucide, 64px, gray)
  - Heading: "No results" or "Nothing yet" (not a question)
  - Description: One sentence explaining why (e.g., "Activities will appear here after your first match")
  - Action: Primary button if one exists (e.g., "Start your first activity")
  - Color: Text Secondary for description
  - Padding: Generous whitespace (align with card padding)
```

### 6.3 Error State

```
Error Message:
  - Icon: Lucide alert-circle (24px, red)
  - Heading: "Something went wrong" or specific error (e.g., "Verification failed")
  - Description: One sentence describing what happened and what to do next
  - Action: Primary button (e.g., "Try again") or secondary (e.g., "Contact support")
  - Color: Text Primary for heading, Text Secondary for description
  - Bottom margin: 24px
  - Never include: Technical error codes, stack traces, or internal details
```

### 6.4 Success State

```
Success Message:
  - Icon: Lucide check-circle (24px, green)
  - Heading: "Success" or specific outcome (e.g., "Consent recorded")
  - Description: One sentence confirming what happened
  - Duration: Display for 3–5 seconds, then fade out (or allow manual dismiss)
  - Notification type: Toast (bottom-right) or banner (top-center or top-alert area)
  - Color: Green background (light mode), darker green (dark mode); white text
  - Never require action to dismiss (auto-dismiss is better for positive feedback)
```

### 6.5 Offline State

```
Offline Banner:
  - Position: Top of page, sticky
  - Icon: Lucide wifi-off (16px)
  - Text: "You are offline. Some features may be limited."
  - Background: Amber (warning state)
  - Text Color: Dark gray (for contrast)
  - Height: 40px
  - No action needed (user will see when connectivity returns)
  - Remove when connectivity restored
```

### 6.6 Session Expired State

```
Session Expired Modal:
  - Overlay: Transparent, dark (blocks interaction)
  - Center card with:
    - Icon: Lucide clock (32px, amber)
    - Heading: "Session expired"
    - Description: "Your login session has expired. Please log in again."
    - Primary button: "Log in again"
    - Secondary button: "Close" (returns to login screen)
  - No way to dismiss by clicking outside (modal, not dismissible)
```

---

## PART 7 — Accessibility Compliance

### 7.1 WCAG 2.1 AA Standards

**Color Contrast**
- Normal text (18px): 4.5:1 minimum (AAA: 7:1)
- Large text (18pt+): 3:1 minimum (AAA: 4.5:1)
- UI components and borders: 3:1 minimum
- Test tools: WebAIM Contrast Checker, WAVE

**Keyboard Navigation**
- Tab order: Logical, left-to-right, top-to-bottom
- Focus visible: Always (2px outline, 2px offset, high contrast)
- Tab trap: Never (focus always escapable)
- Keyboard-only functionality: All controls reachable without mouse

**Screen Reader Support**
- Semantic HTML: Use `<button>`, `<a>`, `<label>`, `<form>` elements
- Aria attributes: aria-label, aria-describedby, aria-live, aria-hidden as needed
- Headings: Proper hierarchy (H1 → H2 → H3, no skipping)
- Form associations: `<label for>` links to input id
- List markup: Use `<ul>`, `<ol>`, `<li>` for lists
- Tables: `<thead>`, `<th>`, `<tbody>`, scope attribute

**High Contrast Mode**
- Borders and outlines: Always visible (don't rely on background color alone)
- Text: Always meets 4.5:1 contrast
- Tested with: Windows High Contrast setting, browser extensions

**Focus Indicators**
- Visible on keyboard navigation (Tab key)
- Never hidden with `outline: none`
- Minimum 2px, high contrast (primary color or white/dark gray)
- Offset 2px from element to avoid overlap

**Large Touch Targets**
- Minimum 44×44px for all interactive elements
- 8px minimum spacing between targets
- Buttons, links, checkboxes, radio buttons: all 44px+

**Accessible Icons**
- Never use icon alone for meaning (must have text or aria-label)
- If icon-only, use aria-label or aria-hidden + hidden text
- Colored icons: Ensure text description makes meaning clear

**Motion Accessibility**
- Respect prefers-reduced-motion CSS media query
- Provide toggle for animations
- No autoplay animations
- No flashing (>3 times/second) anywhere

### 7.2 Child Protection Accessibility

**Age-Appropriate Language**
- Headings and body text: Plain language (no jargon)
- Reading level: 8th grade (12-year-old) or lower
- Sentence length: 15–20 words average
- Visual hierarchy: Large headings, short paragraphs

**Cognitive Load**
- Forms: One question per page (wizard) or logical grouping
- Choices: Maximum 5 options visible (scroll or paginate)
- Data density: One primary fact per card; details in expandable section

**Protective Defaults**
- Checkboxes: Unchecked by default (no surprise opt-ins)
- Buttons: Affirmative action is primary (blue); destructive is secondary (red)
- Modals: Require explicit confirmation; no accidental clicks
- Consent language: Clear, plain, specific (no legal jargon visible on the form)

---

## PART 8 — Dark Mode Strategy

### 8.1 Implementation

**Dark Mode Activation**
- User preference: `prefers-color-scheme: dark` media query
- Manual toggle: Optional; if present, store in localStorage
- System default: Honor OS setting unless user overrides

**Color Mapping**
- Background: #ffffff → #1a1a1a (or #121212)
- Text primary: #1a1a1a → #ffffff
- Text secondary: #4a4a4a → #b0b0b0
- Borders: #d0d0d0 → #333333
- Primary, secondary, semantic colors: Same hue; adjusted for contrast

**Component Adjustments**
- Shadows: Same opacity; rendered on light surface
- Card backgrounds: Slightly lighter than page background (visual separation)
- Input fields: Darker gray background, lighter borders
- Icons: Adjust fill color for contrast

### 8.2 Dark Mode Compliance

**Contrast in Dark Mode**
- Must meet same 4.5:1 standard as light mode
- Test all color combinations in both modes
- Use WebAIM contrast checker with dark mode colors

**Readability**
- No pure white text on pure black (use off-white on off-black)
- Line height: Same as light mode (1.5)
- No reduced opacity for secondary text in dark mode

---

## PART 9 — Design Language Audit Trail

### Change Log

| Version | Date | Author | Change |
| --- | --- | --- | --- |
| 1.0 | 2026-08-07 | Enterprise Design Council | Initial release; derives from IDN-SCR-001 and EPOS design standards |

### Governance

**Authority:** Enterprise Design System Council (within Identity Governance Council)

**Approval Process:**
1. Proposed change submitted with business justification and accessibility impact
2. Design Council reviews and approves or rejects
3. If approved, implementation team updates Tailwind tokens and component library
4. Version bump: Major (breaking) or Minor (additive)
5. Rolled out to all screens in next release cycle

**Breaking Changes Forbidden** on deployed systems (no sudden visual changes to users). Breaking changes require advance notice and gradual rollout.

**Accessibility Regression Forbidden.** Any change that reduces WCAG compliance or worsens touch target sizes is rejected.

---

## PART 10 — Integration with Tailwind CSS

**Tailwind Configuration**
- Extend the default Tailwind config with custom colors, spacing, and typography
- Map design tokens to Tailwind utility classes (e.g., `bg-primary`, `text-secondary`, `rounded-medium`)
- Use CSS custom properties (variables) for semantic colors to support dark mode switching
- All design decisions in IDN-DS-001 translate directly to `tailwind.config.js`

**No Custom CSS Required**
- All styling uses Tailwind utilities
- No additional CSS files; all customization via Tailwind config
- Component implementations (IDN-UIC-001) use shadcn/ui + Tailwind utility combinations

---

## PART 11 — Integration with shadcn/ui

**Component Base**
- shadcn/ui provides accessible, unstyled React components
- IDN-DS-001 tokens are applied via Tailwind class customization in each component

**Design System Constraints**
- No component receives custom CSS that violates IDN-DS-001 standards
- All component variants (sizes, states, colors) derive from design tokens
- New component types require Design Council approval before implementation

---

## PART 12 — Traceability & Success Criteria

**Traceability**
- Every token in IDN-DS-001 traces back to IDN-SCR-001 or EPOS standards
- Every change is recorded in the audit trail (PART 9)
- Implementation (Tailwind config) includes comments linking to IDN-DS-001 sections

**Success Criteria**
- ✓ All 50 screens from IDN-SCR-001 implement IDN-DS-001 consistently
- ✓ WCAG 2.1 AA compliance verified on all screens
- ✓ Dark mode renders without contrast violations
- ✓ Responsive design tested on 375px, 768px, 1024px, 1440px breakpoints
- ✓ No deviation from approved tokens without Governance Council decision
- ✓ Design system is version-controlled; changes are audited

---

**Design System ready for implementation. All components derive from these tokens.**
