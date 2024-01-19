// :::: Defining an API Route ::::

import { publicProcedure, router } from "./trpc";

// This code defines a new router called appRouter using the router instance obtained from the TRPC context.
// It has a single API route named anyApiRoute, which uses the publicProcedure.query method to define a query endpoint.
// In this case, the query simply returns the string "Hello".
export const appRouter = router({
  anyApiRoute: publicProcedure.query(() => {
    return "Hello";
  }),
});

// This line exports a type named appRouter that is the same as the type of the appRouter constant.
// This can be useful for ensuring type safety when using the appRouter elsewhere in your application.
export type appRouter = typeof appRouter;
