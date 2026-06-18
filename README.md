# Meridian College — Website

A landing page, admissions portal, and virtual tour for a fictional college. Built with HTML, CSS, and JavaScript following the Impeccable design system.

## Pages

- **`index.html`** — Landing page with hero, mission, programs, features, testimonials, and CTA sections.
- **`admissions.html`** — Multi-step application form with personal info, academic history, program selection, and review/submit flow.
- **`tour.html`** — Interactive virtual campus tour with 6 stops, detail modal with keyboard navigation, and SVG campus map.

## Design

- **Palette**: Deep ivy green — `oklch(0.35 0.10 140)` — with warm gold accent `oklch(0.70 0.15 80)` on pure white background.
- **Typography**: Prata (serif display) + Sora (sans body) from Google Fonts.
- **Motion**: Scroll-triggered reveal animations with Intersection Observer, smooth navigation scrolling.

## Usage

Open any `.html` file in a browser. No build step required.

```bash
# Serve locally with any static server
npx serve .
```

## Live Site

Deployed via Netlify:  
[https://relaxed-empanada-7ef920.netlify.app/](https://relaxed-empanada-7ef920.netlify.app/)

## Challenges & Solutions

**Challenge: Multi-step form validation without a framework.**  
Solution: Used a step-index system where each step's `[required]` fields are validated independently. Validation is scoped to the current step, with custom checks for email format and GPA range. Error messages are rendered into per-field `.form-error` elements scoped to each step.

**Challenge: Making the SVG campus map interactive.**  
Solution: Tour stops and map dots share a centralized `tourData` array keyed by `data-index` attributes. Clicking either triggers the same `openStop()` function, keeping interaction consistent. Arrow keys and close button are also bound to the same data source.

**Challenge: Persisting form data across page refreshes without a backend.**  
Solution: Every `input` event saves the full form state (including dynamic extracurricular fields) to `sessionStorage`. On page load, `loadFormData()` restores all fields so no data is lost on accidental refresh. Data clears on successful submission.

**Challenge: Step-tracker clicks without breaking forward-progress logic.**  
Solution: Clicking a step circle or checklist item navigates to that step only if it's already completed or the current step (no skipping ahead without filling required fields). The `currentStep` guard prevents jumping past unvalidated steps.

**Challenge: Repeatable scroll-triggered animations without framework dependencies.**  
Solution: Used `IntersectionObserver` that toggles the `visible` class on enter and removes it on leave, so the fade-in animation replays every time an element scrolls into view. Pure CSS transitions handle the visual effect.
