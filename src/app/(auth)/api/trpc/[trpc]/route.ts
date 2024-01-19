// :::: Request Handler Configuration ::::

import { appRouter } from "@/trpc";
import { fetchRequestHandler } from "@trpc/server/adapters/fetch";

// Function that serves as the request handler for TRPC requests. The function takes a Request object as a parameter.
const handler = (req: Request) => {
  // Provide the necessary configuration
  fetchRequestHandler({
    // Specifies the endpoint for the TRPC requests ("/api/trpc").
    endpoint: "/api/trpc",
    // The Request object representing the incoming HTTP request.
    req,
    // The TRPC router instance (appRouter) used to handle the requests.
    router: appRouter,
    // A function that creates the context for handling the request.
    // In this case, it's a simple function that returns an empty object (() => ({})), but you may customize it to provide additional context for your TRPC procedures.
    // @ts-expect-error context already passed from express middleware
    createContext: () => ({}),
  });
};

// Handle both GET and POST requests for the specified TRPC endpoint ("/api/trpc").
export { handler as GET, handler as POST };
