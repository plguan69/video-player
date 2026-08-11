import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ fileId: string }> }
) {
  const { fileId } = await params;
  const searchParams = request.nextUrl.searchParams;
  const fallbackUrl = searchParams.get("fallbackUrl");

  if (!fileId) {
    return NextResponse.json({ error: "Missing fileId parameter" }, { status: 400 });
  }

  // Get range request header if browser is asking for seeking
  const rangeHeader = request.headers.get("range");

  try {
    // 1. Try to fetch from Google Drive export download link
    const driveUrl = `https://drive.google.com/uc?export=download&id=${fileId}`;
    
    const requestHeaders: Record<string, string> = {
      "User-Agent":
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    };

    if (rangeHeader) {
      requestHeaders["Range"] = rangeHeader;
    }

    let response = await fetch(driveUrl, {
      method: "GET",
      headers: requestHeaders,
      redirect: "follow",
    });

    // Check if Google Drive asks for confirmation code (large files)
    const contentType = response.headers.get("content-type") || "";

    if (contentType.includes("text/html") && !response.headers.get("content-disposition")) {
      const htmlText = await response.clone().text();
      // Extract confirmation code if present
      const confirmMatch = htmlText.match(/confirm=([a-zA-Z0-9_-]+)/);
      if (confirmMatch && confirmMatch[1]) {
        const confirmUrl = `https://drive.google.com/uc?export=download&confirm=${confirmMatch[1]}&id=${fileId}`;
        response = await fetch(confirmUrl, {
          method: "GET",
          headers: requestHeaders,
          redirect: "follow",
        });
      }
    }

    const finalContentType = response.headers.get("content-type") || "";

    // If Google Drive returns actual media stream (video/...)
    if (response.ok && (finalContentType.includes("video") || finalContentType.includes("application/octet-stream") || response.headers.get("content-disposition"))) {
      const headers = new Headers();
      headers.set("Content-Type", finalContentType.includes("video") ? finalContentType : "video/mp4");
      headers.set("Accept-Ranges", "bytes");
      headers.set("Access-Control-Allow-Origin", "*");

      if (response.headers.get("content-length")) {
        headers.set("Content-Length", response.headers.get("content-length")!);
      }
      if (response.headers.get("content-range")) {
        headers.set("Content-Range", response.headers.get("content-range")!);
      }

      return new NextResponse(response.body, {
        status: response.status === 206 ? 206 : 200,
        headers,
      });
    }

    // 2. If Google Drive stream fails or requires auth, fallback to specified fallbackUrl if available
    if (fallbackUrl) {
      const fallbackResponse = await fetch(fallbackUrl, {
        headers: rangeHeader ? { Range: rangeHeader } : {},
      });

      if (fallbackResponse.ok) {
        const headers = new Headers();
        headers.set("Content-Type", fallbackResponse.headers.get("content-type") || "video/mp4");
        headers.set("Accept-Ranges", "bytes");
        headers.set("Access-Control-Allow-Origin", "*");

        if (fallbackResponse.headers.get("content-length")) {
          headers.set("Content-Length", fallbackResponse.headers.get("content-length")!);
        }
        if (fallbackResponse.headers.get("content-range")) {
          headers.set("Content-Range", fallbackResponse.headers.get("content-range")!);
        }

        return new NextResponse(fallbackResponse.body, {
          status: fallbackResponse.status === 206 ? 206 : 200,
          headers,
        });
      }
    }

    return NextResponse.json(
      { error: "Could not stream video from Google Drive. Ensure the file is shared as 'Anyone with the link can view'." },
      { status: 502 }
    );
  } catch (err: unknown) {
    console.error("Error streaming video from Google Drive:", err);
    if (fallbackUrl) {
      return NextResponse.redirect(fallbackUrl);
    }
    return NextResponse.json({ error: "Stream error occurred" }, { status: 500 });
  }
}
