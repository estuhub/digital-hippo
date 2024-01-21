// :::: Defining an API Route ::::

import { z } from "zod";
import { authRouter } from "./auth-router";
import { publicProcedure, router } from "./trpc";
import { query } from "express";
import { QueryValidator } from "../lib/validators/query-validator";
import { getPayloadClient } from "../get-payload";

// This code defines a new router called appRouter using the router instance obtained from the TRPC context.
export const appRouter = router({
  // Includes the authentication router (authRouter) as a sub-router named auth.
  auth: authRouter,
  // Defining a public procedure named getInfiniteProducts for fetching products in an infinite scroll manner
  getInfiniteProducts: publicProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(100), // Specifies how many products to fetch in a single request (limits to a range of 1 to 100)
        cursor: z.number().nullish(), // Last element rendered; if user scrolls to get more products, it starts fetching the next page using this cursor
        query: QueryValidator, // Custom validator for the query, ensuring only allowed options can be passed
      })
    )
    .query(async ({ input }) => {
      // Extracting input values from the query
      const { query, cursor } = input;
      const { sort, limit, ...queryOpts } = query;

      // Obtaining a Payload CMS client
      const payload = await getPayloadClient();

      // Converting the query options into a format suitable for Payload's find method
      const parsedQueryOpts: Record<string, { equals: string }> = {};

      Object.entries(queryOpts).forEach(([key, value]) => {
        parsedQueryOpts[key] = {
          equals: value,
        };
      });

      // Determining the page number for fetching products
      const page = cursor || 1;

      // Fetching products from the "products" collection based on specified criteria
      const {
        docs: items,
        hasNextPage,
        nextPage,
      } = await payload.find({
        collection: "products",
        where: {
          approvedForSale: {
            equals: "approved",
          },
          ...parsedQueryOpts,
        },
        sort,
        depth: 1,
        limit,
        page,
      });

      // Returning the fetched items and information for infinite scroll
      return {
        items,
        nextPage: hasNextPage ? nextPage : null,
      };
    }),
});

// This line exports a type named appRouter that is the same as the type of the appRouter constant.
// This can be useful for ensuring type safety when using the appRouter elsewhere in your application.
export type appRouter = typeof appRouter;
