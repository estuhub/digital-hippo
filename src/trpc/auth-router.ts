import { AuthCredentialsValidator } from "../lib/validators/account-credentials-validators";
import { publicProcedure, router } from "./trpc";
import { getPayloadClient } from "../get-payload";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import payload from "payload";

// Define the authentication router using TRPC's router function
export const authRouter = router({
  // Procedure for creating a new user
  createPayloadUser: publicProcedure
    .input(AuthCredentialsValidator) // Input validation using Zod schema
    .mutation(async ({ input }) => {
      // Extract email and password from the input object
      const { email, password } = input;

      // Obtain a Payload CMS client
      const payload = await getPayloadClient();

      // Check if the user already exists in the "users" collection
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

  // Procedure for verifying the email address using a token
  verifyEmail: publicProcedure
    .input(z.object({ token: z.string() })) // Input validation using Zod schema
    .query(async ({ input }) => {
      // Extract the token from the input object
      const { token } = input;

      // Obtain a Payload CMS client
      const payload = await getPayloadClient();

      // Verify the email using the Payload CMS verifyEmail method
      const isVerified = await payload.verifyEmail({
        collection: "users", // Specify the collection (e.g., "users")
        token, // Provide the verification token
      });

      // If email verification fails, throw an unauthorized error
      if (!isVerified) throw new TRPCError({ code: "UNAUTHORIZED" });

      // If email verification is successful, return a success response
      return { success: true };
    }),

  // Procedure for user sign-in
  signIn: publicProcedure
    .input(AuthCredentialsValidator) // Input validation using Zod schema
    .mutation(async ({ input, ctx }) => {
      // Extract email and password from the input object and response object from context
      const { email, password } = input;
      const { res } = ctx;

      try {
        // Attempt to login the user using Payload's login method
        await payload.login({
          collection: "users",
          data: {
            email,
            password,
          },
          res,
        });

        // If login is successful, return a success response
        return { success: true };
      } catch (error) {
        // If login fails, throw an unauthorized error
        throw new TRPCError({ code: "UNAUTHORIZED" });
      }
    }),
});

// createPayloadUser: A mutation procedure within the authentication router for creating a new user.
// It is configured with publicProcedure.input(AuthCredentialsValidator) to validate the input against the AuthCredentialsValidator schema.
// The procedure is a mutation, as indicated by the .mutation function call.
// The procedure takes an asynchronous function as its handler, which receives an object with the input data.

// verifyEmail: The asynchronous function receives an object with the input data (token).
// It uses the payload.verifyEmail method to verify the email by checking the provided token against the "users" collection.
// If the verification fails, it throws a TRPCError with the code "UNAUTHORIZED."
// If the verification is successful, it returns a success response.
