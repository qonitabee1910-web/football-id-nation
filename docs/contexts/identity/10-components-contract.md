---
id: IDN-UIC-001
title: Enterprise UI Components Contract — Identity Domain
version: 1.0
status: IN_REVIEW
date: 2026-08-07
stage: 5
gate: G5
context_scope: [identity]
authors: [Enterprise UI Architecture Council]
derives_from:
  [IDN-SCR-001, IDN-DS-001, IDN-API-001, IDN-DMN-001, EPOS-CORE-DOC-001]
satisfied_by: [Implementation Code, IDN-TEST-001]
adrs: [ADR-0001, ADR-0002, ADR-0003]
north_star_impact: "Defines every reusable component that appears across the 50 screens, their props, states, and accessibility contracts; enables rapid screen assembly without redefining behaviour."
---

# IDN-UIC-001 — Enterprise UI Components Contract, Identity Domain

> **Scope guard.** This artefact defines component contracts: props, states, 
> behaviours, and accessibility obligations. It contains no React code, JSX, 
> TypeScript, CSS, or Tailwind classes. Implementation is downstream 
> (shadcn/ui + Tailwind customization).

---

## PART 1 — Executive Summary

**Purpose.** The UI Components Contract is the single authoritative specification
for every reusable component that appears on the 50 screens defined in
IDN-SCR-001. Components exist to eliminate duplication and ensure consistency;
every component is built once, tested once, and used everywhere.

**Scope.** 17 component families: Cards, Badges, Buttons, Forms, Timelines,
Tables, Wizards, Dialogs, Notifications, Filters, Search, Metrics, Status
Indicators, and specialized domain components (QR Card, Consent Control,
Membership Badge, Verification Badge, Consent Badge, Transfer Badge, Activity
Timeline, Audit Timeline). Each component includes props, states, accessibility
rules, and traceability.

**Out of scope.** React implementation, TypeScript interfaces, Tailwind classes,
CSS, visual design (mockups), animation code, or storybook stories (those are
implementation concerns).

**Bounded context.** Identity. All 50 screens use only these components; no
custom, one-off components are permitted without Governance Council approval.

**Position in the artefact chain.**

```text
IDN-SCR-001 (what screens need)  ─┐
IDN-DS-001 (visual language)     ─┼─► IDN-UIC-001 (components)
IDN-API-001 (data contracts)     ─┤        │
IDN-DMN-001 (domain concepts)    ─┘        └─► Implementation (React + TypeScript)
```

---

## PART 2 — Component Design Principles

### Core Principles

1. **Reusable.** One component, many uses; parameterized via props.
2. **Accessible.** Every component meets WCAG 2.1 AA without user configuration.
3. **Stateless.** Components receive data via props; parent manages state.
4. **Composable.** Components nest; no component assumes it is the top level.
5. **Testable.** Each component has clear success criteria (acceptance tests).
6. **Domain-Aware.** Component names and props use ubiquitous language (IDN-GLOSS-001).
7. **Child-Safe.** No dark patterns, no cognitive traps, no assumptions about identity.

### Component Constraints

- **No undocumented props.** All props appear in this contract.
- **No visual regression.** Component appearance never changes without version bump.
- **No business logic in components.** Validation, authorization, and state machines live in containers or services.
- **No API calls in components.** Data is passed via props; components render, never fetch.
- **No accessibility surprises.** Focus, keyboard navigation, and screen reader behavior is documented.

---

## PART 3 — Foundation Components

### 3.1 Button Component

**Purpose.** Trigger an action (submit, navigate, delete, save, cancel).

**Variants**
- `primary`: Navy blue background, white text (main action)
- `secondary`: Transparent, primary border, primary text (alternative)
- `destructive`: Red background, white text (delete, revoke, reject)
- `success`: Green background, white text (confirm, activate)
- `ghost`: Transparent, no border, primary text (subtle actions, overflow menu)

**Props**
```
Button {
  variant: 'primary' | 'secondary' | 'destructive' | 'success' | 'ghost'
  size: 'small' (32px) | 'medium' (44px) | 'large' (56px)
  icon?: React.ReactNode (Lucide icon, 16–24px)
  iconPosition?: 'left' | 'right'
  disabled?: boolean
  loading?: boolean (shows spinner, disables interaction)
  onClick?: () => void
  type?: 'button' | 'submit' | 'reset'
  label: string (button text or aria-label if icon-only)
  children?: React.ReactNode (text or icon)
  className?: string (Tailwind overrides via parent, not component-internal)
}
```

