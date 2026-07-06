# test123

A small React app (React Router v6) demonstrating session-based authentication.

## Getting started

```bash
npm install
npm run dev      # start the dev server
npm test         # run the test suite
npm run build    # production build
```

## Authentication

The app keeps a session token in `localStorage` and exposes it through an
`AuthProvider` (`src/AuthContext.jsx`). Protected routes are wrapped in
`RequireAuth` (`src/RequireAuth.jsx`), which redirects unauthenticated visitors
to `/login`.

### Logging out

The Settings page header (`src/SettingsPage.jsx`) includes a **Log out** button.
Clicking it:

1. Calls the server to invalidate the session (`POST /api/logout`).
2. Clears the client-side session (removes the token from `localStorage` and
   resets auth state) — this happens even if the server request fails, so the
   device is always logged out locally.
3. Redirects to `/login`.

Because protected routes are guarded by `RequireAuth`, once the session is
cleared any attempt to reach an authenticated page (e.g. `/settings`) requires
signing in again.
