"use client";

import { useEffect, useState } from "react";

export type SessionUser = {
  id: string;
  name: string;
  email: string;
  role: "learner" | "facilitator" | "employer" | "admin";
};

type SessionState =
  | { status: "loading" }
  | { status: "authenticated"; user: SessionUser }
  | { status: "unauthenticated" };

let cachedUser: SessionUser | null = null;

export function useSession(): SessionState {
  const [state, setState] = useState<SessionState>({ status: "loading" });

  useEffect(() => {
    if (cachedUser) {
      setState({ status: "authenticated", user: cachedUser });
      return;
    }

    fetch("/api/auth/me")
      .then((r) => r.json())
      .then((json) => {
        if (json.ok && json.data) {
          cachedUser = json.data as SessionUser;
          setState({ status: "authenticated", user: cachedUser });
        } else {
          setState({ status: "unauthenticated" });
        }
      })
      .catch(() => setState({ status: "unauthenticated" }));
  }, []);

  return state;
}

export function clearSessionCache() {
  cachedUser = null;
}
