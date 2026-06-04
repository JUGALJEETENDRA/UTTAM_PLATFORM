export const GAS_WEB_APP_URL = process.env.NEXT_PUBLIC_GAS_URL || "";

export async function fetchGAS(action: string, payload: Record<string, any> = {}) {
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

    return data;
  } catch (error) {
    console.error(`Error fetching GAS for action ${action}:`, error);
    throw error;
  }
}
