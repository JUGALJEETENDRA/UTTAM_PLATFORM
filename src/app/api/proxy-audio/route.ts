import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const id = req.nextUrl.searchParams.get("id");
  if (!id) {
    return new NextResponse("Missing id", { status: 400 });
  }

  const range = req.headers.get("range");
  
  // The Google Drive download URL
  const driveUrl = `https://drive.google.com/uc?export=download&id=${id}`;

  const fetchHeaders: Record<string, string> = {};
  if (range) {
    fetchHeaders["Range"] = range;
  }

  try {
    const response = await fetch(driveUrl, {
      headers: fetchHeaders,
      redirect: "follow",
    });

    if (!response.ok) {
      return new NextResponse(`Drive returned ${response.status}`, { status: response.status });
    }

    const resHeaders = new Headers();
    
    // Copy necessary headers for streaming
    const headersToCopy = [
      "content-type",
      "content-length",
      "content-range",
      "accept-ranges",
      "cache-control",
      "etag",
      "last-modified"
    ];

    headersToCopy.forEach(h => {
      const val = response.headers.get(h);
      if (val) {
        resHeaders.set(h, val);
      }
    });

    // Ensure Safari knows it accepts ranges
    if (!resHeaders.has("accept-ranges")) {
      resHeaders.set("accept-ranges", "bytes");
    }
    
    // Fallback content-type if not provided
    if (!resHeaders.has("content-type")) {
      resHeaders.set("content-type", "audio/mpeg");
    }

    return new NextResponse(response.body, {
      status: response.status,
      headers: resHeaders,
    });
  } catch (error) {
    console.error("Proxy error:", error);
    return new NextResponse("Error proxying request", { status: 500 });
  }
}
