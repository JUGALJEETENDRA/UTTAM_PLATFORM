export const GAS_WEB_APP_URL = process.env.NEXT_PUBLIC_GAS_URL || "";

const CACHE_EXPIRATION_MS = 5 * 60 * 1000; // 5 minutes

export async function fetchGAS(action: string, payload: Record<string, any> = {}) {
  // Determine if it's a read or write operation based on action name prefix
  const isRead = action.startsWith("get") || action.startsWith("list");
  
  // Create a deterministic cache key based on action and payload
  const cacheKey = `gas_cache_${action}_${JSON.stringify(payload)}`;
  
  // 1. Try to return from cache if it's a read operation
  if (isRead && typeof window !== "undefined") {
    const cached = sessionStorage.getItem(cacheKey);
    if (cached) {
      try {
        const parsed = JSON.parse(cached);
        if (Date.now() - parsed.timestamp < CACHE_EXPIRATION_MS) {
          console.log(`[Cache Hit] ${action}`);
          return parsed.data;
        }
      } catch (e) {
        // invalid JSON in cache, ignore
      }
    }
  }

  // 2. Clear cache if it's a write operation to ensure fresh data on next load
  if (!isRead && typeof window !== "undefined") {
    // Only clear items matching our cache prefix
    const keysToRemove = [];
    for (let i = 0; i < sessionStorage.length; i++) {
      const key = sessionStorage.key(i);
      if (key && key.startsWith("gas_cache_")) {
        keysToRemove.push(key);
      }
    }
    keysToRemove.forEach(k => sessionStorage.removeItem(k));
  }

  // 3. Fetch from GAS
  try {
    const url = new URL(GAS_WEB_APP_URL);
    url.searchParams.append('action', action);
    
    const response = await fetch(url.toString(), {
      method: 'POST',
      headers: {
        'Content-Type': 'text/plain;charset=utf-8', 
      },
      body: JSON.stringify(payload),
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    if (data && data.error) {
      throw new Error(data.error);
    }

    // 4. Save to cache
    if (isRead && typeof window !== "undefined" && data) {
      sessionStorage.setItem(cacheKey, JSON.stringify({
        timestamp: Date.now(),
        data: data
      }));
    }

    return data;
  } catch (error) {
    console.error(`Error fetching GAS for action ${action}:`, error);
    throw error;
  }
}
