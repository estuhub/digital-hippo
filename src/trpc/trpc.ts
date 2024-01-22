// :::: Server-side Configuration ::::

import { User } from "@/payload-types";
import { ExpressContext } from "@/server";
import { TRPCError, initTRPC } from "@trpc/server";
import { PayloadRequest } from "payload/types";

// This line initializes a TRPC context using initTRPC.context() and then creates a TRPC instance using .create().
// The resulting instance is assigned to the variable t.
const t = initTRPC.context<ExpressContext>().create();

// Extracting middleware and isAuth function from the TRPC instance
const middleware = t.middleware;
const isAuth = middleware(async ({ ctx, next }) => {
  // Extracting the 'user' from the request
  const req = ctx.req as PayloadRequest;
  const { user } = req as { user: User | null };

  // Checking if a user is not present or lacks a valid ID, throwing an UNAUTHORIZED error
  if (!user || !user.id) throw new TRPCError({ code: "UNAUTHORIZED" });

  // Continuing to the next middleware with the user information in the context
  return next({
    ctx: { user },
  });
});

// Exports the TRPC router from the context, which is responsible for handling the defined procedures and routes.
export const router = t.router;

// Exports a reference to a public procedure (public endpoint).
// Specific procedure that is intended to be accessible publicly.
export const publicProcedure = t.procedure;

// Exporting a reference to a private procedure (private endpoint)
// A specific procedure that requires authentication, using the 'isAuth' middleware
export const privateProcedure = t.procedure.use(isAuth);
