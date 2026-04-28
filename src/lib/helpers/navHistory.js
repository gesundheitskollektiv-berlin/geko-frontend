import { afterNavigate } from '$app/navigation';

/** Previous in-app pathname (per browser tab session), or null. */
let previousPath = null;

/**
 * Register the navigation tracker. Call once from the top-level layout so it
 * stays alive across all routes.
 */
export function trackNavigation() {
  afterNavigate(({ from }) => {
    previousPath = from?.url?.pathname ?? null;
  });
}

export function getPreviousPath() {
  return previousPath;
}
