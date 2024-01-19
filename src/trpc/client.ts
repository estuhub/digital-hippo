// :::: Client-side Configuration ::::

import { createTRPCReact } from "@trpc/react-query";
import { appRouter } from "./index";

// This line initializes a TRPC client for a React application using the createTRPCReact function.
// It takes the appRouter type as a generic parameter.
// The {} inside the function call is an empty object, which could be used to pass configuration options to the TRPC client, although in this case, none seem to be provided.
export const trpc = createTRPCReact<appRouter>({});

// The trpc constant is then exported for use in the React components of your application.
// This client can be used to interact with the TRPC server and make requests to the defined API routes.
