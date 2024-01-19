import { User } from "../payload-types";
import { ReadonlyRequestCookies } from "next/dist/server/web/spec-extension/adapters/request-cookies";
import { NextRequest } from "next/server";

// Function to fetch user information from the server using the provided cookies
export const getServerSideUser = async (
  cookies: NextRequest["cookies"] | ReadonlyRequestCookies
) => {
  // Extract the JWT token from cookies
  const token = cookies.get("payload-token")?.value;

  // Fetch user information from the server's /api/users/me endpoint
  const meRes = await fetch(
    `${process.env.NEXT_PUBLIC_SERVER_URL}/api/users/me`,
    {
      headers: { Authorization: `JWT ${token}` }, // Include JWT token in the Authorization header
    }
  );

  // Parse the response and extract the user information
  const { user } = (await meRes.json()) as { user: User | null };

  // Return the user information
  return { user };
};

// This function is responsible for fetching user information from the server
// by making a request to the /api/users/me endpoint.
// It takes cookies as input, extracts the JWT token from the cookies, includes the token in the request headers,
// and fetches the user information. The function then returns an object containing the user information.
