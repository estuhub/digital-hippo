// :::: Server-side Configuration ::::

import { ExpressContext } from "@/server";
import { initTRPC } from "@trpc/server";

// This line initializes a TRPC context using initTRPC.context() and then creates a TRPC instance using .create().
// The resulting instance is assigned to the variable t.
const t = initTRPC.context<ExpressContext>().create();

// Exports the TRPC router from the context, which is responsible for handling the defined procedures and routes.
export const router = t.router;

// Exports a reference to a public procedure (public endpoint).
// Specific procedure that is intended to be accessible publicly.
export const publicProcedure = t.procedure;