**Accessibility**
- Keyboard: Fully keyboard operable (Tab, Space, Enter)
- Focus: 2px outline, 2px offset, high contrast
- Screen reader: Accessible name from label or aria-label
- Icon-only: Must have aria-label or visible text (never icon alone)
- Disabled state: aria-disabled="true", no focus allowed

**States**
- Default: Renders as specified
- Hover: Background darkens (1 shade) if desktop (detected by hover capability)
- Focus: 2px outline visible
- Active (pressed): Lighter background
- Disabled: Gray background, gray text, no hover
- Loading: Spinner visible, button disabled, label text preserved (aria-busy="true")

**Acceptance Tests**
- ✓ Can be clicked to trigger action
- ✓ Can be navigated via Tab key
- ✓ Can be activated via Space/Enter keys
- ✓ Focus indicator visible on keyboard interaction
- ✓ Disabled state prevents interaction
- ✓ Screen reader announces button text and disabled state
- ✓ Icon-only button has accessible name

---

### 3.2 Form Field Component

**Purpose.** Collect text input (email, password, text, number, date, search).

**Props**
```
FormField {
  label: string (visible above field)
  name: string (HTML name attribute for form submission)
  type: 'text' | 'email' | 'password' | 'number' | 'date' | 'search'
  value: string
  onChange: (value: string) => void
  onBlur?: () => void
  placeholder?: string (guidance, never replaces label)
  required?: boolean
  disabled?: boolean
  error?: string (error message, if present)
  hint?: string (helper text below label, above input)
  maxLength?: number
  pattern?: string (regex for validation hint)
  icon?: React.ReactNode (Lucide icon, 16px, right-aligned)
  prefix?: string | React.ReactNode (e.g., '+62' for phone)
  suffix?: string | React.ReactNode (e.g., 'kg' for weight)
  autoComplete?: string
  className?: string
}
```

**Accessibility**
- Label: `<label for>` connected to input id
- Required: aria-required="true" + visual indicator (*)
- Error: aria-invalid="true", aria-describedby links to error message
- Hint: aria-describedby links to hint text
- Keyboard: Tab navigable, no trap, backspace/delete work
- Screen reader: Announces label, required state, error, and hint

**States**
- Empty: Placeholder or hint visible (no data entered)
- Filled: Value displayed, label remains visible (not replaced by input)
- Focused: Border color changes to primary, focus outline shown
- Error: Border color red, error message displayed below
- Disabled: Gray background, gray text, no focus allowed
- Read-only: Input not editable (for display of immutable data)

**Acceptance Tests**
- ✓ Label visible and associated with input
- ✓ User can type into field
- ✓ onChange fires on every keystroke
- ✓ onBlur fires when field loses focus
- ✓ Required state visible and communicated to screen reader
- ✓ Error state displays error message
- ✓ Disabled state prevents editing
- ✓ Keyboard navigation works (Tab, Shift+Tab, arrow keys if applicable)

---

### 3.3 Card Component

**Purpose.** Container for grouped content (identity summary, membership status, activity record).

**Props**
```
Card {
  title?: string (optional header)
  subtitle?: string (subheading under title)
  icon?: React.ReactNode (Lucide icon, 24px)
  children: React.ReactNode (card content)
  footer?: React.ReactNode (optional footer content)
  onClick?: () => void (if card is clickable)
  selected?: boolean (highlight card if selected)
  disabled?: boolean (gray out if not interactive)
  variant?: 'default' | 'outlined' | 'elevated' (shadow level)
  className?: string
}
```

**Accessibility**
- Heading: If title, render as `<h3>` (semantic hierarchy)
- Clickable card: Has role="button" if not wrapped in `<a>` or button
- Keyboard: If clickable, Tab navigable and activatable via Space/Enter
- Focus: Visible outline if interactive
- Screen reader: Title announced as heading

**States**
- Default: White/light background, subtle shadow, normal spacing
- Outlined: Transparent background, 1px border, no shadow
- Elevated: More prominent shadow (raised appearance)
- Clicked/Selected: Border color changed to primary, or background lightened
- Disabled: Gray background, gray text, no hover, no interaction

