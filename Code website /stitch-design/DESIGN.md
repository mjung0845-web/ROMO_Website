```markdown
# Design System Documentation: Digital Nocturne

## 1. Overview & Creative North Star

### Creative North Star: "The Illuminated Archive"
This design system is not a standard "dark mode" port; it is a high-end editorial experience designed to convey technical precision and local authority. It moves away from the "Generic SaaS" aesthetic by embracing **Organic Brutalism**—a style that pairs the rigid, geometric accuracy of high-tech industries with the airy, spacious layouts of luxury print journalism.

We avoid the "template" look through:
*   **Intentional Asymmetry:** Breaking the 12-column grid with staggered content blocks and oversized typography.
*   **Tonal Depth:** Replacing harsh lines with light-source-driven depth.
*   **High-Contrast Scale:** Pairing massive `display-lg` headlines with micro-labeling to create a sense of architectural grandeur.

---

## 2. Colors

The color palette is anchored in a deep, midnight obsidian (`background: #060e20`), providing a canvas where light and data can truly "glow."

### The "No-Line" Rule
**Explicit Instruction:** Designers are prohibited from using 1px solid borders to define sections. Boundaries must be established through color shifts.
*   **Sectioning:** Use a transition from `surface` (#060e20) to `surface-container-low` (#06122d) to define the end of one content block and the start of another.
*   **Nesting:** To create "nested" depth, follow a hierarchy of light. An inner card should be `surface-container-high` (#031d4b) placed upon a `surface-container` (#05183c) section. This mimics the way light pools in physical spaces.

### The Glass & Gradient Rule
To provide a "soul" to the digital interface:
*   **Hero CTAs:** Use a linear gradient (45deg) from `primary` (#7bd0ff) to `primary-container` (#004c69).
*   **Floating Elements:** Use Glassmorphism. Apply `surface` with 60% opacity and a `backdrop-filter: blur(20px)`. This ensures the UI feels like a single, cohesive ecosystem rather than a series of disconnected boxes.

---

## 3. Typography

The typography strategy relies on the tension between **Space Grotesk** (a high-tech, geometric sans) and **Inter** (a highly legible, utilitarian sans).

*   **Headlines (Space Grotesk):** These are your brand’s "Voice of Authority." Use `display-lg` (3.5rem) with tight letter-spacing (-0.02em) for hero sections to create an editorial, high-fashion impact.
*   **Body (Inter):** Reserved for technical data and long-form reading. Inter provides the "Local Reliability" factor—it is familiar, stable, and highly readable against dark backgrounds.
*   **Labels:** Use `label-md` (Space Grotesk) in uppercase with 0.1em tracking for sub-headers to maintain the "high-tech" instrumentation feel.

---

## 4. Elevation & Depth

We eschew traditional material shadows in favor of **Tonal Layering**.

### The Layering Principle
Hierarchy is achieved by "stacking" surface tiers.
1.  **Level 0 (Base):** `surface` (#060e20)
2.  **Level 1 (Sections):** `surface-container-low` (#06122d)
3.  **Level 2 (Cards):** `surface-container` (#05183c)
4.  **Level 3 (Popovers/Modals):** `surface-container-highest` (#00225a)

### Ambient Shadows & Ghost Borders
*   **Ambient Shadows:** If an element must float (e.g., a dropdown), use a shadow with a 32px blur, 0px offset, and 8% opacity. The shadow color must be sampled from `surface-tint` (#7bd0ff) to simulate blue-toned ambient light.
*   **The Ghost Border:** For accessibility in form fields, use a "Ghost Border": the `outline-variant` (#2b4680) at **20% opacity**. Never use 100% opaque borders; they shatter the "editorial" flow.

---

## 5. Components

### Buttons
*   **Primary:** A vibrant `primary` (#7bd0ff) fill with `on-primary` (#004560) text. Apply a `md` (0.375rem) corner radius for a "technical precision" look.
*   **Secondary:** No fill. Use a `Ghost Border` (20% opacity `outline`) with `primary` text.
*   **Tertiary:** Purely typographic. Use `label-md` with an underlined hover state.

### Input Fields
*   **Style:** `surface-container-low` fill with a bottom-only `outline-variant` (40% opacity). 
*   **State:** On focus, the bottom border scales to 2px and transitions to `primary`.

### Cards & Lists
*   **Forbidden:** 1px divider lines.
*   **Implementation:** Separate list items using 16px of vertical white space (using the Spacing Scale). For cards, use a subtle background shift to `surface-container-high`.
*   **Asymmetry:** In a list of three cards, make the first card 1.5x wider than the others to create an editorial "Feature" look.

### Signature Component: The "Innovation Pulse"
A small, circular status indicator using `primary` with a CSS pulse animation (opacity 1.0 to 0.4) to signify "live" regional data or active innovation hubs.

---

## 6. Do's and Don'ts

### Do:
*   **Embrace Negative Space:** Give `display-lg` typography room to breathe. Treat the screen like a gallery wall, not a spreadsheet.
*   **Use Tonal Shifts:** Always ask, "Can I define this area with a background color change instead of a line?"
*   **Prioritize Accessibility:** Ensure `on-surface-variant` text meets a 4.5:1 contrast ratio against the `surface-container` tiers.

### Don't:
*   **Don't use Pure White:** Use `on-surface` (#dee5ff) or `tertiary` (#f0f3ff) for text. Pure #FFFFFF is too jarring against the deep navy background and causes "halation" (glowing) for users with astigmatism.
*   **Don't use Default Shadows:** Avoid muddy grey shadows. If you need depth, use the blue-tinted Ambient Shadow.
*   **Don't Over-Round:** Stick to the `md` (0.375rem) and `lg` (0.5rem) tokens. Overly rounded "pill" shapes (except for chips) feel too soft and consumer-grade for this high-tech system.

---

*Director's Final Note: Design with the lights off. This system is about the glow of the screen and the precision of the data. Every pixel should feel like it was placed with a caliper.*```