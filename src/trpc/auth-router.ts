import { AuthCredentialsValidator } from "../lib/validators/account-credentials-validators";
import { publicProcedure, router } from "./trpc";
import { getPayloadClient } from "../get-payload";
import { TRPCError } from "@trpc/server";

export const authRouter = router({
  createPayloadUser: publicProcedure
    .input(AuthCredentialsValidator)
    .mutation(async ({ input }) => {
      const { email, password } = input;
      const payload = await getPayloadClient();

      // Check if user already exists
      const { docs: users } = await payload.find({
        collection: "users",
        where: {
          email: {
            equals: email,
          },
        },
      });

      // If user already exists, throw a conflict error
      if (users.length !== 0) {
        throw new TRPCError({ code: "CONFLICT" });
      }

      // Create a new user in the "users" collection
      await payload.create({
        collection: "users",
        data: {
          email,
          password,
          role: "user",
        },
      });

      // Return success response
      return { success: true, sentToEmail: email };
    }),
});

// createPayloadUser: A mutation procedure within the authentication router for creating a new user.
// It is configured with publicProcedure.input(AuthCredentialsValidator) to validate the input against the AuthCredentialsValidator schema.
// The procedure is a mutation, as indicated by the .mutation function call.
// The procedure takes an asynchronous function as its handler, which receives an object with the input data.
