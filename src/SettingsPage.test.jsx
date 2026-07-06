import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { act, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import App from "./App";

function renderApp(initialPath = "/settings") {
  return render(
    <MemoryRouter initialEntries={[initialPath]}>
      <App />
    </MemoryRouter>
  );
}

describe("Settings page logout", () => {
  beforeEach(() => {
    localStorage.clear();
    global.fetch = vi.fn(() => Promise.resolve({ ok: true }));
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("shows a Log out button in the settings header", () => {
    localStorage.setItem("authToken", "existing-token");
    renderApp();

    const header = screen.getByRole("banner");
    const button = within(header).getByRole("button", { name: /log out/i });
    expect(button).toBeInTheDocument();
  });

  it("clears the session server- and client-side, then redirects to /login", async () => {
    const user = userEvent.setup();
    localStorage.setItem("authToken", "existing-token");
    renderApp();

    await act(async () => {
      await user.click(screen.getByRole("button", { name: /log out/i }));
    });

    // Server-side invalidation is requested with the current token.
    expect(global.fetch).toHaveBeenCalledWith(
      "/api/logout",
      expect.objectContaining({
        method: "POST",
        headers: { Authorization: "Bearer existing-token" },
      })
    );

    // Client-side session is cleared.
    expect(localStorage.getItem("authToken")).toBeNull();

    // Redirected to the login page.
    expect(
      await screen.findByRole("heading", { name: /log in/i })
    ).toBeInTheDocument();
  });

  it("still logs out locally when the server request fails", async () => {
    const user = userEvent.setup();
    global.fetch = vi.fn(() => Promise.reject(new Error("network down")));
    localStorage.setItem("authToken", "existing-token");
    renderApp();

    await act(async () => {
      await user.click(screen.getByRole("button", { name: /log out/i }));
    });

    expect(localStorage.getItem("authToken")).toBeNull();
    expect(
      await screen.findByRole("heading", { name: /log in/i })
    ).toBeInTheDocument();
  });

  it("blocks protected pages when there is no session", () => {
    renderApp("/settings");

    expect(
      screen.getByRole("heading", { name: /log in/i })
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("heading", { name: /settings/i })
    ).not.toBeInTheDocument();
  });

  it("requires re-authentication for protected pages after logout", async () => {
    const user = userEvent.setup();
    localStorage.setItem("authToken", "existing-token");
    const { unmount } = renderApp();

    await act(async () => {
      await user.click(screen.getByRole("button", { name: /log out/i }));
    });
    await screen.findByRole("heading", { name: /log in/i });
    unmount();

    // Simulate re-visiting the app on a protected route after logout: the guard
    // must send the user back to the login page.
    renderApp("/settings");
    expect(
      screen.getByRole("heading", { name: /log in/i })
    ).toBeInTheDocument();
  });
});
