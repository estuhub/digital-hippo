// Import necessary modules from next/server and the payload-utils file
import { NextRequest, NextResponse } from "next/server";
import { getServerSideUser } from "./lib/payload-utils";

// Middleware function for controlling access based on user authentication
export async function middleware(req: NextRequest) {
  // Extract nextUrl and cookies from the request
  const { nextUrl, cookies } = req;

  // Retrieve user information based on cookies using getServerSideUser utility
  //   Retrieve the currently logged in user
  const { user } = await getServerSideUser(cookies);

  // Check if a user is authenticated and if the current path is /sign-in or /sign-up
  if (user && ["/sign-in", "/sign-up"].includes(nextUrl.pathname)) {
    // Redirect authenticated users attempting to access sign-in or sign-up pages to the root URL
    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_SERVER_URL}/`);
  }

  // If conditions for redirection are not met, allow the request to continue to the next step
  return NextResponse.next();
}