**Acceptance Tests**
- ✓ Content renders inside card
- ✓ Title/subtitle render correctly if provided
- ✓ Card is clickable if onClick provided (keyboard + mouse)
- ✓ Selected state visually distinct
- ✓ Disabled state prevents interaction
- ✓ Footer renders at bottom if provided
- ✓ Focus indicator visible on keyboard navigation

---

### 3.4 Badge Component

**Purpose.** Label a status, category, or state (Active, Verified, Pending, Rejected).

**Props**
```
Badge {
  label: string (text to display)
  variant: 'default' | 'success' | 'warning' | 'danger' | 'info' | 'neutral'
  size: 'small' (24px) | 'medium' (32px)
  icon?: React.ReactNode (Lucide icon, 12–16px)
  removable?: boolean (show X button if true)
  onRemove?: () => void (fired when X clicked)
  className?: string
}
```

**Variants**
- `default`: Navy blue background, white text
- `success`: Green background, white text (active, verified, complete)
- `warning`: Amber background, dark text (pending, needs attention)
- `danger`: Red background, white text (rejected, error, revoked)
- `info`: Blue background, white text (informational)
- `neutral`: Light gray background, dark gray text (tag, non-semantic label)

**Accessibility**
- Screen reader: Announces badge text and variant (e.g., "Status: Verified")
- Removable: X button has aria-label, accessible via Tab and Enter
- Focus: If removable, X button has visible focus outline

**States**
- Default: Renders with background color and text color per variant
- Hover: Slightly darker background (if removable badge)
- Focus (removable): X button has focus outline

**Acceptance Tests**
- ✓ Correct variant color renders
- ✓ Label text displays
- ✓ Icon renders if provided
- ✓ Removable X button appears if removable=true
- ✓ X button triggers onRemove callback
- ✓ Screen reader announces badge and semantic meaning

---

### 3.5 Timeline Component

**Purpose.** Display ordered events or milestones (journey history, verification steps, activity chronology).

**Props**
```
Timeline {
  items: Array<{
    id: string
    timestamp: Date
    title: string
    description?: string
    status: 'completed' | 'pending' | 'active' | 'error'
    icon?: React.ReactNode (Lucide icon, 24px)
    actions?: Array<{ label: string, onClick: () => void }>
    metadata?: Record<string, string> (e.g., { "decision": "Approved", "level": "L2" })
  }>
  orientation?: 'vertical' (default) | 'horizontal'
  className?: string
}
```

**Variants**
- **Vertical timeline:** Stacked events (default for most use cases)
- **Horizontal timeline:** Left-to-right flow (for step-by-step wizards)

**Accessibility**
- List structure: Rendered as `<ol>` (ordered list)
- Item heading: Timestamp and title in `<h4>`
- Status announced: aria-label includes status (e.g., "Step 2, Completed")
- Keyboard: All interactive elements (actions) are Tab navigable

**States**
- Completed: Green icon, darker text (past events)
- Pending: Gray icon, neutral text (future events)
- Active: Primary color icon, bold text (current event)
- Error: Red icon, red text (failed milestone)

**Acceptance Tests**
- ✓ Items render in chronological order
- ✓ Status color reflects item state
- ✓ Timestamp and title display for each item
- ✓ Description/metadata render if provided
- ✓ Action buttons are clickable and accessible
- ✓ Screen reader announces list order and item status
- ✓ Horizontal orientation displays side-by-side

---

### 3.6 Table Component

**Purpose.** Display structured data (player directory, membership list, verification queue).

**Props**
```
Table {
  columns: Array<{
    key: string (data key)
    label: string (visible header)
    sortable?: boolean
    align?: 'left' | 'center' | 'right'
    width?: string (e.g., '30%', '200px')
    render?: (value: any, row: any) => React.ReactNode (custom cell rendering)
  }>
  rows: Array<Record<string, any>> (data rows)
  onRowClick?: (row: Record<string, any>) => void
  selectedRows?: string[] (array of row ids)
  onSelectionChange?: (selectedRows: string[]) => void
  sortBy?: string (current sort column)
  sortOrder?: 'asc' | 'desc'
  onSort?: (column: string, order: 'asc' | 'desc') => void
  loading?: boolean
  empty?: React.ReactNode (custom empty state)
  pagination?: { page: number; pageSize: number; total: number; onPageChange: (page: number) => void }
  className?: string
}
```

**Accessibility**
- Table structure: Semantic `<table>`, `<thead>`, `<tbody>`, `<th>` elements
- Sortable columns: `<button>` inside `<th>`, aria-sort attribute
- Selectable rows: Checkbox column with aria-labelledby linking to header
- Row click: If clickable, row has role="button" and is keyboard navigable
- Screen reader: Announces column headers, data flow, and row count

