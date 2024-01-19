"use client";

// :::: React Context Providers ::::

import { PropsWithChildren, useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { httpBatchLink } from "@trpc/client";
import { trpc } from "@/trpc/client";

// The Providers component is a functional component that takes children as props (PropsWithChildren) and wraps them with TRPC and React Query providers.
const Providers = ({ children }: PropsWithChildren) => {
  // It initializes a queryClient using useState, creating a new instance of QueryClient.
  const [queryClient] = useState(() => new QueryClient());
  // It initializes a trpcClient using useState, creating a new instance of the TRPC client with a batch link for HTTP requests.
  // The process.env.NEXT_PUBLIC_SERVER_URL is used to dynamically set the server URL.
  const [trpcClient] = useState(() =>
    trpc.createClient({
      links: [
        httpBatchLink({
          url: `${process.env.NEXT_PUBLIC_SERVER_URL}/api/trpc`,
          fetch(url, options) {
            return fetch(url, { ...options, credentials: "include" });
          },
        }),
      ],
    })
  );
  // The component returns a JSX structure that wraps the children with the TRPC provider (trpc.Provider) and the React Query provider (QueryClientProvider).
  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </trpc.Provider>
  );
};

export default Providers;
