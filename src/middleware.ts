import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

interface RateLimitInfo {
  count: number;
  resetTime: number;
}

// In-memory store for rate limiting
// Note: In serverless environments, this state is not shared across instances.
// For true distributed rate limiting, consider using Redis (e.g. Upstash).
const rateLimitStore = new Map<string, RateLimitInfo>();

const RATE_LIMIT_MAX = 100;
const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 minute

function cleanupStore() {
  const now = Date.now();
  for (const [ip, info] of rateLimitStore.entries()) {
    if (now > info.resetTime) {
      rateLimitStore.delete(ip);
    }
  }
}

// Run cleanup occasionally
setInterval(cleanupStore, RATE_LIMIT_WINDOW_MS);

export function middleware(request: NextRequest) {
  // Only apply rate limiting to /api routes
  if (!request.nextUrl.pathname.startsWith('/api')) {
    return NextResponse.next();
  }

  // Get the client's IP address
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0] || 
             'unknown-ip';

  const now = Date.now();
  let rateLimitInfo = rateLimitStore.get(ip);

  // If IP isn't in store, or its window has expired, reset it
  if (!rateLimitInfo || now > rateLimitInfo.resetTime) {
    rateLimitInfo = {
      count: 0,
      resetTime: now + RATE_LIMIT_WINDOW_MS,
    };
  }

  rateLimitInfo.count += 1;
  rateLimitStore.set(ip, rateLimitInfo);

  const remaining = Math.max(0, RATE_LIMIT_MAX - rateLimitInfo.count);
  const resetTimestampSeconds = Math.ceil(rateLimitInfo.resetTime / 1000);

  if (rateLimitInfo.count > RATE_LIMIT_MAX) {
    return new NextResponse(
      JSON.stringify({
        error: 'Too Many Requests',
        message: 'You have exceeded the API rate limit. Please try again later.'
      }),
      {
        status: 429,
        headers: {
          'Content-Type': 'application/json',
          'X-RateLimit-Limit': RATE_LIMIT_MAX.toString(),
          'X-RateLimit-Remaining': '0',
          'X-RateLimit-Reset': resetTimestampSeconds.toString(),
          'Retry-After': Math.ceil((rateLimitInfo.resetTime - now) / 1000).toString(),
        },
      }
    );
  }

  // Pass through and append rate limit headers
  const response = NextResponse.next();
  response.headers.set('X-RateLimit-Limit', RATE_LIMIT_MAX.toString());
  response.headers.set('X-RateLimit-Remaining', remaining.toString());
  response.headers.set('X-RateLimit-Reset', resetTimestampSeconds.toString());
  
  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths starting with /api
     */
    '/api/:path*',
  ],
};
