import { env } from '$env/dynamic/public';

// In preview mode (SSR), disable prerendering to fetch fresh data on each request
export const prerender = env.PUBLIC_PREVIEW_MODE !== 'true';





