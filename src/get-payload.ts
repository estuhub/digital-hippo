import dotenv from "dotenv";
import path from "path";
import payload, { Payload } from "payload";
import type { InitOptions } from "payload/config";
import nodemailer from "nodemailer";

dotenv.config({
  path: path.resolve(__dirname, "../.env"),
});

// Nodemailer Setup
// A Nodemailer transporter configured to send emails.
// This is used in the Payload CMS initialization options for handling email-related functionality.
const transporter = nodemailer.createTransport({
  host: "smtp.resend.com",
  secure: true,
  port: 465,
  auth: {
    user: "resend",
    pass: process.env.RESEND_API_KEY,
  },
});

// Global Cache Initialization
// Initializes a global cache (cached) using the global object (global).
// This cache is used to store a singleton instance of the Payload CMS client and a promise for initializing it.
let cached = (global as any).payload;

if (!cached) {
  cached = (global as any).payload = {
    client: null,
    promise: null,
  };
}

// Interface and Argument Definition
// Defines an interface Args with an optional property initOptions,
// which represents partial initialization options for the Payload CMS client.
interface Args {
  initOptions?: Partial<InitOptions>;
}

// Exports an asynchronous function getPayloadClient that returns a Promise of a Payload CMS client.
// Accepts an object with optional initialization options (initOptions).
export const getPayloadClient = async ({
  initOptions,
}: Args = {}): Promise<Payload> => {
  // Check for PAYLOAD_SECRET
  // Throws an error if the PAYLOAD_SECRET environment variable is missing.
  // The PAYLOAD_SECRET is crucial for initializing the Payload CMS client securely.
  if (!process.env.PAYLOAD_SECRET) {
    throw new Error("PAYLOAD_SECRET is missing");
  }

  // Check Cached Client
  // If a client is already cached, returns the cached client to ensure a singleton instance.
  if (cached.client) {
    return cached.client;
  }

  // Initialize Payload CMS
  // If there is no cached promise, initializes the Payload CMS using payload.init.
  // Configures the initialization with the secret from the environment variable and additional options such as whether it is running locally (local).
  if (!cached.promise) {
    cached.promise = payload.init({
      email: {
        transport: transporter,
        fromAddress: "onboarding@resend.dev", // TODO: change to a custom domain
        fromName: "DigitalHippo",
      },
      secret: process.env.PAYLOAD_SECRET!,
      local: initOptions?.express ? false : true,
      ...(initOptions || {}),
    });
  }

  // Await Initialization Promise
  // Attempts to await the initialization promise and stores the resulting client in the cache.
  // If an error occurs during initialization, resets the promise in the cache and rethrows the error.
  try {
    cached.client = await cached.promise;
  } catch (error: unknown) {
    cached.promise = null;
    throw error;
  }

  // Return Cached Client
  // Returns the initialized or cached Payload CMS client
  return cached.client;
};

// This utility ensures that only one instance of the Payload CMS client is created
// and reused across the application, providing efficient and consistent access to the CMS functionality.
// The caching mechanism helps avoid redundant initialization and promotes the use of a shared client instance.
