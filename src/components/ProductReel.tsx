"use client";

import { TQueryValidator } from "@/lib/validators/query-validator";
import { Product } from "@/payload-types";
import { trpc } from "@/trpc/client";
import Link from "next/link";
import ProductListing from "./ProductListing";

// Default limit for fetching products in case the query limit is not specified
const FALLBACK_LIMIT = 4;

// Props interface for the ProductReel component
interface ProductReelProps {
  title: string;
  subtitle?: string;
  href?: string;
  query: TQueryValidator;
}

// ProductReel component
const ProductReel = (props: ProductReelProps) => {
  const { title, subtitle, href, query } = props;

  // Fetching products using trpc.getInfiniteProducts hook
  const { data: queryResults, isLoading } =
    trpc.getInfiniteProducts.useInfiniteQuery(
      {
        limit: query.limit ?? FALLBACK_LIMIT,
        query,
      },
      {
        getNextPageParam: (lastPage) => lastPage.nextPage,
      }
    );

  // Flattening the pages and extracting items from the query results
  const products = queryResults?.pages.flatMap((page) => page.items);

  // Creating an array to map through based on the query results and loading status
  let map: (Product | null)[] = [];
  if (products && products.length) {
    map = products;
  } else if (isLoading) {
    map = new Array<null>(query.limit ?? FALLBACK_LIMIT).fill(null);
  }

  // Rendering the ProductReel section with product listings
  return (
    <section className="py-12">
      <div className="md:flex md:items-center md:justify-between mb-4">
        <div className="max-w-2xl px-4 lg:max-w-4xl lg:px-0">
          {/* Rendering the title if provided */}
          {title ? (
            <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
              {title}
            </h1>
          ) : null}
          {/* Rendering the subtitle if provided */}
          {subtitle ? (
            <p className="mt-2 text-sm text-muted-foreground">{subtitle}</p>
          ) : null}
        </div>

        {/* Rendering the collection link if provided */}
        {href ? (
          <Link
            href={href}
            className="hidden text-sm font-medium text-blue-600 hover:text-blue-500 md:block"
          >
            Shop the collection <span aria-hidden="true">&rarr;</span>
          </Link>
        ) : null}
      </div>

      <div className="relative">
        <div className="mt-6 flex items-center w-full">
          {/* Rendering the grid of product listings */}
          <div className="w-full grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 md:grid-cols-4 md:gap-y-10 lg:gap-x-8">
            {map.map((product, i) => (
              <ProductListing
                key={`product-${i}`}
                product={product}
                index={i}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductReel;
