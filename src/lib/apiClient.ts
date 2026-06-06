export const GAS_WEB_APP_URL = process.env.NEXT_PUBLIC_GAS_URL || "";

export async function fetchGAS(action: string, payload: Record<string, any> = {}) {
  try {
    const url = new URL(GAS_WEB_APP_URL);
    url.searchParams.append('action', action);
    url.searchParams.append('t', Date.now().toString());
    
    const response = await fetch(url.toString(), {
      method: 'POST',
      headers: {
        'Content-Type': 'text/plain;charset=utf-8', 
      },
      body: JSON.stringify(payload),
      cache: 'no-store',
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const text = await response.text();
    let data;
    try {
      data = JSON.parse(text);
    } catch (e) {
      throw new Error(`Invalid response from server: ${text.substring(0, 100)}...`);
    }
    
    if (data && data.error) {
      throw new Error(data.error);
    }

    return data;
  } catch (error) {
    console.error(`Error fetching GAS for action ${action}:`, error);
    throw error;
  }
}