**States**
- Default: Data renders in rows and columns
- Sorted: Column header styled as active, sort direction arrow shown
- Selected: Row background color changes (highlighted), checkbox checked
- Loading: Skeleton rows shown while data loads
- Empty: Empty state message displayed

**Responsive Behavior**
- Desktop (1024px+): Full table, all columns visible
- Tablet (768px–1023px): Horizontal scroll if needed
- Mobile (375px–767px): Card layout (each row → card, each column → field)

**Acceptance Tests**
- ✓ Columns render with correct headers
- ✓ Data rows populate from rows prop
- ✓ Sortable columns trigger onSort callback
- ✓ Row click works (keyboard + mouse)
- ✓ Selection checkboxes work and trigger onSelectionChange
- ✓ Pagination controls navigate pages
- ✓ Empty state displays when no rows
- ✓ Screen reader announces table structure and content
- ✓ Responsive layout adapts to screen size

---

## PART 4 — Specialized Domain Components

### 4.1 Consent Control Component

**Purpose.** Grant or revoke consent for a purpose (P1–P8) with explanation and consequence warning.

**Props**
```
ConsentControl {
  purposeId: string (P1, P2, ... P8)
  purposeName: string (e.g., "Club Activity & Performance")
  purposeDescription: string (explain what this allows)
  currentState: 'granted' | 'revoked'
  onStateChange: (newState: 'granted' | 'revoked') => void
  consequences?: string[] (array of consequences if revoked)
  highRisk?: boolean (true if revocation triggers special review)
  disabled?: boolean (guardian consent may not be editable by child)
  showHistory?: boolean (show past consent changes)
  history?: Array<{ date: Date; action: 'granted' | 'revoked'; actor: string }>
  className?: string
}
```

**Accessibility**
- Toggle: Native toggle/checkbox, aria-checked reflects state
- Label: Associated via aria-labelledby, clear and explicit
- Consequences: Announced via aria-describedby before toggle
- High-risk: Clear warning message (not hidden behind expanding section)
- Screen reader: "Consent Purpose: [name]. Currently [granted/revoked]. [Consequences if revoked]"

**States**
- Granted: Toggle is ON, purposes are active
- Revoked: Toggle is OFF, purposes are not active
- High-risk revocation: Warning badge, confirmation dialog required
- Disabled: Toggle cannot be changed (form control disabled style)

**Acceptance Tests**
- ✓ Toggle reflects current consent state
- ✓ User can toggle state
- ✓ onStateChange fires with new state
- ✓ Consequences display when revoked
- ✓ High-risk toggles show confirmation dialog
- ✓ History displays past consent changes
- ✓ Screen reader announces purpose and consequences

---

### 4.2 Verification Badge Component

**Purpose.** Indicate verification level (L0, L1, L2, L3) with icon and tooltip.

**Props**
```
VerificationBadge {
  level: 0 | 1 | 2 | 3
  className?: string
}
```

**Levels**
- `L0`: Not verified (no icon, or gray question mark)
- `L1`: Self-attested (icon: user check, green)
- `L2`: Organization verified (icon: building check, green)
- `L3`: Authority verified (icon: official seal, green)

**Accessibility**
- Tooltip: aria-label or title attribute explains level
- Screen reader: "Verification Level 2: Organization Verified"
- No icon-only; must include visible level indicator text

**Acceptance Tests**
- ✓ Correct icon/color for each level
- ✓ Tooltip/aria-label explains level
- ✓ Screen reader announces level

---

### 4.3 Membership Badge Component

**Purpose.** Indicate membership type and status (Primary, Secondary, Inactive).

**Props**
```
MembershipBadge {
  type: 'primary' | 'secondary' | 'inactive'
  status: 'active' | 'pending' | 'ended'
  organizationName?: string (displayed if present)
  className?: string
}
```

**Types & Colors**
- `primary`: Blue (main affiliation)
- `secondary`: Gray (dual enrollment)
- `inactive`: Red (ended or on hold)

**Acceptance Tests**
- ✓ Correct icon/color for each type
- ✓ Organization name displays if provided
- ✓ Status affects icon (e.g., clock for pending)

---

### 4.4 Activity Timeline Component

