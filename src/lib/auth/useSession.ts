"use client";

import { useEffect, useState } from "react";

export type SessionUser = {
  id: string;
  name: string;
  email: string;
  role: "learner" | "facilitator" | "employer" | "admin";
  avatar_url?: string | null;
  avatarUrl?: string | null;
};

type SessionState =
  | { status: "loading" }
  | { status: "authenticated"; user: SessionUser }
  | { status: "unauthenticated" };

let cachedUser: SessionUser | null = null;
let cachedState: SessionState = { status: "loading" };
const listeners = new Set<(state: SessionState) => void>();

function emit(state: SessionState) {
  cachedState = state;
  for (const listener of listeners) {
    listener(state);
  }
}

export function useSession(): SessionState {
  const [state, setState] = useState<SessionState>(cachedState);

  useEffect(() => {
    listeners.add(setState);

    if (cachedUser) {
      Promise.resolve().then(() => {
        if (cachedUser) {
          emit({ status: "authenticated", user: cachedUser });
        }
      });
      return () => {
        listeners.delete(setState);
      };
    }

    fetch("/api/auth/session")
      .then((r) => r.json())
      .then((json) => {
        if (json.ok && json.data) {
          cachedUser = json.data as SessionUser;
          emit({ status: "authenticated", user: cachedUser });
        } else {
          emit({ status: "unauthenticated" });
        }
      })
      .catch(() => emit({ status: "unauthenticated" }));

    return () => {
      listeners.delete(setState);
    };
  }, []);

  return state;
}

export function setSessionCache(user: SessionUser) {
  cachedUser = user;
  emit({ status: "authenticated", user });
}

export function clearSessionCache() {
  cachedUser = null;
  emit({ status: "unauthenticated" });
}
