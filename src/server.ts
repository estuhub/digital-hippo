import express from "express";
import { getPayloadClient } from "./get-payload";
import { nextApp, nextHandler } from "./next-utils";
import * as trpcExpress from "@trpc/server/adapters/express"; // TRPC Express adapter for integrating TRPC with Express.
import { appRouter } from "./trpc"; // The TRPC router instance defined in the trpc.ts file.
import { inferAsyncReturnType } from "@trpc/server";
import bodyParser from "body-parser";
import { IncomingMessage } from "http";
import { stripeWebhookHandler } from "./webhooks";
import nextBuild from "next/dist/build";
import path from "path";
import { PayloadRequest } from "payload/types";
import { parse } from "url";

// Express App Initialization
// Initializes an Express app and sets the port for the server to either the value specified in the environment variable PORT or the default value 3000.
const app = express();
const PORT = Number(process.env.PORT) || 3000;

// Defines a function named createContext that takes an options object with req and res and returns a context object with the same properties.
// This function is used to create the context for handling TRPC requests.
const createContext = ({
  req,
  res,
}: trpcExpress.CreateExpressContextOptions) => ({
  req,
  res,
});

export type ExpressContext = inferAsyncReturnType<typeof createContext>;

// Defines an asynchronous function named start that contains the main logic for starting the server.
export type WebhookRequest = IncomingMessage & {
  rawBody: Buffer;
};

const start = async () => {
  // Initialize Payload Client
  // Calls the getPayloadClient function to initialize a client (CMS) with specific options.
  const webhookMiddleware = bodyParser.json({
    verify: (req: WebhookRequest, _, buffer) => {
      req.rawBody = buffer;
    },
  });

  app.post("/api/webhooks/stripe", webhookMiddleware, stripeWebhookHandler);

  const payload = await getPayloadClient({
    initOptions: {
      // Configures the client to use Express (express: app) and logs information on initialization.
      express: app,
      onInit: async (cms) => {
        cms.logger.info(`Admin URL ${cms.getAdminURL()}`);
      },
    },
  });

  // TRPC Middleware
  // Uses the TRPC Express middleware to handle requests to the "/api/trpc" endpoint.
  // Configures the middleware with the TRPC router (appRouter) and the custom context creation function (createContext).
  if (process.env.NEXT_BUILD) {
    app.listen(PORT, async () => {
      payload.logger.info("Next.js is building for production");

      // @ts-expect-error
      await nextBuild(path.join(__dirname, "../"));

      process.exit();
    });

    return;
  }

  const cartRouter = express.Router();

  cartRouter.use(payload.authenticate);

  cartRouter.get("/", (req, res) => {
    const request = req as PayloadRequest;

    if (!request.user) return res.redirect("/sign-in?origin=cart");

    const parsedUrl = parse(req.url, true);
    const { query } = parsedUrl;

    return nextApp.render(req, res, "/cart", query);
  });

  app.use("/cart", cartRouter);
  app.use(
    "/api/trpc",
    trpcExpress.createExpressMiddleware({
      router: appRouter,
      createContext,
    })
  );

  // Next.js Middleware (Self-hosting)
  // Configures a middleware for handling Next.js requests, allowing self-hosting of Next.js pages.
  app.use((req, res) => nextHandler(req, res));

  // Next.js Initialization and Server Start
  // Calls nextApp.prepare() to initialize Next.js.
  nextApp.prepare().then(() => {
    payload.logger.info("Next.js started");

    // After initialization, starts the Express server to listen on the specified port.
    app.listen(PORT, async () => {
      payload.logger.info(
        `Next.js App URL: ${process.env.NEXT_PUBLIC_SERVER_URL}`
      );
    });
  });
};

start();

// This file sets up an Express server that handles TRPC requests at the "/api/trpc" endpoint,
// serves Next.js pages, and initializes an external client (CMS) using the getPayloadClient utility.
// The integration of TRPC, Next.js, and the external client demonstrates a combination of server-side and client-side rendering for your application.