**Purpose.** Display a chronological record of football activities (matches, training, assessments) with count-status.

**Props**
```
ActivityTimeline {
  activities: Array<{
    id: string
    date: Date
    type: 'match' | 'training' | 'assessment'
    title: string
    description?: string
    counted: boolean (contributes to active status)
    reason?: string (if not counted, why?)
    coach?: string (name of recording coach)
    details?: Record<string, string> (e.g., { "duration": "90 min", "score": "2-1" })
  }>
  currentCounts?: { counted: number; pending: number; rejected: number }
  policyVersion?: string (policy_id@version used for counting)
  className?: string
}
```

**Accessibility**
- List: Rendered as `<ol>` (ordered by date)
- Each activity: `<li>` with heading and details
- Status indicators: aria-label explains "Counted" vs "Pending" vs "Rejected"
- Screen reader: "Activity: [type], [date], [counted status], [coach]"

**Acceptance Tests**
- ✓ Activities render in reverse-chronological order (newest first)
- ✓ Status (counted/pending/rejected) is clearly indicated
- ✓ Policy version displays at top
- ✓ Counts display (counted/pending/rejected tallies)
- ✓ Screen reader announces each activity and status

---

### 4.5 Audit Timeline Component

**Purpose.** Display audit trail of decisions (read-only) for privacy and governance review.

**Props**
```
AuditTimeline {
  entries: Array<{
    id: string
    timestamp: Date
    actor: string (who made the decision)
    action: string (what was done, e.g., "Consent Granted")
    subject?: string (who/what was affected)
    details?: Record<string, string> (decision context)
    policyVersion?: string (policy used)
  }>
  className?: string
}
```

**Accessibility**
- List: Rendered as `<ol>`
- Read-only: No edit/delete buttons; emphasis on immutability
- Timestamp: ISO format with aria-label for locale
- Screen reader: "Audit entry [number]: [actor] [action] on [timestamp] under [policy]"

**Acceptance Tests**
- ✓ Entries render in reverse-chronological order
- ✓ All required fields display (actor, action, timestamp, policy)
- ✓ Details expand on click (accordion)
- ✓ No editable elements visible
- ✓ Screen reader announces complete audit entry

---

### 4.6 Wizard/Stepper Component

**Purpose.** Guide users through multi-step processes (registration, transfer initiation, verification request).

**Props**
```
Wizard {
  steps: Array<{
    id: string
    title: string
    description?: string
    status: 'completed' | 'current' | 'upcoming' | 'error'
  }>
  currentStep: number (0-indexed)
  onStepChange?: (stepIndex: number) => void
  canGoBack?: boolean
  canSkip?: boolean
  children: (currentStep: number) => React.ReactNode (render current step content)
  className?: string
}
```

**Accessibility**
- Step indicators: `<ol>` (ordered list of steps)
- Current step: aria-current="step"
- Progress: aria-label describing progress (e.g., "Step 2 of 5")
- Back button: Visible and labeled clearly
- Keyboard: Tab through all controls, no trap

**States**
- Completed: Green checkmark, dimmed text
- Current: Blue highlight, bold text
- Upcoming: Gray, dimmed
- Error: Red icon, error message displayed

**Responsive Behavior**
- Desktop: All steps visible in a row
- Tablet: Steps may wrap to 2–3 rows
- Mobile: Step title and progress percentage only (scroll to see all)

**Acceptance Tests**
- ✓ Steps render in order
- ✓ Current step is highlighted
- ✓ Next/Back buttons navigate steps
- ✓ Step content renders based on currentStep
- ✓ Progress percentage accurate
- ✓ Screen reader announces current step and progress
- ✓ Keyboard navigation works

---

### 4.7 Dialog/Modal Component

**Purpose.** Display a confirmation, alert, or form in a modal overlay.

**Props**
```
Dialog {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  description?: string
  icon?: React.ReactNode (Lucide icon)
  children?: React.ReactNode (content, often a form or message)
  actions?: Array<{ label: string; onClick: () => void; variant: 'primary' | 'secondary' | 'destructive' }>
  closeButton?: boolean (show X to close)
  dismissible?: boolean (allow escape/backdrop click to close)
  className?: string
}
```

**Accessibility**
- Role: role="alertdialog" or role="dialog"
- Focus trap: Focus cannot escape the modal
- Close: Escape key closes if dismissible=true
- Heading: aria-labelledby links to title `<h2>`
- Description: aria-describedby links to description if present
- Screen reader: "Dialog: [title]. [description]. [actions list]."

