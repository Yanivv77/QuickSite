import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET(request: NextRequest) {
  // Dump all the request headers and cookies
  const headers = Object.fromEntries(request.headers.entries());
  const allCookies = (await cookies()).getAll();

  console.log("headers", headers);
  console.log("cookies", allCookies);

  const responseObj = {
    headers,
    cookies: allCookies,
  };

  return NextResponse.json(responseObj);
}
