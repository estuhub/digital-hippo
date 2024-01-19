// :::: Defining an API Route ::::

import { authRouter } from "./auth-router";
import { router } from "./trpc";

// This code defines a new router called appRouter using the router instance obtained from the TRPC context.
export const appRouter = router({
  // Includes the authentication router (authRouter) as a sub-router named auth.
  auth: authRouter,
});

// This line exports a type named appRouter that is the same as the type of the appRouter constant.
// This can be useful for ensuring type safety when using the appRouter elsewhere in your application.
export type appRouter = typeof appRouter;