**States**
- Open: Modal visible, backdrop dimmed, focus trapped
- Closed: Modal hidden
- Error state: Error message displayed, confirm button disabled until fixed

**Acceptance Tests**
- ✓ Modal opens when open=true
- ✓ Modal closes when onOpenChange called with false
- ✓ Escape key closes if dismissible=true
- ✓ Backdrop click closes if dismissible=true
- ✓ Focus trapped inside modal (Tab cycles through controls)
- ✓ Action buttons trigger onClick callbacks
- ✓ Screen reader announces title and content
- ✓ X button closes if closeButton=true

---

### 4.8 Notification Component

**Purpose.** Display alerts, success messages, errors, or warnings.

**Props**
```
Notification {
  id?: string (for toast management)
  type: 'success' | 'error' | 'warning' | 'info'
  title: string
  message?: string
  icon?: React.ReactNode (defaults to semantic icon)
  action?: { label: string; onClick: () => void }
  dismissible?: boolean
  onDismiss?: () => void
  duration?: number (auto-dismiss in ms, default 3000 for success; 0 for no auto-dismiss)
  position?: 'top-center' | 'top-right' | 'bottom-right' | 'bottom-center'
  className?: string
}
```

**Accessibility**
- Role: role="alert" for important messages, role="status" for updates
- aria-live: "polite" for status, "assertive" for error/warning
- Dismissible: X button has aria-label
- Action: Button is keyboard and screen-reader accessible
- Screen reader: "Alert: [type]. [title]. [message]. [action if available]."

**Types & Defaults**
- `success`: Green background, auto-dismiss after 3s
- `error`: Red background, persist until dismissed
- `warning`: Amber background, persist until dismissed
- `info`: Blue background, auto-dismiss after 5s

**Acceptance Tests**
- ✓ Correct icon/color for type
- ✓ Title and message display
- ✓ Action button works if provided
- ✓ Auto-dismisses after duration (if set)
- ✓ Dismissible X button works
- ✓ Screen reader announces notification type and content
- ✓ Multiple notifications stack without overlap

---

### 4.9 Search/Filter Panel Component

**Purpose.** Provide input fields and controls to filter a list or table.

**Props**
```
FilterPanel {
  fields: Array<{
    key: string
    label: string
    type: 'text' | 'select' | 'date' | 'checkbox-group' | 'radio-group'
    options?: Array<{ value: string; label: string }> (for select/checkbox/radio)
    value?: string | string[] (current value)
    onChange: (value: string | string[]) => void
  }>
  onApply?: () => void (triggered when user clicks Apply)
  onReset?: () => void (triggered when user clicks Reset)
  resultsCount?: number (e.g., "12 results match your filters")
  className?: string
}
```

**Accessibility**
- Fieldset: Related filters grouped in `<fieldset>` with legend
- Labels: `<label for>` on every field
- Radio/checkbox groups: aria-labelledby links to group label
- Results: aria-live="polite" announces result count changes
- Keyboard: Tab through all fields, Enter in text fields triggers Apply

**States**
- Default: Form fields empty or showing default values
- Filtered: Fields show current filter values, results count displays
- Active filter: Field highlight or visual indicator
- Disabled: Filter field grayed out if not applicable

**Responsive Behavior**
- Desktop: All filters visible in sidebar or collapsible panel
- Mobile: Filters in drawer or full-screen overlay

**Acceptance Tests**
- ✓ Form fields display correct types
- ✓ Value changes trigger onChange
- ✓ Apply button fires onApply (if provided)
- ✓ Reset button clears all fields and fires onReset
- ✓ Result count updates and announced by screen reader
- ✓ All fields keyboard navigable
- ✓ Screen reader announces field labels and result count

---

## PART 5 — Component Composition Matrix

How components are combined on the 50 screens (reference only; detailed on each screen in IDN-SCR-DETAILS-001).

