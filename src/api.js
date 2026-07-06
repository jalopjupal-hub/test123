// Small API helper for authentication-related requests.

// Invalidate the current session on the server so the token can no longer be
// used. The caller is responsible for clearing client-side state regardless of
// whether this request succeeds.
export async function logoutRequest(token) {
  return fetch("/api/logout", {
    method: "POST",
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
}
