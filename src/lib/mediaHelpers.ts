export function getEmbedUrl(url: string | null | undefined): string | null {
  if (!url) return null;
  
  if (url.includes("drive.google.com") || url.includes("docs.google.com")) {
    const match = url.match(/(file|document|presentation|spreadsheets).*?\/d\/([^\/\?]+)/);
    if (match && match[1] && match[2]) {
      const type = match[1];
      const id = match[2];
      const domain = type === 'file' ? 'drive.google.com' : 'docs.google.com';
      return `https://${domain}/${type}/d/${id}/preview`;
    }
    const folderMatch = url.match(/\/folders\/([^\/\?]+)/);
    if (folderMatch && folderMatch[1]) {
      return `https://drive.google.com/embeddedfolderview?id=${folderMatch[1]}#list`;
    }
    const idMatch = url.match(/id=([^&]+)/);
    if (idMatch && idMatch[1]) {
      return `https://drive.google.com/file/d/${idMatch[1]}/preview`;
    }
  }
  
  let embedUrl = url;
  
  if (url.includes("youtube.com/watch")) {
    try {
      const urlObj = new URL(url);
      const videoId = urlObj.searchParams.get("v");
      if (videoId) {
        embedUrl = `https://www.youtube.com/embed/${videoId}`;
      }
    } catch (e) {}
  } else if (url.includes("youtu.be/")) {
    const parts = url.split("youtu.be/");
    if (parts.length > 1) {
      const videoId = parts[1].split(/[?#]/)[0];
      if (videoId) {
        embedUrl = `https://www.youtube.com/embed/${videoId}`;
      }
    }
  } else if (url.includes("youtube.com/shorts/")) {
    const parts = url.split("youtube.com/shorts/");
    if (parts.length > 1) {
      const videoId = parts[1].split(/[?#]/)[0];
      if (videoId) {
        embedUrl = `https://www.youtube.com/embed/${videoId}`;
      }
    }
  }
  
  if (embedUrl.includes("youtube.com/embed/")) {
    try {
      const urlObj = new URL(embedUrl);
      urlObj.searchParams.set("playsinline", "1");
      urlObj.searchParams.set("rel", "0");
      return urlObj.toString();
    } catch (e) {
      const separator = embedUrl.includes("?") ? "&" : "?";
      return `${embedUrl}${separator}playsinline=1&rel=0`;
    }
  }
  
  return embedUrl;
}

export function getParsedNotes(notesUrl: string | null | undefined) {
  if (!notesUrl) return [];
  let cleanUrl = notesUrl.replace(/drive\.https:\/\//g, "https://");
  if (cleanUrl.startsWith("drive.google.com")) cleanUrl = "https://" + cleanUrl;
  
  try {
    const parsed = JSON.parse(cleanUrl);
    if (Array.isArray(parsed)) return parsed.map((p: any) => ({ ...p, url: p.url.replace(/drive\.https:\/\//g, "https://") }));
    return [{ title: "Notes Document", url: cleanUrl }];
  } catch(e) {
    return [{ title: "Notes Document", url: cleanUrl }];
  }
}

export function getExternalEmbedUrl(url: string | null | undefined): string | null {
  if (!url) return null;
  
  let cleanUrl = url.replace(/drive\.https:\/\//g, "https://");
  if (cleanUrl.startsWith("drive.google.com") || cleanUrl.startsWith("docs.google.com")) {
    cleanUrl = "https://" + cleanUrl;
  }
  
  if (cleanUrl.includes("drive.google.com") || cleanUrl.includes("docs.google.com")) {
    const match = cleanUrl.match(/(file|document|presentation|spreadsheets).*?\/d\/([^\/\?]+)/);
    if (match && match[1] && match[2]) {
      const type = match[1];
      const id = match[2];
      const domain = type === 'file' ? 'drive.google.com' : 'docs.google.com';
      return `https://${domain}/${type}/d/${id}/preview`;
    }
    const folderMatch = cleanUrl.match(/\/folders\/([^\/\?]+)/);
    if (folderMatch && folderMatch[1]) {
      return `https://drive.google.com/embeddedfolderview?id=${folderMatch[1]}#list`;
    }
    const idMatch = cleanUrl.match(/id=([^&]+)/);
    if (idMatch && idMatch[1]) {
      return `https://drive.google.com/file/d/${idMatch[1]}/preview`;
    }
  }
  return cleanUrl;
}

export function getGoogleDriveFileId(url: string | null | undefined): string | null {
  if (!url) return null;
  if (url.includes("/file/d/")) {
    const match = url.match(/\/file\/d\/([^\/\?]+)/);
    if (match && match[1]) return match[1];
  }
  if (url.includes("id=")) {
    const match = url.match(/id=([^&]+)/);
    if (match && match[1]) return match[1];
  }
  return null;
}
