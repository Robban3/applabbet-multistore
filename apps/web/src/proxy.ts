import { NextResponse, type NextRequest } from "next/server";

function normalizeHost(value: string): string {
  const host = value.split(":")[0]?.trim().toLowerCase() || "localhost";
  return host.startsWith("www.") ? host.slice(4) : host;
}

export function proxy(request: NextRequest) {
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-tenant-host", normalizeHost(request.headers.get("host") || "localhost"));

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
