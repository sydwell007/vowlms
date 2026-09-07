/**
 * Tiny open/close pub-sub for the Thandi panel — mirrors the
 * fetch-once/invalidate-via-event pattern already used elsewhere in this repo
 * (e.g. `course-review-summaries-client.ts`), just for UI open state instead
 * of remote data. Lets the sidebar entry (inside `EcosystemSidebar`) open a
 * panel that's mounted separately, at the root layout, so it isn't clipped by
 * the sidebar's own overflow/transform styling.
 */
type Listener = (open: boolean) => void;

let panelOpen = false;
const listeners = new Set<Listener>();

export function openThandiPanel() {
  panelOpen = true;
  listeners.forEach((listener) => listener(true));
}

export function closeThandiPanel() {
  panelOpen = false;
  listeners.forEach((listener) => listener(false));
}

export function isThandiPanelOpen() {
  return panelOpen;
}

export function subscribeThandiPanel(listener: Listener): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}