| Screen | Primary Components | Secondary Components |
| --- | --- | --- |
| SCR-PUB-01 (Landing) | Card | Badge, Button |
| SCR-PUB-02 (Login) | FormField, Button | Dialog |
| SCR-PUB-03 (Register) | Wizard, FormField, Button | Card, Notification |
| SCR-PUB-05 (Football ID Lookup) | FormField, Button, Badge | Notification |
| SCR-PLY-01 (Player Dashboard) | Card, Badge, Timeline | Button |
| SCR-PLY-02 (Player Profile) | FormField, Button, Card | Notification |
| SCR-PLY-03 (Football Identity) | Card, Badge, Button | Dialog |
| SCR-PLY-04 (Journey Timeline) | Timeline | Filter, Badge |
| SCR-PLY-07 (Consent) | ConsentControl, Badge | Dialog, Notification |
| SCR-PLY-08 (Verification) | Card, Button, Badge, FormField | Notification |
| SCR-GRD-02 (Linked Players) | Table, FilterPanel, Button | Dialog |
| SCR-GRD-04 (Consent Management) | ConsentControl, Card, Badge | Notification, Dialog |
| SCR-ORG-02 (Player Directory) | Table, FilterPanel, FormField | Card, Badge |
| SCR-ORG-03 (Membership Management) | Table, Card, FormField, Button | Dialog, Notification |
| SCR-ORG-05 (Activity Management) | Table, FormField, Button, ActivityTimeline | Notification |
| SCR-ASC-03 (Verification Adjudication) | Table, Card, FormField, Button | AuditTimeline, Notification |
| SCR-FED-02 (National Directory) | Table, FilterPanel, Button | Dialog, Notification |
| SCR-FED-04 (Analytics) | Card (Metric), FilterPanel | Badge |
| SCR-FED-05 (Audit) | Table, AuditTimeline, FilterPanel | — |
| SCR-SYS-01 (Error) | Card, Button | — |

---

## PART 6 — Accessibility Audit & Compliance

### Component Accessibility Summary

| Component | WCAG Standard | Keyboard | Screen Reader | Focus | Test Tool |
| --- | --- | --- | --- | --- | --- |
| Button | 2.1 AA | Full | Label + state | Visible | WAVE, Axe |
| FormField | 2.1 AA | Full | Label + error + hint | Visible | WAVE, Axe |
| Card | 2.1 AA | Partial (heading only) | Heading + content | Conditional | WAVE |
| Badge | 2.1 AA | N/A | aria-label | N/A | Axe |
| Timeline | 2.1 AA | Full | List + status | Conditional | WAVE, Axe |
| Table | 2.1 AA | Full | Headers + cells | Full | WAVE, Axe |
| ConsentControl | 2.1 AA | Full | Label + consequences | Visible | Axe |
| Dialog | 2.1 AA | Full (trap) | Title + content | Trapped | WAVE, Axe |
| Notification | 2.1 AA | Partial | Live region | N/A | Axe |
| FilterPanel | 2.1 AA | Full | Labels + result count | Visible | WAVE, Axe |

---

## PART 7 — Component Testing

### Acceptance Criteria Template

Every component must pass:

```
✓ Visual Regression: Component appears as specified
✓ Functional: All props work as documented
✓ Accessibility: WCAG 2.1 AA compliance verified
✓ Responsive: Renders correctly at 375px, 768px, 1024px, 1440px
✓ States: All documented states render correctly
✓ Keyboard: All interactions keyboard accessible
✓ Screen Reader: NVDA/JAWS announces content correctly
✓ Mobile: Touch targets 44px+, no horizontal scroll
✓ Dark Mode: All colors meet contrast requirements
✓ Performance: Renders in <100ms (performance budget)
```

---

## PART 8 — Component Library Versioning

**Semantic Versioning**

- **Major bump:** Breaking change (prop removed, behavior changed)
- **Minor bump:** New prop or state added (backward compatible)
- **Patch bump:** Bug fix (no new behavior)

**No Breaking Changes on Deployed Screens**

Deployed screens continue to work with old component versions. Breaking changes
require all dependent screens to be updated in the same release.

---

## PART 9 — Traceability & Success Criteria

**Traceability**
- Every component traces back to IDN-SCR-001 (screens that use it)
- Every component follows IDN-DS-001 (design tokens)
- Every prop traces to IDN-API-001 or IDN-DMN-001 (data models)

**Success Criteria**
- ✓ All 17 component families defined with clear contracts
- ✓ All 50 screens compose only these components (no custom, one-off components)
- ✓ Component library is versioned and backward compatible
- ✓ WCAG 2.1 AA compliance verified on all components
- ✓ Responsive design tested at all breakpoints
- ✓ No component introduces business logic or API calls
- ✓ Governance Council approves all new or modified components

---

**Component library is ready for implementation. Every screen in IDN-SCR-001 composes only these components.**
