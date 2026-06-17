# Strive

A responsive frontend MVP for a sports recruiting platform serving high school athletes, college athlete mentors, and college coaches.

Built with Vite, React, and TypeScript.

## Pages (routes)

- `/` - landing page
- `/athlete` - high school athlete dashboard
- `/mentor` - college athlete mentor dashboard
- `/coach` - coach discovery feed
- `/profile` - athlete profile
- `/meal` - AI meal plan tool
- `/training` - AI training schedule tool

## What is included

- Role-based navigation across separate routes
- High school athlete dashboard with profile completion, highlights, mentor recommendations, AI tools, and coach interest
- College athlete mentor dashboard with pricing, availability, bookings, session types, and 15% platform commission math
- College coach dashboard with vertical highlight feed, filters, saved recruits, and coach-initiated contact flow
- Athlete profile page
- AI meal plan generator prototype
- AI training schedule generator prototype
- Responsive mobile and desktop layout

## Business rules represented

- College athletes set their own mentorship session prices.
- The platform takes a 15% commission from mentor session payments.
- High school athletes can book and pay mentors for sessions.
- High school athletes cannot directly message college coaches first.
- Coaches discover athletes through highlights and initiate contact only after showing interest.
- Meal plans and training schedules are simulated frontend AI tools.

## Project structure

- `src/data.ts` - typed domain data (mentors, athletes) and helpers
- `src/components/` - shared `Nav`, `Footer`, and `Modal` (global dialog via context)
- `src/pages/` - one component per route
- `src/styles.css` - styling (unchanged from the original MVP)

## Develop

```bash
npm install
npm run dev       # start the dev server
npm run build     # typecheck + production build to dist/
npm run preview   # serve the production build
npm run typecheck # type-check only
```
